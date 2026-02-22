/**
 * 更新用户记忆
 */

import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userMemory, userMemoryZodSchemas } from '@qiyu-allinai/db/entities/ai';
import { z } from 'zod';

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
    paramsSchema: z.object({
      id: z.string().describe('记忆ID'),
    }).describe('路径参数'),
    bodySchema: z.object({
      data: userMemoryZodSchemas.update.describe('更新数据'),
      regenerateEmbedding: z.boolean().default(false).describe('是否重新生成向量嵌入'),
    }).describe('更新用户记忆请求体'),
    outputSchema: userMemoryZodSchemas.select,
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
