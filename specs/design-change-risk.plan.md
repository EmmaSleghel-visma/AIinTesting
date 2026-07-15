# Design-Change Risk & Test Plan

**Context:** Significant design changes are coming to the Todo app (vanilla JS: `index.html`, `main.js`, `style.css`). This plan identifies where risk concentrates, what the current test suite covers, the gaps, and the effort to close them. Design changes overwhelmingly touch **DOM structure, CSS, and theming** — so the risk ranking is weighted toward what a visual/structural refactor is most likely to break.

Date: 2026-07-15 · Analyzed by: risk review of `main.js`, `index.html`, `style.css`, `tests/todo.spec.ts`.

---

## 1. What exists today

**Test infrastructure:** Playwright E2E only. No unit test runner is wired up (a `vitest-unit` skill exists but there is no vitest config or `*.test.js`).

**`tests/todo.spec.ts` — 11 tests, all passing-shaped, good AAA structure:**

| # | Test | Feature covered |
|---|------|-----------------|
| 1 | empty list on load | initial render |
| 2 | add a todo | add flow |
| 3 | add multiple todos | add flow (count) |
| 4 | reject whitespace-only todo | input validation |
| 5 | mark completed | toggle complete |
| 6 | unmark completed | toggle complete |
| 7 | delete a todo | delete flow |
| 8 | persist todos after reload | localStorage read/write |
| 9 | persist completed state after reload | localStorage read/write |
| 10 | clear input after add | input reset |
| 11 | add via Enter key | keyboard submit |

**`tests/seed.spec.ts`** — empty stub (`// generate code here.`). Dead file; should be deleted.

**Verdict on quality:** The 11 tests are well-written for the *happy path of add/complete/delete/persist*. But **every locator is a structural or class selector** (`#todo-input`, `.todo-item`, `.text`, `.delete-btn`, `button[type="submit"]`, `h1`). The project standard mandates `data-testid` first — **not a single element in `index.html` or `main.js` has a `data-testid`.** This is the central problem for a design change (see R1).

---

## 2. Riskiest areas (ranked)

Ranked by **(likelihood a design change breaks it) × (impact / invisibility of the regression)**.

### 🔴 R1 — Selector fragility: the whole suite is coupled to markup that is about to change
- **Why risky:** All 11 tests target class names and DOM shape (`.todo-item .text`, `.delete-btn`, `label > input[type=checkbox]`). A design refactor that renames `.text`→`.todo-label`, restructures the `<li>`, or moves the checkbox will break tests *en masse* — producing a wall of false failures that masks real regressions, or (if classes are reused loosely) false passes.
- **Blast radius:** Entire suite. This is the single biggest threat to using tests as a safety net during the redesign.
- **Coverage today:** N/A — this is a resilience problem, not a missing scenario.

### 🔴 R2 — Theme system: zero coverage, and design work targets it directly
- **Why risky:** Redesigns concentrate on color/theming. The theme feature has **0 tests**: toggle click, label swap (`Dark mode`↔`Light mode`), `data-theme` attribute on `<html>`, `aria-pressed` state, and **theme persistence across reload** (`theme-preference` key) are all unverified. `applyTheme` / `loadTheme` / `saveTheme` are entirely untested.
- **Blast radius:** Theme toggle silently breaks; persistence silently breaks. Very likely to regress during a CSS-variable overhaul.

### 🟠 R3 — Accessibility regressions
- **Why risky:** Design refactors routinely drop ARIA attributes and break keyboard/focus flow. At risk: `aria-live="polite"` on the list, `aria-pressed` on the toggle, `aria-label`s, and **focus management after delete** (explicitly called out in `tests/CLAUDE.md` but never tested). Only Enter-to-add is covered.
- **Blast radius:** Accessibility silently degrades; no test catches it.

### 🟠 R4 — XSS: safe today, one refactor away from unsafe
- **Why risky:** `render()` currently uses `createElement` + `textContent` (safe). A visual rewrite of `render()` to template strings + `innerHTML` would reintroduce injection. No test asserts that todo text is rendered as text, not markup.
- **Blast radius:** Security regression, invisible until exploited.

### 🟡 R5 — localStorage resilience & multi-item targeting
- **Why risky:** `loadTodos` + `isValidTodo` guard against corrupt/malformed stored data, but are **untested** — a refactor could quietly weaken validation. Also, complete/delete are only tested with a *single* item, so "acts on the correct todo by id among many" is unverified.
- **Blast radius:** Data loss / wrong-item mutations; app-breaking crash on corrupt storage if validation is weakened.

### 🟡 R6 — Content & layout edge cases
- **Why risky:** Design changes alter spacing, wrapping, and truncation. Untested: very long todo text, special characters/emoji, large list counts, leading/trailing whitespace trimming in *stored* value, and empty-state presentation (the app currently shows a bare empty `<ul>` — a redesign may add empty-state UI worth pinning down).
- **Blast radius:** Layout breakage; mostly visible, lower severity.

---

## 3. Coverage gap summary

| Area | Covered | Gap |
|------|:-------:|-----|
| Add / complete / delete / persist (happy path) | ✅ | — |
| **Theme toggle + persistence + aria-pressed** | ❌ | R2 — whole feature |
| **Selector resilience (data-testid)** | ❌ | R1 — suite-wide |
| Accessibility (aria-live, focus after delete, keyboard) | 🟡 partial (Enter add only) | R3 |
| XSS / text-not-markup | ❌ | R4 |
| Corrupt/malformed localStorage handling | ❌ | R5 (best as unit tests) |
| Correct-item targeting among many | ❌ | R5 |
| Long text / special chars / whitespace trim / empty state | ❌ | R6 |
| Visual regression (theme colors, layout) | ❌ | optional — see §5 |

---

## 4. Recommended work, in priority order (with effort)

Effort: **S** ≈ <1h, **M** ≈ half day, **L** ≈ 1+ day.

| Prio | Item | Risk | Effort | Notes |
|:----:|------|:----:|:------:|-------|
| **P0** | **Add `data-testid` to all interactive/asserted elements** (`todo-input`, `todo-form`, `add-btn`, `theme-toggle`, `todo-list`, and per-item `todo-item`/`todo-text`/`todo-checkbox`/`delete-btn`) and migrate the 11 existing tests to them | R1 | **M** | *Source change* — the one prerequisite that makes the whole suite survive the redesign. Do this **before** the design work so tests decouple from CSS classes. Needs your sign-off since it edits `index.html`/`main.js`. |
| **P0** | **Theme test suite** (~6 tests): default light on first load; toggle switches to dark (`data-theme`, label, `aria-pressed`); toggle back; theme persists across reload; corrupt/absent `theme-preference` falls back to light | R2 | **M** | Pure E2E, seed via localStorage. High value, directly guards redesign. |
| **P1** | **Accessibility tests**: focus is sensible after delete; toggle reachable/operable by keyboard; `aria-live` present on list; `aria-pressed` reflects state | R3 | **M** | Can lean on the `accessibility-tester` agent to author + verify live. |
| **P1** | **XSS guard test**: add a todo containing `<img src=x onerror=...>`/`<script>` and assert it renders as literal text (no injected node fires) | R4 | **S** | One test; cheap insurance against an `innerHTML` refactor. |
| **P2** | **Multi-item targeting**: with 3 todos, completing/deleting the middle one affects only it | R5 | **S** | Closes the "correct id among many" gap. |
| **P2** | **localStorage resilience** — ideally **unit tests** for `isValidTodo`/`loadTodos` (non-array, malformed object, missing fields, throwing storage) | R5 | **M** | Requires wiring up Vitest (the `vitest-unit` skill covers this). If you'd rather stay E2E-only: seed malformed `todo-items` and assert the app renders empty without crashing (**S**). |
| **P3** | **Content/layout edge cases**: long text, emoji/special chars, whitespace is trimmed in stored value, empty-state | R6 | **S–M** | Behavioral assertions; pair with visual regression if adopted. |

**Rough total to close P0–P2:** ~1.5–2 days, front-loaded on the two P0 items which are what actually make the redesign safe.

---

## 5. Strategic recommendations

1. **Sequence matters.** Land the P0 `data-testid` migration *first*, before touching the design. Otherwise the redesign and the test-hardening land together and you can't tell a real regression from a selector break.
2. **Consider visual regression testing** (Playwright `toHaveScreenshot`) for a *design* change specifically — it's the only thing that catches "the layout looks wrong" that functional tests miss. Scope: capture baselines for light + dark, empty + populated states. Effort **M**; flag as optional because it adds snapshot-maintenance overhead.
3. **Delete `tests/seed.spec.ts`** — dead stub, no value.
4. **Pin the empty state now.** The app currently renders a bare empty `<ul>`. Decide with design whether an empty-state message is in scope; if so, add it to acceptance criteria before writing the test.
5. **Pipeline fit:** P1 accessibility → `accessibility-tester` agent; test authoring → `test-planner` → `test-generator`; post-redesign breakage → `test-healer`. Run the requirement-critic on the design brief first to get testable acceptance criteria.
