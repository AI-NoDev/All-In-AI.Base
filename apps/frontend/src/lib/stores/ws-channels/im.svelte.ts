/**
 * IM 频道 Hooks
 * 处理即时通讯相关的 WebSocket 消息
 */

import { wsStore } from '../websocket.svelte';
import { toast } from 'svelte-sonner';

const CHANNEL = 'im';

// ============ Types ============
interface WsUser {
  id: string;
  name: string | null;
  loginName: string;
}

interface MessageContent {
  text?: string;
  fileId?: string;
  url?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
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
  createdBy: WsUser;
}

interface GroupDissolvedData {
  conversationId: string;
  memberIds: string[];
  dissolvedBy: WsUser;
}

interface MessageRecalledData {
  messageId: string;
  conversationId: string;
  msgSeq: number;
  memberIds: string[];
  recalledBy: WsUser;
}

// ============ Handlers ============
type MessageHandler = (data: NewMessageData) => void;
type TypingHandler = (data: TypingData) => void;
type ReadHandler = (data: ReadData) => void;
type OnlineHandler = (data: OnlineOfflineData) => void;
type OfflineHandler = (data: OnlineOfflineData) => void;
type GroupCreatedHandler = (data: GroupCreatedData) => void;
type GroupDissolvedHandler = (data: GroupDissolvedData) => void;
type MessageRecalledHandler = (data: MessageRecalledData) => void;

const messageHandlers = new Set<MessageHandler>();
const typingHandlers = new Set<TypingHandler>();
const readHandlers = new Set<ReadHandler>();
const onlineHandlers = new Set<OnlineHandler>();
const offlineHandlers = new Set<OfflineHandler>();
const groupCreatedHandlers = new Set<GroupCreatedHandler>();
const groupDissolvedHandlers = new Set<GroupDissolvedHandler>();
const messageRecalledHandlers = new Set<MessageRecalledHandler>();

// 消息预览
function getMessagePreview(message: Message): string {
  switch (message.msgType) {
    case 'text':
      const text = message.content.text || '';
      return text.length > 20 ? text.slice(0, 20) + '...' : text;
    case 'image':
      return '[图片]';
    case 'file':
      return '[文件]';
    case 'audio':
      return message.content.duration ? `[语音 ${message.content.duration}s]` : '[语音]';
    case 'video':
      return message.content.duration ? `[视频 ${message.content.duration}s]` : '[视频]';
    default:
      return '[消息]';
  }
}

// 频道消息处理
function handleChannelMessage(type: string, data: unknown) {
  switch (type) {
    case 'new_message': {
      const msgData = data as NewMessageData;
      messageHandlers.forEach(h => h(msgData));
      
      // Toast 通知
      if (msgData.sender.id !== wsStore.state.user?.id) {
        const senderName = msgData.sender.name || msgData.sender.loginName;
        const preview = getMessagePreview(msgData.message);
        toast(`${senderName}: ${preview}`, {
          action: {
            label: '查看',
            onClick: () => {
              window.location.href = `/dashboard/contacts/chat?id=${msgData.message.conversationId}`;
            },
          },
        });
      }
      break;
    }

    case 'message_ack':
      // 由 sendMessage Promise 处理
      break;

    case 'typing':
      typingHandlers.forEach(h => h(data as TypingData));
      break;

    case 'read':
      readHandlers.forEach(h => h(data as ReadData));
      break;

    case 'online':
      onlineHandlers.forEach(h => h(data as OnlineOfflineData));
      break;

    case 'offline':
      offlineHandlers.forEach(h => h(data as OnlineOfflineData));
      break;

    case 'group_created':
      groupCreatedHandlers.forEach(h => h(data as GroupCreatedData));
      break;

    case 'group_dissolved':
      groupDissolvedHandlers.forEach(h => h(data as GroupDissolvedData));
      break;

    case 'message_recalled':
      messageRecalledHandlers.forEach(h => h(data as MessageRecalledData));
      break;
  }
}

// ============ Public API ============
let isInitialized = false;

export function initImChannel() {
  if (isInitialized) return;
  isInitialized = true;
  
  wsStore.onChannel(CHANNEL, handleChannelMessage);
  wsStore.subscribe([CHANNEL]);
}

export function sendMessage(
  conversationId: string,
  msgType: string,
  content: MessageContent,
  options?: { replyToId?: string; atUserIds?: string[] }
): Promise<Message> {
  return wsStore.sendWithResponse<unknown, MessageAckData>(
    CHANNEL,
    'message',
    { conversationId, msgType, content, ...options }
  ).then(ack => {
    if (ack.success && ack.message) {
      return ack.message;
    }
    throw new Error(ack.error || 'Failed to send message');
  });
}

export function sendTyping(conversationId: string) {
  wsStore.send(CHANNEL, 'typing', { conversationId });
}

export function sendRead(conversationId: string, lastReadSeq: number) {
  wsStore.send(CHANNEL, 'read', { conversationId, lastReadSeq });
}

// Event subscriptions
export function onMessage(handler: MessageHandler): () => void {
  messageHandlers.add(handler);
  return () => messageHandlers.delete(handler);
}

export function onTyping(handler: TypingHandler): () => void {
  typingHandlers.add(handler);
  return () => typingHandlers.delete(handler);
}

export function onRead(handler: ReadHandler): () => void {
  readHandlers.add(handler);
  return () => readHandlers.delete(handler);
}

export function onOnline(handler: OnlineHandler): () => void {
  onlineHandlers.add(handler);
  return () => onlineHandlers.delete(handler);
}

export function onOffline(handler: OfflineHandler): () => void {
  offlineHandlers.add(handler);
  return () => offlineHandlers.delete(handler);
}

export function onGroupCreated(handler: GroupCreatedHandler): () => void {
  groupCreatedHandlers.add(handler);
  return () => groupCreatedHandlers.delete(handler);
}

export function onGroupDissolved(handler: GroupDissolvedHandler): () => void {
  groupDissolvedHandlers.add(handler);
  return () => groupDissolvedHandlers.delete(handler);
}

export function onMessageRecalled(handler: MessageRecalledHandler): () => void {
  messageRecalledHandlers.add(handler);
  return () => messageRecalledHandlers.delete(handler);
}

// 导出 IM 频道 hooks
export const imChannel = {
  init: initImChannel,
  sendMessage,
  sendTyping,
  sendRead,
  onMessage,
  onTyping,
  onRead,
  onOnline,
  onOffline,
  onGroupCreated,
  onGroupDissolved,
  onMessageRecalled,
};
