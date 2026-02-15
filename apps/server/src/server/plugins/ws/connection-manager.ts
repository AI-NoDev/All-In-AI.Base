/**
 * WebSocket 连接管理器
 * 管理所有 WebSocket 连接、用户映射和频道订阅
 */

import type { ElysiaWs, WsUser, WsMessage, ConnectionInfo, WsChannelHandler } from './types';

class ConnectionManager {
  // wsId -> ConnectionInfo
  private connections = new Map<string, ConnectionInfo>();
  // userId -> Set<wsId> (支持多设备)
  private userConnections = new Map<string, Set<string>>();
  // channel -> Set<wsId> (频道订阅)
  private channelSubscribers = new Map<string, Set<string>>();
  // channel -> handler
  private channelHandlers = new Map<string, WsChannelHandler>();

  // ============ 连接管理 ============
  
  addConnection(wsId: string, user: WsUser, ws: ElysiaWs) {
    const info: ConnectionInfo = {
      wsId,
      user,
      ws,
      channels: new Set(),
      subscribedAt: Date.now(),
    };
    this.connections.set(wsId, info);
    
    if (!this.userConnections.has(user.id)) {
      this.userConnections.set(user.id, new Set());
    }
    this.userConnections.get(user.id)!.add(wsId);
  }

  removeConnection(wsId: string): WsUser | undefined {
    const info = this.connections.get(wsId);
    if (!info) return undefined;

    // 从所有频道取消订阅
    for (const channel of info.channels) {
      this.unsubscribeFromChannel(wsId, channel);
    }

    // 移除连接
    this.connections.delete(wsId);
    
    // 移除用户映射
    const userWsIds = this.userConnections.get(info.user.id);
    if (userWsIds) {
      userWsIds.delete(wsId);
      if (userWsIds.size === 0) {
        this.userConnections.delete(info.user.id);
      }
    }

    return info.user;
  }

  getConnection(wsId: string): ConnectionInfo | undefined {
    return this.connections.get(wsId);
  }

  getUser(wsId: string): WsUser | undefined {
    return this.connections.get(wsId)?.user;
  }

  isUserOnline(userId: string): boolean {
    const wsIds = this.userConnections.get(userId);
    return !!wsIds && wsIds.size > 0;
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userConnections.keys());
  }

  // ============ 频道管理 ============

  registerChannel(handler: WsChannelHandler) {
    this.channelHandlers.set(handler.channel, handler);
    if (!this.channelSubscribers.has(handler.channel)) {
      this.channelSubscribers.set(handler.channel, new Set());
    }
    console.log(`[WS] Channel registered: ${handler.channel}`);
  }

  subscribeToChannel(wsId: string, channel: string): boolean {
    const info = this.connections.get(wsId);
    if (!info) return false;

    const handler = this.channelHandlers.get(channel);
    if (!handler) {
      console.warn(`[WS] Unknown channel: ${channel}`);
      return false;
    }

    // 添加订阅
    info.channels.add(channel);
    if (!this.channelSubscribers.has(channel)) {
      this.channelSubscribers.set(channel, new Set());
    }
    this.channelSubscribers.get(channel)!.add(wsId);

    // 触发订阅回调
    handler.onSubscribe?.(wsId, info.user);
    
    console.log(`[WS] User ${info.user.loginName} subscribed to ${channel}`);
    return true;
  }

  unsubscribeFromChannel(wsId: string, channel: string): boolean {
    const info = this.connections.get(wsId);
    if (!info) return false;

    info.channels.delete(channel);
    this.channelSubscribers.get(channel)?.delete(wsId);

    // 触发取消订阅回调
    const handler = this.channelHandlers.get(channel);
    handler?.onUnsubscribe?.(wsId, info.user);

    return true;
  }

  getChannelSubscribers(channel: string): Set<string> {
    return this.channelSubscribers.get(channel) || new Set();
  }

  isSubscribedToChannel(wsId: string, channel: string): boolean {
    return this.connections.get(wsId)?.channels.has(channel) || false;
  }

  // ============ 消息发送 ============

  send(wsId: string, message: WsMessage) {
    const info = this.connections.get(wsId);
    if (info) {
      try {
        info.ws.send(JSON.stringify(message));
      } catch (e) {
        console.error(`[WS] Failed to send to ${wsId}:`, e);
      }
    }
  }

  sendToUser(userId: string, message: WsMessage) {
    const wsIds = this.userConnections.get(userId);
    if (wsIds) {
      for (const wsId of wsIds) {
        this.send(wsId, message);
      }
    }
  }

  sendToUsers(userIds: string[], message: WsMessage) {
    for (const userId of userIds) {
      this.sendToUser(userId, message);
    }
  }

  sendToChannel(channel: string, message: WsMessage, excludeWsId?: string) {
    const subscribers = this.channelSubscribers.get(channel);
    if (subscribers) {
      for (const wsId of subscribers) {
        if (wsId !== excludeWsId) {
          this.send(wsId, message);
        }
      }
    }
  }

  broadcast(message: WsMessage, excludeUserId?: string) {
    for (const [wsId, info] of this.connections) {
      if (info.user.id !== excludeUserId) {
        this.send(wsId, message);
      }
    }
  }

  // ============ 消息处理 ============

  async handleMessage(wsId: string, channel: string, type: string, data: unknown, requestId?: string) {
    const info = this.connections.get(wsId);
    if (!info) return;

    const handler = this.channelHandlers.get(channel);
    if (!handler) {
      this.send(wsId, {
        channel: 'system',
        type: 'error',
        data: { message: `Unknown channel: ${channel}` },
      });
      return;
    }

    // 检查是否已订阅该频道
    if (!info.channels.has(channel)) {
      this.send(wsId, {
        channel: 'system',
        type: 'error',
        data: { message: `Not subscribed to channel: ${channel}` },
      });
      return;
    }

    try {
      await handler.onMessage(wsId, info.user, type, data, requestId);
    } catch (e) {
      console.error(`[WS] Error handling message on ${channel}:`, e);
      this.send(wsId, {
        channel,
        type: 'error',
        requestId,
        data: { message: 'Internal error' },
      });
    }
  }

  // 用户断开时通知所有频道处理器
  async notifyDisconnect(wsId: string, user: WsUser) {
    for (const [channel, handler] of this.channelHandlers) {
      if (handler.onDisconnect) {
        try {
          await handler.onDisconnect(wsId, user);
        } catch (e) {
          console.error(`[WS] Error in ${channel}.onDisconnect:`, e);
        }
      }
    }
  }
}

export const connectionManager = new ConnectionManager();
