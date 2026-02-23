import { pgTable, char, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, createPermissions, createTypeboxSchemas,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_dict_meta_displayName,
  db_system_dict_meta_verboseName,
  db_system_dict_meta_verboseNamePlural,
  db_system_dict_group,
  db_system_dict_label,
  db_system_dict_value,
  db_system_dict_sort,
  db_system_dict_cssClass,
  db_system_dict_listClass,
  db_system_dict_isDefault,
  db_system_dict_status,
  db_system_dict_remark,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

// ============ Fields ============
const dictOwnFields = {
  group: {
    field: varchar("group", { length: 100 }).notNull(),
    comment: db_system_dict_group,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dict_group, importExcelColumnName: db_system_dict_group, cellType: "STRING" as const }
  },
  label: {
    field: varchar("label", { length: 100 }).notNull(),
    comment: db_system_dict_label,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dict_label, importExcelColumnName: db_system_dict_label, cellType: "STRING" as const }
  },
  value: {
    field: varchar("value", { length: 100 }).notNull(),
    comment: db_system_dict_value,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dict_value, importExcelColumnName: db_system_dict_value, cellType: "STRING" as const }
  },
  sort: {
    field: integer("sort").notNull().default(0),
    comment: db_system_dict_sort,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dict_sort, importExcelColumnName: db_system_dict_sort, cellType: "NUMERIC" as const }
  },
  cssClass: {
    field: varchar("css_class", { length: 100 }),
    comment: db_system_dict_cssClass,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dict_cssClass, importExcelColumnName: db_system_dict_cssClass, cellType: "STRING" as const }
  },
  listClass: {
    field: varchar("list_class", { length: 100 }),
    comment: db_system_dict_listClass,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dict_listClass, importExcelColumnName: db_system_dict_listClass, cellType: "STRING" as const }
  },
  isDefault: {
    field: boolean("is_default").notNull().default(false),
    comment: db_system_dict_isDefault,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dict_isDefault, importExcelColumnName: db_system_dict_isDefault, cellType: "STRING" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: db_system_dict_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dict_status, importExcelColumnName: db_system_dict_status, cellType: "STRING" as const }
  },
  remark: {
    field: varchar("remark", { length: 512 }),
    comment: db_system_dict_remark,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_dict_remark, importExcelColumnName: db_system_dict_remark, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const dictFields = mergeFields(pkSchema, auditSchema, deletedSchema, dictOwnFields);

// ============ Meta ============
export const dictMeta: EntityMeta = {
  name: 'system_dict',
  displayName: db_system_dict_meta_displayName,
  verboseName: db_system_dict_meta_verboseName,
  verboseNamePlural: db_system_dict_meta_verboseNamePlural,
  permissions: createPermissions('system_dict'),
};

// ============ Table ============
export const dict = pgTable(dictMeta.name, getTableFields(dictFields));

// ============ Config ============
export const dictConfig = getFieldConfigs(dictFields);

// ============ Schemas (TypeBox) ============
export const dictSchemas = createTypeboxSchemas(dict);

// ============ Types (从 Drizzle 推导) ============
export type DictSelect = typeof dict.$inferSelect;
export type DictInsert = typeof dict.$inferInsert;
