import { pgTable, char, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tSystem('jobLog', field);

// ============ Fields ============
const jobLogOwnFields = {
  jobName: {
    field: varchar("job_name", { length: 64 }).notNull(),
    comment: f('jobName'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('jobName'), cellType: "STRING" as const }
  },
  jobGroup: {
    field: varchar("job_group", { length: 64 }).notNull(),
    comment: f('jobGroup'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('jobGroup'), cellType: "STRING" as const }
  },
  invokeTarget: {
    field: varchar("invoke_target", { length: 500 }).notNull(),
    comment: f('invokeTarget'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('invokeTarget'), cellType: "STRING" as const }
  },
  jobMessage: {
    field: text("job_message"),
    comment: f('jobMessage'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('jobMessage'), cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('status'), cellType: "STRING" as const }
  },
  exceptionInfo: {
    field: text("exception_info"),
    comment: f('exceptionInfo'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('exceptionInfo'), cellType: "TEXT" as const }
  },
  startTime: {
    field: timestamp("start_time"),
    comment: f('startTime'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('startTime'), cellType: "STRING" as const }
  },
  stopTime: {
    field: timestamp("stop_time"),
    comment: f('stopTime'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('stopTime'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const jobLogFields = mergeFields(pkSchema, auditSchema, jobLogOwnFields);

// ============ Meta ============
export const jobLogMeta: EntityMeta = {
  name: 'system_job_log',
  displayName: tSystemMeta('jobLog', 'displayName'),
  verboseName: tSystemMeta('jobLog', 'verboseName'),
  verboseNamePlural: tSystemMeta('jobLog', 'verboseNamePlural'),
  permissions: createPermissions('system_job_log'),
};

// ============ Table ============
export const jobLog = pgTable(jobLogMeta.name, getTableFields(jobLogFields));

// ============ Config ============
export const jobLogConfig = getFieldConfigs(jobLogFields);

// ============ Schemas ============
export const jobLogZodSchemas = createZodSchemas(jobLog, jobLogFields);
