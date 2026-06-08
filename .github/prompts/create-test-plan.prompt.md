---
description: "Create a test plan for a new feature or user story"
mode: "ask"
---

# Create Test Plan

Generate a comprehensive test plan for a feature or user story.

## Test Plan Structure

### 1. Feature Overview
- Feature name
- User story
- Acceptance criteria

### 2. Test Scope
- In scope
- Out of scope
- Dependencies

### 3. Test Scenarios

#### Positive Tests (Happy Path)
| ID | Scenario | Steps | Expected Result |
|----|----------|-------|-----------------|
| P1 | ... | ... | ... |

#### Negative Tests (Error Handling)
| ID | Scenario | Steps | Expected Result |
|----|----------|-------|-----------------|
| N1 | ... | ... | ... |

#### Edge Cases
| ID | Scenario | Steps | Expected Result |
|----|----------|-------|-----------------|
| E1 | ... | ... | ... |

### 4. Test Data Requirements
- Valid test data
- Invalid test data
- Boundary values

### 5. Environment Requirements
- Browser versions
- Screen sizes
- Accessibility tools

### 6. Automation Notes
- Which tests to automate
- Suggested selectors
- Special considerations

## Example for Todo App Feature

If asked about "Add Todo" feature:

**Acceptance Criteria:**
- User can type text in input field
- User can submit with button or Enter key
- Todo appears in list immediately
- Input clears after submission
- Todo persists after page reload

**Test Scenarios:**
| ID | Scenario | Priority |
|----|----------|----------|
| P1 | Add todo with valid text | High |
| P2 | Add todo with Enter key | High |
| N1 | Submit empty input | High |
| N2 | Submit whitespace only | Medium |
| E1 | Add todo with 1000 characters | Medium |
| E2 | Add todo with emojis | Low |
