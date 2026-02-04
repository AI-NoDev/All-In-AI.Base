import { pgTable, char, varchar } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tSystem('dictGroup', field);

// ============ Fields ============
const dictGroupOwnFields = {
  key: {
    field: varchar("key", { length: 100 }).notNull().primaryKey(),
    comment: f('key'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('key'), importExcelColumnName: f('key'), cellType: "STRING" as const }
  },
  name: {
    field: varchar("name", { length: 100 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
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

export const dictGroupFields = mergeFields(auditSchema, dictGroupOwnFields);

// ============ Meta ============
export const dictGroupMeta: EntityMeta = {
  name: 'system_dict_group',
  displayName: tSystemMeta('dictGroup', 'displayName'),
  verboseName: tSystemMeta('dictGroup', 'verboseName'),
  verboseNamePlural: tSystemMeta('dictGroup', 'verboseNamePlural'),
  permissions: createPermissions('system_dict_group'),
};

// ============ Table ============
export const dictGroup = pgTable(dictGroupMeta.name, getTableFields(dictGroupFields));

// ============ Config ============
export const dictGroupConfig = getFieldConfigs(dictGroupFields);

// ============ Schemas ============
export const dictGroupZodSchemas = createZodSchemas(dictGroup, dictGroupFields);
