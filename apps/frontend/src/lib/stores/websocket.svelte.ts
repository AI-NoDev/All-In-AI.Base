/**
 * WebSocket Store - 多频道架构
 * 统一的 WebSocket 连接，支持多个频道订阅
 */

import { authStore } from './auth.svelte';

const WS_BASE = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3030';

// ============ Types ============
export interface WsMessage<T = unknown> {
  channel: string;
  type: string;
  data?: T;
  requestId?: string;
}

export interface WsUser {
  id: string;
  name: string | null;
  loginName: string;
}

interface WsState {
  isConnected: boolean;
  isAuthenticated: boolean;
  user: WsUser | null;
  onlineUsers: string[];
  subscribedChannels: Set<string>;
  reconnectAttempts: number;
}

type MessageHandler<T = unknown> = (type: string, data: T) => void;

// ============ WebSocket Store ============
function createWebSocketStore() {
  let ws: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let pingTimer: ReturnType<typeof setInterval> | null = null;
  let requestIdCounter = 0;
  let pendingSubscriptions: string[] = [];

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;
  const PING_INTERVAL = 30000;

  let state = $state<WsState>({
    isConnected: false,
    isAuthenticated: false,
    user: null,
    onlineUsers: [],
    subscribedChannels: new Set(),
    reconnectAttempts: 0,
  });

  // 频道消息处理器
  const channelHandlers = new Map<string, Set<MessageHandler>>();
  // 请求响应处理器
  const requestHandlers = new Map<string, (data: unknown) => void>();

  function generateRequestId(): string {
    return `req_${Date.now()}_${++requestIdCounter}`;
  }

  function startPing() {
    stopPing();
    pingTimer = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ channel: 'system', type: 'ping' }));
      }
    }, PING_INTERVAL);
  }

  function stopPing() {
    if (pingTimer) {
      clearInterval(pingTimer);
      pingTimer = null;
    }
  }

  function handleMessage(event: MessageEvent) {
    try {
      const msg: WsMessage = JSON.parse(event.data);
      const { channel, type, data, requestId } = msg;

      // 处理请求响应
      if (requestId && requestHandlers.has(requestId)) {
        const handler = requestHandlers.get(requestId)!;
        requestHandlers.delete(requestId);
        handler(data);
        return;
      }

      // 系统频道消息
      if (channel === 'system') {
        handleSystemMessage(type, data);
        return;
      }

      // 转发到频道处理器
      const handlers = channelHandlers.get(channel);
      if (handlers) {
        handlers.forEach(handler => handler(type, data));
      }
    } catch (e) {
      console.error('Failed to parse WebSocket message:', e);
    }
  }

  function handleSystemMessage(type: string, data: unknown) {
    switch (type) {
      case 'auth_success': {
        const authData = data as { user: WsUser; onlineUsers: string[] };
        state.isAuthenticated = true;
        state.user = authData.user;
        state.onlineUsers = authData.onlineUsers;
        state.reconnectAttempts = 0;
        startPing();
        
        // 订阅待处理的频道
        if (pendingSubscriptions.length > 0) {
          subscribe(pendingSubscriptions);
          pendingSubscriptions = [];
        }
        
        console.log('[WS] Authenticated:', authData.user.loginName);
        break;
      }

      case 'auth_error':
        console.error('[WS] Auth error:', data);
        state.isAuthenticated = false;
        disconnect();
        break;

      case 'subscribe_success': {
        const subData = data as { channels: Record<string, boolean> };
        for (const [ch, success] of Object.entries(subData.channels)) {
          if (success) {
            state.subscribedChannels.add(ch);
          }
        }
        console.log('[WS] Subscribed:', Object.keys(subData.channels).filter(ch => subData.channels[ch]));
        break;
      }

      case 'unsubscribe_success': {
        const unsubData = data as { channels: string[] };
        for (const ch of unsubData.channels) {
          state.subscribedChannels.delete(ch);
        }
        break;
      }

      case 'pong':
        break;

      case 'error':
        console.error('[WS] Error:', data);
        break;
    }
  }

  function connect(channels?: string[]) {
    if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
      // 如果已连接，直接订阅频道
      if (channels && state.isAuthenticated) {
        subscribe(channels);
      }
      return;
    }

    if (!authStore.accessToken) {
      console.warn('[WS] Cannot connect: no access token');
      return;
    }

    // 保存待订阅的频道
    if (channels) {
      pendingSubscriptions = [...new Set([...pendingSubscriptions, ...channels])];
    }

    try {
      ws = new WebSocket(`${WS_BASE}/ws/main`);

      ws.onopen = () => {
        state.isConnected = true;
        console.log('[WS] Connected, authenticating...');
        
        ws!.send(JSON.stringify({
          channel: 'system',
          type: 'auth',
          data: { token: authStore.accessToken },
        }));
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        state.isConnected = false;
        state.isAuthenticated = false;
        state.subscribedChannels.clear();
        stopPing();
        console.log('[WS] Closed:', event.code, event.reason);

        if (event.code !== 1000 && state.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          scheduleReconnect();
        }
      };

      ws.onerror = (error) => {
        console.error('[WS] Error:', error);
      };
    } catch (e) {
      console.error('[WS] Failed to create WebSocket:', e);
    }
  }

  function disconnect() {
    stopPing();
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (ws) {
      ws.close(1000, 'User disconnect');
      ws = null;
    }
    state.isConnected = false;
    state.isAuthenticated = false;
    state.user = null;
    state.onlineUsers = [];
    state.subscribedChannels.clear();
    state.reconnectAttempts = 0;
    pendingSubscriptions = [];
  }

  function scheduleReconnect() {
    if (reconnectTimer) return;

    state.reconnectAttempts++;
    const delay = RECONNECT_DELAY * state.reconnectAttempts;
    console.log(`[WS] Reconnecting in ${delay}ms (attempt ${state.reconnectAttempts})`);

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, delay);
  }

  // ============ Public API ============

  function send<T>(channel: string, type: string, data?: T, requestId?: string) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ channel, type, data, requestId }));
    } else {
      console.warn('[WS] Not connected, cannot send message');
    }
  }

  function sendWithResponse<T, R>(channel: string, type: string, data?: T, timeout = 10000): Promise<R> {
    return new Promise((resolve, reject) => {
      const requestId = generateRequestId();
      
      const timer = setTimeout(() => {
        requestHandlers.delete(requestId);
        reject(new Error('Request timeout'));
      }, timeout);

      requestHandlers.set(requestId, (response) => {
        clearTimeout(timer);
        resolve(response as R);
      });

      send(channel, type, data, requestId);
    });
  }

  function subscribe(channels: string[]) {
    if (!state.isAuthenticated) {
      pendingSubscriptions = [...new Set([...pendingSubscriptions, ...channels])];
      return;
    }
    send('system', 'subscribe', { channels });
  }

  function unsubscribe(channels: string[]) {
    send('system', 'unsubscribe', { channels });
  }

  function onChannel<T = unknown>(channel: string, handler: MessageHandler<T>): () => void {
    if (!channelHandlers.has(channel)) {
      channelHandlers.set(channel, new Set());
    }
    channelHandlers.get(channel)!.add(handler as MessageHandler);
    return () => channelHandlers.get(channel)?.delete(handler as MessageHandler);
  }

  function isUserOnline(userId: string): boolean {
    return state.onlineUsers.includes(userId);
  }

  return {
    get state() { return state; },
    get isConnected() { return state.isConnected; },
    get isAuthenticated() { return state.isAuthenticated; },
    get onlineUsers() { return state.onlineUsers; },
    get subscribedChannels() { return state.subscribedChannels; },
    connect,
    disconnect,
    send,
    sendWithResponse,
    subscribe,
    unsubscribe,
    onChannel,
    isUserOnline,
  };
}

export const wsStore = createWebSocketStore();
