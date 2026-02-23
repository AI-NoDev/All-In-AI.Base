/**
 * 分页查询智能体
 */

import { t } from 'elysia';
import { eq, sql, ilike, and, asc, desc, inArray, gte, lte } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { isSystemAdmin } from '../../../core/deptPermission';
import { agent } from '@qiyu-allinai/db/entities/ai';
import { agentSchemas, agentPaginationBodySchema, type AgentSelect } from './schemas';

export const agentGetByPagination = defineAction({
  meta: {
    name: 'ai.agent.getByPagination',
    displayName: '分页查询AI智能体',
    description: '分页查询AI智能体列表',
    tags: ['ai', 'agent'],
    method: 'POST',
    path: '/api/ai/agent/query',
  },
  schemas: {
    bodySchema: agentPaginationBodySchema,
    outputSchema: t.Object({ data: t.Array(agentSchemas.select), total: t.Number() }),
  },
  execute: async (input, context) => {
    const { db, currentUserId, currentUserType } = context;
    const { filter, sort, offset, limit } = input;
    
    const conditions = [];
    
    // 智能体为个人资源：普通用户只能看自己创建的，管理员可以看所有
    if (!isSystemAdmin(currentUserType)) {
      conditions.push(eq(agent.createdById, currentUserId));
    }
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(agent.id, filter.ids));
      if (filter.names?.length) conditions.push(inArray(agent.name, filter.names));
      if (filter.providerId) conditions.push(eq(agent.providerId, filter.providerId));
      if (filter.providerIds?.length) conditions.push(inArray(agent.providerId, filter.providerIds));
      if (filter.modelId) conditions.push(eq(agent.modelId, filter.modelId));
      if (filter.modelIds?.length) conditions.push(inArray(agent.modelId, filter.modelIds));
      if (filter.name) conditions.push(ilike(agent.name, `%${filter.name}%`));
      if (filter.status) conditions.push(eq(agent.status, filter.status));
      if (filter.supportLoop !== undefined) conditions.push(eq(agent.supportLoop, filter.supportLoop));
      if (filter.contextStrategy) conditions.push(eq(agent.contextStrategy, filter.contextStrategy));
      if (filter.createdAtStart) conditions.push(gte(agent.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(agent.createdAt, filter.createdAtEnd));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderFn = sort?.order === 'asc' ? asc : desc;
    const sortColumn = sort?.field ? agent[sort.field as keyof typeof agent.$inferSelect] : agent.createdAt;
    
    const data = await db.select().from(agent)
      .where(whereClause)
      .orderBy(orderFn(sortColumn as Parameters<typeof asc>[0]))
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(agent).where(whereClause);
    return { data: data as AgentSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});
