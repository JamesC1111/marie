import nodemailer from "nodemailer";

import type { SmtpDeliveryConfig } from "./contact-delivery";
import { siteConfig } from "./site";

export type ContactSubmission = {
  name: string;
  email: string;
  phone: string;
  preferredContact: string;
  preferredTimes: string;
  message: string;
};

export async function sendContactEmail(
  payload: ContactSubmission,
  delivery: SmtpDeliveryConfig,
) {
  const transport = nodemailer.createTransport(delivery.transport);
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
    to: delivery.to,
    from: delivery.from,
    replyTo: payload.email || undefined,
    subject: `New enquiry: ${payload.name}`,
    text: lines.join("\n"),
  });
}
