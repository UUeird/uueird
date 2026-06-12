# UUeird Site Roadmap

## In Progress
- [ ] Releases page animations & modal (branch: `releases`)
  - [x] Artwork grid with hover float/wiggle
  - [x] Click-to-open modal with Bandcamp embed + streaming links
  - [x] Release data in content collections (JSON per release)
  - [x] Sorted by release date
  - [ ] Verify modal layout and feel on mobile

---

## Up Next

### Releases
- [ ] Display release date on modal back face
- [ ] "New" badge for recent releases

### Events
- [ ] Events page — list of upcoming shows with date, venue, location, ticket link
- [ ] Past events archive

### Swampstep
- [ ] Flesh out Swampstep page beyond just the SoundCloud link
  - [ ] Description / about copy
  - [ ] Releases specific to Swampstep label

### About
- [ ] Write about copy for UUeird
- [ ] Artist roster or associated acts section

### Homepage
- [ ] Consider a more visual/editorial homepage (hero image, featured release, next event)

---

## Backlog

### Site-wide
- [ ] Mobile nav (hamburger or slide-out for smaller screens)
- [ ] SEO — og:image, structured data per release
- [ ] Favicon — proper high-res version
- [ ] Analytics (privacy-friendly, e.g. Fathom or Plausible)
- [ ] Convert roadmap to HTML with richer layout

### Releases
- [ ] Filter/sort releases by artist or year
- [ ] Individual release pages (slug-based routing)

### Testing
- [ ] Expand Playwright tests to cover mobile viewports
- [ ] Add test for release sort order

---

## Done
- [x] Astro site scaffolded and deployed to uueird.com via GitHub Pages
- [x] Custom domain with TLS (uueird.com + www)
- [x] `dev` branch workflow — PRs to `main` trigger deploy
- [x] Playwright test suite running in GitHub Actions on PRs to `main`
- [x] Persistent top nav with wordmark + page links
- [x] Footer with social icons (email, SoundCloud, Bandcamp, Mixcloud, Spotify, Discord, X)
- [x] Swampstep page (140-focused side label)
- [x] Releases grid pulled from content collections
- [x] Streaming links researched for all 18 releases
- [x] Bandcamp embed IDs for all 18 releases
- [x] Release dates sourced from Bandcamp and used for sort order
