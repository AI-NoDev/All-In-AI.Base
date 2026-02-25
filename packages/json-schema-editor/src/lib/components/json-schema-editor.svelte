<script lang="ts">
  import FileTextIcon from "@lucide/svelte/icons/file-text";
  import PlusCircleIcon from "@lucide/svelte/icons/plus-circle";
  import { Button } from './ui/button/index.js';
  import {
    type Field,
    type JsonSchema,
    createSchema,
    cloneField,
  } from '../types.js';
  import { toJsonSchema } from '../converter.js';
  import FieldItem from './field-item.svelte';
  import AddFieldDialog from './add-field-dialog.svelte';

  interface Props {
    schema?: JsonSchema;
    onchange?: (schema: JsonSchema) => void;
    locale?: 'zh' | 'en';
    class?: string;
    readonly?: boolean;
  }

  let {
    schema = $bindable(createSchema()),
    onchange,
    locale = 'zh',
    class: className = '',
    readonly = false,
  }: Props = $props();

  let showAddDialog = $state(false);
  let editingField = $state<Field | null>(null);
  let editingIndex = $state<number>(-1);

  let existingNames = $derived(schema.properties.map(f => f.name));

  const labels = {
    zh: {
      addField: '添加字段',
      noFields: '暂无字段',
      noFieldsHint: '点击下方按钮添加第一个字段',
    },
    en: {
      addField: 'Add Field',
      noFields: 'No fields yet',
      noFieldsHint: 'Click the button below to add your first field',
    },
  };

  const t = $derived(labels[locale]);

  function notifyChange() {
    onchange?.(schema);
  }

  function handleAddField(field: Field) {
    if (editingIndex >= 0) {
      const newFields = [...schema.properties];
      newFields[editingIndex] = field;
      schema = { ...schema, properties: newFields };
      editingIndex = -1;
    } else {
      schema = { ...schema, properties: [...schema.properties, field] };
    }
    editingField = null;
    showAddDialog = false;
    notifyChange();
  }

  function handleEditField(index: number) {
    editingField = schema.properties[index];
    editingIndex = index;
    showAddDialog = true;
  }

  function handleDeleteField(index: number) {
    const newFields = schema.properties.filter((_, i) => i !== index);
    schema = { ...schema, properties: newFields };
    notifyChange();
  }

  function handleDuplicateField(index: number) {
    const cloned = cloneField(schema.properties[index]);
    cloned.name = `${cloned.name}_copy`;
    const newFields = [...schema.properties];
    newFields.splice(index + 1, 0, cloned);
    schema = { ...schema, properties: newFields };
    notifyChange();
  }

  function handleUpdateField(index: number, updated: Field) {
    const newFields = [...schema.properties];
    newFields[index] = updated;
    schema = { ...schema, properties: newFields };
    notifyChange();
  }

  function openAddDialog() {
    editingField = null;
    editingIndex = -1;
    showAddDialog = true;
  }

  export function getSchema(): JsonSchema {
    return schema;
  }

  export function setSchema(newSchema: JsonSchema): void {
    schema = newSchema;
    notifyChange();
  }

  export function getJsonSchema(): Record<string, unknown> {
    return toJsonSchema(schema);
  }
</script>

<div class="flex flex-col gap-2 {className}">
  {#if schema.properties.length > 0}
    <div class="flex flex-col gap-0.5">
      {#each schema.properties as field, index (field.id)}
        <FieldItem
          {field}
          {locale}
          {readonly}
          onEdit={() => handleEditField(index)}
          onDelete={() => handleDeleteField(index)}
          onDuplicate={() => handleDuplicateField(index)}
          onUpdate={(updated) => handleUpdateField(index, updated)}
        />
      {/each}
    </div>
  {:else}
    <div class="flex flex-col items-center justify-center py-10 text-muted-foreground">
      <FileTextIcon class="size-10 opacity-40 mb-2" />
      <p class="text-sm font-medium">{t.noFields}</p>
      {#if !readonly}
        <p class="text-xs opacity-70 mt-1">{t.noFieldsHint}</p>
      {/if}
    </div>
  {/if}

  {#if !readonly}
    <Button variant="ghost" class="self-start text-muted-foreground hover:text-primary" onclick={openAddDialog}>
      <PlusCircleIcon class="size-4 mr-1.5" />
      {t.addField}
    </Button>

    <AddFieldDialog
      bind:open={showAddDialog}
      field={editingField}
      {existingNames}
      {locale}
      onSave={handleAddField}
      onCancel={() => {
        showAddDialog = false;
        editingField = null;
        editingIndex = -1;
      }}
    />
  {/if}
</div>
