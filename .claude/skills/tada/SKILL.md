---
name: tada
description: "The core build loop. Look at the prod board, pick up the next story marked In Progress, and start work on it — prioritizing any In Progress tasks within it."
---

The prod board (project `uueird`, at `https://app.tada-ai.app`) is the
source of truth. Always read the live board.

1. **Read the live board.** Use the `tada` MCP `view_board` tool scoped to
   the columns this loop needs: `status: ["in-progress", "planned"]`. That keeps
   the output small on a large board (the Idea/Done columns are the bulk) while
   still showing In Progress and the Planned fallback. Do **not** pass a `type`
   filter — In Progress items can be any type, and a `type`-filtered view will
   miss them. If you later need the whole board (e.g. searching Idea/Done), call
   `view_board` again with no `status`.

2. **Find the In Progress story.**
   - If the In Progress column is **empty**, say so. Don't invent work — report
     what's in Planned and ask whether to pull one forward.
   - If there's exactly one, that's the story.
   - If there's more than one, pick the one at the top of the list.

3. **Pick what to work on within the story.**
   - If the story has any **tasks (subtasks) marked `in-progress`**, prioritize
     those — work the in-progress task(s) first.
   - Otherwise take the story as a whole (work its `planned` subtasks in order). If the story has no subtasks, work the story itself. If the story has a subtask that looks too complex to complete in one session, ask for guidance before starting.

4. **Mark it In Progress, then start.** Briefly state which story (and subtask,
   if any) you're picking up, and move it to In Progress before beginning
   (`set_subtask_status … in-progress` for a subtask, `set_status … in-progress`
   for a whole Story not already there). Follow the normal repo workflow: branch
   from `dev` (never work on `main`; every push to it deploys), run `npm test`
   to check the change, commit/PR proactively.

5. **Move the ticket when done**: `set_subtask_status … done` for a subtask as
   soon as its work is finished; `set_status … done` for the whole Story only
   once it has shipped (see `/release`).

Shorthand used elsewhere: **BV** = Board View, **SDV** = Story Detail View.
