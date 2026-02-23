import { t } from 'elysia';
import { eq, and } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { conversationHidden, conversationHiddenSchemas } from '@qiyu-allinai/db/entities/im';

type ConversationHiddenSelect = typeof conversationHidden.$inferSelect;

// Hide a conversation for current user
export const conversationHiddenHide = defineAction({
  meta: { name: 'im.conversationHidden.hide', displayName: '隐藏会话', description: '隐藏会话（不再显示在消息列表）', tags: ['im', 'conversationHidden'], method: 'POST', path: '/api/im/conversation-hidden/hide' },
  schemas: {
    bodySchema: t.Object({ conversationId: t.String() }),
    outputSchema: conversationHiddenSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const { conversationId } = input;
    const userId = context.currentUserId;
    
    // Check if record exists
    const [existing] = await db.select().from(conversationHidden)
      .where(and(
        eq(conversationHidden.conversationId, conversationId),
        eq(conversationHidden.userId, userId)
      )).limit(1);
    
    if (existing) {
      // Update existing record
      const [result] = await db.update(conversationHidden).set({
        isHidden: true,
        hiddenAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).where(and(
        eq(conversationHidden.conversationId, conversationId),
        eq(conversationHidden.userId, userId)
      )).returning();
      return result as ConversationHiddenSelect;
    } else {
      // Insert new record
      const [result] = await db.insert(conversationHidden).values({
        conversationId,
        userId,
        isHidden: true,
      }).returning();
      return result as ConversationHiddenSelect;
    }
  },
});

// Unhide a conversation (called when new message arrives)
export const conversationHiddenUnhide = defineAction({
  meta: { name: 'im.conversationHidden.unhide', displayName: '取消隐藏会话', description: '取消隐藏会话（新消息到达时调用）', tags: ['im', 'conversationHidden'], method: 'POST', path: '/api/im/conversation-hidden/unhide' },
  schemas: {
    bodySchema: t.Object({ conversationId: t.String(), userId: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { conversationId, userId } = input;
    
    const [result] = await db.update(conversationHidden).set({
      isHidden: false,
      updatedAt: new Date().toISOString(),
    }).where(and(
      eq(conversationHidden.conversationId, conversationId),
      eq(conversationHidden.userId, userId)
    )).returning();
    
    return !!result;
  },
});

// Get hidden conversation IDs for current user
export const conversationHiddenGetList = defineAction({
  meta: { name: 'im.conversationHidden.getList', displayName: '获取隐藏会话列表', description: '获取当前用户隐藏的会话ID列表', tags: ['im', 'conversationHidden'], method: 'GET', path: '/api/im/conversation-hidden/list' },
  schemas: {
    outputSchema: t.Array(t.String()),
  },
  execute: async (_input, context) => {
    const { db } = context;
    const userId = context.currentUserId;
    
    const results = await db.select({ conversationId: conversationHidden.conversationId })
      .from(conversationHidden)
      .where(and(
        eq(conversationHidden.userId, userId),
        eq(conversationHidden.isHidden, true)
      ));
    
    return results.map(r => r.conversationId);
  },
});

export const conversationHiddenActions = [conversationHiddenHide, conversationHiddenUnhide, conversationHiddenGetList];
