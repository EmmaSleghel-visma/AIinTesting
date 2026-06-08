# Rainbow Mode Test Plan

## Application Overview

A vanilla JavaScript Todo application with light and dark theme modes. The rainbow mode is a third theme that will be added alongside light and dark. Theme state is stored in localStorage under the key 'theme-preference', applied as a data-theme attribute on the root html element (data-theme="rainbow"), and controlled via the #theme-toggle button which cycles through all three modes. Rainbow mode applies a multi-color gradient aesthetic to the page and panel backgrounds with colorful todo item borders, while keeping text readable. Any animations in rainbow mode must respect prefers-reduced-motion. All acceptance criteria were derived from the requirement critique conducted prior to implementation.

## Test Scenarios

### 1. Mode Activation

**Seed:** `tests/seed.spec.ts`

#### 1.1. should activate rainbow mode when cycling through from light mode

**File:** `tests/rainbow-mode/activation.spec.ts`

**Steps:**
  1. Navigate to the app with a clean localStorage (no stored theme).
    - expect: The page loads in light mode: data-theme attribute is 'light' on the html element, button reads 'Dark mode', aria-pressed is 'false'.
  2. Click the #theme-toggle button once to switch to dark mode.
    - expect: data-theme is 'dark', button reads 'Light mode', aria-pressed is 'true'.
  3. Click the #theme-toggle button a second time to switch to rainbow mode.
    - expect: data-theme is 'rainbow' on the html element.
    - expect: The button label clearly communicates rainbow mode is active (e.g. 'Rainbow mode' or 'Light mode' if cycling resets).
    - expect: The page background is visually distinct from both light and dark modes (gradient or multi-color).

#### 1.2. should activate rainbow mode directly when cycling from dark mode

**File:** `tests/rainbow-mode/activation.spec.ts`

**Steps:**
  1. Set localStorage key 'theme-preference' to 'dark' and reload the page.
    - expect: Page loads in dark mode: data-theme is 'dark'.
  2. Click the #theme-toggle button once.
    - expect: data-theme becomes 'rainbow'.
    - expect: The page background changes to rainbow styling.
    - expect: Button text and aria attributes reflect the new mode.

#### 1.3. should complete the full mode cycle light → dark → rainbow → light

**File:** `tests/rainbow-mode/activation.spec.ts`

**Steps:**
  1. Start with clean localStorage (defaults to light mode). Note the current data-theme value.
    - expect: data-theme is 'light'.
  2. Click the toggle button — first click.
    - expect: data-theme is 'dark'.
  3. Click the toggle button — second click.
    - expect: data-theme is 'rainbow'.
  4. Click the toggle button — third click.
    - expect: data-theme returns to 'light', completing the full cycle.
    - expect: Button text matches the light mode label.
    - expect: aria-pressed is 'false' (or equivalent neutral value).

### 2. DOM and CSS Correctness

**Seed:** `tests/seed.spec.ts`

#### 2.1. should set data-theme to 'rainbow' on the html element when rainbow mode is active

**File:** `tests/rainbow-mode/css.spec.ts`

**Steps:**
  1. Activate rainbow mode by cycling the toggle to rainbow.
    - expect: document.documentElement.dataset.theme === 'rainbow'.
    - expect: No 'dark' or 'light' value is present on data-theme simultaneously.

#### 2.2. should remove all residual light/dark theme styles when rainbow mode is active

**File:** `tests/rainbow-mode/css.spec.ts`

**Steps:**
  1. Activate dark mode first, then switch to rainbow mode.
    - expect: data-theme is 'rainbow' — not 'dark'.
    - expect: No class or attribute belonging to dark mode remains on the html or body element.
    - expect: The page background is rainbow-styled, not the dark-mode background (#111827).

#### 2.3. should remove rainbow styles when switching away from rainbow mode

**File:** `tests/rainbow-mode/css.spec.ts`

**Steps:**
  1. Activate rainbow mode, then click the toggle to advance to light mode.
    - expect: data-theme is 'light'.
    - expect: No rainbow gradient or rainbow-specific CSS variable remains applied to the page.
    - expect: Page background matches the expected light mode color (#f3f4f6).

#### 2.4. should apply visually distinct rainbow background that differs from light and dark modes

**File:** `tests/rainbow-mode/css.spec.ts`

**Steps:**
  1. Record the computed background-color/background value of the body in light mode.
  2. Switch to dark mode. Record the computed background of the body.
  3. Switch to rainbow mode. Read the computed background of the body.
    - expect: The computed background in rainbow mode is different from both light mode and dark mode backgrounds.
    - expect: The background has a gradient or multi-color value (contains 'gradient' in the CSS value, or has multiple color stops).

#### 2.5. should render completed todo items as visually distinguishable in rainbow mode

**File:** `tests/rainbow-mode/css.spec.ts`

**Steps:**
  1. Activate rainbow mode, then add a todo item.
  2. Check the checkbox on the todo item to mark it complete.
    - expect: The todo text has the 'completed' class and shows line-through text decoration.
    - expect: The visual differentiation (strike-through, muted color) is still perceptible against the rainbow background.

### 3. Persistence

**Seed:** `tests/seed.spec.ts`

#### 3.1. should persist rainbow mode across page reloads

**File:** `tests/rainbow-mode/persistence.spec.ts`

**Steps:**
  1. Activate rainbow mode by cycling the toggle.
    - expect: data-theme is 'rainbow'.
  2. Reload the page (page.reload()).
    - expect: data-theme is still 'rainbow' after reload.
    - expect: The page background is rainbow-styled immediately on load without flash of light/dark mode.
    - expect: The toggle button label reflects rainbow mode is active.

#### 3.2. should store 'rainbow' in localStorage under the theme-preference key

**File:** `tests/rainbow-mode/persistence.spec.ts`

**Steps:**
  1. Activate rainbow mode.
  2. Read localStorage.getItem('theme-preference') via page.evaluate().
    - expect: The value returned is exactly 'rainbow'.

#### 3.3. should load rainbow mode when localStorage contains 'rainbow' on fresh page load

**File:** `tests/rainbow-mode/persistence.spec.ts`

**Steps:**
  1. Set localStorage key 'theme-preference' to 'rainbow' via page.evaluate(), then reload the page.
    - expect: data-theme on the html element is 'rainbow' before any user interaction.
    - expect: The page visually displays rainbow mode styling on initial render.

#### 3.4. should not affect todo persistence when switching to and from rainbow mode

**File:** `tests/rainbow-mode/persistence.spec.ts`

**Steps:**
  1. Add two todo items in light mode.
    - expect: Two todo items are visible.
  2. Activate rainbow mode.
    - expect: Both todo items are still present and visible in rainbow mode.
  3. Reload the page.
    - expect: Both todos are still present.
    - expect: Rainbow mode is still active.
    - expect: The localStorage key 'todo-items' is unmodified by the theme change.

### 4. Accessibility

**Seed:** `tests/seed.spec.ts`

#### 4.1. should have an accessible name on the theme toggle button in rainbow mode

**File:** `tests/rainbow-mode/accessibility.spec.ts`

**Steps:**
  1. Activate rainbow mode.
  2. Inspect the #theme-toggle button's aria-label and visible text.
    - expect: The button has a non-empty accessible name (aria-label 'Toggle color theme' still present, or button text is descriptive).
    - expect: A screen reader would announce the button as indicating the current mode or the action to change mode.

#### 4.2. should have a correct aria-pressed value reflecting rainbow mode state

**File:** `tests/rainbow-mode/accessibility.spec.ts`

**Steps:**
  1. Activate rainbow mode.
  2. Read the aria-pressed attribute of the #theme-toggle button.
    - expect: aria-pressed is not undefined or missing.
    - expect: The aria-pressed value is consistent with the documented tri-state behavior (e.g., 'true', 'false', or 'mixed') — it must not be the same value used for light mode AND dark mode simultaneously.

#### 4.3. should be activatable via keyboard in rainbow mode cycle

**File:** `tests/rainbow-mode/accessibility.spec.ts`

**Steps:**
  1. Tab to focus the #theme-toggle button using keyboard navigation.
    - expect: The button receives visible focus (focus ring is visible).
  2. Press Space or Enter to cycle through to rainbow mode.
    - expect: data-theme changes to 'rainbow' without using a mouse.
    - expect: All focus management remains intact — focus stays on the toggle button after activation.

#### 4.4. should pause or reduce rainbow animations when prefers-reduced-motion is set

**File:** `tests/rainbow-mode/accessibility.spec.ts`

**Steps:**
  1. Emulate the 'prefers-reduced-motion: reduce' media query using Playwright's page.emulateMedia().
  2. Activate rainbow mode.
    - expect: Any CSS animation (e.g., hue-rotate keyframes) has animation-duration of '0s' or is paused when prefers-reduced-motion:reduce is active.
    - expect: No visible moving/flashing elements are present.
    - expect: Static rainbow styling (gradient without animation) is still applied — only motion is removed, not the rainbow appearance.

#### 4.5. should maintain readable text contrast in rainbow mode

**File:** `tests/rainbow-mode/accessibility.spec.ts`

**Steps:**
  1. Activate rainbow mode and add a todo item.
  2. Inspect the computed color and background-color of the todo item text element using getComputedStyle.
    - expect: The foreground/background color combination meets or is close to WCAG AA contrast ratio (4.5:1 for normal text).
    - expect: Todo item text is legible without requiring any extra user action.

### 5. Todo Functionality in Rainbow Mode

**Seed:** `tests/seed.spec.ts`

#### 5.1. should add a todo item successfully when rainbow mode is active

**File:** `tests/rainbow-mode/functionality.spec.ts`

**Steps:**
  1. Activate rainbow mode, then type 'Rainbow todo' in the #todo-input field and click Add.
    - expect: One todo item appears in #todo-list with text 'Rainbow todo'.
    - expect: The todo item is styled according to rainbow mode (e.g., colorful border if specified).

#### 5.2. should complete a todo item in rainbow mode

**File:** `tests/rainbow-mode/functionality.spec.ts`

**Steps:**
  1. Activate rainbow mode, add a todo 'Finish report', then check the checkbox.
    - expect: The checkbox is checked.
    - expect: The todo text has class 'completed' and shows line-through styling.
    - expect: The visual state is distinguishable from an unchecked todo in rainbow mode.

#### 5.3. should delete a todo item in rainbow mode

**File:** `tests/rainbow-mode/functionality.spec.ts`

**Steps:**
  1. Activate rainbow mode, add a todo 'To delete', then click the Delete button.
    - expect: The todo item is removed from #todo-list.
    - expect: The list is empty.
    - expect: No JavaScript errors are thrown in the browser console.

#### 5.4. should not add an empty todo in rainbow mode

**File:** `tests/rainbow-mode/functionality.spec.ts`

**Steps:**
  1. Activate rainbow mode, leave the input blank (or enter only spaces), and click Add.
    - expect: No todo item is added to #todo-list.
    - expect: The list remains empty.

### 6. Edge Cases and Error Handling

**Seed:** `tests/seed.spec.ts`

#### 6.1. should default to light mode when localStorage contains an unrecognised theme value

**File:** `tests/rainbow-mode/edge-cases.spec.ts`

**Steps:**
  1. Set localStorage key 'theme-preference' to an invalid value such as 'unicorn' via page.evaluate(), then reload the page.
    - expect: data-theme defaults to 'light' (or the application's defined fallback mode).
    - expect: No JavaScript error is thrown.
    - expect: The page is fully usable.

#### 6.2. should handle rapid successive clicks on the toggle without breaking mode state

**File:** `tests/rainbow-mode/edge-cases.spec.ts`

**Steps:**
  1. Click the #theme-toggle button 9 times in rapid succession (3 full cycles).
    - expect: After 9 clicks the mode has returned to light (net: 3 full cycles × 3 modes).
    - expect: data-theme is 'light'.
    - expect: No duplicate or stale theme values exist in localStorage.
    - expect: No JavaScript errors appear in the console.

#### 6.3. should handle missing localStorage gracefully when storage is unavailable

**File:** `tests/rainbow-mode/edge-cases.spec.ts`

**Steps:**
  1. Override localStorage.setItem to throw an error via page.evaluate() to simulate storage quota exceeded, then activate rainbow mode.
    - expect: No unhandled JavaScript exception is thrown.
    - expect: The rainbow mode is still visually applied for the current session even if it cannot be persisted.

#### 6.4. should preserve all existing todos when rainbow mode is toggled multiple times

**File:** `tests/rainbow-mode/edge-cases.spec.ts`

**Steps:**
  1. Add three todos: 'Alpha', 'Beta', 'Gamma'.
    - expect: Three todo items are visible.
  2. Cycle through all three modes twice (6 toggle clicks total).
    - expect: After each mode change, all three todos remain in the list.
    - expect: No todos are added, duplicated, or removed as a side-effect of mode switching.

#### 6.5. should not conflict with the todo-items localStorage key when storing rainbow theme

**File:** `tests/rainbow-mode/edge-cases.spec.ts`

**Steps:**
  1. Add a todo, activate rainbow mode, reload the page.
  2. Read both localStorage keys: 'theme-preference' and 'todo-items' via page.evaluate().
    - expect: 'theme-preference' is 'rainbow'.
    - expect: 'todo-items' still contains the valid serialised todo array.
    - expect: The two keys are separate and neither has overwritten the other.
