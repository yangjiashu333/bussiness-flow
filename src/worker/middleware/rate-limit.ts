import { HTTPException } from 'hono/http-exception';
import { createMiddleware } from 'hono/factory';
import type { HonoEnv } from '../types';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = value ? Number(value) : Number.NaN;
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const rateLimit = createMiddleware<HonoEnv>(async (c, next) => {
  const max = parseNumber(c.env.RATE_LIMIT_MAX, 60);
  const windowSeconds = parseNumber(c.env.RATE_LIMIT_WINDOW_SECONDS, 60);

  if (max <= 0 || windowSeconds <= 0) {
    await next();
    return;
  }

  const ip = c.req.header('cf-connecting-ip') ?? c.req.header('x-forwarded-for') ?? 'unknown';
  const key = `${ip}:${c.req.path}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    await next();
    return;
  }

  if (bucket.count >= max) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    c.header('retry-after', String(retryAfter));
    throw new HTTPException(429, { message: 'Too Many Requests' });
  }

  bucket.count += 1;
  await next();
});
