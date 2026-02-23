/**
 * 删除用户记忆（软删除）
 */

import { t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userMemory } from '@qiyu-allinai/db/entities/ai';

export const userMemoryDeleteByPk = defineAction({
  meta: {
    name: 'ai.userMemory.deleteByPk',
    displayName: '删除用户记忆',
    description: '软删除用户记忆（设置状态为禁用）',
    tags: ['ai', 'memory'],
    method: 'DELETE',
    path: '/api/ai/user-memory/:id',
  },
  schemas: {
    paramsSchema: t.Object({
      id: t.String({ description: '记忆ID' }),
    }, { description: '路径参数' }),
    outputSchema: t.Object({
      success: t.Boolean({ description: '是否成功' }),
    }, { description: '删除结果' }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { id } = input;

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

    // 软删除：设置状态为禁用
    await db.update(userMemory)
      .set({
        status: '1',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(userMemory.id, id));

    return { success: true };
  },
});
