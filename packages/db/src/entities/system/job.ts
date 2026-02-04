import { pgTable, char, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tSystem('job', field);

// ============ Fields ============
const jobOwnFields = {
  name: {
    field: varchar("name", { length: 64 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  group: {
    field: varchar("group", { length: 64 }).notNull().default('DEFAULT'),
    comment: f('group'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('group'), importExcelColumnName: f('group'), cellType: "STRING" as const }
  },
  invokeTarget: {
    field: varchar("invoke_target", { length: 500 }).notNull(),
    comment: f('invokeTarget'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('invokeTarget'), importExcelColumnName: f('invokeTarget'), cellType: "STRING" as const }
  },
  cronExpression: {
    field: varchar("cron_expression", { length: 255 }),
    comment: f('cronExpression'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('cronExpression'), importExcelColumnName: f('cronExpression'), cellType: "STRING" as const }
  },
  misfirePolicy: {
    field: char("misfire_policy", { length: 1 }).default('3'),
    comment: f('misfirePolicy'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('misfirePolicy'), importExcelColumnName: f('misfirePolicy'), cellType: "STRING" as const }
  },
  concurrent: {
    field: boolean("concurrent").notNull().default(false),
    comment: f('concurrent'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('concurrent'), importExcelColumnName: f('concurrent'), cellType: "STRING" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
  nextValidTime: {
    field: timestamp("next_valid_time"),
    comment: f('nextValidTime'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('nextValidTime'), cellType: "STRING" as const }
  },
  remark: {
    field: varchar("remark", { length: 512 }),
    comment: f('remark'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('remark'), importExcelColumnName: f('remark'), cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const jobFields = mergeFields(pkSchema, auditSchema, jobOwnFields);

// ============ Meta ============
export const jobMeta: EntityMeta = {
  name: 'system_job',
  displayName: tSystemMeta('job', 'displayName'),
  verboseName: tSystemMeta('job', 'verboseName'),
  verboseNamePlural: tSystemMeta('job', 'verboseNamePlural'),
  permissions: createPermissions('system_job'),
};

// ============ Table ============
export const job = pgTable(jobMeta.name, getTableFields(jobFields));

// ============ Config ============
export const jobConfig = getFieldConfigs(jobFields);

// ============ Schemas ============
export const jobZodSchemas = createZodSchemas(job, jobFields);
