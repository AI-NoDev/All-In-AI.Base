# zod-visual-editor

A visual editor for building [Zod](https://zod.dev) schemas in Svelte 5. Build complex validation schemas with an intuitive UI, then export to Zod code or JSON Schema.

[![npm version](https://img.shields.io/npm/v/zod-visual-editor.svg)](https://www.npmjs.com/package/zod-visual-editor)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Visual Schema Builder** - Intuitive interface for building Zod schemas
- 🔄 **Real-time Code Generation** - See generated Zod/TypeScript code as you build
- 🌐 **i18n Support** - Pass a translation function for internationalization
- 📦 **Zod v4 Compatible** - Works with the latest Zod version
- 🎯 **Type Safe** - Full TypeScript support with exported types
- ↕️ **Drag & Drop Reorder** - Reorder fields with drag and drop
- 🎨 **Tailwind CSS** - Styled with Tailwind CSS and shadcn-svelte components

## Installation

```bash
npm install zod-visual-editor zod
# or
pnpm add zod-visual-editor zod
# or
bun add zod-visual-editor zod
```

## Requirements

- Svelte 5
- Zod 4.x
- Tailwind CSS 4.x (for styling)

## Quick Start

```svelte
<script lang="ts">
  import { ZodVisualEditor, toZodSchema, createRootSchema, type RootSchema } from '@qiyu-allinai/zod-visual-editor';
  import { z } from 'zod';

  let schema = $state<RootSchema>(createRootSchema());

  function handleExport() {
    const zodSchema = toZodSchema(schema);
    const jsonSchema = z.toJSONSchema(zodSchema);
    console.log(JSON.stringify(jsonSchema, null, 2));
  }
</script>

<ZodVisualEditor bind:schema height="500px" />
<button onclick={handleExport}>Export JSON Schema</button>
```

## Internationalization (i18n)

Customize all UI labels by passing a `t` function prop:

```svelte
<script lang="ts">
  import { ZodVisualEditor } from '@qiyu-allinai/zod-visual-editor';

  // Translation function
  function t(key: string, fallback?: string): string {
    const translations: Record<string, string> = {
      'schemaEditor.title': 'Schema 编辑器',
      'schemaEditor.visual': '可视化',
      'schemaEditor.code': '代码',
      'schemaEditor.addField': '添加字段',
      'schemaEditor.editField': '编辑字段',
      'schemaEditor.noFields': '暂无字段',
      'schemaEditor.noFieldsHint': '点击"添加字段"开始',
      'schemaEditor.fieldName': '字段名',
      'schemaEditor.fieldType': '类型',
      'schemaEditor.optional': '可选',
      'schemaEditor.literalValue': '字面量值',
      'schemaEditor.enumValues': '枚举值',
      'schemaEditor.itemType': '元素类型',
      'schemaEditor.unionOptions': 'Union 选项',
      'schemaEditor.types.string': '字符串',
      'schemaEditor.types.number': '数字',
      'schemaEditor.types.boolean': '布尔',
      'schemaEditor.types.literal': '字面量',
      'schemaEditor.types.enum': '枚举',
      'schemaEditor.types.array': '数组',
      'schemaEditor.types.union': '联合',
      'schemaEditor.types.object': '对象',
    };
    return translations[key] ?? fallback ?? key;
  }
</script>

<ZodVisualEditor bind:schema {t} />
```

## Supported Types

| Type | Description |
|------|-------------|
| `string` | String values |
| `number` | Numeric values |
| `boolean` | True/false values |
| `literal` | Literal/constant values (string, number, or boolean) |
| `enum` | Enumeration of string or number values |
| `array` | Array of any type |
| `union` | Union of multiple types |
| `object` | Nested object with fields |

### Type Modifiers

- **Optional** - Toggle whether a field is optional
- **Description** - Add descriptions for documentation

## API Reference

### Components

#### `ZodVisualEditor`

Main editor component.

```typescript
interface Props {
  schema?: RootSchema;           // The schema to edit (bindable)
  onSchemaChange?: (schema: RootSchema) => void;  // Change callback
  height?: string;               // Editor height (default: '600px')
  title?: string;                // Custom title
  t?: (key: string, fallback?: string) => string;  // Translation function
  actions?: Snippet;             // Custom actions slot
}
```

### Functions

#### `toZodSchema(root: RootSchema): z.ZodObject`

Convert the visual schema to a Zod schema object.

```typescript
import { toZodSchema } from '@qiyu-allinai/zod-visual-editor';
import { z } from 'zod';

const zodSchema = toZodSchema(schema);
const jsonSchema = z.toJSONSchema(zodSchema);
```

#### `toTypeScriptCode(root: RootSchema): string`

Generate TypeScript code representation of the schema.

```typescript
import { toTypeScriptCode } from '@qiyu-allinai/zod-visual-editor';

const code = toTypeScriptCode(schema);
// Returns: import { z } from "zod"; export const schema = z.object({...});
```

#### `toJsonSchema(root: RootSchema): object`

Convert to JSON Schema format.

#### `fromZodSchema(zodSchema: z.ZodObject): RootSchema`

Parse a Zod schema into the visual editor format.

#### `fromJsonSchema(jsonSchema: object): RootSchema`

Parse a JSON Schema into the visual editor format.

#### `createRootSchema(): RootSchema`

Create an empty root schema.

#### `createField(type: FieldType, name?: string): Field`

Create a new field with default values.

### Types

```typescript
import type { 
  Field,           // Individual field definition (SchemaType + name)
  FieldType,       // 'string' | 'number' | 'boolean' | 'literal' | 'enum' | 'array' | 'union' | 'object'
  SchemaType,      // Base schema type (without name)
  RootSchema,      // Root schema container
  StringSchema,
  NumberSchema,
  BooleanSchema,
  LiteralSchema,
  EnumSchema,
  ArraySchema,
  UnionSchema,
  ObjectSchema,
} from '@qiyu-allinai/zod-visual-editor';
```

## Schema Structure

The editor uses an intermediate representation (IR) that maps to Zod schemas:

```typescript
interface BaseSchema {
  id: string;
  type: FieldType;
  description?: string;
  optional?: boolean;
}

type Field = SchemaType & { name: string };

interface RootSchema {
  type: 'object';
  id: 'root';
  fields: Field[];
}

// Type-specific schemas
interface StringSchema extends BaseSchema { type: 'string'; }
interface NumberSchema extends BaseSchema { type: 'number'; }
interface BooleanSchema extends BaseSchema { type: 'boolean'; }
interface LiteralSchema extends BaseSchema { type: 'literal'; value: string | number | boolean; }
interface EnumSchema extends BaseSchema { type: 'enum'; values: (string | number)[]; }
interface ArraySchema extends BaseSchema { type: 'array'; item: SchemaType; }
interface UnionSchema extends BaseSchema { type: 'union'; options: SchemaType[]; }
interface ObjectSchema extends BaseSchema { type: 'object'; fields: Field[]; }
```

## Styling

The editor uses Tailwind CSS with CSS variables for theming. Make sure your project has Tailwind CSS configured with the following CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
}
```

## License

MIT © [Zod Visual Editor Contributors](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
