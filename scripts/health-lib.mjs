import { spawn } from "node:child_process";
import { readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { setTimeout as delay } from "node:timers/promises";

const ROOT = process.cwd();
const HOST = "127.0.0.1";
const PORT = 4321;
const INTERNAL_HOSTS = new Set([
  HOST,
  "localhost",
  "www.mariehardingcounselling.ie",
  "mariehardingcounselling.ie",
]);
const STATIC_ROUTES = [
  "/",
  "/about-marie",
  "/how-counselling-works",
  "/services",
  "/fees-and-cancellations",
  "/resources",
  "/contact",
  "/privacy-policy",
  "/terms-of-use",
  "/accessibility-statement",
];

export const baseUrl = `http://${HOST}:${PORT}`;

function npmCommand() {
  return process.platform === "win32"
    ? (process.env.ComSpec ?? "cmd.exe")
    : "npm";
}

function normalisePathname(value) {
  if (!value) {
    return "/";
  }

  const withoutTrailingSlash = value.replace(/\/+$/, "");
  return withoutTrailingSlash || "/";
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripTags(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function waitForServer(url, child, timeoutMs = 30000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (child.exitCode !== null) {
      throw new Error("Preview server exited before it became ready.");
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // The preview server is still starting.
    }

    await delay(500);
  }

  throw new Error(`Preview server was not ready within ${timeoutMs}ms.`);
}

export async function getRoutes() {
  const servicesDir = path.join(ROOT, "src", "content", "services");
  const files = await readdir(servicesDir);
  const serviceRoutes = files
    .filter((file) => /\.(md|mdx)$/.test(file))
    .sort()
    .map((file) => `/services/${file.replace(/\.(md|mdx)$/, "")}`);

  return [...STATIC_ROUTES, ...serviceRoutes];
}

export async function fetchPage(route, customBaseUrl = baseUrl) {
  const url = new URL(route, customBaseUrl);
  const response = await fetch(url, { redirect: "manual" });
  const body = await response.text();

  return {
    route: normalisePathname(`${url.pathname}${url.search}`),
    status: response.status,
    ok: response.ok,
    body,
  };
}

export async function startPreviewServer() {
  const args =
    process.platform === "win32"
      ? ["/d", "/s", "/c", `npm run preview -- --host ${HOST} --port ${PORT}`]
      : ["run", "preview", "--", "--host", HOST, "--port", String(PORT)];
  const child = spawn(npmCommand(), args, {
    cwd: ROOT,
    env: { ...process.env },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let logs = "";

  child.stdout.on("data", (chunk) => {
    logs += chunk.toString();
  });

  child.stderr.on("data", (chunk) => {
    logs += chunk.toString();
  });

  await waitForServer(baseUrl, child);

  return {
    child,
    getLogs() {
      return logs.trim();
    },
  };
}

export async function stopPreviewServer(server) {
  if (!server || server.child.exitCode !== null) {
    return;
  }

  if (process.platform === "win32") {
    const killer = spawn(
      "taskkill",
      ["/pid", String(server.child.pid), "/t", "/f"],
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

  server.child.kill("SIGTERM");
  await Promise.race([
    new Promise((resolve) => server.child.on("exit", resolve)),
    delay(3000).then(() => server.child.kill("SIGKILL")),
  ]);
}

export async function withPreviewServer(callback) {
  const server = await startPreviewServer();

  try {
    return await callback(baseUrl, server);
  } finally {
    await stopPreviewServer(server);
  }
}

function extractAnchorHrefs(html) {
  return [...html.matchAll(/<a\b[^>]*href=(?:"([^"]+)"|'([^']+)')/gi)]
    .map((match) => match[1] ?? match[2] ?? "")
    .filter(Boolean);
}

function resolveLocalRoute(href) {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("javascript:")
  ) {
    return null;
  }

  const url = new URL(href, baseUrl);
  if (!INTERNAL_HOSTS.has(url.hostname)) {
    return null;
  }

  return normalisePathname(`${url.pathname}${url.search}`);
}

function collectJsonLdTypes(html) {
  const types = [];
  const matches = [
    ...html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];

  for (const [, content] of matches) {
    try {
      const parsed = JSON.parse(content.trim());
      const entries = Array.isArray(parsed) ? parsed : [parsed];

      for (const entry of entries) {
        const currentType = entry?.["@type"];
        if (Array.isArray(currentType)) {
          types.push(...currentType);
        } else if (typeof currentType === "string") {
          types.push(currentType);
        }
      }
    } catch {
      types.push("INVALID_JSON");
    }
  }

  return types;
}

export async function runLinkCheck(customBaseUrl = baseUrl, routes) {
  const routesToCheck = routes ?? (await getRoutes());
  const pageFailures = [];
  const linkFailures = [];
  const linksToVerify = new Set();

  for (const route of routesToCheck) {
    const page = await fetchPage(route, customBaseUrl);

    if (!page.ok) {
      pageFailures.push(`${route} returned HTTP ${page.status}.`);
      continue;
    }

    for (const href of extractAnchorHrefs(page.body)) {
      const localRoute = resolveLocalRoute(href);
      if (localRoute) {
        linksToVerify.add(localRoute);
      }
    }
  }

  const uniqueLinks = [...linksToVerify].sort();

  for (const route of uniqueLinks) {
    const page = await fetchPage(route, customBaseUrl);
    if (!page.ok) {
      linkFailures.push(`${route} returned HTTP ${page.status}.`);
    }
  }

  return {
    name: "Link check",
    passed: pageFailures.length === 0 && linkFailures.length === 0,
    checkedPages: routesToCheck.length,
    checkedLinks: uniqueLinks.length,
    failures: [...pageFailures, ...linkFailures],
  };
}

export async function runSchemaCheck(customBaseUrl = baseUrl) {
  const failures = [];
  const home = await fetchPage("/", customBaseUrl);
  const contact = await fetchPage("/contact", customBaseUrl);

  if (!home.ok) {
    failures.push(`Home page returned HTTP ${home.status}.`);
  } else {
    const types = collectJsonLdTypes(home.body);
    if (!types.includes("WebSite")) {
      failures.push("Home page is missing WebSite JSON-LD.");
    }
    if (!types.includes("LocalBusiness")) {
      failures.push("Home page is missing LocalBusiness JSON-LD.");
    }
  }

  if (!contact.ok) {
    failures.push(`Contact page returned HTTP ${contact.status}.`);
  } else {
    const types = collectJsonLdTypes(contact.body);
    if (!types.includes("LocalBusiness")) {
      failures.push("Contact page is missing LocalBusiness JSON-LD.");
    }
  }

  return {
    name: "Schema check",
    passed: failures.length === 0,
    failures,
  };
}

export async function runA11yCheck(customBaseUrl = baseUrl, routes) {
  const routesToCheck = routes ?? (await getRoutes());
  const failures = [];

  for (const route of routesToCheck) {
    const page = await fetchPage(route, customBaseUrl);
    if (!page.ok) {
      failures.push(
        `${route} could not be checked because it returned HTTP ${page.status}.`,
      );
      continue;
    }

    if (!/<html[^>]*\slang="[^"]+"/i.test(page.body)) {
      failures.push(
        `${route} is missing a lang attribute on the html element.`,
      );
    }

    if ((page.body.match(/<h1\b/gi) ?? []).length !== 1) {
      failures.push(`${route} should contain exactly one h1 element.`);
    }

    if (!/Skip to main content/i.test(page.body)) {
      failures.push(`${route} is missing the skip link.`);
    }

    if (!/<title>[\s\S]+<\/title>/i.test(page.body)) {
      failures.push(`${route} is missing a document title.`);
    }

    if (!/<meta[^>]+name="description"[^>]+content="[^"]+"/i.test(page.body)) {
      failures.push(`${route} is missing a meta description.`);
    }

    const emptyButtons = [
      ...page.body.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/gi),
    ]
      .map((match) => stripTags(match[1] ?? ""))
      .filter((text) => text.length === 0);
    if (emptyButtons.length > 0) {
      failures.push(`${route} contains a button without accessible text.`);
    }

    const iframeWithoutTitle = [
      ...page.body.matchAll(/<iframe\b(?![^>]*\stitle=)[^>]*>/gi),
    ].length;
    if (iframeWithoutTitle > 0) {
      failures.push(`${route} contains an iframe without a title attribute.`);
    }

    if (route === "/contact") {
      const controls = [
        ...page.body.matchAll(
          /<(input|select|textarea)\b[^>]*\sid="([^"]+)"/gi,
        ),
      ].map((match) => match[2]);

      for (const id of controls) {
        const labelPattern = new RegExp(
          `<label[^>]*for=["']${escapeRegex(id)}["']`,
          "i",
        );
        if (!labelPattern.test(page.body)) {
          failures.push(`/contact is missing a label for #${id}.`);
        }
      }
    }
  }

  return {
    name: "Accessibility check",
    passed: failures.length === 0,
    checkedPages: routesToCheck.length,
    failures,
  };
}
