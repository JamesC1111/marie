import assert from "node:assert/strict";
import process from "node:process";
import test from "node:test";

import {
  getCanonicalHostname,
  getRequestHost,
  shouldNoIndexHost,
} from "../src/lib/request";
import { getContactDeliveryConfig } from "../src/lib/contact-delivery";

function withEnv(
  overrides: Record<string, string | undefined>,
  callback: () => void,
) {
  const previous: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(overrides)) {
    previous[key] = process.env[key];
    if (typeof value === "undefined") {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    callback();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (typeof value === "undefined") {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

test("getRequestHost prefers forwarded host and strips the port", () => {
  const request = new Request("https://example.com/contact", {
    headers: {
      "x-forwarded-host": "preview-service.onrender.com:10000",
      host: "ignored.example.com",
    },
  });

  const host = getRequestHost(request, new URL(request.url));

  assert.equal(host, "preview-service.onrender.com");
});

test("only the live www host is indexable", () => {
  assert.equal(shouldNoIndexHost(getCanonicalHostname()), false);
  assert.equal(
    shouldNoIndexHost("mariehardingcounselling-service.onrender.com"),
    true,
  );
  assert.equal(shouldNoIndexHost("127.0.0.1"), true);
});

test("contact delivery falls back locally when SMTP is missing", () => {
  withEnv(
    {
      SMTP_HOST: undefined,
      SMTP_PORT: undefined,
      SMTP_USER: undefined,
      SMTP_PASS: undefined,
      CONTACT_FROM_EMAIL: undefined,
      CONTACT_TO_EMAIL: undefined,
    },
    () => {
      const config = getContactDeliveryConfig("127.0.0.1");

      assert.equal(config.mode, "local-preview");
      assert.equal(config.available, true);
    },
  );
});

test("contact delivery is unavailable on non-local hosts when SMTP is missing", () => {
  withEnv(
    {
      SMTP_HOST: undefined,
      SMTP_PORT: undefined,
      SMTP_USER: undefined,
      SMTP_PASS: undefined,
      CONTACT_FROM_EMAIL: undefined,
      CONTACT_TO_EMAIL: undefined,
    },
    () => {
      const config = getContactDeliveryConfig(
        "mariehardingcounselling-service.onrender.com",
      );

      assert.equal(config.mode, "unavailable");
      assert.equal(config.available, false);
      assert.match(config.operatorMessage, /Form delivery is unavailable/);
    },
  );
});

test("contact delivery uses SMTP when the required environment is present", () => {
  withEnv(
    {
      SMTP_HOST: "smtp.example.com",
      SMTP_PORT: "587",
      SMTP_USER: "smtp-user@example.com",
      SMTP_PASS: "secret",
      CONTACT_FROM_EMAIL: "website@example.com",
      CONTACT_TO_EMAIL: "marie@example.com",
      SMTP_SECURE: "false",
    },
    () => {
      const config = getContactDeliveryConfig(getCanonicalHostname());

      assert.equal(config.mode, "smtp");
      assert.equal(config.available, true);
      assert.equal(config.to, "marie@example.com");
      assert.equal(config.from, "website@example.com");
      assert.equal(config.transport.host, "smtp.example.com");
    },
  );
});
