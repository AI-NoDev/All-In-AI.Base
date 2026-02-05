import { pgTable, varchar, text, char, integer, jsonb } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tAi, tAiMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tAi('toolGroup', field);

// ============ Fields ============
const toolGroupOwnFields = {
  name: {
    field: varchar("name", { length: 64 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  description: {
    field: text("description"),
    comment: f('description'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('description'), importExcelColumnName: f('description'), cellType: "TEXT" as const }
  },
  icon: {
    field: varchar("icon", { length: 64 }),
    comment: f('icon'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('icon'), importExcelColumnName: f('icon'), cellType: "STRING" as const }
  },
  tools: {
    field: jsonb("tools").$type<string[]>().default([]),
    comment: f('tools'),
    config: { canExport: false, canImport: false }
  },
  orderNum: {
    field: integer("order_num").notNull().default(1),
    comment: f('orderNum'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('orderNum'), importExcelColumnName: f('orderNum'), cellType: "NUMERIC" as const }
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

export const toolGroupFields = mergeFields(pkSchema, auditSchema, toolGroupOwnFields);

// ============ Meta ============
export const toolGroupMeta: EntityMeta = {
  name: 'ai_tool_group',
  displayName: tAiMeta('toolGroup', 'displayName'),
  verboseName: tAiMeta('toolGroup', 'verboseName'),
  verboseNamePlural: tAiMeta('toolGroup', 'verboseNamePlural'),
  permissions: createPermissions('ai_tool_group'),
};

// ============ Table ============
export const toolGroup = pgTable(toolGroupMeta.name, getTableFields(toolGroupFields));

// ============ Config ============
export const toolGroupConfig = getFieldConfigs(toolGroupFields);

// ============ Schemas ============
export const toolGroupZodSchemas = createZodSchemas(toolGroup, toolGroupFields);
