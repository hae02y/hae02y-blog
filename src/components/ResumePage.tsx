'use client';

import { Mail } from 'lucide-react';

import ExperienceSummary from '@/components/Resume/ExperienceSummary';
import ExperienceTimeline from '@/components/Resume/ExperienceTimeline';
import ProjectTimeline from '@/components/Resume/ProjectTimeline';
import ActivitySection from '@/components/Resume/ActivitySection';
import ResumeLinks from '@/components/Resume/ResumeLinks';
import EducationSection from '@/components/Resume/EducationSection';
import CertificationSection from '@/components/Resume/CertificationSection';
import { meConfig, type ContributionArea } from '@/config/me';
import type { Locale } from '@/i18n/config';
import { MarkdownRenderer } from '@/lib/markdown-renderer';

export type ResumePageLabels = {
  experience: string;
  keyWork: string;
  contributionAreas: Record<ContributionArea, string>;
  axSummary: string;
  activities: string;
  education: string;
  certifications: string;
  links: string;
};

type ResumePageProps = {
  aboutContent?: string;
  labels?: ResumePageLabels;
  data?: typeof meConfig;
  locale?: Locale;
};

export default function ResumePage({
  aboutContent,
  data = meConfig,
  locale = 'ko',
  labels = {
    experience: '경력',
    keyWork: '주요 기여',
    contributionAreas: { product: '제품·서비스 개발', ax: 'AX·업무 체계 구축', assurance: '보안·인증 체계', operations: '인프라·현장 운영' },
    axSummary: '사내 AX 구축을 추진하며, AI 활용과 반복 업무 개선을 함께 다룹니다.',
    activities: '활동',
    education: '교육',
    certifications: '자격증',
    links: '링크',
  },
}: ResumePageProps) {
  const { profile, resume } = data;
  const projects = [...resume.projects, ...resume.automation];
  const areas: ContributionArea[] = ['product', 'ax', 'assurance', 'operations'];

  return (
    <div className="resume-document">
      <header className="resume-profile">
        <div className="resume-identity">
          <h1>{profile.name}</h1>
          <address className="resume-contact">
            <a
              className="resume-email"
              href={`mailto:${profile.email}`}
              aria-label={locale === 'en' ? `Email ${profile.name}: ${profile.email}` : `${profile.name}에게 이메일 보내기: ${profile.email}`}
            >
              <Mail size={16} aria-hidden="true" />
              <span className="resume-email-label">Email</span>
              <span className="resume-email-value">{profile.email}</span>
            </a>
          </address>
        </div>
        <div className={`resume-introduction${aboutContent ? ' resume-introduction-authored' : ''}`}>
          {aboutContent ? (
            <MarkdownRenderer content={aboutContent} />
          ) : (
            profile.summary.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))
          )}
        </div>
      </header>

      <h2>{labels.experience} <ExperienceSummary items={resume.experiences} locale={locale} /></h2>
      <ExperienceTimeline items={resume.experiences} />

      <h2>{labels.keyWork}</h2>
      {areas.map(area => (
        <section key={area} className="resume-contribution" aria-labelledby={`contribution-${area}`}>
          <h3 id={`contribution-${area}`}>{labels.contributionAreas[area]}</h3>
          {area === 'ax' && <p className="resume-contribution-summary">{labels.axSummary}</p>}
          <ProjectTimeline projects={projects.filter(project => project.contributionArea === area)} />
        </section>
      ))}

      <h2>{labels.education}</h2>
      <EducationSection items={resume.education} />

      <h2>{labels.activities}</h2>
      <ActivitySection items={resume.activities} />

      <h2>{labels.certifications}</h2>
      <CertificationSection items={resume.certifications} />

      <h2>{labels.links}</h2>
      <ResumeLinks links={resume.links} />
    </div>
  );
}
