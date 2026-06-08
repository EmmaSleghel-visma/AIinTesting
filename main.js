const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const themeToggle = document.querySelector('#theme-toggle');

const STORAGE_KEY = 'todo-items';
const THEME_STORAGE_KEY = 'theme-preference';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';
let todos = loadTodos();
let theme = loadTheme();

applyTheme(theme);
render();

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();

  if (!text) {
    return;
  }

  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  input.value = '';
  saveTodos();
  render();
});

themeToggle.addEventListener('click', () => {
  theme = theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  applyTheme(theme);
  saveTheme();
});

list.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type !== 'checkbox') {
    return;
  }

  const todo = todos.find((item) => item.id === target.dataset.id);
  if (!todo) {
    return;
  }

  todo.completed = target.checked;
  saveTodos();
  render();
});

list.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement) || !target.dataset.deleteId) {
    return;
  }

  todos = todos.filter((item) => item.id !== target.dataset.deleteId);
  saveTodos();
  render();
});

function render() {
  list.innerHTML = '';

  for (const todo of todos) {
    const item = document.createElement('li');
    item.className = 'todo-item';

    const label = document.createElement('label');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.id = todo.id;
    checkbox.checked = todo.completed;

    const text = document.createElement('span');
    text.className = `text${todo.completed ? ' completed' : ''}`;
    text.textContent = todo.text;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.dataset.deleteId = todo.id;
    deleteButton.textContent = 'Delete';

    label.append(checkbox, text);
    item.append(label, deleteButton);
    list.append(item);
  }
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidTodo);
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === DARK_THEME ? DARK_THEME : LIGHT_THEME;
  } catch {
    return LIGHT_THEME;
  }
}

function saveTheme() {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
  }
}

function applyTheme(nextTheme) {
  document.documentElement.dataset.theme = nextTheme;
  themeToggle.textContent = nextTheme === DARK_THEME ? 'Light mode' : 'Dark mode';
  themeToggle.setAttribute('aria-pressed', String(nextTheme === DARK_THEME));
}

function isValidTodo(todo) {
  return (
    typeof todo === 'object' &&
    todo !== null &&
    typeof todo.id === 'string' &&
    typeof todo.text === 'string' &&
    typeof todo.completed === 'boolean'
  );
}
