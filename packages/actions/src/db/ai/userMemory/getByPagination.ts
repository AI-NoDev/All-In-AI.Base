/**
 * 分页查询用户记忆
 */

import { t } from 'elysia';
import { and, eq, inArray, like, gte, lte, or, isNull, sql, desc, asc, type SQL } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userMemory, userMemorySchemas } from '@qiyu-allinai/db/entities/ai';
import { userMemoryPaginationBodySchema } from './schemas';

export const userMemoryGetByPagination = defineAction({
  meta: {
    name: 'ai.userMemory.getByPagination',
    displayName: '分页查询用户记忆',
    description: '分页查询用户记忆列表，支持多种过滤条件',
    tags: ['ai', 'memory'],
    method: 'POST',
    path: '/api/ai/user-memory/query',
  },
  schemas: {
    bodySchema: userMemoryPaginationBodySchema,
    outputSchema: t.Object({
      data: t.Array(userMemorySchemas.select),
      total: t.Number({ description: '总数' }),
    }, { description: '分页查询结果' }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;

    // 构建过滤条件
    const conditions: SQL[] = [eq(userMemory.status, '0')];

    if (filter) {
      if (filter.ids?.length) {
        conditions.push(inArray(userMemory.id, filter.ids));
      }
      if (filter.userId) {
        conditions.push(eq(userMemory.userId, filter.userId));
      }
      if (filter.userIds?.length) {
        conditions.push(inArray(userMemory.userId, filter.userIds));
      }
      if (filter.agentId) {
        conditions.push(eq(userMemory.agentId, filter.agentId));
      }
      if (filter.agentIds?.length) {
        conditions.push(inArray(userMemory.agentId, filter.agentIds));
      }
      if (filter.sessionId) {
        conditions.push(eq(userMemory.sessionId, filter.sessionId));
      }
      if (filter.sessionIds?.length) {
        conditions.push(inArray(userMemory.sessionId, filter.sessionIds));
      }
      if (filter.memoryType) {
        conditions.push(eq(userMemory.memoryType, filter.memoryType));
      }
      if (filter.memoryTypes?.length) {
        conditions.push(inArray(userMemory.memoryType, filter.memoryTypes));
      }
      if (filter.importanceMin !== undefined) {
        conditions.push(gte(userMemory.importance, filter.importanceMin));
      }
      if (filter.importanceMax !== undefined) {
        conditions.push(lte(userMemory.importance, filter.importanceMax));
      }
      if (filter.content) {
        conditions.push(like(userMemory.content, `%${filter.content}%`));
      }
      if (filter.createdAtStart) {
        conditions.push(gte(userMemory.createdAt, filter.createdAtStart));
      }
      if (filter.createdAtEnd) {
        conditions.push(lte(userMemory.createdAt, filter.createdAtEnd));
      }
      if (filter.expireAtStart) {
        conditions.push(gte(userMemory.expireAt, filter.expireAtStart));
      }
      if (filter.expireAtEnd) {
        conditions.push(lte(userMemory.expireAt, filter.expireAtEnd));
      }
      // 默认不包含已过期记忆
      if (!filter.includeExpired) {
        const expireCondition = or(
          isNull(userMemory.expireAt),
          gte(userMemory.expireAt, new Date().toISOString())
        );
        if (expireCondition) conditions.push(expireCondition);
      }
    } else {
      // 默认不包含已过期记忆
      const expireCondition = or(
        isNull(userMemory.expireAt),
        gte(userMemory.expireAt, new Date().toISOString())
      );
      if (expireCondition) conditions.push(expireCondition);
    }

    const whereClause = and(...conditions);

    // 排序
    const orderByField = sort?.field || 'createdAt';
    const orderByDir = sort?.order || 'desc';
    const orderBy = orderByDir === 'desc' 
      ? desc(userMemory[orderByField as keyof typeof userMemory] as typeof userMemory.createdAt)
      : asc(userMemory[orderByField as keyof typeof userMemory] as typeof userMemory.createdAt);

    // 查询数据
    const [data, countResult] = await Promise.all([
      db.select()
        .from(userMemory)
        .where(whereClause)
        .orderBy(orderBy)
        .offset(offset)
        .limit(limit),
      db.select({ count: sql<number>`count(*)::int` })
        .from(userMemory)
        .where(whereClause),
    ]);

    return {
      data,
      total: countResult[0]?.count || 0,
    };
  },
});
