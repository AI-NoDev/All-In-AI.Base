/**
 * 分页查询回收站节点
 */

import { defineAction } from '../../core/define';
import { node } from '@qiyu-allinai/db/entities/knowledge';
import { t } from 'elysia';
import { eq, and, isNotNull, ilike, sql, inArray, gte, lte, asc, desc, isNull, or, getTableColumns } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

// 回收站专用 Filter Schema (包含 parentId 和 rootOnly)
export const nodeGetRecycleBin = defineAction({
  meta: {
    name: 'knowledge.node.getRecycleBin',
    displayName: '分页查询回收站',
    description: `分页查询回收站中的节点列表，仅显示当前用户删除的节点。`,
    tags: ['knowledge', 'node', 'query'],
    method: 'POST',
    path: '/api/knowledge/nodes/recycle-bin',
  },
  schemas: {
    bodySchema: t.Object({
      limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 20 })),
      offset: t.Optional(t.Number({ minimum: 0, default: 0 })),
      sort: t.Optional(t.Object({
        field: t.Optional(t.String()),
        order: t.Optional(t.String())
      })),
      filter: t.Optional(t.Object({
        ids: t.Optional(t.Array(t.String())),
        types: t.Optional(t.Array(t.String())),
        type: t.Optional(t.String()),
        name: t.Optional(t.String()),
        extension: t.Optional(t.String()),
        deletedAtStart: t.Optional(t.String()),
        deletedAtEnd: t.Optional(t.String()),
        parentId: t.Optional(t.String()),
        rootOnly: t.Optional(t.Boolean()),
      }))
    }),
    outputSchema: t.Object({
      data: t.Array(t.Any()),
      total: t.Number()
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset = 0, limit = 20 } = input;
    
    // 基础条件：deletedAt 不为空，且是当前用户删除的 (或者有管理权限，暂时只看自己的)
    const conditions = [
      isNotNull(node.deletedAt),
      eq(node.deletedById, context.currentUserId),
    ];
    
    // 动态构建查询
    // 使用 getTableColumns 确保选择所有字段，并且结构扁平化
    let query = db.select({ ...getTableColumns(node) }).from(node);

    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(node.id, filter.ids));
      if (filter.types?.length) conditions.push(inArray(node.type, filter.types as any));
      if (filter.type) conditions.push(eq(node.type, filter.type as any));
      if (filter.name) conditions.push(ilike(node.name, `%${filter.name}%`));
      if (filter.extension) conditions.push(ilike(node.extension, `%${filter.extension}%`));
      // 注意：这里筛选的是 deletedAt
      if (filter.deletedAtStart) conditions.push(gte(node.deletedAt, filter.deletedAtStart));
      if (filter.deletedAtEnd) conditions.push(lte(node.deletedAt, filter.deletedAtEnd));
      
      if (filter.parentId) {
        conditions.push(eq(node.parentId, filter.parentId));
      }
      
      if (filter.rootOnly) {
        // 只显示"回收站根节点"：即父节点没有被删除的节点
        // 需要 Join 自身检查父节点状态
        const parent = alias(node, 'parent');
        query.leftJoin(parent, eq(node.parentId, parent.id));
        
        // 条件：父节点为空 (顶级节点) OR 父节点未删除 (父节点 deletedAt IS NULL)
        conditions.push(or(
          isNull(node.parentId),
          isNull(parent.deletedAt)
        ));
      }
    }
    
    const whereClause = and(...conditions);
    
    const orderDirection = sort?.order === 'asc' ? asc : desc;
    // 默认按删除时间倒序
    const sortField = sort?.field || 'deletedAt';
    
    const getOrderBy = () => {
      switch (sortField) {
        case 'name': return orderDirection(node.name);
        case 'type': return orderDirection(node.type);
        case 'size': return orderDirection(node.size);
        case 'orderNum': return orderDirection(node.orderNum);
        case 'createdAt': return orderDirection(node.createdAt);
        case 'updatedAt': return orderDirection(node.updatedAt);
        // 特殊处理 deletedAt (schema 中可能没有显式定义排序字段，但 SQL 支持)
        default: return orderDirection(node.deletedAt);
      }
    };
    
    const data = await query
      .where(whereClause)
      .orderBy(getOrderBy())
      .limit(limit)
      .offset(offset);
    
    // Count query needs similar join if rootOnly is used
    // 为了简化，我们重新构建 count 查询
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(node);
    
    if (filter?.rootOnly) {
       const parent = alias(node, 'parent');
       countQuery.leftJoin(parent, eq(node.parentId, parent.id));
    }
    
    const countResult = await countQuery.where(whereClause);
    return { data: data, total: Number(countResult[0]?.count ?? 0) };
  },
});
