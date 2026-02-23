import { t } from 'elysia';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { conversationRead, conversationReadSchemas } from '@qiyu-allinai/db/entities/im';

type ConversationReadSelect = typeof conversationRead.$inferSelect;
type ConversationReadInsert = typeof conversationRead.$inferInsert;

// ============ Filter Schema ============
const conversationReadFilterSchema = t.Optional(t.Object({
  conversationId: t.Optional(t.String()),
  conversationIds: t.Optional(t.Array(t.String())),
  userId: t.Optional(t.String()),
  userIds: t.Optional(t.Array(t.String())),
}));

const paginationBodySchema = t.Object({
  filter: conversationReadFilterSchema,
  offset: t.Number({ minimum: 0, default: 0 }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 50 }),
});

export const conversationReadGetByPagination = defineAction({
  meta: { name: 'im.conversationRead.getByPagination', displayName: '分页查询已读状态', description: '分页查询已读状态列表', tags: ['im', 'conversationRead'], method: 'POST', path: '/api/im/conversation-read/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: t.Object({ data: t.Array(conversationReadSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, offset, limit } = input;
    const conditions = [];
    
    if (filter) {
      if (filter.conversationId) conditions.push(eq(conversationRead.conversationId, filter.conversationId));
      if (filter.conversationIds?.length) conditions.push(inArray(conversationRead.conversationId, filter.conversationIds));
      if (filter.userId) conditions.push(eq(conversationRead.userId, filter.userId));
      if (filter.userIds?.length) conditions.push(inArray(conversationRead.userId, filter.userIds));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const data = await db.select().from(conversationRead).where(whereClause).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(conversationRead).where(whereClause);
    return { data: data as ConversationReadSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const conversationReadGetByPk = defineAction({
  meta: { name: 'im.conversationRead.getByPk', displayName: '查询已读状态', description: '根据会话ID和用户ID查询已读状态', tags: ['im', 'conversationRead'], method: 'GET', path: '/api/im/conversation-read/:conversationId/:userId' },
  schemas: {
    paramsSchema: t.Object({ conversationId: t.String(), userId: t.String() }),
    outputSchema: t.Union([conversationReadSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(conversationRead)
      .where(and(eq(conversationRead.conversationId, input.conversationId), eq(conversationRead.userId, input.userId))).limit(1);
    return (result as ConversationReadSelect) ?? null;
  },
});

export const conversationReadMarkRead = defineAction({
  meta: { name: 'im.conversationRead.markRead', displayName: '标记已读', description: '标记会话已读到指定消息序号', tags: ['im', 'conversationRead'], method: 'PUT', path: '/api/im/conversation-read/mark' },
  schemas: {
    bodySchema: t.Object({ 
      conversationId: t.String(), 
      userId: t.String(),
      lastReadSeq: t.Integer({ minimum: 0 })
    }),
    outputSchema: conversationReadSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const { conversationId, userId, lastReadSeq } = input;
    
    // Upsert: insert or update
    const [existing] = await db.select().from(conversationRead)
      .where(and(eq(conversationRead.conversationId, conversationId), eq(conversationRead.userId, userId))).limit(1);
    
    if (existing) {
      const [result] = await db.update(conversationRead).set({ 
        lastReadSeq, 
        lastReadAt: new Date().toISOString(),
        unreadCount: 0
      }).where(and(eq(conversationRead.conversationId, conversationId), eq(conversationRead.userId, userId))).returning();
      return result as ConversationReadSelect;
    } else {
      const [result] = await db.insert(conversationRead).values({
        conversationId,
        userId,
        lastReadSeq,
        lastReadAt: new Date().toISOString(),
        unreadCount: 0
      } as ConversationReadInsert).returning();
      return result as ConversationReadSelect;
    }
  },
});

export const conversationReadIncrementUnread = defineAction({
  meta: { name: 'im.conversationRead.incrementUnread', displayName: '增加未读数', description: '增加用户在会话中的未读消息数', tags: ['im', 'conversationRead'], method: 'PUT', path: '/api/im/conversation-read/increment-unread' },
  schemas: {
    bodySchema: t.Object({ 
      conversationId: t.String(), 
      userIds: t.Array(t.String()),
      increment: t.Integer({ minimum: 1, default: 1 })
    }),
    outputSchema: t.Number(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { conversationId, userIds, increment } = input;
    
    // Update unread count for all specified users
    const result = await db.update(conversationRead).set({ 
      unreadCount: sql`unread_count + ${increment}`
    }).where(and(
      eq(conversationRead.conversationId, conversationId),
      inArray(conversationRead.userId, userIds)
    )).returning();
    
    return result.length;
  },
});


export const conversationReadGetSchema = defineAction({
  meta: { name: 'im.conversationRead.getSchema', ignoreTools: true, displayName: '获取已读状态Schema', description: '获取已读状态表的JSON Schema', tags: ['im', 'conversationRead'], method: 'GET', path: '/api/im/conversation-read/schema' },
  schemas: {
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(conversationReadSchemas.select) as Record<string, unknown>;
  },
});

export const conversationReadActions = [conversationReadGetByPagination, conversationReadGetByPk, conversationReadMarkRead, conversationReadIncrementUnread, conversationReadGetSchema];
