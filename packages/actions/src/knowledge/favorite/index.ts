/**
 * 知识库收藏 Actions
 */

import { z } from 'zod';
import { eq, and, sql, inArray, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { favorite, favoriteZodSchemas, node, type FavoriteSelect, type FavoriteInsert } from '@qiyu-allinai/db/entities/knowledge';

// ============ 添加收藏 ============
export const favoriteAdd = defineAction({
  meta: {
    name: 'knowledge.favorite.add',
    displayName: '添加收藏',
    description: '收藏节点',
    tags: ['knowledge', 'favorite'],
    method: 'POST',
    path: '/api/knowledge/favorites',
  },
  schemas: {
    bodySchema: z.object({
      nodeId: z.string(),
    }),
    outputSchema: favoriteZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 获取节点类型
    const [nodeRecord] = await db.select({ type: node.type }).from(node)
      .where(and(eq(node.id, input.nodeId), isNull(node.deletedAt)))
      .limit(1);
    
    const resourceType = nodeRecord?.type || 'file';
    
    const [result] = await db.insert(favorite).values({
      userId: context.currentUserId,
      resourceType,
      resourceId: input.nodeId,
      createdById: context.currentUserId,
      createdBy: context.currentUserName,
      updatedById: context.currentUserId,
      updatedBy: context.currentUserName,
    } as FavoriteInsert).onConflictDoNothing().returning();
    
    if (!result) {
      const [existing] = await db.select().from(favorite).where(
        and(
          eq(favorite.userId, context.currentUserId),
          eq(favorite.resourceId, input.nodeId)
        )
      );
      return existing as FavoriteSelect;
    }
    return result as FavoriteSelect;
  },
});

// ============ 取消收藏 ============
export const favoriteRemove = defineAction({
  meta: {
    name: 'knowledge.favorite.remove',
    displayName: '取消收藏',
    description: '取消收藏节点',
    tags: ['knowledge', 'favorite'],
    method: 'DELETE',
    path: '/api/knowledge/favorites/:nodeId',
  },
  schemas: {
    paramsSchema: z.object({ nodeId: z.string() }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const result = await db.delete(favorite).where(
      and(
        eq(favorite.userId, context.currentUserId),
        eq(favorite.resourceId, input.nodeId)
      )
    ).returning();
    return { success: result.length > 0 };
  },
});

// ============ 检查收藏状态 ============
export const favoriteCheck = defineAction({
  meta: {
    name: 'knowledge.favorite.check',
    displayName: '检查收藏状态',
    description: '检查节点是否已收藏',
    tags: ['knowledge', 'favorite'],
    method: 'POST',
    path: '/api/knowledge/favorites/check',
  },
  schemas: {
    bodySchema: z.object({
      nodeIds: z.array(z.string()),
    }),
    outputSchema: z.object({
      favorites: z.record(z.string(), z.boolean()),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const results = await db.select({ resourceId: favorite.resourceId })
      .from(favorite)
      .where(and(
        eq(favorite.userId, context.currentUserId),
        inArray(favorite.resourceId, input.nodeIds)
      ));
    
    const favoriteSet = new Set(results.map(r => r.resourceId));
    const favorites: Record<string, boolean> = {};
    
    for (const nodeId of input.nodeIds) {
      favorites[nodeId] = favoriteSet.has(nodeId);
    }
    
    return { favorites };
  },
});

// ============ 获取收藏列表 ============
export const favoriteList = defineAction({
  meta: {
    name: 'knowledge.favorite.list',
    displayName: '获取收藏列表',
    description: '获取当前用户的收藏列表（带节点详情）',
    tags: ['knowledge', 'favorite'],
    method: 'POST',
    path: '/api/knowledge/favorites/list',
  },
  schemas: {
    bodySchema: z.object({
      type: z.enum(['folder', 'file']).optional(),
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
    }),
    outputSchema: z.object({
      data: z.array(z.object({
        favoriteId: z.string(),
        nodeId: z.string(),
        type: z.enum(['folder', 'file']),
        name: z.string(),
        parentId: z.string().nullable(),
        icon: z.string().nullable(),
        color: z.string().nullable(),
        extension: z.string().nullable(),
        mimeType: z.string().nullable(),
        size: z.number(),
        createdAt: z.string(),
        favoritedAt: z.string(),
      })),
      total: z.number(),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const conditions = [eq(favorite.userId, context.currentUserId)];
    
    if (input.type) {
      conditions.push(eq(favorite.resourceType, input.type));
    }
    
    // 获取收藏记录
    const favorites = await db.select().from(favorite)
      .where(and(...conditions))
      .limit(input.limit)
      .offset(input.offset);
    
    if (favorites.length === 0) {
      return { data: [], total: 0 };
    }
    
    // 获取节点详情
    const nodeIds = favorites.map(f => f.resourceId);
    const nodes = await db.select().from(node)
      .where(and(inArray(node.id, nodeIds), isNull(node.deletedAt)));
    
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    const data = favorites
      .map(f => {
        const n = nodeMap.get(f.resourceId);
        if (!n) return null;
        return {
          favoriteId: f.id,
          nodeId: n.id,
          type: n.type as 'folder' | 'file',
          name: n.name,
          parentId: n.parentId,
          icon: n.icon,
          color: n.color,
          extension: n.extension,
          mimeType: n.mimeType,
          size: n.size,
          createdAt: n.createdAt,
          favoritedAt: f.createdAt,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
    
    // 获取总数
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(favorite)
      .where(and(...conditions));
    
    return { data, total: Number(countResult[0]?.count ?? 0) };
  },
});

export const favoriteActions = [
  favoriteAdd,
  favoriteRemove,
  favoriteCheck,
  favoriteList,
];
