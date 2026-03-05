import { runSchemaCheck, withPreviewServer } from "./health-lib.mjs";

const result = await withPreviewServer((currentBaseUrl) =>
  runSchemaCheck(currentBaseUrl),
);

console.log(`${result.name}: ${result.passed ? "pass" : "fail"}.`);

if (!result.passed) {
  console.error(result.failures.join("\n"));
  process.exit(1);
}
