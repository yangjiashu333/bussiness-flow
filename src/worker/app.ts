import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import type { HonoEnv } from './types';
import { errorHandler } from './handlers/error';
import { notFoundHandler } from './handlers/not-found';
import { apiKeyAuth } from './middleware/auth';
import { rateLimit } from './middleware/rate-limit';
import { apiRoutes } from './routes/api';
import { healthRoutes } from './routes/health';

const app = new Hono<HonoEnv>();

app.use('*', requestId());
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', prettyJSON());

app.use('/api/*', async (c, next) => {
  const origin = c.env.CORS_ORIGIN ?? '*';
  return cors({ origin })(c, next);
});
app.use('/api/*', rateLimit);
app.use('/api/*', apiKeyAuth);

app.route('/api', apiRoutes);
app.route('/health', healthRoutes);

app.notFound(notFoundHandler);
app.onError(errorHandler);

export default app;
