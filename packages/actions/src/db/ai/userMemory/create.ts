/**
 * 创建用户记忆
 */

import { defineAction } from '../../../core/define';
import { userMemory, userMemoryZodSchemas, MEMORY_TYPES } from '@qiyu-allinai/db/entities/ai';
import { getDefaultSTMExpireTime } from './utils';
import { z } from 'zod';

export const userMemoryCreate = defineAction({
  meta: {
    name: 'ai.userMemory.create',
    displayName: '创建用户记忆',
    description: '创建一条新的用户记忆，支持自动生成向量嵌入',
    tags: ['ai', 'memory', 'create'],
    method: 'POST',
    path: '/api/ai/user-memory',
  },
  schemas: {
    bodySchema: z.object({
      data: userMemoryZodSchemas.insert.describe('记忆数据'),
      generateEmbedding: z.boolean().default(false).describe('是否自动生成向量嵌入（需要配置嵌入服务）'),
    }).describe('创建用户记忆请求体'),
    outputSchema: userMemoryZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    const { data, generateEmbedding } = input;

    // 如果是短期记忆且未设置过期时间，自动设置24小时后过期
    let expireAt = data.expireAt;
    if (data.memoryType === MEMORY_TYPES.STM && !expireAt) {
      expireAt = getDefaultSTMExpireTime();
    }

    // 生成向量嵌入（如果需要且有嵌入服务）
    let embedding: number[] | undefined;
    if (generateEmbedding && context.embeddingService) {
      embedding = await context.embeddingService.generateEmbedding(data.content);
    }

    const [result] = await db.insert(userMemory).values({
      ...data,
      userId: data.userId || currentUserId,
      expireAt,
      embedding,
    }).returning();

    if (!result) {
      throw new Error('error.ai.memory.createFailed');
    }

    return result;
  },
});
