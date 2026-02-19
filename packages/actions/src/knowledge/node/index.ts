/**
 * 知识库节点 REST API Actions
 * 
 * 标准 CRUD 操作，统一处理文件和文件夹
 */

import { z } from 'zod';
import { eq, and, isNull, ilike, sql, inArray, gte, lte, asc, desc } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { toJSONSchema } from '../../core/schema';
import { node, nodeZodSchemas, NODE_TYPES, type NodeSelect, type NodeInsert } from '@qiyu-allinai/db/entities/knowledge';
import { buildPath, buildMaterializedPath, assertNodePermission } from '../utils';

// ============ Filter Schema ============
const nodeFilterSchema = z.object({
  // IN 查询
  ids: z.array(z.string()).optional(),
  types: z.array(z.enum(['folder', 'file'])).optional(),
  // 精确匹配
  parentId: z.string().nullable().optional(),
  type: z.enum(['folder', 'file']).optional(),
  // 模糊匹配
  name: z.string().optional(),
  extension: z.string().optional(),
  // 时间范围
  createdAtStart: z.string().datetime().optional(),
  createdAtEnd: z.string().datetime().optional(),
  // 其他
  isPublic: z.boolean().optional(),
}).optional();

const sortSchema = z.object({
  field: z.enum(['name', 'type', 'size', 'orderNum', 'createdAt', 'updatedAt']),
  order: z.enum(['asc', 'desc']),
}).optional();

const paginationBodySchema = z.object({
  filter: nodeFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(20),
});

// ============ 分页查询 ============
export const nodeGetByPagination = defineAction({
  meta: {
    name: 'knowledge.node.getByPagination',
    displayName: '分页查询节点',
    description: '分页查询知识库节点列表，自动筛选当前用户的节点',
    tags: ['knowledge', 'node', 'query'],
    method: 'POST',
    path: '/api/knowledge/nodes/query',
  },
  schemas: {
    bodySchema: paginationBodySchema,
    outputSchema: z.object({ data: z.array(nodeZodSchemas.select), total: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, offset, limit } = input;
    
    const conditions = [
      isNull(node.deletedAt),
      eq(node.createdById, context.currentUserId),
    ];
    
    if (filter) {
      if (filter.ids?.length) conditions.push(inArray(node.id, filter.ids));
      if (filter.types?.length) conditions.push(inArray(node.type, filter.types));
      if (filter.parentId !== undefined) {
        conditions.push(filter.parentId === null ? isNull(node.parentId) : eq(node.parentId, filter.parentId));
      }
      if (filter.type) conditions.push(eq(node.type, filter.type));
      if (filter.name) conditions.push(ilike(node.name, `%${filter.name}%`));
      if (filter.extension) conditions.push(ilike(node.extension, `%${filter.extension}%`));
      if (filter.createdAtStart) conditions.push(gte(node.createdAt, filter.createdAtStart));
      if (filter.createdAtEnd) conditions.push(lte(node.createdAt, filter.createdAtEnd));
      if (filter.isPublic !== undefined) conditions.push(eq(node.isPublic, filter.isPublic));
    }
    
    const whereClause = and(...conditions);
    
    // 构建排序
    const orderDirection = sort?.order === 'asc' ? asc : desc;
    const sortField = sort?.field || 'createdAt';
    
    // 使用 switch 来避免类型问题
    const getOrderBy = () => {
      switch (sortField) {
        case 'name': return orderDirection(node.name);
        case 'type': return orderDirection(node.type);
        case 'size': return orderDirection(node.size);
        case 'orderNum': return orderDirection(node.orderNum);
        case 'updatedAt': return orderDirection(node.updatedAt);
        default: return orderDirection(node.createdAt);
      }
    };
    
    const data = await db.select().from(node)
      .where(whereClause)
      .orderBy(getOrderBy())
      .limit(limit)
      .offset(offset);
    
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(node).where(whereClause);
    return { data: data as NodeSelect[], total: Number(countResult[0]?.count ?? 0) };
  },
});

// ============ 获取子节点列表 ============
export const nodeGetChildren = defineAction({
  meta: {
    name: 'knowledge.node.getChildren',
    displayName: '获取子节点',
    description: '获取指定父节点下的所有子节点',
    tags: ['knowledge', 'node', 'query'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id/children',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    querySchema: z.object({
      type: z.enum(['folder', 'file']).optional(),
    }).optional(),
    outputSchema: z.object({ data: z.array(nodeZodSchemas.select) }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const parentId = input.id === 'root' ? null : input.id;
    
    const conditions = [
      isNull(node.deletedAt),
      eq(node.createdById, context.currentUserId),
      parentId === null ? isNull(node.parentId) : eq(node.parentId, parentId),
    ];
    
    if (input.type) {
      conditions.push(eq(node.type, input.type));
    }
    
    const data = await db.select().from(node)
      .where(and(...conditions))
      .orderBy(asc(node.type), asc(node.orderNum), asc(node.name));
    
    return { data: data as NodeSelect[] };
  },
});

// ============ 根据ID查询 ============
export const nodeGetByPk = defineAction({
  meta: {
    name: 'knowledge.node.getByPk',
    displayName: '根据ID查询节点',
    description: '根据主键ID查询单个节点',
    tags: ['knowledge', 'node', 'query'],
    method: 'GET',
    path: '/api/knowledge/nodes/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: nodeZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [result] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt)))
      .limit(1);
    
    if (!result) return null;
    
    // 检查读取权限
    await assertNodePermission(db, context.currentUserId, result, 'read');
    
    return result as NodeSelect;
  },
});

// ============ 创建节点 ============
export const nodeCreate = defineAction({
  meta: {
    name: 'knowledge.node.create',
    displayName: '创建节点',
    description: '创建文件夹或文件节点',
    tags: ['knowledge', 'node', 'mutation'],
    method: 'POST',
    path: '/api/knowledge/nodes',
  },
  schemas: {
    bodySchema: z.object({
      type: z.enum(['folder', 'file']),
      parentId: z.string().nullable().optional(),
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      // 文件夹特有
      icon: z.string().optional(),
      color: z.string().optional(),
      // 文件特有
      extension: z.string().optional(),
      mimeType: z.string().optional(),
      size: z.number().optional(),
      storageKey: z.string().optional(),
      bucket: z.string().optional(),
      etag: z.string().optional(),
      versionId: z.string().optional(),
    }),
    outputSchema: nodeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    let path = '/';
    let materializedPath = '';
    
    if (input.parentId) {
      const [parent] = await db.select().from(node)
        .where(and(eq(node.id, input.parentId), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FOLDER)))
        .limit(1);
      
      if (!parent) {
        throw ActionError.notFound('error.knowledge.parentNotFound');
      }
      
      // 检查父节点写入权限
      await assertNodePermission(db, context.currentUserId, parent, 'write');
      
      path = buildPath(parent.path, parent.name);
      materializedPath = buildMaterializedPath(parent.materializedPath, parent.id);
    }
    
    const [result] = await db.insert(node).values({
      type: input.type,
      parentId: input.parentId || null,
      name: input.name,
      path,
      materializedPath,
      description: input.description,
      icon: input.icon,
      color: input.color,
      originalName: input.type === NODE_TYPES.FILE ? input.name : null,
      extension: input.extension,
      mimeType: input.mimeType,
      size: input.size ?? 0,
      storageKey: input.storageKey,
      bucket: input.bucket,
      etag: input.etag,
      versionId: input.versionId,
      createdBy: context.currentUserName,
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    } as NodeInsert).returning();
    
    return result as NodeSelect;
  },
});

// ============ 更新节点 ============
export const nodeUpdate = defineAction({
  meta: {
    name: 'knowledge.node.update',
    displayName: '更新节点',
    description: '更新节点信息',
    tags: ['knowledge', 'node', 'mutation'],
    method: 'PUT',
    path: '/api/knowledge/nodes/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({
      name: z.string().min(1).max(255).optional(),
      description: z.string().nullable().optional(),
      icon: z.string().nullable().optional(),
      color: z.string().nullable().optional(),
      orderNum: z.number().int().optional(),
      isPublic: z.boolean().optional(),
      tags: z.array(z.string()).optional(),
    }),
    outputSchema: nodeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [existing] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt)))
      .limit(1);
    
    if (!existing) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }
    
    await assertNodePermission(db, context.currentUserId, existing, 'write');
    
    const updateData: Partial<NodeInsert> = {
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    };
    
    if (input.name !== undefined) {
      updateData.name = input.name;
      if (existing.type === NODE_TYPES.FILE) {
        updateData.originalName = input.name;
        const ext = input.name.split('.').pop() || '';
        updateData.extension = ext;
      }
    }
    if (input.description !== undefined) updateData.description = input.description;
    if (input.icon !== undefined) updateData.icon = input.icon;
    if (input.color !== undefined) updateData.color = input.color;
    if (input.orderNum !== undefined) updateData.orderNum = input.orderNum;
    if (input.isPublic !== undefined) updateData.isPublic = input.isPublic;
    if (input.tags !== undefined) updateData.tags = input.tags;
    
    const [result] = await db.update(node)
      .set(updateData)
      .where(eq(node.id, input.id))
      .returning();
    
    return result as NodeSelect;
  },
});

// ============ 删除节点 ============
export const nodeDelete = defineAction({
  meta: {
    name: 'knowledge.node.delete',
    displayName: '删除节点',
    description: '软删除节点（文件夹会递归删除子节点）',
    tags: ['knowledge', 'node', 'mutation'],
    method: 'DELETE',
    path: '/api/knowledge/nodes/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({ success: z.boolean(), deletedCount: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const now = new Date().toISOString();
    
    const [existing] = await db.select().from(node)
      .where(and(eq(node.id, input.id), isNull(node.deletedAt)))
      .limit(1);
    
    if (!existing) {
      return { success: false, deletedCount: 0 };
    }
    
    await assertNodePermission(db, context.currentUserId, existing, 'delete');
    
    let deletedCount = 1;
    
    // 删除当前节点
    await db.update(node)
      .set({
        deletedAt: now,
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(eq(node.id, input.id));
    
    // 如果是文件夹，递归删除子节点
    if (existing.type === NODE_TYPES.FOLDER) {
      const childPath = `${existing.materializedPath ? existing.materializedPath + '/' : ''}${existing.id}`;
      
      // 使用物化路径批量删除所有后代节点
      const result = await db.update(node)
        .set({
          deletedAt: now,
          deletedById: context.currentUserId,
          deletedBy: context.currentUserName,
        })
        .where(and(
          sql`${node.materializedPath} LIKE ${childPath + '%'}`,
          isNull(node.deletedAt)
        ))
        .returning({ id: node.id });
      
      deletedCount += result.length;
    }
    
    return { success: true, deletedCount };
  },
});

// ============ 批量删除 ============
export const nodeDeleteMany = defineAction({
  meta: {
    name: 'knowledge.node.deleteMany',
    displayName: '批量删除节点',
    description: '批量软删除多个节点',
    tags: ['knowledge', 'node', 'mutation'],
    method: 'POST',
    path: '/api/knowledge/nodes/delete-batch',
  },
  schemas: {
    bodySchema: z.object({ ids: z.array(z.string()) }),
    outputSchema: z.object({ deletedCount: z.number() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const now = new Date().toISOString();
    
    const nodes = await db.select().from(node)
      .where(and(inArray(node.id, input.ids), isNull(node.deletedAt)));
    
    let deletedCount = 0;
    
    for (const n of nodes) {
      try {
        await assertNodePermission(db, context.currentUserId, n, 'delete');
        
        await db.update(node)
          .set({
            deletedAt: now,
            deletedById: context.currentUserId,
            deletedBy: context.currentUserName,
          })
          .where(eq(node.id, n.id));
        
        deletedCount++;
        
        // 如果是文件夹，递归删除子节点
        if (n.type === NODE_TYPES.FOLDER) {
          const childPath = `${n.materializedPath ? n.materializedPath + '/' : ''}${n.id}`;
          const result = await db.update(node)
            .set({
              deletedAt: now,
              deletedById: context.currentUserId,
              deletedBy: context.currentUserName,
            })
            .where(and(
              sql`${node.materializedPath} LIKE ${childPath + '%'}`,
              isNull(node.deletedAt)
            ))
            .returning({ id: node.id });
          
          deletedCount += result.length;
        }
      } catch {
        // 跳过没有权限的节点
      }
    }
    
    return { deletedCount };
  },
});

// ============ 获取 Schema ============
export const nodeGetSchema = defineAction({
  meta: {
    name: 'knowledge.node.getSchema',
    displayName: '获取节点Schema',
    description: '获取节点表的JSON Schema',
    tags: ['knowledge', 'node', 'schema'],
    method: 'GET',
    path: '/api/knowledge/nodes/schema',
    ignoreTools: true,
  },
  schemas: {
    outputSchema: z.record(z.string(), z.unknown()),
  },
  execute: async () => {
    return toJSONSchema(nodeZodSchemas.select) as Record<string, unknown>;
  },
});

export const nodeActions = [
  nodeGetByPagination,
  nodeGetChildren,
  nodeGetByPk,
  nodeCreate,
  nodeUpdate,
  nodeDelete,
  nodeDeleteMany,
  nodeGetSchema,
];
