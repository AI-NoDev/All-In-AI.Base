<script lang="ts">
  import { Plus, Code, FileCode } from '@lucide/svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Popover from '$lib/components/ui/popover';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import SchemaItem from './schema-item.svelte';
  import {
    type SchemaItem as SchemaItemType,
    type SchemaType,
    type RootSchema,
    type EditorLabels,
    createDefaultItem,
    createRootSchema,
    cloneItem,
    defaultLabels,
    findItemById,
    generateId,
  } from '$lib/types.js';
  import { generateTypeScriptCode } from '$lib/generator.js';

  interface Props {
    schema?: RootSchema;
    labels?: EditorLabels;
    onSchemaChange?: (schema: RootSchema) => void;
    height?: string;
  }

  let { schema = $bindable(createRootSchema()), labels = defaultLabels, onSchemaChange, height = '600px' }: Props = $props();

  let addMenuOpen = $state(false);
  let showCode = $state(false);

  let typeOptions = $derived<{ value: SchemaType; label: string }[]>([
    { value: 'string', label: labels.string },
    { value: 'number', label: labels.number },
    { value: 'boolean', label: labels.boolean },
    { value: 'datetime', label: labels.datetime },
    { value: 'literal', label: labels.literal },
    { value: 'object', label: labels.object },
    { value: 'union', label: labels.union },
  ]);

  function notifyChange() {
    onSchemaChange?.(schema);
  }

  function addField(type: SchemaType) {
    const newItem = createDefaultItem(type, `field_${schema.fields.length + 1}`);
    schema = { ...schema, fields: [...schema.fields, newItem] };
    addMenuOpen = false;
    notifyChange();
  }

  function updateField(index: number, updated: SchemaItemType) {
    const newFields = [...schema.fields];
    newFields[index] = updated;
    schema = { ...schema, fields: newFields };
    notifyChange();
  }

  function deleteField(index: number) {
    const newFields = schema.fields.filter((_, i) => i !== index);
    schema = { ...schema, fields: newFields };
    notifyChange();
  }

  function duplicateField(index: number) {
    const cloned = cloneItem(schema.fields[index]);
    cloned.name = `${cloned.name}_copy`;
    const newFields = [...schema.fields];
    newFields.splice(index + 1, 0, cloned);
    schema = { ...schema, fields: newFields };
    notifyChange();
  }

  function moveFieldUp(index: number) {
    if (index <= 0) return;
    const newFields = [...schema.fields];
    [newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]];
    schema = { ...schema, fields: newFields };
    notifyChange();
  }

  function moveFieldDown(index: number) {
    if (index >= schema.fields.length - 1) return;
    const newFields = [...schema.fields];
    [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
    schema = { ...schema, fields: newFields };
    notifyChange();
  }

  let generatedCode = $derived(generateTypeScriptCode(schema));

  // ==================== Exported Ref Methods ====================

  /**
   * 获取当前 Schema
   */
  export function getSchema(): RootSchema {
    return schema;
  }

  /**
   * 设置整个 Schema
   */
  export function setSchema(newSchema: RootSchema): void {
    schema = newSchema;
    notifyChange();
  }

  /**
   * 添加字段到指定父级
   * @param parentId - 父级 ID，'root' 表示根级别，或者 object/union 类型字段的 ID
   * @param type - 字段类型
   * @param name - 字段名称（可选，默认自动生成）
   * @returns 新创建的字段，如果父级不存在或类型不支持则返回 null
   */
  export function addFieldTo(parentId: string, type: SchemaType, name?: string): SchemaItemType | null {
    const fieldName = name ?? `field_${generateId().slice(-6)}`;
    const newItem = createDefaultItem(type, fieldName);

    if (parentId === 'root') {
      schema = { ...schema, fields: [...schema.fields, newItem] };
      notifyChange();
      return newItem;
    }

    // 递归查找并添加到指定父级
    function addToParent(items: SchemaItemType[]): boolean {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.id === parentId) {
          if (item.type === 'object' && item.fields) {
            item.fields = [...item.fields, newItem];
            return true;
          } else if (item.type === 'union' && item.options) {
            item.options = [...item.options, newItem];
            return true;
          }
          return false;
        }
        // 递归搜索
        if (item.fields && addToParent(item.fields)) return true;
        if (item.options && addToParent(item.options)) return true;
      }
      return false;
    }

    const newFields = [...schema.fields];
    if (addToParent(newFields)) {
      schema = { ...schema, fields: newFields };
      notifyChange();
      return newItem;
    }
    return null;
  }

  /**
   * 根据 ID 删除字段
   * @param fieldId - 要删除的字段 ID
   * @returns 是否删除成功
   */
  export function removeField(fieldId: string): boolean {
    function removeFromArray(items: SchemaItemType[]): boolean {
      const index = items.findIndex(item => item.id === fieldId);
      if (index !== -1) {
        items.splice(index, 1);
        return true;
      }
      // 递归搜索
      for (const item of items) {
        if (item.fields && removeFromArray(item.fields)) return true;
        if (item.options && removeFromArray(item.options)) return true;
      }
      return false;
    }

    const newFields = [...schema.fields];
    if (removeFromArray(newFields)) {
      schema = { ...schema, fields: newFields };
      notifyChange();
      return true;
    }
    return false;
  }

  /**
   * 根据 ID 获取字段
   * @param fieldId - 字段 ID
   * @returns 字段对象，如果不存在则返回 null
   */
  export function getFieldById(fieldId: string): SchemaItemType | null {
    return findItemById(schema, fieldId);
  }

  /**
   * 更新指定字段
   * @param fieldId - 字段 ID
   * @param updates - 要更新的属性
   * @returns 是否更新成功
   */
  export function updateFieldById(fieldId: string, updates: Partial<SchemaItemType>): boolean {
    function updateInArray(items: SchemaItemType[]): boolean {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === fieldId) {
          items[i] = { ...items[i], ...updates };
          return true;
        }
        if (items[i].fields && updateInArray(items[i].fields!)) return true;
        if (items[i].options && updateInArray(items[i].options!)) return true;
      }
      return false;
    }

    const newFields = [...schema.fields];
    if (updateInArray(newFields)) {
      schema = { ...schema, fields: newFields };
      notifyChange();
      return true;
    }
    return false;
  }

  /**
   * 复制字段
   * @param fieldId - 要复制的字段 ID
   * @returns 新创建的字段，如果原字段不存在则返回 null
   */
  export function duplicateFieldById(fieldId: string): SchemaItemType | null {
    const original = findItemById(schema, fieldId);
    if (!original) return null;

    const cloned = cloneItem(original);
    cloned.name = `${cloned.name}_copy`;

    // 找到原字段的父级并在其后插入
    function insertAfter(items: SchemaItemType[]): boolean {
      const index = items.findIndex(item => item.id === fieldId);
      if (index !== -1) {
        items.splice(index + 1, 0, cloned);
        return true;
      }
      for (const item of items) {
        if (item.fields && insertAfter(item.fields)) return true;
        if (item.options && insertAfter(item.options)) return true;
      }
      return false;
    }

    const newFields = [...schema.fields];
    if (insertAfter(newFields)) {
      schema = { ...schema, fields: newFields };
      notifyChange();
      return cloned;
    }
    return null;
  }

  /**
   * 获取所有根级字段
   */
  export function getRootFields(): SchemaItemType[] {
    return schema.fields;
  }

  /**
   * 清空所有字段
   */
  export function clearAllFields(): void {
    schema = { ...schema, fields: [] };
    notifyChange();
  }

  /**
   * 获取生成的 TypeScript 代码
   */
  export function getGeneratedCode(): string {
    return generatedCode;
  }

  /**
   * 切换代码显示
   */
  export function toggleCodeView(): void {
    showCode = !showCode;
  }

  /**
   * 获取代码显示状态
   */
  export function isCodeViewVisible(): boolean {
    return showCode;
  }
</script>

<Card.Root class="w-full">
  <Card.Header class="pb-3">
    <div class="flex items-center justify-between">
      <Card.Title class="text-lg">{labels.schemaEditor}</Card.Title>
      <div class="flex items-center gap-2">
        <Button
          size="sm"
          variant={showCode ? 'default' : 'outline'}
          onclick={() => showCode = !showCode}
        >
          <Code class="size-4 mr-1" />
          {showCode ? labels.hideCode : labels.showCode}
        </Button>
        <Popover.Root bind:open={addMenuOpen}>
          <Popover.Trigger>
            <Button size="sm">
              <Plus class="size-4 mr-1" />
              {labels.addField}
            </Button>
          </Popover.Trigger>
          <Popover.Content class="w-40 p-1" align="end">
            {#each typeOptions as opt}
              <button
                class="w-full px-2 py-1.5 text-left text-sm hover:bg-muted rounded"
                onclick={() => addField(opt.value)}
              >
                {opt.label}
              </button>
            {/each}
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  </Card.Header>
  
  <Card.Content>
    <div class="flex gap-4" style="height: {height}">
      <div class="flex-1 min-w-0">
        <ScrollArea class="h-full pr-4">
          {#if schema.fields.length > 0}
            <div class="space-y-2">
              {#each schema.fields as field, index (field.id)}
                <SchemaItem
                  item={field}
                  root={schema}
                  {labels}
                  isFirst={index === 0}
                  isLast={index === schema.fields.length - 1}
                  onUpdate={(updated: SchemaItemType) => updateField(index, updated)}
                  onDelete={() => deleteField(index)}
                  onDuplicate={() => duplicateField(index)}
                  onMoveUp={() => moveFieldUp(index)}
                  onMoveDown={() => moveFieldDown(index)}
                />
              {/each}
            </div>
          {:else}
            <div class="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <FileCode class="size-12 mb-4 opacity-50" />
              <p class="text-sm">{labels.noFieldsTitle}</p>
              <p class="text-xs mt-1">{labels.noFieldsDescription}</p>
            </div>
          {/if}
        </ScrollArea>
      </div>
      
      {#if showCode}
        <div class="w-[400px] border-l pl-4">
          <div class="text-sm font-medium mb-2">Generated Code</div>
          <ScrollArea class="h-full">
            <pre class="text-xs bg-muted p-3 rounded-lg overflow-x-auto"><code>{generatedCode}</code></pre>
          </ScrollArea>
        </div>
      {/if}
    </div>
  </Card.Content>
</Card.Root>
