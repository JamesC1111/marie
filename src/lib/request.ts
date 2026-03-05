import { siteConfig } from "./site";

const CANONICAL_HOSTNAME = new URL(siteConfig.siteUrl).hostname;
const LOCAL_HOSTNAMES = new Set(["127.0.0.1", "localhost"]);

function normaliseHostValue(value: string | null | undefined) {
  const candidate = (value ?? "").trim().toLowerCase();

  if (!candidate) {
    return "";
  }

  try {
    return new URL(`http://${candidate}`).hostname.toLowerCase();
  } catch {
    return candidate.replace(/:\d+$/, "").replace(/\.$/, "");
  }
}

export function getRequestHost(request: Request, currentUrl: URL) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    return normaliseHostValue(forwardedHost.split(",")[0]);
  }

  const host = request.headers.get("host");
  if (host) {
    return normaliseHostValue(host);
  }

  return normaliseHostValue(currentUrl.host);
}

export function isCanonicalHost(host: string) {
  return normaliseHostValue(host) === CANONICAL_HOSTNAME;
}

export function isLocalHost(host: string) {
  return LOCAL_HOSTNAMES.has(normaliseHostValue(host));
}

export function shouldNoIndexHost(host: string) {
  const normalisedHost = normaliseHostValue(host);
  return Boolean(normalisedHost) && !isCanonicalHost(normalisedHost);
}

export function getCanonicalHostname() {
  return CANONICAL_HOSTNAME;
}
