# 로컬 문서 RAG 실습

Node.js 20 이상과 Docker 또는 로컬 Ollama가 필요합니다. 별도 Node 패키지 설치는 없습니다. 저장소 루트에서 실행합니다. 외부 API 키를 사용하지 않습니다.

## 모델 실행

Docker를 사용하는 경우:

```sh
docker run -d --name blog-rag-ollama \
  -p 127.0.0.1:11434:11434 \
  -v blog-rag-models:/root/.ollama \
  ollama/ollama:latest
docker exec blog-rag-ollama ollama pull embeddinggemma:300m
docker exec blog-rag-ollama ollama pull qwen3:1.7b
```

이미 컨테이너가 있으면 `docker start blog-rag-ollama`를 사용합니다. 기존 Ollama가 11434 포트를 사용하면 컨테이너를 추가하지 않고 해당 Ollama에서 두 모델을 내려받습니다. 모델과 런타임을 저장할 디스크 공간 및 모델 로딩에 필요한 RAM이 필요합니다. Docker Desktop의 CPU 실행은 macOS 네이티브 GPU 실행과 성능이 다를 수 있습니다.

모델 라이선스: [EmbeddingGemma](https://huggingface.co/google/embeddinggemma-300m), [Qwen3](https://ollama.com/library/qwen3:1.7b). 재현 시 태그가 같은 모델로 바뀔 수 있으므로 실행 결과의 digest도 비교합니다.

## 인덱스와 질문

```sh
node examples/rag/rag.mjs ingest
node examples/rag/rag.mjs search 'DNSSEC는 질의 이름을 숨기나요?'
node examples/rag/rag.mjs ask 'DNSSEC는 질의 이름을 숨기나요?'
node examples/rag/rag.mjs eval
```

- 데이터: `rag.mjs`의 `sources`에 명시한 공개 DNS·TLS 글 두 개만 읽습니다.
- 분할: 제목 경계와 최대 900자, 긴 절 내 120자 중첩. 토큰 기준이 아닙니다.
- 임베딩: 문서에는 `title: … | text: …`, 질문에는 `task: search result | query: …` 접두어를 붙입니다.
- 검색: 전수 코사인 유사도, top-k=3. 점수는 확률이 아닙니다.
- 생성: 실제 Ollama chat, JSON 응답, 인용 번호 범위 검사. 문서 근거 부족 시 답변 보류를 요청합니다.
- 기본값은 Qwen3 추론 모드입니다. 첫 비추론 실행을 비교하려면 `RAG_THINK=false node examples/rag/rag.mjs eval`을 사용합니다. 추론 모드는 출력 예산도 600에서 2048로 늘리므로 동일 연산량 비교가 아닙니다.
- 저장: `.cache/index.json`과 `runs/latest.json`은 Git에서 제외합니다.
- 변경: 문서 해시·분할 설정·모델 이름/digest가 달라지면 `ingest`를 다시 실행해야 합니다.

`OLLAMA_URL`은 loopback 주소만 허용합니다. `EMBED_MODEL`, `CHAT_MODEL`로 모델 이름을 바꿀 수 있으나, 접두어·thinking 옵션·JSON schema 지원이 다른 모델에서는 별도 확인이 필요합니다. 기본 접두어는 EmbeddingGemma용입니다.

## 결과 읽기

`eval`은 세 개의 근거 있는 질문과 두 개의 근거 없는 질문을 실행합니다. `retrievalHit`은 기대한 절 제목이 검색된 간단한 지표입니다. `abstentionMatches`는 답변 보류 여부만 확인합니다. 두 지표가 통과해도 답변 내용의 정확성이 입증되지는 않습니다. `runs/latest.json`의 실제 답변을 `hits`와 대조해야 합니다.

출처 번호 검사는 존재하지 않는 번호를 막을 뿐, 해당 문서가 답변을 실제로 뒷받침하는지 보증하지 않습니다. 프롬프트로 문서 내 명령을 무시하도록 해도 프롬프트 인젝션 방어가 완성되는 것은 아닙니다. 이 예제는 파일 두 개의 공개 데이터만 읽으며 도구 실행·문서 쓰기 기능은 없습니다.

실제 비추론 실행은 `evaluation-baseline.json`, 추론 실행은 `evaluation-thinking.json`에 있습니다. 자동 검색·보류 지표뿐 아니라 근거를 대조한 `manualReview`를 읽어야 합니다. 비추론 모드는 오답과 환각, 추론 모드는 모순된 표현과 과도한 답변 보류가 관찰됐습니다. 이 예제는 동작과 실패를 관찰하는 실습이며 신뢰할 수 있는 자동 상담 서비스가 아닙니다. 기록은 검토용으로 선별한 공개 질문과 결과이며, 전체 실행 로그나 임베딩 인덱스는 커밋하지 않습니다.

API 오류나 180초 제한 초과, 임베딩 차원 오류, 잘린 생성 응답은 실패로 반환합니다. 실패를 “문서에 답이 없음”으로 바꾸지 않습니다. 자동 재시도는 없으며, 서버 상태를 확인한 뒤 같은 명령을 다시 실행합니다. 인덱스는 임시 파일 완성 후 rename하므로 실패한 생성이 기존 인덱스를 덮어쓰지 않습니다.

완료 후 `docker stop blog-rag-ollama`로 모델 서버를 멈춥니다. 모델 볼륨은 다음 실습을 위해 남아 있습니다.

## API 계약

| 호출 | 요청 | 기대 응답 |
| --- | --- | --- |
| GET `/api/tags` | 없음 | `models[].name`, `models[].digest` |
| POST `/api/embed` | `model`, `input: string[]`, `truncate: false` | 입력 수와 같은 `embeddings: number[][]` |
| POST `/api/chat` | `messages`, `stream: false`, JSON schema `format` | `message.content`에 JSON, 완료 상태 |
| GET `/api/version` | 없음 | 실행 환경 기록용 `version` |

공식 계약: [embed](https://docs.ollama.com/api/embed), [chat](https://docs.ollama.com/api/chat). 실제 모델 실행 결과와 코드 수준 검증을 사용하며 모의 모델 응답을 실제 생성 결과로 기록하지 않습니다.
