import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import {
  getRoutes,
  runA11yCheck,
  runLinkCheck,
  runOperationalCheck,
  runSchemaCheck,
  withPreviewServer,
} from "./health-lib.mjs";

function renderSection(result) {
  const lines = [
    `## ${result.name}`,
    "",
    `Status: ${result.passed ? "PASS" : "FAIL"}`,
  ];

  if (typeof result.checkedPages === "number") {
    lines.push(`Checked pages: ${result.checkedPages}`);
  }

  if (typeof result.checkedLinks === "number") {
    lines.push(`Checked links: ${result.checkedLinks}`);
  }

  lines.push("");

  if (result.failures.length === 0) {
    lines.push("No issues found.", "");
    return lines.join("\n");
  }

  lines.push("Findings:");
  for (const failure of result.failures) {
    lines.push(`- ${failure}`);
  }

  lines.push("");
  return lines.join("\n");
}

const artifactsDir = path.join(process.cwd(), "artifacts");
await mkdir(artifactsDir, { recursive: true });

const routes = await getRoutes();
const results = await withPreviewServer(async (currentBaseUrl) => {
  const linkResult = await runLinkCheck(currentBaseUrl, routes);
  const schemaResult = await runSchemaCheck(currentBaseUrl);
  const a11yResult = await runA11yCheck(currentBaseUrl, routes);
  const operationalResult = await runOperationalCheck(currentBaseUrl, routes);

  return {
    generatedAt: new Date().toISOString(),
    routes,
    checks: [linkResult, schemaResult, a11yResult, operationalResult],
  };
});

const overallPassed = results.checks.every((check) => check.passed);
const markdown = [
  "# Site Health Report",
  "",
  `Generated: ${results.generatedAt}`,
  `Overall status: ${overallPassed ? "PASS" : "FAIL"}`,
  `Routes checked: ${results.routes.length}`,
  "",
  ...results.checks.map((check) => renderSection(check)),
].join("\n");

await writeFile(
  path.join(artifactsDir, "site-health-report.md"),
  markdown,
  "utf8",
);
await writeFile(
  path.join(artifactsDir, "site-health-report.json"),
  JSON.stringify(results, null, 2),
  "utf8",
);

console.log(markdown);

if (!overallPassed) {
  process.exit(1);
}
