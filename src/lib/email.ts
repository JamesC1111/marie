import nodemailer from "nodemailer";
import { practiceContact, siteConfig } from "./site";

export type ContactSubmission = {
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  preferredTimes: string;
  message: string;
};

function hasSmtpConfig() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS,
  );
}

export async function sendContactEmail(payload: ContactSubmission) {
  if (!hasSmtpConfig()) {
    if (import.meta.env.DEV) {
      console.info(
        "[contact] SMTP not configured. Submission preview:",
        payload,
      );
      return;
    }

    throw new Error("Email service is not configured.");
  }

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure:
      process.env.SMTP_SECURE === "true" ||
      Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const to = process.env.CONTACT_TO_EMAIL ?? practiceContact.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? process.env.SMTP_USER!;

  const lines = [
    `New website enquiry for ${siteConfig.name}`,
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email || "Not provided"}`,
    `Phone: ${payload.phone || "Not provided"}`,
    `Preferred contact method: ${payload.preferredContact}`,
    `Preferred times: ${payload.preferredTimes || "Not specified"}`,
    "",
    "Message:",
    payload.message,
  ];

  await transport.sendMail({
    to,
    from,
    replyTo: payload.email || undefined,
    subject: `New enquiry: ${payload.name}`,
    text: lines.join("\n"),
  });
}
