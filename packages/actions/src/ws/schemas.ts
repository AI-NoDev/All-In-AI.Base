/**
 * WS Actions Schemas
 * 
 * WebSocket 相关操作的 TypeBox Schema 定义
 */

import { t } from 'elysia';
import { messageSchemas } from '@qiyu-allinai/db/entities/im';

// ============ 发送消息 Schemas ============
export const sendMessageBodySchema = t.Object({
  conversationId: t.String({ description: '目标会话 ID' }),
  msgType: t.String({ default: '01', description: '消息类型：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件' }),
  content: t.Unknown({ description: '消息内容，根据 msgType 不同结构不同' }),
  replyToId: t.Optional(t.String({ description: '回复的消息 ID' })),
  atUserIds: t.Optional(t.Array(t.String({ description: '用户 ID' }), { description: '@的用户 ID 列表' })),
});

export const sendMessageOutputSchema = t.Object({
  success: t.Boolean({ description: '是否发送成功' }),
  message: t.Optional(messageSchemas.select),
  notifiedUsers: t.Number({ description: '实时通知的在线用户数' }),
});

// ============ 发送单聊消息 Schemas ============
export const sendPrivateMessageBodySchema = t.Object({
  targetUserId: t.String({ description: '目标用户 ID' }),
  msgType: t.String({ default: '01', description: '消息类型：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件' }),
  content: t.Unknown({ description: '消息内容' }),
  replyToId: t.Optional(t.String({ description: '回复的消息 ID' })),
});

export const sendPrivateMessageOutputSchema = t.Object({
  success: t.Boolean({ description: '是否发送成功' }),
  conversationId: t.Optional(t.String({ description: '会话 ID，可用于后续发送消息' })),
  message: t.Optional(messageSchemas.select),
  isNewConversation: t.Boolean({ description: '是否新创建的会话' }),
  notifiedUsers: t.Number({ description: '实时通知的在线用户数' }),
});

// ============ 发送群聊消息 Schemas ============
export const sendGroupMessageBodySchema = t.Object({
  conversationId: t.String({ description: '群聊会话 ID' }),
  msgType: t.String({ default: '01', description: '消息类型：01=文本，02=链接，03=图片，04=视频，05=音频，06=文件' }),
  content: t.Unknown({ description: '消息内容' }),
  replyToId: t.Optional(t.String({ description: '回复的消息 ID' })),
  atUserIds: t.Optional(t.Array(t.String({ description: '用户 ID' }), { description: '@的用户 ID 列表' })),
});

export const sendGroupMessageOutputSchema = t.Object({
  success: t.Boolean({ description: '是否发送成功' }),
  message: t.Optional(messageSchemas.select),
  notifiedUsers: t.Number({ description: '实时通知的在线群成员数' }),
});

// ============ 广播通知 Schemas ============
export const broadcastNotificationBodySchema = t.Object({
  userIds: t.Array(t.String({ description: '用户 ID' }), { description: '目标用户 ID 列表' }),
  title: t.String({ description: '通知标题' }),
  content: t.String({ description: '通知内容' }),
  type: t.Union([t.Literal('info'), t.Literal('success'), t.Literal('warning'), t.Literal('error')], { default: 'info', description: '通知类型' }),
  data: t.Optional(t.Record(t.String(), t.Unknown(), { description: '附加数据，可包含链接等信息' })),
});

export const broadcastNotificationOutputSchema = t.Object({
  success: t.Boolean({ description: '是否发送成功' }),
  notifiedUsers: t.Number({ description: '实际收到通知的用户数（在线用户）' }),
  onlineUsers: t.Number({ description: '目标用户中在线的用户数' }),
});

// ============ 获取在线用户 Schemas ============
export const getOnlineUsersOutputSchema = t.Object({
  users: t.Array(t.String({ description: '用户 ID' }), { description: '在线用户 ID 列表' }),
  count: t.Number({ description: '在线用户数量' }),
});

// ============ 检查用户在线状态 Schemas ============
export const checkUserOnlineBodySchema = t.Object({
  userIds: t.Array(t.String({ description: '用户 ID' }), { description: '要检查的用户 ID 列表' }),
});

export const checkUserOnlineOutputSchema = t.Object({
  status: t.Record(t.String(), t.Boolean(), { description: '用户在线状态映射，key 为用户 ID，value 为是否在线' }),
});
