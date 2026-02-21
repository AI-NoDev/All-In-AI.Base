/**
 * IM 消息模块 Schema 定义
 */

import { z } from 'zod';

/** 消息过滤条件 Schema */
export const messageFilterSchema = z.object({
  ids: z.array(z.string().describe('消息ID')).optional().describe('按ID列表精确匹配'),
  conversationId: z.string().optional().describe('按会话ID精确匹配'),
  conversationIds: z.array(z.string().describe('会话ID')).optional().describe('按会话ID列表精确匹配'),
  senderId: z.string().optional().describe('按发送者ID精确匹配'),
  senderIds: z.array(z.string().describe('发送者ID')).optional().describe('按发送者ID列表精确匹配'),
  msgType: z.string().optional().describe('按消息类型精确匹配：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件'),
  msgTypes: z.array(z.string().describe('消息类型')).optional().describe('按消息类型列表精确匹配'),
  isRecalled: z.boolean().optional().describe('是否已撤回'),
  msgSeqStart: z.number().optional().describe('消息序号范围-开始'),
  msgSeqEnd: z.number().optional().describe('消息序号范围-结束'),
  createdAtStart: z.iso.datetime().optional().describe('创建时间范围-开始，ISO 8601格式'),
  createdAtEnd: z.iso.datetime().optional().describe('创建时间范围-结束，ISO 8601格式'),
}).optional().describe('消息过滤条件');

/** 排序 Schema */
export const sortSchema = z.object({
  field: z.enum(['msgSeq', 'createdAt']).describe('排序字段'),
  order: z.enum(['asc', 'desc']).describe('排序方向：asc=升序，desc=降序'),
}).optional().describe('排序配置');

/** 分页查询 Body Schema */
export const paginationBodySchema = z.object({
  filter: messageFilterSchema,
  sort: sortSchema,
  offset: z.number().int().min(0).default(0).describe('分页偏移量，从0开始'),
  limit: z.number().int().min(1).max(100).default(50).describe('每页数量，1-100'),
}).describe('IM消息分页查询请求体');
