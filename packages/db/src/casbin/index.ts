/**
 * Casbin 权限管理模块
 */

// 基础适配器
export { DrizzleCasbinAdapter, type CasbinPolicy } from './adapter';

// 资源权限抽象基类
export {
  ResourcePermissionAdapter,
  PERMISSION_EFFECTS,
  buildSubject,
  parseSubject,
  parseResourceId,
  type PermissionEffect,
  type SubjectType,
  type PermissionEntry,
  type EffectivePermission,
} from './resourcePermission';

// 知识库权限适配器
export {
  KnowledgePermissionAdapter,
  KNOWLEDGE_PERMISSIONS,
  type KnowledgePermission,
  type KnowledgePermissionEntry,
  type KnowledgeEffectivePermission,
} from './knowledgePermission';

// 部门数据权限适配器
export {
  DepartmentPermissionAdapter,
  DATA_SCOPE,
  PERMISSION_SCOPE,
  BUSINESS_MODULE,
  getDescendantDeptIds,
  getAncestorDeptIds,
  buildMaterializedPath,
  type DataScope,
  type PermissionScope,
  type BusinessModule,
  type DeptDataPermission,
  type DeptDataPermissionResult,
  type DeptInfo,
} from './departmentPermission';
