// AI entities - tables, fields, meta, config, schemas
export { agent, agentFields, agentMeta, agentConfig, agentZodSchemas } from './agent';
export { aiSession, aiSessionFields, aiSessionMeta, aiSessionConfig, aiSessionZodSchemas } from './aiSession';
export type { TokenUsage } from './aiSession';
export { aiSessionMessage, aiSessionMessageFields, aiSessionMessageMeta, aiSessionMessageConfig, aiSessionMessageZodSchemas, AI_SESSION_MESSAGE_ROLES, AI_SESSION_MESSAGE_CONTENT_TYPES } from './aiSessionMessage';
export type { ToolCall, ToolResult, TextMessageContent, ImageMessageContent, FileMessageContent, AISessionMessageContent } from './aiSessionMessage';
// Legacy exports for backward compatibility (deprecated)
export { agentSession, agentSessionFields, agentSessionMeta, agentSessionConfig, agentSessionZodSchemas } from './agentSession';
export { agentMessage, agentMessageFields, agentMessageMeta, agentMessageConfig, agentMessageZodSchemas, AGENT_MESSAGE_ROLES, AGENT_MESSAGE_CONTENT_TYPES } from './agentMessage';
export type { AgentMessageContent } from './agentMessage';
export { model, modelFields, modelMeta, modelConfig, modelZodSchemas } from './model';
export { provider, providerFields, providerMeta, providerConfig, providerZodSchemas } from './provider';
export { tool, toolFields, toolMeta, toolConfig, toolZodSchemas } from './tool';
export { toolGroup, toolGroupFields, toolGroupMeta, toolGroupConfig, toolGroupZodSchemas } from './toolGroup';
export { schema, schemaFields, schemaMeta, schemaConfig, schemaZodSchemas } from './schema';
export { mcpServer, mcpServerFields, mcpServerMeta, mcpServerConfig, mcpServerZodSchemas } from './mcpServer';
export { apiKey, apiKeyFields, apiKeyMeta, apiKeyConfig, apiKeyZodSchemas } from './apiKey';
export { apiKeyMcp, apiKeyMcpMeta, apiKeyMcpZodSchemas, apiKeyMcpFieldComments } from './apiKeyMcp';

// Relations
export * from './relations';

// Export schemas for drizzle-kit
export * from './exportSchemas';
