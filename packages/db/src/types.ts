// Re-export types and utilities from entity.ts
export { 
  type FieldMap, 
  type FieldConfig, 
  type FieldDef, 
  type EntityMeta,
  getTableFields, 
  getFieldConfigs,
  mergeFields,
  createZodSchemas,
  createDescribeRefinements,
} from './utils/entity';

// Re-export factory functions
export {
  createInsertZodSchema,
  createSelectZodSchema,
  createUpdateZodSchema,
} from './utils/factory';
