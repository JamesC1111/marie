import assert from "node:assert/strict";
import test from "node:test";

import { getChatReply } from "../src/lib/chat-assistant";
import { callbackSchema } from "../src/lib/validation";

test("callback schema accepts a valid callback request", () => {
  const result = callbackSchema.safeParse({
    name: "Test Person",
    email: "test@example.com",
    phone: "",
    preferredContact: "Email",
    preferredTimes: "Weekday mornings",
    consent: "on",
    company: "",
  });

  assert.equal(result.success, true);
});

test("callback schema rejects requests without email or phone", () => {
  const result = callbackSchema.safeParse({
    name: "Test Person",
    email: "",
    phone: "",
    preferredContact: "Either",
    preferredTimes: "",
    consent: "on",
    company: "",
  });

  assert.equal(result.success, false);
});

test("chat assistant escalates urgent messages", () => {
  const reply = getChatReply("I feel like I might self-harm");

  assert.equal(reply.kind, "urgent");
  assert.match(reply.message, /112 or 999/);
});

test("chat assistant answers practical appointment questions", () => {
  const reply = getChatReply("How do I book an appointment?");

  assert.equal(reply.kind, "intent");
  assert.match(reply.message, /availability/);
});
