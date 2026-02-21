/**
 * 知识库收藏 Schemas
 */

import { z } from 'zod';
import { favoriteZodSchemas } from '@qiyu-allinai/db/entities/knowledge';

// ============ 请求体 Schemas ============
export const addFavoriteBodySchema = z.object({
  nodeId: z.string().describe('要收藏的节点 ID'),
});

export const checkFavoriteBodySchema = z.object({
  nodeIds: z.array(z.string().describe('节点 ID')).describe('要检查的节点 ID 列表'),
});

export const listFavoriteBodySchema = z.object({
  type: z.enum(['folder', 'file']).optional().describe('节点类型：folder=文件夹，file=文件'),
  limit: z.number().int().min(1).max(100).default(50).describe('每页数量'),
  offset: z.number().int().min(0).default(0).describe('偏移量'),
});

// ============ 参数 Schemas ============
export const nodeIdParamsSchema = z.object({
  nodeId: z.string().describe('节点 ID'),
});

// ============ 输出 Schemas ============
export const successOutputSchema = z.object({
  success: z.boolean().describe('操作是否成功'),
});

export const checkFavoriteOutputSchema = z.object({
  favorites: z.record(z.string(), z.boolean()).describe('收藏状态映射，key 为节点 ID，value 为是否已收藏'),
});

export const listFavoriteOutputSchema = z.object({
  data: z.array(z.object({
    favoriteId: z.string().describe('收藏记录 ID'),
    nodeId: z.string().describe('节点 ID'),
    type: z.enum(['folder', 'file']).describe('节点类型'),
    name: z.string().describe('节点名称'),
    parentId: z.string().nullable().describe('父文件夹 ID'),
    icon: z.string().nullable().describe('图标'),
    color: z.string().nullable().describe('颜色'),
    extension: z.string().nullable().describe('文件扩展名'),
    mimeType: z.string().nullable().describe('MIME 类型'),
    size: z.number().describe('文件大小（字节）'),
    createdAt: z.string().describe('节点创建时间'),
    favoritedAt: z.string().describe('收藏时间'),
  })).describe('收藏列表'),
  total: z.number().describe('总数'),
});

// ============ 导出 Schemas ============
export { favoriteZodSchemas };
