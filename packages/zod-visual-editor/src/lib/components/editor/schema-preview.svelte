<script lang="ts">
  import { Badge } from '../ui/badge/index.js';
  import type { SchemaItem } from '../../types.js';

  /** JSON Schema 属性类型 */
  interface JsonSchemaProperty {
    type?: string | string[];
    description?: string;
    enum?: (string | number | boolean)[];
    const?: string | number | boolean;
    items?: JsonSchemaProperty;
    properties?: Record<string, JsonSchemaProperty>;
    required?: string[];
    format?: string;
    $ref?: string;
    oneOf?: JsonSchemaProperty[];
    anyOf?: JsonSchemaProperty[];
  }

  /** JSON Schema 根对象 */
  interface JsonSchema {
    $schema?: string;
    type?: string;
    properties?: Record<string, JsonSchemaProperty>;
    required?: string[];
    additionalProperties?: boolean;
  }

  /** 解析后的字段信息 */
  interface ParsedField {
    name: string;
    type: string;
    description: string;
    required: boolean;
    format?: string;
    enumValues?: (string | number | boolean)[];
    isArray: boolean;
    isUnion?: boolean;
    children?: ParsedField[];
  }

  /** 类型颜色配置 */
  interface TypeColorConfig {
    bg: string;
    text: string;
    border: string;
  }

  interface Props {
    /** JSON Schema 字符串或 SchemaItem 数组 */
    schema: string | SchemaItem[];
    /** 是否显示描述 */
    showDescription?: boolean;
    /** 自定义类名 */
    class?: string;
  }

  let { schema, showDescription = false, class: className = '' }: Props = $props();

  // 类型对应的颜色配置
  const typeColors: Record<string, TypeColorConfig> = {
    string: { bg: 'bg-emerald-50 dark:bg-emerald-950', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
    number: { bg: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
    integer: { bg: 'bg-indigo-50 dark:bg-indigo-950', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
    boolean: { bg: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
    array: { bg: 'bg-purple-50 dark:bg-purple-950', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
    object: { bg: 'bg-rose-50 dark:bg-rose-950', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
    datetime: { bg: 'bg-cyan-50 dark:bg-cyan-950', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
    literal: { bg: 'bg-orange-50 dark:bg-orange-950', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
    union: { bg: 'bg-pink-50 dark:bg-pink-950', text: 'text-pink-700 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
    null: { bg: 'bg-gray-50 dark:bg-gray-950', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-800' },
  };

  function getTypeColor(type: string): TypeColorConfig {
    const baseType = type.replace('[]', '').replace(/"/g, '').toLowerCase();
    if (baseType.includes('|')) return typeColors.union;
    return typeColors[baseType] || typeColors.string;
  }

  /** 从 JSON Schema 属性获取基础类型（不含数组标记） */
  function getBaseTypeFromJsonSchema(prop: JsonSchemaProperty): string {
    // 检查 const (literal)
    if (prop.const !== undefined) return 'literal';
    if (prop.enum) return 'enum';
    if (prop.oneOf || prop.anyOf) return 'union';
    if (prop.format === 'date-time') return 'datetime';
    if (prop.type === 'object' || prop.properties) return 'object';
    if (Array.isArray(prop.type)) return prop.type.join(' | ');
    return prop.type || 'unknown';
  }

  /** 从 JSON Schema 属性获取显示类型 */
  function getTypeFromJsonSchema(prop: JsonSchemaProperty): string {
    // 检查 const (literal) - 显示具体值
    if (prop.const !== undefined) {
      if (typeof prop.const === 'string') return `"${prop.const}"`;
      return String(prop.const);
    }
    if (prop.type === 'array' && prop.items) {
      const itemType = getBaseTypeFromJsonSchema(prop.items);
      return `${itemType}[]`;
    }
    return getBaseTypeFromJsonSchema(prop);
  }

  /** 从 SchemaItem 类型获取显示类型 */
  function getTypeFromSchemaItem(item: SchemaItem): string {
    let type: string = item.type;
    if (item.type === 'literal' && item.literalValue !== undefined) {
      type = `"${item.literalValue}"`;
    }
    if (item.isArray) {
      return `${type}[]`;
    }
    return type;
  }

  /** 解析 JSON Schema 字符串 */
  function parseJsonSchema(schemaStr: string): ParsedField[] {
    try {
      const parsed = JSON.parse(schemaStr) as JsonSchema;
      if (!parsed.properties) return [];
      
      const requiredFields = new Set(parsed.required || []);
      const fields: ParsedField[] = [];
      
      for (const [name, prop] of Object.entries(parsed.properties)) {
        fields.push(parseJsonSchemaProperty(name, prop, requiredFields.has(name)));
      }
      
      return fields;
    } catch {
      return [];
    }
  }

  /** 解析单个 JSON Schema 属性 */
  function parseJsonSchemaProperty(name: string, prop: JsonSchemaProperty, required: boolean): ParsedField {
    const isArray = prop.type === 'array';
    const actualProp = isArray && prop.items ? prop.items : prop;
    const isUnion = !!(actualProp.oneOf || actualProp.anyOf);
    
    const field: ParsedField = {
      name,
      type: getTypeFromJsonSchema(prop),
      description: prop.description || '',
      required,
      format: actualProp.format,
      enumValues: actualProp.enum,
      isArray,
      isUnion,
    };

    // 处理嵌套对象
    if (actualProp.properties) {
      const nestedRequired = new Set(actualProp.required || []);
      field.children = Object.entries(actualProp.properties).map(([childName, childProp]) =>
        parseJsonSchemaProperty(childName, childProp, nestedRequired.has(childName))
      );
    }

    // 处理 union 类型 (oneOf/anyOf)
    if (actualProp.oneOf || actualProp.anyOf) {
      const unionOptions = actualProp.oneOf || actualProp.anyOf || [];
      field.children = unionOptions.map((opt, idx) => {
        const optName = `选项${idx + 1}`;
        return parseJsonSchemaProperty(optName, opt, false);
      });
    }

    return field;
  }

  /** 解析 SchemaItem 数组 */
  function parseSchemaItems(items: SchemaItem[]): ParsedField[] {
    return items.map(item => parseSchemaItem(item));
  }

  /** 解析单个 SchemaItem */
  function parseSchemaItem(item: SchemaItem): ParsedField {
    const isUnion = item.type === 'union';
    
    const field: ParsedField = {
      name: item.name,
      type: getTypeFromSchemaItem(item),
      description: item.description || '',
      required: item.required,
      isArray: item.isArray,
      isUnion,
    };

    if (item.type === 'literal' && item.literalValue !== undefined) {
      field.enumValues = [item.literalValue];
    }

    // 处理嵌套字段 (object)
    if (item.fields && item.fields.length > 0) {
      field.children = parseSchemaItems(item.fields);
    }

    // 处理 union 选项
    if (item.options && item.options.length > 0) {
      field.children = parseSchemaItems(item.options);
    }

    return field;
  }

  /** 解析 schema（支持 JSON Schema 字符串或 SchemaItem 数组） */
  function parseSchema(input: string | SchemaItem[]): ParsedField[] {
    if (typeof input === 'string') {
      return parseJsonSchema(input);
    }
    return parseSchemaItems(input);
  }

  let fields = $derived(parseSchema(schema));
</script>

{#snippet fieldRow(field: ParsedField, depth: number = 0)}
  {@const colors = getTypeColor(field.type)}
  {@const indent = depth * 16}
  <div class="flex flex-col gap-1">
    <!-- 字段行 -->
    <div 
      class="flex items-center gap-2 px-2 py-1.5 rounded-md border {colors.bg} {colors.border}"
      style="margin-left: {indent}px"
    >
      <span class="text-sm font-medium {colors.text}">
        {field.name}
        {#if field.required}
          <span class="text-red-500 ml-0.5">*</span>
        {/if}
      </span>
      <Badge variant="outline" class="text-xs px-1.5 py-0 h-5 {colors.text} {colors.border}">
        {field.type}
        {#if field.format}
          <span class="opacity-70 ml-1">({field.format})</span>
        {/if}
      </Badge>
      {#if field.enumValues && field.enumValues.length > 0}
        <span class="text-xs text-muted-foreground">
          [{field.enumValues.slice(0, 3).map(v => typeof v === 'string' ? `"${v}"` : String(v)).join(', ')}{field.enumValues.length > 3 ? '...' : ''}]
        </span>
      {/if}
      {#if showDescription}
        <span class="text-xs text-muted-foreground truncate max-w-48 italic">
          {field.description || '暂无描述'}
        </span>
      {/if}
    </div>
    <!-- 子字段递归 -->
    {#if field.children && field.children.length > 0}
      {#each field.children as child}
        {@render fieldRow(child, depth + 1)}
      {/each}
    {/if}
  </div>
{/snippet}

{#if fields.length > 0}
  <div class="flex flex-col gap-1 {className}">
    {#each fields as field}
      {@render fieldRow(field)}
    {/each}
  </div>
{:else}
  <span class="text-sm text-muted-foreground">无参数</span>
{/if}
