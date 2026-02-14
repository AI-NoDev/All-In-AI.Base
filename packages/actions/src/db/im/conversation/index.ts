import { z } from 'zod';
import { eq, and, isNull, sql, ilike, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { toJSONSchema } from '../../../core/schema';
import db from '@qiyu-allinai/db/connect';
import { conversation, conversationZodSchemas } from '@qiyu-allinai/db/entities/im';

type ConversationSelect = typeof conversation.$inferSelect;
type ConversationInsert = typeof conversation.$inferInsert;

// ============ Filter Schema ============
const conversationFilterSchema = z.object({
  ids: z.array(z.string()).optional(),
  type: z.string().optional(),
  types: z.array(z.string()).optional(),
  ownerId: z.string().optional(),
  name: z.string().optional(),
  status: z.string().optional(),
  isTop: z.boolean().optional(),
  isMuted: z.boolean().optional(),
  lastMessageAtStart: z.iso.datetime().optional(),
  lastMessageAtEnd: z.iso.datetime().optional(),
  createdAtStart: z.iso.datetime().optional(),
  createdAtEnd: z.iso.datetime().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'lastMessageAt', 'createdAt', 'updatedAt', 'memberCount']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: conversationFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

export const conversationGetByPagination = defineAction({
  meta: { name: 'im.conversation.getByPagination', displayName: '分页查询会话', description: '分页查询会话列表', tags: ['im', 'conversation'], method: 'POST', path: '/api/im/conversation/query' },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(conversationZodSchemas.select), total: z.number() }),
  },
  execute: async (input, _context) => {
    const { filter, sort, offset, limit } = input;
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

export const conversationGetByPk = defineAction({
  meta: { name: 'im.conversation.getByPk', displayName: '根据ID查询会话', description: '根据主键ID查询单个会话', tags: ['im', 'conversation'], method: 'GET', path: '/api/im/conversation/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: conversationZodSchemas.select.nullable(),
  },
  execute: async (input, _context) => {
    const [result] = await db.select().from(conversation).where(and(eq(conversation.id, input.id), isNull(conversation.deletedAt))).limit(1);
    return (result as ConversationSelect) ?? null;
  },
});

export const conversationCreate = defineAction({
  meta: { name: 'im.conversation.create', displayName: '创建会话', description: '创建单个会话', tags: ['im', 'conversation'], method: 'POST', path: '/api/im/conversation' },
  schemas: {
    bodySchema: z.object({ data: conversationZodSchemas.insert }),
    outputSchema: conversationZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.insert(conversation).values(input.data as ConversationInsert).returning();
    return result as ConversationSelect;
  },
});

export const conversationUpdate = defineAction({
  meta: { name: 'im.conversation.update', displayName: '更新会话', description: '根据ID更新单个会话', tags: ['im', 'conversation'], method: 'PUT', path: '/api/im/conversation/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ data: conversationZodSchemas.update }),
    outputSchema: conversationZodSchemas.select,
  },
  execute: async (input, _context) => {
    const [result] = await db.update(conversation).set(input.data as Partial<ConversationInsert>).where(and(eq(conversation.id, input.id), isNull(conversation.deletedAt))).returning();
    return result as ConversationSelect;
  },
});

export const conversationDeleteByPk = defineAction({
  meta: { name: 'im.conversation.deleteByPk', displayName: '删除会话', description: '根据ID软删除会话', tags: ['im', 'conversation'], method: 'DELETE', path: '/api/im/conversation/:id' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const [result] = await db.update(conversation).set({ 
      deletedAt: new Date().toISOString(), 
      deletedById: context.currentUserId,
      deletedBy: context.currentUserName
    }).where(and(eq(conversation.id, input.id), isNull(conversation.deletedAt))).returning();
    return !!result;
  },
});


export const conversationGetSchema = defineAction({
  meta: { name: 'im.conversation.getSchema', ignoreTools: true, displayName: '获取会话Schema', description: '获取会话表的JSON Schema', tags: ['im', 'conversation'], method: 'GET', path: '/api/im/conversation/schema' },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async (_input, _context) => {
    return toJSONSchema(conversationZodSchemas.select) as Record<string, unknown>;
  },
});

// 查找或创建私聊会话
export const conversationFindOrCreatePrivate = defineAction({
  meta: { name: 'im.conversation.findOrCreatePrivate', displayName: '查找或创建私聊', description: '查找两个用户之间的私聊会话，如果不存在则创建', tags: ['im', 'conversation'], method: 'POST', path: '/api/im/conversation/private' },
  schemas: {
    bodySchema: z.object({ 
      targetUserId: z.string(),
      targetUserName: z.string().optional(),
    }),
    outputSchema: z.object({
      conversation: conversationZodSchemas.select,
      isNew: z.boolean(),
    }),
  },
  execute: async (input, context) => {
    const { targetUserId, targetUserName } = input;
    const currentUserId = context.currentUserId;
    
    // 导入 groupMember 表
    const { groupMember } = await import('@qiyu-allinai/db/entities/im');
    
    // 查找现有的私聊会话（type='1'表示私聊）
    // 需要找到两个用户都在的私聊会话
    const existingConversations = await db
      .select({ conversationId: groupMember.conversationId })
      .from(groupMember)
      .where(eq(groupMember.userId, currentUserId));
    
    const currentUserConvIds = existingConversations.map(c => c.conversationId);
    
    if (currentUserConvIds.length > 0) {
      // 查找目标用户也在的私聊会话
      const targetUserConversations = await db
        .select({ conversationId: groupMember.conversationId })
        .from(groupMember)
        .where(and(
          eq(groupMember.userId, targetUserId),
          inArray(groupMember.conversationId, currentUserConvIds)
        ));
      
      if (targetUserConversations.length > 0) {
        // 检查这些会话中是否有私聊类型的
        const privateConvs = await db
          .select()
          .from(conversation)
          .where(and(
            inArray(conversation.id, targetUserConversations.map(c => c.conversationId)),
            eq(conversation.type, '1'), // 私聊
            isNull(conversation.deletedAt)
          ))
          .limit(1);
        
        if (privateConvs.length > 0) {
          return { conversation: privateConvs[0] as ConversationSelect, isNew: false };
        }
      }
    }
    
    // 创建新的私聊会话
    const [newConversation] = await db.insert(conversation).values({
      type: '1', // 私聊
      name: targetUserName || null,
      ownerId: currentUserId,
      memberCount: 2,
      createdBy: context.currentUserName,
      updatedBy: context.currentUserName,
    } as ConversationInsert).returning();
    
    if (!newConversation) {
      throw new Error('error.im.conversation.createFailed');
    }
    
    // 添加两个成员
    await db.insert(groupMember).values([
      { conversationId: newConversation.id, userId: currentUserId, role: '0' },
      { conversationId: newConversation.id, userId: targetUserId, role: '0' },
    ]);
    
    return { conversation: newConversation as ConversationSelect, isNew: true };
  },
});

// 创建群聊会话
export const conversationCreateGroup = defineAction({
  meta: { name: 'im.conversation.createGroup', displayName: '创建群聊', description: '创建群聊会话并添加成员', tags: ['im', 'conversation'], method: 'POST', path: '/api/im/conversation/group' },
  schemas: {
    bodySchema: z.object({ 
      name: z.string().min(1).max(128),
      memberIds: z.array(z.string()).min(1),
      avatar: z.string().optional(),
    }),
    outputSchema: z.object({
      conversation: conversationZodSchemas.select,
      memberCount: z.number(),
    }),
  },
  execute: async (input, context) => {
    const { name, memberIds, avatar } = input;
    const currentUserId = context.currentUserId;
    
    // 导入 groupMember 表和事件系统
    const { groupMember, GROUP_MEMBER_ROLES } = await import('@qiyu-allinai/db/entities/im');
    const { actionEvents } = await import('../../../core/events');
    
    // 确保当前用户在成员列表中
    const allMemberIds = [...new Set([currentUserId, ...memberIds])];
    
    // 创建群聊会话
    const [newConversation] = await db.insert(conversation).values({
      type: '2', // 群聊
      name,
      avatar: avatar || null,
      ownerId: currentUserId,
      memberCount: allMemberIds.length,
      createdBy: context.currentUserName,
      updatedBy: context.currentUserName,
    } as ConversationInsert).returning();
    
    if (!newConversation) {
      throw new Error('error.im.conversation.createFailed');
    }
    
    // 添加成员，当前用户为群主
    const memberRecords = allMemberIds.map(userId => ({
      conversationId: newConversation.id,
      userId,
      role: userId === currentUserId ? GROUP_MEMBER_ROLES.OWNER : GROUP_MEMBER_ROLES.MEMBER,
      invitedById: currentUserId,
    }));
    
    await db.insert(groupMember).values(memberRecords);
    
    // 发送群聊创建事件，通知所有成员
    actionEvents.emit('group_created', {
      conversation: {
        id: newConversation.id,
        type: newConversation.type,
        name: newConversation.name,
        avatar: newConversation.avatar,
        ownerId: newConversation.ownerId,
        memberCount: allMemberIds.length,
        createdAt: newConversation.createdAt,
      },
      memberIds: allMemberIds,
      createdBy: {
        id: currentUserId,
        name: context.currentUserName,
        loginName: context.currentUserName,
      },
    });
    
    return { 
      conversation: newConversation as ConversationSelect, 
      memberCount: allMemberIds.length 
    };
  },
});

// 解散群聊
export const conversationDissolveGroup = defineAction({
  meta: { name: 'im.conversation.dissolveGroup', displayName: '解散群聊', description: '解散群聊（仅群主可操作）', tags: ['im', 'conversation'], method: 'POST', path: '/api/im/conversation/:id/dissolve' },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { id: conversationId } = input;
    const currentUserId = context.currentUserId;
    
    // 导入相关模块
    const { groupMember, CONVERSATION_STATUS } = await import('@qiyu-allinai/db/entities/im');
    const { actionEvents } = await import('../../../core/events');
    
    // 检查会话是否存在且为群聊
    const [conv] = await db.select().from(conversation)
      .where(and(eq(conversation.id, conversationId), isNull(conversation.deletedAt)))
      .limit(1);
    
    if (!conv) {
      throw new Error('error.im.conversation.notFound');
    }
    
    if (conv.type !== '2') {
      throw new Error('error.im.conversation.notGroup');
    }
    
    // 检查是否为群主
    if (conv.ownerId !== currentUserId) {
      throw new Error('error.im.conversation.notOwner');
    }
    
    // 获取所有成员ID
    const members = await db.select({ userId: groupMember.userId })
      .from(groupMember)
      .where(eq(groupMember.conversationId, conversationId));
    const memberIds = members.map(m => m.userId);
    
    // 更新会话状态为已解散
    await db.update(conversation).set({
      status: CONVERSATION_STATUS.DISSOLVED,
      updatedAt: new Date().toISOString(),
      updatedBy: context.currentUserName,
    }).where(eq(conversation.id, conversationId));
    
    // 发送群聊解散事件
    actionEvents.emit('group_dissolved', {
      conversationId,
      memberIds,
      dissolvedBy: {
        id: currentUserId,
        name: context.currentUserName,
        loginName: context.currentUserName,
      },
    });
    
    return true;
  },
});

export const conversationActions = [conversationGetByPagination, conversationGetByPk, conversationCreate, conversationUpdate, conversationDeleteByPk, conversationGetSchema, conversationFindOrCreatePrivate, conversationCreateGroup, conversationDissolveGroup];
