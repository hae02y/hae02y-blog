# Repository agent guide

Use this file as the shared source of truth for coding agents in this repository. Keep responses concise, preserve user-authored content unless the user asks to change it, and do not broaden the requested scope.

## Project snapshot

- Personal technical blog, essays, résumé, and portfolio for hae02y.
- Framework: Next.js 14 App Router, React 18, TypeScript 5.5.
- Production builds are static exports. `next.config.mjs` enables `output: 'export'` when `NODE_ENV=production`.
- Hosting: GitHub Pages through `.github/workflows/ci.yml` on pushes to `main`.
- Styling: Tailwind CSS 3, global styles in `app/globals.css`, shadcn/ui-style Radix components.
- Package manager: Yarn 1.22.22. Use Yarn only.
- Runtime: Node.js 18 or newer; CI uses Node.js 20.
- Primary language is Korean. `/en/about` provides English About content.
- Site URL: `https://blog.hae02y.me`.

## Commands

```bash
yarn             # install dependencies
yarn dev         # copy content images, then start the Next.js dev server
yarn build       # copy images, create the static export, then generate feeds/sitemap
yarn start       # run next start; no dedicated static-export preview script exists
yarn typecheck   # run tsc --noEmit for the whole project
```

- No lint or test framework is configured. Do not invent lint/test commands or add tooling unless requested.
- There is no per-file TypeScript check; use `yarn typecheck`.

## Repository layout

- `app/`: App Router pages, layouts, route-level client components, and global CSS.
- `src/components/`: shared React UI, including blog, docs, portfolio, résumé, terminal, and shadcn components.
- `src/config/site.ts`: site metadata and shared site configuration.
- `src/config/me.ts`: résumé and portfolio source data.
- `src/data/resume.ts`: additional résumé data.
- `src/i18n/`: Korean/English About and portfolio localization.
- `src/lib/`: filesystem content readers, Markdown rendering, feeds, portfolio mapping, and utilities.
- `blog/`: dated technical posts stored as `YYYY-MM-DD-slug/index.md` with adjacent assets.
- `Insight/`: dated essay content with adjacent assets.
- `docs/`: protected documentation content, including nested `index.md` files and `_category_.json` files.
- `content/about/`: Korean and English About Markdown.
- `public/`: committed static assets. `public/blog/` and `public/Insight/` are generated and ignored.
- `scripts/copy-blog-images.mjs`: copies adjacent Blog/Insight images into `public/` before dev/build.
- `scripts/generate-feeds.mjs`: writes sitemap, RSS, and Atom output after a production build.

## Next.js and static-export constraints

- Components are Server Components by default. Add `'use client'` only for hooks, browser APIs, or interactive state.
- Static export cannot rely on runtime API routes, middleware, server actions, request-time data, or other server-only behavior.
- Every dynamic route must remain enumerable at build time with `generateStaticParams()`.
- Preserve `trailingSlash: true` and `images.unoptimized: true` unless the deployment target changes.
- Filesystem reads in `src/lib/` run at build time. Guard missing files and optional frontmatter rather than throwing in render paths.

## Imports and TypeScript

- Prefer strict types and avoid `any`. Reuse existing domain types and guard optional data.
- Import order: React/types, external packages, Next.js packages, site aliases, then relative imports.
- Available aliases from `tsconfig.json`:
  - `@/*` → `src/*`
  - `@/components/*` → `src/components/*`
  - `@/ui/*` → `src/components/ui/*`
  - `@/lib/*` → `src/lib/*`
  - `@/data/*` → `src/data/*`
  - `@/config/*` → `src/config/*`
- Use `cn` from `@/lib/utils` when conditional Tailwind classes need merging.
- Functional components only. Keep hooks at the top level and preserve existing props when wrapping components.

## Styling and UI

- Prefer Tailwind utilities and existing CSS variables. Reuse established monochrome, monospace, and minimal UI patterns.
- Preserve `important: true` and the accordion animation definitions in `tailwind.config.js`.
- Dark mode uses `next-themes`, Tailwind `dark:` classes, and `[data-theme="dark"]`. Verify both light and dark themes after color/background changes.
- Global typography in `app/globals.css` is intentionally strong. Avoid local overrides unless the component needs them.
- Fonts use Pretendard for body text, JetBrains Mono for code, and IBM Plex Mono for the brutal/terminal style. Do not move referenced font assets without updating their URLs.
- Keep interactive controls keyboard-accessible, preserve semantic elements, and retain visually hidden labels/titles where present.
- Keep images appropriately sized and lazy-load noncritical images where practical.

## Content behavior

- Blog post frontmatter commonly includes `slug`, `title`, `authors`, `tags`, and optional `comments`. Comments default to enabled unless `comments: false`.
- Keep Blog and Insight assets beside their Markdown source and use relative paths. Edit the source asset, not generated files under `public/blog/` or `public/Insight/`.
- Content loaders accept nested `index.md` files and standalone Markdown files. Preserve `_category_.json` files when editing docs sections.
- `src/lib/blog.ts` and `src/lib/docs.ts` derive descriptions and metadata when frontmatter is missing; keep graceful fallbacks.
- About copy lives in `content/about/{ko,en}.md`. Portfolio/résumé facts live mainly in `src/config/me.ts` and their localized mappings in `src/i18n/`.
- Do not rewrite user-authored posts, essays, résumé claims, or portfolio facts unless explicitly requested.

## Route-specific behavior

- `src/components/Navbar.tsx` hides the navbar on `/about`, `/me`, and `/en/about` routes. Keep hooks above route-based early returns.
- `/docs/*` checks `sessionStorage.authToken`; `/login` sets it after comparing the configured client-side password.
- The docs login is client-side gating in a static site, not server-side access control. Do not present it as protection for secrets.
- Authentication values may come from `NEXT_PUBLIC_AUTH_ID` and `NEXT_PUBLIC_AUTH_PW`, with source-level fallbacks. Never print, log, or duplicate credential values, and do not change them unless asked.
- Giscus comments are implemented in `src/components/Comments` and rendered from `src/components/blog/BlogPostContent.tsx`.

## Build and deployment

- `.github/workflows/ci.yml` installs with `yarn install --frozen-lockfile`, builds `out/`, adds `out/.nojekyll`, and deploys through GitHub Pages.
- `static/` contains legacy source assets while active public assets are served from `public/`; do not move or delete either tree casually.
- Run `yarn typecheck` after TypeScript changes.
- Run `yarn build` for routing, content pipeline, configuration, dependency, or deployment-impacting changes.
- For visual changes, preview with `yarn dev` and check responsive layout plus light/dark themes when feasible.

## Error handling, privacy, and Git

- Prefer null checks and usable fallbacks for missing metadata, images, configuration, or content.
- Avoid console logging unless it is actionable. Never log environment values, credentials, or private content.
- Preserve unrelated user changes. Never reset or overwrite them.
- The user has explicitly requested automatic deployment for this repository: after each completed and verified task, commit only the relevant files, push the commit to `main`, and confirm the GitHub Pages workflow succeeds. Do not stage unrelated files.
- Keep `.env*.local`, generated output, caches, and secrets out of version control.
- If core configuration must change, preserve the current Next.js static-export behavior and Tailwind dark-mode/`important` settings unless the request requires otherwise.

## Before finishing

- Review the diff for accidental content or generated-file changes.
- Run the checks appropriate to the files changed; do not claim unavailable tests or linting.
- Report changed paths and commands run without dumping large diffs.

## Blog Writing Requirements
- 앞으로 RAG·모델·데이터 실험은 Python을 기본으로 작성하고, 실행 환경·의존성·평가 스크립트도 Python 기준으로 구성한다. 기존 실험의 언어 전환은 요청된 범위에 따라 진행한다.
- 기술 블로그 글은 경험을 바탕으로 기술 중심으로 작성한다.
- 개념 소개만 하지 말고 실제 구현 흐름, 데이터 구조, 상태 전이, API 요청·응답 또는 코드 예시를 포함한다.
- 플랫폼이나 도구의 차이와 운영 중 발생할 수 있는 실패·재시도·복원·보안 경계를 설명한다.
- 독자가 바로 적용할 수 있도록 구체적인 예시, 표, 체크리스트, 공식 문서 링크를 함께 제공한다.
- 사용자의 실제 경험에서 확인되지 않은 프로젝트명·버전·수치·구현 사실은 지어내지 않는다.

## Generated Image Guidelines

블로그의 설명용 생성 이미지는 토스 기술 발표자료(SLASH)의 정보 배치와 시각적 위계를 참고해 **간결하게, 꼭 필요한 핵심이 먼저 보이도록** 만든다. 아래는 이 저장소의 제작 기준이며 토스의 공식 디자인 규정은 아니다. 참고 자료: [SLASH 24 — 토스가 오프라인 결제를 빠르고 안정적으로 혁신하는 방법](https://static.toss.im/slash24/QR/slash24-03.pdf). 참고 대상은 설명 방식과 구성 원리이며 토스 로고·슬라이드·브랜드 자산을 그대로 복제하지 않는다.

### 제목별 이미지 필요성 판단

- 글 작성·수정 전에 H1·H2·H3를 순서대로 훑고, 각 제목에 대해 `이미지 필요 / 불필요`, 이유, 이미지가 전달할 핵심 한 문장, 배치 위치를 작업 메모에 정리한다. frontmatter의 글 제목도 H1로 취급한다. 이 메모를 본문에 노출할 필요는 없다.
- 모든 제목 아래에 이미지를 기계적으로 넣지 않는다. 글로 읽을 때보다 구조·흐름·차이·인과관계를 더 빠르게 이해할 수 있는 경우에 생성한다.

| 제목 수준 | 이미지가 유용한 경우 | 생략하는 경우 |
| --- | --- | --- |
| H1 | 글 전체를 이해하는 데 필요한 시스템 개요·핵심 문제·전체 흐름 | 장식용 표지만 추가되거나 첫 H2 이미지와 같은 내용일 때 |
| H2 | 처리 흐름, 구성 요소 관계, 변경 전후, 상태 전이, 실패·복구 경로 | 짧은 개념 설명, 설치 명령, 체크리스트, 표만으로 충분할 때 |
| H3 | 상위 그림에서 읽기 어려운 특정 단계의 내부 동작·예외·비교를 확대 | 상위 그림을 반복하거나 단순 코드 예시를 이미지로 옮길 때 |

- H1 개요와 H2·H3 상세 그림은 서로 다른 질문에 답하게 한다. 밀도가 높으면 글자를 줄이지 말고 개요와 상세 또는 단계별 그림으로 분리한다.

### 간결한 화면 구성

- **한 이미지에 한 가지 핵심 메시지**를 둔다. 독자가 먼저 봐야 할 요소를 크기·위치·명도로 명확히 구분한다.
- 넓은 여백, 정렬된 배치, 큰 한글 산세리프 라벨을 사용한다. 제목 → 핵심 도식 → 짧은 보조 설명의 위계를 유지한다.
- 밝은 중립 배경과 진한 글자를 기본으로 하고 강조색은 보통 한 가지, 의미 구분이 필요할 때만 두 가지까지 사용한다. 같은 역할은 같은 색으로 표시하며 색만으로 상태를 구분하지 않는다.
- 핵심 노드는 가능하면 3~5개로 묶고, 각 라벨은 짧은 명사나 동사로 쓴다. 본문 문단·긴 코드·전체 표를 이미지 안에 욱여넣지 않는다. 수치·버전·모델명도 해당 그림을 이해하는 데 필요한 것만 넣는다.
- 평면적인 도형과 가는 연결선을 우선한다. 과한 그라데이션, 입체 아이콘, 두꺼운 테두리, 큰 배지, 장식용 캐릭터, 의미 없는 아이콘을 피한다.
- 흐름은 좌→우 또는 위→아래로 통일하고, 화살표의 출발·도착·분기·합류를 명확히 표시한다. 선이 텍스트를 가리거나 실제 구현 단계를 건너뛰지 않게 한다.
- 가로·세로 비율은 내용과 블로그 본문 폭에 맞춘다. 모바일 본문 폭에서도 핵심 라벨과 흐름이 읽혀야 한다. 복잡한 한 장을 축소해 넣는 대신 여러 장으로 나눈다.

### 생성·검수·게시

- 설명용 생성 이미지를 만들 때는 `imagegen` 스킬과 이미지 생성 도구를 사용한다. 사용자가 이미지 생성을 요청한 경우 코드로 그린 대체물을 제공하지 않는다. 정확한 실험 수치의 그래프는 원본 데이터로 그리는 것을 우선하며 생성 이미지로 측정 결과를 꾸며내지 않는다.
- 프롬프트에 `대상 제목`, `핵심 메시지 한 문장`, `필수 요소와 정확한 라벨`, `요소 간 관계·화살표`, `강조할 요소`, `생략할 정보`, `비율·모바일 가독성`, `간결한 시각 스타일`을 명시한다. 단순히 “토스 스타일”이라고만 요청하지 않는다.
- 생성 후 이미지를 직접 보고 한글 오탈자, 누락·중복, 화살표 방향, 경계·상태 표현, 수치와 본문 일치, 모바일에서의 글자 크기를 검수한다. 예쁜 그림이어도 동작 설명이 틀리면 수정 후 사용한다.
- 이미지가 필요하다고 판단한 절에 실제로 삽입하고 짧은 설명과 의미 있는 alt 텍스트를 붙인다. 중요한 사실과 설명은 본문에도 남겨 이미지에만 의존하지 않게 한다.
- 원본 이미지는 해당 Markdown 옆에 저장하고 상대 경로로 연결한다. 생성 프롬프트도 재현 가능한 위치에 기록한다. DB 게시·정적 자산 복사·운영 이미지 URL까지 확인한 뒤 완료를 보고한다.
