/**
 * 知识库权限管理工具函数
 */

import { eq, and, isNull } from 'drizzle-orm';
import { ActionError } from '../../core/errors';
import type { DrizzleDB } from '../../core/types';
import { KnowledgePermissionAdapter } from '@qiyu-allinai/db/casbin';
import { node } from '@qiyu-allinai/db/entities/knowledge';

/**
 * 检查是否可以管理权限
 */
export async function assertCanManagePermission(
  db: DrizzleDB,
  adapter: KnowledgePermissionAdapter,
  userId: string,
  nodeId: string
): Promise<void> {
  const [nodeRecord] = await db.select({ createdById: node.createdById })
    .from(node)
    .where(and(eq(node.id, nodeId), isNull(node.deletedAt)))
    .limit(1);
  
  if (nodeRecord?.createdById === userId) return;
  
  const hasManage = await adapter.checkPermission(userId, nodeId, 'manage');
  if (!hasManage) {
    throw ActionError.forbidden('error.knowledge.permissionDenied');
  }
}
