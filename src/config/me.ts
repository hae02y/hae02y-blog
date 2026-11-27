export type BulletGroup = {
  title: string;
  bullets: string[];
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  description?: string;
};

export type ResumeProject = {
  org: string;
  period: string;
  title: string;
  bullets?: string[];
  bulletGroups?: BulletGroup[];
  techStack?: string;
  linkLabel?: string;
  linkUrl?: string;
};

export type ActivityItem = {
  title: string;
  subtitle?: string;
  bullets?: string[];
  bulletGroups?: BulletGroup[];
  tags?: string[];
};

export type EducationItem = {
  school: string;
  program: string;
  period: string;
};

export type CertificationItem = {
  name: string;
  issuer: string;
  date: string;
};

export type ResumeLink = {
  label: string;
  url: string;
  icon?: 'github' | 'blog' | 'medium' | 'link' | 'email' | 'linkedIn';
};

export type PortfolioProjectConfig = {
  slug: string;
  title: string;
  summary: string;
  role: string;
  techStack: string;
  category?: string;
  start?: string;
  end?: string;
  href?: string;
  details?: BulletGroup[];
};

export type PortfolioCompanyConfig = {
  id: string;
  order: number;
  company: string;
  period: string;
  role?: string;
  summary?: string;
  projects: PortfolioProjectConfig[];
};

export type PortfolioCategoryConfig = {
  category: string;
  summary: string;
  order: number;
};

export const meConfig = {
  profile: {
    name: '정해영',
    email: 'godud1118@gmail.com',
    summary: [
      "저는 기술과 아이디어를 연결해 쓸모 있는 것을 만드는 개발자 정해영입니다. 일상의 불편함이나 막연한 아이디어에서 출발해, 실제로 사용할 수 있는 서비스와 도구로 완성하는 일을 지향합니다.",
      "AI를 활용해 더 많은 아이디어를 구현하고, 낯선 분야도 직접 배우며 시도할 수 있는 범위를 넓히고자 합니다. 빠르게 만드는 데서 그치지 않고, 결과를 확인하고 고쳐 실제로 쓸 수 있는 수준까지 다듬는 일을 중요하게 생각합니다.",
      "기술은 계속 바뀌지만 제가 만들고 싶은 가치는 같습니다. 서로 다른 도구와 지식을 엮어 복잡한 일을 조금 더 쉽게 만들고, 좋은 아이디어가 누군가의 일상에서 쓰이도록 하는 것입니다.",
    ],
  },
  resume: {
    experiences: [
      {
        company: '(주)맨인블록',
        role: '선임연구원 · 백엔드/AI 개발',
        period: '2026.03 - 재직중',
        description: '러닝·건강 관리, AI 진료 실습과 인도네시아 호흡기 문진 서비스를 개발하고, 현장 구축과 ISO 인증 업무를 수행합니다.',
      },
      {
        company: '(주)베스텔라랩',
        role: '선임연구원 · 백엔드 개발',
        period: '2024.01 - 2026.03',
        description: '워치마일·안산 주차관리·디지털 교과서의 백엔드와 관제 화면을 개발하고 배포·모니터링·도면 검증 업무를 개선했습니다.',
      },
      {
        company: '(주)조은기술',
        role: '주임 · 네트워크엔지니어',
        period: '2020.08 - 2023.04',
        description: '지자체 통합관제센터의 서버·네트워크를 구축·운영하고, 망 고도화와 방화벽·VPN 정책 및 장애 이력을 관리했습니다.',
      },
    ] satisfies ExperienceItem[],
    projects: [
      {
        org: '(주)맨인블록',
        period: '현재',
        title: 'Roopin — 러닝·건강 데이터와 AI 코칭',
        techStack: 'Java, Spring Boot, JPA, SSE, React, TypeScript',
        bullets: [
          '러닝·활동·일정·채팅을 다루는 API와 AI 서버의 계약을 분리하고 서비스 데이터를 연결했습니다.',
          'SSE 응답의 중복 누적과 대화 컨텍스트 동기화 문제를 다뤘습니다.',
          '관리자 TOTP 인증, 약관 발행 버전과 동의 유형, 이미지 표시용 변형을 구현했습니다.',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/meninblox-medical-ai-backend/',
      },
      {
        org: '(주)맨인블록',
        period: '',
        title: 'CPX — AI 진료 실습 대화와 이용권',
        techStack: 'Java, Spring Boot, JPA, SSE, Apple IAP, Google Play Billing, FCM',
        bullets: [
          'AI 프록시와 SSE 응답을 연결하고 세션·턴·사용자 발화·AI 발화를 나누어 저장했습니다.',
          '대화 재개에 필요한 이력과 시간 정보를 반환하고 AI context ID 저장·만료 처리를 보완했습니다.',
          '무료·유료 이용권 잔액과 거래 이력을 분리하고 Apple·Google 스토어 영수증 검증부터 이용권 지급까지 연결했습니다.',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/cpx-clinical-training/',
      },
      {
        org: '(주)맨인블록',
        period: '',
        title: 'BMQ / BreatheCheck — 인도네시아 호흡기 문진',
        techStack: 'Next.js, TypeScript, FastAPI, PostgreSQL, Redis, Docker, Traefik, Ollama, GB10',
        bullets: [
          '병원에서 QR로 시작하는 증상 문진, 기침 녹음과 분석 결과 안내를 연결하는 서비스를 개발했습니다.',
          'Next.js·FastAPI·Ollama와 Waycen 기침 분석 모델을 연결하는 현장 구성을 다뤘으며, 의료진 안내를 포함한 스크리닝 보조 서비스로 구현했습니다.',
          '2026년 6월 인도네시아 출장에서 RSUI 데모, RS Pura Raharja의 GB10 설치와 통합 동작 확인, 현장 Wi-Fi·Tailscale 원격 지원 환경 구성을 수행했습니다.',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/bmq-breathecheck-indonesia/',
      },
      {
        org: '(주)맨인블록',
        period: '',
        title: 'ISO 인증 — 사내 실무 단독 담당·취득',
        techStack: 'ISMS, PIMS, BIA, Risk Assessment, Audit Evidence',
        bullets: [
          '사내 ISO 인증 실무를 단독으로 맡아 준비·심사 대응부터 인증 취득까지 수행했습니다.',
          'ISMS·PIMS 규정과 절차, 자산·위험 평가, BIA·개인정보 흐름 및 심사 증적을 정리하고 보완·제출 업무를 수행했습니다.',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/iso-certification/',
      },
      {
        org: '(주)베스텔라랩',
        period: '2024.06 - 2026.03',
        title: '워치마일(주차내비게이션) 서비스 백엔드 개발',
        techStack: 'Java, Spring Boot, Spring Security, MyBatis, MySQL, Thymeleaf, Python, FastAPI, AWS',
        bullets: [
          '온프레미스/PHP 레거시를 AWS 기반 클라우드 아키텍처로 마이그레이션하며 표준 API와 운영 대시보드를 구축했습니다.',
          '외부 주차 관제 API와 인증을 표준화하고, FCM 알림·운영사 배포 대시보드·신규 현장 데이터 등록 흐름을 구현했습니다.',
          'RabbitMQ로 장비 데이터 수신과 처리를 분리하고, Jenkins·GitLab CI/CD와 Docker Compose·Traefik 배포 구성을 적용했습니다.',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/watchmile-backend-ops/',
      },
      {
        org: '(주)베스텔라랩',
        period: '',
        title: '안산도시공사 주차관리 시스템',
        techStack: 'Java, Spring Boot, Spring Security, MyBatis, MySQL, Thymeleaf, NCP, Kubernetes, GitHub Actions',
        bullets: [
          '현장 조사와 실무자 협의를 통해 만공정보, 미납·감면, 결제와 세외수입 처리 요구를 정리했습니다.',
          '주차업체별 연동을 공통 API로 정리하고 회원·본인인증·결제·정산 기능을 개발했습니다.',
          'NCP·NKS와 VPN 연결, 배포 환경과 QA 이슈를 함께 다뤘습니다.',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/ansan-parking-system/',
      },
      {
        org: '(주)베스텔라랩',
        period: '2024.09 - 2025.01',
        title: '아이코딩 톡벗(디지털 교과서) 백엔드 개발',
        techStack: 'Java, Spring Boot, Spring Security, JPA, MySQL, MyBatis, TypeScript, React, Zustand, TanStack Query, Docker, NCP',
        bullets: [
          'JWT 인증·세션 관리와 WebSocket 퀴즈 진행·브로드캐스트를 구현하고, R2DBC 기반 비동기 DB 연동을 모듈화했습니다.',
          '서비스별 Spring Boot 모듈과 Nexus3·Bitbucket Pipeline 기반 NCP Kubernetes 자동 배포 환경을 구축했습니다.',
          'K-PaaS 클라우드 서비스 확인제 인증 통과',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/icoding-talkbot-textbook/',
      },
      {
        org: '(주)베스텔라랩',
        period: '2024.02 - 2024.06',
        title: 'LA Joe’s Auto Park — 주차 관제 PoC',
        techStack: 'Java, Spring Boot, MySQL, JavaScript, jQuery, Bootstrap, Hls.js, Nginx, FFmpeg',
        bullets: [
          'SVG 기반 도면 시각화와 실시간 스트리밍 통합 관제 UI를 구현했습니다.',
          'RTSP 영상을 HLS로 변환·중계하는 서버와 HLS.js 재생·오류 복구 흐름을 구현해 LPR·스트리밍 통합 관제 PoC를 지원했습니다.',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/la-joes-auto-park-poc/',
      },
      {
        org: '(주)베스텔라랩',
        period: '2024.04 - 2024.10',
        title: '파크옵스(다국화 주차장 모니터링) 대시보드 개발',
        techStack: 'React, TypeScript, Axios, TailwindCSS, Redux, Nginx, MySQL, Directus',
        bullets: [
          'SVG 기반 주차 도면 시각화 및 상태 모니터링 UI를 구현했습니다.',
          '다국어 전환과 리소스 lazy load 국제화 시스템을 구축했습니다.',
          '역할별 화면 접근 제어와 Directus 연동, 웹 접근성·보안·시맨틱 마크업을 개선해 GS 1등급 인증에 대응했습니다.',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/parkops-dashboard-i18n/',
      },
      {
        org: '(주)조은기술',
        period: '2020.08 - 2023.04',
        title: '통합관제센터 데이터센터 구축 및 운영',
        techStack: 'Linux, Cisco Switch, Firewall, VPN, Storage, Hyper-V',
        bullets: [
          '논산시청을 비롯한 지자체 관제센터의 서버·네트워크 구축과 Cisco L3/L2 스위치·방화벽 운영을 담당했습니다.',
          '1Gbps 폐쇄망을 10Gbps로 고도화하고 장비 구성과 트래픽 운영 정책을 정비했습니다.',
          '방화벽·VPN·포트 정책과 장애 이력을 기록하고 현장 운영 표준을 정리했습니다.',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/noc-datacenter-ops/',
      },
    ] satisfies ResumeProject[],
    automation: [
      {
        org: '(주)베스텔라랩',
        period: '',
        title: 'Figma 도면 검증과 등록 상태 대시보드',
        techStack: 'Figma Plugin, Java, Spring Boot, JavaScript',
        bullets: [
          'Figma 산출물을 데이터로 변환하는 과정에 오류 검증 플러그인을 적용했습니다.',
          '비개발 인력도 도면과 내비게이션 데이터 등록 상태를 확인할 수 있도록 내부 검증 화면을 구현했습니다.',
          '도면 요소를 실시간으로 시각화하는 별도 내부 도구도 단독 개발해 데이터 검증 업무에 적용했습니다.',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/drawing-validation-automation/',
      },
      {
        org: '(주)베스텔라랩',
        period: '2025.10 - 2026.03',
        title: 'TIG 스택 기반 모니터링 프로세스 구축',
        techStack: 'Telegraf, InfluxDB, Grafana',
        bullets: [
          'Telegraf + InfluxDB + Grafana 스택으로 모니터링 시스템을 구축했습니다.',
          '현장별 장애 상태를 확인할 수 있는 Infra Operation System을 설계하고 사내 운영에 적용했습니다.',
        ],
      },
      {
        org: '개인 프로젝트',
        period: '2026.11 - 현재',
        title: 'My Brain — 옵시디언 기반 경험 기록 하네스',
        techStack: 'Python, Obsidian, Markdown, Codex, Claude Code',
        bullets: [
          '회사·사업·학업·개인 경험을 맥락별로 유지하고 각 프로젝트를 해당 문서에 연결했습니다.',
          '기존 주제 갱신과 새 주제 생성, 상단 속성·도식 판단, 작성 후 독립 검수와 변경 해시 확인을 연결했습니다.',
          '단순 질문은 직접 답하고 새 경험·결정·실제 변경이 있을 때 기록하도록 Codex와 Claude의 공통 규칙을 구성했습니다.',
        ],
        linkLabel: '프로젝트 상세 보기',
        linkUrl: '/about/my-brain-harness/',
      },
    ] satisfies ResumeProject[],
    activities: [
      {
        title: '블로그 활동',
        tags: [
          '블로그',
        ],
        bulletGroups: [
          {
            title: '블로그 운영',
            bullets: [
              'Next.js 기반 [기술 블로그](https://blog.hae02y.me/)를 직접 개발·운영하며 한국어·영어 소개, 기술 아티클·에세이와 앱 런처를 연결했습니다.',
              '누적 25만 방문의 [IT 기술 블로그](https://togll.tistory.com/)를 운영하고 있습니다.',
              '[브런치스토리](https://brunch.co.kr/@hae02y) 작가로 활동하며, 일상과 생각을 글로 기록하고 있습니다.',
            ],
          },
        ],
      },
      {
        title: '오픈소스 활동',
        tags: [
          '오픈소스',
        ],
        bulletGroups: [
          {
            title: 'Google A2A',
            bullets: [
              'Google A2A(a2a-java) listTasks status wire string 처리 버그 수정 기여 [PR #578](https://github.com/a2aproject/a2a-java/pull/578)',
            ],
          },
        ],
      },
      {
        title: '스터디 활동',
        tags: [
          '스터디',
        ],
        bulletGroups: [
          {
            title: '스터디 참여',
            bullets: [
              '[베스텔라랩 개발자 스터디 참여](https://blog.hae02y.me/blog/makeblog2/) | 베스텔라랩 사내 개발자들 참여 인사이트 공유 및 주 1회 블로깅 피드백 진행',
              '[Java Algorithm 스터디 운영](https://github.com/hae02y/CS_Studdiinngg) | 백준, 프로그래머스 Java 언어 기반 알고리즘 문제 풀이 및 피드백 진행',
              '[Computer Science 스터디 참여](https://github.com/hae02y/CS_Studdiinngg) | CS 기초 지식 및 개발 지식 향상을 위한 스터디 참여',
            ],
          },
        ],
      },
      {
        title: 'Codestates Software Developer 부트캠프',
        tags: [
          '부트캠프',
        ],
        bulletGroups: [
          {
            title: '부트캠프 수료',
            bullets: [
              'JAVA, Spring 기반 객체 지향 프로그래밍 학습 및 회고 작성',
              '알고리즘 문제 풀이와 수행 과제 및 페어 프로그래밍, 코드 리뷰 경험',
            ],
          },
        ],
      },
    ] satisfies ActivityItem[],
    education: [
      { school: '한양대학교 인공지능 융합대학원', program: '인공지능융합전공 재학 · 석사', period: '2026.03 - 2028.02' },
      { school: '한국 방송통신대학교', program: '컴퓨터과학과 졸업 · 학사', period: '2021.03 - 2023.08' },
      { school: '대전 대덕대학교', program: '컴퓨터공학과 졸업 · 전문학사', period: '2019.03 - 2021.02' },
    ] satisfies EducationItem[],
    certifications: [
      { name: '정보처리기사', issuer: '한국산업인력공단', date: '2023.06' },
      { name: 'SQLD', issuer: '한국데이터산업진흥원', date: '2022.09' },
      { name: 'ADsP', issuer: '한국데이터산업진흥원', date: '2022.11' },
      { name: '네트워크관리사2급', issuer: '한국정보통신자격협회', date: '2022.04' },
      { name: '리눅스마스터 2급', issuer: '정보통신기술자격검정', date: '2020.07' },
      { name: '컴퓨터활용능력 2급', issuer: '대한상공회의소', date: '2019.10' },
    ] satisfies CertificationItem[],
    links: [
      { label: 'GitHub', url: 'https://github.com/hae02y', icon: 'github' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/hae02y', icon: 'linkedIn' },
      { label: '기술블로그', url: 'https://blog.hae02y.me/', icon: 'blog' },
    ] satisfies ResumeLink[],
  },
  portfolio: {
    companies: [
      {
        id: 'meninblox',
        order: 0,
        company: '맨인블록',
        period: '2026-03 ~ 현재',
        role: '선임연구원 · 백엔드/AI 개발',
        summary: '러닝·건강 관리, AI 진료 실습과 인도네시아 호흡기 문진 서비스를 개발하고, 현장 구축과 ISO 인증 업무를 수행합니다.',
        projects: [
          {
            slug: 'meninblox-medical-ai-backend',
            title: 'Roopin — 러닝·건강 데이터와 AI 코칭',
            summary: '활동 데이터와 AI 대화를 연결하고, 스트리밍 응답·관리자 인증·약관 버전 관리와 백엔드 검증 흐름을 개선하고 있습니다.',
            role: '백엔드·관리자 기능 개발 · AI 연동',
            techStack: 'Java, Spring Boot, JPA, SSE, React, TypeScript',
            category: 'AI / Healthcare',
            end: 'present',
            details: [
              {
                title: '담당한 문제',
                bullets: [
                  '러닝·활동·일정·채팅을 다루는 API와 AI 서버의 계약을 분리하고 서비스 데이터를 연결했습니다.',
                ],
              },
              {
                title: '구현과 개선',
                bullets: [
                  'SSE 응답의 중복 누적과 대화 컨텍스트 동기화 문제를 다뤘습니다.',
                  '관리자 TOTP 인증, 약관 발행 버전과 동의 유형, 이미지 표시용 변형을 구현했습니다.',
                  '연구·설계·구현·검토의 인계와 공통 검사를 백엔드 개발 흐름에 연결했습니다.',
                ],
              },
              {
                title: '이어가는 작업',
                bullets: [
                  '컨테이너·Kubernetes 전환은 격리된 로컬 환경에서 검증하며 세션, 스트리밍과 복귀 조건을 정리하고 있습니다.',
                ],
              },
            ],
          },
          {
            slug: 'cpx-clinical-training',
            title: 'CPX — AI 진료 실습 대화와 이용권',
            summary: '진료 실습 대화의 저장·재개·만료와 무료·유료 이용권, iOS·Android 인앱결제 검증을 구현했습니다.',
            role: '백엔드 설계·개발 · 결제 연동',
            techStack: 'Java, Spring Boot, JPA, SSE, Apple IAP, Google Play Billing, FCM',
            category: 'AI / Healthcare',
            details: [
              {
                title: '대화와 상태',
                bullets: [
                  'AI 프록시와 SSE 응답을 연결하고 세션·턴·사용자 발화·AI 발화를 나누어 저장했습니다.',
                  '대화 재개에 필요한 이력과 시간 정보를 반환하고 AI context ID 저장·만료 처리를 보완했습니다.',
                ],
              },
              {
                title: '이용권과 거래',
                bullets: [
                  '무료·유료 잔액을 분리하고 스토어 영수증 검증, 거래 기록과 이용권 지급을 연결했습니다.',
                  'FCM HTTP v1 호출로 푸시 연동을 전환했습니다.',
                ],
              },
            ],
          },
          {
            slug: 'bmq-breathecheck-indonesia',
            title: 'BMQ / BreatheCheck — 인도네시아 호흡기 문진',
            summary: '인도네시아 병원의 호흡기 문진·기침 녹음 서비스를 개발하고 GB10 기반 현장 설치와 통합 동작 확인을 수행했습니다.',
            role: '문진 서비스 개발 · 현장 구축·실증',
            techStack: 'Next.js, TypeScript, FastAPI, PostgreSQL, Redis, Docker, Traefik, Ollama, GB10',
            category: 'AI / Healthcare',
            details: [
              {
                title: '환자 이용 흐름과 서비스 구성',
                bullets: [
                  '병원에서 QR로 시작하는 증상 문진, 기침 녹음과 분석 결과 안내를 연결하는 서비스를 개발했습니다.',
                  'Next.js 환자 화면과 FastAPI, 문진 규칙·Ollama 및 Waycen의 기침 분석 모델을 연결하는 현장 구성을 다뤘습니다.',
                  '의료진 안내와 위험 신호 대응을 포함한 스크리닝 보조 서비스로 구성했습니다.',
                ],
              },
              {
                title: '인도네시아 현장 설치와 협업',
                bullets: [
                  '2026년 6월 출장에서 RSUI 시연과 RS Pura Raharja의 GB10 설치·통합 동작 확인을 수행했습니다.',
                  '현지 Wi-Fi 네트워크와 Tailscale 원격 접속을 확인하고 병원 환경에 맞춰 서비스 운영을 연결했습니다.',
                  '병원·임상·모델 공급 파트너와 협업하며 서비스 구현과 현장 운영의 접점을 다뤘습니다.',
                ],
              },
            ],
          },
          {
            slug: 'iso-certification',
            title: 'ISO 인증 — 사내 실무 단독 담당·취득',
            summary: '사내 ISO 인증 실무를 단독으로 맡아 준비·심사 대응부터 인증 취득까지 수행했습니다.',
            role: '인증 실무 단독 담당 · 심사 대응',
            techStack: 'ISMS, PIMS, BIA, Risk Assessment, Audit Evidence',
            category: 'Security / Operations',
            details: [
              {
                title: '인증 준비와 문서 체계',
                bullets: [
                  '정보보호·개인정보 관리 체계를 심사에서 설명할 수 있도록 규정·지침과 증적을 정리했습니다.',
                  '인증 범위, 자산·위험평가, 업무 연속성과 복구 기준, 개인정보 처리 흐름을 검토하고 관련 문서를 연결했습니다.',
                ],
              },
              {
                title: '담당 범위와 결과',
                bullets: [
                  '심사 지적에 대한 보완 문서와 제출 자료를 정리하며 대응했습니다.',
                  '사내 인증 실무를 단독으로 맡아 인증 취득까지 수행했습니다.',
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'vestellalab',
        order: 1,
        company: '베스텔라랩',
        period: '2024-01 ~ 2026-03',
        role: '선임연구원 · 백엔드 개발',
        summary: 'Vision-AI 기반 실내 정밀 측위 및 Non-GPS 주차 내비게이션을 서비스하는 스마트 모빌리티 스타트업입니다.',
        projects: [
          {
            slug: 'ansan-parking-system',
            title: '안산도시공사 주차관리 시스템',
            summary: '현장·고객 업무를 분석하고 주차업체 연동, 회원 인증, 결제·감면·정산과 클라우드 전환을 다뤘습니다.',
            role: 'Backend 설계 및 개발',
            techStack: 'Java, Spring Boot, Spring Security, MyBatis, MySQL, Thymeleaf, NCP, Kubernetes, GitHub Actions',
            category: 'Backend / Infra',
            details: [
              {
                title: '업무와 요구사항',
                bullets: [
                  '현장 조사와 실무자 협의를 통해 만공정보, 미납·감면, 결제와 세외수입 처리 요구를 정리했습니다.',
                ],
              },
              {
                title: '구현과 운영',
                bullets: [
                  '주차업체별 연동을 공통 API로 정리하고 회원·본인인증·결제·정산 기능을 개발했습니다.',
                  'NCP·NKS와 VPN 연결, 배포 환경과 QA 이슈를 함께 다뤘습니다.',
                ],
              },
            ],
          },
          {
            slug: 'watchmile-backend-ops',
            title: '워치마일(주차내비게이션) 서비스 백엔드 개발',
            summary: '온프레미스/PHP 레거시를 AWS 기반 클라우드 아키텍처로 마이그레이션하며 표준 API와 운영 대시보드를 구축했습니다.',
            role: 'Backend 설계 및 개발',
            techStack: 'Java, Spring Boot, Spring Security, MyBatis, MySQL, Thymeleaf, Python, FastAPI, AWS',
            category: 'Backend / Infra',
            start: '2024-06',
            end: '2026-03',
            details: [
              {
                title: 'Summary',
                bullets: [
                  '온프레미스/레거시 워치마일 서비스를 클라우드 기반으로 전환했습니다.',
                  '외부 주차 관제 업체 및 파트너 연동 API를 표준화했습니다.',
                ],
              },
              {
                title: 'Highlights',
                bullets: [
                  'JWT 기반 인증 적용 및 RESTful API 설계/문서화',
                  '운영사 전용 배포 대시보드 설계 및 구현',
                  'FCM 기반 실시간 푸시 알림 서비스 구축',
                  '신규 현장 도면 데이터 표준화 및 DB 적재 프로세스 개선',
                ],
              },
            ],
          },
          {
            slug: 'icoding-talkbot-textbook',
            title: '아이코딩 톡벗(디지털 교과서) 백엔드 개발',
            summary: '실시간 퀴즈와 계정 관리 기능을 갖춘 디지털 교과서 백엔드/프론트 구조를 설계했습니다.',
            role: 'Backend 설계 및 개발',
            techStack: 'Java, Spring Boot, Spring Security, JPA, MySQL, MyBatis, TypeScript, React, Zustand, TanStack Query, Docker, NCP',
            category: 'Product / Service',
            start: '2024-09',
            end: '2025-01',
            details: [
              {
                title: 'Summary',
                bullets: [
                  '인증/인가와 실시간 퀴즈 진행 로직을 포함한 백엔드 아키텍처를 구축했습니다.',
                  '서비스별 독립 모듈화로 확장 가능한 구조를 설계했습니다.',
                ],
              },
              {
                title: 'Highlights',
                bullets: [
                  'JWT 기반 인증/인가 및 세션 상태 관리 모듈 구현',
                  'WebSocket 기반 퀴즈 진행/브로드캐스트 로직 개발',
                  'R2DBC 비동기 DB 연동 모듈화 및 트랜잭션 최적화',
                  'NCP Kubernetes 환경 자동 배포 파이프라인 구축',
                ],
              },
              {
                title: 'Impact',
                bullets: [
                  'K-PaaS 클라우드 서비스 확인제 인증 통과',
                ],
              },
            ],
          },
          {
            slug: 'la-joes-auto-park-poc',
            title: 'LA Joe’s Auto Park — 주차 관제 PoC',
            summary: 'LPR/스트리밍 데이터를 결합한 주차 관제 대시보드를 구축해 실시간 운영 시나리오를 검증했습니다.',
            role: 'Backend 설계 및 개발 · Web Frontend 개발',
            techStack: 'Java, Spring Boot, MySQL, JavaScript, jQuery, Bootstrap, Hls.js, Nginx, FFmpeg',
            category: 'Operations / Process',
            start: '2024-02',
            end: '2024-06',
            details: [
              {
                title: 'Summary',
                bullets: [
                  'SVG 기반 도면 시각화와 실시간 스트리밍 통합 관제 UI를 구현했습니다.',
                  'CCTV 스트림 안정성을 위한 변환/복구 로직을 설계했습니다.',
                ],
              },
              {
                title: 'Highlights',
                bullets: [
                  '주차 슬롯과 Spot ID 매핑 및 JSON 실시간 반영',
                  '차량 입출차 이력/번호판 메타데이터 테이블 및 팝업 구성',
                  'HLS.js 기반 스트리밍 재생 안정화 및 오류 복구 처리',
                  'RTSP에서 HLS로 변환하는 서버 및 Failover 로직 구현',
                ],
              },
              {
                title: 'Impact',
                bullets: [
                  'LPR + 스트리밍 통합 관제 PoC 사례 확보',
                ],
              },
            ],
          },
          {
            slug: 'parkops-dashboard-i18n',
            title: '파크옵스(다국화 주차장 모니터링) 대시보드 개발',
            summary: 'SVG 기반 도면과 다국어 전환을 지원하는 관제 대시보드를 구축해 사용자 경험을 고도화했습니다.',
            role: 'Web Frontend 설계 및 개발',
            techStack: 'React, TypeScript, Axios, TailwindCSS, Redux, Nginx, MySQL, Directus',
            category: 'Product / Frontend',
            start: '2024-04',
            end: '2024-10',
            details: [
              {
                title: 'Summary',
                bullets: [
                  'SVG 기반 주차 도면 시각화 및 상태 모니터링 UI를 구현했습니다.',
                  '다국어 전환과 리소스 lazy load 국제화 시스템을 구축했습니다.',
                ],
              },
              {
                title: 'Highlights',
                bullets: [
                  'Role 기반 메뉴/화면 접근 제어 및 상태 관리 로직 구현',
                  'Directus API 쿼리 빌더와 인증 토큰 인터셉터 개발',
                  '웹 접근성/보안 헤더/시맨틱 마크업 개선',
                ],
              },
              {
                title: 'Impact',
                bullets: [
                  'GS 인증 1등급 획득',
                ],
              },
            ],
          },
          {
            slug: 'digital-drawing-tool',
            title: '디지털 도면 시각화 Tool',
            summary: '주차장 도면과 요소를 실시간 시각화하는 내부 도구를 단독 개발했습니다.',
            role: '사내 도구 설계·개발',
            techStack: 'JavaScript, Thymeleaf, jQuery, Java, Spring Boot',
            category: 'Automation / Internal Tool',
            start: '2025-01',
            end: '2025-03',
            details: [
              {
                title: 'Summary',
                bullets: [
                  '도면 데이터 검증을 위한 시각화 도구를 설계하고 구현했습니다.',
                ],
              },
              {
                title: 'Highlights',
                bullets: [
                  '실시간 도면 렌더링으로 데이터 품질 검증 효율 향상',
                  '사내 업무에 적용해 도면 검증 프로세스 개선',
                ],
              },
            ],
          },
          {
            slug: 'drawing-validation-automation',
            title: 'Figma 도면 검증과 등록 상태 대시보드',
            summary: '도면을 데이터로 변환할 때 오류를 찾고, 도면·내비게이션 데이터의 등록 상태를 확인하는 업무 도구를 만들었습니다.',
            role: '검증 도구 설계·개발 · 업무 개선',
            techStack: 'Figma Plugin, Java, Spring Boot, JavaScript',
            category: 'Automation / Internal Tool',
            details: [
              {
                title: '작업 흐름',
                bullets: [
                  'Figma 산출물을 데이터로 변환하는 과정에 오류 검증 플러그인을 적용했습니다.',
                  '비개발 인력도 도면과 내비게이션 데이터 등록 상태를 확인할 수 있도록 내부 검증 화면을 구현했습니다.',
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'joeun-technology',
        order: 2,
        company: '조은기술',
        period: '2020-08 ~ 2023-04',
        role: '주임 · 네트워크엔지니어',
        summary: '전국 지자체와 공공기관에 관제·스마트시티 솔루션을 공급해온 IT 전문기업입니다.',
        projects: [
          {
            slug: 'noc-datacenter-ops',
            title: '통합관제센터 데이터센터 구축 및 운영',
            summary: '지자체 관제센터의 서버/네트워크 인프라를 구축하고 안정적인 운영 환경을 마련했습니다.',
            role: 'Network Engineer',
            techStack: 'Linux, Cisco Switch, Firewall, VPN, Storage, Hyper-V',
            category: 'Infrastructure / Operations',
            start: '2020-08',
            end: '2023-04',
            details: [
              {
                title: 'Summary',
                bullets: [
                  '전국 지자체/공공기관 관제센터 데이터센터 구축 및 운영을 담당했습니다.',
                  '핵심 네트워크 장비 운용과 보안 정책 관리를 수행했습니다.',
                ],
              },
              {
                title: 'Highlights',
                bullets: [
                  '논산시청 통합관제센터 서버/네트워크 인프라 구축',
                  'Cisco L3/L2 스위치 및 방화벽 운영',
                  '장애 이력 기록 및 운영 표준 수립',
                ],
              },
            ],
          },
          {
            slug: 'network-upgrade-10g',
            title: '통합관제센터 10Gbps 네트워크 업그레이드',
            summary: '1Gbps 폐쇄망을 10Gbps로 업그레이드하여 스트리밍 품질과 응답성을 크게 개선했습니다.',
            role: 'Network Engineer',
            techStack: 'Cisco L3/L2 Switch, VPN, Firewall',
            category: 'Infrastructure / Operations',
            start: '2022-01',
            end: '2022-06',
            details: [
              {
                title: 'Summary',
                bullets: [
                  '관제센터 네트워크 대역폭 업그레이드를 설계하고 구축했습니다.',
                  '스트리밍 품질과 응답성 향상을 위한 네트워크 튜닝을 수행했습니다.',
                ],
              },
              {
                title: 'Highlights',
                bullets: [
                  '1Gbps에서 10Gbps로 업그레이드하여 영상 스트리밍 품질과 응답성을 개선했습니다.',
                  '장비 구성 및 운영 정책을 정비해 안정적인 서비스 제공 기반을 마련했습니다.',
                ],
              },
            ],
          },
          {
            slug: 'security-ops-standard',
            title: '네트워크 보안 정책 및 운영 표준화',
            summary: '방화벽 정책과 트래픽 관리 표준을 수립해 보안 운영 품질을 높였습니다.',
            role: 'Network Engineer',
            techStack: 'Firewall, VPN, Cisco, Linux',
            category: 'Security / Operations',
            start: '2021-01',
            end: '2023-04',
            details: [
              {
                title: 'Summary',
                bullets: [
                  '네트워크 보안 정책 수립 및 운영 프로세스 정비를 수행했습니다.',
                  '장애/보안 이력 관리 체계를 정착시켰습니다.',
                ],
              },
              {
                title: 'Highlights',
                bullets: [
                  '방화벽 설정 및 포트 트래픽 관리 표준 수립',
                  '주요 장비 운용 정책 정리 및 보안 운영 기록 정착',
                ],
              },
            ],
          },
        ],
      },
    ],
    independentCategories: [
      {
        category: 'Business / Product',
        summary: 'ha-e.company의 제품·콘텐츠와 손끝의휴식의 서비스·브랜드 기획을 실제 작업과 준비 단계에 맞춰 정리했습니다.',
        order: 1,
      },
      {
        category: 'Freelance / Client Work',
        summary: '클라이언트의 요구사항을 기능 단위로 정리하고 백엔드 개발, 배포, 운영 대응까지 이어지는 실무형 개발 경험을 쌓았습니다.',
        order: 2,
      },
      {
        category: 'Side Project',
        summary: '제품 아이디어를 빠르게 검증하고 MVP를 구현하며 실제 서비스로 이어질 수 있는 기능을 실험했습니다.',
        order: 3,
      },
      {
        category: 'Automation / Internal Tool',
        summary: '반복 업무를 줄이기 위한 자동화, 데이터 처리, 운영 도구를 직접 설계하고 구현했습니다.',
        order: 4,
      },
      {
        category: 'Writing / Publishing',
        summary: '기술 경험과 공식 자료 조사를 독자가 따라 읽을 수 있는 글과 책으로 구성합니다.',
        order: 5,
      },
    ],
    solo: [
      {
        slug: 'independent-business-ops',
        title: 'ha-e.company',
        summary: '서비스 기획·개발과 외주, 브랜딩, 콘텐츠·운영 자동화를 함께 다루는 개인 사업입니다.',
        role: '사업 기획 · 브랜드 · 제품 개발·운영',
        techStack: '서비스 기획, 브랜딩, 웹 개발, 운영 자동화',
        category: 'Business / Product',
        end: 'present',
        details: [
          {
            title: '사업 방향',
            bullets: [
              '요구사항을 기획부터 구현·검증·운영까지 연결하고, 제품마다 고객과 제공 가치를 구체화합니다.',
              '우리42, 리드베이스, Gear 72, 생존지침서의 제품·콘텐츠 작업을 같은 사업 안에서 관리합니다.',
            ],
          },
        ],
      },
      {
        slug: 'client-backend-automation',
        title: '클라이언트 백엔드/자동화 외주 개발',
        summary: '클라이언트 요구사항을 기능 단위로 정리하고 백엔드 개발, 배포, 운영 대응까지 이어지는 작업을 수행했습니다.',
        role: '외주 개발 · 백엔드 개발 · 운영 대응',
        techStack: 'Java, Spring Boot, MySQL, AWS, Docker',
        category: 'Freelance / Client Work',
        start: '2025-08',
        end: '2025-10',
        details: [
          {
            title: 'Summary',
            bullets: [
              '클라이언트가 요청한 업무 흐름을 기능 요구사항으로 정리하고 백엔드 구현과 배포까지 연결했습니다.',
            ],
          },
          {
            title: 'Highlights',
            bullets: [
              '요구사항을 API와 데이터 모델로 구체화',
              '배포 환경과 운영 대응 흐름 정리',
              '반복 처리되는 업무를 자동화할 수 있는 구조 검토',
            ],
          },
        ],
      },
      {
        slug: 'yeosu-bike-trip',
        title: '여수로 - 자전거와 함께 떠나는 여수 여행',
        summary: '여수 여행 추천 서비스를 개발하며 핵심 백엔드 로직과 성능 개선을 수행했습니다.',
        role: 'Side Project',
        techStack: 'Java, Spring Boot, Spring Security, JPA, PostgreSQL, Docker, AWS',
        category: 'Side Project',
        start: '2024-03',
        end: '2024-07',
        details: [
          {
            title: 'Summary',
            bullets: [
              '한국관광공사 공모전 참가용 여행 추천 서비스 백엔드를 설계했습니다.',
            ],
          },
          {
            title: 'Highlights',
            bullets: [
              '여정 추천, 미션 경험치 등 핵심 비즈니스 로직 구현',
              'S3 이미지 처리 및 성능 개선',
            ],
          },
        ],
      },
      {
        slug: 'jandi-garden',
        title: '잔디정원 - 당신도 GitHub 정원사',
        summary: 'SSR 기반 커뮤니티 서비스 MVP를 구축하고 Kotlin 전환과 데이터 마이그레이션을 진행했습니다.',
        role: 'Side Project',
        techStack: 'Kotlin, Java, Spring Boot, Spring Security, JPA, MySQL, Thymeleaf',
        category: 'Side Project',
        start: '2025-03',
        end: 'present',
        details: [
          {
            title: 'Summary',
            bullets: [
              '커뮤니티 운영을 위한 SSR 웹 서비스 백엔드를 설계하고 MVP를 구현했습니다.',
            ],
          },
          {
            title: 'Highlights',
            bullets: [
              'REST API 기반 Kotlin 전환 및 데이터베이스 마이그레이션',
              '핵심 도메인 설계 및 인증/인가 구조 구현',
            ],
          },
        ],
      },
      {
        slug: 'studyground',
        title: '스터디그라운드 - 자격증 조회',
        summary: '공공 API 기반 자격증 정보와 커뮤니티를 결합한 서비스의 데이터 파이프라인을 구축했습니다.',
        role: 'Side Project',
        techStack: 'Java, Spring Boot, Spring Security, JPA, Spring Batch, MySQL, AWS',
        category: 'Side Project',
        start: '2023-09',
        end: '2023-10',
        details: [
          {
            title: 'Summary',
            bullets: [
              '자격증 정보, 일정, 커뮤니티 기능을 결합한 서비스를 설계했습니다.',
            ],
          },
          {
            title: 'Highlights',
            bullets: [
              '외부 API 트래픽을 고려한 Batch 설계',
              '북마크/검색 성능 최적화 및 CI/CD 자동화',
            ],
          },
        ],
      },
      {
        slug: 'togedog',
        title: '투게독 - 당신의 반려견과 함께',
        summary: '반려동물 SNS 서비스의 인증/회원 도메인과 배포 구조를 설계했습니다.',
        role: 'Side Project',
        techStack: 'Java, Spring Boot, Spring Security, JPA, MySQL, Redis, Docker, AWS',
        category: 'Side Project',
        start: '2023-10',
        end: '2023-12',
        details: [
          {
            title: 'Summary',
            bullets: [
              '반려동물 기록/공유 SNS의 핵심 백엔드 로직을 구현했습니다.',
            ],
          },
          {
            title: 'Highlights',
            bullets: [
              'JWT · OAuth2 기반 인증 및 회원 API 구축',
              'S3 이미지 처리 및 CI/CD 자동화 적용',
            ],
          },
        ],
      },
      {
        slug: 'woori42',
        title: '우리42 — 대화 분석과 AI 리포트',
        summary: '카카오톡 대화의 통계와 근거를 바탕으로 서로 다른 상담 관점의 리포트를 만드는 ha-e.company 서비스입니다.',
        role: '제품 기획 · AI 리포트 · 개발 협업 설계',
        techStack: 'JavaScript, Node.js, Gemini, Vercel Blob, Vercel Queues, Resend',
        category: 'Business / Product',
        end: 'present',
        details: [
          {
            title: '제품과 구현',
            bullets: [
              '대화 업로드, 근거 기반 분석, 미리보기와 리포트 공유·PDF 흐름을 구성했습니다.',
              '역할별 인계와 QA·평가 기준을 갖춘 개발 하네스를 구축하고, 상담사별 리포트 품질과 완료 후 복귀 경험을 개선 과제로 정리했습니다.',
            ],
          },
          {
            title: '검증 범위',
            bullets: [
              '실제 받은편지함 전달과 운영 결제·접근 복구는 별도 검증 과제로 관리합니다.',
            ],
          },
        ],
      },
      {
        slug: 'leadbase',
        title: '리드베이스 — 사업장 데이터 탐색',
        summary: '업종·지역 조건으로 사업장 데이터를 찾고 건수·견적·CSV 제공 흐름을 구성한 ha-e.company의 서비스 미리보기입니다.',
        role: '서비스 기획 · 웹앱·데이터 파이프라인 개발',
        techStack: 'Next.js, TypeScript, PostgreSQL, Python',
        category: 'Business / Product',
        details: [
          {
            title: '구현 범위',
            bullets: [
              '조건 선택부터 서버의 건수·견적 계산, 주문 내역과 다운로드 시점 CSV 생성까지 연결했습니다.',
              '데이터 수집·정제 영역과 주문·회원 영역을 분리하고 이용 조건과 수신거부를 조회 조건에 반영하는 구조입니다.',
            ],
          },
          {
            title: '현재 단계',
            bullets: [
              '서비스 미리보기와 구현 범위를 소개하며, 실결제나 판매 성과를 확정한 단계는 아닙니다.',
            ],
          },
        ],
      },
      {
        slug: 'gear72-content',
        title: 'Gear 72 — 장비 브랜드와 숏폼 제작',
        summary: '생존 장비 브랜드의 콘텐츠 기획·제작·검수·예약 발행과 지표 추적을 연결합니다.',
        role: '브랜딩 · 콘텐츠 기획 · 제작·발행 자동화',
        techStack: 'Python, FFmpeg, YouTube API, Instagram API',
        category: 'Business / Product',
        end: 'present',
        details: [
          {
            title: '제작과 운영',
            bullets: [
              'ha-e.company의 Gear 72 브랜드 안에서 숏폼 제작 파이프라인과 채널별 발행 작업을 관리합니다.',
              '대본·영상·검수·예약 정보를 연결하고 데이터 경로 오류와 세션 중단 시 실행이 끊기는 문제를 정리했습니다.',
            ],
          },
          {
            title: '이어가는 작업',
            bullets: [
              'Instagram은 주기 실행과 자동 예약을 연결했으며, 예약 접수와 실제 게시 결과를 구분해 확인합니다.',
              'YouTube는 세션과 독립적인 상시 실행·복구 구조를 보완하는 단계입니다.',
            ],
          },
        ],
      },
      {
        slug: 'survival-guide',
        title: '생존지침서 — 생활 재난 대비 콘텐츠와 도구',
        summary: '상황별 지침, 준비물과 대비 진단을 제공하고 공식 자료에 근거한 아티클을 편집·발행하는 ha-e.company 웹사이트입니다.',
        role: '서비스 기획 · 웹 개발 · 아티클 편집·운영',
        techStack: 'Next.js, TypeScript, PostgreSQL, Drizzle, Vercel',
        category: 'Business / Product',
        end: 'present',
        details: [
          {
            title: '콘텐츠와 사용 경험',
            bullets: [
              '독자가 집과 생활 여건에 맞춰 준비할 수 있도록 상황별 글과 점검 도구를 연결했습니다.',
              '공식 자료·공개 링크를 확인하는 원고 검수와 예약 발행 절차를 운영합니다.',
            ],
          },
        ],
      },
      {
        slug: 'sonkkeut',
        title: '손끝의휴식 — 감각 휴식 서비스 기획',
        summary: '손끝의 접촉과 감각을 중심으로 휴식 경험을 만드는 공동 사업의 서비스와 브랜드를 기획하고 있습니다.',
        role: '공동 사업 기획 · 서비스 구성 · 브랜딩',
        techStack: '고객 경험, 상담·세션 설계, 브랜드 가이드',
        category: 'Business / Product',
        details: [
          {
            title: '준비한 내용',
            bullets: [
              '상담에서 선호 감각·도구·부위를 고르고 세션을 구성하는 경험을 정리했습니다.',
              '공간과 운영 방식, 가격 초안, 로고·컬러·표현을 검토했습니다. 개점·매출 실적과 구분한 기획 단계입니다.',
            ],
          },
        ],
      },
      {
        slug: 'my-brain-harness',
        title: 'My Brain — 옵시디언 기반 경험 기록 하네스',
        summary: '여러 프로젝트에서 기존 경험을 참고하고, 작업 결과를 주제 문서에 반영한 뒤 독립 검수하는 기록 흐름을 구축했습니다.',
        role: '기록 체계 설계 · 에이전트 연동·검증',
        techStack: 'Python, Obsidian, Markdown, Codex, Claude Code',
        category: 'Automation / Internal Tool',
        start: '2026-11',
        end: 'present',
        details: [
          {
            title: '설계와 구현',
            bullets: [
              '회사·사업·학업·개인 경험을 맥락별로 유지하고 각 프로젝트를 해당 문서에 연결했습니다.',
              '기존 주제 갱신과 새 주제 생성, 상단 속성·도식 판단, 작성 후 독립 검수와 변경 해시 확인을 연결했습니다.',
              '단순 질문은 직접 답하고 새 경험·결정·실제 변경이 있을 때 기록하도록 Codex와 Claude의 공통 규칙을 구성했습니다.',
            ],
          },
        ],
      },
      {
        slug: 'harness-book',
        title: '처음 만나는 하네스 — 비개발자를 위한 AI 입문서',
        summary: 'AI가 실제 업무를 끝내는 데 필요한 자료·도구·기억·승인·검증을 서문과 16개 장으로 집필해 위키독스에 공개했습니다.',
        role: '기획 · 집필 · 공식 자료 조사 · 편집',
        techStack: 'Markdown, WikiDocs, GitHub',
        category: 'Writing / Publishing',
        href: 'https://wikidocs.net/book/21451',
        details: [
          {
            title: '집필 내용',
            bullets: [
              '기획자·마케터·운영 담당자가 코드를 전제하지 않고 읽을 수 있도록 업무 장면, 비교표, 도식과 점검표로 구성했습니다.',
              '에이전트의 실행·중단·복구와 역할 분담, 결과 검증을 설명하고 제품 사례와 교육용 예시를 구분했습니다.',
            ],
          },
          {
            title: '발행과 다음 단계',
            bullets: [
              '온라인 원고는 공개되어 있으며 종이책 출판용 구조 편집과 샘플 원고 준비는 별도 단계로 진행합니다.',
            ],
          },
        ],
      },
      {
        slug: 'hae02y-blog',
        title: 'Hae02y Blog — 기술 경험과 글을 발행하는 사이트',
        summary: '기술 아티클·에세이·이력과 포트폴리오, 앱 런처를 한 사이트에 연결해 직접 개발·운영합니다.',
        role: '웹 설계·개발 · 콘텐츠 발행·운영',
        techStack: 'Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Vercel',
        category: 'Side Project',
        end: 'present',
        details: [
          {
            title: '만든 기능',
            bullets: [
              '한국어·영어 소개와 포트폴리오, 기술 글과 에세이의 탐색·발행 흐름을 구성했습니다.',
              '앱 런처의 다중 페이지·터치·드래그 동작을 모바일 에뮬레이션으로 확인하고 구현과 검증 과정을 글로 남겼습니다.',
            ],
          },
        ],
      },
      {
        slug: 'local-rag-experiment',
        title: '내 블로그로 만든 로컬 RAG 실험',
        summary: 'DNS·TLS 글을 검색 근거로 사용하고 검색 성공과 생성 답변의 정확성을 나누어 평가했습니다.',
        role: '검색·생성 실험 · 평가 · 기술 글 작성',
        techStack: 'Node.js, Ollama, Embeddings, RAG',
        category: 'Side Project',
        start: '2026-11',
        href: 'https://blog.hae02y.me/blog/local-rag-ollama/',
        details: [
          {
            title: '실험과 배운 점',
            bullets: [
              '문서를 분할·임베딩하고 검색한 근거를 로컬 모델에 전달하는 CLI를 구성했습니다.',
              '검색이 맞아도 답변이 틀릴 수 있음을 확인하고, 문서에 없는 정보와 주제 밖 질문을 평가에 포함했습니다.',
            ],
          },
        ],
      },
    ],
  },
};
