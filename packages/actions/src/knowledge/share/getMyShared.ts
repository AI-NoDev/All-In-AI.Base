/**
 * 获取我共享的资源 Action
 */

import { eq, and, isNull, inArray } from 'drizzle-orm';
import { defineAction } from '../../core/define';
import { node, type NodeSelect } from '@qiyu-allinai/db/entities/knowledge';
import { casbinRule, CASBIN_POLICY_TYPES } from '@qiyu-allinai/db/entities/system';
import { parseSubject, parseResourceId } from '@qiyu-allinai/db/casbin';
import { shareQueryBodySchema, mySharedOutputSchema } from './schemas';

export const shareGetMyShared = defineAction({
  meta: {
    name: 'knowledge.share.getMyShared',
    displayName: '获取我共享的资源',
    description: `获取当前用户共享给他人的节点列表。

**请求体参数：**
- type: 节点类型筛选，可选 "folder" | "file"
- limit: 每页数量，默认50，最大100
- offset: 偏移量，默认0

**返回：**
- data: 共享项数组
  - node: 节点完整信息
  - sharedTo: 共享对象数组
    - subjectType: "user" | "role" | "dept"
    - subjectId: 对象ID
    - permission: 权限级别
- total: 总数

**使用场景：**
- "我的共享"页面
- 管理已共享的文件

**示例：**
\`\`\`json
{
  "type": "file",
  "limit": 20
}
\`\`\``,
    tags: ['knowledge', 'share'],
    method: 'POST',
    path: '/api/knowledge/share/my-shared',
  },
  schemas: {
    bodySchema: shareQueryBodySchema,
    outputSchema: mySharedOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    // 获取当前用户创建的节点
    const conditions = [
      eq(node.createdById, context.currentUserId),
      isNull(node.deletedAt),
    ];
    
    if (input.type) {
      conditions.push(eq(node.type, input.type));
    }
    
    const myNodes = await db.select().from(node)
      .where(and(...conditions))
      .limit(input.limit)
      .offset(input.offset);
    
    if (myNodes.length === 0) {
      return { data: [], total: 0 };
    }
    
    // 获取这些节点的共享权限
    const nodeIds = myNodes.map(n => n.id);
    const resources = nodeIds.map(id => `node:${id}`);
    
    const permissions = await db.select().from(casbinRule)
      .where(and(
        eq(casbinRule.ptype, CASBIN_POLICY_TYPES.POLICY),
        inArray(casbinRule.v1, resources)
      ));
    
    // 按节点分组权限
    const permissionMap = new Map<string, Array<{ subjectType: string; subjectId: string; permission: string }>>();
    
    for (const p of permissions) {
      const nodeId = parseResourceId(p.v1);
      const subject = parseSubject(p.v0 || '');
      if (!nodeId || !subject) continue;
      
      // 排除自己
      if (subject.type === 'user' && subject.id === context.currentUserId) continue;
      
      if (!permissionMap.has(nodeId)) {
        permissionMap.set(nodeId, []);
      }
      permissionMap.get(nodeId)?.push({
        subjectType: subject.type,
        subjectId: subject.id,
        permission: p.v2 || '',
      });
    }
    
    // 只返回有共享的节点
    const data = myNodes
      .filter(n => permissionMap.has(n.id) && (permissionMap.get(n.id)?.length ?? 0) > 0)
      .map(n => ({
        node: n as NodeSelect,
        sharedTo: permissionMap.get(n.id) || [],
      }));
    
    return { data, total: data.length };
  },
});
