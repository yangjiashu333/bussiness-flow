import OpenAI from 'openai';
import type { Bindings } from '../types';

export const explainJsonWithOpenAI = async (
  env: Bindings,
  payload: Record<string, unknown>,
): Promise<{ explanation: string; model: string } | null> => {
  // 检查必需的配置，如果缺失则返回 null（fallback）
  const apiKey = env.OPENAI_API_KEY;
  const model = env.OPENAI_MODEL;
  const baseURL = env.OPENAI_BASE_URL;

  if (!apiKey || !model || !baseURL) {
    console.warn('OpenAI configuration incomplete, skipping AI explanation');
    return null;
  }

  try {
    const client = new OpenAI({
      apiKey,
      baseURL,
    });

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You explain JSON payloads in concise Chinese. Focus on meaning and business intent. Use short sentences.',
        },
        {
          role: 'user',
          content: `Explain the following JSON:\n${JSON.stringify(payload, null, 2)}`,
        },
      ],
    });

    const explanation = response.choices?.[0]?.message?.content?.trim();
    if (!explanation) {
      console.warn('Empty response from OpenAI, skipping AI explanation');
      return null;
    }

    return { explanation, model };
  } catch (error) {
    // 捕获任何错误（网络错误、API错误等），fallback到普通echo
    console.error('OpenAI API error, skipping AI explanation:', error);
    return null;
  }
};
