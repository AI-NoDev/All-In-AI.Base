/**
 * 通知已读记录模块 Schema 定义
 */

import { z } from 'zod';
import { noticeReadZodSchemas } from '@qiyu-allinai/db/entities/system';

/** 标记已读请求体 Schema */
export const markAsReadBodySchema = z.object({
  noticeId: z.string().uuid().describe('通知 ID'),
});

/** 批量标记已读请求体 Schema */
export const markManyAsReadBodySchema = z.object({
  noticeIds: z.array(z.string().uuid()).describe('通知 ID 列表'),
});

/** 获取未读数量响应 Schema */
export const unreadCountOutputSchema = z.object({
  count: z.number().describe('未读数量'),
});

// 重新导出实体 Schema
export { noticeReadZodSchemas };
