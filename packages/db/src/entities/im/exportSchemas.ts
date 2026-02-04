/**
 * 导出所有 im 模块的 table 和 relations，供 drizzle-kit 迁移使用
 */
export { conversation } from './conversation';
export { message } from './message';
export { groupMember } from './groupMember';
export { conversationRead } from './conversationRead';
export { conversationHidden } from './conversationHidden';
export { tempFile } from './tempFile';

// Relations
export * from './relations';
