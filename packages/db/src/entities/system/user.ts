import { pgTable, uuid, varchar, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createPermissions, createDescribeRefinements,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { tSystem, tSystemMeta } from '../../i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';
import { createInsertZodSchema, createSelectZodSchema, createUpdateZodSchema } from '../../types';
import z4, { z } from 'zod/v4';

const f = (field: string) => tSystem('user', field);

// ============ Fields ============
const userOwnFields = {
  deptId: {
    field: uuid('dept_id'),
    comment: f('deptId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('deptId'), cellType: "STRING" as const }
  },
  parentId: {
    field: uuid('parent_id'),
    comment: f('parentId'),
    config: { canExport: false, canImport: false }
  },
  roleId: {
    field: uuid('role_id'),
    comment: f('roleId'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('roleId'), cellType: "STRING" as const }
  },
  loginName: {
    field: varchar('login_name', { length: 30 }).notNull(),
    comment: f('loginName'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('loginName'), importExcelColumnName: f('loginName'), cellType: "STRING" as const }
  },
  name: {
    field: varchar('name', { length: 30 }).notNull(),
    comment: f('name'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('name'), importExcelColumnName: f('name'), cellType: "STRING" as const }
  },
  userType: {
    field: varchar('user_type', { length: 10 }),
    comment: f('userType'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('userType'), importExcelColumnName: f('userType'), cellType: "STRING" as const }
  },
  email: {
    field: varchar('email', { length: 50 }),
    comment: f('email'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('email'), importExcelColumnName: f('email'), cellType: "STRING" as const }
  },
  phonenumber: {
    field: varchar('phonenumber', { length: 11 }),
    comment: f('phonenumber'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('phonenumber'), importExcelColumnName: f('phonenumber'), cellType: "STRING" as const }
  },
  sex: {
    field: varchar('sex', { length: 1 }),
    comment: f('sex'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('sex'), importExcelColumnName: f('sex'), cellType: "STRING" as const }
  },
  avatar: {
    field: varchar('avatar', { length: 255 }),
    comment: f('avatar'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('avatar'), cellType: "IMAGE" as const }
  },
  password: {
    field: varchar('password', { length: 255 }),
    comment: f('password'),
    config: { canExport: false, canImport: true, importExcelColumnName: f('password'), cellType: "STRING" as const }
  },
  salt: {
    field: varchar('salt', { length: 255 }),
    comment: f('salt'),
    config: { canExport: false, canImport: false }
  },
  status: {
    field: varchar('status', { length: 1 }),
    comment: f('status'),
    config: { canExport: true, canImport: true, exportExcelColumnName: f('status'), importExcelColumnName: f('status'), cellType: "STRING" as const }
  },
  loginIp: {
    field: varchar('login_ip', { length: 50 }),
    comment: f('loginIp'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('loginIp'), cellType: "STRING" as const }
  },
  loginDate: {
    field: timestamp('login_date'),
    comment: f('loginDate'),
    config: { canExport: true, canImport: false, exportExcelColumnName: f('loginDate'), cellType: "STRING" as const }
  },
  pwdUpdateDate: {
    field: timestamp('pwd_update_date'),
    comment: f('pwdUpdateDate'),
    config: { canExport: false, canImport: false }
  },
  roleIds: {
    field: jsonb('role_ids').$type<string[]>(),
    comment: f('roleIds'),
    config: { canExport: false, canImport: false }
  },
  postIds: {
    field: jsonb('post_ids').$type<string[]>(),
    comment: f('postIds'),
    config: { canExport: false, canImport: false }
  },
  permissions: {
    field: jsonb('permissions').$type<string[]>(),
    comment: f('permissions'),
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

export const userFields = mergeFields(pkSchema, auditSchema, deletedSchema, userOwnFields);

// ============ Meta ============
export const userMeta: EntityMeta = {
  name: 'system_user',
  displayName: tSystemMeta('user', 'displayName'),
  verboseName: tSystemMeta('user', 'verboseName'),
  verboseNamePlural: tSystemMeta('user', 'verboseNamePlural'),
  permissions: createPermissions('system_user'),
};

// ============ Table ============
export const user = pgTable(userMeta.name, getTableFields(userFields));

// ============ Config ============
export const userConfig = getFieldConfigs(userFields);

// ============ Schemas ============
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const describeRefinements = createDescribeRefinements(userFields) as any;

export const userZodSchemas = {
  insert: createInsertZodSchema(user, {
    ...describeRefinements,
    roleIds: z.array(z.uuid()).describe(userFields.roleIds.comment()),
    postIds: z.array(z.uuid()).describe(userFields.postIds.comment()),
    permissions: z.array(z.string()).describe(userFields.permissions.comment()),
  }),
  select: createSelectZodSchema(user, {
    ...describeRefinements,
    salt: z.undefined(),
    password: z.undefined(),
    roleIds: z.array(z.uuid()).nullable().describe(userFields.roleIds.comment()),
    postIds: z.array(z.uuid()).nullable().describe(userFields.postIds.comment()),
    permissions: z.array(z.string()).nullable().describe(userFields.permissions.comment()),
  }),
  update: createUpdateZodSchema(user, {
    ...describeRefinements,
    roleIds: z.array(z.uuid()).optional().describe(userFields.roleIds.comment()),
    postIds: z.array(z.uuid()).optional().describe(userFields.postIds.comment()),
    permissions: z.array(z.string()).optional().describe(userFields.permissions.comment()),
  }),
};

