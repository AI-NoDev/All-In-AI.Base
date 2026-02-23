import { pgTable, uuid, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { 
  mergeFields, getTableFields, getFieldConfigs, createPermissions, createTypeboxSchemas,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import {
  db_system_user_meta_displayName,
  db_system_user_meta_verboseName,
  db_system_user_meta_verboseNamePlural,
  db_system_user_deptId,
  db_system_user_loginName,
  db_system_user_name,
  db_system_user_userType,
  db_system_user_email,
  db_system_user_phonenumber,
  db_system_user_sex,
  db_system_user_avatar,
  db_system_user_password,
  db_system_user_salt,
  db_system_user_status,
  db_system_user_loginIp,
  db_system_user_loginDate,
  db_system_user_pwdUpdateDate,
  db_system_user_preferences,
} from '@qiyu-allinai/i18n';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

/**
 * 用户表
 */

// ============ Fields ============
const userOwnFields = {
  deptId: {
    field: uuid('dept_id'),
    comment: db_system_user_deptId,
    config: { canExport: false, canImport: true, importExcelColumnName: db_system_user_deptId, cellType: "STRING" as const }
  },
  loginName: {
    field: varchar('login_name', { length: 30 }).notNull().unique(),
    comment: db_system_user_loginName,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_user_loginName, importExcelColumnName: db_system_user_loginName, cellType: "STRING" as const }
  },
  name: {
    field: varchar('name', { length: 30 }).notNull(),
    comment: db_system_user_name,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_user_name, importExcelColumnName: db_system_user_name, cellType: "STRING" as const }
  },
  userType: {
    field: varchar('user_type', { length: 10 }).default('user'),
    comment: db_system_user_userType,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_user_userType, importExcelColumnName: db_system_user_userType, cellType: "STRING" as const }
  },
  email: {
    field: varchar('email', { length: 50 }),
    comment: db_system_user_email,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_user_email, importExcelColumnName: db_system_user_email, cellType: "STRING" as const }
  },
  phonenumber: {
    field: varchar('phonenumber', { length: 11 }),
    comment: db_system_user_phonenumber,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_user_phonenumber, importExcelColumnName: db_system_user_phonenumber, cellType: "STRING" as const }
  },
  sex: {
    field: varchar('sex', { length: 1 }),
    comment: db_system_user_sex,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_user_sex, importExcelColumnName: db_system_user_sex, cellType: "STRING" as const }
  },
  avatar: {
    field: varchar('avatar', { length: 255 }),
    comment: db_system_user_avatar,
    config: { canExport: true, canImport: false, exportExcelColumnName: db_system_user_avatar, cellType: "IMAGE" as const }
  },
  password: {
    field: varchar('password', { length: 255 }),
    comment: db_system_user_password,
    config: { canExport: false, canImport: true, importExcelColumnName: db_system_user_password, cellType: "STRING" as const }
  },
  salt: {
    field: varchar('salt', { length: 255 }),
    comment: db_system_user_salt,
    config: { canExport: false, canImport: false }
  },
  status: {
    field: varchar('status', { length: 1 }).default('0'),
    comment: db_system_user_status,
    config: { canExport: true, canImport: true, exportExcelColumnName: db_system_user_status, importExcelColumnName: db_system_user_status, cellType: "STRING" as const }
  },
  loginIp: {
    field: varchar('login_ip', { length: 50 }),
    comment: db_system_user_loginIp,
    config: { canExport: true, canImport: false, exportExcelColumnName: db_system_user_loginIp, cellType: "STRING" as const }
  },
  loginDate: {
    field: timestamp('login_date'),
    comment: db_system_user_loginDate,
    config: { canExport: true, canImport: false, exportExcelColumnName: db_system_user_loginDate, cellType: "STRING" as const }
  },
  pwdUpdateDate: {
    field: timestamp('pwd_update_date'),
    comment: db_system_user_pwdUpdateDate,
    config: { canExport: false, canImport: false }
  },
  preferences: {
    field: jsonb('preferences'),
    comment: db_system_user_preferences,
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;

export const userFields = mergeFields(pkSchema, auditSchema, deletedSchema, userOwnFields);

// ============ Meta ============
export const userMeta: EntityMeta = {
  name: 'system_user',
  displayName: db_system_user_meta_displayName,
  verboseName: db_system_user_meta_verboseName,
  verboseNamePlural: db_system_user_meta_verboseNamePlural,
  permissions: createPermissions('system_user'),
};

// ============ Table ============
export const user = pgTable(userMeta.name, getTableFields(userFields));

// ============ Config ============
export const userConfig = getFieldConfigs(userFields);

// ============ Schemas (TypeBox) ============
export const userSchemas = createTypeboxSchemas(user);

// ============ Types (从 Drizzle 推导) ============
export type UserSelect = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;

// ============ 用户类型常量 ============
export const USER_TYPES = {
  /** 系统管理员 - 拥有所有权限 */
  SYSTEM_ADMIN: '00',
  /** 普通用户 */
  USER: 'user',
} as const;

// ============ 用户状态常量 ============
export const USER_STATUS = {
  /** 正常 */
  NORMAL: '0',
  /** 停用 */
  DISABLED: '1',
} as const;
