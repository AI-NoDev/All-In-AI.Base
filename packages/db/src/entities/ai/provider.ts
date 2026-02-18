import { pgTable, varchar, text, char } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_ai_provider_meta_displayName" as meta_displayName,
  "db_ai_provider_meta_verboseName" as meta_verboseName,
  "db_ai_provider_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_ai_provider_name" as f_name,
  "db_ai_provider_providerType" as f_providerType,
  "db_ai_provider_baseUrl" as f_baseUrl,
  "db_ai_provider_token" as f_token,
  "db_ai_provider_remark" as f_remark,
  "db_ai_provider_status" as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const providerOwnFields = {
  name: {
    field: varchar("name", { length: 64 }).notNull(),
    comment: f_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_name, importExcelColumnName: f_name, cellType: "STRING" as const }
  },
  providerType: {
    field: varchar("provider_type", { length: 32 }).notNull().default('openai-compatible'),
    comment: f_providerType,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_providerType, importExcelColumnName: f_providerType, cellType: "STRING" as const }
  },
  baseUrl: {
    field: varchar("base_url", { length: 512 }).notNull(),
    comment: f_baseUrl,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_baseUrl, importExcelColumnName: f_baseUrl, cellType: "STRING" as const }
  },
  token: {
    field: text("token").notNull(),
    comment: f_token,
    config: { canExport: false, canImport: true, importExcelColumnName: f_token, cellType: "STRING" as const }
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

export const providerFields = mergeFields(pkSchema, auditSchema, providerOwnFields);

// ============ Meta ============
export const providerMeta: EntityMeta = {
  name: 'ai_provider',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_provider'),
};

// ============ Table ============
export const provider = pgTable(providerMeta.name, getTableFields(providerFields));

// ============ Config ============
export const providerConfig = getFieldConfigs(providerFields);

// ============ Schemas ============
export const providerZodSchemas = createZodSchemas(provider, providerFields);
