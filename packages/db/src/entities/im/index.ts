// IM entities - tables, fields, meta, config, schemas
export { conversation, conversationFields, conversationMeta, conversationConfig, conversationZodSchemas } from './conversation';
export { message, messageFields, messageMeta, messageConfig, messageZodSchemas, MESSAGE_TYPES } from './message';
export type { TextContent, LinkContent, ImageContent, VideoContent, AudioContent, FileContent, SystemContent, RecallContent, MessageContent } from './message';
export { groupMember, groupMemberFields, groupMemberMeta, groupMemberConfig, groupMemberZodSchemas, GROUP_MEMBER_ROLES } from './groupMember';
export { conversationRead, conversationReadFields, conversationReadMeta, conversationReadConfig, conversationReadZodSchemas } from './conversationRead';
export { conversationHidden, conversationHiddenFields, conversationHiddenMeta, conversationHiddenConfig, conversationHiddenZodSchemas } from './conversationHidden';
export { tempFile, tempFileFields, tempFileMeta, tempFileConfig, tempFileZodSchemas } from './tempFile';

// Relations
export * from './relations';

// Export schemas for drizzle-kit
export * from './exportSchemas';

// Conversation status constants
export const CONVERSATION_STATUS = {
  ACTIVE: '0',      // 正常
  DISSOLVED: '1',   // 已解散
} as const;
