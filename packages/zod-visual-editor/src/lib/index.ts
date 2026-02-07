// Types
export type {
  FieldType,
  SchemaType,
  Field,
  RootSchema,
  StringSchema,
  NumberSchema,
  BooleanSchema,
  LiteralSchema,
  EnumSchema,
  ArraySchema,
  UnionSchema,
  ObjectSchema,
} from './types.js';

// Type utilities
export {
  TYPE_ICONS,
  generateId,
  createSchemaType,
  createField,
  createRootSchema,
  cloneSchemaType,
  cloneField,
} from './types.js';

// Generator (RootSchema → Zod/JSON Schema/TypeScript)
export { toZodSchema, toJsonSchema, toTypeScriptCode } from './generator.js';

// Parser (Zod/JSON Schema → RootSchema)
export { fromZodSchema, fromJsonSchema } from './parser.js';

// Examples
export { examples } from './examples.js';

// Components
export { default as ZodVisualEditor } from './components/editor/zod-visual-editor.svelte';
export { default as FieldItem } from './components/editor/field-item.svelte';
