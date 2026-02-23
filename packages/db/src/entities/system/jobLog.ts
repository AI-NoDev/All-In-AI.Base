import { pgTable, char, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

// ============ Fields ============
const jobLogOwnFields = {
  jobName: {
    field: varchar("job_name", { length: 64 }).notNull(),
    comment: () => '任务名称',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '任务名称', cellType: "STRING" as const }
  },
  jobGroup: {
    field: varchar("job_group", { length: 64 }).notNull(),
    comment: () => '任务组名',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '任务组名', cellType: "STRING" as const }
  },
  invokeTarget: {
    field: varchar("invoke_target", { length: 500 }).notNull(),
    comment: () => '调用目标',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '调用目标', cellType: "STRING" as const }
  },
  jobMessage: {
    field: text("job_message"),
    comment: () => '日志信息',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '日志信息', cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: () => '状态',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '状态', cellType: "STRING" as const }
  },
  exceptionInfo: {
    field: text("exception_info"),
    comment: () => '异常信息',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '异常信息', cellType: "TEXT" as const }
  },
  startTime: {
    field: timestamp("start_time"),
    comment: () => '开始时间',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '开始时间', cellType: "STRING" as const }
  },
  stopTime: {
    field: timestamp("stop_time"),
    comment: () => '结束时间',
    config: { canExport: true, canImport: false, exportExcelColumnName: () => '结束时间', cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const jobLogFields = mergeFields(pkSchema, auditSchema, jobLogOwnFields);

// ============ Meta ============
export const jobLogMeta: EntityMeta = {
  name: 'system_job_log',
  displayName: () => '任务日志',
  verboseName: () => '任务日志',
  verboseNamePlural: () => '任务日志',
  permissions: createPermissions('system_job_log'),
};

// ============ Table ============
export const jobLog = pgTable(jobLogMeta.name, getTableFields(jobLogFields));

// ============ Config ============
export const jobLogConfig = getFieldConfigs(jobLogFields);

// ============ Schemas ============
export const jobLogSchemas = createTypeboxSchemas(jobLog);

// ============ Types ============
export type JobLogSelect = typeof jobLog.$inferSelect;
export type JobLogInsert = typeof jobLog.$inferInsert;
