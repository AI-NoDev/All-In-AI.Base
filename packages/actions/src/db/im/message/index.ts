import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { message, messageZodSchemas, conversation } from '@qiyu-allinai/db/entities/im';

type MessageSelect = typeof message.$inferSelect;
type MessageInsert = typeof message.$inferInsert;

// ============ Filter Schema ============
const messageFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  conversationId: z.string().optional(),
  conversationIds: z.array(z.string()).optional(),
  senderId: z.string().optional(),
  senderIds: z.array(z.string()).optional(),
  msgType: z.string().optional(),
  msgTypes: z.array(z.string()).optional(),
  isRecalled: z.boolean().optional(),
  msgSeqStart: z.number().optional(),
  msgSeqEnd: z.number().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['msgSeq', 'createdAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: messageFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(50),
});

export const messageGetByPagination = defineAction({
  meta: { name: 'im.message.getByPagination', displayName: '分页查询消息', description: '分页查询消息列表', tags: ['im', 'message'], method: 'POST', path: '/api/im/message/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(messageZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(message.id, filter.ids));
      if (filter.conversationId) conditions.push(eq(message.conversationId, filter.conversationId));
      if (filter.conversationIds?.length) conditions.push(inArray(message.conversationId, filter.conversationIds));
      if (filter.senderId) conditions.push(eq(message.senderId, filter.senderId));
      if (filter.senderIds?.length) conditions.push(inArray(message.senderId, filter.senderIds));
      if (filter.msgType) conditions.push(eq(message.msgType, filter.msgType));
      if (filter.msgTypes?.length) conditions.push(inArray(message.msgType, filter.msgTypes));
      if (filter.isRecalled !== undefined) conditions.push(eq(message.isRecalled, filter.isRecalled));
      if (filter.msgSeqStart !== undefined) conditions.push(gte(message.msgSeq, filter.msgSeqStart));
      if (filter.msgSeqEnd !== undefined) conditions.push(lte(message.msgSeq, filter.msgSeqEnd));
      if (filter.createdAtStart) conditions.push(gte(message.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(message.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortField = sort?.field ?? 'msgSeq';
    const sortColumn = message[sortField as keyof typeof message.$inferSelect];
    
    const data = await db.select().from(message).where(whereClause).orderBy(orderFn(sortColumn)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(message).where(whereClause);
    return { data: data as MessageSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const messageGetByPk = defineAction({
  meta: { name: 'im.message.getByPk', displayName: '根据ID查询消息', description: '根据主键ID查询单个消息', tags: ['im', 'message'], method: 'GET', path: '/api/im/message/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: messageZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(message).where(eq(message.id, input.id)).limit(1);
    return (result as MessageSelect) ?? null;
  },
});

export const messageCreate = defineAction({
  meta: { name: 'im.message.create', displayName: '发送消息', description: '发送单条消息', tags: ['im', 'message'], method: 'POST', path: '/api/im/message' },
  schemas: {
    bodySchema: z.object({ data: messageZodSchemas.insert }),
    outputSchema: messageZodSchemas.select,
  },
  execute: async (input, _context) => {
    // Get next msgSeq for conversation
    const seqResult = await db.select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(message).where(eq(message.conversationId, input.data.conversationId));
    const nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;
    
    const [result] = await db.insert(message).values({ ...input.data, msgSeq: nextSeq } as MessageInsert).returning();
    
    // Update conversation lastMessageAt
    if (result) {
      await db.update(conversation).set({ 
        lastMessageId: result.id, 
        lastMessageAt: result.createdAt,
        updatedAt: new Date().toISOString()
      }).where(eq(conversation.id, input.data.conversationId));
    }
    
    return result as MessageSelect;
  },
});

export const messageRecall = defineAction({
  meta: { name: 'im.message.recall', displayName: '撤回消息', description: '撤回指定消息', tags: ['im', 'message'], method: 'PUT', path: '/api/im/message/:id/recall' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: messageZodSchemas.select,
  },
  execute: async (input, context) => {
    const { groupMember } = await import('@qiyu-allinai/db/entities/im');
    const { actionEvents } = await import('../../../core/events');
    
    // 获取消息信息
    const [msg] = await db.select().from(message).where(eq(message.id, input.id)).limit(1);
    if (!msg) {
      throw new Error('error.im.message.notFound');
    }
    
    // 只有发送者可以撤回消息
    if (msg.senderId !== context.currentUserId) {
      throw new Error('error.im.message.notSender');
    }
    
    // 更新消息为已撤回
    const [result] = await db.update(message).set({ 
      isRecalled: true, 
      recalledAt: new Date().toISOString(),
      recalledById: context.currentUserId
    }).where(eq(message.id, input.id)).returning();
    
    // 获取会话成员
    const members = await db.select({ userId: groupMember.userId })
      .from(groupMember)
      .where(eq(groupMember.conversationId, msg.conversationId));
    const memberIds = members.map(m => m.userId);
    
    // 广播撤回事件
    actionEvents.emit('message_recalled', {
      messageId: input.id,
      conversationId: msg.conversationId,
      msgSeq: msg.msgSeq,
      memberIds,
      recalledBy: {
        id: context.currentUserId,
        name: context.currentUserName,
        loginName: context.currentUserName,
      },
    });
    
    return result as MessageSelect;
  },
});


export const messageGetSchema = defineAction({
  meta: { name: 'im.message.getSchema', ignoreTools: true, displayName: '获取消息Schema', description: '获取消息表的JSON Schema', tags: ['im', 'message'], method: 'GET', path: '/api/im/message/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(messageZodSchemas.select) as Record<string, unknown>;
  },
});

export const messageActions = [messageGetByPagination, messageGetByPk, messageCreate, messageRecall, messageGetSchema];
