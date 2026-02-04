import { sql } from "drizzle-orm";
import { pgTable, char, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tSystem('loginInfo', field);

// ============ Fields ============
const loginInfoOwnFields = {
  loginName: {
    field: varchar("login_name", { length: 50 }),
    comment: f('loginName'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('loginName'), cellType: "STRING" as const }
  },
  ipaddr: {
    field: varchar("ipaddr", { length: 50 }),
    comment: f('ipaddr'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('ipaddr'), cellType: "STRING" as const }
  },
  loginLocation: {
    field: varchar("login_location", { length: 255 }),
    comment: f('loginLocation'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('loginLocation'), cellType: "STRING" as const }
  },
  browser: {
    field: varchar("browser", { length: 50 }),
    comment: f('browser'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('browser'), cellType: "STRING" as const }
  },
  os: {
    field: varchar("os", { length: 50 }),
    comment: f('os'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('os'), cellType: "STRING" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('status'), cellType: "STRING" as const }
  },
  msg: {
    field: text("msg"),
    comment: f('msg'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('msg'), cellType: "TEXT" as const }
  },
  loginTime: {
    field: timestamp("login_time").default(sql`now()`),
    comment: f('loginTime'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('loginTime'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const loginInfoFields = mergeFields(pkSchema, auditSchema, loginInfoOwnFields);

// ============ Meta ============
export const loginInfoMeta: EntityMeta = {
  name: 'system_login_info',
  displayName: tSystemMeta('loginInfo', 'displayName'),
  verboseName: tSystemMeta('loginInfo', 'verboseName'),
  verboseNamePlural: tSystemMeta('loginInfo', 'verboseNamePlural'),
  permissions: createPermissions('system_login_info'),
};

// ============ Table ============
export const loginInfo = pgTable(loginInfoMeta.name, getTableFields(loginInfoFields));

// ============ Config ============
export const loginInfoConfig = getFieldConfigs(loginInfoFields);

// ============ Schemas ============
export const loginInfoZodSchemas = createZodSchemas(loginInfo, loginInfoFields);
