/**
 * WS Actions 导出
 * 
 * 提供 WebSocket 相关操作的 Actions，用于外部 AI 或其他服务调用。
 * 这些 actions 可以发送消息并通过 WebSocket 实时通知在线用户。
 * 
 * HTTP API 路由：
 * - POST /api/ws/message/send - 发送消息到指定会话
 * - POST /api/ws/message/private - 发送单聊消息（自动创建会话）
 * - POST /api/ws/message/group - 发送群聊消息
 * - POST /api/ws/notification/broadcast - 广播通知给指定用户
 * - GET /api/ws/users/online - 获取在线用户列表
 * - POST /api/ws/users/check-online - 检查用户在线状态
 */

// Schemas
export * from './schemas';

// Utils
export * from './utils';

// Actions
export { wsSendMessage } from './sendMessage';
export { wsSendPrivateMessage } from './sendPrivateMessage';
export { wsSendGroupMessage } from './sendGroupMessage';
export { wsBroadcastNotification } from './broadcastNotification';
export { wsGetOnlineUsers } from './getOnlineUsers';
export { wsCheckUserOnline } from './checkUserOnline';

// Action 列表（用于注册）
import { wsSendMessage } from './sendMessage';
import { wsSendPrivateMessage } from './sendPrivateMessage';
import { wsSendGroupMessage } from './sendGroupMessage';
import { wsBroadcastNotification } from './broadcastNotification';
import { wsGetOnlineUsers } from './getOnlineUsers';
import { wsCheckUserOnline } from './checkUserOnline';

export const wsActions = [
  wsSendMessage,
  wsSendPrivateMessage,
  wsSendGroupMessage,
  wsBroadcastNotification,
  wsGetOnlineUsers,
  wsCheckUserOnline,
];
