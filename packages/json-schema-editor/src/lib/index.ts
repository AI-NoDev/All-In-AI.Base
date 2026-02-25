// ==================== New Simplified Types (5 types only) ====================
export type {
  FieldType,
  StringFormat,
  Field,
  StringField,
  NumberField,
  BooleanField,
  ArrayField,
  ObjectField,
  JsonSchema,
} from './types.js';

export {
  TYPE_ICONS,
  TYPE_LABELS,
  TYPE_COLORS,
  STRING_FORMATS,
  generateId,
  createField,
  createSchema,
  cloneField,
} from './types.js';

// Converter (JsonSchema ↔ Standard JSON Schema)
export { toJsonSchema, fromJsonSchema } from './converter.js';

// Components
export { default as JsonSchemaEditor } from './components/json-schema-editor.svelte';

// ==================== Legacy Types (8 types, for flow-editor compatibility) ====================
export type {
  LegacyFieldType,
  SchemaType,
  Field as LegacyField,
  RootSchema,
  StringSchema,
  NumberSchema,
  BooleanSchema,
  LiteralSchema,
  EnumSchema,
  ArraySchema,
  UnionSchema,
  ObjectSchema,
} from './legacy-types.js';

export {
  LEGACY_TYPE_ICONS,
  generateId as legacyGenerateId,
  createSchemaType,
  createField as legacyCreateField,
  createRootSchema,
  cloneSchemaType,
  cloneField as legacyCloneField,
} from './legacy-types.js';

// Legacy converter
export { legacyToJsonSchema, legacyFromJsonSchema } from './legacy-converter.js';

// Legacy editor component (for flow-editor compatibility)
export { default as ZodVisualEditor } from './components/legacy-editor.svelte';
