export const siteConfig = {
  title: 'Hae02y Devlog',
  tagline: '개발자 정해영(hae02y)의 Software Weaver Devlog',
  url: 'https://blog.hae02y.me',
  description: '정해영(hae02y)의 ABOUT, Portfolio, 소프트웨어·백엔드·인프라·DevOps 기술 블로그',
  author: {
    name: '정해영',
    handle: 'hae02y',
    jobTitle: 'Software Weaver',
    bio: 'Software Weaver',
    email: 'godud1118@gmail.com',
    image: '/img/me.jpg',
  },
  algolia: {
    appId: 'BJ0L9RUPZ0',
    apiKey: '9bd9504036390edaf8f3892263884bbc',
    indexName: 'hae02y',
  },
  links: {
    github: 'https://github.com/hae02y',
    linkedin: 'https://linkedin.com/in/hae02y',
    brunch: 'https://brunch.co.kr/@hae02y',
    wikidocs: 'https://wikidocs.net/profile/info/book/39209',
  },
  profile: {
    name: 'Haeyoung,Jeong',
    title: 'Software Weaver.',
    description: '',
    image: '/img/me.jpg',
    email: 'godud1118@gmail.com',
  },
  skills: {
    categories: [
      {
        name: 'Backend',
        skills: ['Java', 'Kotlin', 'Python', 'Node.js', 'Spring Boot', 'Spring Security', 'Spring Batch', 'JPA', 'QueryDSL', 'MyBatis'],
      },
      {
        name: 'Database',
        skills: ['MySQL', 'MariaDB', 'MSSQL', 'PostgreSQL', 'Redis', 'InfluxDB', 'MongoDB'],
      },
      {
        name: 'DevOps',
        skills: ['AWS', 'NCP', 'Linux', 'Docker', 'Kubernetes', 'Nginx', 'CI/CD'],
      },
      {
        name: 'Frontend',
        skills: ['JavaScript', 'TypeScript', 'React.js', 'Next.js', 'Zustand', 'Redux', 'JQuery', 'Axios', 'TailwindCSS'],
      },
    ],
  },
  experience: [
    {
      company: '(주)VEStellaLab',
      position: 'Backend Developer',
      period: '2024.01 - now',
      description: 'Vision-AI 기반 실내 정밀 측위 및 Non-GPS 주차 내비게이션을 서비스하는 스마트 모빌리티 스타트업입니다.',
      responsibilities: [
        {
          title: '백엔드 서비스 설계 및 핵심 비즈니스 로직 구현',
          technologies: ['Java', 'Spring Boot', 'Spring Security', 'JPA', 'Mybatis', 'MySQL', 'MariaDB', 'MSSQL'],
          details: [
            'Spring Boot 기반 RESTful API 설계 및 개발',
            'JPA/Hibernate를 활용한 데이터베이스 연동 및 최적화',
            'Spring Security를 통한 인증/인가 시스템 구현',
            'MyBatis를 활용한 복잡한 쿼리 처리 및 성능 최적화',
          ],
        },
        {
          title: '클라우드 기반 인프라 설계 구축 및 웹 프론트엔드 개발',
          technologies: ['AWS', 'Docker', 'React', 'TypeScript', 'JavaScript'],
          details: [
            'AWS EC2, RDS, S3 등을 활용한 클라우드 인프라 구축',
            'Docker 컨테이너화를 통한 배포 환경 표준화',
            'React와 TypeScript를 활용한 웹 프론트엔드 개발',
            'CI/CD 파이프라인 구축 및 자동화',
          ],
        },
      ],
    },
    {
      company: '(주)조은기술',
      position: 'Network Engineer',
      period: '2020.08 - 2023.04',
      description: '네트워크 장비 및 보안 솔루션을 제공하는 IT 서비스 회사입니다.',
      responsibilities: [
        {
          title: '네트워크 인프라 설계 및 구축',
          technologies: ['Cisco', 'Juniper', 'Linux', 'Python'],
          details: [
            '대규모 기업 네트워크 설계 및 구축',
            '네트워크 보안 정책 수립 및 구현',
            '네트워크 모니터링 시스템 구축',
            'Python 스크립트를 활용한 네트워크 자동화',
          ],
        },
      ],
    },
  ],
  terminalLinks: [
    { name: 'GitHub', url: 'https://github.com/hae02y', icon: 'Github' },
    { name: 'Email', url: 'mailto:godud1118@gmail.com', icon: 'Mail' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/hae02y', icon: 'Linkedin' },
    { name: 'Brunch', url: 'https://brunch.co.kr/@hae02y', icon: 'BookOpen' },
    { name: 'WikiDocs', url: 'https://wikidocs.net/profile/info/book/39209', icon: 'BookOpen' },
  ],
  terminal: {
    helpTitle: 'Available commands',
    paths: {
      blog: '/blog/',
      insight: '/Insight/',
      home: '/',
      about: '/about/',
      me: '/about/',
    },
    helpGroups: [
      ['whoami', 'skills', 'experience', 'projects'],
      ['cd', 'open'],
      ['git', 'blog', 'insight', 'brunch', 'wikidocs', 'lab'],
      ['hello', 'clear', 'help'],
    ],
    commands: [
      { name: 'whoami', usage: 'whoami', description: '자기소개' },
      { name: 'skills', usage: 'skills', description: '기술 스택' },
      { name: 'experience', usage: 'experience', description: '경력 사항' },
      { name: 'projects', usage: 'projects', description: '프로젝트 목록' },
      { name: 'cd', usage: 'cd <path>', description: '페이지 이동 (blog, insight, home, about)' },
      { name: 'open', usage: 'open <url>', description: '외부 URL 열기' },
      { name: 'git', usage: 'git', description: 'GitHub 링크' },
      { name: 'blog', usage: 'blog', description: 'TECH 링크' },
      { name: 'insight', usage: 'insight', description: 'ESSAY 링크' },
      { name: 'brunch', usage: 'brunch', description: '브런치스토리 작가 페이지' },
      { name: 'wikidocs', usage: 'wikidocs', description: '위키독스 저자 페이지' },
      { name: 'lab', usage: 'lab', description: '바이브코딩 연구소 링크' },
      { name: 'hello', usage: 'hello', description: '인사' },
      { name: 'clear', usage: 'clear', description: '터미널 초기화' },
      { name: 'help', usage: 'help', description: '이 도움말' },
    ],
  },
};
