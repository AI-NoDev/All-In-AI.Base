/**
 * WS Actions Schemas
 * 
 * WebSocket 相关操作的 Zod Schema 定义
 */

import { z } from 'zod';
import { messageZodSchemas } from '@qiyu-allinai/db/entities/im';

// ============ 发送消息 Schemas ============
export const sendMessageBodySchema = z.object({
  conversationId: z.string().uuid(),
  msgType: z.string().default('01'),
  content: z.unknown(),
  replyToId: z.string().uuid().optional(),
  atUserIds: z.array(z.string().uuid()).optional(),
});

export const sendMessageOutputSchema = z.object({
  success: z.boolean(),
  message: messageZodSchemas.select.optional(),
  notifiedUsers: z.number(),
});

// ============ 发送单聊消息 Schemas ============
export const sendPrivateMessageBodySchema = z.object({
  targetUserId: z.string().uuid(),
  msgType: z.string().default('01'),
  content: z.unknown(),
  replyToId: z.string().uuid().optional(),
});

export const sendPrivateMessageOutputSchema = z.object({
  success: z.boolean(),
  conversationId: z.string().uuid().optional(),
  message: messageZodSchemas.select.optional(),
  isNewConversation: z.boolean(),
  notifiedUsers: z.number(),
});

// ============ 发送群聊消息 Schemas ============
export const sendGroupMessageBodySchema = z.object({
  conversationId: z.string().uuid(),
  msgType: z.string().default('01'),
  content: z.unknown(),
  replyToId: z.string().uuid().optional(),
  atUserIds: z.array(z.string().uuid()).optional(),
});

export const sendGroupMessageOutputSchema = z.object({
  success: z.boolean(),
  message: messageZodSchemas.select.optional(),
  notifiedUsers: z.number(),
});

// ============ 广播通知 Schemas ============
export const broadcastNotificationBodySchema = z.object({
  userIds: z.array(z.string().uuid()),
  title: z.string(),
  content: z.string(),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const broadcastNotificationOutputSchema = z.object({
  success: z.boolean(),
  notifiedUsers: z.number(),
  onlineUsers: z.number(),
});

// ============ 获取在线用户 Schemas ============
export const getOnlineUsersOutputSchema = z.object({
  users: z.array(z.string().uuid()),
  count: z.number(),
});

// ============ 检查用户在线状态 Schemas ============
export const checkUserOnlineBodySchema = z.object({
  userIds: z.array(z.string().uuid()),
});

export const checkUserOnlineOutputSchema = z.object({
  status: z.record(z.string(), z.boolean()),
});
