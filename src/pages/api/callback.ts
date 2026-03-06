import type { APIRoute } from "astro";

import {
  getContactDeliveryConfig,
  logLocalPreviewSubmission,
} from "../../lib/contact-delivery";
import { sendCallbackEmail } from "../../lib/email";
import { isRateLimited } from "../../lib/rate-limit";
import { getRequestHost } from "../../lib/request";
import { callbackSchema } from "../../lib/validation";

export const prerender = false;

function getClientKey(headers: Headers, clientAddress?: string) {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return clientAddress ?? "unknown";
}

function sanitiseReturnPath(input: string) {
  const value = input.trim();
  if (!value.startsWith("/")) {
    return "/contact";
  }

  if (value.startsWith("//")) {
    return "/contact";
  }

  return value.replace(/[\r\n]/g, "") || "/contact";
}

function buildRedirectPath(returnPath: string, status: string) {
  const url = new URL(returnPath, "https://www.mariehardingcounselling.ie");
  url.searchParams.set("callback", status);
  return `${url.pathname}${url.search}#callback-capture`;
}

type RedirectStatus = 300 | 301 | 302 | 303 | 304 | 307 | 308;
type RedirectFn = (path: string, status?: RedirectStatus) => Response;

function redirectToPath(
  redirect: RedirectFn,
  returnPath: string,
  status: string,
) {
  return redirect(buildRedirectPath(returnPath, status), 303);
}

export const POST: APIRoute = async ({ request, redirect, clientAddress }) => {
  try {
    const formData = await request.formData();
    const returnPath = sanitiseReturnPath(
      String(formData.get("returnPath") ?? "/contact"),
    );

    const raw = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      preferredContact: String(formData.get("preferredContact") ?? ""),
      preferredTimes: String(formData.get("preferredTimes") ?? ""),
      consent: String(formData.get("consent") ?? ""),
      company: String(formData.get("company") ?? ""),
    };

    if (raw.company.trim()) {
      return redirectToPath(redirect, returnPath, "success");
    }

    const key = `${getClientKey(request.headers, clientAddress)}:callback`;
    if (isRateLimited(key)) {
      return redirectToPath(redirect, returnPath, "rate-limit");
    }

    const parsed = callbackSchema.safeParse(raw);
    if (!parsed.success) {
      return redirectToPath(redirect, returnPath, "validation");
    }

    const requestHost = getRequestHost(request, new URL(request.url));
    const delivery = getContactDeliveryConfig(requestHost);

    if (delivery.mode === "unavailable") {
      console.error(delivery.operatorMessage);
      return redirectToPath(redirect, returnPath, "service-unavailable");
    }

    if (delivery.mode === "local-preview") {
      logLocalPreviewSubmission(delivery.operatorMessage, parsed.data);
      return redirectToPath(redirect, returnPath, "success");
    }

    await sendCallbackEmail(
      {
        name: parsed.data.name,
        email: parsed.data.email ?? "",
        phone: parsed.data.phone ?? "",
        preferredContact: parsed.data.preferredContact,
        preferredTimes: parsed.data.preferredTimes ?? "",
      },
      delivery,
    );

    return redirectToPath(redirect, returnPath, "success");
  } catch (error) {
    console.error("[callback] submission error", error);
    return redirectToPath(redirect, "/contact", "server");
  }
};
