/**
 * 知识库权限管理 Schemas
 */

import { z } from 'zod';

// ============ 基础类型 Schemas ============
export const subjectTypeSchema = z.enum(['user', 'role', 'dept']).describe('主体类型：user=用户，role=角色，dept=部门');
export const permissionSchema = z.enum(['read', 'write', 'delete', 'manage']).describe('权限类型：read=读取，write=写入，delete=删除，manage=管理');
export const effectSchema = z.enum(['allow', 'deny']).describe('权限效果：allow=允许，deny=拒绝');

// ============ 权限条目 Schema ============
export const permissionEntrySchema = z.object({
  subjectType: subjectTypeSchema,
  subjectId: z.string().describe('主体 ID'),
  permission: permissionSchema,
  effect: effectSchema.default('allow'),
});

// ============ 有效权限 Schema ============
export const effectivePermissionSchema = z.object({
  permission: permissionSchema,
  effect: effectSchema,
  source: z.enum(['direct', 'inherited', 'role', 'dept']).describe('权限来源：direct=直接授权，inherited=继承，role=角色，dept=部门'),
  sourceId: z.string().optional().describe('来源 ID'),
});

// ============ 参数 Schemas ============
export const nodeIdParamsSchema = z.object({
  id: z.string().describe('节点 ID'),
});

export const removePermissionParamsSchema = z.object({
  id: z.string().describe('节点 ID'),
  subjectType: subjectTypeSchema,
  subjectId: z.string().describe('主体 ID'),
});

// ============ 请求体 Schemas ============
export const setPermissionsBodySchema = z.object({
  permissions: z.array(permissionEntrySchema).describe('权限条目列表'),
});

export const quickShareBodySchema = z.object({
  userIds: z.array(z.string().describe('用户 ID')).describe('目标用户 ID 列表'),
  level: z.enum(['read', 'edit', 'full']).describe('共享级别：read=只读，edit=可编辑，full=完全控制'),
});

export const revokeShareBodySchema = z.object({
  userIds: z.array(z.string().describe('用户 ID')).describe('要撤销共享的用户 ID 列表'),
});

// ============ 查询参数 Schemas ============
export const removePermissionQuerySchema = z.object({
  permission: permissionSchema.optional().describe('要移除的特定权限，不指定则移除所有'),
}).optional();

export const effectivePermissionQuerySchema = z.object({
  userId: z.string().optional().describe('用户 ID，不指定则查询当前用户'),
}).optional();

// ============ 输出 Schemas ============
export const successOutputSchema = z.object({
  success: z.boolean().describe('操作是否成功'),
});

export const permissionsOutputSchema = z.object({
  permissions: z.array(z.object({
    subjectType: subjectTypeSchema,
    subjectId: z.string().describe('主体 ID'),
    resourceId: z.string().describe('资源 ID'),
    permission: permissionSchema,
    effect: effectSchema,
  })).describe('权限列表'),
});

export const effectivePermissionsOutputSchema = z.object({
  data: z.array(effectivePermissionSchema).describe('有效权限列表'),
});

export const quickShareOutputSchema = z.object({
  success: z.boolean().describe('操作是否成功'),
  sharedCount: z.number().describe('成功共享的用户数'),
});

export const revokeShareOutputSchema = z.object({
  success: z.boolean().describe('操作是否成功'),
  revokedCount: z.number().describe('成功撤销的用户数'),
});
