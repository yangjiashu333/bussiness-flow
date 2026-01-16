import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import type { HonoEnv } from '../types';
import { readJson } from '../utils/read-json';
import { explainJsonWithOpenAI } from '../utils/openai';

export const apiRoutes = new Hono<HonoEnv>();

type EchoPayload = Record<string, unknown>;

interface EchoResponse {
  payload: EchoPayload;
  meta: {
    processed: boolean;
    requestId?: string;
    explanation?: string;
    explanationModel?: string;
  };
}

apiRoutes.post('/echo', async (c) => {
  const maxBodyBytes = Number(c.env.MAX_BODY_BYTES ?? 4096);
  const body = await readJson<EchoPayload>(c, maxBodyBytes);

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new HTTPException(400, { message: 'Body must be a JSON object' });
  }

  // 尝试获取AI解释（可选功能）
  const aiResult = await explainJsonWithOpenAI(c.env, body);

  const response: EchoResponse = {
    payload: body,
    meta: {
      processed: true,
      requestId: c.get('requestId'),
    },
  };

  // 如果AI可用，添加explanation字段
  if (aiResult) {
    response.meta.explanation = aiResult.explanation;
    response.meta.explanationModel = aiResult.model;
  }

  return c.json(response);
});
