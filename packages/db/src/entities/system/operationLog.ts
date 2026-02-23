import { pgTable, varchar, integer, char, bigint, text, timestamp } from 'drizzle-orm/pg-core';
import { 
  mergeFields, getTableFields, getFieldConfigs, createPermissions, createTypeboxSchemas,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_operationLog_meta_displayName as meta_displayName,
  db_system_operationLog_meta_verboseName as meta_verboseName,
  db_system_operationLog_meta_verboseNamePlural as meta_verboseNamePlural,
  db_system_operationLog_title as f_title,
  db_system_operationLog_businessType as f_businessType,
  db_system_operationLog_method as f_method,
  db_system_operationLog_requestMethod as f_requestMethod,
  db_system_operationLog_type as f_type,
  db_system_operationLog_name as f_name,
  db_system_operationLog_departmentName as f_departmentName,
  db_system_operationLog_url as f_url,
  db_system_operationLog_ip as f_ip,
  db_system_operationLog_location as f_location,
  db_system_operationLog_param as f_param,
  db_system_operationLog_jsonResult as f_jsonResult,
  db_system_operationLog_status as f_status,
  db_system_operationLog_errorMsg as f_errorMsg,
  db_system_operationLog_time as f_time,
  db_system_operationLog_costTime as f_costTime,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';

// ============ Fields ============
const operationLogOwnFields = {
  title: {
    field: varchar('title', { length: 255 }).notNull(),
    comment: f_title,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_title, cellType: "STRING" as const }
  },
  businessType: {
    field: integer('business_type'),
    comment: f_businessType,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_businessType, cellType: "NUMERIC" as const }
  },
  businessTypes: {
    field: text('business_types'),
    comment: f_businessType,
    config: { canExport: false, canImport: false }
  },
  method: {
    field: varchar('method', { length: 255 }),
    comment: f_method,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_method, cellType: "STRING" as const }
  },
  requestMethod: {
    field: varchar('request_method', { length: 50 }),
    comment: f_requestMethod,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_requestMethod, cellType: "STRING" as const }
  },
  type: {
    field: integer('type'),
    comment: f_type,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_type, cellType: "NUMERIC" as const }
  },
  name: {
    field: varchar('name', { length: 50 }),
    comment: f_name,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_name, cellType: "STRING" as const }
  },
  departmentName: {
    field: varchar('department_name', { length: 50 }),
    comment: f_departmentName,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_departmentName, cellType: "STRING" as const }
  },
  url: {
    field: varchar('url', { length: 255 }),
    comment: f_url,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_url, cellType: "STRING" as const }
  },
  ip: {
    field: varchar('ip', { length: 50 }),
    comment: f_ip,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_ip, cellType: "STRING" as const }
  },
  location: {
    field: varchar('location', { length: 255 }),
    comment: f_location,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_location, cellType: "STRING" as const }
  },
  param: {
    field: text('param'),
    comment: f_param,
    config: { canExport: false, canImport: false }
  },
  jsonResult: {
    field: text('json_result'),
    comment: f_jsonResult,
    config: { canExport: false, canImport: false }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f_status,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_status, cellType: "STRING" as const }
  },
  errorMsg: {
    field: text('error_msg'),
    comment: f_errorMsg,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_errorMsg, cellType: "TEXT" as const }
  },
  time: {
    field: timestamp('time'),
    comment: f_time,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_time, cellType: "STRING" as const }
  },
  costTime: {
    field: bigint('cost_time', { mode: 'number' }),
    comment: f_costTime,
    config: { canExport: true, canImport: false, exportExcelColumnName: f_costTime, cellType: "NUMERIC" as const }
  },
} satisfies FieldMap;

export const operationLogFields = mergeFields(pkSchema, operationLogOwnFields);

// ============ Meta ============
export const operationLogMeta: EntityMeta = {
  name: 'system_operation_log',
  displayName: meta_displayName,
  verboseName: meta_verboseName,
  verboseNamePlural: meta_verboseNamePlural,
  permissions: createPermissions('system_operation_log'),
};

// ============ Table ============
export const operationLog = pgTable(operationLogMeta.name, getTableFields(operationLogFields));

// ============ Config ============
export const operationLogConfig = getFieldConfigs(operationLogFields);

// ============ Schemas (TypeBox) ============
export const operationLogSchemas = createTypeboxSchemas(operationLog);

// ============ Types (从 Drizzle 推导) ============
export type OperationLogSelect = typeof operationLog.$inferSelect;
export type OperationLogInsert = typeof operationLog.$inferInsert;
