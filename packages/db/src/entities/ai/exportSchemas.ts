/**
 * 导出所有 ai 模块的 table 和 relations，供 drizzle-kit 迁移使用
 */
export { agent } from './agent';
export { aiSession } from './aiSession';
export { aiSessionMessage } from './aiSessionMessage';
export { userMemory } from './userMemory';
// Legacy tables (deprecated, kept for migration)
export { agentSession } from './agentSession';
export { agentMessage } from './agentMessage';
export { model } from './model';
export { provider } from './provider';
export { tool } from './tool';
export { toolGroup } from './toolGroup';
export { schema } from './schema';
export { mcpServer } from './mcpServer';
export { apiKey } from './apiKey';
export { apiKeyMcp } from './apiKeyMcp';

// Relations
export * from './relations';
