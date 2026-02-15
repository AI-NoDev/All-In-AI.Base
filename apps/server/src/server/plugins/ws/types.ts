/**
 * WebSocket 多频道架构类型定义
 */

// WebSocket 实例类型
export interface ElysiaWs {
  id: string;
  send: (data: string) => void;
  close: () => void;
  data: { jwt: { verify: (token: string) => Promise<{ sub?: string } | false> } };
}

// 认证用户信息
export interface WsUser {
  id: string;
  name: string | null;
  loginName: string;
}

// 基础消息结构
export interface WsMessage<T = unknown> {
  channel: string;      // 频道名称: 'im', 'monitor', 'notification' 等
  type: string;         // 消息类型
  data?: T;             // 消息数据
  requestId?: string;   // 请求ID（用于请求-响应模式）
}

// 频道订阅信息
export interface ChannelSubscription {
  channel: string;
  subscribedAt: number;
}

// 连接信息
export interface ConnectionInfo {
  wsId: string;
  user: WsUser;
  ws: ElysiaWs;
  channels: Set<string>;
  subscribedAt: number;
}

// 频道处理器接口
export interface WsChannelHandler {
  // 频道名称
  channel: string;
  
  // 处理消息
  onMessage: (
    wsId: string,
    user: WsUser,
    type: string,
    data: unknown,
    requestId?: string
  ) => Promise<void> | void;
  
  // 用户订阅频道时
  onSubscribe?: (wsId: string, user: WsUser) => Promise<void> | void;
  
  // 用户取消订阅时
  onUnsubscribe?: (wsId: string, user: WsUser) => Promise<void> | void;
  
  // 用户断开连接时（清理资源）
  onDisconnect?: (wsId: string, user: WsUser) => Promise<void> | void;
}

// 系统消息类型
export type SystemMessageType = 
  | 'auth'
  | 'auth_success'
  | 'auth_error'
  | 'subscribe'
  | 'subscribe_success'
  | 'unsubscribe'
  | 'unsubscribe_success'
  | 'ping'
  | 'pong'
  | 'error';
