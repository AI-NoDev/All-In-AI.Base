import { pgTable, varchar, char, boolean, jsonb, json } from 'drizzle-orm/pg-core';
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from "../../types";
import { z } from "zod/v4";

const f = (field: string) => tSystem('role', field);

// ============ Fields ============
const roleOwnFields = {
  name: {
    field: varchar('name', { length: 30 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  key: {
    field: varchar('key', { length: 100 }).notNull(),
    comment: f('key'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('key'), importExcelColumnName: f('key'), cellType: "STRING" as const }
  },
  sort: {
    field: varchar('sort', { length: 10 }).notNull(),
    comment: f('sort'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('sort'), importExcelColumnName: f('sort'), cellType: "STRING" as const }
  },
  dataScope: {
    field: varchar('data_scope', { length: 1 }),
    comment: f('dataScope'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('dataScope'), importExcelColumnName: f('dataScope'), cellType: "STRING" as const }
  },
  status: {
    field: char('status', { length: 1 }).default("0"),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
  flag: {
    field: boolean('flag').default(false),
    comment: f('flag'),
    config: { canExport: false, canImport: false }
  },
  menuIds: {
    field: jsonb('menu_ids').$type<string[]>().default([]),
    comment: f('menuIds'),
    config: { canExport: false, canImport: false }
  },
  deptIds: {
    field: jsonb('dept_ids').$type<string[]>().default([]),
    comment: f('deptIds'),
    config: { canExport: false, canImport: false }
  },
  permissions: {
    field: json('permissions').$type<string[]>().default([]),
    comment: f('permissions'),
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

export const roleFields = mergeFields(pkSchema, auditSchema, deletedSchema, roleOwnFields);

// ============ Meta ============
export const roleMeta: EntityMeta = {
  name: 'system_role',
  displayName: tSystemMeta('role', 'displayName'),
  verboseName: tSystemMeta('role', 'verboseName'),
  verboseNamePlural: tSystemMeta('role', 'verboseNamePlural'),
  permissions: createPermissions('system_role'),
};

// ============ Table ============
export const role = pgTable(roleMeta.name, getTableFields(roleFields));

// ============ Config ============
export const roleConfig = getFieldConfigs(roleFields);

// ============ Schemas ============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeRefinements = createDescribeRefinements(roleFields) as any;

export const roleZodSchemas = {
  insert: createInsertZodSchema(role, {
    ...describeRefinements,
    menuIds: z.array(z.uuid()).describe(roleFields.menuIds.comment()),
    deptIds: z.array(z.uuid()).describe(roleFields.deptIds.comment()),
    permissions: z.array(z.string()).describe(roleFields.permissions.comment()),
  }),
  select: createSelectZodSchema(role, {
    ...describeRefinements,
    menuIds: z.array(z.uuid()).nullable().describe(roleFields.menuIds.comment()),
    deptIds: z.array(z.uuid()).nullable().describe(roleFields.deptIds.comment()),
    permissions: z.array(z.string()).nullable().describe(roleFields.permissions.comment()),
  }),
  update: createUpdateZodSchema(role, {
    ...describeRefinements,
    menuIds: z.array(z.uuid()).optional().describe(roleFields.menuIds.comment()),
    deptIds: z.array(z.uuid()).optional().describe(roleFields.deptIds.comment()),
    permissions: z.array(z.string()).optional().describe(roleFields.permissions.comment()),
  }),
};
