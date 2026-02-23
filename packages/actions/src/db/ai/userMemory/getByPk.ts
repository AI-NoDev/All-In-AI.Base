/**
 * 根据ID查询用户记忆
 */

import { t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userMemory, userMemorySchemas } from '@qiyu-allinai/db/entities/ai';

export const userMemoryGetByPk = defineAction({
  meta: {
    name: 'ai.userMemory.getByPk',
    displayName: '查询用户记忆详情',
    description: '根据ID查询单条用户记忆详情',
    tags: ['ai', 'memory'],
    method: 'GET',
    path: '/api/ai/user-memory/:id',
  },
  schemas: {
    paramsSchema: t.Object({
      id: t.String({ description: '记忆ID' }),
    }, { description: '路径参数' }),
    outputSchema: t.Union([userMemorySchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { id } = input;

    const [result] = await db.select()
      .from(userMemory)
      .where(and(
        eq(userMemory.id, id),
        eq(userMemory.status, '0')
      ))
      .limit(1);

    // 更新访问计数和最后访问时间
    if (result) {
      await db.update(userMemory)
        .set({
          accessCount: result.accessCount + 1,
          lastAccessAt: new Date().toISOString(),
        })
        .where(eq(userMemory.id, id));
    }

    return result || null;
  },
});
