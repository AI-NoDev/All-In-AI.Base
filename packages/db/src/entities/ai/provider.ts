import { pgTable, varchar, text, char } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tAi, tAiMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tAi('provider', field);

// ============ Fields ============
const providerOwnFields = {
  name: {
    field: varchar("name", { length: 64 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  baseUrl: {
    field: varchar("base_url", { length: 512 }).notNull(),
    comment: f('baseUrl'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('baseUrl'), importExcelColumnName: f('baseUrl'), cellType: "STRING" as const }
  },
  token: {
    field: text("token").notNull(),
    comment: f('token'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('token'), cellType: "STRING" as const }
  },
  remark: {
    field: text("remark"),
    comment: f('remark'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('remark'), importExcelColumnName: f('remark'), cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const providerFields = mergeFields(pkSchema, auditSchema, providerOwnFields);

// ============ Meta ============
export const providerMeta: EntityMeta = {
  name: 'ai_provider',
  displayName: tAiMeta('provider', 'displayName'),
  verboseName: tAiMeta('provider', 'verboseName'),
  verboseNamePlural: tAiMeta('provider', 'verboseNamePlural'),
  permissions: createPermissions('ai_provider'),
};

// ============ Table ============
export const provider = pgTable(providerMeta.name, getTableFields(providerFields));

// ============ Config ============
export const providerConfig = getFieldConfigs(providerFields);

// ============ Schemas ============
export const providerZodSchemas = createZodSchemas(provider, providerFields);
