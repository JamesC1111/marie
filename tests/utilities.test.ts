import assert from "node:assert/strict";
import test from "node:test";

import { getEntrySlug } from "../src/lib/content";
import { isRateLimited } from "../src/lib/rate-limit";

test("getEntrySlug removes markdown extensions", () => {
  assert.equal(
    getEntrySlug("addiction-counselling.md"),
    "addiction-counselling",
  );
  assert.equal(getEntrySlug("notes/example.mdx"), "notes/example");
});

test("rate limit blocks after four requests in the window", () => {
  const key = `test-${Date.now()}`;

  assert.equal(isRateLimited(key), false);
  assert.equal(isRateLimited(key), false);
  assert.equal(isRateLimited(key), false);
  assert.equal(isRateLimited(key), false);
  assert.equal(isRateLimited(key), true);
});
