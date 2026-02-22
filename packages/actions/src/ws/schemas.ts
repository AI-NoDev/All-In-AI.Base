/**
 * WS Actions Schemas
 * 
 * WebSocket 相关操作的 Zod Schema 定义
 */

import { z } from 'zod';
import { messageZodSchemas } from '@qiyu-allinai/db/entities/im';

// ============ 发送消息 Schemas ============
export const sendMessageBodySchema = z.object({
  conversationId: z.string().describe('目标会话 ID'),
  msgType: z.string().default('01').describe('消息类型：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件'),
  content: z.unknown().describe('消息内容，根据 msgType 不同结构不同'),
  replyToId: z.string().optional().describe('回复的消息 ID'),
  atUserIds: z.array(z.string().describe('用户 ID')).optional().describe('@的用户 ID 列表'),
});

export const sendMessageOutputSchema = z.object({
  success: z.boolean().describe('是否发送成功'),
  message: messageZodSchemas.select.optional().describe('发送的消息详情'),
  notifiedUsers: z.number().describe('实时通知的在线用户数'),
});

// ============ 发送单聊消息 Schemas ============
export const sendPrivateMessageBodySchema = z.object({
  targetUserId: z.string().describe('目标用户 ID'),
  msgType: z.string().default('01').describe('消息类型：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件'),
  content: z.unknown().describe('消息内容'),
  replyToId: z.string().optional().describe('回复的消息 ID'),
});

export const sendPrivateMessageOutputSchema = z.object({
  success: z.boolean().describe('是否发送成功'),
  conversationId: z.string().optional().describe('会话 ID，可用于后续发送消息'),
  message: messageZodSchemas.select.optional().describe('发送的消息详情'),
  isNewConversation: z.boolean().describe('是否新创建的会话'),
  notifiedUsers: z.number().describe('实时通知的在线用户数'),
});

// ============ 发送群聊消息 Schemas ============
export const sendGroupMessageBodySchema = z.object({
  conversationId: z.string().describe('群聊会话 ID'),
  msgType: z.string().default('01').describe('消息类型：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件'),
  content: z.unknown().describe('消息内容'),
  replyToId: z.string().optional().describe('回复的消息 ID'),
  atUserIds: z.array(z.string().describe('用户 ID')).optional().describe('@的用户 ID 列表'),
});

export const sendGroupMessageOutputSchema = z.object({
  success: z.boolean().describe('是否发送成功'),
  message: messageZodSchemas.select.optional().describe('发送的消息详情'),
  notifiedUsers: z.number().describe('实时通知的在线群成员数'),
});

// ============ 广播通知 Schemas ============
export const broadcastNotificationBodySchema = z.object({
  userIds: z.array(z.string().describe('用户 ID')).describe('目标用户 ID 列表'),
  title: z.string().describe('通知标题'),
  content: z.string().describe('通知内容'),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info').describe('通知类型'),
  data: z.record(z.string(), z.unknown()).optional().describe('附加数据，可包含链接等信息'),
});

export const broadcastNotificationOutputSchema = z.object({
  success: z.boolean().describe('是否发送成功'),
  notifiedUsers: z.number().describe('实际收到通知的用户数（在线用户）'),
  onlineUsers: z.number().describe('目标用户中在线的用户数'),
});

// ============ 获取在线用户 Schemas ============
export const getOnlineUsersOutputSchema = z.object({
  users: z.array(z.string().describe('用户 ID')).describe('在线用户 ID 列表'),
  count: z.number().describe('在线用户数量'),
});

// ============ 检查用户在线状态 Schemas ============
export const checkUserOnlineBodySchema = z.object({
  userIds: z.array(z.string().describe('用户 ID')).describe('要检查的用户 ID 列表'),
});

export const checkUserOnlineOutputSchema = z.object({
  status: z.record(z.string(), z.boolean()).describe('用户在线状态映射，key 为用户 ID，value 为是否在线'),
});
