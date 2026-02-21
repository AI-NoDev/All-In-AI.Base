/**
 * 恢复历史版本 Action
 */

import { eq, and, isNull } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { ActionError } from '../../core/errors';
import { node, nodeVersion, type NodeSelect, type NodeVersionInsert } from '@qiyu-allinai/db/entities/knowledge';
import { assertNodePermission } from '../utils';
import { DEFAULT_BUCKET } from '../../files/s3Client';
import { versionIdParamsSchema, nodeZodSchemas } from './schemas';

export const versionRestore = defineAction({
  meta: {
    name: 'knowledge.version.restore',
    displayName: '恢复历史版本',
    description: `将历史版本恢复为当前版本。

**路径参数：**
- id: 版本记录UUID

**权限检查：**
- 需要对关联的文件节点有 write 权限

**行为：**
1. 将当前文件保存为新版本（保留历史）
2. 将历史版本的存储信息更新到主节点
3. 增加版本计数

**返回：**
- 更新后的文件节点完整信息

**示例：**
POST /api/knowledge/versions/version-uuid/restore`,
    tags: ['knowledge', 'version'],
    method: 'POST',
    path: '/api/knowledge/versions/:id/restore',
  },
  schemas: {
    paramsSchema: versionIdParamsSchema,
    outputSchema: nodeZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    const [versionRecord] = await db.select().from(nodeVersion)
      .where(eq(nodeVersion.id, input.id))
      .limit(1);

    if (!versionRecord) {
      throw ActionError.notFound('error.knowledge.versionNotFound');
    }

    const [nodeRecord] = await db.select().from(node)
      .where(and(eq(node.id, versionRecord.nodeId), isNull(node.deletedAt)))
      .limit(1);

    if (!nodeRecord) {
      throw ActionError.notFound('error.knowledge.nodeNotFound');
    }

    await assertNodePermission(db, context.currentUserId, nodeRecord, 'write');

    // 获取当前最大版本号
    const existingVersions = await db.select({ versionNumber: nodeVersion.versionNumber })
      .from(nodeVersion)
      .where(eq(nodeVersion.nodeId, nodeRecord.id));

    let maxVersion = 0;
    for (const v of existingVersions) {
      const num = parseInt(v.versionNumber.replace('v', ''), 10);
      if (!isNaN(num) && num > maxVersion) maxVersion = num;
    }
    const newVersionNumber = `v${maxVersion + 1}`;

    // 将当前文件保存为新版本
    if (nodeRecord.storageKey) {
      await db.insert(nodeVersion).values({
        nodeId: nodeRecord.id,
        versionNumber: newVersionNumber,
        storageKey: nodeRecord.storageKey,
        bucket: nodeRecord.bucket || DEFAULT_BUCKET,
        s3VersionId: nodeRecord.versionId,
        etag: nodeRecord.etag,
        size: nodeRecord.size,
        changeLog: `恢复到 ${versionRecord.versionNumber}`,
        createdById: context.currentUserId,
        createdBy: context.currentUserName,
      } as NodeVersionInsert);
    }

    // 将历史版本的S3字段更新到主节点
    const [result] = await db.update(node)
      .set({
        storageKey: versionRecord.storageKey,
        bucket: versionRecord.bucket,
        versionId: versionRecord.s3VersionId,
        etag: versionRecord.etag,
        size: versionRecord.size,
        versionCount: (nodeRecord.versionCount || 0) + 1,
        updatedBy: context.currentUserName,
        updatedById: context.currentUserId,
      })
      .where(eq(node.id, nodeRecord.id))
      .returning();

    return result as NodeSelect;
  },
});
