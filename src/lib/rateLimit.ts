// A small in-memory limiter. It is enough to slow down a single visitor on one server instance.
// It is not shared between Vercel instances, so treat it as a speed bump, not a lock.

interface Entry {
  count: number;
  windowStart: number;
}

export function createRateLimiter(windowMs: number, maxRequests: number) {
  const store = new Map<string, Entry>();

  return function check(key: string, now = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
    // Drop old entries so the map cannot grow without limit.
    if (store.size > 1000) {
      for (const [k, e] of store) {
        if (now - e.windowStart > windowMs) store.delete(k);
      }
    }

    const entry = store.get(key);
    if (!entry || now - entry.windowStart > windowMs) {
      store.set(key, { count: 1, windowStart: now });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    if (entry.count >= maxRequests) {
      return { allowed: false, retryAfterSeconds: Math.ceil((windowMs - (now - entry.windowStart)) / 1000) };
    }
    entry.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  };
}
