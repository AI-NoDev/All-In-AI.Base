import { pgTable, varchar, text, char, jsonb } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createTypeboxSchemas,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_ai_dataModel_meta_displayName as meta_displayName,
  db_ai_dataModel_meta_verboseName as meta_verboseName,
  db_ai_dataModel_meta_verboseNamePlural as meta_verboseNamePlural,
  db_ai_dataModel_name as f_name,
  db_ai_dataModel_description as f_description,
  db_ai_dataModel_jsonSchema as f_jsonSchema,
  db_ai_dataModel_remark as f_remark,
  db_ai_dataModel_status as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema, auditSchema } from '../base';

// ============ Constants ============
export const DATA_MODEL_STATUS = {
  ACTIVE: '0',    // 启用
  DISABLED: '1',  // 禁用
} as const;

// ============ Fields ============
const dataModelOwnFields = {
  name: {
    field: varchar("name", { length: 100 }).notNull(),
    comment: f_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_name, importExcelColumnName: f_name, cellType: "STRING" as const }
  },
  description: {
    field: text("description"),
    comment: f_description,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_description, importExcelColumnName: f_description, cellType: "TEXT" as const }
  },
  // JSON Schema 定义
  jsonSchema: {
    field: jsonb("json_schema").$type<Record<string, unknown>>().notNull(),
    comment: f_jsonSchema,
    config: { canExport: false, canImport: false }
  },
  remark: {
    field: text("remark"),
    comment: f_remark,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_remark, importExcelColumnName: f_remark, cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default(DATA_MODEL_STATUS.ACTIVE),
    comment: f_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_status, importExcelColumnName: f_status, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const dataModelFields = mergeFields(pkSchema, auditSchema, dataModelOwnFields);

// ============ Meta ============
export const dataModelMeta: EntityMeta = {
  name: 'ai_data_model',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_data_model'),
};

// ============ Table ============
export const dataModel = pgTable(dataModelMeta.name, getTableFields(dataModelFields));

// ============ Config ============
export const dataModelConfig = getFieldConfigs(dataModelFields);

// ============ Schemas (TypeBox) ============
export const dataModelSchemas = createTypeboxSchemas(dataModel);

// ============ Types ============
export type DataModelSelect = typeof dataModel.$inferSelect;
export type DataModelInsert = typeof dataModel.$inferInsert;
