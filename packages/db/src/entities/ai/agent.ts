import { pgTable, uuid, varchar, text, char, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_ai_agent_meta_displayName" as meta_displayName,
  "db_ai_agent_meta_verboseName" as meta_verboseName,
  "db_ai_agent_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_ai_agent_name" as f_name,
  "db_ai_agent_description" as f_description,
  "db_ai_agent_avatar" as f_avatar,
  "db_ai_agent_color" as f_color,
  "db_ai_agent_providerId" as f_providerId,
  "db_ai_agent_modelId" as f_modelId,
  "db_ai_agent_systemPrompt" as f_systemPrompt,
  "db_ai_agent_toolIds" as f_toolIds,
  "db_ai_agent_temperature" as f_temperature,
  "db_ai_agent_supportLoop" as f_supportLoop,
  "db_ai_agent_maxLoops" as f_maxLoops,
  "db_ai_agent_contextStrategy" as f_contextStrategy,
  "db_ai_agent_remark" as f_remark,
  "db_ai_agent_status" as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema, auditSchema } from '../base';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema, createDescribeRefinements } from "../../types";
import { z } from "zod/v4";

// ============ Fields ============
const agentOwnFields = {
  name: {
    field: varchar("name", { length: 64 }).notNull(),
    comment: f_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_name, importExcelColumnName: f_name, cellType: "STRING" as const }
  },
  description: {
    field: text("description"),
    comment: f_description,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_description, importExcelColumnName: f_description, cellType: "TEXT" as const }
  },
  avatar: {
    field: varchar("avatar", { length: 255 }),
    comment: f_avatar,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_avatar, cellType: "IMAGE" as const }
  },
  color: {
    field: varchar("color", { length: 32 }),
    comment: f_color,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_color, importExcelColumnName: f_color, cellType: "STRING" as const }
  },
  providerId: {
    field: uuid("provider_id").notNull(),
    comment: f_providerId,
    config: { canExport: false, canImport: true, importExcelColumnName: f_providerId, cellType: "STRING" as const }
  },
  modelId: {
    field: uuid("model_id").notNull(),
    comment: f_modelId,
    config: { canExport: false, canImport: true, importExcelColumnName: f_modelId, cellType: "STRING" as const }
  },
  systemPrompt: {
    field: text("system_prompt"),
    comment: f_systemPrompt,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_systemPrompt, importExcelColumnName: f_systemPrompt, cellType: "TEXT" as const }
  },
  toolIds: {
    field: jsonb("tool_ids").$type<string[]>().default([]),
    comment: f_toolIds,
    config: { canExport: false, canImport: false }
  },
  nativeTools: {
    field: jsonb("native_tools").$type<string[]>().default([]),
    comment: f_toolIds,
    config: { canExport: false, canImport: false }
  },
  temperature: {
    field: real("temperature").default(0.7),
    comment: f_temperature,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_temperature, importExcelColumnName: f_temperature, cellType: "NUMERIC" as const }
  },
  supportLoop: {
    field: boolean("support_loop").notNull().default(false),
    comment: f_supportLoop,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_supportLoop, importExcelColumnName: f_supportLoop, cellType: "STRING" as const }
  },
  maxLoops: {
    field: jsonb("max_loops").$type<number>().default(10),
    comment: f_maxLoops,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_maxLoops, importExcelColumnName: f_maxLoops, cellType: "NUMERIC" as const }
  },
  // 上下文压缩策略
  contextStrategy: {
    field: varchar("context_strategy", { length: 64 }),
    comment: f_contextStrategy,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_contextStrategy, importExcelColumnName: f_contextStrategy, cellType: "STRING" as const }
  },
  // 输入参数 Schema (JSON Schema 格式)
  inputSchema: {
    field: jsonb("input_schema").$type<Record<string, unknown>>(),
    comment: f_description,
    config: { canExport: false, canImport: false }
  },
  // 是否启用结构化输出
  structuredOutput: {
    field: boolean("structured_output").notNull().default(false),
    comment: f_description,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_description, importExcelColumnName: f_description, cellType: "STRING" as const }
  },
  // 输出参数 Schema (JSON Schema 格式)
  outputSchema: {
    field: jsonb("output_schema").$type<Record<string, unknown>>(),
    comment: f_description,
    config: { canExport: false, canImport: false }
  },
  remark: {
    field: text("remark"),
    comment: f_remark,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_remark, importExcelColumnName: f_remark, cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_status, importExcelColumnName: f_status, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const agentFields = mergeFields(pkSchema, auditSchema, agentOwnFields);

// ============ Meta ============
export const agentMeta: EntityMeta = {
  name: 'ai_agent',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_agent'),
};

// ============ Table ============
export const agent = pgTable(agentMeta.name, getTableFields(agentFields));

// ============ Config ============
export const agentConfig = getFieldConfigs(agentFields);

// ============ Schemas ============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeRefinements = createDescribeRefinements(agentFields) as any;

export const agentZodSchemas = {
  insert: createInsertZodSchema(agent, {
    ...describeRefinements,
    toolIds: z.array(z.string()).optional().describe(agentFields.toolIds.comment()),
    nativeTools: z.array(z.string()).optional().describe(agentFields.nativeTools.comment()),
    inputSchema: z.record(z.string(), z.unknown()).optional().describe(agentFields.inputSchema.comment()),
    outputSchema: z.record(z.string(), z.unknown()).optional().describe(agentFields.outputSchema.comment()),
  }),
  select: createSelectZodSchema(agent, {
    ...describeRefinements,
    toolIds: z.array(z.string()).nullable().describe(agentFields.toolIds.comment()),
    nativeTools: z.array(z.string()).nullable().describe(agentFields.nativeTools.comment()),
    inputSchema: z.record(z.string(), z.unknown()).nullable().describe(agentFields.inputSchema.comment()),
    outputSchema: z.record(z.string(), z.unknown()).nullable().describe(agentFields.outputSchema.comment()),
  }),
  update: createUpdateZodSchema(agent, {
    ...describeRefinements,
    toolIds: z.array(z.string()).optional().describe(agentFields.toolIds.comment()),
    nativeTools: z.array(z.string()).optional().describe(agentFields.nativeTools.comment()),
    inputSchema: z.record(z.string(), z.unknown()).optional().describe(agentFields.inputSchema.comment()),
    outputSchema: z.record(z.string(), z.unknown()).optional().describe(agentFields.outputSchema.comment()),
  }),
};

