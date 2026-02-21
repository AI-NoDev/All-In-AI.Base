/**
 * 用户记忆实体
 * 
 * 存储用户与 AI 交互过程中产生的记忆，支持语义检索
 * AI 可以通过检索用户记忆来提供个性化服务
 * 
 * 记忆类型：
 * - STM: 短期记忆（会话内临时信息，会过期）
 * - LTM: 长期记忆（持久化的重要信息）
 * - PREFERENCE: 偏好记忆（用户喜好/习惯）
 * - FACT: 事实记忆（用户相关的客观信息）
 * - EPISODIC: 情景记忆（特定事件/对话片段）
 */

import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text, char, jsonb, integer, timestamp, index, customType } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_ai_userMemory_meta_displayName as meta_displayName,
  db_ai_userMemory_meta_verboseName as meta_verboseName,
  db_ai_userMemory_meta_verboseNamePlural as meta_verboseNamePlural,
  db_ai_userMemory_userId as f_userId,
  db_ai_userMemory_agentId as f_agentId,
  db_ai_userMemory_sessionId as f_sessionId,
  db_ai_userMemory_memoryType as f_memoryType,
  db_ai_userMemory_content as f_content,
  db_ai_userMemory_metadata as f_metadata,
  db_ai_userMemory_importance as f_importance,
  db_ai_userMemory_accessCount as f_accessCount,
  db_ai_userMemory_lastAccessAt as f_lastAccessAt,
  db_ai_userMemory_expireAt as f_expireAt,
  db_ai_userMemory_embedding as f_embedding,
  db_ai_userMemory_status as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema, auditSchema } from '../base';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

// ============ 记忆类型常量 ============
export const MEMORY_TYPES = {
  STM: 'STM',             // 短期记忆
  LTM: 'LTM',             // 长期记忆
  PREFERENCE: 'PREFERENCE', // 偏好记忆
  FACT: 'FACT',           // 事实记忆
  EPISODIC: 'EPISODIC',   // 情景记忆
} as const;

export type MemoryType = typeof MEMORY_TYPES[keyof typeof MEMORY_TYPES];

// ============ 向量类型定义 ============
// pgvector 自定义类型（1536维，适配 OpenAI text-embedding-ada-002）
const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return 'vector(1536)';
  },
  toDriver(value: number[]): string {
    return `[${value.join(',')}]`;
  },
  fromDriver(value: string): number[] {
    const str = value.replace(/^\[|\]$/g, '');
    return str.split(',').map(Number);
  },
});

// ============ 元数据类型 ============
export interface MemoryMetadata {
  source?: string;           // 来源（对话/文档/用户输入等）
  tags?: string[];           // 标签
  context?: string;          // 上下文信息
  relatedMemoryIds?: string[]; // 关联记忆ID
  extractedFrom?: string;    // 从哪条消息提取
  confidence?: number;       // 置信度 0-1
  [key: string]: unknown;
}

// ============ Fields ============
const userMemoryOwnFields = {
  userId: {
    field: uuid("user_id").notNull(),
    comment: f_userId,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_userId, importExcelColumnName: f_userId, cellType: "STRING" as const }
  },
  agentId: {
    field: uuid("agent_id"),  // 可选，记录创建此记忆的 Agent（可能是外部 Agent）
    comment: f_agentId,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_agentId, importExcelColumnName: f_agentId, cellType: "STRING" as const }
  },
  sessionId: {
    field: uuid("session_id"),
    comment: f_sessionId,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_sessionId, importExcelColumnName: f_sessionId, cellType: "STRING" as const }
  },
  memoryType: {
    field: varchar("memory_type", { length: 16 }).notNull().default('LTM'),
    comment: f_memoryType,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_memoryType, importExcelColumnName: f_memoryType, cellType: "STRING" as const }
  },
  content: {
    field: text("content").notNull(),
    comment: f_content,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_content, importExcelColumnName: f_content, cellType: "TEXT" as const }
  },
  metadata: {
    field: jsonb("metadata").$type<MemoryMetadata>().default({}),
    comment: f_metadata,
    config: { canExport: false, canImport: false }
  },
  importance: {
    field: integer("importance").notNull().default(5),
    comment: f_importance,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_importance, importExcelColumnName: f_importance, cellType: "NUMERIC" as const }
  },
  accessCount: {
    field: integer("access_count").notNull().default(0),
    comment: f_accessCount,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_accessCount, cellType: "NUMERIC" as const }
  },
  lastAccessAt: {
    field: timestamp('last_access_at', { mode: 'string' }),
    comment: f_lastAccessAt,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_lastAccessAt, cellType: "STRING" as const }
  },
  expireAt: {
    field: timestamp('expire_at', { mode: 'string' }),
    comment: f_expireAt,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_expireAt, importExcelColumnName: f_expireAt, cellType: "STRING" as const }
  },
  embedding: {
    field: vector("embedding"),
    comment: f_embedding,
    config: { canExport: false, canImport: false }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_status, importExcelColumnName: f_status, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const userMemoryFields = mergeFields(pkSchema, auditSchema, userMemoryOwnFields);

// ============ Meta ============
export const userMemoryMeta: EntityMeta = {
  name: 'ai_user_memory',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_user_memory'),
};

// ============ Table ============
export const userMemory = pgTable(userMemoryMeta.name, getTableFields(userMemoryFields), (table) => [
  index('idx_user_memory_user').on(table.userId),
  index('idx_user_memory_agent').on(table.agentId),
  index('idx_user_memory_type').on(table.memoryType),
  index('idx_user_memory_session').on(table.sessionId),
  index('idx_user_memory_importance').on(table.importance),
  index('idx_user_memory_expire').on(table.expireAt),
]);

// ============ Config ============
export const userMemoryConfig = getFieldConfigs(userMemoryFields);

// ============ Schemas ============
const describeRefinements = createDescribeRefinements(userMemoryFields) as Record<string, (schema: unknown) => unknown>;

export const userMemoryZodSchemas = {
  insert: createInsertZodSchema(userMemory, {
    ...describeRefinements,
    metadata: z.record(z.string(), z.unknown()).optional().describe(userMemoryFields.metadata.comment()),
    embedding: z.array(z.number()).optional().describe(userMemoryFields.embedding.comment()),
  }),
  select: createSelectZodSchema(userMemory, {
    ...describeRefinements,
    metadata: z.record(z.string(), z.unknown()).nullable().describe(userMemoryFields.metadata.comment()),
    embedding: z.array(z.number()).nullable().describe(userMemoryFields.embedding.comment()),
  }),
  update: createUpdateZodSchema(userMemory, {
    ...describeRefinements,
    metadata: z.record(z.string(), z.unknown()).optional().describe(userMemoryFields.metadata.comment()),
    embedding: z.array(z.number()).optional().describe(userMemoryFields.embedding.comment()),
  }),
};
