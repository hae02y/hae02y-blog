'use client';

import { Mail } from 'lucide-react';

import ExperienceSummary from '@/components/Resume/ExperienceSummary';
import ExperienceTimeline from '@/components/Resume/ExperienceTimeline';
import ProjectTimeline from '@/components/Resume/ProjectTimeline';
import ActivitySection from '@/components/Resume/ActivitySection';
import ResumeLinks from '@/components/Resume/ResumeLinks';
import EducationSection from '@/components/Resume/EducationSection';
import CertificationSection from '@/components/Resume/CertificationSection';
import { meConfig } from '@/config/me';
import type { Locale } from '@/i18n/config';
import { MarkdownRenderer } from '@/lib/markdown-renderer';

export type ResumePageLabels = {
  experience: string;
  keyWork: string;
  automation: string;
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
    keyWork: '주요 업무',
    automation: '개발 생산성 · 업무 자동화',
    activities: '활동',
    education: '교육',
    certifications: '자격증',
    links: '링크',
  },
}: ResumePageProps) {
  const { profile, resume } = data;

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
      <ProjectTimeline projects={resume.projects} />

      <h3>{labels.automation}</h3>
      <ProjectTimeline projects={resume.automation} />

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
