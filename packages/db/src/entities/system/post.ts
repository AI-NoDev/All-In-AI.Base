import { pgTable, varchar, char } from 'drizzle-orm/pg-core';
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_post_meta_displayName,
  db_system_post_meta_verboseName,
  db_system_post_meta_verboseNamePlural,
  db_system_post_code,
  db_system_post_name,
  db_system_post_sort,
  db_system_post_status,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

// ============ Fields ============
const postOwnFields = {
  code: {
    field: varchar('code', { length: 64 }).notNull(),
    comment: db_system_post_code,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_post_code, importExcelColumnName: db_system_post_code, cellType: "STRING" as const }
  },
  name: {
    field: varchar('name', { length: 50 }).notNull(),
    comment: db_system_post_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_post_name, importExcelColumnName: db_system_post_name, cellType: "STRING" as const }
  },
  sort: {
    field: varchar('sort', { length: 10 }).notNull(),
    comment: db_system_post_sort,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_post_sort, importExcelColumnName: db_system_post_sort, cellType: "STRING" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: db_system_post_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_post_status, importExcelColumnName: db_system_post_status, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const postFields = mergeFields(pkSchema, auditSchema, deletedSchema, postOwnFields);

// ============ Meta ============
export const postMeta: EntityMeta = {
  name: 'system_post',
  displayName: db_system_post_meta_displayName,
  verboseName: db_system_post_meta_verboseName,
  verboseNamePlural: db_system_post_meta_verboseNamePlural,
  permissions: createPermissions('system_post'),
};

// ============ Table ============
export const post = pgTable(postMeta.name, getTableFields(postFields));

// ============ Config ============
export const postConfig = getFieldConfigs(postFields);

// ============ Schemas ============
export const postZodSchemas = createZodSchemas(post, postFields);
