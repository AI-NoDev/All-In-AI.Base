import { pgTable, uuid, varchar, text, char, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tAi, tAiMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { permissionSchema } from '../base/permissionSchema';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

const f = (field: string) => tAi('agent', field);

// ============ Fields ============
const agentOwnFields = {
  name: {
    field: varchar("name", { length: 64 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  description: {
    field: text("description"),
    comment: f('description'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('description'), importExcelColumnName: f('description'), cellType: "TEXT" as const }
  },
  avatar: {
    field: varchar("avatar", { length: 255 }),
    comment: f('avatar'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('avatar'), cellType: "IMAGE" as const }
  },
  color: {
    field: varchar("color", { length: 32 }),
    comment: f('color'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('color'), importExcelColumnName: f('color'), cellType: "STRING" as const }
  },
  providerId: {
    field: uuid("provider_id").notNull(),
    comment: f('providerId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('providerId'), cellType: "STRING" as const }
  },
  modelId: {
    field: uuid("model_id").notNull(),
    comment: f('modelId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('modelId'), cellType: "STRING" as const }
  },
  systemPrompt: {
    field: text("system_prompt"),
    comment: f('systemPrompt'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('systemPrompt'), importExcelColumnName: f('systemPrompt'), cellType: "TEXT" as const }
  },
  toolIds: {
    field: jsonb("tool_ids").$type<string[]>().default([]),
    comment: f('toolIds'),
    config: { canExport: false, canImport: false }
  },
  nativeTools: {
    field: jsonb("native_tools").$type<string[]>().default([]),
    comment: f('nativeTools'),
    config: { canExport: false, canImport: false }
  },
  temperature: {
    field: real("temperature").default(0.7),
    comment: f('temperature'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('temperature'), importExcelColumnName: f('temperature'), cellType: "NUMERIC" as const }
  },
  supportLoop: {
    field: boolean("support_loop").notNull().default(false),
    comment: f('supportLoop'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('supportLoop'), importExcelColumnName: f('supportLoop'), cellType: "STRING" as const }
  },
  maxLoops: {
    field: jsonb("max_loops").$type<number>().default(10),
    comment: f('maxLoops'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('maxLoops'), importExcelColumnName: f('maxLoops'), cellType: "NUMERIC" as const }
  },
  // 上下文压缩策略
  contextStrategy: {
    field: varchar("context_strategy", { length: 64 }),
    comment: f('contextStrategy'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('contextStrategy'), importExcelColumnName: f('contextStrategy'), cellType: "STRING" as const }
  },
  // 输入参数 Schema (JSON Schema 格式)
  inputSchema: {
    field: jsonb("input_schema").$type<Record<string, unknown>>(),
    comment: f('inputSchema'),
    config: { canExport: false, canImport: false }
  },
  // 是否启用结构化输出
  structuredOutput: {
    field: boolean("structured_output").notNull().default(false),
    comment: f('structuredOutput'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('structuredOutput'), importExcelColumnName: f('structuredOutput'), cellType: "STRING" as const }
  },
  // 输出参数 Schema (JSON Schema 格式)
  outputSchema: {
    field: jsonb("output_schema").$type<Record<string, unknown>>(),
    comment: f('outputSchema'),
    config: { canExport: false, canImport: false }
  },
  remark: {
    field: text("remark"),
    comment: f('remark'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('remark'), importExcelColumnName: f('remark'), cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const agentFields = mergeFields(pkSchema, auditSchema, permissionSchema, agentOwnFields);

// ============ Meta ============
export const agentMeta: EntityMeta = {
  name: 'ai_agent',
  displayName: tAiMeta('agent', 'displayName'),
  verboseName: tAiMeta('agent', 'verboseName'),
  verboseNamePlural: tAiMeta('agent', 'verboseNamePlural'),
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
    toolIds: z.array(z.uuid()).describe(agentFields.toolIds.comment()),
    nativeTools: z.array(z.string()).describe(agentFields.nativeTools.comment()),
    inputSchema: z.record(z.string(), z.unknown()).optional().describe(agentFields.inputSchema.comment()),
    outputSchema: z.record(z.string(), z.unknown()).optional().describe(agentFields.outputSchema.comment()),
    allowedUserIds: z.array(z.uuid()).describe(agentFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).describe(agentFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).describe(agentFields.allowedDeptIds.comment()),
  }),
  select: createSelectZodSchema(agent, {
    ...describeRefinements,
    toolIds: z.array(z.uuid()).nullable().describe(agentFields.toolIds.comment()),
    nativeTools: z.array(z.string()).nullable().describe(agentFields.nativeTools.comment()),
    inputSchema: z.record(z.string(), z.unknown()).nullable().describe(agentFields.inputSchema.comment()),
    outputSchema: z.record(z.string(), z.unknown()).nullable().describe(agentFields.outputSchema.comment()),
    allowedUserIds: z.array(z.uuid()).nullable().describe(agentFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).nullable().describe(agentFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).nullable().describe(agentFields.allowedDeptIds.comment()),
  }),
  update: createUpdateZodSchema(agent, {
    ...describeRefinements,
    toolIds: z.array(z.uuid()).optional().describe(agentFields.toolIds.comment()),
    nativeTools: z.array(z.string()).optional().describe(agentFields.nativeTools.comment()),
    inputSchema: z.record(z.string(), z.unknown()).optional().describe(agentFields.inputSchema.comment()),
    outputSchema: z.record(z.string(), z.unknown()).optional().describe(agentFields.outputSchema.comment()),
    allowedUserIds: z.array(z.uuid()).optional().describe(agentFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).optional().describe(agentFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).optional().describe(agentFields.allowedDeptIds.comment()),
  }),
};
