/**
 * 删除用户记忆（软删除）
 */

import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userMemory, userMemoryZodSchemas } from '@qiyu-allinai/db/entities/ai';
import { z } from 'zod';

export const userMemoryDeleteByPk = defineAction({
  meta: {
    name: 'ai.userMemory.deleteByPk',
    displayName: '删除用户记忆',
    description: '软删除用户记忆（设置状态为禁用）',
    tags: ['ai', 'memory', 'delete'],
    method: 'DELETE',
    path: '/api/ai/user-memory/:id',
  },
  schemas: {
    paramsSchema: z.object({
      id: z.string().describe('记忆ID'),
    }).describe('路径参数'),
    outputSchema: z.object({
      success: z.boolean().describe('是否成功'),
    }).describe('删除结果'),
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
