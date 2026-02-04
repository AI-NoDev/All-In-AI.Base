import { relations } from "drizzle-orm";
import { conversation } from "./conversation";
import { message } from "./message";
import { groupMember } from "./groupMember";
import { conversationRead } from "./conversationRead";
import { tempFile } from "./tempFile";

// 会话关系
export const conversationRelations = relations(conversation, ({ many }) => ({
  messages: many(message),
  members: many(groupMember),
  readStatuses: many(conversationRead),
  tempFiles: many(tempFile),
}));

// 消息关系
export const messageRelations = relations(message, ({ one, many }) => ({
  conversation: one(conversation, {
    fields: [message.conversationId],
    references: [conversation.id],
  }),
  replyTo: one(message, {
    fields: [message.replyToId],
    references: [message.id],
    relationName: "messageReply",
  }),
  replies: many(message, { relationName: "messageReply" }),
  forwardFrom: one(message, {
    fields: [message.forwardFromId],
    references: [message.id],
    relationName: "messageForward",
  }),
  forwards: many(message, { relationName: "messageForward" }),
  tempFiles: many(tempFile),
}));

// 群成员关系
export const groupMemberRelations = relations(groupMember, ({ one }) => ({
  conversation: one(conversation, {
    fields: [groupMember.conversationId],
    references: [conversation.id],
  }),
}));

// 已读状态关系
export const conversationReadRelations = relations(conversationRead, ({ one }) => ({
  conversation: one(conversation, {
    fields: [conversationRead.conversationId],
    references: [conversation.id],
  }),
}));

// 临时文件关系
export const tempFileRelations = relations(tempFile, ({ one }) => ({
  conversation: one(conversation, {
    fields: [tempFile.conversationId],
    references: [conversation.id],
  }),
  message: one(message, {
    fields: [tempFile.messageId],
    references: [message.id],
  }),
}));
