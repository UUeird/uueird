---
name: release
description: "Ship open work: commit, push, open the draft PR to main, wait for CI to mark it ready, merge, confirm the GitHub Pages deploy, move the board ticket. Use when the user says 'release', 'ship it', 'land this'. The gate for moving the board ticket to done is the Deploy run publishing the merge commit and the live site serving it."
---

Take one piece of open work from branch to merged, deployed, and cleaned up.
Two workflows matter: `.github/workflows/test.yml` ("Tests") runs Playwright on
every push to a PR against `main` and flips the PR between draft and ready, and
`.github/workflows/deploy.yml` ("Deploy to GitHub Pages") builds and deploys on
pushes to `main`. This is a single-PR flow with no batching.

### 1. Finish and push

- If there's uncommitted or unpushed work, commit it. **Never push known-red** —
  run `npm test` first and fix any failure in the same commit before pushing.
  For a visual change, also check it in `npm run dev` at desktop and phone
  widths.
- Open the PR if there isn't one: `gh pr create --draft --base main`. Otherwise
  refresh the body (`gh pr edit`) so it describes everything on the branch.

### 2. Wait for CI, then merge

- `gh pr checks <PR#> --watch`. CI marks the PR ready when tests pass and puts
  it back in draft when they fail. Never mark it ready by hand.
- If it's red, fix it on the branch and push again; don't merge.
- Once it's ready and mergeable (`gh pr view <PR#> --json isDraft,mergeable`),
  merge with `gh pr merge <PR#> --merge`. Add `--delete-branch` only for a
  feature branch, never for `dev`.

### 3. Clean up

```
git checkout dev && git pull --ff-only && git merge --ff-only origin/main
```

That brings `dev` level with `main`'s merge commit. For a feature branch, also
`git branch -d <branch>`; if that *refuses*, stop and check why instead of
forcing `-D`.

### 4. Confirm the deploy

```
gh run list --workflow deploy.yml --limit 1
curl -s -o /dev/null -w '%{http_code}\n' https://uueird.com/
```

The run's `headSha` (`gh run view <id> --json headSha`) should be the merge
commit. Also check any page the change touched (`/releases/`, `/swampstep/`).
If the deploy fails or a page doesn't return 200, stop and report — don't move
the board ticket. This, not the merge, is the real "done" signal.

### 5. Move the board ticket

Only after step 4 passes: if the released work corresponds to a story/subtask
on the tada board, move it to `done`: `mcp__tada__set_status` for the whole
story, or `mcp__tada__set_subtask_status` for just the subtask.

---

## After the release

Report what shipped: PR number, merged, deployed, branch cleaned up. Don't
claim a branch is done unless it's actually merged, and don't move the board
ticket until step 4's check passes.
