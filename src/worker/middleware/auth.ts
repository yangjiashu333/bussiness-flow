import { HTTPException } from 'hono/http-exception';
import { createMiddleware } from 'hono/factory';
import type { HonoEnv } from '../types';
import { safeEqual } from '../utils/safe-equal';

export const apiKeyAuth = createMiddleware<HonoEnv>(async (c, next) => {
  const configuredKey = c.env.API_KEY;

  if (!configuredKey) {
    throw new HTTPException(503, { message: 'API key not configured' });
  }

  const provided = c.req.header('x-api-key');
  if (!provided || !safeEqual(provided, configuredKey)) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  await next();
});
