/**
 * IM 会话模块 Schema 定义
 */

import { z } from 'zod';

/** 会话过滤条件 Schema */
export const conversationFilterSchema = z.object({
  ids: z.array(z.string().describe('会话ID')).optional().describe('按ID列表精确匹配'),
  type: z.string().optional().describe('按会话类型精确匹配：01=单聊，02=群聊'),
  types: z.array(z.string().describe('会话类型')).optional().describe('按会话类型列表精确匹配'),
  ownerId: z.string().optional().describe('按群主ID精确匹配'),
  name: z.string().optional().describe('按会话名称模糊搜索'),
  status: z.string().optional().describe('按状态精确匹配：0=正常，1=禁用'),
  isTop: z.boolean().optional().describe('是否置顶'),
  isMuted: z.boolean().optional().describe('是否静音'),
  lastMessageAtStart: z.iso.datetime().optional().describe('最后消息时间范围-开始，ISO 8601格式'),
  lastMessageAtEnd: z.iso.datetime().optional().describe('最后消息时间范围-结束，ISO 8601格式'),
  createdAtStart: z.iso.datetime().optional().describe('创建时间范围-开始，ISO 8601格式'),
  createdAtEnd: z.iso.datetime().optional().describe('创建时间范围-结束，ISO 8601格式'),
}).optional().describe('会话过滤条件');

/** 排序 Schema */
export const sortSchema = z.object({
  field: z.enum(['name', 'lastMessageAt', 'createdAt', 'updatedAt', 'memberCount']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询 Body Schema */
export const paginationBodySchema = z.object({
  filter: conversationFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(20).describe('每页数量，1-100'),
}).describe('IM会话分页查询请求体');
