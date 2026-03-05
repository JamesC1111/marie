const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 4;

type Entry = number[];

const attempts = new Map<string, Entry>();

export function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key) ?? [];
  const recent = current.filter((time) => now - time < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    attempts.set(key, recent);
    return true;
  }

  recent.push(now);
  attempts.set(key, recent);
  return false;
}
