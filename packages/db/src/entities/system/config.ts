import { pgTable, varchar, boolean } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, createPermissions, createTypeboxSchemas,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_config_meta_displayName,
  db_system_config_meta_verboseName,
  db_system_config_meta_verboseNamePlural,
  db_system_config_name,
  db_system_config_key,
  db_system_config_value,
  db_system_config_isSystem,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const configOwnFields = {
  name: {
    field: varchar("name", { length: 128 }).notNull(),
    comment: db_system_config_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_config_name, importExcelColumnName: db_system_config_name, cellType: "STRING" as const }
  },
  key: {
    field: varchar("key", { length: 128 }).notNull(),
    comment: db_system_config_key,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_config_key, importExcelColumnName: db_system_config_key, cellType: "STRING" as const }
  },
  value: {
    field: varchar("value", { length: 512 }).notNull(),
    comment: db_system_config_value,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_config_value, importExcelColumnName: db_system_config_value, cellType: "STRING" as const }
  },
  isSystem: {
    field: boolean("is_system").notNull().default(true),
    comment: db_system_config_isSystem,
    config: { canExport: true, canImport: false, exportExcelColumnName: db_system_config_isSystem, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const configFields = mergeFields(pkSchema, auditSchema, configOwnFields);

// ============ Meta ============
export const configMeta: EntityMeta = {
  name: 'system_config',
  displayName: db_system_config_meta_displayName,
  verboseName: db_system_config_meta_verboseName,
  verboseNamePlural: db_system_config_meta_verboseNamePlural,
  permissions: createPermissions('system_config'),
};

// ============ Table ============
export const config = pgTable(configMeta.name, getTableFields(configFields));

// ============ Config ============
export const configConfig = getFieldConfigs(configFields);

// ============ Schemas (TypeBox) ============
export const configSchemas = createTypeboxSchemas(config);

// ============ Types (从 Drizzle 推导) ============
export type ConfigSelect = typeof config.$inferSelect;
export type ConfigInsert = typeof config.$inferInsert;
