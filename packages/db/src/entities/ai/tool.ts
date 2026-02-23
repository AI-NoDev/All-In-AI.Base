import { pgTable, varchar, text, char, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_ai_tool_meta_displayName" as meta_displayName,
  "db_ai_tool_meta_verboseName" as meta_verboseName,
  "db_ai_tool_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_ai_tool_name" as f_name,
  "db_ai_tool_description" as f_description,
  "db_ai_tool_groupId" as f_groupId,
  "db_ai_tool_inputSchema" as f_inputSchema,
  "db_ai_tool_outputSchema" as f_outputSchema,
  "db_ai_tool_implementation" as f_implementation,
  "db_ai_tool_isAsync" as f_isAsync,
  "db_ai_tool_remark" as f_remark,
  "db_ai_tool_status" as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const toolOwnFields = {
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
  groupId: {
    field: varchar("group_id", { length: 36 }),
    comment: f_groupId,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_groupId, importExcelColumnName: f_groupId, cellType: "STRING" as const }
  },
  inputSchema: {
    field: jsonb("input_schema").$type<Record<string, unknown>>(),
    comment: f_inputSchema,
    config: { canExport: false, canImport: false }
  },
  outputSchema: {
    field: jsonb("output_schema").$type<Record<string, unknown>>(),
    comment: f_outputSchema,
    config: { canExport: false, canImport: false }
  },
  implementation: {
    field: text("implementation"),
    comment: f_implementation,
    config: { canExport: false, canImport: false }
  },
  isAsync: {
    field: boolean("is_async").default(false),
    comment: f_isAsync,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_isAsync, importExcelColumnName: f_isAsync, cellType: "STRING" as const }
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

export const toolFields = mergeFields(pkSchema, auditSchema, toolOwnFields);

// ============ Meta ============
export const toolMeta: EntityMeta = {
  name: 'ai_tool',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_tool'),
};

// ============ Table ============
export const tool = pgTable(toolMeta.name, getTableFields(toolFields));

// ============ Config ============
export const toolConfig = getFieldConfigs(toolFields);

// ============ Schemas ============
export const toolSchemas = createTypeboxSchemas(tool);

// ============ Types ============
export type ToolSelect = typeof tool.$inferSelect;
export type ToolInsert = typeof tool.$inferInsert;
