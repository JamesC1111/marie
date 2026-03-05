import type { APIRoute } from "astro";

import {
  getContactDeliveryConfig,
  logLocalPreviewSubmission,
} from "../../lib/contact-delivery";
import { sendContactEmail } from "../../lib/email";
import { getRequestHost } from "../../lib/request";
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

type RedirectStatus = 300 | 301 | 302 | 303 | 304 | 307 | 308;
type RedirectFn = (path: string, status?: RedirectStatus) => Response;

function redirectToContact(redirect: RedirectFn, target: string) {
  return redirect(`/contact${target}#contact-status`, 303);
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
      return redirectToContact(redirect, "?status=success");
    }

    const key = getClientKey(request.headers, clientAddress);
    if (isRateLimited(key)) {
      return redirectToContact(redirect, "?error=rate-limit");
    }

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      return redirectToContact(redirect, "?error=validation");
    }

    const requestHost = getRequestHost(request, new URL(request.url));
    const delivery = getContactDeliveryConfig(requestHost);

    if (delivery.mode === "unavailable") {
      console.error(delivery.operatorMessage);
      return redirectToContact(redirect, "?error=service-unavailable");
    }

    if (delivery.mode === "local-preview") {
      logLocalPreviewSubmission(delivery.operatorMessage, parsed.data);
      return redirectToContact(redirect, "?status=success");
    }

    await sendContactEmail(
      {
        name: parsed.data.name,
        email: parsed.data.email ?? "",
        phone: parsed.data.phone ?? "",
        preferredContact: parsed.data.preferredContact,
        preferredTimes: parsed.data.preferredTimes ?? "",
        message: parsed.data.message,
      },
      delivery,
    );

    return redirectToContact(redirect, "?status=success");
  } catch (error) {
    console.error("[contact] submission error", error);
    return redirectToContact(redirect, "?error=server");
  }
};
