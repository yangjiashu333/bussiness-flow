import { HTTPException } from 'hono/http-exception';
import type { Context } from 'hono';
import type { HonoEnv } from '../types';

export const readJson = async <T>(c: Context<HonoEnv>, maxBytes: number): Promise<T> => {
  const contentLength = c.req.header('content-length');
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new HTTPException(413, { message: 'Payload too large' });
  }

  const text = await c.req.text();
  if (text.length > maxBytes) {
    throw new HTTPException(413, { message: 'Payload too large' });
  }

  if (!text) {
    throw new HTTPException(400, { message: 'Request body required' });
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HTTPException(400, { message: 'Invalid JSON' });
  }
};
