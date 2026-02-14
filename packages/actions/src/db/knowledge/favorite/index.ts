import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import db from '@qiyu-allinai/db/connect';
import { favorite, favoriteZodSchemas, file, folder } from '@qiyu-allinai/db/entities/knowledge';

type FavoriteSelect = typeof favorite.$inferSelect;
type FavoriteInsert = typeof favorite.$inferInsert;

// ============ 添加收藏 ============
export const favoriteAdd = defineAction({
  meta: {
    name: 'knowledge.favorite.add',
    displayName: '添加收藏',
    description: '收藏文件或文件夹',
    tags: ['knowledge', 'favorite'],
    method: 'POST',
    path: '/api/knowledge/favorite',
  },
  schemas: {
    bodySchema: z.object({
      resourceType: z.enum(['folder', 'file']),
      resourceId: z.string(),
    }),
    outputSchema: favoriteZodSchemas.select,
  },
  execute: async (input, context) => {
    const [result] = await db.insert(favorite).values({
      userId: context.currentUserId,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      createdById: context.currentUserId,
      createdBy: context.currentUserName,
      updatedById: context.currentUserId,
      updatedBy: context.currentUserName,
    } as FavoriteInsert).onConflictDoNothing().returning();
    
    if (!result) {
      // Already favorited, return existing
      const [existing] = await db.select().from(favorite).where(
        and(
          eq(favorite.userId, context.currentUserId),
          eq(favorite.resourceType, input.resourceType),
          eq(favorite.resourceId, input.resourceId)
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
    description: '取消收藏文件或文件夹',
    tags: ['knowledge', 'favorite'],
    method: 'DELETE',
    path: '/api/knowledge/favorite/:resourceType/:resourceId',
  },
  schemas: {
    paramsSchema: z.object({
      resourceType: z.enum(['folder', 'file']),
      resourceId: z.string(),
    }),
    outputSchema: z.object({ success: z.boolean() }),
  },
  execute: async (input, context) => {
    const result = await db.delete(favorite).where(
      and(
        eq(favorite.userId, context.currentUserId),
        eq(favorite.resourceType, input.resourceType),
        eq(favorite.resourceId, input.resourceId)
      )
    ).returning();
    return { success: result.length > 0 };
  },
});

// ============ 检查是否已收藏 ============
export const favoriteCheck = defineAction({
  meta: {
    name: 'knowledge.favorite.check',
    displayName: '检查收藏状态',
    description: '检查资源是否已被收藏',
    tags: ['knowledge', 'favorite'],
    method: 'GET',
    path: '/api/knowledge/favorite/check/:resourceType/:resourceId',
  },
  schemas: {
    paramsSchema: z.object({
      resourceType: z.enum(['folder', 'file']),
      resourceId: z.string(),
    }),
    outputSchema: z.object({ isFavorited: z.boolean() }),
  },
  execute: async (input, context) => {
    const result = await db.select().from(favorite).where(
      and(
        eq(favorite.userId, context.currentUserId),
        eq(favorite.resourceType, input.resourceType),
        eq(favorite.resourceId, input.resourceId)
      )
    ).limit(1);
    return { isFavorited: result.length > 0 };
  },
});

// ============ 获取收藏列表 ============
export const favoriteList = defineAction({
  meta: {
    name: 'knowledge.favorite.list',
    displayName: '获取收藏列表',
    description: '获取当前用户的收藏列表',
    tags: ['knowledge', 'favorite'],
    method: 'POST',
    path: '/api/knowledge/favorite/list',
  },
  schemas: {
    bodySchema: z.object({
      resourceType: z.enum(['folder', 'file', 'all']).optional().default('all'),
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
    }),
    outputSchema: z.object({
      folders: z.array(z.object({
        id: z.string(),
        name: z.string(),
        parentId: z.string().nullable(),
        icon: z.string().nullable(),
        color: z.string().nullable(),
        isPublic: z.boolean(),
        createdAt: z.string(),
      })),
      files: z.array(z.object({
        id: z.string(),
        name: z.string(),
        folderId: z.string().nullable(),
        mimeType: z.string().nullable(),
        size: z.number(),
        isPublic: z.boolean(),
        createdAt: z.string(),
      })),
      total: z.number(),
    }),
  },
  execute: async (input, context) => {
    const { resourceType, limit, offset } = input;
    
    // Define result types
    interface FolderResult {
      id: string;
      name: string;
      parentId: string | null;
      icon: string | null;
      color: string | null;
      isPublic: boolean;
      createdAt: string;
    }
    
    interface FileResult {
      id: string;
      name: string;
      folderId: string | null;
      mimeType: string | null;
      size: number;
      isPublic: boolean;
      createdAt: string;
    }
    
    // Get favorited folders
    let folders: FolderResult[] = [];
    
    if (resourceType === 'all' || resourceType === 'folder') {
      const folderResults = await db
        .select({
          id: folder.id,
          name: folder.name,
          parentId: folder.parentId,
          icon: folder.icon,
          color: folder.color,
          isPublic: folder.isPublic,
          createdAt: folder.createdAt,
        })
        .from(favorite)
        .innerJoin(folder, eq(favorite.resourceId, folder.id))
        .where(
          and(
            eq(favorite.userId, context.currentUserId),
            eq(favorite.resourceType, 'folder')
          )
        )
        .limit(limit)
        .offset(offset);
      
      folders = folderResults.map(f => ({
        id: f.id,
        name: f.name,
        parentId: f.parentId,
        icon: f.icon,
        color: f.color,
        isPublic: f.isPublic,
        createdAt: String(f.createdAt),
      }));
    }
    
    // Get favorited files
    let files: FileResult[] = [];
    
    if (resourceType === 'all' || resourceType === 'file') {
      const fileResults = await db
        .select({
          id: file.id,
          name: file.name,
          folderId: file.folderId,
          mimeType: file.mimeType,
          size: file.size,
          isPublic: file.isPublic,
          createdAt: file.createdAt,
        })
        .from(favorite)
        .innerJoin(file, eq(favorite.resourceId, file.id))
        .where(
          and(
            eq(favorite.userId, context.currentUserId),
            eq(favorite.resourceType, 'file')
          )
        )
        .limit(limit)
        .offset(offset);
      
      files = fileResults.map(f => ({
        id: f.id,
        name: f.name,
        folderId: f.folderId,
        mimeType: f.mimeType,
        size: f.size,
        isPublic: f.isPublic,
        createdAt: String(f.createdAt),
      }));
    }
    
    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(favorite)
      .where(eq(favorite.userId, context.currentUserId));
    
    return {
      folders,
      files,
      total: Number(countResult[0]?.count ?? 0),
    };
  },
});

export const favoriteActions = [
  favoriteAdd,
  favoriteRemove,
  favoriteCheck,
  favoriteList,
];
