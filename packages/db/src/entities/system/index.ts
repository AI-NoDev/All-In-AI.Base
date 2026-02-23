// System entities - tables, fields, meta, config, schemas
export { user, userFields, userMeta, userConfig, userSchemas, USER_TYPES, USER_STATUS, type UserSelect, type UserInsert } from './user';
export { config, configFields, configMeta, configConfig, configSchemas, type ConfigSelect, type ConfigInsert } from './config';
export { department, departmentFields, departmentMeta, departmentConfig, departmentSchemas, type DepartmentSelect, type DepartmentInsert } from './department';
export { dict, dictFields, dictMeta, dictConfig, dictSchemas, type DictSelect, type DictInsert } from './dict';
export { dictGroup, dictGroupFields, dictGroupMeta, dictGroupConfig, dictGroupSchemas, type DictGroupSelect, type DictGroupInsert } from './dictGroup';
export { job, jobFields, jobMeta, jobConfig, jobSchemas, type JobSelect, type JobInsert } from './job';
export { jobLog, jobLogFields, jobLogMeta, jobLogConfig, jobLogSchemas, type JobLogSelect, type JobLogInsert } from './jobLog';
export { loginInfo, loginInfoFields, loginInfoMeta, loginInfoConfig, loginInfoSchemas, type LoginInfoSelect, type LoginInfoInsert } from './loginInfo';
export { menu, menuFields, menuMeta, menuConfig, menuSchemas, type MenuSelect, type MenuInsert } from './menu';
export { notice, noticeFields, noticeMeta, noticeConfig, noticeTypeboxSchemas, NOTICE_STATUS, NOTICE_TYPE, NOTICE_TARGET_TYPE, type NoticeSelect, type NoticeInsert } from './notice';
export { noticeRead, noticeReadFields, noticeReadMeta, noticeReadConfig, noticeReadSchemas, type NoticeReadSelect, type NoticeReadInsert } from './noticeRead';
export { operationLog, operationLogFields, operationLogMeta, operationLogConfig, operationLogSchemas, type OperationLogSelect, type OperationLogInsert } from './operationLog';
export { post, postFields, postMeta, postConfig, postSchemas, type PostSelect, type PostInsert } from './post';
export { role, roleFields, roleMeta, roleConfig, roleSchemas, DATA_SCOPE, BUILTIN_ROLES, type RoleSelect, type RoleInsert } from './role';
export { roleDepartment, roleDepartmentFields, roleDepartmentMeta, roleDepartmentConfig, roleDepartmentSchemas, type RoleDepartmentSelect, type RoleDepartmentInsert } from './roleDepartment';
export { roleMenu, roleMenuFields, roleMenuMeta, roleMenuConfig, roleMenuSchemas, type RoleMenuSelect, type RoleMenuInsert } from './roleMenu';
export { token, tokenFields, tokenMeta, tokenConfig, tokenSchemas, type TokenSelect, type TokenInsert } from './token';
export { userPost, userPostFields, userPostMeta, userPostConfig, userPostSchemas, type UserPostSelect, type UserPostInsert } from './userPost';
export { userRole, userRoleFields, userRoleMeta, userRoleConfig, userRoleSchemas, type UserRoleSelect, type UserRoleInsert } from './userRole';

// Casbin permission entities
export { 
  casbinRule, casbinRuleFields, casbinRuleMeta, casbinRuleConfig, casbinRuleSchemas,
  CASBIN_POLICY_TYPES, createPolicy, createRoleGrouping, createResourceGrouping,
  type CasbinRuleSelect, type CasbinRuleInsert
} from './casbinRule';
export { 
  permission, permissionFields, permissionMeta, permissionConfig, permissionSchemas,
  PERMISSION_TYPES, STANDARD_ACTIONS,
  type PermissionSelect, type PermissionInsert
} from './permission';

// Relations
export * from './relations';

// Export schemas for drizzle-kit
export * from './exportSchemas';
