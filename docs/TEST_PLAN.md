# CommonGround Test Plan

## Part 1 - Test Plan (Strategic)

### 1.1 Scope: What's In, What's Out

| In scope | Why this matters |
|---|---|
| Login, signup, and profile setup | High user impact; touches auth, frontend state, profile validation, and database-backed profile data. |
| Interest tag creation and profile interest linking | Core feature; bugs here can create bad tags or fail to connect interests to users. |
| Suggested friends and add-friend flow | Core social feature; must prevent invalid friendship rows and duplicate or broken friend state. |
| Map friend-card actions: chat, profile, add, block | High-visibility UI path; buttons must act on the correct person and navigate correctly. |
| Chats, pinned chats, and map-to-chat opening | Core communication flow; tests catch regressions in pinned sections and focused conversation routing. |
| Communities search, join, and request flows | Core group feature; public joins and request-only joins write to different database tables. |
| Supabase service mapping and write-shape logic | Backend-facing risk; catches wrong table names, wrong column names, and snake_case/camelCase mapping errors. |
| Coverage reporting and test documentation | Required for HW4; proves tests run and tracks current measured coverage snapshots. |

| Out of scope | Why excluded |
|---|---|
| Live Supabase production integration tests | Time and safety constraint; tests use mocked Supabase behavior instead of writing to a live database. |
| Expo mobile end-to-end testing on iOS/Android devices | Tooling and time constraint; current tests run locally with Node and React Native stubs. |
| Browser compatibility testing | App targets Expo/mobile behavior, and web preview is intentionally disabled. |
| Realtime chat delivery and push notifications | Stretch behavior; current prototype uses mock/demo chat rows rather than live realtime messaging. |
| Security/penetration testing | Important but beyond HW4 scope; current tests focus on functional correctness and data-write shape. |
| Performance/load testing | Not implemented due to project scale and time; local functional tests were prioritized. |

# HW 4

## 1.4

First, define each test type in your own words (1–2 sentences each):

Unit test:  
Integration test:  
Then map test types to components and pick frameworks:

\> 💡 The frameworks named below (and elsewhere — React, Express, Jest, Playwright, k6, etc.) are examples. Your team may use a totally different stack (Vue, Django, Go, FastAPI, etc.). Use whatever fits — just name what you actually use and say why.

UNIT TEST: A single function, method, procedure, or class is isolated from other external variables such as external modules and validated via testing for each case possible. It is useful for testing for edge cases and error handling.

INTEGRATION TEST: A group of functions, methods, procedures, or classes are tested at the same time to validate output and check for bugs with retrieving and interpreting data sent from other components.

| Component | Test types applied | Framework | Why this fits |
| :---- | :---- | :---- | :---- |
| LoginScreen \- disableLogin | Unit | Jest | Function should be tested independently, including edge cases such as all whitespaces (or empty) in the email/password fields. |
| SetupScreen- Password | Unit | Jest | Component should be tested for edge cases such as being exactly 6 characters long, longer than 6 characters, or shorter than 6 characters (disables login) |
| SetupScreen \- isWholeNumber() | Unit | Jest | Helper function has defined edge cases, such as negatives, decimals, and non-numerical characters |
| SetupScreen \- setupDisabled | Unit | Jest | Component can be validated via individual test cases, such as invalid age, invalid password, etc.  |
| ProfileService \- ProfileToAppFields() | Unit | Jest | Helper function maps the ProfileRow into the shape the app’s state expects, which can be confirmed via individual test cases. |
| ProfileService \- UpsertProfile() | Unit | Jest | Helper function has defined edge cases for parsing information such as trailing spaces, null bio, and non-numeric strings. |
| Field \- Field | Unit | Jest and React Native | Helper function accepts an optional keyboardType prop and verify that the correct input corresponding to the keyboardType is applied |
|  |  |  |  |
| Signup (LoginScreen \-\> SetupScreen \-\> Supabase) | Integration | Detox | An integration test is needed to test the following flow: tapping “Create Account” \-\> signup page \-\> validating credentials \-\> navigating to main app |
| Signout (AppContext \-\> Supabase \-\> LoginScreen) |  | Jest | An integration test is needed to test the following flow: clear Supabase session \-\> return to login screen \-\> cannot re-enter main app without logging back in/signing up |
| Creating an auth account (AppContext \+ ProfileService) | Integration | Jest | An integration test is needed to test the following flow: authenticate user credentials \-\> create account \-\> profile row with correct age |
| Displaying user details(ProfileRoute \+ ProfileScreen \+ AppContext) | Integration | Jest and React Native | An integration test is needed to test the following flow: confirm age display \-\> change age when prompted \-\> verify context state |
| University badge verification | Integration | Jest and React Native | An integration test is needed to verify that selecting a university in the setup page should be reflected in the profile header and profile screen, which interacts with other components such as ChoiceChips, AppContext, upsertProfile and ProfileScreen. |

## 1.5

What environment do your tests assume? What's mocked vs. live? Where does test data come from?

Examples:

Tests assume Node 20 / Python 3.11 (whatever your stack is)  
Test DB is in-memory SQLite (not production Postgres)  
External APIs are mocked: e.g. Stripe sandbox, email delivery stubbed  
Test data is generated fresh per run (no shared global state)  
CI runs on Ubuntu; local dev runs on macOS / Windows

Mocked:

- Supabase client  
- React Navigation  
- Expo modules  
- Auth session  

### 1.6 - Team Roles
| Members | Owns Which Category |
|---|---|
Christine | Wrote 1.4 and 1.5
Jose | Wrote 1.2 and 1.3
June | Prompted all test cases and reflection (i love being the only person with claude/codex...)
Addie & Celina | Excused by June from testing segment of the project. Their assigment was primarily UI and handling HW 3, which they did well.

## Part 2 - Tests Implemented + Report

### 2.3 Tests By Category

#### Snapshot 3

Last updated: 2026-05-28 (commit 4f71368, uncommitted working tree snapshot)

Available tests:

```text
Unit tests: 6
Implementation tests: 27
Total tests: 33
```

| Category | Test |
|---|---|
| Unit | `unit: normalizes typed interest labels to database-safe tags` |
| Unit | `unit: preserves valid lowercase hashtag labels` |
| Unit | `unit: accepts whole-number age input` |
| Unit | `unit: rejects decimal age input` |
| Unit | `unit: returns expected short university badge label` |
| Unit | `unit: exposes core style tokens used by the app shell` |
| Implementation | `implementation: new typed interest produces interest insert data` |
| Implementation | `implementation: existing interest produces user_interests insert data` |
| Implementation | `implementation: suggested friend add maps UI user to accepted friendship row` |
| Implementation | `implementation: public community join writes to community_members` |
| Implementation | `implementation: request-only community join writes pending request` |
| Implementation | `implementation: social logic rejects unsafe writes before database calls` |
| Implementation | `implementation: addInterestToProfile reuses existing interest and upserts membership` |
| Implementation | `implementation: addInterestToProfile creates missing interest then links it` |
| Implementation | `implementation: social service write helpers target the correct tables` |
| Implementation | `implementation: getProfileInterestLabels drops broken join rows` |
| Implementation | `implementation: demo data service maps database row names into app fields` |
| Implementation | `implementation: profile service maps profiles and falls back when age column is absent` |
| Implementation | `implementation: profile service reads profile and university rows` |
| Implementation | `implementation: profileToAppFields handles identity labels and missing age` |
| Implementation | `implementation: auth service returns sessions and unsubscribes listeners` |
| Implementation | `implementation: button components render valid pressable elements` |
| Implementation | `implementation: form and layout components render valid elements` |
| Implementation | `implementation: notice and screen wrappers handle empty and populated states` |
| Implementation | `implementation: tag picker and tag row render tag collections` |
| Implementation | `implementation: communities screen renders public and request community actions` |
| Implementation | `implementation: map screen renders users, groups, and campus tag actions` |
| Implementation | `implementation: profile screen renders saved profile fields and actions` |
| Implementation | `implementation: read-only profile screen exposes profile data without edit callbacks` |
| Implementation | `implementation: map screen wires friend card action callbacks to the selected user` |
| Implementation | `implementation: communities search separates joined and suggested matches` |
| Implementation | `implementation: chats screen separates pinned chats from all chats` |
| Implementation | `implementation: chats screen opens focused chat thread and clears focus on back` |

#### Snapshot 2

Last updated: 2026-05-25 (commit 0f919ff, uncommitted working tree snapshot)

Available tests:

```text
Unit tests: 6
Implementation tests: 12
Total tests: 18
```

| Category | Test |
|---|---|
| Unit | `unit: normalizes typed interest labels to database-safe tags` |
| Unit | `unit: preserves valid lowercase hashtag labels` |
| Unit | `unit: accepts whole-number age input` |
| Unit | `unit: rejects decimal age input` |
| Unit | `unit: returns expected short university badge label` |
| Unit | `unit: exposes core style tokens used by the app shell` |
| Implementation | `implementation: new typed interest produces interest insert data` |
| Implementation | `implementation: existing interest produces user_interests insert data` |
| Implementation | `implementation: suggested friend add maps UI user to accepted friendship row` |
| Implementation | `implementation: public community join writes to community_members` |
| Implementation | `implementation: request-only community join writes pending request` |
| Implementation | `implementation: button components render valid pressable elements` |
| Implementation | `implementation: form and layout components render valid elements` |
| Implementation | `implementation: notice and screen wrappers handle empty and populated states` |
| Implementation | `implementation: tag picker and tag row render tag collections` |
| Implementation | `implementation: communities screen renders public and request community actions` |
| Implementation | `implementation: map screen renders users, groups, and campus tag actions` |
| Implementation | `implementation: profile screen renders saved profile fields and actions` |

#### Snapshot 1

Last updated: 2026-05-25 (commit 0f919ff)

Available tests:

```text
Unit tests: 5
Implementation tests: 5
Total tests: 10
```

| Category | Test |
|---|---|
| Unit | `unit: normalizes typed interest labels to database-safe tags` |
| Unit | `unit: preserves valid lowercase hashtag labels` |
| Unit | `unit: accepts whole-number age input` |
| Unit | `unit: rejects decimal age input` |
| Unit | `unit: returns expected short university badge label` |
| Implementation | `implementation: new typed interest produces interest insert data` |
| Implementation | `implementation: existing interest produces user_interests insert data` |
| Implementation | `implementation: suggested friend add maps UI user to accepted friendship row` |
| Implementation | `implementation: public community join writes to community_members` |
| Implementation | `implementation: request-only community join writes pending request` |

### 2.4 Where The Tests Live + How To Run Them

Test files:

```text
tests/
  unit/
    coreUtils.test.ts
  implementation/
    socialFlows.test.ts
    uiElements.test.ts
```

Supporting test/build files:

```text
tsconfig.test.json
tsconfig.coverage.json
scripts/generate-coverage-report.mjs
coverage/
  index.html
  coverage-summary.json
```

Run commands:

```bash
npm run test:unit
npm run test:implementation
npm test
npm run test:coverage
npm run typecheck
```

Approximate runtimes:

| Category | Command | Time | Where it runs |
|---|---:|---:|---|
| Unit | `npm run test:unit` | ~0.04s after TypeScript build | local |
| Implementation | `npm run test:implementation` | ~0.04s after TypeScript build | local |
| All tests | `npm test` | ~1.5s total | local |
| Coverage | `npm run test:coverage` | ~2.0s total | local |

### 2.5 Coverage Achieved

#### Snapshot 3

Last updated: 2026-05-28 (commit 4f71368, uncommitted working tree snapshot)

| Test type | Tool | Coverage % |
|---|---|---:|
| Unit | Node `node:test` + V8 coverage via `npm run test:coverage` | 34.51% |
| Implementation | Node `node:test` + V8 coverage via `npm run test:coverage` | 60.33% |
| Combined overall | Custom V8 coverage report over full compiled `src/` tree | 60.39% |

Coverage snapshot:

```text
Unit covered lines: 608 / 1762
Unit line coverage: 34.51%
Implementation covered lines: 1063 / 1762
Implementation line coverage: 60.33%
Combined covered lines: 1064 / 1762
Combined line coverage: 60.39%
HTML report: coverage/index.html
JSON summary: coverage/coverage-summary.json
```

What is not covered yet:

Snapshot 3 adds bug-focused coverage around Supabase service write shapes, auth/session wrappers, profile fallback behavior for the missing `profiles.age` column, demo row mapping, map friend-card action wiring, read-only profile rendering, communities search separation, and the chat pinned/focused-thread behavior. Remaining gaps are mostly hook-heavy route/context behavior (`AppContext`, route wrappers, and navigation container branches), live Supabase integration behavior, and true Expo/mobile end-to-end flows.

#### Snapshot 2

Last updated: 2026-05-25 (commit 0f919ff, uncommitted working tree snapshot)

| Test type | Tool | Coverage % |
|---|---|---:|
| Unit | Node `node:test` + V8 coverage via `npm run test:coverage` | 33.82% |
| Implementation | Node `node:test` + V8 coverage via `npm run test:coverage` | 40.81% |
| Combined overall | Custom V8 coverage report over full compiled `src/` tree | 40.87% |

Coverage snapshot:

```text
Unit covered lines: 537 / 1588
Unit line coverage: 33.82%
Implementation covered lines: 648 / 1588
Implementation line coverage: 40.81%
Combined covered lines: 649 / 1588
Combined line coverage: 40.87%
HTML report: coverage/index.html
JSON summary: coverage/coverage-summary.json
```

What is not covered yet:

The current tests still do not cover most hook-heavy screens, navigation flows, live Supabase service calls, AppContext state transitions, auth/session edge cases, realtime chat behavior, or end-to-end Expo/mobile flows. The new snapshot raises coverage by testing pure helpers, database-write shape logic, presentational components, and non-hook screen render functions with a test-time React Native stub.

#### Snapshot 1

Last updated: 2026-05-25 (commit 0f919ff)

| Test type | Tool | Coverage % |
|---|---|---:|
| Unit | Node `node:test` + V8 coverage via `npm run test:coverage` | 1.13% |
| Implementation | Node `node:test` + V8 coverage via `npm run test:coverage` | 2.16% |
| Combined overall | Custom V8 coverage report over full compiled `src/` tree | 2.91% |

Coverage snapshot:

```text
Unit covered lines: 21 / 1854
Unit line coverage: 1.13%
Implementation covered lines: 40 / 1854
Implementation line coverage: 2.16%
Combined covered lines: 54 / 1854
Combined line coverage: 2.91%
HTML report: coverage/index.html
JSON summary: coverage/coverage-summary.json
```

What is not covered yet:

Most React Native screens, route wrappers, navigation, Supabase service calls, context state transitions, and style-only files are currently uncovered. The current tests focus on pure helper behavior and implementation-level write-shape logic for interests, friend additions, and community joins/requests. Full UI rendering tests, mocked Supabase integration tests, realtime chat behavior, and end-to-end Expo/mobile flows are not covered yet because the first test pass prioritized a small reliable baseline with no additional test framework dependencies.

## Part 3 - Reflection

**1. What did your tests catch that you missed before?**

- Community joins could write to the wrong table: public joins belong in `community_members`, while request-only joins belong in `community_join_requests`.
- Profile saving could break when the database still uses `age_range` instead of the newer `age` column.
- Interest tags could be saved incorrectly or fail to link back to `user_interests`.
- Friend adds could write invalid friendship rows if the suggested user does not have a `profileId`.
- Opening chat/profile from map friend cards could navigate to or act on the wrong user.

**2. What was hardest to test, and why?**

The hardest parts to test were live Supabase behavior, Expo mobile end-to-end flows, realtime chat delivery, and browser/device compatibility because those areas require external services, device/simulator tooling, or runtime environments beyond the local Node test setup. We kept those out of scope and used mocked Supabase responses plus React Native stubs so the tests could run reliably on a fresh local clone.

**3. What test would you add next if you had more time?**

The next test I would add is a true Expo mobile end-to-end flow that signs up or logs in with a test account, adds an interest, opens a map friend profile, starts a chat, and joins or requests a community against a dedicated Supabase test project. That would cover the main out-of-scope gap: proving the mocked service behavior also works with the real mobile runtime and database.

**4. Where did Codex help — and where did it get things wrong?**

Codex made creating a lot of test cases to get major code coverage trivial. However, it needed specific prompts to coerce it to test correctly. At first, the code coverage percent in `coverage/` was caclculated by only taking account the files that the tests touched, which inflated the claimed code coverage percentage. Also, Codex didn't write test cases that found bugs in the code, unless it was asked to specifically create test cases that would challenge the codebase. 
