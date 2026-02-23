/**
 * 更新用户记忆
 */

import { t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userMemory, userMemorySchemas } from '@qiyu-allinai/db/entities/ai';

export const userMemoryUpdate = defineAction({
  meta: {
    name: 'ai.userMemory.update',
    displayName: '更新用户记忆',
    description: '更新用户记忆内容、重要性等信息',
    tags: ['ai', 'memory'],
    method: 'PUT',
    path: '/api/ai/user-memory/:id',
  },
  schemas: {
    paramsSchema: t.Object({
      id: t.String({ description: '记忆ID' }),
    }, { description: '路径参数' }),
    bodySchema: t.Object({
      data: userMemorySchemas.update,
      regenerateEmbedding: t.Boolean({ default: false, description: '是否重新生成向量嵌入' }),
    }, { description: '更新用户记忆请求体' }),
    outputSchema: userMemorySchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const { id, data, regenerateEmbedding } = input;

    // 检查记忆是否存在
    const [existing] = await db.select()
      .from(userMemory)
      .where(and(
        eq(userMemory.id, id),
        eq(userMemory.status, '0')
      ))
      .limit(1);

    if (!existing) {
      throw new Error('error.ai.memory.notFound');
    }

    // 如果内容变更且需要重新生成嵌入
    let embedding: number[] | undefined;
    if (regenerateEmbedding && data.content && context.embeddingService) {
      embedding = await context.embeddingService.generateEmbedding(data.content);
    }

    const [result] = await db.update(userMemory)
      .set({
        ...data,
        ...(embedding ? { embedding } : {}),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(userMemory.id, id))
      .returning();

    if (!result) {
      throw new Error('error.ai.memory.updateFailed');
    }

    return result;
  },
});
