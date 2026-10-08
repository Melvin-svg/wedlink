import { headers } from "next/headers";

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window rate limiter
const store = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  const maxWindow = 60 * 60 * 1000; // 1 hour
  for (const [key, record] of store.entries()) {
    record.timestamps = record.timestamps.filter((ts) => now - ts < maxWindow);
    if (record.timestamps.length === 0) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000).unref(); // unref so it does not keep process alive

export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    const realIp = headerList.get("x-real-ip");
    if (realIp) return realIp.trim();
  } catch {
    // Outside request context
  }
  return "127.0.0.1";
}

/**
 * Checks whether the given key has exceeded `limit` requests in `windowMs`.
 * Returns `{ allowed: true, remaining: number }` or `{ allowed: false, retryAfterSeconds: number }`.
 */
export async function rateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): Promise<{ allowed: boolean; remaining?: number; retryAfterSeconds?: number }> {
  const now = Date.now();
  const record = store.get(key) || { timestamps: [] };

  // Retain only timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldest = record.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    store.set(key, record);
    return { allowed: false, retryAfterSeconds };
  }

  record.timestamps.push(now);
  store.set(key, record);
  return { allowed: true, remaining: limit - record.timestamps.length };
}
