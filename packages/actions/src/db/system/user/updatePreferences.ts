/**
 * 更新用户偏好设置
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { user } from '@qiyu-allinai/db/entities/system';

// 偏好设置 Schema
const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  themeColor: z.enum(['slate', 'zinc', 'neutral', 'stone', 'blue', 'green', 'violet', 'orange', 'rose']).optional(),
  language: z.enum(['zh-CN', 'en']).optional(),
  fontSize: z.number().min(10).max(24).optional(),
  radius: z.number().min(0).max(2).optional(),
  defaultTextModelId: z.string().nullable().optional(),
  defaultImageModelId: z.string().nullable().optional(),
  defaultObjectModelId: z.string().nullable().optional(),
}).passthrough();

export const userUpdatePreferences = defineAction({
  meta: {
    name: 'system.user.updatePreferences',
    displayName: '更新用户偏好设置',
    description: '更新当前用户的偏好设置',
    tags: ['system', 'user', 'preferences'],
    method: 'PUT',
    path: '/api/system/user/preferences',
  },
  schemas: {
    bodySchema: z.object({ 
      preferences: preferencesSchema,
    }),
    outputSchema: z.object({
      success: z.boolean(),
      preferences: preferencesSchema.nullable(),
    }),
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    
    if (!currentUserId) {
      throw ActionError.unauthorized('error.auth.unauthorized');
    }
    
    // 获取当前用户
    const [currentUser] = await db.select({ preferences: user.preferences })
      .from(user)
      .where(and(eq(user.id, currentUserId), isNull(user.deletedAt)))
      .limit(1);
    
    if (!currentUser) {
      throw ActionError.notFound('error.business.dataNotFound');
    }
    
    // 合并偏好设置
    const existingPreferences = (currentUser.preferences as Record<string, unknown>) || {};
    const newPreferences = { ...existingPreferences, ...input.preferences };
    
    // 更新用户偏好设置
    await db.update(user)
      .set({ preferences: newPreferences })
      .where(eq(user.id, currentUserId));
    
    return {
      success: true,
      preferences: newPreferences,
    };
  },
});
