import { z } from 'zod';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { conversationRead, conversationReadZodSchemas } from '@qiyu-allinai/db/entities/im';

type ConversationReadSelect = typeof conversationRead.$inferSelect;
type ConversationReadInsert = typeof conversationRead.$inferInsert;

// ============ Filter Schema ============
const conversationReadFilterSchema = z.object({
  conversationId: z.uuid().optional(),
  conversationIds: z.array(z.uuid()).optional(),
  userId: z.uuid().optional(),
  userIds: z.array(z.uuid()).optional(),
}).optional();

const paginationBodySchema = z.object({
  filter: conversationReadFilterSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(50),
});

export const conversationReadGetByPagination = defineAction({
  meta: { name: 'im.conversationRead.getByPagination', displayName: '分页查询已读状态', description: '分页查询已读状态列表', tags: ['im', 'conversationRead'], method: 'POST', path: '/api/im/conversation-read/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(conversationReadZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
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
    paramsSchema: z.object({ conversationId: z.uuid(), userId: z.uuid() }),
    outputSchema: conversationReadZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(conversationRead)
      .where(and(eq(conversationRead.conversationId, input.conversationId), eq(conversationRead.userId, input.userId))).limit(1);
    return (result as ConversationReadSelect) ?? null;
  },
});

export const conversationReadMarkRead = defineAction({
  meta: { name: 'im.conversationRead.markRead', displayName: '标记已读', description: '标记会话已读到指定消息序号', tags: ['im', 'conversationRead'], method: 'PUT', path: '/api/im/conversation-read/mark' },
  schemas: {
    bodySchema: z.object({ 
      conversationId: z.uuid(), 
      userId: z.uuid(),
      lastReadSeq: z.number().int().min(0)
    }),
    outputSchema: conversationReadZodSchemas.select,
  },
  execute: async (input, _context) => {
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
    bodySchema: z.object({ 
      conversationId: z.uuid(), 
      userIds: z.array(z.uuid()),
      increment: z.number().int().min(1).default(1)
    }),
    outputSchema: z.number(),
  },
  execute: async (input, _context) => {
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
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(conversationReadZodSchemas.select) as Record<string, unknown>;
  },
});

export const conversationReadActions = [conversationReadGetByPagination, conversationReadGetByPk, conversationReadMarkRead, conversationReadIncrementUnread, conversationReadGetSchema];
