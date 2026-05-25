# Test Run Commands

Use these commands from the repository root.

## Unit Tests

```bash
npm run test:unit
```

Runs 5 unit tests in `tests/unit/`.

## Implementation Tests

```bash
npm run test:implementation
```

Runs 5 implementation tests in `tests/implementation/`.

## All Tests

```bash
npm test
```

Runs the unit test suite first, then the implementation test suite.

## Coverage Report

```bash
npm run test:coverage
```

Runs all 10 tests with V8 coverage enabled and writes:

- `coverage/index.html`
- `coverage/coverage-summary.json`

Coverage is reported against the full compiled `src/` tree, so source files that no
test imports count as 0% covered. The report includes separate unit,
implementation, and combined coverage snapshots.

## Typecheck Only

```bash
npm run typecheck
```

Runs the app TypeScript typecheck without executing tests.
