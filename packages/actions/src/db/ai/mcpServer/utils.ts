/**
 * MCP服务模块工具函数
 */

import { mcpServer } from '@qiyu-allinai/db/entities/ai';

/** MCP服务类型定义 */
export type McpServerSelect = typeof mcpServer.$inferSelect;
export type McpServerInsert = typeof mcpServer.$inferInsert;
