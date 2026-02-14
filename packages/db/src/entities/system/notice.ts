import { pgTable, char, varchar, text } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_notice_meta_displayName,
  db_system_notice_meta_verboseName,
  db_system_notice_meta_verboseNamePlural,
  db_system_notice_title,
  db_system_notice_type,
  db_system_notice_content,
  db_system_notice_status,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const noticeOwnFields = {
  title: {
    field: varchar("title", { length: 50 }).notNull(),
    comment: db_system_notice_title,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_notice_title, importExcelColumnName: db_system_notice_title, cellType: "STRING" as const }
  },
  type: {
    field: varchar("type", { length: 1 }).notNull(),
    comment: db_system_notice_type,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_notice_type, importExcelColumnName: db_system_notice_type, cellType: "STRING" as const }
  },
  content: {
    field: text("content").notNull(),
    comment: db_system_notice_content,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_notice_content, importExcelColumnName: db_system_notice_content, cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: db_system_notice_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_notice_status, importExcelColumnName: db_system_notice_status, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const noticeFields = mergeFields(pkSchema, auditSchema, noticeOwnFields);

// ============ Meta ============
export const noticeMeta: EntityMeta = {
  name: 'system_notice',
  displayName: db_system_notice_meta_displayName,
  verboseName: db_system_notice_meta_verboseName,
  verboseNamePlural: db_system_notice_meta_verboseNamePlural,
  permissions: createPermissions('system_notice'),
};

// ============ Table ============
export const notice = pgTable(noticeMeta.name, getTableFields(noticeFields));

// ============ Config ============
export const noticeConfig = getFieldConfigs(noticeFields);

// ============ Schemas ============
export const noticeZodSchemas = createZodSchemas(notice, noticeFields);
