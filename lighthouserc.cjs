const path = require("node:path");

const chromeProfileDir = path.join(
  __dirname,
  "artifacts",
  "tmp",
  "chrome-profile",
);

module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      startServerCommand: "npm run preview -- --host 127.0.0.1 --port 4321",
      startServerReadyTimeout: 30000,
      chromeFlags: `--headless=new --user-data-dir=${chromeProfileDir}`,
      url: [
        "http://127.0.0.1:4321/",
        "http://127.0.0.1:4321/services",
        "http://127.0.0.1:4321/contact",
      ],
      settings: {
        preset: "desktop",
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
  },
};
