/**
 * 知识库节点操作 Schemas
 */

import { z } from 'zod';
import { nodeZodSchemas } from '@qiyu-allinai/db/entities/knowledge';

// ============ 参数 Schemas ============
export const nodeIdParamsSchema = z.object({
  id: z.string().describe('节点 ID'),
});

// ============ 移动/复制 Schemas ============
export const moveBodySchema = z.object({
  targetParentId: z.string().nullable().describe('目标父文件夹 ID，null 表示移动到根目录'),
});

export const copyBodySchema = z.object({
  targetParentId: z.string().nullable().describe('目标父文件夹 ID，null 表示复制到根目录'),
});

// ============ 检查存在 Schemas ============
export const checkExistsBodySchema = z.object({
  parentId: z.string().nullable().optional().describe('父文件夹 ID，null 表示根目录'),
  names: z.array(z.string().min(1).max(255).describe('文件/文件夹名')).describe('要检查的名称列表'),
  type: z.enum(['folder', 'file']).optional().describe('节点类型：folder=文件夹，file=文件'),
});

export const checkExistsOutputSchema = z.object({
  exists: z.array(z.object({
    name: z.string().describe('文件/文件夹名'),
    nodeId: z.string().describe('已存在的节点 ID'),
    type: z.enum(['folder', 'file']).describe('节点类型'),
    size: z.number().describe('文件大小（字节）'),
    updatedAt: z.string().describe('更新时间'),
  })).describe('已存在的节点列表'),
});

// ============ 路径 Schemas ============
export const pathOutputSchema = z.object({
  data: z.array(z.object({
    id: z.string().describe('节点 ID'),
    name: z.string().describe('节点名称'),
    type: z.enum(['folder', 'file']).describe('节点类型'),
  })).describe('从根到当前节点的路径'),
});

// ============ 排序 Schemas ============
export const updateOrderBodySchema = z.object({
  items: z.array(z.object({
    id: z.string().describe('节点 ID'),
    orderNum: z.number().int().describe('排序序号'),
  })).describe('排序项列表'),
});

export const updateOrderOutputSchema = z.object({
  success: z.boolean().describe('操作是否成功'),
  updatedCount: z.number().describe('更新的节点数'),
});

// ============ 搜索 Schemas ============
export const searchBodySchema = z.object({
  keyword: z.string().min(1).max(100).describe('搜索关键词'),
  type: z.enum(['folder', 'file']).optional().describe('节点类型：folder=文件夹，file=文件'),
  limit: z.number().int().min(1).max(50).default(20).describe('返回数量限制'),
});

export const searchOutputSchema = z.object({
  data: z.array(nodeZodSchemas.select).describe('搜索结果列表'),
});

// ============ 导出节点 Schema ============
export { nodeZodSchemas };
