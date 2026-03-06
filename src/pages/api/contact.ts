import type { APIRoute } from "astro";

import { sendContactEmail } from "../../lib/email";
import { isRateLimited } from "../../lib/rate-limit";
import { contactSchema } from "../../lib/validation";

export const prerender = false;

function getClientKey(headers: Headers, clientAddress?: string) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return clientAddress ?? "unknown";
}

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
  try {
    const formData = await request.formData();

    const raw = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      preferredContact: String(formData.get("preferredContact") ?? ""),
      preferredTimes: String(formData.get("preferredTimes") ?? ""),
      message: String(formData.get("message") ?? ""),
      consent: String(formData.get("consent") ?? ""),
      company: String(formData.get("company") ?? ""),
    };

    if (raw.company.trim()) {
      return redirect("/contact?status=success", 303);
    }

    const key = getClientKey(request.headers, clientAddress);
    if (isRateLimited(key)) {
      return redirect("/contact?error=rate-limit", 303);
    }

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      return redirect("/contact?error=validation", 303);
    }

    await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email ?? "",
      phone: parsed.data.phone ?? "",
      preferredContact: parsed.data.preferredContact,
      preferredTimes: parsed.data.preferredTimes ?? "",
      message: parsed.data.message,
    });

    return redirect("/contact?status=success", 303);
  } catch (error) {
    console.error("[contact] submission error", error);
    return redirect("/contact?error=server", 303);
  }
};
