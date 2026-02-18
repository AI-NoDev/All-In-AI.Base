import { z } from 'zod';
import { eq, and, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
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
    const { db } = context;
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
    const { db } = context;
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
    const { db } = context;
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

// ============ 批量检查收藏状态 ============
export const favoriteCheckBatch = defineAction({
  meta: {
    name: 'knowledge.favorite.checkBatch',
    displayName: '批量检查收藏状态',
    description: '批量检查多个资源是否已被收藏',
    tags: ['knowledge', 'favorite'],
    method: 'POST',
    path: '/api/knowledge/favorite/check-batch',
  },
  schemas: {
    bodySchema: z.object({
      folderIds: z.array(z.string()).optional().default([]),
      fileIds: z.array(z.string()).optional().default([]),
    }),
    outputSchema: z.object({
      favoritedFolderIds: z.array(z.string()),
      favoritedFileIds: z.array(z.string()),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { folderIds, fileIds } = input;
    
    const favoritedFolderIds: string[] = [];
    const favoritedFileIds: string[] = [];
    
    if (folderIds.length > 0) {
      const folderFavorites = await db.select({ resourceId: favorite.resourceId })
        .from(favorite)
        .where(
          and(
            eq(favorite.userId, context.currentUserId),
            eq(favorite.resourceType, 'folder')
          )
        );
      const favoritedSet = new Set(folderFavorites.map(f => f.resourceId));
      for (const id of folderIds) {
        if (favoritedSet.has(id)) favoritedFolderIds.push(id);
      }
    }
    
    if (fileIds.length > 0) {
      const fileFavorites = await db.select({ resourceId: favorite.resourceId })
        .from(favorite)
        .where(
          and(
            eq(favorite.userId, context.currentUserId),
            eq(favorite.resourceType, 'file')
          )
        );
      const favoritedSet = new Set(fileFavorites.map(f => f.resourceId));
      for (const id of fileIds) {
        if (favoritedSet.has(id)) favoritedFileIds.push(id);
      }
    }
    
    return { favoritedFolderIds, favoritedFileIds };
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
        createdById: z.string().nullable(),
        isOwner: z.boolean(),
        permission: z.enum(['read', 'write', 'manage', 'none']),
      })),
      files: z.array(z.object({
        id: z.string(),
        name: z.string(),
        folderId: z.string().nullable(),
        extension: z.string().nullable(),
        mimeType: z.string().nullable(),
        size: z.number(),
        isPublic: z.boolean(),
        createdAt: z.string(),
        createdById: z.string().nullable(),
        isOwner: z.boolean(),
        permission: z.enum(['read', 'write', 'manage', 'none']),
      })),
      total: z.number(),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { resourceType, limit, offset } = input;
    const { FilePermissionAdapter } = await import('@qiyu-allinai/db/casbin');
    const adapter = new FilePermissionAdapter(db as ConstructorParameters<typeof FilePermissionAdapter>[0]);
    
    type PermissionLevel = 'read' | 'write' | 'manage' | 'none';
    
    // 检查用户对资源的权限级别（包括继承权限）
    async function getPermissionLevel(
      resourceType: 'folder' | 'file',
      resourceId: string,
      createdById: string | null,
      isPublic: boolean,
      parentFolderId?: string | null
    ): Promise<PermissionLevel> {
      // 创建人拥有管理权限
      if (createdById === context.currentUserId) {
        return 'manage';
      }
      // 公开资源有只读权限
      if (isPublic) {
        return 'read';
      }
      
      // 获取资源的直接权限列表
      const permissions = await adapter.getPermissionsForResource(resourceType, resourceId);
      
      // 筛选当前用户的权限（只检查 user 类型的直接权限）
      const userPermissions = permissions.filter(
        p => p.subjectType === 'user' && p.subjectId === context.currentUserId && p.effect === 'allow'
      );
      
      // 检查权限级别（从高到低）
      if (userPermissions.some(p => p.permission === 'manage')) return 'manage';
      if (userPermissions.some(p => p.permission === 'write')) return 'write';
      if (userPermissions.some(p => p.permission === 'read')) return 'read';
      
      // 检查父文件夹的继承权限
      if (parentFolderId) {
        // 递归检查父文件夹权限
        const parentFolder = await db.select({
          id: folder.id,
          parentId: folder.parentId,
          createdById: folder.createdById,
          isPublic: folder.isPublic,
        }).from(folder).where(eq(folder.id, parentFolderId)).limit(1);
        
        if (parentFolder.length > 0 && parentFolder[0]) {
          const parent = parentFolder[0];
          return getPermissionLevel('folder', parent.id, parent.createdById ?? null, parent.isPublic ?? false, parent.parentId ?? null);
        }
      }
      
      return 'none';
    }
    
    // Define result types
    interface FolderResult {
      id: string;
      name: string;
      parentId: string | null;
      icon: string | null;
      color: string | null;
      isPublic: boolean;
      createdAt: string;
      createdById: string | null;
      isOwner: boolean;
      permission: PermissionLevel;
    }
    
    interface FileResult {
      id: string;
      name: string;
      folderId: string | null;
      extension: string | null;
      mimeType: string | null;
      size: number;
      isPublic: boolean;
      createdAt: string;
      createdById: string | null;
      isOwner: boolean;
      permission: PermissionLevel;
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
          createdById: folder.createdById,
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
      
      folders = await Promise.all(folderResults.map(async f => {
        const isOwner = f.createdById === context.currentUserId;
        const permission = await getPermissionLevel('folder', f.id, f.createdById, f.isPublic, f.parentId);
        return {
          id: f.id,
          name: f.name,
          parentId: f.parentId,
          icon: f.icon,
          color: f.color,
          isPublic: f.isPublic,
          createdAt: String(f.createdAt),
          createdById: f.createdById,
          isOwner,
          permission,
        };
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
          extension: file.extension,
          mimeType: file.mimeType,
          size: file.size,
          isPublic: file.isPublic,
          createdAt: file.createdAt,
          createdById: file.createdById,
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
      
      files = await Promise.all(fileResults.map(async f => {
        const isOwner = f.createdById === context.currentUserId;
        const permission = await getPermissionLevel('file', f.id, f.createdById, f.isPublic, f.folderId);
        return {
          id: f.id,
          name: f.name,
          folderId: f.folderId,
          extension: f.extension,
          mimeType: f.mimeType,
          size: f.size,
          isPublic: f.isPublic,
          createdAt: String(f.createdAt),
          createdById: f.createdById,
          isOwner,
          permission,
        };
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
  favoriteCheckBatch,
  favoriteList,
];
