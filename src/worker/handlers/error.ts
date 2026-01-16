import { HTTPException } from 'hono/http-exception';
import type { ErrorHandler } from 'hono';

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  const requestId = c.get('requestId');
  console.error('Unhandled error', {
    requestId,
    message: err instanceof Error ? err.message : String(err),
  });

  return c.json(
    {
      error: 'Internal Server Error',
      requestId,
    },
    500,
  );
};
