/**
 * 知识库文件上传 Actions
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeVersion, nodeZodSchemas, NODE_TYPES, type NodeSelect, type NodeInsert, type NodeVersionInsert } from '@qiyu-allinai/db/entities/knowledge';
import { buildPath, buildMaterializedPath, assertNodePermission, parseFileName, generateUniqueName } from '../utils';

// S3 客户端导入（复用现有的）
import {
  uploadFile,
  getPresignedUploadUrl,
  generateStorageKey,
  DEFAULT_BUCKET,
} from '../../files/s3Client';

// ============ 获取上传URL ============
export const uploadGetUrl = defineAction({
  meta: {
    name: 'knowledge.upload.getUrl',
    displayName: '获取上传URL',
    description: '获取预签名上传URL',
    tags: ['knowledge', 'upload'],
    method: 'POST',
    path: '/api/knowledge/upload/url',
  },
  schemas: {
    bodySchema: z.object({
      parentId: z.string().nullable().optional(),
      filename: z.string().min(1).max(255),
      mimeType: z.string(),
    }),
    outputSchema: z.object({
      uploadUrl: z.string(),
      storageKey: z.string(),
      expiresAt: z.string(),
    }),
  },
  execute: async (input, context) => {
    const storageKey = generateStorageKey(context.currentUserId, input.parentId || null, input.filename);
    const { url, expiresAt } = await getPresignedUploadUrl(storageKey, input.mimeType);

    return {
      uploadUrl: url,
      storageKey,
      expiresAt: expiresAt.toISOString(),
    };
  },
});

// ============ 确认上传完成 ============
export const uploadConfirm = defineAction({
  meta: {
    name: 'knowledge.upload.confirm',
    displayName: '确认上传',
    description: '确认文件上传完成并创建节点',
    tags: ['knowledge', 'upload'],
    method: 'POST',
    path: '/api/knowledge/upload/confirm',
  },
  schemas: {
    bodySchema: z.object({
      parentId: z.string().nullable().optional(),
      name: z.string().min(1).max(255),
      storageKey: z.string(),
      mimeType: z.string(),
      size: z.number(),
      description: z.string().optional(),
    }),
    outputSchema: nodeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const { baseName, extension } = parseFileName(input.name);
    
    let path = '/';
    let materializedPath = '';
    
    if (input.parentId) {
      const [parent] = await db.select().from(node)
        .where(and(eq(node.id, input.parentId), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FOLDER)))
        .limit(1);
      
      if (!parent) {
        throw ActionError.notFound('error.knowledge.parentNotFound');
      }
      
      await assertNodePermission(db, context.currentUserId, parent, 'write');
      
      path = buildPath(parent.path, parent.name);
      materializedPath = buildMaterializedPath(parent.materializedPath, parent.id);
    }

    const [result] = await db.insert(node).values({
      type: NODE_TYPES.FILE,
      parentId: input.parentId || null,
      name: input.name,
      path,
      materializedPath,
      originalName: input.name,
      extension,
      mimeType: input.mimeType,
      size: input.size,
      storageKey: input.storageKey,
      bucket: DEFAULT_BUCKET,
      description: input.description,
      createdBy: context.currentUserName,
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    } as NodeInsert).returning();

    return result as NodeSelect;
  },
});

// ============ 直接上传（小文件） ============
export const uploadDirect = defineAction({
  meta: {
    name: 'knowledge.upload.direct',
    displayName: '直接上传',
    description: '直接上传小文件（Base64）',
    tags: ['knowledge', 'upload'],
    method: 'POST',
    path: '/api/knowledge/upload/direct',
  },
  schemas: {
    bodySchema: z.object({
      parentId: z.string().nullable().optional(),
      name: z.string().min(1).max(255),
      content: z.string(), // Base64
      mimeType: z.string().optional(),
      description: z.string().optional(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      node: nodeZodSchemas.select.optional(),
      conflict: z.object({
        nodeId: z.string(),
        name: z.string(),
        size: z.number(),
        updatedAt: z.string(),
      }).optional(),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const parentId = input.parentId || null;
    const { baseName, extension } = parseFileName(input.name);
    
    // 检查是否存在同名文件
    const parentCondition = parentId === null 
      ? isNull(node.parentId) 
      : eq(node.parentId, parentId);
    
    const [existingNode] = await db.select().from(node)
      .where(and(
        parentCondition, 
        eq(node.name, input.name), 
        eq(node.type, NODE_TYPES.FILE),
        isNull(node.deletedAt)
      ))
      .limit(1);
    
    if (existingNode) {
      return {
        success: false,
        conflict: {
          nodeId: existingNode.id,
          name: existingNode.name,
          size: existingNode.size,
          updatedAt: existingNode.updatedAt,
        },
      };
    }
    
    let path = '/';
    let materializedPath = '';
    
    if (parentId) {
      const [parent] = await db.select().from(node)
        .where(and(eq(node.id, parentId), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FOLDER)))
        .limit(1);
      
      if (parent) {
        path = buildPath(parent.path, parent.name);
        materializedPath = buildMaterializedPath(parent.materializedPath, parent.id);
      }
    }
    
    const buffer = Buffer.from(input.content, 'base64');
    const mimeType = input.mimeType || 'application/octet-stream';
    const storageKey = generateStorageKey(context.currentUserId, parentId, input.name);

    const uploadResult = await uploadFile(storageKey, buffer, mimeType);

    const [result] = await db.insert(node).values({
      type: NODE_TYPES.FILE,
      parentId,
      name: input.name,
      path,
      materializedPath,
      originalName: input.name,
      extension,
      mimeType,
      size: buffer.length,
      storageKey,
      bucket: uploadResult.bucket,
      etag: uploadResult.etag,
      versionId: uploadResult.versionId,
      description: input.description,
      createdBy: context.currentUserName,
      createdById: context.currentUserId,
      updatedBy: context.currentUserName,
      updatedById: context.currentUserId,
    } as NodeInsert).returning();

    return { success: true, node: result as NodeSelect };
  },
});

// ============ 强制上传（处理冲突） ============
export const uploadForce = defineAction({
  meta: {
    name: 'knowledge.upload.force',
    displayName: '强制上传',
    description: '上传文件并处理冲突（覆盖/新版本/副本）',
    tags: ['knowledge', 'upload'],
    method: 'POST',
    path: '/api/knowledge/upload/force',
  },
  schemas: {
    bodySchema: z.object({
      parentId: z.string().nullable().optional(),
      name: z.string().min(1).max(255),
      content: z.string(), // Base64
      mimeType: z.string().optional(),
      description: z.string().optional(),
      conflictMode: z.enum(['overwrite', 'newVersion', 'copy']),
      existingNodeId: z.string().optional(),
    }),
    outputSchema: nodeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const parentId = input.parentId || null;
    const buffer = Buffer.from(input.content, 'base64');
    const { baseName, extension } = parseFileName(input.name);
    const mimeType = input.mimeType || 'application/octet-stream';
    
    if (input.conflictMode === 'overwrite') {
      if (!input.existingNodeId) {
        throw ActionError.badRequest('error.knowledge.existingNodeIdRequired');
      }
      
      const [existingNode] = await db.select().from(node)
        .where(and(eq(node.id, input.existingNodeId), isNull(node.deletedAt)))
        .limit(1);
      
      if (!existingNode) {
        throw ActionError.notFound('error.knowledge.nodeNotFound');
      }

      await assertNodePermission(db, context.currentUserId, existingNode, 'write');
      
      const storageKey = generateStorageKey(context.currentUserId, existingNode.parentId, input.name);
      const uploadResult = await uploadFile(storageKey, buffer, mimeType);
      
      const [result] = await db.update(node)
        .set({
          storageKey,
          bucket: uploadResult.bucket,
          etag: uploadResult.etag,
          versionId: uploadResult.versionId,
          size: buffer.length,
          mimeType,
          name: input.name,
          extension,
          updatedBy: context.currentUserName,
          updatedById: context.currentUserId,
        })
        .where(eq(node.id, input.existingNodeId))
        .returning();
      
      return result as NodeSelect;
      
    } else if (input.conflictMode === 'newVersion') {
      if (!input.existingNodeId) {
        throw ActionError.badRequest('error.knowledge.existingNodeIdRequired');
      }
      
      const [existingNode] = await db.select().from(node)
        .where(and(eq(node.id, input.existingNodeId), isNull(node.deletedAt)))
        .limit(1);
      
      if (!existingNode) {
        throw ActionError.notFound('error.knowledge.nodeNotFound');
      }

      await assertNodePermission(db, context.currentUserId, existingNode, 'write');
      
      // 保存当前版本
      const existingVersions = await db.select({ versionNumber: nodeVersion.versionNumber })
        .from(nodeVersion)
        .where(eq(nodeVersion.nodeId, input.existingNodeId));
      
      let maxVersion = 0;
      for (const v of existingVersions) {
        const num = parseInt(v.versionNumber.replace('v', ''), 10);
        if (!isNaN(num) && num > maxVersion) maxVersion = num;
      }
      
      if (existingNode.storageKey) {
        await db.insert(nodeVersion).values({
          nodeId: existingNode.id,
          versionNumber: maxVersion === 0 ? 'v1' : `v${maxVersion}`,
          storageKey: existingNode.storageKey,
          bucket: existingNode.bucket || DEFAULT_BUCKET,
          s3VersionId: existingNode.versionId,
          etag: existingNode.etag,
          size: existingNode.size,
          createdById: context.currentUserId,
          createdBy: context.currentUserName,
        } as NodeVersionInsert);
      }
      
      const storageKey = generateStorageKey(context.currentUserId, parentId, input.name);
      const uploadResult = await uploadFile(storageKey, buffer, mimeType);
      
      const [result] = await db.update(node)
        .set({
          storageKey,
          bucket: uploadResult.bucket,
          etag: uploadResult.etag,
          versionId: uploadResult.versionId,
          size: buffer.length,
          mimeType,
          versionCount: (existingNode.versionCount || 0) + 1,
          updatedBy: context.currentUserName,
          updatedById: context.currentUserId,
        })
        .where(eq(node.id, input.existingNodeId))
        .returning();
      
      return result as NodeSelect;
      
    } else {
      // copy mode
      const parentCondition = parentId === null 
        ? isNull(node.parentId) 
        : eq(node.parentId, parentId);
      
      const existingNodes = await db.select({ name: node.name })
        .from(node)
        .where(and(parentCondition, isNull(node.deletedAt)));
      
      const existingNames = new Set(existingNodes.map(n => n.name));
      const newName = generateUniqueName(baseName, extension, existingNames);
      
      let path = '/';
      let materializedPath = '';
      
      if (parentId) {
        const [parent] = await db.select().from(node)
          .where(and(eq(node.id, parentId), isNull(node.deletedAt), eq(node.type, NODE_TYPES.FOLDER)))
          .limit(1);
        
        if (parent) {
          path = buildPath(parent.path, parent.name);
          materializedPath = buildMaterializedPath(parent.materializedPath, parent.id);
        }
      }
      
      const storageKey = generateStorageKey(context.currentUserId, parentId, newName);
      const uploadResult = await uploadFile(storageKey, buffer, mimeType);
      
      const [result] = await db.insert(node).values({
        type: NODE_TYPES.FILE,
        parentId,
        name: newName,
        path,
        materializedPath,
        originalName: input.name,
        extension,
        mimeType,
        size: buffer.length,
        storageKey,
        bucket: uploadResult.bucket,
        etag: uploadResult.etag,
        versionId: uploadResult.versionId,
        description: input.description,
        createdBy: context.currentUserName,
        createdById: context.currentUserId,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      } as NodeInsert).returning();
      
      return result as NodeSelect;
    }
  },
});

export const uploadActions = [
  uploadGetUrl,
  uploadConfirm,
  uploadDirect,
  uploadForce,
];
