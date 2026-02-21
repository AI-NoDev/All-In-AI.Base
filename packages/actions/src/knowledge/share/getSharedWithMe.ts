/**
 * 获取共享给我的资源 Action
 */

import { eq, and, isNull, inArray } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node, type NodeSelect } from '@qiyu-allinai/db/entities/knowledge';
import { casbinRule, CASBIN_POLICY_TYPES } from '@qiyu-allinai/db/entities/system';
import { parseResourceId } from '@qiyu-allinai/db/casbin';
import { sharedWithMeBodySchema, sharedWithMeOutputSchema } from './schemas';

export const shareGetSharedWithMe = defineAction({
  meta: {
    name: 'knowledge.share.getSharedWithMe',
    displayName: '获取共享给我的资源',
    description: `获取他人共享给当前用户的节点，支持文件夹层级浏览。

**请求体参数：**
- folderId: 文件夹ID，可选，用于浏览共享文件夹内容
- type: 节点类型筛选，可选 "folder" | "file"
- limit: 每页数量，默认50，最大100
- offset: 偏移量，默认0

**返回：**
- data: 共享项数组
  - node: 节点完整信息
  - permissions: 权限数组 ["read", "write", ...]
  - permissionSource: "direct" | "inherited"（权限来源）
  - sharedBy: 共享者信息 { userId, userName }
- total: 总数

**权限继承：**
- 进入共享文件夹后，子节点继承父节点权限
- 直接权限优先于继承权限

**使用场景：**
- "收到的共享"页面
- 浏览他人共享的文件夹

**示例：**
\`\`\`json
{
  "folderId": "shared-folder-uuid",
  "type": "file",
  "limit": 20
}
\`\`\``,
    tags: ['knowledge', 'share'],
    method: 'POST',
    path: '/api/knowledge/share/shared-with-me',
  },
  schemas: {
    bodySchema: sharedWithMeBodySchema,
    outputSchema: sharedWithMeOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const userSubject = `user:${context.currentUserId}`;
    
    // 如果指定了 folderId，获取该文件夹的子节点（带权限继承）
    if (input.folderId && input.folderId.trim() !== '') {
      // 获取文件夹信息
      const [folder] = await db.select().from(node)
        .where(and(eq(node.id, input.folderId), isNull(node.deletedAt)))
        .limit(1);
      
      if (!folder) {
        return { data: [], total: 0 };
      }
      
      // 获取用户对该文件夹及其祖先的所有权限
      const allPermissions = await db.select().from(casbinRule)
        .where(and(
          eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
          eq(casbinRule.v0, userSubject)
        ));
      
      // 构建祖先路径（包括当前文件夹）
      const ancestorIds = folder.materializedPath 
        ? folder.materializedPath.split('/').filter(Boolean)
        : [];
      const pathWithCurrent = [...ancestorIds, input.folderId];
      
      // 计算继承的权限（从当前节点向上查找，优先使用最近的权限）
      let inheritedPermissions: string[] = [];
      for (const ancestorId of pathWithCurrent.reverse()) {
        const perms = allPermissions
          .filter(p => parseResourceId(p.v1) === ancestorId && p.v2)
          .map(p => p.v2 as string);
        if (perms.length > 0) {
          inheritedPermissions = perms;
          break;
        }
      }
      
      // 如果没有任何权限，返回空
      if (inheritedPermissions.length === 0) {
        return { data: [], total: 0 };
      }
      
      // 获取子节点 - 使用 parentId 等于 folderId 来查询子节点
      const childConditions = [
        eq(node.parentId, input.folderId),
        isNull(node.deletedAt),
      ];
      
      if (input.type) {
        childConditions.push(eq(node.type, input.type));
      }
      
      const children = await db.select().from(node)
        .where(and(...childConditions))
        .limit(input.limit)
        .offset(input.offset);
      
      // 如果没有子节点，返回空数组（不是返回文件夹本身）
      if (children.length === 0) {
        return { data: [], total: 0 };
      }
      
      // 获取子节点的直接权限
      const childIds = children.map(c => c.id);
      const childResources = childIds.map(id => `node:${id}`);
      
      const childPermissions = await db.select().from(casbinRule)
        .where(and(
          eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
          eq(casbinRule.v0, userSubject),
          inArray(casbinRule.v1, childResources)
        ));
      
      // 按子节点分组直接权限
      const directPermMap = new Map<string, string[]>();
      for (const p of childPermissions) {
        const nodeId = parseResourceId(p.v1);
        if (!nodeId || !p.v2) continue;
        if (!directPermMap.has(nodeId)) {
          directPermMap.set(nodeId, []);
        }
        directPermMap.get(nodeId)?.push(p.v2);
      }
      
      // 构建返回数据，优先使用直接权限，否则使用继承权限
      const data = children.map(n => {
        const directPerms = directPermMap.get(n.id);
        const hasDirectPerm = directPerms && directPerms.length > 0;
        
        return {
          node: n as NodeSelect,
          permissions: hasDirectPerm ? directPerms : inheritedPermissions,
          permissionSource: hasDirectPerm ? 'direct' as const : 'inherited' as const,
          sharedBy: {
            userId: n.createdById,
            userName: n.createdBy,
          },
        };
      });
      
      return { data, total: data.length };
    }
    
    // 根级别：获取直接共享给当前用户的权限
    const permissions = await db.select().from(casbinRule)
      .where(and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        eq(casbinRule.v0, userSubject)
      ));
    
    if (permissions.length === 0) {
      return { data: [], total: 0 };
    }
    
    // 提取节点ID和权限
    const nodePermissions = new Map<string, string[]>();
    
    for (const p of permissions) {
      const nodeId = parseResourceId(p.v1);
      if (!nodeId) continue;
      
      if (!nodePermissions.has(nodeId)) {
        nodePermissions.set(nodeId, []);
      }
      if (p.v2) {
        nodePermissions.get(nodeId)?.push(p.v2);
      }
    }
    
    const nodeIds = Array.from(nodePermissions.keys());
    
    // 如果没有节点ID，直接返回空
    if (nodeIds.length === 0) {
      return { data: [], total: 0 };
    }
    
    // 获取节点详情（排除自己创建的）
    const conditions = [
      inArray(node.id, nodeIds),
      isNull(node.deletedAt),
    ];
    
    if (input.type) {
      conditions.push(eq(node.type, input.type));
    }
    
    const nodes = await db.select().from(node)
      .where(and(...conditions))
      .limit(input.limit)
      .offset(input.offset);
    
    // 过滤掉自己创建的节点
    const sharedNodes = nodes.filter(n => n.createdById !== context.currentUserId);
    
    const data = sharedNodes.map(n => ({
      node: n as NodeSelect,
      permissions: nodePermissions.get(n.id) || [],
      permissionSource: 'direct' as const,
      sharedBy: {
        userId: n.createdById,
        userName: n.createdBy,
      },
    }));
    
    return { data, total: data.length };
  },
});
