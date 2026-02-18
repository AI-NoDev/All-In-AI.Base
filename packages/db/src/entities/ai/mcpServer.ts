import { pgTable, varchar, text, char, jsonb, boolean } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_ai_mcpServer_meta_displayName as meta_displayName,
  db_ai_mcpServer_meta_verboseName as meta_verboseName,
  db_ai_mcpServer_meta_verboseNamePlural as meta_verboseNamePlural,
  db_ai_mcpServer_name as f_name,
  db_ai_mcpServer_description as f_description,
  db_ai_mcpServer_actions as f_actions,
  db_ai_mcpServer_isPublic as f_isPublic,
  db_ai_mcpServer_remark as f_remark,
  db_ai_mcpServer_status as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const mcpServerOwnFields = {
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
  // 选中的 action 名称列表
  actions: {
    field: jsonb("actions").$type<string[]>().notNull().default([]),
    comment: f_actions,
    config: { canExport: false, canImport: false }
  },
  // 是否公开（无需 token 即可访问）
  isPublic: {
    field: boolean("is_public").notNull().default(false),
    comment: f_isPublic,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_isPublic, importExcelColumnName: f_isPublic, cellType: "STRING" as const }
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

export const mcpServerFields = mergeFields(pkSchema, auditSchema, mcpServerOwnFields);

// ============ Meta ============
export const mcpServerMeta: EntityMeta = {
  name: 'ai_mcp_server',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_mcp_server'),
};

// ============ Table ============
export const mcpServer = pgTable(mcpServerMeta.name, getTableFields(mcpServerFields));

// ============ Config ============
export const mcpServerConfig = getFieldConfigs(mcpServerFields);

// ============ Schemas ============
export const mcpServerZodSchemas = createZodSchemas(mcpServer, mcpServerFields);
