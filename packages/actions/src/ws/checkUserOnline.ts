/**
 * 检查用户在线状态 Action
 * 
 * 检查指定用户是否在线。
 * 
 * 使用场景：
 * - 显示用户在线状态
 * - 判断是否发送推送通知
 * - 选择消息发送方式
 * 
 * 请求示例：
 * ```json
 * {
 *   "userIds": ["用户UUID1", "用户UUID2"]
 * }
 * ```
 */

import { defineAction } from '../core/define';
import { checkUserOnlineBodySchema, checkUserOnlineOutputSchema } from './schemas';
import type { WsConnectionManager } from './utils';

export const wsCheckUserOnline = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ws.users.checkOnline',
    displayName: '检查用户在线状态',
    description: `检查指定用户是否在线。

参数说明：
- userIds: 要检查的用户 ID 列表（必填）

使用场景：
- 显示用户在线状态
- 判断是否发送推送通知
- 选择消息发送方式（在线用 WS，离线用推送）

请求示例：
{
  "userIds": ["user-uuid-1", "user-uuid-2"]
}

返回说明：
- status: 用户在线状态映射，key 为用户 ID，value 为是否在线`,
    tags: ['ws', 'users', 'online', 'check'],
    method: 'POST',
    path: '/api/ws/users/check-online',
  },
  schemas: {
    bodySchema: checkUserOnlineBodySchema,
    outputSchema: checkUserOnlineOutputSchema,
  },
  execute: async (input, context) => {
    const { wsConnectionManager } = context;
    const { userIds } = input;

    const status: Record<string, boolean> = {};

    if (wsConnectionManager) {
      const cm = wsConnectionManager as WsConnectionManager;
      for (const userId of userIds) {
        status[userId] = cm.isUserOnline(userId);
      }
    } else {
      for (const userId of userIds) {
        status[userId] = false;
      }
    }

    return { status };
  },
});
