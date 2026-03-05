import assert from "node:assert/strict";
import test from "node:test";

import { contactSchema } from "../src/lib/validation";

test("contact schema accepts a valid enquiry", () => {
  const result = contactSchema.safeParse({
    name: "Test Person",
    email: "test@example.com",
    phone: "",
    preferredContact: "Email",
    preferredTimes: "Weekday afternoons",
    message: "I would like to ask about availability for counselling support.",
    consent: "on",
    company: "",
  });

  assert.equal(result.success, true);
});

test("contact schema rejects submissions without email or phone", () => {
  const result = contactSchema.safeParse({
    name: "Test Person",
    email: "",
    phone: "",
    preferredContact: "Either",
    preferredTimes: "",
    message: "I would like to ask about availability for counselling support.",
    consent: "on",
    company: "",
  });

  assert.equal(result.success, false);
});
