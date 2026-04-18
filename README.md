# HNG Frontend Wizards — Todo Card

Live URL: https://codeweeaver.github.io/hng-tasks/

## Stages

|     Branch         |            Description                |
|--------------------|---------------------------------------|
| `stage-0`          | Initial static todo card              |
| `stage-1a`         | Interactive & stateful card (current) |

`main` always reflects the latest submitted stage and is the GitHub Pages source.

## Stage 1a — What changed from Stage 0

- **Edit mode** — clicking Edit opens an inline form; Save persists changes, Cancel restores previous values and returns focus to Edit button
- **Status control** — dropdown (`Pending` / `In Progress` / `Done`) synced bidirectionally with the checkbox
- **Priority indicator** — coloured left-border accent (red = High, orange = Medium, green = Low)
- **Expand / collapse** — descriptions longer than 120 characters are collapsed by default; a toggle reveals the full text
- **Overdue indicator** — explicit "Overdue" badge appears when the due date has passed and status is not Done
- **Granular time display** — "Due in 2 days", "Due in 3 hours", "Overdue by 1 hour", etc.; updates every 45 seconds; freezes at "Completed" when status is Done
- **Visual state classes** — `is-done` (strikethrough + muted), `is-in-progress` (purple left border), `is-overdue` (red left border)


## Design decisions ##

- Single `state` object + one `render()` function — all DOM writes go through render, making state transitions predictable and easy to trace.
- Description threshold set at 120 characters — short enough to keep the card compact, long enough to show a meaningful preview.
- Priority indicator implemented as an absolutely-positioned left-border strip on the card rather than a dot, because it scales better across card widths and is visually unambiguous.
- Status badge (Stage 0) kept as a read-only display; the new `test-todo-status-control` select is the interactive control, avoiding breaking existing Stage 0 test selectors.


## Accessibility notes

- All edit form fields have `<label for="...">` associations.
- Status control has `aria-label="Change task status"`.
- Expand toggle uses `aria-expanded` and `aria-controls` pointing to the collapsible section's `id`.
- Time remaining element uses `aria-live="polite"` so screen readers announce updates without interrupting.
- Focus management: edit form focuses the title input on open; Save/Cancel return focus to the Edit button.
- Keyboard tab order: Checkbox → Status control → Expand toggle → Edit → Delete; Save → Cancel in edit mode.

## Known limitations

- Delete button shows a browser `alert()` — no actual removal (single-card demo).
- No persistent storage — state resets on page reload.
- Focus trap inside the edit form is not implemented (marked optional in spec).
