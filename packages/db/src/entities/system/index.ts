// System entities - tables, fields, meta, config, schemas
export { user, userFields, userMeta, userConfig, userZodSchemas, USER_TYPES, USER_STATUS } from './user';
export { config, configFields, configMeta, configConfig, configZodSchemas } from './config';
export { department, departmentFields, departmentMeta, departmentConfig, departmentZodSchemas } from './department';
export { dict, dictFields, dictMeta, dictConfig, dictZodSchemas } from './dict';
export { dictGroup, dictGroupFields, dictGroupMeta, dictGroupConfig, dictGroupZodSchemas } from './dictGroup';
export { job, jobFields, jobMeta, jobConfig, jobZodSchemas } from './job';
export { jobLog, jobLogFields, jobLogMeta, jobLogConfig, jobLogZodSchemas } from './jobLog';
export { loginInfo, loginInfoFields, loginInfoMeta, loginInfoConfig, loginInfoZodSchemas } from './loginInfo';
export { menu, menuFields, menuMeta, menuConfig, menuZodSchemas } from './menu';
export { notice, noticeFields, noticeMeta, noticeConfig, noticeZodSchemas } from './notice';
export { operationLog, operationLogFields, operationLogMeta, operationLogConfig, operationLogZodSchemas } from './operationLog';
export { post, postFields, postMeta, postConfig, postZodSchemas } from './post';
export { role, roleFields, roleMeta, roleConfig, roleZodSchemas, DATA_SCOPE, BUILTIN_ROLES } from './role';
export { roleDepartment, roleDepartmentFields, roleDepartmentMeta, roleDepartmentConfig, roleDepartmentZodSchemas } from './roleDepartment';
export { roleMenu, roleMenuFields, roleMenuMeta, roleMenuConfig, roleMenuZodSchemas } from './roleMenu';
export { token, tokenFields, tokenMeta, tokenConfig, tokenZodSchemas } from './token';
export { userPost, userPostFields, userPostMeta, userPostConfig, userPostZodSchemas } from './userPost';
export { userRole, userRoleFields, userRoleMeta, userRoleConfig, userRoleZodSchemas } from './userRole';

// Casbin permission entities
export { 
  casbinRule, casbinRuleFields, casbinRuleMeta, casbinRuleConfig, casbinRuleZodSchemas,
  CASBIN_POLICY_TYPES, createPolicy, createRoleGrouping, createResourceGrouping
} from './casbinRule';
export { 
  permission, permissionFields, permissionMeta, permissionConfig, permissionZodSchemas,
  PERMISSION_TYPES, STANDARD_ACTIONS
} from './permission';

// Relations
export * from './relations';

// Export schemas for drizzle-kit
export * from './exportSchemas';
