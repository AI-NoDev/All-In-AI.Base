/**
 * 文件版本相关 Actions
 */

import { z } from 'zod';
import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../core/define';
import { ActionError } from '../core/errors';
import { file, fileZodSchemas, fileVersion } from '@qiyu-allinai/db/entities/knowledge';
import { getPresignedDownloadUrl } from './s3Client';
import { assertResourcePermission } from './utils';

type FileSelect = typeof file.$inferSelect;
type FileVersionInsert = typeof fileVersion.$inferInsert;

// ============ 下载历史版本 ============
export const fileVersionDownload = defineAction({
  meta: {
    name: 'files.versionDownload',
    displayName: '下载历史版本',
    description: '获取历史版本的下载URL',
    tags: ['files', 'files'],
    method: 'GET',
    path: '/api/files/versions/:id/download-url',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: z.object({
      url: z.string(),
      expiresAt: z.string(),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const [versionRecord] = await db.select().from(fileVersion)
      .where(eq(fileVersion.id, input.id))
      .limit(1);

    if (!versionRecord) {
      throw ActionError.notFound('error.files.versionNotFound');
    }

    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, versionRecord.fileId), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw ActionError.notFound('error.files.notFound');
    }

    // 检查文件读取权限
    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'read');

    const baseName = fileRecord.originalName.replace(/\.[^.]+$/, '');
    const ext = fileRecord.extension ? `.${fileRecord.extension}` : '';
    const downloadName = `${baseName}_${versionRecord.versionNumber}${ext}`;

    const { url, expiresAt } = await getPresignedDownloadUrl(
      versionRecord.storageKey,
      versionRecord.bucket,
      3600,
      downloadName
    );

    return { url, expiresAt: expiresAt.toISOString() };
  },
});


// ============ 恢复历史版本 ============
export const fileVersionRestore = defineAction({
  meta: {
    name: 'files.versionRestore',
    displayName: '恢复历史版本',
    description: '将历史版本恢复为当前版本（交换S3字段）',
    tags: ['files', 'files'],
    method: 'POST',
    path: '/api/files/versions/:id/restore',
  },
  schemas: {
    paramsSchema: z.object({ id: z.string() }),
    outputSchema: fileZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [versionRecord] = await db.select().from(fileVersion)
      .where(eq(fileVersion.id, input.id))
      .limit(1);

    if (!versionRecord) {
      throw ActionError.notFound('error.files.versionNotFound');
    }

    const [fileRecord] = await db.select().from(file)
      .where(and(eq(file.id, versionRecord.fileId), isNull(file.deletedAt)))
      .limit(1);

    if (!fileRecord) {
      throw ActionError.notFound('error.files.notFound');
    }

    // 检查文件写入权限（恢复版本需要写入权限）
    await assertResourcePermission(db, context.currentUserId, 'file', fileRecord, 'write');

    const existingVersions = await db.select({ versionNumber: fileVersion.versionNumber })
      .from(fileVersion)
      .where(eq(fileVersion.fileId, fileRecord.id));

    let maxVersion = 0;
    for (const v of existingVersions) {
      const num = parseInt(v.versionNumber.replace('v', ''), 10);
      if (!isNaN(num) && num > maxVersion) maxVersion = num;
    }
    const newVersionNumber = `v${maxVersion + 1}`;

    // 将当前文件保存为新版本
    await db.insert(fileVersion).values({
      fileId: fileRecord.id,
      versionNumber: newVersionNumber,
      storageKey: fileRecord.storageKey,
      bucket: fileRecord.bucket,
      s3VersionId: fileRecord.versionId,
      etag: fileRecord.etag,
      size: fileRecord.size,
      changeLog: `恢复到 ${versionRecord.versionNumber}`,
      createdById: context.currentUserId,
      createdBy: context.currentUserName,
    } as FileVersionInsert);

    // 将历史版本的S3字段更新到主文件
    const [result] = await db.update(file)
      .set({
        storageKey: versionRecord.storageKey,
        bucket: versionRecord.bucket,
        versionId: versionRecord.s3VersionId,
        etag: versionRecord.etag,
        size: versionRecord.size,
        versionCount: (fileRecord.versionCount || 0) + 1,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(file.id, fileRecord.id))
      .returning();

    return result as FileSelect;
  },
});

export const fileVersionActions = [
  fileVersionDownload,
  fileVersionRestore,
];
