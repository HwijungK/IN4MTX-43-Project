# CommonGround Test Plan

## Part 1 - Test Plan (Strategic)

TODO.

## Part 2 - Tests Implemented + Report

### 2.3 Tests By Category

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

Last updated: 2026-05-25 (commit 0f919ff)

Test files:

```text
tests/
  unit/
    coreUtils.test.ts
  implementation/
    socialFlows.test.ts
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

Approximate runtimes from the current local snapshot:

| Category | Command | Time | Where it runs |
|---|---:|---:|---|
| Unit | `npm run test:unit` | ~0.04s after TypeScript build | local |
| Implementation | `npm run test:implementation` | ~0.03s after TypeScript build | local |
| All tests | `npm test` | ~0.8-1.1s total | local |
| Coverage | `npm run test:coverage` | ~1.2s total | local |

### 2.5 Coverage Achieved

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
