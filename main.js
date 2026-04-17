/* Due date & time remaining */
const DUE_DATE = new Date("2026-05-01T18:00:00Z");

function friendlyRemaining(due) {
  const now = new Date();
  const diffMs = due - now;
  const diffSec = Math.round(diffMs / 1000);
  const absSec = Math.abs(diffSec);

  const mins = Math.round(absSec / 60);
  const hours = Math.round(absSec / 3600);
  const days = Math.round(absSec / 86400);

  if (diffSec <= 0) {
    if (absSec < 60)
      return { text: "Overdue by a few seconds", cls: "overdue" };
    if (absSec < 3600)
      return {
        text: `Overdue by ${mins} min${mins !== 1 ? "s" : ""}`,
        cls: "overdue",
      };
    if (absSec < 86400)
      return {
        text: `Overdue by ${hours} hour${hours !== 1 ? "s" : ""}`,
        cls: "overdue",
      };
    return {
      text: `Overdue by ${days} day${days !== 1 ? "s" : ""}`,
      cls: "overdue",
    };
  }

  if (diffSec < 60) return { text: "Due now!", cls: "due-soon" };
  if (diffSec < 3600)
    return {
      text: `Due in ${mins} min${mins !== 1 ? "s" : ""}`,
      cls: "due-soon",
    };
  if (diffSec < 86400 * 2) {
    if (hours < 24) return { text: "Due today", cls: "due-soon" };
    return { text: "Due tomorrow", cls: "due-soon" };
  }
  return { text: `Due in ${days} days`, cls: "upcoming" };
}

function updateTimeRemaining() {
  const el = document.getElementById("time-remaining");
  const text = document.getElementById("time-remaining-text");
  const { text: label, cls } = friendlyRemaining(DUE_DATE);
  text.textContent = label;
  el.className = cls;
  el.setAttribute("aria-label", label);
}

updateTimeRemaining();
setInterval(updateTimeRemaining, 60_000);

/* Checkbox toggle */
const checkbox = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const card = document.querySelector('[data-testid="test-todo-card"]');
const status = document.querySelector('[data-testid="test-todo-status"]');

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    card.classList.add("card--done");
    status.textContent = "✅ Done";
    status.dataset.value = "Done";
    status.setAttribute("aria-label", "Status: Done");
  } else {
    card.classList.remove("card--done");
    status.textContent = "🔵 In Progress";
    status.dataset.value = "In Progress";
    status.setAttribute("aria-label", "Status: In Progress");
  }
});

/* Edit & Delete buttons */
document
  .querySelector('[data-testid="test-todo-edit-button"]')
  .addEventListener("click", () => console.log("edit clicked"));

document
  .querySelector('[data-testid="test-todo-delete-button"]')
  .addEventListener("click", () => alert("Delete clicked"));
