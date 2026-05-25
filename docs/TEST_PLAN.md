# CommonGround Test Plan

## Part 1 - Test Plan (Strategic)

TODO.

## Part 2 - Tests Implemented + Report

### 2.3 Tests By Category

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
| All tests | `npm test` | ~1.3s total | local |
| Coverage | `npm run test:coverage` | ~1.4s total | local |

### 2.5 Coverage Achieved

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

TODO.
