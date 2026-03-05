import { spawn } from "node:child_process";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";

import lighthouse from "lighthouse";

import { withPreviewServer } from "./health-lib.mjs";

const chromePort = 9222;
const routes = ["/", "/services", "/contact"];
const previewHostname = "www.mariehardingcounselling.ie";
const thresholds = {
  performance: 0.9,
  accessibility: 0.95,
  "best-practices": 0.9,
  seo: 0.95,
};

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findChromePath() {
  if (process.env.CHROME_PATH && (await pathExists(process.env.CHROME_PATH))) {
    return process.env.CHROME_PATH;
  }

  const candidatesByPlatform = {
    win32: [
      path.join(
        process.env.PROGRAMFILES ?? "",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe",
      ),
      path.join(
        process.env["PROGRAMFILES(X86)"] ?? "",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe",
      ),
      path.join(
        process.env.LOCALAPPDATA ?? "",
        "Google",
        "Chrome",
        "Application",
        "chrome.exe",
      ),
      path.join(
        process.env.PROGRAMFILES ?? "",
        "Microsoft",
        "Edge",
        "Application",
        "msedge.exe",
      ),
      path.join(
        process.env["PROGRAMFILES(X86)"] ?? "",
        "Microsoft",
        "Edge",
        "Application",
        "msedge.exe",
      ),
    ],
    darwin: [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ],
    linux: [
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
      "/snap/bin/chromium",
    ],
  };

  const candidates =
    candidatesByPlatform[process.platform] ?? candidatesByPlatform.linux;

  for (const candidate of candidates) {
    if (candidate && (await pathExists(candidate))) {
      return candidate;
    }
  }

  throw new Error(
    "Could not find a local Chrome or Edge executable. Set CHROME_PATH to continue.",
  );
}

async function waitForChrome(timeoutMs = 30000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(
        `http://127.0.0.1:${chromePort}/json/version`,
      );
      if (response.ok) {
        return;
      }
    } catch {
      // Chrome is still starting.
    }

    await delay(500);
  }

  throw new Error(`Chrome was not ready within ${timeoutMs}ms.`);
}

async function stopChrome(browserProcess) {
  if (!browserProcess || browserProcess.exitCode !== null) {
    return;
  }

  if (process.platform === "win32") {
    const killer = spawn(
      "taskkill",
      ["/pid", String(browserProcess.pid), "/t", "/f"],
      {
        stdio: "ignore",
      },
    );
    await new Promise((resolve) => {
      killer.on("exit", resolve);
      killer.on("error", resolve);
    });
    return;
  }

  browserProcess.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => browserProcess.on("exit", resolve)),
    delay(3000).then(() => browserProcess.kill("SIGKILL")),
  ]);
}

function slugFromRoute(route) {
  return route === "/"
    ? "home"
    : route.replace(/^\/+/, "").replace(/[/?=&]+/g, "-");
}

function getAdjustedBestPracticesScore(lhr) {
  const category = lhr.categories["best-practices"];
  const ignoredAuditIds = new Set(["is-on-https", "redirects-http"]);

  let weightedTotal = 0;
  let totalWeight = 0;

  for (const auditRef of category.auditRefs) {
    if (ignoredAuditIds.has(auditRef.id) || auditRef.weight <= 0) {
      continue;
    }

    const score = lhr.audits[auditRef.id]?.score;
    if (typeof score !== "number") {
      continue;
    }

    weightedTotal += score * auditRef.weight;
    totalWeight += auditRef.weight;
  }

  if (totalWeight === 0) {
    return category.score ?? 0;
  }

  return weightedTotal / totalWeight;
}

function renderSummary(results) {
  const lines = ["# Lighthouse Summary", ""];

  for (const result of results) {
    lines.push(`## ${result.route}`);
    lines.push("");
    lines.push(`- Performance: ${result.scores.performance.toFixed(2)}`);
    lines.push(`- Accessibility: ${result.scores.accessibility.toFixed(2)}`);
    if (
      typeof result.rawScores?.["best-practices"] === "number" &&
      result.rawScores["best-practices"] !== result.scores["best-practices"]
    ) {
      lines.push(
        `- Best practices: ${result.scores["best-practices"].toFixed(2)} (local preview adjusted from ${result.rawScores["best-practices"].toFixed(2)}; HTTPS checks still need production verification)`,
      );
    } else {
      lines.push(
        `- Best practices: ${result.scores["best-practices"].toFixed(2)}`,
      );
    }
    lines.push(`- SEO: ${result.scores.seo.toFixed(2)}`);
    lines.push("");
  }

  return lines.join("\n");
}

const chromePath = await findChromePath();
const artifactsDir = path.join(process.cwd(), "artifacts", "lighthouse");
const chromeProfileDir = path.join(
  process.cwd(),
  "artifacts",
  "tmp",
  "chrome-profile",
);

await mkdir(artifactsDir, { recursive: true });
await mkdir(chromeProfileDir, { recursive: true });

const results = await withPreviewServer(async (baseUrl) => {
  const previewUrl = new URL(baseUrl);
  const auditBaseUrl = `http://${previewHostname}:${previewUrl.port}`;
  const browserProcess = spawn(
    chromePath,
    [
      `--remote-debugging-port=${chromePort}`,
      `--user-data-dir=${chromeProfileDir}`,
      `--host-resolver-rules=MAP ${previewHostname} ${previewUrl.hostname},MAP mariehardingcounselling.ie ${previewUrl.hostname}`,
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-background-networking",
      "about:blank",
    ],
    {
      cwd: process.cwd(),
      env: { ...process.env },
      stdio: "ignore",
    },
  );

  await waitForChrome();

  try {
    const collected = [];

    for (const route of routes) {
      const url = new URL(route, auditBaseUrl).toString();
      const result = await lighthouse(url, {
        port: chromePort,
        logLevel: "error",
        output: ["html", "json"],
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
        emulatedFormFactor: "desktop",
        screenEmulation: {
          mobile: false,
          disabled: true,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
        },
      });

      if (!result) {
        throw new Error(`No Lighthouse result was returned for ${route}.`);
      }

      const [htmlReport, jsonReport] = Array.isArray(result.report)
        ? result.report
        : [result.report, JSON.stringify(result.lhr, null, 2)];
      const slug = slugFromRoute(route);

      await writeFile(
        path.join(artifactsDir, `${slug}.report.html`),
        htmlReport,
        "utf8",
      );
      await writeFile(
        path.join(artifactsDir, `${slug}.report.json`),
        jsonReport,
        "utf8",
      );

      collected.push({
        route,
        scores: {
          performance: result.lhr.categories.performance.score ?? 0,
          accessibility: result.lhr.categories.accessibility.score ?? 0,
          "best-practices": getAdjustedBestPracticesScore(result.lhr),
          seo: result.lhr.categories.seo.score ?? 0,
        },
        rawScores: {
          "best-practices": result.lhr.categories["best-practices"].score ?? 0,
        },
      });
    }

    return collected;
  } finally {
    await stopChrome(browserProcess);
  }
});

const summary = renderSummary(results);
await writeFile(path.join(artifactsDir, "summary.md"), summary, "utf8");
await writeFile(
  path.join(artifactsDir, "summary.json"),
  JSON.stringify(results, null, 2),
  "utf8",
);

console.log(summary);

const failures = [];
for (const result of results) {
  for (const [category, minScore] of Object.entries(thresholds)) {
    if (result.scores[category] < minScore) {
      failures.push(
        `${result.route} scored ${result.scores[category].toFixed(2)} for ${category}; expected ${minScore.toFixed(2)} or higher.`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
