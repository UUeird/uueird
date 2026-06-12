# UUeird — Claude Code Guidelines

## Branch & PR Workflow

- All work happens on `dev` or a feature branch cut from `dev`
- `main` is the production branch — merges to `main` trigger a GitHub Pages deploy
- Open PRs in **draft mode** by default: `gh pr create --draft --base main`
- CI runs Playwright tests on every push to an open PR (draft or not)
- CI automatically marks PR **ready for review** when tests pass (via GitHub GraphQL API)
- CI automatically converts PR back to **draft** when tests fail
- Do not manually mark a PR ready — let CI do it
- Never push directly to `main`

## Testing

- Tests live in `tests/site.spec.ts`, run with `npm test`
- Tests run against the local dev server (auto-started by Playwright config on port 4322)
- Run the full suite locally before pushing: `npm test`
- Tests cover Chromium, Firefox, and WebKit
- Use `main h1` (not bare `h1`) in locators — Astro's dev toolbar injects extra h1s in the page

## Content Collections

- Release data lives in `src/content/releases/` — one JSON file per release
- Schema is defined in `src/content/config.ts`
- To add a new release: drop a new JSON file in `src/content/releases/` with fields:
  - `title`, `artist`, `artwork` (Bandcamp CDN URL)
  - `date` (YYYY-MM-DD, sourced from Bandcamp release page)
  - `bandcamp_embed` — `{ type: "album" | "track", id: "numeric_id" }`
  - `links` — object with any of: `bandcamp`, `spotify`, `apple_music`, `soundcloud`, `amazon_music`, `beatport`
- Releases are sorted newest-first by `date` on the releases page

## Code Style

- No comments unless the why is non-obvious
- No emojis
- Prefer editing existing files over creating new ones
- No backwards-compat shims or unused code — delete it

## Deploy

- Push to `main` → GitHub Actions builds Astro → deploys to GitHub Pages
- Custom domain: uueird.com (CNAME file in `public/` ensures domain survives deploys)
- The `public/CNAME` file must not be deleted
