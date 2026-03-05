import { runA11yCheck, withPreviewServer } from "./health-lib.mjs";

const result = await withPreviewServer((currentBaseUrl) =>
  runA11yCheck(currentBaseUrl),
);

console.log(`${result.name}: checked ${result.checkedPages} pages.`);

if (!result.passed) {
  console.error(result.failures.join("\n"));
  process.exit(1);
}
