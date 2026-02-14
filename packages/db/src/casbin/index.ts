/**
 * Casbin 权限管理模块
 */

export { DrizzleCasbinAdapter, type CasbinPolicy } from './adapter';
export { 
  FilePermissionAdapter,
  FILE_PERMISSIONS,
  PERMISSION_EFFECTS,
  SUBJECT_PREFIXES,
  RESOURCE_PREFIXES,
  buildSubject,
  buildResource,
  parseSubject,
  parseResource,
  type FilePermission,
  type PermissionEffect,
  type SubjectType,
  type ResourceType,
  type FilePermissionEntry,
  type EffectivePermission,
} from './filePermission';
