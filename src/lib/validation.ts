import { z } from "zod";

import { preferredContactOptions, preferredTimeValues } from "./contact-form";

export const contactSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name.").max(80),
    email: z.string().trim().max(160).optional().or(z.literal("")),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    preferredContact: z.enum(preferredContactOptions, {
      errorMap: () => ({ message: "Please choose a contact method." }),
    }),
    preferredTimes: z
      .string()
      .trim()
      .max(120)
      .refine(
        (value) => value === "" || preferredTimeValues.some((option) => option === value),
        "Please choose a valid preferred time.",
      )
      .optional()
      .or(z.literal("")),
    message: z.string().trim().min(12, "Please add a short message.").max(1200),
    consent: z.literal("on", {
      errorMap: () => ({ message: "Please confirm consent to be contacted." }),
    }),
    company: z.string().max(0).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const hasEmail = Boolean(data.email);
    const hasPhone = Boolean(data.phone);

    if (!hasEmail && !hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide an email address or phone number.",
        path: ["email"],
      });
    }

    if (data.preferredContact === "Email" && !hasEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide an email address.",
        path: ["email"],
      });
    }

    if (data.preferredContact === "Phone" && !hasPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide a phone number.",
        path: ["phone"],
      });
    }

    if (hasEmail) {
      const emailCheck = z
        .string()
        .email("Please enter a valid email address.");
      const result = emailCheck.safeParse(data.email);
      if (!result.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please enter a valid email address.",
          path: ["email"],
        });
      }
    }
  });

export type ContactFormInput = z.infer<typeof contactSchema>;
