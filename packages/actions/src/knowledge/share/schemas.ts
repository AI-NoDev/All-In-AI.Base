/**
 * 知识库共享查询 Schemas (TypeBox)
 */

import { t } from 'elysia';
import { nodeSchemas } from '@qiyu-allinai/db/entities/knowledge';

// ============ 请求体 Schemas ============
export const shareQueryBodySchema = t.Object({
  type: t.Optional(t.Union([t.Literal('folder'), t.Literal('file')], { description: '节点类型：folder=文件夹，file=文件' })),
  limit: t.Integer({ minimum: 1, maximum: 100, default: 50, description: '每页数量' }),
  offset: t.Integer({ minimum: 0, default: 0, description: '偏移量' }),
});

export const sharedWithMeBodySchema = t.Object({
  folderId: t.Optional(t.String({ description: '文件夹 ID，用于浏览共享文件夹内容' })),
  type: t.Optional(t.Union([t.Literal('folder'), t.Literal('file')], { description: '节点类型：folder=文件夹，file=文件' })),
  limit: t.Integer({ minimum: 1, maximum: 100, default: 50, description: '每页数量' }),
  offset: t.Integer({ minimum: 0, default: 0, description: '偏移量' }),
});

// ============ 输出 Schemas ============
export const mySharedOutputSchema = t.Object({
  data: t.Array(t.Object({
    node: nodeSchemas.select,
    sharedTo: t.Array(t.Object({
      subjectType: t.String({ description: '主体类型：user/role/dept' }),
      subjectId: t.String({ description: '主体 ID' }),
      permission: t.String({ description: '权限：read/write/delete/manage' }),
    }), { description: '共享目标列表' }),
  }), { description: '共享节点列表' }),
  total: t.Number({ description: '总数' }),
});

export const sharedWithMeOutputSchema = t.Object({
  data: t.Array(t.Object({
    node: nodeSchemas.select,
    permissions: t.Array(t.String({ description: '权限' }), { description: '当前用户拥有的权限列表' }),
    permissionSource: t.Optional(t.Union([t.Literal('direct'), t.Literal('inherited')], { description: '权限来源：direct=直接授权，inherited=继承' })),
    sharedBy: t.Object({
      userId: t.Union([t.String(), t.Null()], { description: '共享者用户 ID' }),
      userName: t.Union([t.String(), t.Null()], { description: '共享者用户名' }),
    }, { description: '共享者信息' }),
  }), { description: '收到的共享节点列表' }),
  total: t.Number({ description: '总数' }),
});

// ============ 导出 Schemas ============
export { nodeSchemas };
