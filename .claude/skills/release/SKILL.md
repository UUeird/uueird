---
name: release
description: "Ship open work, one PR or (with no args) every open PR checked once on one integration branch: commit, push, open the draft PR to main, wait for CI to mark it ready, merge, confirm the GitHub Pages deploy, move the board ticket. Use when the user says 'release', 'ship it', 'land this'. The gate for moving the board ticket to done is the Deploy run publishing the merge commit and the live site serving it."
---

Take open work from branch to merged, deployed, and cleaned up: one PR, or every open PR at once.
Two workflows matter: `.github/workflows/test.yml` ("Tests") runs Playwright on
every push to a PR against `main` and flips the PR between draft and ready, and
`.github/workflows/deploy.yml` ("Deploy to GitHub Pages") builds and deploys on
pushes to `main`. Several PRs release together, checked once (next section).

## Several PRs at once: one integration branch, checked once

With no args, release **every open PR** (`gh pr list`, oldest first, a stacked
PR right after its base; skip bot PRs) together, checked once on one tree
holding them all. With one PR, the steps below are the whole flow.

1. **Finish and push each PR** (step 1 below), without running its checks yet.
2. **Build the integration branch.** Merge every PR branch onto `main`'s tip,
   in release order, on a local scratch branch that is never pushed:
   ```
   git checkout main && git pull --ff-only
   git checkout -b release-verify
   git merge --no-edit <branch-1>
   git merge --no-edit <branch-2>   # …and so on
   ```
   **On a conflict**, `git merge --abort` and fix it on the later PR's branch
   (merge `main` or the earlier PR's branch into it there), push, delete
   `release-verify` (`git checkout main && git branch -D release-verify`) and
   rebuild. A resolution made only on the scratch branch would never land.
3. **Check it once, on `release-verify`:** `npm test`. **Never merge known-red**:
   find which PR a failure belongs to, fix it on that PR's branch, push,
   rebuild the integration branch and check again.
4. **Merge every PR in order**, only after step 3 passes, and CI has marked each PR ready (its own run of the tests on that PR). If
   another open PR is stacked on a branch, retarget it to `main` first
   (`gh pr edit <stacked> --base main`): deleting a PR's base branch closes
   that PR. Merge each with `gh pr merge <PR#> --merge`.
5. **Confirm what landed is what was tested:**
   ```
   git checkout main && git pull --ff-only
   git diff --stat release-verify main   # must print nothing
   ```
   If it isn't empty, `main` moved while you were checking: stop, rebuild the
   integration branch for the PRs still open and check again. Once it's empty,
   `git branch -D release-verify` (the one `-D`: a local scratch branch that
   never had a remote), and clean up each PR branch (step 3 below).
6. **Confirm the deploy once**, for the last merge commit, which holds every PR (step 4 below; earlier runs may be superseded). Then move the board ticket of
   every PR (step 5 below) and report the check run once, then one line per PR.

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
