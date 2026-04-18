const DESCRIPTION_THRESHOLD = 120;

const PRIORITY_EMOJI = { Low: "🟢", Medium: "🟡", High: "🔴" };
const STATUS_EMOJI = { Pending: "⏳", "In Progress": "🔵", Done: "✅" };

/* State */
const state = {
  title: "Redesign the onboarding flow for mobile users",
  description:
    "Audit the current onboarding screens, identify drop-off points, and create a simplified 3-step flow with clear progress indicators and accessible form controls.",
  priority: "High",
  status: "In Progress",
  dueDate: new Date("2026-05-01T18:00:00Z"),
  isEditing: false,
  isExpanded: false,
};

/* DOM refs */
const card = document.querySelector('[data-testid="test-todo-card"]');
const cardView = document.querySelector(".card-view");
const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');

const checkbox = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const titleEl = document.querySelector('[data-testid="test-todo-title"]');
const priorityBadge = document.querySelector(
  '[data-testid="test-todo-priority"]',
);
const priorityIndicator = document.querySelector(
  '[data-testid="test-todo-priority-indicator"]',
);
const statusBadge = document.querySelector('[data-testid="test-todo-status"]');
const statusControl = document.querySelector(
  '[data-testid="test-todo-status-control"]',
);

const descPreview = document.querySelector(".description-preview");
const descriptionEl = document.querySelector(
  '[data-testid="test-todo-description"]',
);
const expandToggle = document.querySelector(
  '[data-testid="test-todo-expand-toggle"]',
);
const collapsibleSection = document.querySelector(
  '[data-testid="test-todo-collapsible-section"]',
);

const overdueIndicator = document.querySelector(
  '[data-testid="test-todo-overdue-indicator"]',
);
const dueDateEl = document.querySelector('[data-testid="test-todo-due-date"]');
const timeRemainingEl = document.querySelector(
  '[data-testid="test-todo-time-remaining"]',
);
const timeRemainingText = document.getElementById("time-remaining-text");

const editButton = document.querySelector(
  '[data-testid="test-todo-edit-button"]',
);
const editTitleInput = document.querySelector(
  '[data-testid="test-todo-edit-title-input"]',
);
const editDescInput = document.querySelector(
  '[data-testid="test-todo-edit-description-input"]',
);
const editPrioritySelect = document.querySelector(
  '[data-testid="test-todo-edit-priority-select"]',
);
const editDueDateInput = document.querySelector(
  '[data-testid="test-todo-edit-due-date-input"]',
);

let timerInterval = null;

/* Helpers */
function formatDueDate(date) {
  return (
    "Due " +
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  );
}

function toDatetimeLocal(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function friendlyRemaining(due) {
  const now = new Date();
  const diffSec = Math.round((due - now) / 1000);
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

/* Timer */
function updateTimeRemaining() {
  if (state.status === "Done") {
    timeRemainingText.textContent = "Completed";
    timeRemainingEl.className = "done";
    timeRemainingEl.setAttribute("aria-label", "Completed");
    clearTimer();
    return;
  }
  const { text: label, cls } = friendlyRemaining(state.dueDate);
  timeRemainingText.textContent = label;
  timeRemainingEl.className = cls;
  timeRemainingEl.setAttribute("aria-label", label);
}

function startTimer() {
  clearTimer();
  if (state.status !== "Done") {
    timerInterval = setInterval(updateTimeRemaining, 45_000);
  }
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/* Render */
function render() {
  const {
    title,
    description,
    priority,
    status,
    dueDate,
    isEditing,
    isExpanded,
  } = state;
  const isOverdue = dueDate < new Date() && status !== "Done";

  /* edit / view toggle */
  cardView.hidden = isEditing;
  editForm.hidden = !isEditing;

  if (isEditing) return;

  /* title */
  titleEl.textContent = title;

  /* priority badge */
  priorityBadge.textContent = `${PRIORITY_EMOJI[priority]} ${priority}`;
  priorityBadge.dataset.value = priority;
  priorityBadge.setAttribute("aria-label", `Priority: ${priority}`);

  /* priority indicator */
  priorityIndicator.className = `priority-indicator priority-${priority.toLowerCase()}`;
  priorityIndicator.setAttribute("aria-label", `Priority: ${priority}`);

  /* status badge */
  statusBadge.textContent = `${STATUS_EMOJI[status]} ${status}`;
  statusBadge.dataset.value = status;
  statusBadge.setAttribute("aria-label", `Status: ${status}`);

  /* status control */
  statusControl.value = status;

  /* checkbox sync */
  checkbox.checked = status === "Done";

  /* description + expand/collapse */
  descriptionEl.textContent = description;
  const isLong = description.length > DESCRIPTION_THRESHOLD;
  if (isLong) {
    descPreview.textContent = description.slice(0, DESCRIPTION_THRESHOLD) + "…";
    descPreview.hidden = isExpanded;
    collapsibleSection.hidden = !isExpanded;
    expandToggle.hidden = false;
    expandToggle.textContent = isExpanded ? "Show less ▲" : "Show more ▼";
    expandToggle.setAttribute("aria-expanded", String(isExpanded));
  } else {
    descPreview.hidden = true;
    collapsibleSection.hidden = false;
    expandToggle.hidden = true;
  }

  /* overdue indicator */
  overdueIndicator.hidden = !isOverdue;

  /* due date */
  dueDateEl.textContent = formatDueDate(dueDate);
  dueDateEl.setAttribute("datetime", dueDate.toISOString());

  /* card state classes */
  card.classList.toggle("is-done", status === "Done");
  card.classList.toggle("is-in-progress", status === "In Progress");
  card.classList.toggle("is-overdue", isOverdue);

  /* time remaining */
  updateTimeRemaining();
}

/* Event handlers */
checkbox.addEventListener("change", () => {
  state.status = checkbox.checked ? "Done" : "Pending";
  render();
  startTimer();
});

statusControl.addEventListener("change", () => {
  state.status = statusControl.value;
  render();
  startTimer();
});

expandToggle.addEventListener("click", () => {
  state.isExpanded = !state.isExpanded;
  render();
});

editButton.addEventListener("click", () => {
  state.isEditing = true;
  editTitleInput.value = state.title;
  editDescInput.value = state.description;
  editPrioritySelect.value = state.priority;
  editDueDateInput.value = toDatetimeLocal(state.dueDate);
  render();
  editTitleInput.focus();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newTitle = editTitleInput.value.trim();
  if (newTitle) state.title = newTitle;
  state.description = editDescInput.value;
  state.priority = editPrioritySelect.value;
  if (editDueDateInput.value) state.dueDate = new Date(editDueDateInput.value);
  state.isEditing = false;
  state.isExpanded = false;
  render();
  startTimer();
  editButton.focus();
});

document
  .querySelector('[data-testid="test-todo-cancel-button"]')
  .addEventListener("click", () => {
    state.isEditing = false;
    render();
    editButton.focus();
  });

document
  .querySelector('[data-testid="test-todo-delete-button"]')
  .addEventListener("click", () => {
    alert("Delete clicked");
  });

/* Init */
render();
startTimer();
