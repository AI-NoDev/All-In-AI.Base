<script lang="ts">
  import { z } from 'zod';
  import * as Sheet from '@/lib/components/ui/sheet';
  import { Button } from '@/lib/components/ui/button';
  import { ScrollArea } from '@/lib/components/ui/scroll-area';
  import {
    ZodVisualEditor,
    type RootSchema,
    type SchemaItem,
    type EditorLabels,
    createRootSchema,
    generateSchema,
    generateId,
  } from 'zod-visual-editor';

  interface Props {
    open: boolean;
    initialSchema: string;
    onOpenChange: (open: boolean) => void;
    onConfirm: (jsonSchema: string) => void;
  }

  let { open, initialSchema, onOpenChange, onConfirm }: Props = $props();

  let schema = $state<RootSchema>(createRootSchema());

  // Chinese labels
  const zhLabels: EditorLabels = {
    string: '字符串',
    number: '数字',
    boolean: '布尔',
    datetime: '日期时间',
    literal: '字面量',
    object: '对象',
    union: '联合类型',
    required: '必填',
    array: '数组',
    reference: '引用',
    description: '描述',
    descriptionPlaceholder: '字段描述 (用于 AI 理解)',
    literalValue: '字面量值',
    literalValuePlaceholder: '输入字面量值',
    selectReference: '选择引用',
    fieldName: '字段名',
    addField: '添加字段',
    showCode: '显示代码',
    hideCode: '隐藏代码',
    schemaEditor: 'Schema 编辑器',
    noFieldsTitle: '暂无字段',
    noFieldsDescription: '点击"添加字段"开始构建 Schema',
    objectEmptyHint: '暂无字段，点击 + 添加',
    unionEmptyHint: '暂无选项，点击 + 添加 (至少2个)',
  };

  // 当 sheet 打开时，尝试从 JSON Schema 初始化
  $effect(() => {
    if (open && initialSchema) {
      try {
        const parsed = JSON.parse(initialSchema);
        if (parsed.type === 'object' && parsed.properties) {
          schema = jsonSchemaToRootSchema(parsed);
        } else {
          schema = createRootSchema();
        }
      } catch {
        schema = createRootSchema();
      }
    } else if (open) {
      schema = createRootSchema();
    }
  });

  // JSON Schema 到 RootSchema 转换
  function jsonSchemaToRootSchema(jsonSchema: Record<string, unknown>): RootSchema {
    const root: RootSchema = {
      type: 'object',
      id: 'root',
      fields: [],
    };

    const properties = jsonSchema.properties as Record<string, Record<string, unknown>> | undefined;
    const required = (jsonSchema.required as string[]) || [];

    if (properties) {
      for (const [name, prop] of Object.entries(properties)) {
        const field = jsonSchemaPropertyToField(name, prop, required.includes(name));
        root.fields.push(field);
      }
    }

    return root;
  }

  function jsonSchemaPropertyToField(
    name: string,
    prop: Record<string, unknown>,
    isRequired: boolean
  ): SchemaItem {
    const type = prop.type as string;
    const isArray = type === 'array';
    const actualProp = isArray ? (prop.items as Record<string, unknown>) || {} : prop;
    const actualType = (actualProp.type as string) || 'string';

    let schemaType: 'string' | 'number' | 'boolean' | 'datetime' | 'literal' | 'object' | 'union' = 'string';
    
    if (actualType === 'string') schemaType = 'string';
    else if (actualType === 'number' || actualType === 'integer') schemaType = 'number';
    else if (actualType === 'boolean') schemaType = 'boolean';
    else if (actualType === 'object') schemaType = 'object';

    const field: SchemaItem = {
      id: generateId(),
      name,
      type: schemaType,
      required: isRequired,
      isArray,
      description: (prop.description as string) || (actualProp.description as string) || '',
    };

    // 处理嵌套对象
    if (schemaType === 'object') {
      field.fields = [];
      const nestedProps = actualProp.properties as Record<string, Record<string, unknown>> | undefined;
      const nestedRequired = (actualProp.required as string[]) || [];
      
      if (nestedProps) {
        for (const [nestedName, nestedProp] of Object.entries(nestedProps)) {
          field.fields.push(jsonSchemaPropertyToField(nestedName, nestedProp, nestedRequired.includes(nestedName)));
        }
      }
    }

    return field;
  }

  function handleConfirm() {
    try {
      // 生成 Zod schema
      const zodSchema = generateSchema(schema);
      // 转换为 JSON Schema
      const jsonSchema = z.toJSONSchema(zodSchema);
      onConfirm(JSON.stringify(jsonSchema, null, 2));
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to generate schema:', err);
    }
  }

  function handleSchemaChange(newSchema: RootSchema) {
    schema = newSchema;
  }
</script>

<Sheet.Root {open} onOpenChange={onOpenChange}>
  <Sheet.Content side="right" class="w-[800px] sm:max-w-[800px] p-0">
    <Sheet.Header class="px-6 py-4 border-b">
      <Sheet.Title>输入参数 Schema 编辑器</Sheet.Title>
      <Sheet.Description>
        使用可视化编辑器定义工具的输入参数结构，完成后将自动生成 JSON Schema
      </Sheet.Description>
    </Sheet.Header>
    
    <ScrollArea class="h-[calc(100vh-180px)]">
      <div class="p-6">
        <ZodVisualEditor
          bind:schema
          labels={zhLabels}
          onSchemaChange={handleSchemaChange}
          height="calc(100vh - 280px)"
        />
      </div>
    </ScrollArea>

    <div class="absolute bottom-0 left-0 right-0 px-6 py-4 border-t bg-background">
      <div class="flex justify-end gap-2">
        <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
        <Button onclick={handleConfirm}>确认生成</Button>
      </div>
    </div>
  </Sheet.Content>
</Sheet.Root>
