import { pgTable, varchar, text, char, jsonb } from "drizzle-orm/pg-core";
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

const f = (field: string) => tAi('schema', field);

// ============ Fields ============
const schemaOwnFields = {
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
  // Schema 内容 (JSON Schema 格式)
  schema: {
    field: jsonb("schema").$type<Record<string, unknown>>().notNull(),
    comment: f('schema'),
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

export const schemaFields = mergeFields(pkSchema, auditSchema, permissionSchema, schemaOwnFields);

// ============ Meta ============
export const schemaMeta: EntityMeta = {
  name: 'ai_schema',
  displayName: tAiMeta('schema', 'displayName'),
  verboseName: tAiMeta('schema', 'verboseName'),
  verboseNamePlural: tAiMeta('schema', 'verboseNamePlural'),
  permissions: createPermissions('ai_schema'),
};

// ============ Table ============
export const schema = pgTable(schemaMeta.name, getTableFields(schemaFields));

// ============ Config ============
export const schemaConfig = getFieldConfigs(schemaFields);

// ============ Schemas ============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeRefinements = createDescribeRefinements(schemaFields) as any;

export const schemaZodSchemas = {
  insert: createInsertZodSchema(schema, {
    ...describeRefinements,
    schema: z.record(z.string(), z.unknown()).describe(schemaFields.schema.comment()),
    allowedUserIds: z.array(z.uuid()).describe(schemaFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).describe(schemaFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).describe(schemaFields.allowedDeptIds.comment()),
  }),
  select: createSelectZodSchema(schema, {
    ...describeRefinements,
    schema: z.record(z.string(), z.unknown()).describe(schemaFields.schema.comment()),
    allowedUserIds: z.array(z.uuid()).nullable().describe(schemaFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).nullable().describe(schemaFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).nullable().describe(schemaFields.allowedDeptIds.comment()),
  }),
  update: createUpdateZodSchema(schema, {
    ...describeRefinements,
    schema: z.record(z.string(), z.unknown()).optional().describe(schemaFields.schema.comment()),
    allowedUserIds: z.array(z.uuid()).optional().describe(schemaFields.allowedUserIds.comment()),
    allowedRoleIds: z.array(z.uuid()).optional().describe(schemaFields.allowedRoleIds.comment()),
    allowedDeptIds: z.array(z.uuid()).optional().describe(schemaFields.allowedDeptIds.comment()),
  }),
};
