import { pgTable, char, varchar, text } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tSystem('notice', field);

// ============ Fields ============
const noticeOwnFields = {
  title: {
    field: varchar("title", { length: 50 }).notNull(),
    comment: f('title'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('title'), importExcelColumnName: f('title'), cellType: "STRING" as const }
  },
  type: {
    field: varchar("type", { length: 1 }).notNull(),
    comment: f('type'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('type'), importExcelColumnName: f('type'), cellType: "STRING" as const }
  },
  content: {
    field: text("content").notNull(),
    comment: f('content'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('content'), importExcelColumnName: f('content'), cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const noticeFields = mergeFields(pkSchema, auditSchema, noticeOwnFields);

// ============ Meta ============
export const noticeMeta: EntityMeta = {
  name: 'system_notice',
  displayName: tSystemMeta('notice', 'displayName'),
  verboseName: tSystemMeta('notice', 'verboseName'),
  verboseNamePlural: tSystemMeta('notice', 'verboseNamePlural'),
  permissions: createPermissions('system_notice'),
};

// ============ Table ============
export const notice = pgTable(noticeMeta.name, getTableFields(noticeFields));

// ============ Config ============
export const noticeConfig = getFieldConfigs(noticeFields);

// ============ Schemas ============
export const noticeZodSchemas = createZodSchemas(notice, noticeFields);
