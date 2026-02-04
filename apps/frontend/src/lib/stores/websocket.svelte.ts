import { authStore } from './auth.svelte';

const WS_BASE = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3030';

// ============ Types ============
type WsMessageType =
  | 'auth'
  | 'auth_success'
  | 'auth_error'
  | 'message'
  | 'message_ack'
  | 'new_message'
  | 'typing'
  | 'read'
  | 'online'
  | 'offline'
  | 'error'
  | 'ping'
  | 'pong'
  | 'group_created'
  | 'group_dissolved'
  | 'message_recalled';

interface WsMessage {
  type: WsMessageType;
  data?: unknown;
  requestId?: string;
}

interface WsUser {
  id: string;
  name: string | null;
  loginName: string;
}

interface MessageContent {
  text?: string;
  fileId?: string;
  url?: string;
  [key: string]: unknown;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  msgType: string;
  msgSeq: number;
  content: MessageContent;
  replyToId: string | null;
  atUserIds: string[];
  isRecalled: boolean;
  recalledAt: string | null;
  recalledById: string | null;
  extra: Record<string, unknown>;
  createdAt: string;
}

interface NewMessageData {
  message: Message;
  sender: WsUser;
}

interface TypingData {
  conversationId: string;
  userId: string;
  userName: string;
}

interface ReadData {
  conversationId: string;
  userId: string;
  lastReadSeq: number;
}

interface OnlineOfflineData {
  userId: string;
  userName: string;
}

interface MessageAckData {
  success: boolean;
  message?: Message;
  error?: string;
}

interface GroupCreatedData {
  conversation: {
    id: string;
    type: string;
    name: string | null;
    avatar: string | null;
    ownerId: string | null;
    memberCount: number;
    createdAt: string;
  };
  memberIds: string[];
  createdBy: {
    id: string;
    name: string | null;
    loginName: string;
  };
}

interface GroupDissolvedData {
  conversationId: string;
  memberIds: string[];
  dissolvedBy: {
    id: string;
    name: string | null;
    loginName: string;
  };
}

interface MessageRecalledData {
  messageId: string;
  conversationId: string;
  msgSeq: number;
  memberIds: string[];
  recalledBy: {
    id: string;
    name: string | null;
    loginName: string;
  };
}

type MessageHandler = (data: NewMessageData) => void;
type TypingHandler = (data: TypingData) => void;
type ReadHandler = (data: ReadData) => void;
type OnlineHandler = (data: OnlineOfflineData) => void;
type OfflineHandler = (data: OnlineOfflineData) => void;
type MessageAckHandler = (requestId: string, data: MessageAckData) => void;
type GroupCreatedHandler = (data: GroupCreatedData) => void;
type GroupDissolvedHandler = (data: GroupDissolvedData) => void;
type MessageRecalledHandler = (data: MessageRecalledData) => void;

interface WsState {
  isConnected: boolean;
  isAuthenticated: boolean;
  user: WsUser | null;
  onlineUsers: string[];
  reconnectAttempts: number;
}

// ============ WebSocket Store ============
function createWebSocketStore() {
  let ws: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let pingTimer: ReturnType<typeof setInterval> | null = null;
  let requestIdCounter = 0;

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000;
  const PING_INTERVAL = 30000;

  let state = $state<WsState>({
    isConnected: false,
    isAuthenticated: false,
    user: null,
    onlineUsers: [],
    reconnectAttempts: 0,
  });

  // Event handlers
  const messageHandlers = new Set<MessageHandler>();
  const typingHandlers = new Set<TypingHandler>();
  const readHandlers = new Set<ReadHandler>();
  const onlineHandlers = new Set<OnlineHandler>();
  const offlineHandlers = new Set<OfflineHandler>();
  const messageAckHandlers = new Map<string, MessageAckHandler>();
  const groupCreatedHandlers = new Set<GroupCreatedHandler>();
  const groupDissolvedHandlers = new Set<GroupDissolvedHandler>();
  const messageRecalledHandlers = new Set<MessageRecalledHandler>();

  function generateRequestId(): string {
    return `req_${Date.now()}_${++requestIdCounter}`;
  }

  function startPing() {
    stopPing();
    pingTimer = setInterval(() => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }));
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

      switch (msg.type) {
        case 'auth_success': {
          const data = msg.data as { user: WsUser; onlineUsers: string[] };
          state.isAuthenticated = true;
          state.user = data.user;
          state.onlineUsers = data.onlineUsers;
          state.reconnectAttempts = 0;
          startPing();
          console.log('WebSocket authenticated:', data.user.loginName);
          break;
        }

        case 'auth_error': {
          console.error('WebSocket auth error:', msg.data);
          state.isAuthenticated = false;
          disconnect();
          break;
        }

        case 'new_message': {
          const data = msg.data as NewMessageData;
          messageHandlers.forEach(handler => handler(data));
          break;
        }

        case 'message_ack': {
          const data = msg.data as MessageAckData;
          if (msg.requestId) {
            const handler = messageAckHandlers.get(msg.requestId);
            if (handler) {
              handler(msg.requestId, data);
              messageAckHandlers.delete(msg.requestId);
            }
          }
          break;
        }

        case 'typing': {
          const data = msg.data as TypingData;
          typingHandlers.forEach(handler => handler(data));
          break;
        }

        case 'read': {
          const data = msg.data as ReadData;
          readHandlers.forEach(handler => handler(data));
          break;
        }

        case 'online': {
          const data = msg.data as OnlineOfflineData;
          if (!state.onlineUsers.includes(data.userId)) {
            state.onlineUsers = [...state.onlineUsers, data.userId];
          }
          onlineHandlers.forEach(handler => handler(data));
          break;
        }

        case 'offline': {
          const data = msg.data as OnlineOfflineData;
          state.onlineUsers = state.onlineUsers.filter(id => id !== data.userId);
          offlineHandlers.forEach(handler => handler(data));
          break;
        }

        case 'group_created': {
          const data = msg.data as GroupCreatedData;
          groupCreatedHandlers.forEach(handler => handler(data));
          break;
        }

        case 'group_dissolved': {
          const data = msg.data as GroupDissolvedData;
          groupDissolvedHandlers.forEach(handler => handler(data));
          break;
        }

        case 'message_recalled': {
          const data = msg.data as MessageRecalledData;
          messageRecalledHandlers.forEach(handler => handler(data));
          break;
        }

        case 'pong':
          // Heartbeat response, no action needed
          break;

        case 'error':
          console.error('WebSocket error:', msg.data);
          break;
      }
    } catch (e) {
      console.error('Failed to parse WebSocket message:', e);
    }
  }

  function connect() {
    if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
      return;
    }

    if (!authStore.accessToken) {
      console.warn('Cannot connect WebSocket: no access token');
      return;
    }

    try {
      ws = new WebSocket(`${WS_BASE}/ws/im`);

      ws.onopen = () => {
        state.isConnected = true;
        console.log('WebSocket connected, sending auth...');
        
        // Send auth message
        ws!.send(JSON.stringify({
          type: 'auth',
          data: { token: authStore.accessToken },
        }));
      };

      ws.onmessage = handleMessage;

      ws.onclose = (event) => {
        state.isConnected = false;
        state.isAuthenticated = false;
        stopPing();
        console.log('WebSocket closed:', event.code, event.reason);

        // Auto reconnect if not intentionally closed
        if (event.code !== 1000 && state.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          scheduleReconnect();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (e) {
      console.error('Failed to create WebSocket:', e);
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
    state.reconnectAttempts = 0;
  }

  function scheduleReconnect() {
    if (reconnectTimer) return;

    state.reconnectAttempts++;
    const delay = RECONNECT_DELAY * state.reconnectAttempts;
    console.log(`Scheduling reconnect in ${delay}ms (attempt ${state.reconnectAttempts})`);

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, delay);
  }

  function send(message: WsMessage) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  // ============ Public API ============
  function sendMessage(
    conversationId: string,
    msgType: string,
    content: MessageContent,
    options?: { replyToId?: string; atUserIds?: string[] }
  ): Promise<Message> {
    return new Promise((resolve, reject) => {
      const requestId = generateRequestId();

      const handler: MessageAckHandler = (_reqId, data) => {
        if (data.success && data.message) {
          resolve(data.message);
        } else {
          reject(new Error(data.error || 'Failed to send message'));
        }
      };

      messageAckHandlers.set(requestId, handler);

      // Timeout after 10 seconds
      setTimeout(() => {
        if (messageAckHandlers.has(requestId)) {
          messageAckHandlers.delete(requestId);
          reject(new Error('Message send timeout'));
        }
      }, 10000);

      send({
        type: 'message',
        requestId,
        data: {
          conversationId,
          msgType,
          content,
          ...options,
        },
      });
    });
  }

  function sendTyping(conversationId: string) {
    send({
      type: 'typing',
      data: { conversationId },
    });
  }

  function sendRead(conversationId: string, lastReadSeq: number) {
    send({
      type: 'read',
      data: { conversationId, lastReadSeq },
    });
  }

  function isUserOnline(userId: string): boolean {
    return state.onlineUsers.includes(userId);
  }

  // Event subscription
  function onMessage(handler: MessageHandler): () => void {
    messageHandlers.add(handler);
    return () => messageHandlers.delete(handler);
  }

  function onTyping(handler: TypingHandler): () => void {
    typingHandlers.add(handler);
    return () => typingHandlers.delete(handler);
  }

  function onRead(handler: ReadHandler): () => void {
    readHandlers.add(handler);
    return () => readHandlers.delete(handler);
  }

  function onOnline(handler: OnlineHandler): () => void {
    onlineHandlers.add(handler);
    return () => onlineHandlers.delete(handler);
  }

  function onOffline(handler: OfflineHandler): () => void {
    offlineHandlers.add(handler);
    return () => offlineHandlers.delete(handler);
  }

  function onGroupCreated(handler: GroupCreatedHandler): () => void {
    groupCreatedHandlers.add(handler);
    return () => groupCreatedHandlers.delete(handler);
  }

  function onGroupDissolved(handler: GroupDissolvedHandler): () => void {
    groupDissolvedHandlers.add(handler);
    return () => groupDissolvedHandlers.delete(handler);
  }

  function onMessageRecalled(handler: MessageRecalledHandler): () => void {
    messageRecalledHandlers.add(handler);
    return () => messageRecalledHandlers.delete(handler);
  }

  return {
    get state() { return state; },
    get isConnected() { return state.isConnected; },
    get isAuthenticated() { return state.isAuthenticated; },
    get onlineUsers() { return state.onlineUsers; },
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    sendRead,
    isUserOnline,
    onMessage,
    onTyping,
    onRead,
    onOnline,
    onOffline,
    onGroupCreated,
    onGroupDissolved,
    onMessageRecalled,
  };
}

export const wsStore = createWebSocketStore();
