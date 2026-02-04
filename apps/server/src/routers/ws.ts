import { Elysia, t } from "elysia";
import { eq, and, sql, inArray } from "drizzle-orm";
import db from "@qiyu-allinai/db/connect";
import { user } from "@qiyu-allinai/db/entities/system";
import { conversation, message, groupMember, conversationRead, conversationHidden } from "@qiyu-allinai/db/entities/im";
import { jwtPlugin } from "../server/plugins/jwt";
import { actionEvents } from "@qiyu-allinai/actions";

// ============ Types ============
interface WsUser {
  id: string;
  name: string | null;
  loginName: string;
}

interface ElysiaWs {
  id: string;
  send: (data: string) => void;
  close: () => void;
  data: { jwt: { verify: (token: string) => Promise<{ sub?: string } | false> } };
}

// WebSocket 消息类型
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

interface SendMessageData {
  conversationId: string;
  msgType: string;
  content: unknown;
  replyToId?: string;
  atUserIds?: string[];
}

interface TypingData {
  conversationId: string;
}

interface ReadData {
  conversationId: string;
  lastReadSeq: number;
}

// ============ Connection Manager ============
class ConnectionManager {
  // wsId -> WsUser (认证后的用户信息)
  private wsIdToUser = new Map<string, WsUser>();
  // wsId -> ws instance
  private wsIdToWs = new Map<string, ElysiaWs>();
  // userId -> Set of wsIds (支持多设备)
  private userIdToWsIds = new Map<string, Set<string>>();

  addConnection(wsId: string, wsUser: WsUser, ws: ElysiaWs) {
    this.wsIdToUser.set(wsId, wsUser);
    this.wsIdToWs.set(wsId, ws);
    
    if (!this.userIdToWsIds.has(wsUser.id)) {
      this.userIdToWsIds.set(wsUser.id, new Set());
    }
    this.userIdToWsIds.get(wsUser.id)!.add(wsId);
  }

  removeConnection(wsId: string): WsUser | undefined {
    const wsUser = this.wsIdToUser.get(wsId);
    if (wsUser) {
      this.wsIdToUser.delete(wsId);
      this.wsIdToWs.delete(wsId);
      
      const userWsIds = this.userIdToWsIds.get(wsUser.id);
      if (userWsIds) {
        userWsIds.delete(wsId);
        if (userWsIds.size === 0) {
          this.userIdToWsIds.delete(wsUser.id);
        }
      }
    }
    return wsUser;
  }

  getUser(wsId: string): WsUser | undefined {
    return this.wsIdToUser.get(wsId);
  }

  isOnline(userId: string): boolean {
    const wsIds = this.userIdToWsIds.get(userId);
    return !!wsIds && wsIds.size > 0;
  }

  getOnlineUsers(): string[] {
    return Array.from(this.userIdToWsIds.keys());
  }

  sendToUser(userId: string, message: WsMessage) {
    const wsIds = this.userIdToWsIds.get(userId);
    if (wsIds) {
      const msgStr = JSON.stringify(message);
      for (const wsId of wsIds) {
        const ws = this.wsIdToWs.get(wsId);
        if (ws) {
          try {
            ws.send(msgStr);
          } catch (e) {
            console.error('Failed to send message to user:', userId, e);
          }
        }
      }
    }
  }

  sendToUsers(userIds: string[], message: WsMessage) {
    for (const userId of userIds) {
      this.sendToUser(userId, message);
    }
  }

  broadcast(message: WsMessage, excludeUserId?: string) {
    const msgStr = JSON.stringify(message);
    for (const [userId, wsIds] of this.userIdToWsIds) {
      if (userId === excludeUserId) continue;
      for (const wsId of wsIds) {
        const ws = this.wsIdToWs.get(wsId);
        if (ws) {
          try {
            ws.send(msgStr);
          } catch (e) {
            console.error('Failed to broadcast to user:', userId, e);
          }
        }
      }
    }
  }
}

const connectionManager = new ConnectionManager();

// ============ Event Subscriptions ============
// Subscribe to group_created events from actions and broadcast to members
actionEvents.on('group_created', (data) => {
  // Broadcast to all members (including the creator)
  connectionManager.sendToUsers(data.memberIds, {
    type: 'group_created',
    data,
  });
  console.log(`Group created: ${data.conversation.name}, notified ${data.memberIds.length} members`);
});

// Subscribe to group_dissolved events
actionEvents.on('group_dissolved', (data) => {
  connectionManager.sendToUsers(data.memberIds, {
    type: 'group_dissolved',
    data,
  });
  console.log(`Group dissolved: ${data.conversationId}, notified ${data.memberIds.length} members`);
});

// Subscribe to message_recalled events
actionEvents.on('message_recalled', (data) => {
  connectionManager.sendToUsers(data.memberIds, {
    type: 'message_recalled',
    data,
  });
  console.log(`Message recalled: ${data.messageId} in conversation ${data.conversationId}`);
});

// ============ Helper Functions ============
async function getConversationMembers(conversationId: string): Promise<string[]> {
  const members = await db.select({ userId: groupMember.userId })
    .from(groupMember).where(eq(groupMember.conversationId, conversationId));
  return members.map(m => m.userId);
}

async function handleSendMessage(wsUser: WsUser, data: SendMessageData, requestId?: string) {
  try {
    const { conversationId, msgType, content, replyToId, atUserIds } = data;
    
    const seqResult = await db.select({ maxSeq: sql<number>`COALESCE(MAX(msg_seq), 0)` })
      .from(message).where(eq(message.conversationId, conversationId));
    const nextSeq = (seqResult[0]?.maxSeq ?? 0) + 1;
    
    const [newMessage] = await db.insert(message).values({
      conversationId,
      senderId: wsUser.id,
      msgType,
      msgSeq: nextSeq,
      content: content as typeof message.$inferInsert['content'],
      replyToId,
      atUserIds: atUserIds || [],
    }).returning();
    
    await db.update(conversation).set({
      lastMessageId: newMessage.id,
      lastMessageAt: newMessage.createdAt,
      updatedAt: new Date().toISOString(),
    }).where(eq(conversation.id, conversationId));
    
    const memberIds = await getConversationMembers(conversationId);
    const otherMemberIds = memberIds.filter(id => id !== wsUser.id);
    
    // Unhide conversation for all members who have it hidden
    if (memberIds.length > 0) {
      await db.update(conversationHidden).set({
        isHidden: false,
        updatedAt: new Date().toISOString(),
      }).where(and(
        eq(conversationHidden.conversationId, conversationId),
        inArray(conversationHidden.userId, memberIds),
        eq(conversationHidden.isHidden, true)
      ));
    }
    
    if (otherMemberIds.length > 0) {
      for (const memberId of otherMemberIds) {
        const [existing] = await db.select().from(conversationRead)
          .where(and(
            eq(conversationRead.conversationId, conversationId),
            eq(conversationRead.userId, memberId)
          )).limit(1);
        
        if (existing) {
          await db.update(conversationRead).set({
            unreadCount: sql`unread_count + 1`
          }).where(and(
            eq(conversationRead.conversationId, conversationId),
            eq(conversationRead.userId, memberId)
          ));
        } else {
          await db.insert(conversationRead).values({
            conversationId,
            userId: memberId,
            lastReadSeq: 0,
            unreadCount: 1,
          });
        }
      }
    }
    
    connectionManager.sendToUser(wsUser.id, {
      type: 'message_ack',
      requestId,
      data: { success: true, message: newMessage },
    });
    
    connectionManager.sendToUsers(otherMemberIds, {
      type: 'new_message',
      data: {
        message: newMessage,
        sender: { id: wsUser.id, name: wsUser.name, loginName: wsUser.loginName },
      },
    });
    
  } catch (error) {
    console.error('Failed to send message:', error);
    connectionManager.sendToUser(wsUser.id, {
      type: 'error',
      requestId,
      data: { message: 'Failed to send message' },
    });
  }
}

async function handleTyping(wsUser: WsUser, data: TypingData) {
  const { conversationId } = data;
  const memberIds = await getConversationMembers(conversationId);
  const otherMemberIds = memberIds.filter(id => id !== wsUser.id);
  
  connectionManager.sendToUsers(otherMemberIds, {
    type: 'typing',
    data: {
      conversationId,
      userId: wsUser.id,
      userName: wsUser.name || wsUser.loginName,
    },
  });
}

async function handleRead(wsUser: WsUser, data: ReadData) {
  const { conversationId, lastReadSeq } = data;
  
  const [existing] = await db.select().from(conversationRead)
    .where(and(
      eq(conversationRead.conversationId, conversationId),
      eq(conversationRead.userId, wsUser.id)
    )).limit(1);
  
  if (existing) {
    await db.update(conversationRead).set({
      lastReadSeq,
      lastReadAt: new Date().toISOString(),
      unreadCount: 0,
    }).where(and(
      eq(conversationRead.conversationId, conversationId),
      eq(conversationRead.userId, wsUser.id)
    ));
  } else {
    await db.insert(conversationRead).values({
      conversationId,
      userId: wsUser.id,
      lastReadSeq,
      unreadCount: 0,
    });
  }
  
  const memberIds = await getConversationMembers(conversationId);
  const otherMemberIds = memberIds.filter(id => id !== wsUser.id);
  
  connectionManager.sendToUsers(otherMemberIds, {
    type: 'read',
    data: { conversationId, userId: wsUser.id, lastReadSeq },
  });
}

// ============ WebSocket Router ============
export const wsRouter = new Elysia({ prefix: "/ws" })
  .use(jwtPlugin)
  .ws("/im", {
    body: t.Object({
      type: t.String(),
      data: t.Optional(t.Unknown()),
      requestId: t.Optional(t.String()),
    }),
    
    open(ws) {
      console.log(`WebSocket connection opened: ${ws.id}`);
    },
    
    async message(ws, msg) {
      const { type, data, requestId } = msg as WsMessage;
      const wsId = ws.id;
      const wsUser = connectionManager.getUser(wsId);
      
      // 处理认证消息
      if (type === 'auth') {
        const token = (data as { token: string })?.token;
        if (!token) {
          ws.send(JSON.stringify({ type: 'auth_error', data: { message: 'Token required' } }));
          ws.close();
          return;
        }
        
        try {
          const payload = await ws.data.jwt.verify(token);
          if (!payload || !payload.sub) {
            ws.send(JSON.stringify({ type: 'auth_error', data: { message: 'Invalid token' } }));
            ws.close();
            return;
          }
          
          const [userResult] = await db.select({ id: user.id, name: user.name, loginName: user.loginName })
            .from(user).where(eq(user.id, payload.sub as string)).limit(1);
          
          if (!userResult) {
            ws.send(JSON.stringify({ type: 'auth_error', data: { message: 'User not found' } }));
            ws.close();
            return;
          }
          
          // 使用 ws.id 作为唯一标识
          connectionManager.addConnection(wsId, userResult, ws as unknown as ElysiaWs);
          
          ws.send(JSON.stringify({
            type: 'auth_success',
            data: {
              user: userResult,
              onlineUsers: connectionManager.getOnlineUsers(),
            },
          }));
          
          connectionManager.broadcast({
            type: 'online',
            data: { userId: userResult.id, userName: userResult.name || userResult.loginName },
          }, userResult.id);
          
          console.log(`User ${userResult.loginName} authenticated via WebSocket (wsId: ${wsId})`);
        } catch (error) {
          console.error('WebSocket auth error:', error);
          ws.send(JSON.stringify({ type: 'auth_error', data: { message: 'Authentication failed' } }));
          ws.close();
        }
        return;
      }
      
      // 处理心跳 - 不需要认证
      if (type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
        return;
      }
      
      // 其他消息需要已认证
      if (!wsUser) {
        ws.send(JSON.stringify({ type: 'error', data: { message: 'Not authenticated' } }));
        return;
      }
      
      switch (type) {
        case 'message':
          await handleSendMessage(wsUser, data as SendMessageData, requestId);
          break;
          
        case 'typing':
          await handleTyping(wsUser, data as TypingData);
          break;
          
        case 'read':
          await handleRead(wsUser, data as ReadData);
          break;
          
        default:
          ws.send(JSON.stringify({ type: 'error', data: { message: `Unknown message type: ${type}` } }));
      }
    },
    
    close(ws) {
      const wsUser = connectionManager.removeConnection(ws.id);
      if (wsUser) {
        if (!connectionManager.isOnline(wsUser.id)) {
          connectionManager.broadcast({
            type: 'offline',
            data: { userId: wsUser.id, userName: wsUser.name || wsUser.loginName },
          });
        }
        console.log(`User ${wsUser.loginName} disconnected from WebSocket (wsId: ${ws.id})`);
      }
    },
  });

export { connectionManager };
