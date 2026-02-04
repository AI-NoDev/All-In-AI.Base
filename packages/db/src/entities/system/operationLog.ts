import { pgTable, varchar, integer, char, bigint, text, timestamp } from 'drizzle-orm/pg-core';
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';

const f = (field: string) => tSystem('operationLog', field);

// ============ Fields ============
const operationLogOwnFields = {
  title: {
    field: varchar('title', { length: 255 }).notNull(),
    comment: f('title'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('title'), cellType: "STRING" as const }
  },
  businessType: {
    field: integer('business_type'),
    comment: f('businessType'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('businessType'), cellType: "NUMERIC" as const }
  },
  businessTypes: {
    field: text('business_types'),
    comment: f('businessTypes'),
    config: { canExport: false, canImport: false }
  },
  method: {
    field: varchar('method', { length: 255 }),
    comment: f('method'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('method'), cellType: "STRING" as const }
  },
  requestMethod: {
    field: varchar('request_method', { length: 50 }),
    comment: f('requestMethod'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('requestMethod'), cellType: "STRING" as const }
  },
  type: {
    field: integer('type'),
    comment: f('type'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('type'), cellType: "NUMERIC" as const }
  },
  name: {
    field: varchar('name', { length: 50 }),
    comment: f('name'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  departmentName: {
    field: varchar('department_name', { length: 50 }),
    comment: f('departmentName'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('departmentName'), cellType: "STRING" as const }
  },
  url: {
    field: varchar('url', { length: 255 }),
    comment: f('url'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('url'), cellType: "STRING" as const }
  },
  ip: {
    field: varchar('ip', { length: 50 }),
    comment: f('ip'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('ip'), cellType: "STRING" as const }
  },
  location: {
    field: varchar('location', { length: 255 }),
    comment: f('location'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('location'), cellType: "STRING" as const }
  },
  param: {
    field: text('param'),
    comment: f('param'),
    config: { canExport: false, canImport: false }
  },
  jsonResult: {
    field: text('json_result'),
    comment: f('jsonResult'),
    config: { canExport: false, canImport: false }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('status'), cellType: "STRING" as const }
  },
  errorMsg: {
    field: text('error_msg'),
    comment: f('errorMsg'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('errorMsg'), cellType: "TEXT" as const }
  },
  time: {
    field: timestamp('time'),
    comment: f('time'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('time'), cellType: "STRING" as const }
  },
  costTime: {
    field: bigint('cost_time', { mode: 'number' }),
    comment: f('costTime'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('costTime'), cellType: "NUMERIC" as const }
  },
} satisfies FieldMap;

export const operationLogFields = mergeFields(pkSchema, operationLogOwnFields);

// ============ Meta ============
export const operationLogMeta: EntityMeta = {
  name: 'system_operation_log',
  displayName: tSystemMeta('operationLog', 'displayName'),
  verboseName: tSystemMeta('operationLog', 'verboseName'),
  verboseNamePlural: tSystemMeta('operationLog', 'verboseNamePlural'),
  permissions: createPermissions('system_operation_log'),
};

// ============ Table ============
export const operationLog = pgTable(operationLogMeta.name, getTableFields(operationLogFields));

// ============ Config ============
export const operationLogConfig = getFieldConfigs(operationLogFields);

// ============ Schemas ============
export const operationLogZodSchemas = createZodSchemas(operationLog, operationLogFields);
