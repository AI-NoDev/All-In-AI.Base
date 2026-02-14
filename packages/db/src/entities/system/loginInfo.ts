import { sql } from "drizzle-orm";
import { pgTable, char, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  "db_system_loginInfo_meta_displayName" as meta_displayName,
  "db_system_loginInfo_meta_verboseName" as meta_verboseName,
  "db_system_loginInfo_meta_verboseNamePlural" as meta_verboseNamePlural,
  "db_system_loginInfo_loginName" as f_loginName,
  "db_system_loginInfo_ipaddr" as f_ipaddr,
  "db_system_loginInfo_loginLocation" as f_loginLocation,
  "db_system_loginInfo_browser" as f_browser,
  "db_system_loginInfo_os" as f_os,
  "db_system_loginInfo_status" as f_status,
  "db_system_loginInfo_msg" as f_msg,
  "db_system_loginInfo_loginTime" as f_loginTime,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const loginInfoOwnFields = {
  loginName: {
    field: varchar("login_name", { length: 50 }),
    comment: f_loginName,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_loginName, cellType: "STRING" as const }
  },
  ipaddr: {
    field: varchar("ipaddr", { length: 50 }),
    comment: f_ipaddr,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_ipaddr, cellType: "STRING" as const }
  },
  loginLocation: {
    field: varchar("login_location", { length: 255 }),
    comment: f_loginLocation,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_loginLocation, cellType: "STRING" as const }
  },
  browser: {
    field: varchar("browser", { length: 50 }),
    comment: f_browser,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_browser, cellType: "STRING" as const }
  },
  os: {
    field: varchar("os", { length: 50 }),
    comment: f_os,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_os, cellType: "STRING" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f_status,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_status, cellType: "STRING" as const }
  },
  msg: {
    field: text("msg"),
    comment: f_msg,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_msg, cellType: "TEXT" as const }
  },
  loginTime: {
    field: timestamp("login_time").default(sql`now()`),
    comment: f_loginTime,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_loginTime, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const loginInfoFields = mergeFields(pkSchema, auditSchema, loginInfoOwnFields);

// ============ Meta ============
export const loginInfoMeta: EntityMeta = {
  name: 'system_login_info',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('system_login_info'),
};

// ============ Table ============
export const loginInfo = pgTable(loginInfoMeta.name, getTableFields(loginInfoFields));

// ============ Config ============
export const loginInfoConfig = getFieldConfigs(loginInfoFields);

// ============ Schemas ============
export const loginInfoZodSchemas = createZodSchemas(loginInfo, loginInfoFields);
