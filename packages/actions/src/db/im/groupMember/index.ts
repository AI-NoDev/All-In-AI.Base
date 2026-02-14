import { z } from 'zod';
import { eq, and, sql, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { groupMember, groupMemberZodSchemas, conversation } from '@qiyu-allinai/db/entities/im';

type GroupMemberSelect = typeof groupMember.$inferSelect;
type GroupMemberInsert = typeof groupMember.$inferInsert;

// ============ Filter Schema ============
const groupMemberFilterSchema = z.object({
  conversationId: z.string().optional(),
  conversationIds: z.array(z.string()).optional(),
  userId: z.string().optional(),
  userIds: z.array(z.string()).optional(),
  role: z.string().optional(),
  roles: z.array(z.string()).optional(),
  isMuted: z.boolean().optional(),
  joinedAtStart: z.iso.datetime().optional(),
  joinedAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['joinedAt', 'role']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: groupMemberFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(50),
});

export const groupMemberGetByPagination = defineAction({
  meta: { name: 'im.groupMember.getByPagination', displayName: '分页查询群成员', description: '分页查询群成员列表', tags: ['im', 'groupMember'], method: 'POST', path: '/api/im/group-member/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(groupMemberZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
    const conditions = [];
    
    if (filter) {
      if (filter.conversationId) conditions.push(eq(groupMember.conversationId, filter.conversationId));
      if (filter.conversationIds?.length) conditions.push(inArray(groupMember.conversationId, filter.conversationIds));
      if (filter.userId) conditions.push(eq(groupMember.userId, filter.userId));
      if (filter.userIds?.length) conditions.push(inArray(groupMember.userId, filter.userIds));
      if (filter.role) conditions.push(eq(groupMember.role, filter.role));
      if (filter.roles?.length) conditions.push(inArray(groupMember.role, filter.roles));
      if (filter.isMuted !== undefined) conditions.push(eq(groupMember.isMuted, filter.isMuted));
      if (filter.joinedAtStart) conditions.push(gte(groupMember.joinedAt, filter.joinedAtStart));
      if (filter.joinedAtEnd) conditions.push(lte(groupMember.joinedAt, filter.joinedAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortField = sort?.field ?? 'joinedAt';
    const sortColumn = groupMember[sortField as keyof typeof groupMember.$inferSelect];
    
    const data = await db.select().from(groupMember).where(whereClause).orderBy(orderFn(sortColumn)).limit(limit).offset(offset);
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(groupMember).where(whereClause);
    return { data: data as GroupMemberSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

export const groupMemberGetByPk = defineAction({
  meta: { name: 'im.groupMember.getByPk', displayName: '查询群成员', description: '根据会话ID和用户ID查询群成员', tags: ['im', 'groupMember'], method: 'GET', path: '/api/im/group-member/:conversationId/:userId' },
  schemas: {
    paramsSchema: z.object({ conversationId: z.string(), userId: z.string() }),
    outputSchema: groupMemberZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(groupMember)
      .where(and(eq(groupMember.conversationId, input.conversationId), eq(groupMember.userId, input.userId))).limit(1);
    return (result as GroupMemberSelect) ?? null;
  },
});

export const groupMemberAdd = defineAction({
  meta: { name: 'im.groupMember.add', displayName: '添加群成员', description: '添加群成员', tags: ['im', 'groupMember'], method: 'POST', path: '/api/im/group-member' },
  schemas: {
    bodySchema: z.object({ data: groupMemberZodSchemas.insert }),
    outputSchema: groupMemberZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(groupMember).values(input.data as GroupMemberInsert).returning();
    
    // Update conversation memberCount
    await db.update(conversation).set({ 
      memberCount: sql`member_count + 1`,
      updatedAt: new Date().toISOString()
    }).where(eq(conversation.id, input.data.conversationId));
    
    return result as GroupMemberSelect;
  },
});

export const groupMemberAddMany = defineAction({
  meta: { name: 'im.groupMember.addMany', displayName: '批量添加群成员', description: '批量添加群成员', tags: ['im', 'groupMember'], method: 'POST', path: '/api/im/group-member/batch' },
  schemas: {
    bodySchema: z.object({ data: z.array(groupMemberZodSchemas.insert) }),
    outputSchema: z.array(groupMemberZodSchemas.select),
  },
  execute: async (input, _context) => {
    const results = await db.insert(groupMember).values(input.data as GroupMemberInsert[]).returning();
    
    // Update conversation memberCount for each unique conversation
    const conversationIds = [...new Set(input.data.map(d => d.conversationId))];
    for (const convId of conversationIds) {
      const count = input.data.filter(d => d.conversationId === convId).length;
      await db.update(conversation).set({ 
        memberCount: sql`member_count + ${count}`,
        updatedAt: new Date().toISOString()
      }).where(eq(conversation.id, convId));
    }
    
    return results as GroupMemberSelect[];
  },
});

export const groupMemberUpdate = defineAction({
  meta: { name: 'im.groupMember.update', displayName: '更新群成员', description: '更新群成员信息', tags: ['im', 'groupMember'], method: 'PUT', path: '/api/im/group-member/:conversationId/:userId' },
  schemas: {
    paramsSchema: z.object({ conversationId: z.string(), userId: z.string() }),
    bodySchema: z.object({ data: groupMemberZodSchemas.update }),
    outputSchema: groupMemberZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(groupMember).set(input.data as Partial<GroupMemberInsert>)
      .where(and(eq(groupMember.conversationId, input.conversationId), eq(groupMember.userId, input.userId))).returning();
    return result as GroupMemberSelect;
  },
});

export const groupMemberRemove = defineAction({
  meta: { name: 'im.groupMember.remove', displayName: '移除群成员', description: '移除群成员', tags: ['im', 'groupMember'], method: 'DELETE', path: '/api/im/group-member/:conversationId/:userId' },
  schemas: {
    paramsSchema: z.object({ conversationId: z.string(), userId: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, _context) => {
    const [result] = await db.delete(groupMember)
      .where(and(eq(groupMember.conversationId, input.conversationId), eq(groupMember.userId, input.userId))).returning();
    
    if (result) {
      // Update conversation memberCount
      await db.update(conversation).set({ 
        memberCount: sql`member_count - 1`,
        updatedAt: new Date().toISOString()
      }).where(eq(conversation.id, input.conversationId));
    }
    
    return !!result;
  },
});


export const groupMemberGetSchema = defineAction({
  meta: { name: 'im.groupMember.getSchema', ignoreTools: true, displayName: '获取群成员Schema', description: '获取群成员表的JSON Schema', tags: ['im', 'groupMember'], method: 'GET', path: '/api/im/group-member/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(groupMemberZodSchemas.select) as Record<string, unknown>;
  },
});

export const groupMemberActions = [groupMemberGetByPagination, groupMemberGetByPk, groupMemberAdd, groupMemberAddMany, groupMemberUpdate, groupMemberRemove, groupMemberGetSchema];
