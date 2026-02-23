import { t } from 'elysia';
import { eq, and, sql, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import { groupMember, groupMemberSchemas, conversation } from '@qiyu-allinai/db/entities/im';

type GroupMemberSelect = typeof groupMember.$inferSelect;
type GroupMemberInsert = typeof groupMember.$inferInsert;

// ============ Filter Schema ============
const groupMemberFilterSchema = t.Optional(t.Object({
  conversationId: t.Optional(t.String()),
  conversationIds: t.Optional(t.Array(t.String())),
  userId: t.Optional(t.String()),
  userIds: t.Optional(t.Array(t.String())),
  role: t.Optional(t.String()),
  roles: t.Optional(t.Array(t.String())),
  isMuted: t.Optional(t.Boolean()),
  joinedAtStart: t.Optional(t.String({ format: 'date-time' })),
  joinedAtEnd: t.Optional(t.String({ format: 'date-time' })),
}));

const sortSchema = t.Optional(t.Object({
  field: t.Union([t.Literal('joinedAt'), t.Literal('role')]),
  order: t.Union([t.Literal('asc'), t.Literal('desc')]),
}));

const paginationBodySchema = t.Object({
  filter: groupMemberFilterSchema,
  sort: sortSchema,
  offset: t.Number({ minimum: 0, default: 0 }),
  limit: t.Number({ minimum: 1, maximum: 100, default: 50 }),
});

export const groupMemberGetByPagination = defineAction({
  meta: { name: 'im.groupMember.getByPagination', displayName: '分页查询群成员', description: '分页查询群成员列表', tags: ['im', 'groupMember'], method: 'POST', path: '/api/im/group-member/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: t.Object({ data: t.Array(groupMemberSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
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
    paramsSchema: t.Object({ conversationId: t.String(), userId: t.String() }),
    outputSchema: t.Union([groupMemberSchemas.select, t.Null()]),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(groupMember)
      .where(and(eq(groupMember.conversationId, input.conversationId), eq(groupMember.userId, input.userId))).limit(1);
    return (result as GroupMemberSelect) ?? null;
  },
});

export const groupMemberAdd = defineAction({
  meta: { name: 'im.groupMember.add', displayName: '添加群成员', description: '添加群成员', tags: ['im', 'groupMember'], method: 'POST', path: '/api/im/group-member' },
  schemas: {
    bodySchema: t.Object({ data: groupMemberSchemas.insert }),
    outputSchema: groupMemberSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
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
    bodySchema: t.Object({ data: t.Array(groupMemberSchemas.insert) }),
    outputSchema: t.Array(groupMemberSchemas.select),
  },
  execute: async (input, context) => {
    const { db } = context;
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
    paramsSchema: t.Object({ conversationId: t.String(), userId: t.String() }),
    bodySchema: t.Object({ data: groupMemberSchemas.update }),
    outputSchema: groupMemberSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.update(groupMember).set(input.data as Partial<GroupMemberInsert>)
      .where(and(eq(groupMember.conversationId, input.conversationId), eq(groupMember.userId, input.userId))).returning();
    return result as GroupMemberSelect;
  },
});

export const groupMemberRemove = defineAction({
  meta: { name: 'im.groupMember.remove', displayName: '移除群成员', description: '移除群成员', tags: ['im', 'groupMember'], method: 'DELETE', path: '/api/im/group-member/:conversationId/:userId' },
  schemas: {
    paramsSchema: t.Object({ conversationId: t.String(), userId: t.String() }),
    outputSchema: t.Boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
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
    outputSchema: t.Record(t.String(), t.Unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(groupMemberSchemas.select) as Record<string, unknown>;
  },
});

export const groupMemberActions = [groupMemberGetByPagination, groupMemberGetByPk, groupMemberAdd, groupMemberAddMany, groupMemberUpdate, groupMemberRemove, groupMemberGetSchema];
