/**
 * 获取会话文件列表
 */

import { z } from 'zod';
import { eq, and, isNull, inArray, desc } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { conversation, groupMember, message } from '@qiyu-allinai/db/entities/im';
import { user } from '@qiyu-allinai/db/entities/system';

/** 文件消息内容类型 */
interface FileContent {
  fileId: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  duration?: number;
}

export const conversationGetFiles = defineAction({
  meta: {
    name: 'im.conversation.getFiles',
    displayName: '获取会话文件',
    description: '获取当前用户所有会话中的文件列表',
    tags: ['im', 'conversation'],
    method: 'GET',
    path: '/api/im/conversation-files',
  },
  schemas: {
    outputSchema: z.object({
      files: z.array(z.object({
        messageId: z.string(),
        conversationId: z.string(),
        conversationName: z.string(),
        conversationType: z.enum(['private', 'group']),
        fileId: z.string(),
        fileName: z.string(),
        fileSize: z.number(),
        mimeType: z.string(),
        msgType: z.string(),
        senderId: z.string(),
        senderName: z.string(),
        createdAt: z.string(),
      })),
      conversations: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['private', 'group']),
      })),
    }),
  },
  execute: async (_input, context) => {
    const { db, currentUserId } = context;
    
    // IM 权限基于成员关系：只获取用户参与的会话文件
    
    // 获取当前用户参与的所有会话
    const userConversations = await db
      .select({ conversationId: groupMember.conversationId })
      .from(groupMember)
      .where(eq(groupMember.userId, currentUserId));
    
    const conversationIds = userConversations.map(c => c.conversationId);
    
    if (conversationIds.length === 0) {
      return { files: [], conversations: [] };
    }
    
    // 获取会话信息
    const conversationList = await db
      .select({
        id: conversation.id,
        name: conversation.name,
        type: conversation.type,
      })
      .from(conversation)
      .where(and(
        inArray(conversation.id, conversationIds),
        isNull(conversation.deletedAt)
      ));
    
    // 获取这些会话中的文件消息 (msgType: 03=图片, 04=视频, 05=音频, 06=文件)
    const fileMessages = await db
      .select({
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        msgType: message.msgType,
        content: message.content,
        createdAt: message.createdAt,
      })
      .from(message)
      .where(and(
        inArray(message.conversationId, conversationIds),
        inArray(message.msgType, ['03', '04', '05', '06']),
        eq(message.isRecalled, false)
      ))
      .orderBy(desc(message.createdAt))
      .limit(500);
    
    // 获取发送者信息
    const senderIds = [...new Set(fileMessages.map(m => m.senderId))];
    const senders = senderIds.length > 0 
      ? await db.select({ id: user.id, name: user.name }).from(user).where(inArray(user.id, senderIds))
      : [];
    const senderMap = new Map(senders.map(s => [s.id, s.name]));
    
    // 构建会话名称映射
    const convMap = new Map(conversationList.map(c => [c.id, { name: c.name || '未命名会话', type: c.type }]));
    
    // 构建文件列表
    const files = fileMessages.map(msg => {
      const content = msg.content as FileContent;
      const conv = convMap.get(msg.conversationId);
      
      return {
        messageId: msg.id,
        conversationId: msg.conversationId,
        conversationName: conv?.name || '未命名会话',
        conversationType: (conv?.type === '1' ? 'private' : 'group') as 'private' | 'group',
        fileId: content.fileId,
        fileName: content.fileName || '未命名文件',
        fileSize: content.fileSize || 0,
        mimeType: content.mimeType || 'application/octet-stream',
        msgType: msg.msgType,
        senderId: msg.senderId,
        senderName: senderMap.get(msg.senderId) || '未知用户',
        createdAt: msg.createdAt,
      };
    });
    
    const conversations = conversationList.map(c => ({
      id: c.id,
      name: c.name || '未命名会话',
      type: (c.type === '1' ? 'private' : 'group') as 'private' | 'group',
    }));
    
    return { files, conversations };
  },
});
