import { pgTable, varchar, text, char, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tAi, tAiMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';

const f = (field: string) => tAi('tool', field);

// ============ Fields ============
const toolOwnFields = {
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
  groupId: {
    field: varchar("group_id", { length: 36 }),
    comment: f('groupId'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('groupId'), importExcelColumnName: f('groupId'), cellType: "STRING" as const }
  },
  inputSchema: {
    field: jsonb("input_schema").$type<Record<string, unknown>>(),
    comment: f('inputSchema'),
    config: { canExport: false, canImport: false }
  },
  outputSchema: {
    field: jsonb("output_schema").$type<Record<string, unknown>>(),
    comment: f('outputSchema'),
    config: { canExport: false, canImport: false }
  },
  implementation: {
    field: text("implementation"),
    comment: f('implementation'),
    config: { canExport: false, canImport: false }
  },
  isAsync: {
    field: boolean("is_async").default(false),
    comment: f('isAsync'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isAsync'), importExcelColumnName: f('isAsync'), cellType: "BOOLEAN" as const }
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

export const toolFields = mergeFields(pkSchema, auditSchema, toolOwnFields);

// ============ Meta ============
export const toolMeta: EntityMeta = {
  name: 'ai_tool',
  displayName: tAiMeta('tool', 'displayName'),
  verboseName: tAiMeta('tool', 'verboseName'),
  verboseNamePlural: tAiMeta('tool', 'verboseNamePlural'),
  permissions: createPermissions('ai_tool'),
};

// ============ Table ============
export const tool = pgTable(toolMeta.name, getTableFields(toolFields));

// ============ Config ============
export const toolConfig = getFieldConfigs(toolFields);

// ============ Schemas ============
export const toolZodSchemas = createZodSchemas(tool, toolFields);
