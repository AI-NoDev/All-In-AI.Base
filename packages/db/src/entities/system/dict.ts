import { pgTable, char, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

const f = (field: string) => tSystem('dict', field);

// ============ Fields ============
const dictOwnFields = {
  group: {
    field: varchar("group", { length: 100 }).notNull(),
    comment: f('group'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('group'), importExcelColumnName: f('group'), cellType: "STRING" as const }
  },
  label: {
    field: varchar("label", { length: 100 }).notNull(),
    comment: f('label'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('label'), importExcelColumnName: f('label'), cellType: "STRING" as const }
  },
  value: {
    field: varchar("value", { length: 100 }).notNull(),
    comment: f('value'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('value'), importExcelColumnName: f('value'), cellType: "STRING" as const }
  },
  sort: {
    field: integer("sort").notNull().default(0),
    comment: f('sort'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('sort'), importExcelColumnName: f('sort'), cellType: "NUMERIC" as const }
  },
  cssClass: {
    field: varchar("css_class", { length: 100 }),
    comment: f('cssClass'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('cssClass'), importExcelColumnName: f('cssClass'), cellType: "STRING" as const }
  },
  listClass: {
    field: varchar("list_class", { length: 100 }),
    comment: f('listClass'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('listClass'), importExcelColumnName: f('listClass'), cellType: "STRING" as const }
  },
  isDefault: {
    field: boolean("is_default").notNull().default(false),
    comment: f('isDefault'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isDefault'), importExcelColumnName: f('isDefault'), cellType: "STRING" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
  remark: {
    field: varchar("remark", { length: 512 }),
    comment: f('remark'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('remark'), importExcelColumnName: f('remark'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const dictFields = mergeFields(pkSchema, auditSchema, deletedSchema, dictOwnFields);

// ============ Meta ============
export const dictMeta: EntityMeta = {
  name: 'system_dict',
  displayName: tSystemMeta('dict', 'displayName'),
  verboseName: tSystemMeta('dict', 'verboseName'),
  verboseNamePlural: tSystemMeta('dict', 'verboseNamePlural'),
  permissions: createPermissions('system_dict'),
};

// ============ Table ============
export const dict = pgTable(dictMeta.name, getTableFields(dictFields));

// ============ Config ============
export const dictConfig = getFieldConfigs(dictFields);

// ============ Schemas ============
export const dictZodSchemas = createZodSchemas(dict, dictFields);
