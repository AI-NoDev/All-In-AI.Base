/**
 * 分页查询消息
 */

import { t } from 'elysia';
import { eq, and, sql, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { message, groupMember } from '@qiyu-allinai/db/entities/im';
import { messagePaginationBodySchema, messageSchemas, type MessageSelect } from './schemas';

export const messageGetByPagination = defineAction({
  meta: {
    name: 'im.message.getByPagination',
    displayName: '分页查询消息',
    description: '分页查询消息列表',
    tags: ['im', 'message'],
    method: 'POST',
    path: '/api/im/message/query',
  },
  schemas: {
    bodySchema: messagePaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(messageSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    const { filter, sort, offset, limit } = input;
    
    // 获取用户参与的所有会话ID
    const userConversations = await db.select({ conversationId: groupMember.conversationId })
      .from(groupMember)
      .where(eq(groupMember.userId, currentUserId));
    const userConvIds = userConversations.map(c => c.conversationId);
    
    if (userConvIds.length === 0) {
      return { data: [], total: 0 };
    }
    
    // 如果指定了会话ID，检查用户是否是该会话成员
    if (filter?.conversationId && !userConvIds.includes(filter.conversationId)) {
      throw ActionError.forbidden('error.im.conversation.notMember');
    }
    if (filter?.conversationIds?.length) {
      const invalidConvs = filter.conversationIds.filter(id => !userConvIds.includes(id));
      if (invalidConvs.length > 0) {
        throw ActionError.forbidden('error.im.conversation.notMember');
      }
    }
    
    const conditions = [];
    
    // 限制只能查询用户参与的会话消息
    if (filter?.conversationId) {
      conditions.push(eq(message.conversationId, filter.conversationId));
    } else if (filter?.conversationIds?.length) {
      conditions.push(inArray(message.conversationId, filter.conversationIds));
    } else {
      conditions.push(inArray(message.conversationId, userConvIds));
    }
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(message.id, filter.ids));
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
