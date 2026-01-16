import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { HonoEnv } from '../types';
import { readJson } from '../utils/read-json';

export const apiRoutes = new Hono<HonoEnv>();

type EchoPayload = Record<string, unknown>;

apiRoutes.post('/echo', async (c) => {
  const maxBodyBytes = Number(c.env.MAX_BODY_BYTES ?? 4096);
  const body = await readJson<EchoPayload>(c, maxBodyBytes);

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HTTPException(400, { message: 'Body must be a JSON object' });
  }

  await new Promise((resolve) => setTimeout(resolve, 1));

  return c.json({
    ...body,
    processed: true,
    requestId: c.get('requestId'),
  });
});
