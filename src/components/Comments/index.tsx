'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

export default function Comments() {
  const { theme } = useTheme();

  return (
    <div>
      <Giscus
        id="comments"
        repo="hae02y/hae02y-blog"
        repoId="R_kgDOKoTAvA"
        category="Announcements"
        categoryId="DIC_kwDOKoTAvM4CvOH1"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme={theme === 'dark' ? 'dark_tritanopia' : 'light_tritanopia'}
        lang="ko"
        loading="lazy"
      />
    </div>
  );
}
