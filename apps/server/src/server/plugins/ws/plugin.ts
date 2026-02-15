/**
 * WebSocket Elysia 插件
 * 统一的 WebSocket 入口，支持多频道
 */

import { Elysia, t } from 'elysia';
import { eq } from 'drizzle-orm';
import db from '@qiyu-allinai/db/connect';
import { user } from '@qiyu-allinai/db/entities/system';
import { jwtPlugin } from '../jwt';
import { connectionManager } from './connection-manager';
import type { WsMessage, WsChannelHandler } from './types';

// 注册频道处理器
export function registerWsChannel(handler: WsChannelHandler) {
  connectionManager.registerChannel(handler);
}

// WebSocket 插件
export const wsPlugin = new Elysia({ name: 'ws-plugin', prefix: '/ws' })
  .use(jwtPlugin)
  .ws('/main', {
    body: t.Object({
      channel: t.String(),
      type: t.String(),
      data: t.Optional(t.Unknown()),
      requestId: t.Optional(t.String()),
    }),

    open(ws) {
      console.log(`[WS] Connection opened: ${ws.id}`);
    },

    async message(ws, msg) {
      const { channel, type, data, requestId } = msg as WsMessage;
      const wsId = ws.id;
      const wsUser = connectionManager.getUser(wsId);

      // 系统频道消息处理
      if (channel === 'system') {
        const jwt = (ws.data as { jwt?: { verify: (token: string) => Promise<{ sub?: string } | false> } }).jwt;
        if (!jwt) {
          ws.send(JSON.stringify({ channel: 'system', type: 'error', data: { message: 'JWT not available' } }));
          return;
        }
        await handleSystemMessage(ws, jwt, wsId, type, data, requestId);
        return;
      }

      // 其他频道需要已认证
      if (!wsUser) {
        ws.send(JSON.stringify({
          channel: 'system',
          type: 'error',
          data: { message: 'Not authenticated' },
        }));
        return;
      }

      // 转发到对应频道处理器
      await connectionManager.handleMessage(wsId, channel, type, data, requestId);
    },

    async close(ws) {
      const wsUser = connectionManager.removeConnection(ws.id);
      if (wsUser) {
        await connectionManager.notifyDisconnect(ws.id, wsUser);
        console.log(`[WS] User ${wsUser.loginName} disconnected`);
      }
    },
  });

// 系统消息处理
interface WsInstance {
  id: string;
  send: (data: string) => void;
  close: () => void;
  data: Record<string, unknown>;
}

async function handleSystemMessage(
  ws: WsInstance,
  jwt: { verify: (token: string) => Promise<{ sub?: string } | false> },
  wsId: string,
  type: string,
  data: unknown,
  requestId?: string
) {
  switch (type) {
    case 'auth': {
      const token = (data as { token: string })?.token;
      if (!token) {
        ws.send(JSON.stringify({
          channel: 'system',
          type: 'auth_error',
          data: { message: 'Token required' },
        }));
        ws.close();
        return;
      }

      try {
        const payload = await jwt.verify(token);
        if (!payload || !payload.sub) {
          ws.send(JSON.stringify({
            channel: 'system',
            type: 'auth_error',
            data: { message: 'Invalid token' },
          }));
          ws.close();
          return;
        }

        const [userResult] = await db
          .select({ id: user.id, name: user.name, loginName: user.loginName })
          .from(user)
          .where(eq(user.id, payload.sub as string))
          .limit(1);

        if (!userResult) {
          ws.send(JSON.stringify({
            channel: 'system',
            type: 'auth_error',
            data: { message: 'User not found' },
          }));
          ws.close();
          return;
        }

        connectionManager.addConnection(wsId, userResult, ws as unknown as import('./types').ElysiaWs);

        ws.send(JSON.stringify({
          channel: 'system',
          type: 'auth_success',
          data: {
            user: userResult,
            onlineUsers: connectionManager.getOnlineUsers(),
          },
        }));

        console.log(`[WS] User ${userResult.loginName} authenticated`);
      } catch (error) {
        console.error('[WS] Auth error:', error);
        ws.send(JSON.stringify({
          channel: 'system',
          type: 'auth_error',
          data: { message: 'Authentication failed' },
        }));
        ws.close();
      }
      break;
    }

    case 'subscribe': {
      const channels = (data as { channels: string[] })?.channels || [];
      const results: Record<string, boolean> = {};
      
      for (const ch of channels) {
        results[ch] = connectionManager.subscribeToChannel(wsId, ch);
      }

      ws.send(JSON.stringify({
        channel: 'system',
        type: 'subscribe_success',
        requestId,
        data: { channels: results },
      }));
      break;
    }

    case 'unsubscribe': {
      const channels = (data as { channels: string[] })?.channels || [];
      
      for (const ch of channels) {
        connectionManager.unsubscribeFromChannel(wsId, ch);
      }

      ws.send(JSON.stringify({
        channel: 'system',
        type: 'unsubscribe_success',
        requestId,
        data: { channels },
      }));
      break;
    }

    case 'ping':
      ws.send(JSON.stringify({ channel: 'system', type: 'pong' }));
      break;

    default:
      ws.send(JSON.stringify({
        channel: 'system',
        type: 'error',
        data: { message: `Unknown system message type: ${type}` },
      }));
  }
}
