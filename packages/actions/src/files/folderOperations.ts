/**
 * 文件夹操作相关 Actions
 */

import { z } from 'zod';
import { eq, and, isNull, like, inArray } from 'drizzle-orm';
import { defineAction } from '../core/define';
import { ActionError } from '../core/errors';
import { file, folder, folderZodSchemas } from '@qiyu-allinai/db/entities/knowledge';
import { assertResourcePermission } from './utils';

type FolderSelect = typeof folder.$inferSelect;
type FolderInsert = typeof folder.$inferInsert;

// ============ 创建文件夹 ============
export const filesFolderCreate = defineAction({
  meta: {
    name: 'files.folderCreate',
    displayName: '创建文件夹',
    description: '创建新文件夹',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/folders',
  },
  schemas: {
    bodySchema: z.object({
      parentId: z.string().nullable().optional(),
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      icon: z.string().optional(),
      color: z.string().optional(),
    }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    let path = '/';
    if (input.parentId) {
      const [parent] = await db.select().from(folder)
        .where(and(eq(folder.id, input.parentId), isNull(folder.deletedAt)))
        .limit(1);
      if (parent) {
        path = `${parent.path}${parent.name}/`;
      }
    }

    const [result] = await db.insert(folder).values({
      parentId: input.parentId || null,
      name: input.name,
      path,
      description: input.description,
      icon: input.icon,
      color: input.color,
      createdBy: context.currentUserName,
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    } as FolderInsert).returning();

    return result as FolderSelect;
  },
});

// ============ 重命名文件夹 ============
export const filesFolderRename = defineAction({
  meta: {
    name: 'files.folderRename',
    displayName: '重命名文件夹',
    description: '重命名文件夹',
    tags: ['files', 'files'],
    method: 'PUT',
    path: '/api/files/folders/:id/rename',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ name: z.string().min(1).max(255) }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [folderRecord] = await db.select().from(folder)
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .limit(1);

    if (!folderRecord) {
      throw ActionError.notFound('error.files.folderNotFound');
    }

    await assertResourcePermission(db, context.currentUserId, 'folder', folderRecord, 'write');

    const [result] = await db.update(folder)
      .set({
        name: input.name,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(folder.id, input.id))
      .returning();

    return result as FolderSelect;
  },
});

// ============ 更新文件夹样式 ============
export const filesFolderUpdateStyle = defineAction({
  meta: {
    name: 'files.folderUpdateStyle',
    displayName: '更新文件夹样式',
    description: '更新文件夹图标和颜色',
    tags: ['files', 'files'],
    method: 'PUT',
    path: '/api/files/folders/:id/style',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({
      icon: z.string().nullable().optional(),
      color: z.string().nullable().optional(),
    }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [folderRecord] = await db.select().from(folder)
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .limit(1);

    if (!folderRecord) {
      throw ActionError.notFound('error.files.folderNotFound');
    }

    await assertResourcePermission(db, context.currentUserId, 'folder', folderRecord, 'write');

    const [result] = await db.update(folder)
      .set({
        icon: input.icon,
        color: input.color,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .returning();

    if (!result) {
      throw ActionError.notFound('error.files.folderNotFound');
    }

    return result as FolderSelect;
  },
});

// ============ 更新文件夹描述 ============
export const filesFolderUpdateDescription = defineAction({
  meta: {
    name: 'files.folderUpdateDescription',
    displayName: '更新文件夹描述',
    description: '更新文件夹描述信息',
    tags: ['files', 'files'],
    method: 'PUT',
    path: '/api/files/folders/:id/description',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ description: z.string().nullable() }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [folderRecord] = await db.select().from(folder)
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .limit(1);

    if (!folderRecord) {
      throw ActionError.notFound('error.files.folderNotFound');
    }

    await assertResourcePermission(db, context.currentUserId, 'folder', folderRecord, 'write');

    const [result] = await db.update(folder)
      .set({
        description: input.description,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(folder.id, input.id))
      .returning();

    return result as FolderSelect;
  },
});

// ============ 更新文件夹排序 ============
export const filesFolderUpdateOrder = defineAction({
  meta: {
    name: 'files.folderUpdateOrder',
    displayName: '更新文件夹排序',
    description: '更新文件夹排序',
    tags: ['files', 'files'],
    method: 'PUT',
    path: '/api/files/folders/:id/order',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ orderNum: z.number().int() }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [folderRecord] = await db.select().from(folder)
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .limit(1);

    if (!folderRecord) {
      throw ActionError.notFound('error.files.folderNotFound');
    }

    await assertResourcePermission(db, context.currentUserId, 'folder', folderRecord, 'write');

    const [result] = await db.update(folder)
      .set({
        orderNum: input.orderNum,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(folder.id, input.id))
      .returning();

    return result as FolderSelect;
  },
});

// ============ 删除文件夹 ============
export const filesFolderDelete = defineAction({
  meta: {
    name: 'files.folderDelete',
    displayName: '删除文件夹',
    description: '软删除文件夹及其内容',
    tags: ['files', 'files'],
    method: 'DELETE',
    path: '/api/files/folders/:id',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.boolean(),
  },
  execute: async (input, context) => {
    const { db } = context;
    const now = new Date().toISOString();

    const [currentFolder] = await db.select()
      .from(folder)
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .limit(1);

    if (!currentFolder) {
      return false;
    }

    await assertResourcePermission(db, context.currentUserId, 'folder', currentFolder, 'delete');

    const pathPrefix = `${currentFolder.path}${currentFolder.name}/`;

    // 软删除当前文件夹
    await db.update(folder)
      .set({
        deletedAt: now,
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(eq(folder.id, input.id));

    // 软删除当前文件夹内的文件
    await db.update(file)
      .set({
        deletedAt: now,
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(and(eq(file.folderId, input.id), isNull(file.deletedAt)));

    // 通过 path like 批量软删除所有子文件夹
    await db.update(folder)
      .set({
        deletedAt: now,
        deletedById: context.currentUserId,
        deletedBy: context.currentUserName,
      })
      .where(and(like(folder.path, `${pathPrefix}%`), isNull(folder.deletedAt)));

    // 通过子文件夹ID批量软删除所有子文件
    const subFolderIds = await db.select({ id: folder.id })
      .from(folder)
      .where(like(folder.path, `${pathPrefix}%`));
    
    if (subFolderIds.length > 0) {
      await db.update(file)
        .set({
          deletedAt: now,
          deletedById: context.currentUserId,
          deletedBy: context.currentUserName,
        })
        .where(and(
          inArray(file.folderId, subFolderIds.map(f => f.id)),
          isNull(file.deletedAt)
        ));
    }

    return true;
  },
});

// ============ 移动文件夹 ============
export const filesFolderMove = defineAction({
  meta: {
    name: 'files.folderMove',
    displayName: '移动文件夹',
    description: '移动文件夹到目标位置',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/folders/:id/move',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    bodySchema: z.object({ targetParentId: z.string().nullable() }),
    outputSchema: folderZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    if (input.targetParentId === input.id) {
      throw ActionError.badRequest('error.files.cannotMoveToSelf');
    }

    const [folderRecord] = await db.select().from(folder)
      .where(and(eq(folder.id, input.id), isNull(folder.deletedAt)))
      .limit(1);

    if (!folderRecord) {
      throw ActionError.notFound('error.files.folderNotFound');
    }

    await assertResourcePermission(db, context.currentUserId, 'folder', folderRecord, 'write');

    let newPath = '/';
    if (input.targetParentId) {
      const [parent] = await db.select().from(folder)
        .where(and(eq(folder.id, input.targetParentId), isNull(folder.deletedAt)))
        .limit(1);
      if (parent) {
        newPath = `${parent.path}${parent.name}/`;
      }
    }

    const [result] = await db.update(folder)
      .set({
        parentId: input.targetParentId,
        path: newPath,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(folder.id, input.id))
      .returning();

    return result as FolderSelect;
  },
});

export const folderOperationsActions = [
  filesFolderCreate,
  filesFolderRename,
  filesFolderUpdateStyle,
  filesFolderUpdateDescription,
  filesFolderUpdateOrder,
  filesFolderDelete,
  filesFolderMove,
];
