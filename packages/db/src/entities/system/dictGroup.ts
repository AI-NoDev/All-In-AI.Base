import { pgTable, char, varchar } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_dictGroup_meta_displayName,
  db_system_dictGroup_meta_verboseName,
  db_system_dictGroup_meta_verboseNamePlural,
  db_system_dictGroup_key,
  db_system_dictGroup_name,
  db_system_dictGroup_status,
  db_system_dictGroup_remark,
} from '@qiyu-allinai/i18n';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const dictGroupOwnFields = {
  key: {
    field: varchar("key", { length: 100 }).notNull().primaryKey(),
    comment: db_system_dictGroup_key,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dictGroup_key, importExcelColumnName: db_system_dictGroup_key, cellType: "STRING" as const }
  },
  name: {
    field: varchar("name", { length: 100 }).notNull(),
    comment: db_system_dictGroup_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dictGroup_name, importExcelColumnName: db_system_dictGroup_name, cellType: "STRING" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: db_system_dictGroup_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dictGroup_status, importExcelColumnName: db_system_dictGroup_status, cellType: "STRING" as const }
  },
  remark: {
    field: varchar("remark", { length: 512 }),
    comment: db_system_dictGroup_remark,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dictGroup_remark, importExcelColumnName: db_system_dictGroup_remark, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const dictGroupFields = mergeFields(auditSchema, dictGroupOwnFields);

// ============ Meta ============
export const dictGroupMeta: EntityMeta = {
  name: 'system_dict_group',
  displayName: db_system_dictGroup_meta_displayName,
  verboseName: db_system_dictGroup_meta_verboseName,
  verboseNamePlural: db_system_dictGroup_meta_verboseNamePlural,
  permissions: createPermissions('system_dict_group'),
};

// ============ Table ============
export const dictGroup = pgTable(dictGroupMeta.name, getTableFields(dictGroupFields));

// ============ Config ============
export const dictGroupConfig = getFieldConfigs(dictGroupFields);

// ============ Schemas ============
export const dictGroupZodSchemas = createZodSchemas(dictGroup, dictGroupFields);
