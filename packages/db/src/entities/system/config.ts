import { pgTable, varchar, boolean } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tSystem('config', field);

// ============ Fields ============
const configOwnFields = {
  name: {
    field: varchar("name", { length: 128 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  key: {
    field: varchar("key", { length: 128 }).notNull(),
    comment: f('key'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('key'), importExcelColumnName: f('key'), cellType: "STRING" as const }
  },
  value: {
    field: varchar("value", { length: 512 }).notNull(),
    comment: f('value'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('value'), importExcelColumnName: f('value'), cellType: "STRING" as const }
  },
  isSystem: {
    field: boolean("is_system").notNull().default(true),
    comment: f('isSystem'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('isSystem'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const configFields = mergeFields(pkSchema, auditSchema, configOwnFields);

// ============ Meta ============
export const configMeta: EntityMeta = {
  name: 'system_config',
  displayName: tSystemMeta('config', 'displayName'),
  verboseName: tSystemMeta('config', 'verboseName'),
  verboseNamePlural: tSystemMeta('config', 'verboseNamePlural'),
  permissions: createPermissions('system_config'),
};

// ============ Table ============
export const config = pgTable(configMeta.name, getTableFields(configFields));

// ============ Config ============
export const configConfig = getFieldConfigs(configFields);

// ============ Schemas ============
export const configZodSchemas = createZodSchemas(config, configFields);
