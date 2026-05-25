import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const coverageDir = resolve(root, "coverage");
const unitV8Dir = resolve(coverageDir, ".v8-unit");
const implementationV8Dir = resolve(coverageDir, ".v8-implementation");
const coverageBuildDir = resolve(root, ".coverage-build");

rmSync(coverageDir, { force: true, recursive: true });
rmSync(coverageBuildDir, { force: true, recursive: true });
mkdirSync(unitV8Dir, { recursive: true });
mkdirSync(implementationV8Dir, { recursive: true });

run("npm", ["run", "test:build", "--", "--pretty", "false"]);
run("npm", ["run", "coverage:build", "--", "--pretty", "false"]);
run("npm", ["run", "test:prepare"]);
run("node", ["--test", ".test-build/tests/unit/coreUtils.test.js"], {
  NODE_V8_COVERAGE: unitV8Dir
});
run(
  "node",
  [
    "--test",
    ".test-build/tests/implementation/socialFlows.test.js",
    ".test-build/tests/implementation/uiElements.test.js"
  ],
  {
    NODE_V8_COVERAGE: implementationV8Dir
  }
);

const sourceFiles = collectSourceFiles();
const unitCoveredByFile = collectCoveredLinesByFile(unitV8Dir);
const implementationCoveredByFile = collectCoveredLinesByFile(implementationV8Dir);
const combinedCoveredByFile = mergeCoveredLines(unitCoveredByFile, implementationCoveredByFile);
const unit = buildCoverageSnapshot(sourceFiles, unitCoveredByFile);
const implementation = buildCoverageSnapshot(sourceFiles, implementationCoveredByFile);
const combined = buildCoverageSnapshot(sourceFiles, combinedCoveredByFile);
const summary = {
  generatedAt: new Date().toISOString(),
  unit,
  implementation,
  combined,
  coveredLines: combined.coveredLines,
  totalLines: combined.totalLines,
  lineCoveragePercent: combined.lineCoveragePercent,
  files: combined.files
};

writeFileSync(resolve(coverageDir, "coverage-summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
writeFileSync(resolve(coverageDir, "index.html"), renderHtml(summary));
rmSync(unitV8Dir, { force: true, recursive: true });
rmSync(implementationV8Dir, { force: true, recursive: true });

console.log(`Unit coverage: ${unit.lineCoveragePercent}% lines (${unit.coveredLines}/${unit.totalLines})`);
console.log(
  `Implementation coverage: ${implementation.lineCoveragePercent}% lines (${implementation.coveredLines}/${implementation.totalLines})`
);
console.log(`Combined coverage: ${combined.lineCoveragePercent}% lines (${combined.coveredLines}/${combined.totalLines})`);
console.log("HTML report: coverage/index.html");

function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: { ...process.env, ...extraEnv },
    stdio: "inherit"
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function collectSourceFiles() {
  return walk(resolve(coverageBuildDir, "src")).filter((file) => file.endsWith(".js"));
}

function buildCoverageSnapshot(sourceFiles, coveredByFile) {
  const files = sourceFiles
    .map((compiledPath) => buildCoverageRow(compiledPath, coveredByFile))
    .filter((row) => row.total > 0)
    .sort((a, b) => a.file.localeCompare(b.file));
  const totals = files.reduce(
    (sum, row) => ({
      covered: sum.covered + row.covered,
      total: sum.total + row.total
    }),
    { covered: 0, total: 0 }
  );

  return {
    coveredLines: totals.covered,
    totalLines: totals.total,
    lineCoveragePercent: toPercent(totals.covered, totals.total),
    files
  };
}

function buildCoverageRow(compiledPath, coveredByFile) {
  const source = readFileSync(compiledPath, "utf8");
  const executableLines = getExecutableLines(source);
  const displayPath = toDisplayPath(coverageBuildDir, compiledPath);
  const coveredLines = coveredByFile.get(displayPath) ?? new Set();
  let covered = 0;

  for (const line of coveredLines) {
    if (executableLines.has(line)) {
      covered += 1;
    }
  }

  return {
    file: displayPath,
    covered,
    total: executableLines.size,
    percent: toPercent(covered, executableLines.size)
  };
}

function mergeCoveredLines(...coverageMaps) {
  const merged = new Map();
  for (const coverageMap of coverageMaps) {
    for (const [file, lines] of coverageMap.entries()) {
      const existing = merged.get(file) ?? new Set();
      for (const line of lines) {
        existing.add(line);
      }
      merged.set(file, existing);
    }
  }
  return merged;
}

function collectCoveredLinesByFile(v8Dir) {
  const merged = new Map();
  if (!existsSync(v8Dir)) {
    return merged;
  }

  for (const file of readdirSync(v8Dir)) {
    if (!file.endsWith(".json")) {
      continue;
    }

    const report = JSON.parse(readFileSync(resolve(v8Dir, file), "utf8"));
    for (const script of report.result ?? []) {
      if (!script.url.includes("/.test-build/src/")) {
        continue;
      }

      const compiledPath = fileURLToPath(script.url);
      const source = readFileSync(compiledPath, "utf8");
      const executableLines = getExecutableLines(source);
      if (!executableLines.size) {
        continue;
      }

      const coveredLines = getCoveredLines(source, script.functions ?? [], executableLines);
      const displayPath = toDisplayPath(resolve(root, ".test-build"), compiledPath);
      const existing = merged.get(displayPath) ?? new Set();

      for (const line of coveredLines) {
        existing.add(line);
      }
      merged.set(displayPath, existing);
    }
  }

  return merged;
}

function walk(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    return statSync(fullPath).isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function toDisplayPath(buildDir, compiledPath) {
  const jsPath = relative(buildDir, compiledPath);
  const tsPath = jsPath.replace(/\.js$/, ".ts");
  const tsxPath = jsPath.replace(/\.js$/, ".tsx");
  if (existsSync(resolve(root, tsPath))) {
    return tsPath;
  }
  if (existsSync(resolve(root, tsxPath))) {
    return tsxPath;
  }
  return jsPath;
}

function getExecutableLines(source) {
  const lines = source.split("\n");
  const executable = new Set();

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      trimmed &&
      trimmed !== "{" &&
      trimmed !== "}" &&
      trimmed !== "};" &&
      !trimmed.startsWith("//") &&
      !trimmed.startsWith("Object.defineProperty(exports")
    ) {
      executable.add(index + 1);
    }
  });

  return executable;
}

function getCoveredLines(source, functions, executableLines) {
  const lineStarts = getLineStarts(source);
  const covered = new Set();

  for (const fn of functions) {
    for (const range of fn.ranges ?? []) {
      if (range.count <= 0) {
        continue;
      }

      const startLine = offsetToLine(lineStarts, range.startOffset);
      const endLine = offsetToLine(lineStarts, Math.max(range.endOffset - 1, range.startOffset));
      for (let line = startLine; line <= endLine; line += 1) {
        if (executableLines.has(line)) {
          covered.add(line);
        }
      }
    }
  }

  return covered;
}

function getLineStarts(source) {
  const starts = [0];
  for (let index = 0; index < source.length; index += 1) {
    if (source[index] === "\n") {
      starts.push(index + 1);
    }
  }
  return starts;
}

function offsetToLine(lineStarts, offset) {
  let low = 0;
  let high = lineStarts.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (lineStarts[mid] <= offset && (mid === lineStarts.length - 1 || lineStarts[mid + 1] > offset)) {
      return mid + 1;
    }
    if (lineStarts[mid] > offset) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return 1;
}

function toPercent(covered, total) {
  return total === 0 ? 100 : Number(((covered / total) * 100).toFixed(2));
}

function renderHtml(summary) {
  const rows = summary.files
    .map(
      (file) => `
        <tr>
          <td>${escapeHtml(file.file)}</td>
          <td>${file.covered}</td>
          <td>${file.total}</td>
          <td>${file.percent}%</td>
        </tr>`
    )
    .join("");
  const suiteRows = [
    ["Unit", summary.unit],
    ["Implementation", summary.implementation],
    ["Combined", summary.combined]
  ]
    .map(
      ([label, snapshot]) => `
        <tr>
          <td>${escapeHtml(label)}</td>
          <td>${snapshot.coveredLines}</td>
          <td>${snapshot.totalLines}</td>
          <td>${snapshot.lineCoveragePercent}%</td>
        </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>CommonGround Coverage</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 32px; color: #231f20; }
    h1 { margin-bottom: 4px; }
    .summary { margin: 16px 0 24px; font-size: 18px; }
    table { border-collapse: collapse; width: 100%; max-width: 900px; }
    th, td { border-bottom: 1px solid #ddd; padding: 10px 12px; text-align: left; }
    th { background: #f5f5f5; }
    td:nth-child(2), td:nth-child(3), td:nth-child(4) { text-align: right; }
  </style>
</head>
<body>
  <h1>CommonGround Coverage</h1>
  <div>Generated: ${escapeHtml(summary.generatedAt)}</div>
  <div class="summary">
    Combined line coverage: <strong>${summary.lineCoveragePercent}%</strong>
    (${summary.coveredLines}/${summary.totalLines})
  </div>
  <h2>Coverage By Test Type</h2>
  <table>
    <thead>
      <tr>
        <th>Test Type</th>
        <th>Covered Lines</th>
        <th>Total Lines</th>
        <th>Line Coverage</th>
      </tr>
    </thead>
    <tbody>${suiteRows}</tbody>
  </table>
  <h2>Combined File Coverage</h2>
  <table>
    <thead>
      <tr>
        <th>File</th>
        <th>Covered Lines</th>
        <th>Total Lines</th>
        <th>Line Coverage</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>
`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
