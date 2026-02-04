import { pgTable, varchar, char } from 'drizzle-orm/pg-core';
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

const f = (field: string) => tSystem('post', field);

// ============ Fields ============
const postOwnFields = {
  code: {
    field: varchar('code', { length: 64 }).notNull(),
    comment: f('code'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('code'), importExcelColumnName: f('code'), cellType: "STRING" as const }
  },
  name: {
    field: varchar('name', { length: 50 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  sort: {
    field: varchar('sort', { length: 10 }).notNull(),
    comment: f('sort'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('sort'), importExcelColumnName: f('sort'), cellType: "STRING" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const postFields = mergeFields(pkSchema, auditSchema, deletedSchema, postOwnFields);

// ============ Meta ============
export const postMeta: EntityMeta = {
  name: 'system_post',
  displayName: tSystemMeta('post', 'displayName'),
  verboseName: tSystemMeta('post', 'verboseName'),
  verboseNamePlural: tSystemMeta('post', 'verboseNamePlural'),
  permissions: createPermissions('system_post'),
};

// ============ Table ============
export const post = pgTable(postMeta.name, getTableFields(postFields));

// ============ Config ============
export const postConfig = getFieldConfigs(postFields);

// ============ Schemas ============
export const postZodSchemas = createZodSchemas(post, postFields);
