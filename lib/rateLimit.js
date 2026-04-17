// lib/rateLimit.js
// In-memory IP-based rate limiter for Vercel serverless functions.
// Limits: analyze = 10 req/min, reviews + search = 30 req/min
// Note: each warm Vercel instance has its own counter (stateless by design).
// Upgrade to Upstash Redis when >100 DAU or unexpected billing appears.

const store = new Map(); // { ip+route -> { count, resetAt } }

/**
 * @param {string} ip
 * @param {string} route  - e.g. 'analyze'
 * @param {number} limit  - max requests per window
 * @param {number} windowMs - window size in ms (default 60_000)
 * @returns {{ allowed: boolean, remaining: number, resetIn: number }}
 */
export function rateLimit(ip, route, limit, windowMs = 60_000) {
  const key = ip + ':' + route;
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetIn: windowMs };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  return {
    allowed: entry.count <= limit,
    remaining,
    resetIn: entry.resetAt - now,
  };
}

/** Extracts the real IP from a Vercel/Next.js request */
export function getIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}
