/**
 * 文件共享相关 Actions
 * 
 * 基于 Casbin 权限系统查询共享信息
 */

import { z } from 'zod';
import { eq, and, sql, inArray } from 'drizzle-orm';
import { defineAction } from '../core/define';
import { file, folder } from '@qiyu-allinai/db/entities/knowledge';
import { casbinRule, CASBIN_POLICY_TYPES } from '@qiyu-allinai/db/entities/system';

// ============ 获取我共享的资源 ============
export const fileShareGetMyShared = defineAction({
  meta: {
    name: 'files.share.getMyShared',
    displayName: '获取我共享的资源',
    description: '获取当前用户共享给他人的文件和文件夹',
    tags: ['files', 'share'],
    method: 'POST',
    path: '/api/files/share/my-shared',
  },
  schemas: {
    bodySchema: z.object({
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
        sharedTo: z.array(z.object({
          subjectType: z.string(),
          subjectId: z.string(),
          permission: z.string(),
        })),
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
        sharedTo: z.array(z.object({
          subjectType: z.string(),
          subjectId: z.string(),
          permission: z.string(),
        })),
      })),
      total: z.number(),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { limit, offset } = input;
    
    // Find resources created by current user that have been shared (have permission policies)
    // Get folders created by current user
    const myFolders = await db
      .select()
      .from(folder)
      .where(eq(folder.createdById, context.currentUserId))
      .limit(limit)
      .offset(offset);
    
    // Get files created by current user
    const myFiles = await db
      .select()
      .from(file)
      .where(eq(file.createdById, context.currentUserId))
      .limit(limit)
      .offset(offset);
    
    // Get permission policies for these resources
    const folderIds = myFolders.map(f => `folder:${f.id}`);
    const fileIds = myFiles.map(f => `file:${f.id}`);
    const allResourceIds = [...folderIds, ...fileIds];
    
    let policies: Array<{ v0: string | null; v1: string | null; v2: string | null }> = [];
    if (allResourceIds.length > 0) {
      policies = await db
        .select({ v0: casbinRule.v0, v1: casbinRule.v1, v2: casbinRule.v2 })
        .from(casbinRule)
        .where(
          and(
            eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
            inArray(casbinRule.v1, allResourceIds)
          )
        );
    }
    
    // Group policies by resource
    const policyMap = new Map<string, Array<{ subjectType: string; subjectId: string; permission: string }>>();
    for (const p of policies) {
      if (!p.v1 || !p.v0) continue;
      const subject = p.v0.match(/^(user|role|dept):(.+)$/);
      if (!subject || !subject[1] || !subject[2]) continue;
      
      // Skip if it's the owner's own permission
      if (subject[1] === 'user' && subject[2] === context.currentUserId) continue;
      
      if (!policyMap.has(p.v1)) {
        policyMap.set(p.v1, []);
      }
      policyMap.get(p.v1)!.push({
        subjectType: subject[1],
        subjectId: subject[2],
        permission: p.v2 ?? '',
      });
    }
    
    // Filter to only include resources that have been shared
    const sharedFolders = myFolders
      .filter(f => policyMap.has(`folder:${f.id}`) || f.isPublic)
      .map(f => ({
        id: f.id,
        name: f.name,
        parentId: f.parentId,
        icon: f.icon,
        color: f.color,
        isPublic: f.isPublic,
        createdAt: String(f.createdAt),
        sharedTo: policyMap.get(`folder:${f.id}`) ?? [],
      }));
    
    const sharedFiles = myFiles
      .filter(f => policyMap.has(`file:${f.id}`) || f.isPublic)
      .map(f => ({
        id: f.id,
        name: f.name,
        folderId: f.folderId,
        extension: f.extension,
        mimeType: f.mimeType,
        size: f.size,
        isPublic: f.isPublic,
        createdAt: String(f.createdAt),
        sharedTo: policyMap.get(`file:${f.id}`) ?? [],
      }));
    
    return {
      folders: sharedFolders,
      files: sharedFiles,
      total: sharedFolders.length + sharedFiles.length,
    };
  },
});

// ============ 获取收到的共享 ============
export const fileShareGetSharedWithMe = defineAction({
  meta: {
    name: 'files.share.getSharedWithMe',
    displayName: '获取收到的共享',
    description: '获取他人共享给当前用户的文件和文件夹',
    tags: ['files', 'share'],
    method: 'POST',
    path: '/api/files/share/shared-with-me',
  },
  schemas: {
    bodySchema: z.object({
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
        sharedBy: z.string().nullable(),
        permission: z.string(),
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
        sharedBy: z.string().nullable(),
        permission: z.string(),
      })),
      total: z.number(),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { limit, offset } = input;
    const userSubject = `user:${context.currentUserId}`;
    
    // Get policies where current user is the subject
    const policies = await db
      .select()
      .from(casbinRule)
      .where(
        and(
          eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
          eq(casbinRule.v0, userSubject)
        )
      )
      .limit(limit)
      .offset(offset);
    
    // Parse resource IDs
    const folderIds: string[] = [];
    const fileIds: string[] = [];
    const permissionMap = new Map<string, string>();
    
    for (const p of policies) {
      if (!p.v1) continue;
      const match = p.v1.match(/^(folder|file):(.+)$/);
      if (!match || !match[1] || !match[2]) continue;
      
      const type = match[1];
      const id = match[2];
      permissionMap.set(p.v1, p.v2 ?? 'read');
      
      if (type === 'folder') {
        folderIds.push(id);
      } else {
        fileIds.push(id);
      }
    }
    
    // Get folder details (exclude own folders)
    let folders: typeof folder.$inferSelect[] = [];
    if (folderIds.length > 0) {
      folders = await db
        .select()
        .from(folder)
        .where(
          and(
            inArray(folder.id, folderIds),
            sql`${folder.createdById} != ${context.currentUserId}`
          )
        );
    }
    
    // Get file details (exclude own files)
    let files: typeof file.$inferSelect[] = [];
    if (fileIds.length > 0) {
      files = await db
        .select()
        .from(file)
        .where(
          and(
            inArray(file.id, fileIds),
            sql`${file.createdById} != ${context.currentUserId}`
          )
        );
    }
    
    return {
      folders: folders.map(f => ({
        id: f.id,
        name: f.name,
        parentId: f.parentId,
        icon: f.icon,
        color: f.color,
        isPublic: f.isPublic,
        createdAt: String(f.createdAt),
        sharedBy: f.createdBy,
        permission: permissionMap.get(`folder:${f.id}`) ?? 'read',
      })),
      files: files.map(f => ({
        id: f.id,
        name: f.name,
        folderId: f.folderId,
        extension: f.extension,
        mimeType: f.mimeType,
        size: f.size,
        isPublic: f.isPublic,
        createdAt: String(f.createdAt),
        sharedBy: f.createdBy,
        permission: permissionMap.get(`file:${f.id}`) ?? 'read',
      })),
      total: folders.length + files.length,
    };
  },
});

// ============ 辅助函数：获取文件夹路径 ============
async function getFolderAncestorPath(
  db: Parameters<Parameters<typeof defineAction>[0]['execute']>[1]['db'],
  folderId: string
): Promise<string[]> {
  const path: string[] = [];
  let currentId: string | null = folderId;
  
  while (currentId) {
    path.push(currentId);
    const [f] = await db
      .select({ parentId: folder.parentId })
      .from(folder)
      .where(eq(folder.id, currentId))
      .limit(1);
    
    if (!f) break;
    currentId = f.parentId;
  }
  
  return path;
}

// ============ 辅助函数：获取用户在资源上的权限（含继承） ============
async function getInheritedPermission(
  db: Parameters<Parameters<typeof defineAction>[0]['execute']>[1]['db'],
  userId: string,
  resourceType: 'folder' | 'file',
  resourceId: string,
  ancestorFolderIds: string[]
): Promise<string | null> {
  const userSubject = `user:${userId}`;
  
  // 1. 首先检查资源本身是否有直接权限
  const directResource = `${resourceType}:${resourceId}`;
  const [directPolicy] = await db
    .select({ v2: casbinRule.v2 })
    .from(casbinRule)
    .where(
      and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v0, userSubject),
        eq(casbinRule.v1, directResource)
      )
    )
    .limit(1);
  
  if (directPolicy) {
    return directPolicy.v2 ?? 'read';
  }
  
  // 2. 如果没有直接权限，按路径顺序检查祖先文件夹权限（从近到远）
  for (const ancestorId of ancestorFolderIds) {
    const ancestorResource = `folder:${ancestorId}`;
    const [ancestorPolicy] = await db
      .select({ v2: casbinRule.v2 })
      .from(casbinRule)
      .where(
        and(
          eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
          eq(casbinRule.v0, userSubject),
          eq(casbinRule.v1, ancestorResource)
        )
      )
      .limit(1);
    
    if (ancestorPolicy) {
      return ancestorPolicy.v2 ?? 'read';
    }
  }
  
  return null;
}

// ============ 获取共享文件夹的子内容 ============
export const fileShareGetFolderContents = defineAction({
  meta: {
    name: 'files.share.getFolderContents',
    displayName: '获取共享文件夹内容',
    description: '获取共享文件夹的子文件夹和文件，支持权限继承',
    tags: ['files', 'share'],
    method: 'POST',
    path: '/api/files/share/folder-contents',
  },
  schemas: {
    bodySchema: z.object({
      folderId: z.string(),
      viewMode: z.enum(['shared-with-me', 'my-shared', 'favorites']),
      limit: z.number().int().min(1).max(100).default(50),
      offset: z.number().int().min(0).default(0),
    }),
    outputSchema: z.object({
      folder: z.object({
        id: z.string(),
        name: z.string(),
        parentId: z.string().nullable(),
        permission: z.string().optional(),
      }).nullable(),
      folders: z.array(z.object({
        id: z.string(),
        name: z.string(),
        parentId: z.string().nullable(),
        icon: z.string().nullable(),
        color: z.string().nullable(),
        isPublic: z.boolean(),
        createdAt: z.string(),
        permission: z.string().optional(),
        sharedBy: z.string().nullable().optional(),
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
        permission: z.string().optional(),
        sharedBy: z.string().nullable().optional(),
      })),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { folderId, viewMode, limit, offset } = input;
    
    // Get the folder info
    const [folderInfo] = await db
      .select({ 
        id: folder.id, 
        name: folder.name, 
        parentId: folder.parentId,
        createdBy: folder.createdBy,
      })
      .from(folder)
      .where(eq(folder.id, folderId))
      .limit(1);
    
    if (!folderInfo) {
      return { folder: null, folders: [], files: [] };
    }
    
    // Get subfolders
    const subFolders = await db
      .select({
        id: folder.id,
        name: folder.name,
        parentId: folder.parentId,
        icon: folder.icon,
        color: folder.color,
        isPublic: folder.isPublic,
        createdAt: folder.createdAt,
        createdBy: folder.createdBy,
      })
      .from(folder)
      .where(eq(folder.parentId, folderId))
      .limit(limit)
      .offset(offset);
    
    // Get files in folder
    const folderFiles = await db
      .select({
        id: file.id,
        name: file.name,
        folderId: file.folderId,
        extension: file.extension,
        mimeType: file.mimeType,
        size: file.size,
        isPublic: file.isPublic,
        createdAt: file.createdAt,
        createdBy: file.createdBy,
      })
      .from(file)
      .where(eq(file.folderId, folderId))
      .limit(limit)
      .offset(offset);
    
    // 对于 shared-with-me 模式，需要计算权限继承
    if (viewMode === 'shared-with-me') {
      // 获取当前文件夹的祖先路径（用于权限继承）
      const ancestorPath = await getFolderAncestorPath(db, folderId);
      
      // 获取当前文件夹的权限
      const folderPermission = await getInheritedPermission(
        db, context.currentUserId, 'folder', folderId, ancestorPath.slice(1)
      );
      
      // 为每个子文件夹计算权限
      const foldersWithPermission = await Promise.all(
        subFolders.map(async (f) => {
          // 子文件夹的祖先路径 = 当前文件夹 + 当前文件夹的祖先
          const subFolderAncestors = [folderId, ...ancestorPath.slice(1)];
          const permission = await getInheritedPermission(
            db, context.currentUserId, 'folder', f.id, subFolderAncestors
          );
          return {
            id: f.id,
            name: f.name,
            parentId: f.parentId,
            icon: f.icon,
            color: f.color,
            isPublic: f.isPublic,
            createdAt: String(f.createdAt),
            permission: permission ?? folderPermission ?? 'read',
            sharedBy: f.createdBy,
          };
        })
      );
      
      // 为每个文件计算权限
      const filesWithPermission = await Promise.all(
        folderFiles.map(async (f) => {
          const permission = await getInheritedPermission(
            db, context.currentUserId, 'file', f.id, ancestorPath
          );
          return {
            id: f.id,
            name: f.name,
            folderId: f.folderId,
            extension: f.extension,
            mimeType: f.mimeType,
            size: f.size,
            isPublic: f.isPublic,
            createdAt: String(f.createdAt),
            permission: permission ?? folderPermission ?? 'read',
            sharedBy: f.createdBy,
          };
        })
      );
      
      return {
        folder: { 
          ...folderInfo, 
          permission: folderPermission ?? 'read',
        },
        folders: foldersWithPermission,
        files: filesWithPermission,
      };
    }
    
    // 对于其他模式，直接返回
    return {
      folder: folderInfo,
      folders: subFolders.map(f => ({
        id: f.id,
        name: f.name,
        parentId: f.parentId,
        icon: f.icon,
        color: f.color,
        isPublic: f.isPublic,
        createdAt: String(f.createdAt),
        sharedBy: f.createdBy,
      })),
      files: folderFiles.map(f => ({
        id: f.id,
        name: f.name,
        folderId: f.folderId,
        extension: f.extension,
        mimeType: f.mimeType,
        size: f.size,
        isPublic: f.isPublic,
        createdAt: String(f.createdAt),
        sharedBy: f.createdBy,
      })),
    };
  },
});

// ============ 获取文件夹路径 ============
export const fileShareGetFolderPath = defineAction({
  meta: {
    name: 'files.share.getFolderPath',
    displayName: '获取文件夹路径',
    description: '获取文件夹的完整路径（面包屑）',
    tags: ['files', 'share'],
    method: 'GET',
    path: '/api/files/share/folder-path/:folderId',
  },
  schemas: {
    paramsSchema: z.object({
      folderId: z.string(),
    }),
    outputSchema: z.object({
      path: z.array(z.object({
        id: z.string().nullable(),
        name: z.string(),
      })),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { folderId } = input;
    
    const path: Array<{ id: string | null; name: string }> = [];
    let currentId: string | null = folderId;
    
    while (currentId) {
      const [f] = await db
        .select({ id: folder.id, name: folder.name, parentId: folder.parentId })
        .from(folder)
        .where(eq(folder.id, currentId))
        .limit(1);
      
      if (!f) break;
      path.unshift({ id: f.id, name: f.name });
      currentId = f.parentId;
    }
    
    return { path };
  },
});

export const fileShareActions = [
  fileShareGetMyShared,
  fileShareGetSharedWithMe,
  fileShareGetFolderContents,
  fileShareGetFolderPath,
];
