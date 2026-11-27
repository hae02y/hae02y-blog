import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { aboutPaths, aboutUrls, getAlternateLocale, type Locale } from './config';
import type { AboutPageLabels } from '@/components/about/types';

type AboutI18nConfig = {
  lang: Locale;
  path: string;
  url: string;
  switchLabel: string;
  switchHref: string;
  metadata: {
    title: string;
    description: string;
    author: string;
    locale: string;
    firstName: string;
    lastName: string;
    keywords: string[];
  };
  jsonLd: {
    name: string;
    alternateName: string[];
    personName: string;
    personAlternateName: string[];
    personDescription: string;
    knowsAbout: string[];
  };
  labels: AboutPageLabels;
};

export const aboutI18n: Record<Locale, AboutI18nConfig> = {
  ko: {
    lang: 'ko',
    path: aboutPaths.ko,
    url: aboutUrls.ko,
    switchLabel: 'EN',
    switchHref: aboutPaths.en,
    metadata: {
      title: '개발자 정해영 | 백엔드 개발자 ABOUT - hae02y',
      description: '정해영(hae02y)은 Java/Spring Boot 기반 백엔드 개발자입니다. AWS, Kubernetes, AI/인프라, DevOps 환경에서 시스템 설계, 운영 자동화, Portfolio를 정리했습니다.',
      author: '정해영',
      locale: 'ko_KR',
      firstName: '해영',
      lastName: '정',
      keywords: [
        '정해영',
        '개발자 정해영',
        '정해영 개발자',
        '정해영 백엔드',
        '백엔드 정해영',
        '정해영 백엔드 개발자',
        '정해영 포트폴리오',
        '정해영 이력서',
        'hae02y',
        'hae02y 개발자',
        'hae02y portfolio',
        'Haeyoung Jeong',
        'Backend Developer',
        'Backend Engineer',
        'Spring Boot',
        'Java',
        'AWS',
        'Kubernetes',
        'DevOps',
      ],
    },
    jsonLd: {
      name: '개발자 정해영 | 백엔드 개발자 ABOUT',
      alternateName: ['개발자 정해영', '정해영 개발자', '백엔드 정해영', '정해영 백엔드 개발자', 'hae02y 개발자', 'Haeyoung Jeong developer'],
      personName: '정해영',
      personAlternateName: ['hae02y', 'Haeyoung Jeong', '개발자 정해영', '정해영 개발자', '백엔드 정해영'],
      personDescription: 'Java, Spring Boot, AWS, Kubernetes, AI/인프라 기반 시스템을 설계하고 운영하는 백엔드 개발자',
      knowsAbout: ['Java', 'Spring Boot', 'Spring Security', 'JPA', 'MyBatis', 'AWS', 'NCP', 'Docker', 'Kubernetes', 'Backend Development', 'Infra', 'DevOps', 'AI', 'MLOps'],
    },
    labels: {
      resume: 'Resume',
      portfolio: 'Portfolio',
      professional: '회사 프로젝트',
      independent: '개인 활동',
      tocKicker: '탐색',
      tocTitle: '목차',
      collapse: '접기',
      expand: '펼치기',
      exportPdf: 'PDF로 내보내기',
      resumeHeadings: {
        experience: '경력',
        keyWork: '주요 기여',
        contributionAreas: { product: '제품·서비스 개발', ax: 'AX·업무 체계 구축', assurance: '보안·인증 체계', operations: '인프라·현장 운영' },
        axSummary: '사내 AX 구축을 추진하며, AI 활용과 반복 업무 개선을 함께 다룹니다.',
        activities: '활동',
        education: '교육',
        certifications: '자격증',
        links: '링크',
      },
    },
  },
  en: {
    lang: 'en',
    path: aboutPaths.en,
    url: aboutUrls.en,
    switchLabel: 'KO',
    switchHref: aboutPaths.ko,
    metadata: {
      title: 'Haeyoung Jeong | Backend Developer ABOUT - hae02y',
      description: 'Haeyoung Jeong, also known as hae02y, is a backend developer working across Java, Spring Boot, cloud infrastructure, DevOps, AI automation, operations, and a broader portfolio of practical systems.',
      author: 'Haeyoung Jeong',
      locale: 'en_US',
      firstName: 'Haeyoung',
      lastName: 'Jeong',
      keywords: [
        'Haeyoung Jeong',
        'hae02y',
        'hae02y developer',
        'hae02y portfolio',
        'backend developer',
        'backend engineer',
        'Java developer',
        'Spring Boot developer',
        'cloud infrastructure',
        'DevOps',
        'Kubernetes',
        'AWS',
        'AI automation',
      ],
    },
    jsonLd: {
      name: 'Haeyoung Jeong | Backend Developer ABOUT',
      alternateName: ['hae02y developer', 'Haeyoung Jeong developer', 'Backend developer hae02y'],
      personName: 'Haeyoung Jeong',
      personAlternateName: ['hae02y', '정해영', 'Backend developer hae02y'],
      personDescription: 'Backend developer designing and operating systems across Java, Spring Boot, AWS, Kubernetes, AI automation, and infrastructure.',
      knowsAbout: ['Java', 'Spring Boot', 'AWS', 'NCP', 'Docker', 'Kubernetes', 'Backend Development', 'Infrastructure', 'DevOps', 'AI Automation', 'MLOps'],
    },
    labels: {
      resume: 'Resume',
      portfolio: 'Portfolio',
      professional: 'Professional',
      independent: 'Independent',
      tocKicker: 'Navigate',
      tocTitle: 'On this page',
      collapse: 'Collapse',
      expand: 'Expand',
      exportPdf: 'Export PDF',
      resumeHeadings: {
        experience: 'Experience',
        keyWork: 'Key Contributions',
        contributionAreas: { product: 'Product & Service Development', ax: 'AI Transformation & Workflows', assurance: 'Security & Certification', operations: 'Infrastructure & Field Operations' },
        axSummary: 'Work on internal AI transformation alongside AI adoption and improvements to recurring tasks.',
        activities: 'Activities',
        education: 'Education',
        certifications: 'Certifications',
        links: 'Links',
      },
    },
  },
};

export function createAboutMetadata(locale: Locale, options: { noindex?: boolean } = {}): Metadata {
  const config = aboutI18n[locale];

  return {
    title: config.metadata.title,
    description: config.metadata.description,
    authors: [{ name: config.metadata.author, url: config.url }],
    creator: config.metadata.author,
    publisher: config.metadata.author,
    category: 'Developer Profile',
    keywords: config.metadata.keywords,
    ...(options.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type: 'profile',
      locale: config.metadata.locale,
      siteName: siteConfig.title,
      title: config.metadata.title,
      description: config.metadata.description,
      url: config.url,
      firstName: config.metadata.firstName,
      lastName: config.metadata.lastName,
      username: siteConfig.author.handle,
      images: [{ url: `${siteConfig.url}/img/me.jpg`, width: 800, height: 800, alt: `${config.metadata.author} profile` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.metadata.title,
      description: config.metadata.description,
      images: [`${siteConfig.url}/img/me.jpg`],
    },
    alternates: {
      canonical: options.noindex ? aboutUrls.ko : config.url,
      languages: {
        ko: aboutUrls.ko,
        en: aboutUrls.en,
        'x-default': aboutUrls.ko,
      },
    },
  };
}

export function createAboutJsonLd(locale: Locale) {
  const config = aboutI18n[locale];
  const alternateLocale = getAlternateLocale(locale);

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${config.url}#profilepage`,
    url: config.url,
    name: config.jsonLd.name,
    alternateName: config.jsonLd.alternateName,
    description: config.metadata.description,
    inLanguage: locale,
    isPartOf: { '@id': `${siteConfig.url}#website` },
    mainEntity: {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: config.jsonLd.personName,
      alternateName: config.jsonLd.personAlternateName,
      jobTitle: 'Backend Developer',
      description: config.jsonLd.personDescription,
      url: config.url,
      image: `${siteConfig.url}/img/me.jpg`,
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.linkedin,
        siteConfig.links.brunch,
      ],
      knowsAbout: config.jsonLd.knowsAbout,
    },
    workTranslation: {
      '@type': 'ProfilePage',
      '@id': `${aboutI18n[alternateLocale].url}#profilepage`,
      url: aboutI18n[alternateLocale].url,
      inLanguage: alternateLocale,
    },
  };
}
