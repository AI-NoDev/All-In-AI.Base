/**
 * 测试AI模型
 */

import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { model, provider } from '@qiyu-allinai/db/entities/ai';
import { modelTestOutputSchema } from './schemas';
import { generateText } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

export const modelTest = defineAction({
  meta: {
    name: 'ai.model.test',
    displayName: '测试AI模型',
    description: `发送测试消息验证AI模型是否正常工作。

**路径参数：**
- id: 模型的UUID

**请求体：**
- message: 测试消息内容，默认为 "Hello, please respond with a brief greeting."

**返回：**
- success: 是否成功
- response: 模型响应内容
- thinking: 思考过程（如果模型支持）
- supportThinking: 是否支持思考模式
- error: 错误信息（失败时）
- latencyMs: 响应延迟（毫秒）

**示例：**
\`\`\`json
POST /api/ai/model/xxx-uuid/test
{
  "message": "你好，请用中文回复"
}
\`\`\``,
    tags: ['ai', 'model'],
    method: 'POST',
    path: '/api/ai/model/:id/test',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({
      message: z.string().default('Hello, please respond with a brief greeting.'),
    }),
    outputSchema: modelTestOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const startTime = Date.now();

    // 获取模型信息
    const [modelInfo] = await db.select().from(model).where(eq(model.id, input.id)).limit(1);
    if (!modelInfo) {
      throw ActionError.notFound('error.ai.model.notFound');
    }

    // 获取提供商信息
    const [providerInfo] = await db.select().from(provider).where(eq(provider.id, modelInfo.providerId)).limit(1);
    if (!providerInfo) {
      throw ActionError.notFound('error.ai.provider.notFound');
    }

    const supportThinking = modelInfo.supportThinking ?? false;

    try {
      const aiProvider = createOpenAICompatible({
        baseURL: providerInfo.baseUrl,
        apiKey: providerInfo.token,
        name: providerInfo.name,
      });

      const result = await generateText({
        model: aiProvider(modelInfo.modelId),
        messages: [{ role: 'user', content: input.message }],
      });

      const latencyMs = Date.now() - startTime;

      // 提取思考内容
      let thinkingContent: { type: string; text: string }[] | null = null;
      if (supportThinking && result.reasoning) {
        if (typeof result.reasoning === 'string') {
          thinkingContent = [{ type: 'reasoning', text: result.reasoning }];
        } else if (Array.isArray(result.reasoning)) {
          thinkingContent = result.reasoning;
        }
      }

      return {
        success: true,
        response: result.text,
        thinking: thinkingContent,
        supportThinking,
        error: null,
        latencyMs,
      };
    } catch (err) {
      const latencyMs = Date.now() - startTime;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return {
        success: false,
        response: null,
        thinking: null,
        supportThinking,
        error: errorMessage,
        latencyMs,
      };
    }
  },
});
