/**
 * 广播通知 Action
 * 
 * 用于向多个用户发送实时通知，不创建 IM 消息记录。
 * 
 * 使用场景：
 * - 系统公告推送
 * - 任务完成通知
 * - 审批提醒
 * - AI 处理结果通知
 * 
 * 请求示例：
 * ```json
 * {
 *   "userIds": ["用户UUID1", "用户UUID2"],
 *   "title": "系统通知",
 *   "content": "您有一条新的审批待处理",
 *   "type": "info",
 *   "data": { "approvalId": "xxx", "link": "/approvals/xxx" }
 * }
 * ```
 */

import { defineAction } from '../core/define';
import { broadcastNotificationBodySchema, broadcastNotificationOutputSchema } from './schemas';
import type { WsConnectionManager } from './utils';

const CHANNEL = 'notification';

export const wsBroadcastNotification = defineAction({
  meta: {
    name: 'ws.notification.broadcast',
    displayName: '广播通知',
    description: `向指定用户发送实时通知（不创建 IM 消息记录）。

参数说明：
- userIds: 目标用户 ID 列表（必填）
- title: 通知标题（必填）
- content: 通知内容（必填）
- type: 通知类型，info/success/warning/error（默认 info）
- data: 附加数据，可包含链接等信息（可选）

使用场景：
- 系统公告推送
- 任务完成通知
- 审批提醒
- AI 处理结果通知

请求示例：
{
  "userIds": ["user-uuid-1", "user-uuid-2"],
  "title": "系统通知",
  "content": "您有一条新的审批待处理",
  "type": "info",
  "data": { "approvalId": "xxx", "link": "/approvals/xxx" }
}

返回说明：
- notifiedUsers: 实际收到通知的用户数（在线用户）
- onlineUsers: 目标用户中在线的用户数`,
    tags: ['ws', 'notification', 'broadcast'],
    method: 'POST',
    path: '/api/ws/notification/broadcast',
  },
  schemas: {
    bodySchema: broadcastNotificationBodySchema,
    outputSchema: broadcastNotificationOutputSchema,
  },
  execute: async (input, context) => {
    const { wsConnectionManager } = context;
    const { userIds, title, content, type, data } = input;

    let notifiedUsers = 0;
    let onlineUsers = 0;

    if (wsConnectionManager) {
      const cm = wsConnectionManager as WsConnectionManager;
      
      for (const userId of userIds) {
        if (cm.isUserOnline(userId)) {
          onlineUsers++;
          cm.sendToUser(userId, {
            channel: CHANNEL,
            type: 'notification',
            data: {
              title,
              content,
              type,
              data,
              timestamp: Date.now(),
            },
          });
          notifiedUsers++;
        }
      }
    }

    return {
      success: true,
      notifiedUsers,
      onlineUsers,
    };
  },
});
