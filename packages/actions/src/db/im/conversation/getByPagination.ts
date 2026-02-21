/**
 * 分页查询会话
 */

import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { conversation, conversationZodSchemas } from '@qiyu-allinai/db/entities/im';
import { paginationBodySchema } from './schemas';
import type { ConversationSelect } from './utils';

export const conversationGetByPagination = defineAction({
  meta: {
    name: 'im.conversation.getByPagination',
    displayName: '分页查询会话',
    description: '分页查询会话列表',
    tags: ['im', 'conversation'],
    method: 'POST',
    path: '/api/im/conversation/query',
  },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(conversationZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    
    // IM 会话权限基于成员关系，这里只做基本查询
    const conditions = [isNull(conversation.deletedAt)];
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(conversation.id, filter.ids));
      if (filter.type) conditions.push(eq(conversation.type, filter.type));
      if (filter.types?.length) conditions.push(inArray(conversation.type, filter.types));
      if (filter.ownerId) conditions.push(eq(conversation.ownerId, filter.ownerId));
      if (filter.name) conditions.push(ilike(conversation.name, `%${filter.name}%`));
      if (filter.status) conditions.push(eq(conversation.status, filter.status));
      if (filter.isTop !== undefined) conditions.push(eq(conversation.isTop, filter.isTop));
      if (filter.isMuted !== undefined) conditions.push(eq(conversation.isMuted, filter.isMuted));
      if (filter.lastMessageAtStart) conditions.push(gte(conversation.lastMessageAt, filter.lastMessageAtStart));
      if (filter.lastMessageAtEnd) conditions.push(lte(conversation.lastMessageAt, filter.lastMessageAtEnd));
      if (filter.createdAtStart) conditions.push(gte(conversation.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(conversation.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = and(...conditions);
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortField = sort?.field ?? 'lastMessageAt';
    const sortColumn = conversation[sortField as keyof typeof conversation.$inferSelect];
    
    const data = await db.select().from(conversation).where(whereClause).orderBy(orderFn(sortColumn)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(conversation).where(whereClause);
    return { data: data as ConversationSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
