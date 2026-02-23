// IM entities - tables, fields, meta, config, schemas
export { conversation, conversationFields, conversationMeta, conversationConfig, conversationSchemas } from './conversation';
export type { ConversationSelect, ConversationInsert } from './conversation';
export { message, messageFields, messageMeta, messageConfig, messageSchemas, MESSAGE_TYPES } from './message';
export type { TextContent, LinkContent, ImageContent, VideoContent, AudioContent, FileContent, SystemContent, RecallContent, MessageContent, MessageSelect, MessageInsert } from './message';
export { groupMember, groupMemberFields, groupMemberMeta, groupMemberConfig, groupMemberSchemas, GROUP_MEMBER_ROLES } from './groupMember';
export type { GroupMemberSelect, GroupMemberInsert } from './groupMember';
export { conversationRead, conversationReadFields, conversationReadMeta, conversationReadConfig, conversationReadSchemas } from './conversationRead';
export type { ConversationReadSelect, ConversationReadInsert } from './conversationRead';
export { conversationHidden, conversationHiddenFields, conversationHiddenMeta, conversationHiddenConfig, conversationHiddenSchemas } from './conversationHidden';
export type { ConversationHiddenSelect, ConversationHiddenInsert } from './conversationHidden';
export { tempFile, tempFileFields, tempFileMeta, tempFileConfig, tempFileSchemas } from './tempFile';
export type { TempFileSelect, TempFileInsert } from './tempFile';

// Relations
export * from './relations';

// Export schemas for drizzle-kit
export * from './exportSchemas';

// Conversation status constants
export const CONVERSATION_STATUS = {
  ACTIVE: '0',      // 正常
  DISSOLVED: '1',   // 已解散
} as const;
