// Re-export types and utilities from entity.ts
export { 
  type FieldMap, 
  type FieldConfig, 
  type FieldDef, 
  type EntityMeta,
  getTableFields, 
  getFieldConfigs,
  mergeFields,
  createTypeboxSchemas,
  createPermissions,
} from './utils/entity';

// Re-export factory functions
export {
  createInsertTypeboxSchema,
  createSelectTypeboxSchema,
  createUpdateTypeboxSchema,
} from './utils/factory';
