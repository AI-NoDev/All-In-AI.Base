import { pgTable, varchar, text, char, boolean, timestamp } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_ai_apiKey_meta_displayName as meta_displayName,
  db_ai_apiKey_meta_verboseName as meta_verboseName,
  db_ai_apiKey_meta_verboseNamePlural as meta_verboseNamePlural,
  db_ai_apiKey_name as f_name,
  db_ai_apiKey_tokenHash as f_tokenHash,
  db_ai_apiKey_tokenPrefix as f_tokenPrefix,
  db_ai_apiKey_accessAll as f_accessAll,
  db_ai_apiKey_expiresAt as f_expiresAt,
  db_ai_apiKey_isRevoked as f_isRevoked,
  db_ai_apiKey_revokedAt as f_revokedAt,
  db_ai_apiKey_lastUsedAt as f_lastUsedAt,
  db_ai_apiKey_remark as f_remark,
  db_ai_apiKey_status as f_status,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const apiKeyOwnFields = {
  name: {
    field: varchar("name", { length: 128 }).notNull(),
    comment: f_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_name, importExcelColumnName: f_name, cellType: "STRING" as const }
  },
  tokenHash: {
    field: varchar("token_hash", { length: 128 }).notNull(),
    comment: f_tokenHash,
    config: { canExport: false, canImport: false }
  },
  tokenPrefix: {
    field: varchar("token_prefix", { length: 16 }).notNull(),
    comment: f_tokenPrefix,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_tokenPrefix, cellType: "STRING" as const }
  },
  // 是否可访问全部 MCP（true=全部，false=自定义选择）
  accessAll: {
    field: boolean("access_all").notNull().default(true),
    comment: f_accessAll,
    config: { canExport: true, canImport: true, exportExcelColumnName: f_accessAll, importExcelColumnName: f_accessAll, cellType: "STRING" as const }
  },
  expiresAt: {
    field: timestamp("expires_at", { mode: 'string' }),
    comment: f_expiresAt,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_expiresAt, cellType: "STRING" as const }
  },
  isRevoked: {
    field: boolean("is_revoked").notNull().default(false),
    comment: f_isRevoked,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_isRevoked, cellType: "STRING" as const }
  },
  revokedAt: {
    field: timestamp("revoked_at", { mode: 'string' }),
    comment: f_revokedAt,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_revokedAt, cellType: "STRING" as const }
  },
  lastUsedAt: {
    field: timestamp("last_used_at", { mode: 'string' }),
    comment: f_lastUsedAt,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_lastUsedAt, cellType: "STRING" as const }
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

export const apiKeyFields = mergeFields(pkSchema, auditSchema, apiKeyOwnFields);

// ============ Meta ============
export const apiKeyMeta: EntityMeta = {
  name: 'ai_api_key',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('ai_api_key'),
};

// ============ Table ============
export const apiKey = pgTable(apiKeyMeta.name, getTableFields(apiKeyFields));

// ============ Config ============
export const apiKeyConfig = getFieldConfigs(apiKeyFields);

// ============ Schemas ============
export const apiKeyZodSchemas = createZodSchemas(apiKey, apiKeyFields);
