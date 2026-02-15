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

export const fileShareActions = [
  fileShareGetMyShared,
  fileShareGetSharedWithMe,
];
