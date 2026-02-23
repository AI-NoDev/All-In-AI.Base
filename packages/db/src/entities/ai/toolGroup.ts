import { pgTable, varchar, text, char, integer, jsonb } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_ai_toolGroup_meta_displayName" as meta_displayName,
  "db_ai_toolGroup_meta_verboseName" as meta_verboseName,
  "db_ai_toolGroup_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_ai_toolGroup_name" as f_name,
  "db_ai_toolGroup_description" as f_description,
  "db_ai_toolGroup_icon" as f_icon,
  "db_ai_toolGroup_orderNum" as f_orderNum,
  "db_ai_toolGroup_remark" as f_remark,
  "db_ai_toolGroup_status" as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const toolGroupOwnFields = {
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
  icon: {
    field: varchar("icon", { length: 64 }),
    comment: f_icon,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_icon, importExcelColumnName: f_icon, cellType: "STRING" as const }
  },
  tools: {
    field: jsonb("tools").$type<string[]>().default([]),
    comment: f_name,
    config: { canExport: false, canImport: false }
  },
  orderNum: {
    field: integer("order_num").notNull().default(1),
    comment: f_orderNum,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_orderNum, importExcelColumnName: f_orderNum, cellType: "NUMERIC" as const }
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

export const toolGroupFields = mergeFields(pkSchema, auditSchema, toolGroupOwnFields);

// ============ Meta ============
export const toolGroupMeta: EntityMeta = {
  name: 'ai_tool_group',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_tool_group'),
};

// ============ Table ============
export const toolGroup = pgTable(toolGroupMeta.name, getTableFields(toolGroupFields));

// ============ Config ============
export const toolGroupConfig = getFieldConfigs(toolGroupFields);

// ============ Schemas ============
export const toolGroupSchemas = createTypeboxSchemas(toolGroup);

// ============ Types ============
export type ToolGroupSelect = typeof toolGroup.$inferSelect;
export type ToolGroupInsert = typeof toolGroup.$inferInsert;
