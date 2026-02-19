/**
 * 知识库节点操作 Actions
 * 快捷操作：移动、复制、检查存在等
 */
import { z } from 'zod';
import { eq, and, isNull, sql, inArray, ilike } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeZodSchemas, NODE_TYPES, type NodeSelect, type NodeInsert } from '@qiyu-allinai/db/entities/knowledge';
import { buildPath, buildMaterializedPath, isAncestor, assertNodePermission, checkNodePermission, generateUniqueName, parseFileName } from '../utils';

export const nodeMove = defineAction({
  meta: { name: 'knowledge.node.move', displayName: '移动节点', description: '移动节点到目标文件夹', tags: ['knowledge', 'operations'], method: 'POST', path: '/api/knowledge/nodes/:id/move' },
  schemas: { paramsSchema: z.object({ id: z.string() }), bodySchema: z.object({ targetParentId: z.string().nullable() }), outputSchema: nodeZodSchemas.select },
  execute: async (input, context) => {
    const { db } = context;
    if (input.targetParentId === input.id) throw ActionError.badRequest('error.knowledge.cannotMoveToSelf');
    const [existing] = await db.select().from(node).where(and(eq(node.id, input.id), isNull(node.deletedAt))).limit(1);
    if (!existing) throw ActionError.notFound('error.knowledge.nodeNotFound');
    await assertNodePermission(db, context.currentUserId, existing, 'write');
    let newPath = '/'; let newMaterializedPath = '';
    if (input.targetParentId) {
      const [targetParent] = await db.select().from(node).where(and(eq(node.id, input.targetParentId), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FOLDER))).limit(1);
      if (!targetParent) throw ActionError.notFound('error.knowledge.targetNotFound');
      await assertNodePermission(db, context.currentUserId, targetParent, 'write');
      if (existing.type === NODE_TYPES.FOLDER && isAncestor(targetParent.materializedPath, existing.id)) throw ActionError.badRequest('error.knowledge.cannotMoveToDescendant');
      newPath = buildPath(targetParent.path, targetParent.name);
      newMaterializedPath = buildMaterializedPath(targetParent.materializedPath, targetParent.id);
    }
    const [result] = await db.update(node).set({ parentId: input.targetParentId, path: newPath, materializedPath: newMaterializedPath, updatedBy: context.currentUserName, updatedById: context.currentUserId }).where(eq(node.id, input.id)).returning();
    if (existing.type === NODE_TYPES.FOLDER) {
      const oldChildPath = existing.materializedPath ? existing.materializedPath + '/' + existing.id : existing.id;
      const newChildPath = newMaterializedPath ? newMaterializedPath + '/' + existing.id : existing.id;
      await db.execute(sql`UPDATE knowledge_node SET materialized_path = REPLACE(materialized_path, ${oldChildPath}, ${newChildPath}) WHERE materialized_path LIKE ${oldChildPath + '%'} AND deleted_at IS NULL`);
    }
    return result as NodeSelect;
  },
});

export const nodeCopy = defineAction({
  meta: { name: 'knowledge.node.copy', displayName: '复制节点', description: '复制节点到目标文件夹', tags: ['knowledge', 'operations'], method: 'POST', path: '/api/knowledge/nodes/:id/copy' },
  schemas: { paramsSchema: z.object({ id: z.string() }), bodySchema: z.object({ targetParentId: z.string().nullable() }), outputSchema: nodeZodSchemas.select },
  execute: async (input, context) => {
    const { db } = context;
    const [existing] = await db.select().from(node).where(and(eq(node.id, input.id), isNull(node.deletedAt))).limit(1);
    if (!existing) throw ActionError.notFound('error.knowledge.nodeNotFound');
    await assertNodePermission(db, context.currentUserId, existing, 'read');
    let newPath = '/'; let newMaterializedPath = '';
    if (input.targetParentId) {
      const [targetParent] = await db.select().from(node).where(and(eq(node.id, input.targetParentId), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FOLDER))).limit(1);
      if (!targetParent) throw ActionError.notFound('error.knowledge.targetNotFound');
      await assertNodePermission(db, context.currentUserId, targetParent, 'write');
      newPath = buildPath(targetParent.path, targetParent.name);
      newMaterializedPath = buildMaterializedPath(targetParent.materializedPath, targetParent.id);
    }
    const parentCondition = input.targetParentId === null ? isNull(node.parentId) : eq(node.parentId, input.targetParentId);
    const existingNodes = await db.select({ name: node.name }).from(node).where(and(parentCondition, isNull(node.deletedAt)));
    const existingNames = new Set(existingNodes.map(n => n.name));
    const { baseName, extension } = parseFileName(existing.name);
    const newName = generateUniqueName(baseName, extension, existingNames);
    const [result] = await db.insert(node).values({
      type: existing.type, parentId: input.targetParentId, name: newName, path: newPath, materializedPath: newMaterializedPath,
      description: existing.description, icon: existing.icon, color: existing.color,
      originalName: existing.type === NODE_TYPES.FILE ? newName : null, extension: existing.extension, mimeType: existing.mimeType,
      size: existing.size, storageKey: existing.storageKey, bucket: existing.bucket, etag: existing.etag, versionId: existing.versionId,
      tags: existing.tags, isPublic: existing.isPublic,
      createdBy: context.currentUserName, createdById: context.currentUserId, updatedBy: context.currentUserName, updatedById: context.currentUserId,
    } as NodeInsert).returning();
    return result as NodeSelect;
  },
});


export const nodeCheckExists = defineAction({
  meta: { name: 'knowledge.node.checkExists', displayName: '检查节点是否存在', description: '检查指定父节点下是否存在同名节点', tags: ['knowledge', 'operations'], method: 'POST', path: '/api/knowledge/nodes/check-exists' },
  schemas: {
    bodySchema: z.object({ parentId: z.string().nullable().optional(), names: z.array(z.string().min(1).max(255)), type: z.enum(['folder', 'file']).optional() }),
    outputSchema: z.object({ exists: z.array(z.object({ name: z.string(), nodeId: z.string(), type: z.enum(['folder', 'file']), size: z.number(), updatedAt: z.string() })) }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const parentId = input.parentId ?? null;
    const parentCondition = parentId === null ? isNull(node.parentId) : eq(node.parentId, parentId);
    const conditions = [parentCondition, isNull(node.deletedAt), eq(node.createdById, context.currentUserId)];
    if (input.type) conditions.push(eq(node.type, input.type));
    const existingNodes = await db.select({ id: node.id, name: node.name, type: node.type, size: node.size, updatedAt: node.updatedAt }).from(node).where(and(...conditions));
    const nameSet = new Set(input.names);
    const matches = existingNodes.filter(n => nameSet.has(n.name));
    return { exists: matches.map(n => ({ name: n.name, nodeId: n.id, type: n.type as 'folder' | 'file', size: n.size, updatedAt: n.updatedAt })) };
  },
});

export const nodeGetPath = defineAction({
  meta: { name: 'knowledge.node.getPath', displayName: '获取节点路径', description: '获取节点的完整路径（面包屑）', tags: ['knowledge', 'operations'], method: 'GET', path: '/api/knowledge/nodes/:id/path' },
  schemas: { paramsSchema: z.object({ id: z.string() }), outputSchema: z.object({ data: z.array(z.object({ id: z.string(), name: z.string(), type: z.enum(['folder', 'file']) })) }) },
  execute: async (input, context) => {
    const { db } = context;
    const [existing] = await db.select().from(node).where(and(eq(node.id, input.id), isNull(node.deletedAt))).limit(1);
    if (!existing) return { data: [] };
    const ancestorIds = existing.materializedPath ? existing.materializedPath.split('/').filter(Boolean) : [];
    if (ancestorIds.length === 0) return { data: [{ id: existing.id, name: existing.name, type: existing.type as 'folder' | 'file' }] };
    const ancestors = await db.select({ id: node.id, name: node.name, type: node.type }).from(node).where(and(inArray(node.id, ancestorIds), isNull(node.deletedAt)));
    const ancestorMap = new Map(ancestors.map(a => [a.id, a]));
    const sortedAncestors = ancestorIds.map(id => ancestorMap.get(id)).filter((a): a is typeof ancestors[0] => a !== undefined);
    return { data: [...sortedAncestors.map(a => ({ id: a.id, name: a.name, type: a.type as 'folder' | 'file' })), { id: existing.id, name: existing.name, type: existing.type as 'folder' | 'file' }] };
  },
});

export const nodeUpdateOrder = defineAction({
  meta: { name: 'knowledge.node.updateOrder', displayName: '更新节点排序', description: '批量更新节点排序', tags: ['knowledge', 'operations'], method: 'PUT', path: '/api/knowledge/nodes/order' },
  schemas: { bodySchema: z.object({ items: z.array(z.object({ id: z.string(), orderNum: z.number().int() })) }), outputSchema: z.object({ success: z.boolean(), updatedCount: z.number() }) },
  execute: async (input, context) => {
    const { db } = context;
    let updatedCount = 0;
    for (const item of input.items) {
      const [existing] = await db.select().from(node).where(and(eq(node.id, item.id), isNull(node.deletedAt))).limit(1);
      if (!existing) continue;
      const hasPermission = await checkNodePermission(db, context.currentUserId, existing, 'write');
      if (!hasPermission) continue;
      await db.update(node).set({ orderNum: item.orderNum, updatedBy: context.currentUserName, updatedById: context.currentUserId }).where(eq(node.id, item.id));
      updatedCount++;
    }
    return { success: true, updatedCount };
  },
});

export const nodeSearch = defineAction({
  meta: { name: 'knowledge.node.search', displayName: '搜索节点', description: '全文搜索知识库节点', tags: ['knowledge', 'operations'], method: 'POST', path: '/api/knowledge/nodes/search' },
  schemas: { bodySchema: z.object({ keyword: z.string().min(1).max(100), type: z.enum(['folder', 'file']).optional(), limit: z.number().int().min(1).max(50).default(20) }), outputSchema: z.object({ data: z.array(nodeZodSchemas.select) }) },
  execute: async (input, context) => {
    const { db } = context;
    const searchPattern = '%' + input.keyword + '%';
    const conditions = [isNull(node.deletedAt), eq(node.createdById, context.currentUserId), ilike(node.name, searchPattern)];
    if (input.type) conditions.push(eq(node.type, input.type));
    const results = await db.select().from(node).where(and(...conditions)).limit(input.limit);
    return { data: results as NodeSelect[] };
  },
});

export const operationsActions = [nodeMove, nodeCopy, nodeCheckExists, nodeGetPath, nodeUpdateOrder, nodeSearch];
