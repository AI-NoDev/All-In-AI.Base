// Schema Item Types
export type SchemaType = 'string' | 'number' | 'boolean' | 'datetime' | 'literal' | 'object' | 'union';

// i18n Labels interface for customization
export interface EditorLabels {
  // Type labels
  string: string;
  number: string;
  boolean: string;
  datetime: string;
  literal: string;
  object: string;
  union: string;
  // UI labels
  required: string;
  array: string;
  reference: string;
  description: string;
  descriptionPlaceholder: string;
  literalValue: string;
  literalValuePlaceholder: string;
  selectReference: string;
  fieldName: string;
  addField: string;
  showCode: string;
  hideCode: string;
  schemaEditor: string;
  noFieldsTitle: string;
  noFieldsDescription: string;
  objectEmptyHint: string;
  unionEmptyHint: string;
}

// Default English labels
export const defaultLabels: EditorLabels = {
  string: 'String',
  number: 'Number',
  boolean: 'Boolean',
  datetime: 'DateTime',
  literal: 'Literal',
  object: 'Object',
  union: 'Union',
  required: 'Required',
  array: 'Array',
  reference: 'Ref',
  description: 'Description',
  descriptionPlaceholder: 'Field description (for AI understanding)',
  literalValue: 'Literal Value',
  literalValuePlaceholder: 'Enter literal value',
  selectReference: 'Select reference',
  fieldName: 'Field name',
  addField: 'Add Field',
  showCode: 'Show Code',
  hideCode: 'Hide Code',
  schemaEditor: 'Schema Editor',
  noFieldsTitle: 'No fields defined yet.',
  noFieldsDescription: 'Click "Add Field" to start building your schema.',
  objectEmptyHint: 'No fields, click + to add',
  unionEmptyHint: 'No options, click + to add (min 2)',
};

export interface SchemaItem {
  id: string;
  name: string;
  type: SchemaType;
  required: boolean;
  isArray: boolean;
  description?: string;
  default?: unknown;
  // only when type === 'object'
  fields?: SchemaItem[];
  // only when type === 'union'
  options?: SchemaItem[];
  // optional lazy reference
  lazy?: {
    refId: string;
  };
  // for literal type
  literalValue?: string | number | boolean;
}

export interface RootSchema {
  type: 'object';
  id: 'root';
  fields: SchemaItem[];
}

// Type guards
export function isObjectType(item: SchemaItem): boolean {
  return item.type === 'object';
}

export function isUnionType(item: SchemaItem): boolean {
  return item.type === 'union';
}

export function isContainerType(item: SchemaItem): boolean {
  return item.type === 'object' || item.type === 'union';
}

export function isLeafType(item: SchemaItem): boolean {
  return !isContainerType(item);
}

// Counter for unique IDs - use crypto.randomUUID for truly unique IDs
export function generateId(): string {
  // Use crypto.randomUUID if available, otherwise fallback to timestamp + random
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `item_${crypto.randomUUID()}`;
  }
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return `item_${timestamp}_${random}`;
}

export function createDefaultItem(type: SchemaType, name: string = ''): SchemaItem {
  const base: SchemaItem = {
    id: generateId(),
    name,
    type,
    required: true,
    isArray: false,
    description: '',
  };

  if (type === 'object') {
    base.fields = [];
  } else if (type === 'union') {
    base.options = [];
  } else if (type === 'literal') {
    base.literalValue = '';
  }

  return base;
}

export function createRootSchema(): RootSchema {
  return {
    type: 'object',
    id: 'root',
    fields: [],
  };
}

// Find item by id in schema tree
export function findItemById(schema: RootSchema | SchemaItem, id: string): SchemaItem | null {
  if ('id' in schema && schema.id === id && schema.id !== 'root') {
    return schema as SchemaItem;
  }

  if ('fields' in schema && schema.fields) {
    for (const field of schema.fields) {
      const found = findItemById(field, id);
      if (found) return found;
    }
  }

  if ('options' in schema && schema.options) {
    for (const option of schema.options) {
      const found = findItemById(option, id);
      if (found) return found;
    }
  }

  return null;
}

// Get all object/union items for lazy reference selection
export function getRefTargets(schema: RootSchema): SchemaItem[] {
  const targets: SchemaItem[] = [];

  function traverse(item: SchemaItem) {
    if (item.type === 'object' || item.type === 'union') {
      targets.push(item);
    }
    if (item.fields) {
      item.fields.forEach(traverse);
    }
    if (item.options) {
      item.options.forEach(traverse);
    }
  }

  schema.fields.forEach(traverse);
  return targets;
}

// Clone item with new ids
export function cloneItem(item: SchemaItem): SchemaItem {
  const cloned: SchemaItem = {
    ...item,
    id: generateId(),
  };

  if (item.fields) {
    cloned.fields = item.fields.map(cloneItem);
  }
  if (item.options) {
    cloned.options = item.options.map(cloneItem);
  }

  return cloned;
}

// ==================== Ref Methods Interface ====================

/**
 * ZodVisualEditor 组件的 ref 方法接口
 * 用于通过 bind:this 获取组件实例后调用方法
 * 
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { ZodVisualEditor, type ZodVisualEditorRef } from '@qiyu-allinai/zod-visual-editor';
 *   let editorRef: ZodVisualEditorRef;
 * </script>
 * 
 * <ZodVisualEditor bind:this={editorRef} />
 * <button onclick={() => editorRef.addFieldTo('root', 'string', 'newField')}>Add Field</button>
 * ```
 */
export interface ZodVisualEditorRef {
  /** 获取当前 Schema */
  getSchema(): RootSchema;
  
  /** 设置整个 Schema */
  setSchema(newSchema: RootSchema): void;
  
  /**
   * 添加字段到指定父级
   * @param parentId - 父级 ID，'root' 表示根级别，或者 object/union 类型字段的 ID
   * @param type - 字段类型
   * @param name - 字段名称（可选，默认自动生成）
   * @returns 新创建的字段，如果父级不存在或类型不支持则返回 null
   */
  addFieldTo(parentId: string, type: SchemaType, name?: string): SchemaItem | null;
  
  /**
   * 根据 ID 删除字段
   * @param fieldId - 要删除的字段 ID
   * @returns 是否删除成功
   */
  removeField(fieldId: string): boolean;
  
  /**
   * 根据 ID 获取字段
   * @param fieldId - 字段 ID
   * @returns 字段对象，如果不存在则返回 null
   */
  getFieldById(fieldId: string): SchemaItem | null;
  
  /**
   * 更新指定字段
   * @param fieldId - 字段 ID
   * @param updates - 要更新的属性
   * @returns 是否更新成功
   */
  updateFieldById(fieldId: string, updates: Partial<SchemaItem>): boolean;
  
  /**
   * 复制字段
   * @param fieldId - 要复制的字段 ID
   * @returns 新创建的字段，如果原字段不存在则返回 null
   */
  duplicateFieldById(fieldId: string): SchemaItem | null;
  
  /** 获取所有根级字段 */
  getRootFields(): SchemaItem[];
  
  /** 清空所有字段 */
  clearAllFields(): void;
  
  /** 获取生成的 TypeScript 代码 */
  getGeneratedCode(): string;
  
  /** 切换代码显示 */
  toggleCodeView(): void;
  
  /** 获取代码显示状态 */
  isCodeViewVisible(): boolean;
}
