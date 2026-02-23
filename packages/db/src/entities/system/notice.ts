import { pgTable, char, varchar, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
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
  db_system_notice_targetType,
  db_system_notice_targetUserIds,
  db_system_notice_publishedAt,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Constants ============
/** 通知状态：0=草稿，1=已发布，2=已撤回 */
export const NOTICE_STATUS = {
  DRAFT: '0',
  PUBLISHED: '1',
  WITHDRAWN: '2',
} as const;

/** 通知类型：1=通知，2=公告 */
export const NOTICE_TYPE = {
  NOTICE: '1',
  ANNOUNCEMENT: '2',
} as const;

/** 目标用户类型：all=全部用户，custom=自定义用户 */
export const NOTICE_TARGET_TYPE = {
  ALL: 'all',
  CUSTOM: 'custom',
} as const;

// ============ Fields ============
const noticeOwnFields = {
  title: {
    field: varchar("title", { length: 100 }).notNull(),
    comment: db_system_notice_title,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_notice_title, importExcelColumnName: db_system_notice_title, cellType: "STRING" as const }
  },
  type: {
    field: varchar("type", { length: 1 }).notNull().default(NOTICE_TYPE.NOTICE),
    comment: db_system_notice_type,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_notice_type, importExcelColumnName: db_system_notice_type, cellType: "STRING" as const }
  },
  content: {
    field: text("content").notNull().default(''),
    comment: db_system_notice_content,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_notice_content, importExcelColumnName: db_system_notice_content, cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default(NOTICE_STATUS.DRAFT),
    comment: db_system_notice_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_notice_status, importExcelColumnName: db_system_notice_status, cellType: "STRING" as const }
  },
  targetType: {
    field: varchar("target_type", { length: 10 }).notNull().default(NOTICE_TARGET_TYPE.ALL),
    comment: db_system_notice_targetType,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_notice_targetType, importExcelColumnName: db_system_notice_targetType, cellType: "STRING" as const }
  },
  targetUserIds: {
    field: uuid("target_user_ids").array(),
    comment: db_system_notice_targetUserIds,
    config: { canExport: false, canImport: false }
  },
  publishedAt: {
    field: timestamp("published_at", { withTimezone: true }),
    comment: db_system_notice_publishedAt,
    config: { canExport: true, canImport: false }
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
export const noticeTypeboxSchemas = createTypeboxSchemas(notice, noticeFields);
