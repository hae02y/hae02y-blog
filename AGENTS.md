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
