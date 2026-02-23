/**
 * 知识库权限管理 Schemas (TypeBox)
 */

import { t } from 'elysia';

// ============ 基础类型 Schemas ============
export const subjectTypeSchema = t.Union([t.Literal('user'), t.Literal('role'), t.Literal('dept')], { description: '主体类型：user=用户，role=角色，dept=部门' });
export const permissionSchema = t.Union([t.Literal('read'), t.Literal('write'), t.Literal('delete'), t.Literal('manage')], { description: '权限类型：read=读取，write=写入，delete=删除，manage=管理' });
export const effectSchema = t.Union([t.Literal('allow'), t.Literal('deny')], { description: '权限效果：allow=允许，deny=拒绝' });

// ============ 权限条目 Schema ============
export const permissionEntrySchema = t.Object({
  subjectType: subjectTypeSchema,
  subjectId: t.String({ description: '主体 ID' }),
  permission: permissionSchema,
  effect: t.Optional(t.Union([t.Literal('allow'), t.Literal('deny')], { default: 'allow', description: '权限效果：allow=允许，deny=拒绝' })),
});

// ============ 有效权限 Schema ============
export const effectivePermissionSchema = t.Object({
  permission: permissionSchema,
  effect: effectSchema,
  source: t.Union([t.Literal('direct'), t.Literal('inherited'), t.Literal('role'), t.Literal('dept')], { description: '权限来源：direct=直接授权，inherited=继承，role=角色，dept=部门' }),
  sourceId: t.Optional(t.String({ description: '来源 ID' })),
});

// ============ 参数 Schemas ============
export const nodeIdParamsSchema = t.Object({
  id: t.String({ description: '节点 ID' }),
});

export const removePermissionParamsSchema = t.Object({
  id: t.String({ description: '节点 ID' }),
  subjectType: subjectTypeSchema,
  subjectId: t.String({ description: '主体 ID' }),
});

// ============ 请求体 Schemas ============
export const setPermissionsBodySchema = t.Object({
  permissions: t.Array(permissionEntrySchema, { description: '权限条目列表' }),
});

export const quickShareBodySchema = t.Object({
  userIds: t.Array(t.String({ description: '用户 ID' }), { description: '目标用户 ID 列表' }),
  level: t.Union([t.Literal('read'), t.Literal('edit'), t.Literal('full')], { description: '共享级别：read=只读，edit=可编辑，full=完全控制' }),
});

export const revokeShareBodySchema = t.Object({
  userIds: t.Array(t.String({ description: '用户 ID' }), { description: '要撤销共享的用户 ID 列表' }),
});

// ============ 查询参数 Schemas ============
export const removePermissionQuerySchema = t.Optional(t.Object({
  permission: t.Optional(permissionSchema),
}));

export const effectivePermissionQuerySchema = t.Optional(t.Object({
  userId: t.Optional(t.String({ description: '用户 ID，不指定则查询当前用户' })),
}));

// ============ 输出 Schemas ============
export const successOutputSchema = t.Object({
  success: t.Boolean({ description: '操作是否成功' }),
});

export const permissionsOutputSchema = t.Object({
  permissions: t.Array(t.Object({
    subjectType: subjectTypeSchema,
    subjectId: t.String({ description: '主体 ID' }),
    resourceId: t.String({ description: '资源 ID' }),
    permission: permissionSchema,
    effect: effectSchema,
  }), { description: '权限列表' }),
});

export const effectivePermissionsOutputSchema = t.Object({
  data: t.Array(effectivePermissionSchema, { description: '有效权限列表' }),
});

export const quickShareOutputSchema = t.Object({
  success: t.Boolean({ description: '操作是否成功' }),
  sharedCount: t.Number({ description: '成功共享的用户数' }),
});

export const revokeShareOutputSchema = t.Object({
  success: t.Boolean({ description: '操作是否成功' }),
  revokedCount: t.Number({ description: '成功撤销的用户数' }),
});
