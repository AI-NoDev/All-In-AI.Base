/**
 * 获取用户偏好设置
 */

import { t } from 'elysia';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { user } from '@qiyu-allinai/db/entities/system';

// 偏好设置 Schema
const preferencesSchema = t.Object({
  theme: t.Optional(t.Union([t.Literal('light'), t.Literal('dark')])),
  themeColor: t.Optional(t.Union([
    t.Literal('slate'), t.Literal('zinc'), t.Literal('neutral'), t.Literal('stone'),
    t.Literal('blue'), t.Literal('green'), t.Literal('violet'), t.Literal('orange'), t.Literal('rose'),
  ])),
  language: t.Optional(t.Union([t.Literal('zh-CN'), t.Literal('en')])),
  fontSize: t.Optional(t.Number({ minimum: 10, maximum: 24 })),
  radius: t.Optional(t.Number({ minimum: 0, maximum: 2 })),
  defaultTextModelId: t.Optional(t.Union([t.String(), t.Null()])),
  defaultImageModelId: t.Optional(t.Union([t.String(), t.Null()])),
  defaultObjectModelId: t.Optional(t.Union([t.String(), t.Null()])),
}, { additionalProperties: true });

export const userGetPreferences = defineAction({
  meta: {
    name: 'system.user.getPreferences',
    displayName: '获取用户偏好设置',
    description: '获取当前用户的偏好设置',
    tags: ['system', 'user', 'preferences'],
    method: 'GET',
    path: '/api/system/user/preferences',
  },
  schemas: {
    outputSchema: t.Object({
      preferences: t.Union([preferencesSchema, t.Null()]),
    }),
  },
  execute: async (_input, context) => {
    const { db, currentUserId } = context;
    
    if (!currentUserId) {
      throw ActionError.unauthorized('error.auth.unauthorized');
    }
    
    // 获取当前用户的偏好设置
    const [currentUser] = await db.select({ preferences: user.preferences })
      .from(user)
      .where(and(eq(user.id, currentUserId), isNull(user.deletedAt)))
      .limit(1);
    
    if (!currentUser) {
      throw ActionError.notFound('error.business.dataNotFound');
    }
    
    return {
      preferences: (currentUser.preferences as Record<string, unknown>) || null,
    };
  },
});
