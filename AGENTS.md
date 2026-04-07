# Repository Guidelines

## Project Structure & Module Organization
- Core app code is in `src/`.
- `src/modules/*` contains business modules (for example `goods`, `order`, `distribution`, `cs`, `base`), usually organized as `config.ts`, `index.ts`, `views/`, and optional `components/`, `store/`, `locales/`.
- `src/cool/*` holds cool-admin framework integration (bootstrap, router, service).
- `src/plugins/*` contains reusable plugin features (CRUD, upload, i18n, theme, editor, etc.).
- Static assets live in `public/`; build helpers are in `build/`.
- Monorepo local packages are under `packages/` (`crud`, `vite-plugin`).

## Build, Test, and Development Commands
- `pnpm install`: install dependencies (Node.js >= 18 recommended).
- `pnpm dev`: start local dev server (default `http://localhost:9000/manage/`).
- `pnpm build`: production build to `dist/`.
- `pnpm build-static`: hash-route static build.
- `pnpm build-demo`: demo-mode build.
- `pnpm preview`: preview built output.
- `pnpm type-check`: run `vue-tsc` project type checks.
- `pnpm lint`: run ESLint with auto-fix.
- `pnpm format`: run Prettier on `src/`.

## Coding Style & Naming Conventions
- Tech stack: Vue 3 + TypeScript + Vite + Element Plus.
- Follow ESLint (`eslint.config.js`) and Prettier; run `pnpm lint && pnpm format` before PR.
- Use tabs for indentation (consistent with current codebase).
- Vue component names are kebab-case (for example `user-list`, `pic-captcha`).
- Keep module additions aligned with existing patterns in `src/modules/<domain>/`.

## Testing Guidelines
- No dedicated unit/e2e test runner is currently wired in root scripts.
- Minimum quality gate for changes: `pnpm type-check` and `pnpm lint`.
- If adding tests, place them close to feature code (example pattern exists in `packages/crud/src/test/`) and propose the run command in your PR.

## Commit & Pull Request Guidelines
- Follow conventional-style commits used in history: `feat(scope): ...`, `chore: ...`, `style: ...` (emoji prefix is optional).
- Keep commits focused and scoped by module (example: `feat(distribution): ...`).
- PRs should include:
  - clear summary and affected modules/paths,
  - linked issue/task ID,
  - screenshots or recordings for UI changes,
  - verification steps (commands run and outcomes),
  - any env/proxy/config changes called out explicitly.
