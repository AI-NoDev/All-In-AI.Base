// Components
export { ZodVisualEditor, SchemaItem as SchemaItemComponent, SchemaPreview } from './components/editor/index.js';

// Types
export type { SchemaItem, SchemaType, RootSchema, EditorLabels, ZodVisualEditorRef } from './types.js';
export {
  isObjectType,
  isUnionType,
  isContainerType,
  isLeafType,
  generateId,
  createDefaultItem,
  createRootSchema,
  findItemById,
  getRefTargets,
  cloneItem,
  defaultLabels,
} from './types.js';

// Generator
export { generateSchema, generateTypeScriptCode } from './generator.js';

// Parser
export { parseZodSchema, parseZodObjectToRoot } from './parser.js';

// AI Tools
export { zodSchemaEditorTools, callTool as callZodSchemaEditorTool, getToolsForApi as getZodSchemaEditorToolsForApi } from './tools.js';
export type { ZodSchemaEditorToolName, ToolCallResult as ZodSchemaEditorToolCallResult, ApiToolDefinition } from './tools.js';
