import type { NotFoundHandler } from 'hono';

export const notFoundHandler: NotFoundHandler = (c) => {
  const path = c.req.path;

  if (path.startsWith('/api')) {
    return c.json(
      {
        error: 'Not Found',
        path,
      },
      404,
    );
  }

  return c.text('Not Found', 404);
};
