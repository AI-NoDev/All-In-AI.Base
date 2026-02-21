/**
 * 知识库共享查询 Schemas
 */

import { z } from 'zod';
import { nodeZodSchemas } from '@qiyu-allinai/db/entities/knowledge';

// ============ 请求体 Schemas ============
export const shareQueryBodySchema = z.object({
  type: z.enum(['folder', 'file']).optional().describe('节点类型：folder=文件夹，file=文件'),
  limit: z.number().int().min(1).max(100).default(50).describe('每页数量'),
  offset: z.number().int().min(0).default(0).describe('偏移量'),
});

export const sharedWithMeBodySchema = z.object({
  folderId: z.string().optional().describe('文件夹 ID，用于浏览共享文件夹内容'),
  type: z.enum(['folder', 'file']).optional().describe('节点类型：folder=文件夹，file=文件'),
  limit: z.number().int().min(1).max(100).default(50).describe('每页数量'),
  offset: z.number().int().min(0).default(0).describe('偏移量'),
});

// ============ 输出 Schemas ============
export const mySharedOutputSchema = z.object({
  data: z.array(z.object({
    node: nodeZodSchemas.select.describe('节点信息'),
    sharedTo: z.array(z.object({
      subjectType: z.string().describe('主体类型：user/role/dept'),
      subjectId: z.string().describe('主体 ID'),
      permission: z.string().describe('权限：read/write/delete/manage'),
    })).describe('共享目标列表'),
  })).describe('共享节点列表'),
  total: z.number().describe('总数'),
});

export const sharedWithMeOutputSchema = z.object({
  data: z.array(z.object({
    node: nodeZodSchemas.select.describe('节点信息'),
    permissions: z.array(z.string().describe('权限')).describe('当前用户拥有的权限列表'),
    permissionSource: z.enum(['direct', 'inherited']).optional().describe('权限来源：direct=直接授权，inherited=继承'),
    sharedBy: z.object({
      userId: z.string().nullable().describe('共享者用户 ID'),
      userName: z.string().nullable().describe('共享者用户名'),
    }).describe('共享者信息'),
  })).describe('收到的共享节点列表'),
  total: z.number().describe('总数'),
});

// ============ 导出 Schemas ============
export { nodeZodSchemas };
