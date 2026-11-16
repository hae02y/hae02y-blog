---
slug: dns-domain-records-authoritative-server
title: "도메인을 연결한다는 건 무슨 뜻일까? DNS 레코드부터 권한 서버 구축까지"
description: 도메인 등록·위임·재귀 조회를 구분하고 Cloudflare, Route 53, BIND의 설정과 DNSSEC·TLS의 보안 경계를 실습으로 따라간다.
authors:
  - haeyoung
tags:
  - Network
  - DNS
  - Cloudflare
  - Security
  - Infrastructure
---

웹을 배포한 다음 도메인을 연결할 때, 관리 화면은 보통 A나 CNAME 값을 넣으라고 안내한다. 값을 넣었는데도 이전 서버가 열리면 문제가 갑자기 어려워진다. 도메인을 산 곳과 DNS를 수정한 곳이 다를 수도 있고, 권한 서버에는 새 값이 있는데 내 리졸버에 이전 값이 남아 있을 수도 있다.

이 글에서는 이름을 찾는 흐름을 분리한 다음 직접 작은 권한 DNS를 띄운다. **실습은 동작을 이해하기 위한 재현용 구성이다. 이 블로그가 BIND로 DNS를 직접 운영한다는 뜻은 아니다.** `example.com`, `example.test`, `192.0.2.0/24`, `2001:db8::/32`는 설명용 이름과 주소이므로 공개 서비스 설정에는 소유한 도메인과 실제 주소를 사용해야 한다.

HTTPS 연결은 DNS 조회 다음에 이어진다. 인증서와 Nginx 구성은 별도 글인 [SSL/TLS·인증서 체인·갱신 실습](/blog/https-tls-certificates/)에서 다룬다.

## 1. 도메인 구매, DNS 호스팅, 웹 호스팅은 서로 다른 일이다

| 역할 | 관리하는 것 | 실제로 하는 작업 |
| --- | --- | --- |
| 레지스트리 | `.com` 같은 최상위 도메인의 등록 체계 | 상위 영역의 위임 정보 관리 |
| 등록업체·registrar | 사용자의 도메인 등록 계약 | 갱신, 등록 잠금, 네임서버·DS 등록 |
| 권한 DNS·authoritative DNS | 특정 영역의 원본 레코드 | `www.example.com`의 A·CNAME 등 응답 |
| 재귀 리졸버·recursive resolver | 사용자를 대신한 조회와 캐시 | 필요한 권한 서버를 찾아 결과 반환 |
| 웹 호스팅·CDN | HTTP 요청을 처리할 서비스 | 콘텐츠 응답, 라우팅, TLS 종료 |

한 업체가 여러 역할을 제공할 수 있지만 설정의 책임은 별개다. 도메인을 A 업체에서 사고, 네임서버는 Cloudflare로 지정하고, 웹사이트는 다른 호스팅에 배포할 수 있다. 이때 등록업체의 예전 DNS 화면에서 A 레코드를 수정해도 인터넷 조회에는 반영되지 않을 수 있다. **상위 영역이 어느 네임서버에 위임했는지부터 확인해야 한다.** 용어의 기준은 [IETF DNS Terminology](https://datatracker.ietf.org/doc/html/rfc9499)에서 확인할 수 있다.

`https://www.example.com:443/posts?id=1` 전체가 DNS에 전달되는 것은 아니다. DNS의 이름은 `www.example.com`이고, 경로와 쿼리 문자열은 HTTP가 다룬다. A 레코드에 `https://`나 `/posts`를 넣을 수 없는 이유다. DNS만으로 `www`를 루트 도메인으로 HTTP 리다이렉트할 수도 없다. 리다이렉트는 웹 서버나 CDN에서 상태 코드와 Location 헤더로 처리한다.

## 2. 브라우저가 이름을 찾는 흐름

```text
브라우저·운영체제 캐시
  └─ 재귀 리졸버에 www.example.com A 질문
       ├─ 유효한 캐시가 있으면 답변
       └─ 캐시가 없으면 위임을 따라 탐색
            루트 → .com 권한 서버 → example.com 권한 서버
                                        └─ A 또는 CNAME 응답
  └─ 얻은 주소로 연결 → TLS 검증 → HTTP 요청
```

캐시가 있는 리졸버는 매번 루트부터 다시 시작하지 않는다. CNAME을 받으면 최종 주소를 얻기 위한 추가 조회가 필요할 수 있다. 브라우저가 보안 DNS를 사용하면 운영체제에 지정한 리졸버와 다른 곳에 질문할 수도 있다.

도메인과 영역(zone)도 구분한다. `example.com` 아래의 이름을 같은 영역에서 관리할 수 있지만, `team.example.com`을 NS로 위임하면 별도 영역이 된다. 부모 영역에는 위임 NS가 있고, 자식 영역에는 자신의 SOA와 NS, 실제 레코드가 있다.

## 3. 레코드는 이름·타입·TTL·값으로 읽는다

다음은 문법을 설명하는 예다. 모든 레코드를 한꺼번에 서비스에 복사하라는 목록은 아니다.

| 이름 | 타입 | 값 예시 | 의미 |
| --- | --- | --- | --- |
| `@` | A | `192.0.2.10` | 영역의 루트 이름 → IPv4 |
| `@` | AAAA | `2001:db8::10` | 루트 이름 → IPv6 |
| `www` | CNAME | `example.com.` | 다른 이름의 별칭 |
| `@` | MX | `10 mail.example.com.` | 메일 수신 서버, 작은 우선순위 먼저 |
| `@` | TXT | `"verification=sample"` | 서비스 확인 등 텍스트 데이터 |
| `@` | NS | `ns1.example.com.` | 영역의 권한 네임서버 |
| `@` | SOA | primary·관리자·serial·시간 값 | 영역의 관리·동기화 정보 |
| `@` | CAA | `0 issue "letsencrypt.org"` | 인증서 발급을 허용할 CA 정책 |
| `_service._tcp` | SRV | `10 5 443 target.example.com.` | 특정 서비스의 우선순위·가중치·포트·대상 |

`@`는 zone 파일에서 현재 영역 이름을 뜻한다. 관리형 DNS의 이름 입력란에서는 `@`, 공란, 전체 도메인 중 무엇을 요구하는지 UI에 따라 다르다. zone 파일의 끝 점은 절대 이름 표시다. `mail.example.com.`의 마지막 점을 빠뜨리면 현재 영역 이름이 붙어 의도와 다른 이름이 될 수 있다.

일반적인 CNAME 이름에는 다른 데이터 레코드를 함께 두지 않는다. 영역 루트에는 SOA·NS가 필요하므로 표준 CNAME을 그대로 두는 방식이 맞지 않는다. Cloudflare의 flattening이나 Route 53의 Alias는 이런 요구를 해결하는 제공자 기능이며, 둘을 새로운 공통 DNS 레코드 타입으로 생각하면 안 된다. [Route 53 Alias 문서](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html).

AAAA는 IPv6 경로가 준비됐을 때만 추가한다. A가 맞더라도 AAAA가 오래된 서버를 가리키면 일부 사용자가 다른 인증서나 페이지를 받는다. TXT에는 공개 가능한 검증 문자열을 넣는다. API 토큰이나 비밀번호를 넣는 저장소가 아니다.

CAA는 CA의 발급 판단에 사용되는 정책이다. HTTPS 암호화나 기존 인증서의 폐기를 대신하지 않는다. CDN이나 호스팅이 사용하는 CA와 충돌하면 자동 발급·갱신이 실패할 수 있다. 위의 Let's Encrypt 예시는 해당 CA를 쓰는 경우의 예이며 모든 호스팅에 그대로 적용할 값은 아니다. [CAA 규격](https://datatracker.ietf.org/doc/html/rfc8659).

## 4. TTL과 “전파 대기”를 정확히 구분하기

권한 서버의 값을 수정했다고 모든 리졸버의 캐시를 지울 수 있는 것은 아니다. 이전 응답을 TTL 3600초로 받은 리졸버는 그 남은 시간 동안 이전 값을 사용할 수 있다. 지금 TTL을 60으로 바꿔도 이미 받아 간 3600초 응답을 소급해서 줄이지는 못한다.

서버 이전에서는 다음 순서를 쓴다.

1. 이전 TTL이 충분히 소진될 만큼 미리 TTL을 낮춘다.
2. 새 서버를 준비하고 DNS를 바꾸기 전에 Host·SNI를 맞춰 검증한다.
3. 권한 DNS의 A·AAAA 또는 CNAME을 변경한다.
4. 여러 리졸버와 실제 HTTP·TLS 응답을 확인한다.
5. 이전 서버를 일정 기간 함께 유지하고 안정화 후 TTL을 복구한다.

존재하지 않는 이름의 응답도 캐시된다. NXDOMAIN을 조회한 직후 레코드를 새로 만들었는데 계속 없다고 나오는 경우다. 부정 캐시의 TTL은 SOA의 TTL과 MINIMUM 값에 의해 정해진다. “A TTL을 낮췄으니 바로 생길 것”이라는 추측은 맞지 않을 수 있다. [RFC 2308](https://www.rfc-editor.org/rfc/rfc2308).

NS 위임과 DS 변경에는 각각의 캐시와 검증 상태가 추가된다. 그래서 모든 DNS 문제를 고정된 “24~48시간 대기”로 처리하지 말고, 어느 서버가 어떤 응답을 하는지 비교하는 편이 낫다.

## 5. Cloudflare·Route 53·등록업체 DNS 중 어디에서 설정할까

| 선택 | 직접 관리할 부분 | 구분해야 할 점 |
| --- | --- | --- |
| 등록업체의 DNS | 도메인 갱신과 레코드 | 구매만 했는지 실제 NS도 이곳인지 확인 |
| Cloudflare DNS | 영역·레코드·위임, 선택적 프록시 | DNS only와 Proxied가 트래픽 경로를 바꿈 |
| Amazon Route 53 | hosted zone·위임·레코드·라우팅 정책 | Alias 지원 대상과 public/private zone 구분 |
| 직접 운영하는 BIND | 서버·패치·영역·복제·감시 | 장애 대응과 공개 DNS 운영 책임까지 가짐 |

### Cloudflare에서 연결하는 흐름

1. 소유한 도메인을 추가하고 기존 레코드를 옮긴다. 자동 검색 결과만 믿지 말고 MX·TXT·DKIM·서브도메인을 대조한다.
2. Cloudflare가 지정한 네임서버를 등록업체의 NS 설정에 넣는다.
3. 상위 위임이 바뀐 것을 확인한 다음 활성 영역에서 레코드를 수정한다.
4. 웹 호스트의 도메인 등록·검증을 완료하고 프록시 여부를 결정한다.

DNS only이면 클라이언트가 원본 주소를 받아 직접 접속한다. Proxied이면 지원되는 웹 트래픽이 Cloudflare를 경유하고 조회에는 Cloudflare 주소가 보인다. MX나 TXT는 웹 프록시 대상이 아니다. 원본 IP를 넣었는데 `dig`에 다른 IP가 나온다는 이유만으로 오류라고 단정하지 않는다. [Cloudflare proxy status](https://developers.cloudflare.com/dns/proxy-status/).

프록시는 DNS 설정 한 칸 이상을 바꾼다. 접속자 IP 처리, 캐시, TLS 종료 위치도 달라진다. 원본 서버가 여전히 아무 주소에서나 접속 가능하면 CDN을 우회할 수 있으므로 원본 접근 제한은 별도 설계다.

### Route 53에서 연결하는 흐름

Public hosted zone을 생성한 후 그 영역에 할당된 NS를 등록업체에 위임한다. 같은 이름의 hosted zone을 여러 개 만들었다면 실제 위임된 영역을 수정해야 한다. AWS 자원 연결에 Alias를 쓰는 경우 지원 대상과 응답 타입을 확인한다. Route 53 자체를 선택했다고 HTTP 요청이 CDN을 경유하는 것은 아니다. CDN 경유는 CloudFront 같은 별도 서비스와 레코드 구성이 결정한다.

Private hosted zone은 연결된 VPC 등의 내부 이름 조회를 위한 구성이다. 공개 영역에서 잘 보인다는 검사와 내부에서 잘 보인다는 검사를 섞지 않는다. [Route 53 hosted zone 문서](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html).

## 6. BIND로 권한 DNS를 직접 띄우기

다음 실습은 Docker와 `dig`가 있는 환경에서 실행한다. 인터넷 전체에 공개하지 않고 **호스트의 127.0.0.1:1053**으로만 조회한다. 공개 리졸버를 만들지 않으며, 외부 도메인의 재귀 조회도 제공하지 않는다.

작업 폴더를 만든다.

```bash
mkdir -p dns-lab
cd dns-lab
```

`named.conf`를 다음 내용으로 저장한다.

```conf
options {
    directory "/tmp";
    listen-on port 53 { any; };
    listen-on-v6 { none; };
    recursion no;
    allow-query { any; };
    allow-query-cache { none; };
    allow-transfer { none; };
    pid-file "/tmp/named.pid";
};

controls {};

zone "example.test" {
    type primary;
    file "/etc/bind/db.example.test";
    allow-update { none; };
    notify no;
};
```

`db.example.test`를 만든다.

```dns
$ORIGIN example.test.
$TTL 300
@ IN SOA ns1.example.test. hostmaster.example.test. (
    2026111601 ; serial
    3600       ; refresh
    600        ; retry
    604800     ; expire
    300        ; negative cache TTL
)
@    IN NS    ns1.example.test.
ns1  IN A     192.0.2.53
@    IN A     192.0.2.10
www  IN CNAME example.test.
mail IN A     192.0.2.20
@    IN MX    10 mail.example.test.
@    IN TXT   "lab=authoritative-dns"
```

| 설정 | 실습에서의 의미 |
| --- | --- |
| `listen-on` | 컨테이너 내부에서 받을 주소·포트. 호스트 공개 범위는 Docker 포트 바인딩이 제한 |
| `recursion no` | 외부 이름을 대신 찾아 주는 재귀 기능 비활성화 |
| `allow-query` | 권한 영역 질의 허용 |
| `allow-query-cache` | 캐시 응답을 타인에게 제공하지 않음 |
| `allow-transfer` | 영역 전체를 가져가는 AXFR·IXFR 제한 |
| `allow-update` | 동적 레코드 변경 차단 |
| `controls {}` | 이 최소 실습에서는 RNDC 제어 채널 사용 안 함 |
| `notify no` | 보조 서버가 없는 실습에서 변경 알림 비활성화 |
| SOA serial | 영역을 수정할 때 증가시키는 버전 번호 |
| refresh·retry·expire | 보조 서버의 확인·재시도·만료 동작에 쓰이는 값 |

SOA의 `hostmaster.example.test.`는 관리자 메일 주소 `hostmaster@example.test`를 DNS 표기로 적은 것이다. `ns1`의 문서용 IP로 실제 접속하지는 않는다. 아래 명령은 명시적으로 로컬 서버를 지정한다. SOA·NS 구성은 [BIND zone 파일 설명](https://bind9.readthedocs.io/en/stable/chapter3.html), 옵션의 세부 동작은 [BIND 설정 레퍼런스](https://bind9.readthedocs.io/en/stable/reference.html)를 기준으로 읽는다.

이미지를 받고 설정을 검사한다. `9.20` 태그는 같은 계열 내에서 바뀔 수 있으므로 장기 재현이나 운영에는 검증한 digest를 기록해 고정한다.

```bash
docker pull internetsystemsconsortium/bind9:9.20
docker run --rm --entrypoint named-checkconf \
  -v "$PWD:/etc/bind:ro" \
  internetsystemsconsortium/bind9:9.20 -z /etc/bind/named.conf
docker run --rm --entrypoint named-checkzone \
  -v "$PWD:/etc/bind:ro" \
  internetsystemsconsortium/bind9:9.20 example.test /etc/bind/db.example.test
```

검사가 성공하면 서버를 띄운다.

```bash
docker run --rm -d --name dns-lab \
  -p 127.0.0.1:1053:53/udp \
  -p 127.0.0.1:1053:53/tcp \
  -v "$PWD:/etc/bind:ro" \
  --entrypoint named \
  internetsystemsconsortium/bind9:9.20 -g -c /etc/bind/named.conf
```

UDP와 TCP를 모두 열었다. DNS는 UDP만 쓰는 프로토콜이 아니다. 잘린 응답의 TCP 재시도 등도 고려해야 한다. Docker가 없거나 이미 포트를 사용 중이면 이 단계에서 먼저 해결한다. 호스트 DNS 설정을 바꿀 필요는 없다.

## 7. 응답과 실패를 직접 비교하기

```bash
dig @127.0.0.1 -p 1053 example.test A +norecurse
dig @127.0.0.1 -p 1053 www.example.test A +norecurse
dig @127.0.0.1 -p 1053 example.test SOA +tcp +norecurse
dig @127.0.0.1 -p 1053 missing.example.test A +norecurse
dig @127.0.0.1 -p 1053 example.test AAAA +norecurse
dig @127.0.0.1 -p 1053 example.org A
dig @127.0.0.1 -p 1053 example.test AXFR
```

| 검사 | 확인할 결과 |
| --- | --- |
| 영역 A | `NOERROR`, `aa` 플래그, `192.0.2.10` |
| www A | CNAME과 같은 영역 안의 최종 A |
| TCP SOA | TCP로도 SOA 조회 성공 |
| 없는 이름 A | `NXDOMAIN`, 부정 캐시에 쓰이는 SOA |
| 존재하는 이름의 없는 AAAA | `NOERROR`이지만 답변 레코드 없음·NODATA |
| 영역 밖 example.org | 재귀 응답 제공 안 함·이 구성에서는 `REFUSED` |
| AXFR | 영역 전송 거부 |

`aa`는 해당 응답이 권한 있는 답변임을 뜻한다. `ad`는 검증 리졸버가 검증된 데이터임을 알리는 플래그로, 둘은 다른 의미다. 이 실습은 DNSSEC 서명을 구성하지 않았다.

변경 실습에서는 A를 `192.0.2.11`로 바꾸고 SOA serial을 `2026111602`로 올린다. 다시 설정 검사를 통과한 후 적용한다.

```bash
docker run --rm --entrypoint named-checkconf \
  -v "$PWD:/etc/bind:ro" \
  internetsystemsconsortium/bind9:9.20 -z /etc/bind/named.conf
docker kill --signal=HUP dns-lab
dig @127.0.0.1 -p 1053 example.test A +norecurse
dig @127.0.0.1 -p 1053 example.test SOA +norecurse
```

권한 서버를 직접 조회하므로 재귀 리졸버의 이전 캐시를 거치지 않는다. 이것이 “원본 적용 여부”와 “캐시 만료 여부”를 구분하는 검사다. 잘못 바꾼 값을 복구할 때도 serial은 이전 값으로 내리지 말고 더 큰 값으로 올린다. 작업이 끝나면 `docker stop dns-lab`으로 실습 컨테이너를 종료한다.

작성 과정에서 위 설정을 Docker로 실행해 A·CNAME·TCP SOA 조회, NXDOMAIN·NODATA, 외부 재귀 거부와 AXFR 거부를 확인했다. A 주소와 serial 변경 후 HUP 재적용도 확인했다. 검증에 사용한 이미지 digest는 `sha256:66092edb53c081fa11b1fa8219e99065b0f497cb38f568ba789702a4c10e2590`이다. ARM 호스트에서는 이 이미지의 AMD64 플랫폼 경고가 표시됐으며, 에뮬레이션을 지원하는 Docker 환경에서 실행했다. 공개 NS 위임·DNSSEC 서명·보조 서버 복제는 이 로컬 검증 범위에 포함하지 않았다.

## 8. 로컬 실습을 공개 DNS 운영으로 바꾸려면

로컬 컨테이너를 띄웠다는 사실만으로 인터넷이 이 서버를 찾지는 않는다. 공개 서비스에는 공인 주소, UDP·TCP 53 도달성, 상위 NS 위임과 장애 대응이 필요하다.

특히 `example.com`의 네임서버를 `ns1.example.com`으로 지정하면, 네임서버의 주소를 알아내기 위해 다시 같은 영역에 물어야 하는 순환이 생긴다. 상위 영역의 glue 주소가 이 부트스트랩에 쓰인다. 등록업체의 “호스트 등록”과 영역 안의 `ns1 A` 레코드는 관련돼 있지만 같은 설정이 아니다.

실제 운영에서는 다른 장애 영역에 보조 권한 서버를 두고 복제 상태를 감시한다. primary가 변경을 알리고 secondary가 serial을 확인해 전송을 요청하는 구조를 설계한다. 영역 전송은 허용된 보조 서버에 한정하고 TSIG로 인증하며, 키는 저장소에 넣지 않는다. TSIG 자체는 전송 데이터의 암호화를 의미하지 않는다. 패치, DDoS 대응, 백업 복원, 키 교체까지 감당할 필요가 없다면 관리형 DNS가 운영 부담을 줄인다.

## 9. DNSSEC·DoH·TLS가 각각 보호하는 것

| 기술 | 주된 보호 대상 | 대신해 주지 않는 것 |
| --- | --- | --- |
| DNSSEC | 서명 체인을 통한 DNS 데이터의 출처·무결성 검증 | 질의 이름의 비밀성 |
| DoH·DoT | 클라이언트와 해당 리졸버 사이의 암호화된 질의 | 웹 서버 신원 검증, 전체 DNS 구간의 자동 암호화 |
| TLS·HTTPS | 연결 상대 인증과 전송 데이터 보호 | DNS 운영 계정 보호, 앱 권한 검사 |
| CAA | CA가 따를 인증서 발급 허용 정책 | 인증서 폐기, 웹 트래픽 암호화 |

DoH와 DoT의 전송 보호 범위는 [RFC 8484](https://datatracker.ietf.org/doc/html/rfc8484)와 [RFC 7858](https://datatracker.ietf.org/doc/html/rfc7858)에 설명되어 있다.

DNSSEC에서는 자식 영역의 DNSKEY와 서명, 부모 영역의 DS가 연결된다. DNS 제공자에서 기능을 켰다고 부모의 DS 등록까지 언제나 자동으로 완료되는 것은 아니다. 등록업체와 제공자의 절차를 확인하고 검증 리졸버에서 검사한다. [Cloudflare DNSSEC 문서](https://developers.cloudflare.com/dns/dnssec/).

DNS 업체를 옮길 때 이전 DS가 남아 있고 새 영역의 키가 다르면 검증 리졸버는 SERVFAIL을 반환할 수 있다. 단순 이전에서는 제공자의 안내에 따라 부모 DS 제거와 캐시 만료를 확인한 후 NS를 바꾸고, 새 영역에서 서명과 DS를 다시 연결한다. 보안을 유지하는 연속 이전이 필요하면 두 제공자가 지원하는 키·서명 전환 절차를 별도로 설계한다. 오래된 DS를 둔 채 서명만 끄는 것은 복구 방법이 아니다.

운영 계정이 탈취되면 공격자는 정상 DNS 변경 기능을 이용할 수 있다. MFA, 도메인 자동 갱신·결제 확인, 등록 잠금, 영역별 최소 권한 토큰, 변경 이력과 알림이 필요한 이유다. DNSSEC는 관리자 계정 탈취를 막는 장치가 아니다.

## 10. DNS는 정상인데 SSL 오류가 난다면

```text
DNS only: 브라우저 ── TLS ── 원본 서버
프록시:    브라우저 ── TLS ── CDN ── 별도 TLS ── 원본 서버
```

두 번째 구조는 TLS 연결과 인증서 확인 지점이 두 곳이다. Cloudflare의 Full (strict)처럼 원본 인증서까지 검증하는 구성을 사용하려면 원본에도 해당 조건을 만족하는 인증서가 있어야 한다. 브라우저에 보이는 인증서만 정상이라고 원본 구간도 정상인 것은 아니다.

ACME의 HTTP-01은 공개 HTTP 경로, DNS-01은 `_acme-challenge` TXT로 도메인 제어를 검증한다. DNS-01 자동화에 쓰는 API 토큰은 인증서 파일과 별개의 비밀이다. TXT 전파 확인, 토큰 권한, CAA 정책이 갱신 실패 원인이 될 수 있다. 핸드셰이크와 인증서 체인, Nginx·Certbot 예제는 [SSL/TLS 구축과 갱신 편](/blog/https-tls-certificates/)에서 이어서 다룬다.

## 11. 장애를 좁히는 조회 순서

실제 점검에서는 `example.com`을 대상 도메인으로, `ns1.example.com`을 실제 위임된 권한 서버로 바꾼다.

```bash
dig example.com NS
dig +trace example.com A
dig @ns1.example.com example.com A +norecurse
dig @ns1.example.com example.com AAAA +norecurse
dig @1.1.1.1 example.com A
dig @8.8.8.8 example.com A
dig example.com CAA
dig example.com DS +dnssec
```

`+trace`는 위임 경로를 관찰하는 도구이며 그 자체로 DNSSEC 암호 검증을 완료했다는 뜻은 아니다. 방화벽이 외부 53번 질의를 제한하면 실행이 실패할 수 있다. `+dnssec`도 관련 데이터를 요청하는 옵션이다. 검증 여부는 신뢰하는 검증 리졸버나 별도 검증 도구로 확인한다.

| 관측 | 다음 확인 |
| --- | --- |
| 권한 서버도 예전 값 | 다른 영역 수정, 잘못된 위임, reload·복제 실패 |
| 권한 서버는 새 값, 리졸버는 예전 값 | 남은 TTL과 부정 캐시 |
| NXDOMAIN | 이름 오타, 실제 레코드 부재, 조회한 영역 |
| SERVFAIL | DNSSEC 체인, 권한 서버 도달성, 위임 오류 |
| timeout | UDP·TCP 53, 방화벽, 서버 상태 |
| DNS 정상·인증서 오류 | SNI·SAN·체인·만료일·IPv6·원본 TLS |
| DNS·TLS 정상·404 | 호스팅의 도메인 등록, 가상 호스트·경로 라우팅 |

최종 확인은 조회 성공뿐 아니라 다음 항목까지 포함한다.

- [ ] 실제 상위 NS 위임과 수정하는 영역이 일치한다.
- [ ] A·AAAA·CNAME 대상과 웹 호스팅 도메인 등록을 확인했다.
- [ ] MX·TXT 등 웹 이외의 레코드도 이전했다.
- [ ] 이전 TTL과 부정 캐시를 고려해 변경·복구 시간을 잡았다.
- [ ] DNSSEC의 DS·DNSKEY 관계를 이전 전후 검증했다.
- [ ] 직접 운영한다면 공개 재귀를 막고 TCP 질의·복제·장애 감시를 확인했다.
- [ ] TLS와 인증서 자동 갱신까지 외부 접속 경로에서 확인했다.

도메인 연결을 한 번의 설정으로 보지 않고 **등록 → 위임 → 권한 응답 → 캐시 → 연결 → TLS → HTTP**로 나누면, 어디서부터 고쳐야 할지 훨씬 명확해진다.
