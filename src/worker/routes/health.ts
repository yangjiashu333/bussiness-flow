import { Hono } from 'hono';

export const healthRoutes = new Hono();

healthRoutes.get('/', (c) =>
  c.json({
    ok: true,
    timestamp: new Date().toISOString(),
  }),
);
