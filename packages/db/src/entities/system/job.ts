import { pgTable, char, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_job_meta_displayName,
  db_system_job_meta_verboseName,
  db_system_job_meta_verboseNamePlural,
  db_system_job_name,
  db_system_job_group,
  db_system_job_invokeTarget,
  db_system_job_cronExpression,
  db_system_job_misfirePolicy,
  db_system_job_concurrent,
  db_system_job_status,
  db_system_job_nextValidTime,
  db_system_job_remark,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const jobOwnFields = {
  name: {
    field: varchar("name", { length: 64 }).notNull(),
    comment: db_system_job_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_job_name, importExcelColumnName: db_system_job_name, cellType: "STRING" as const }
  },
  group: {
    field: varchar("group", { length: 64 }).notNull().default('DEFAULT'),
    comment: db_system_job_group,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_job_group, importExcelColumnName: db_system_job_group, cellType: "STRING" as const }
  },
  invokeTarget: {
    field: varchar("invoke_target", { length: 500 }).notNull(),
    comment: db_system_job_invokeTarget,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_job_invokeTarget, importExcelColumnName: db_system_job_invokeTarget, cellType: "STRING" as const }
  },
  cronExpression: {
    field: varchar("cron_expression", { length: 255 }),
    comment: db_system_job_cronExpression,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_job_cronExpression, importExcelColumnName: db_system_job_cronExpression, cellType: "STRING" as const }
  },
  misfirePolicy: {
    field: char("misfire_policy", { length: 1 }).default('3'),
    comment: db_system_job_misfirePolicy,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_job_misfirePolicy, importExcelColumnName: db_system_job_misfirePolicy, cellType: "STRING" as const }
  },
  concurrent: {
    field: boolean("concurrent").notNull().default(false),
    comment: db_system_job_concurrent,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_job_concurrent, importExcelColumnName: db_system_job_concurrent, cellType: "STRING" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: db_system_job_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_job_status, importExcelColumnName: db_system_job_status, cellType: "STRING" as const }
  },
  nextValidTime: {
    field: timestamp("next_valid_time"),
    comment: db_system_job_nextValidTime,
    config: { canExport: true, canImport: false, exportExcelColumnName: db_system_job_nextValidTime, cellType: "STRING" as const }
  },
  remark: {
    field: varchar("remark", { length: 512 }),
    comment: db_system_job_remark,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_job_remark, importExcelColumnName: db_system_job_remark, cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const jobFields = mergeFields(pkSchema, auditSchema, jobOwnFields);

// ============ Meta ============
export const jobMeta: EntityMeta = {
  name: 'system_job',
  displayName: db_system_job_meta_displayName,
  verboseName: db_system_job_meta_verboseName,
  verboseNamePlural: db_system_job_meta_verboseNamePlural,
  permissions: createPermissions('system_job'),
};

// ============ Table ============
export const job = pgTable(jobMeta.name, getTableFields(jobFields));

// ============ Config ============
export const jobConfig = getFieldConfigs(jobFields);

// ============ Schemas ============
export const jobZodSchemas = createZodSchemas(job, jobFields);
