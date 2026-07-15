---
description: Create a risk-based test plan for a feature or user story
argument-hint: <feature or user story>
---

# Create Test Plan

Generate a comprehensive, reviewable test plan for: **$ARGUMENTS**

Do not write test code — produce a plan a human can approve first. Save it under `specs/`.

## Test plan structure

### 1. Feature overview
- Feature name, user story, acceptance criteria (derive testable ones if not given)

### 2. Test scope
- In scope / out of scope / dependencies

### 3. Test scenarios

#### Positive tests (happy path)
| ID | Scenario | Steps | Expected result | Priority |
|----|----------|-------|-----------------|----------|

#### Negative tests (error handling)
| ID | Scenario | Steps | Expected result | Priority |
|----|----------|-------|-----------------|----------|

#### Edge cases
| ID | Scenario | Steps | Expected result | Priority |
|----|----------|-------|-----------------|----------|

### 4. Test data requirements
- Valid data, invalid data, boundary values

### 5. Environment requirements
- Browsers, viewport sizes, accessibility tooling

### 6. Automation notes
- Which scenarios to automate first, suggested selectors, special considerations

## Prioritization

Assign priority by risk: likelihood of failure × impact of failure. State the reasoning for
every High. Not everything deserves automation — say which scenarios are cheaper to check
manually or not at all.

## Example calibration (Add Todo feature)

| ID | Scenario | Priority |
|----|----------|----------|
| P1 | Add todo with valid text | High |
| P2 | Add todo with Enter key | High |
| N1 | Submit empty input | High |
| N2 | Submit whitespace only | Medium |
| E1 | Add todo with 1000 characters | Medium |
| E2 | Add todo with emojis | Low |
