/**
 * 获取在线用户列表 Action
 * 
 * 获取当前所有在线用户的 ID 列表。
 * 
 * 使用场景：
 * - 显示在线用户列表
 * - 统计在线用户数
 * - 判断是否需要发送离线通知
 */

import { defineAction } from '../core/define';
import { getOnlineUsersOutputSchema } from './schemas';
import type { WsConnectionManager } from './utils';

export const wsGetOnlineUsers = defineAction({
  meta: {
    ignoreTools: true,
    name: 'ws.users.online',
    displayName: '获取在线用户',
    description: `获取当前所有在线用户的 ID 列表。

使用场景：
- 显示在线用户列表
- 统计在线用户数
- 判断是否需要发送离线通知

返回说明：
- users: 在线用户 ID 列表
- count: 在线用户数量`,
    tags: ['ws', 'users', 'online'],
    method: 'GET',
    path: '/api/ws/users/online',
  },
  schemas: {
    outputSchema: getOnlineUsersOutputSchema,
  },
  execute: async (_input, context) => {
    const { wsConnectionManager } = context;

    if (wsConnectionManager) {
      const cm = wsConnectionManager as WsConnectionManager;
      const users = cm.getOnlineUsers();
      return {
        users,
        count: users.length,
      };
    }

    return {
      users: [],
      count: 0,
    };
  },
});
