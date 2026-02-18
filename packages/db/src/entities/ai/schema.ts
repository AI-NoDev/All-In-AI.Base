import { pgTable, varchar, text, char, jsonb } from "drizzle-orm/pg-core";
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { createZodSchemas } from "../../types";

// ============ Fields ============
const schemaOwnFields = {
  name: {
    field: varchar("name", { length: 64 }).notNull(),
    comment: () => '名称',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '名称', importExcelColumnName: () => '名称', cellType: "STRING" as const }
  },
  description: {
    field: text("description"),
    comment: () => '描述',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '描述', importExcelColumnName: () => '描述', cellType: "TEXT" as const }
  },
  // Schema 内容 (JSON Schema 格式)
  schema: {
    field: jsonb("schema").$type<Record<string, unknown>>().notNull(),
    comment: () => 'Schema',
    config: { canExport: false, canImport: false }
  },
  remark: {
    field: text("remark"),
    comment: () => '备注',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '备注', importExcelColumnName: () => '备注', cellType: "TEXT" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: () => '状态',
    config: { canExport: true, canImport: true, exportExcelColumnName: () => '状态', importExcelColumnName: () => '状态', cellType: "STRING" as const }
  },
} satisfies FieldMap;

export const schemaFields = mergeFields(pkSchema, auditSchema, schemaOwnFields);

// ============ Meta ============
export const schemaMeta: EntityMeta = {
  name: 'ai_schema',
  displayName: () => 'Schema',
  verboseName: () => 'Schema',
  verboseNamePlural: () => 'Schemas',
  permissions: createPermissions('ai_schema'),
};

// ============ Table ============
export const schema = pgTable(schemaMeta.name, getTableFields(schemaFields));

// ============ Config ============
export const schemaConfig = getFieldConfigs(schemaFields);

// ============ Schemas ============
export const schemaZodSchemas = createZodSchemas(schema, schemaFields);
