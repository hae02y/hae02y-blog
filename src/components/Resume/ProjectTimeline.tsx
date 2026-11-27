import React from 'react';
import {FolderKanban} from 'lucide-react';
import type {ResumeProject} from '@/config/me';

type ProjectTimelineProps = {
  projects: ResumeProject[];
};

export default function ProjectTimeline({projects}: ProjectTimelineProps) {
  if (!projects?.length) return null;

  const renderBullet = (bullet: string) => {
    const nodes: React.ReactNode[] = [];
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null = null;

    while ((match = linkPattern.exec(bullet)) !== null) {
      const [fullMatch, text, url] = match;
      const matchIndex = match.index;

      if (matchIndex > lastIndex) {
        nodes.push(bullet.slice(lastIndex, matchIndex));
      }

      nodes.push(
        <a
          key={`${matchIndex}-${text}`}
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {text}
        </a>
      );

      lastIndex = matchIndex + fullMatch.length;
    }

    if (lastIndex < bullet.length) {
      nodes.push(bullet.slice(lastIndex));
    }

    return nodes.length ? nodes : bullet;
  };

  return (
    <div className="resume-projects">
      {projects.map((project) => (
        <article key={`${project.org}-${project.title}`} className="resume-project-card">
          <div className="resume-project-header">
            <div>
              <div className="resume-project-org">{project.org}</div>
              <div className="resume-project-title">
                <FolderKanban
                  className="resume-inline-icon"
                  size={15}
                  color="#3a7bd5"
                  aria-hidden="true"
                />
                {project.title}
              </div>
              {project.techStack ? (
                <div className="resume-project-techstack">{project.techStack}</div>
              ) : null}
            </div>
            {project.period ? <div className="resume-project-period">{project.period}</div> : null}
          </div>
          {project.bulletGroups?.length ? (
            <div className="resume-project-group-list">
              {project.bulletGroups.map((group) => (
                <div key={group.title} className="resume-project-group">
                  <div className="resume-project-group-title">{group.title}</div>
                  <ul className="resume-project-list">
                    {group.bullets.map((bullet) => (
                      <li key={bullet}>{renderBullet(bullet)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : project.bullets?.length ? (
            <ul className="resume-project-list">
              {project.bullets.map((bullet) => (
                <li key={bullet}>{renderBullet(bullet)}</li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}
