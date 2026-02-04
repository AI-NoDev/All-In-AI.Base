import { pgTable, uuid, varchar, text, char, boolean, jsonb } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tAi, tAiMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { permissionSchema } from '../base/permissionSchema';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

const f = (field: string) => tAi('tool', field);

// ============ Fields ============
const toolOwnFields = {
  groupId: {
    field: uuid("group_id"),
    comment: f('groupId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('groupId'), cellType: "STRING" as const }
  },
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
  isAsync: {
    field: boolean("is_async").notNull().default(false),
    comment: f('isAsync'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('isAsync'), importExcelColumnName: f('isAsync'), cellType: "STRING" as const }
  },
  implementation: {
    field: text("implementation"),
    comment: f('implementation'),
    config: { canExport: false, canImport: false }
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

export const toolFields = mergeFields(pkSchema, auditSchema, permissionSchema, toolOwnFields);

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeRefinements = createDescribeRefinements(toolFields) as any;

export const toolZodSchemas = {
  insert: createInsertZodSchema(tool, {
    ...describeRefinements,
    allowedUserIds: z.array(z.uuid()).describe(toolFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).describe(toolFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).describe(toolFields.allowedDeptIds.comment()),
  }),
  select: createSelectZodSchema(tool, {
    ...describeRefinements,
    allowedUserIds: z.array(z.uuid()).nullable().describe(toolFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).nullable().describe(toolFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).nullable().describe(toolFields.allowedDeptIds.comment()),
  }),
  update: createUpdateZodSchema(tool, {
    ...describeRefinements,
    allowedUserIds: z.array(z.uuid()).optional().describe(toolFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).optional().describe(toolFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).optional().describe(toolFields.allowedDeptIds.comment()),
  }),
};
