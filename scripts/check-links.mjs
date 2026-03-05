import { runLinkCheck, withPreviewServer } from "./health-lib.mjs";

const result = await withPreviewServer((currentBaseUrl) =>
  runLinkCheck(currentBaseUrl),
);

console.log(
  `${result.name}: checked ${result.checkedPages} pages and ${result.checkedLinks} links.`,
);

if (!result.passed) {
  console.error(result.failures.join("\n"));
  process.exit(1);
}
