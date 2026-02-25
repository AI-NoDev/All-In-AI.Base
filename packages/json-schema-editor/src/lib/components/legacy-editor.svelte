<script lang="ts">
  /**
   * Legacy editor wrapper for backward compatibility with flow-editor
   * Uses the old RootSchema format with 8 types
   */
  import Icon from '@iconify/svelte';
  import {
    type RootSchema,
    type Field,
    type LegacyFieldType,
    createField,
    createRootSchema,
    cloneField,
    LEGACY_TYPE_ICONS,
  } from '../legacy-types.js';
  import { legacyToJsonSchema } from '../legacy-converter.js';

  interface Props {
    schema?: RootSchema;
    onSchemaChange?: (schema: RootSchema) => void;
    height?: string;
    title?: string;
  }

  let {
    schema = $bindable(createRootSchema()),
    onSchemaChange,
    height = '600px',
    title = 'Schema Editor',
  }: Props = $props();

  let viewMode = $state<'visual' | 'json'>('visual');

  const typeOptions: LegacyFieldType[] = ['string', 'number', 'boolean', 'object', 'array'];

  const typeLabels: Record<LegacyFieldType, string> = {
    string: '文本',
    number: '数字',
    boolean: '布尔',
    literal: '字面量',
    enum: '枚举',
    array: '数组',
    union: '联合',
    object: '对象',
  };

  function notifyChange() {
    onSchemaChange?.(schema);
  }

  function addField(type: LegacyFieldType) {
    const newField = createField(type, `field_${schema.fields.length + 1}`);
    schema = { ...schema, fields: [...schema.fields, newField] };
    notifyChange();
  }

  function updateField(index: number, updated: Field) {
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

  let jsonOutput = $derived(JSON.stringify(legacyToJsonSchema(schema), null, 2));

  export function getSchema(): RootSchema {
    return schema;
  }

  export function setSchema(newSchema: RootSchema): void {
    schema = newSchema;
    notifyChange();
  }
</script>

<div class="legacy-editor" style="height: {height}">
  <div class="editor-header">
    <h3 class="editor-title">{title}</h3>
    <div class="view-toggle">
      <button
        class="toggle-btn {viewMode === 'visual' ? 'active' : ''}"
        onclick={() => viewMode = 'visual'}
      >
        可视化
      </button>
      <button
        class="toggle-btn {viewMode === 'json' ? 'active' : ''}"
        onclick={() => viewMode = 'json'}
      >
        JSON
      </button>
    </div>
  </div>

  <div class="editor-content">
    {#if viewMode === 'visual'}
      <div class="field-list">
        {#if schema.fields.length > 0}
          {#each schema.fields as field, index (field.id)}
            <div class="field-item">
              <Icon icon={LEGACY_TYPE_ICONS[field.type]} class="field-icon" />
              <span class="field-name">{field.name}{field.optional ? '?' : ''}</span>
              <span class="field-type">{typeLabels[field.type]}</span>
              <button class="delete-btn" onclick={() => deleteField(index)}>
                <Icon icon="mdi:delete" />
              </button>
            </div>
          {/each}
        {:else}
          <div class="empty-state">暂无字段，点击下方按钮添加</div>
        {/if}
      </div>

      <div class="add-field-row">
        {#each typeOptions as type}
          <button class="add-type-btn" onclick={() => addField(type)}>
            <Icon icon={LEGACY_TYPE_ICONS[type]} />
            {typeLabels[type]}
          </button>
        {/each}
      </div>
    {:else}
      <pre class="json-output"><code>{jsonOutput}</code></pre>
    {/if}
  </div>
</div>

<style>
  .legacy-editor {
    display: flex;
    flex-direction: column;
    border: 1px solid hsl(var(--border));
    border-radius: 8px;
    background: hsl(var(--card));
    overflow: hidden;
  }

  .editor-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid hsl(var(--border));
  }

  .editor-title {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
  }

  .view-toggle {
    display: flex;
    gap: 4px;
  }

  .toggle-btn {
    padding: 4px 12px;
    font-size: 12px;
    border: 1px solid hsl(var(--border));
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
  }

  .toggle-btn.active {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    border-color: hsl(var(--primary));
  }

  .editor-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .field-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid hsl(var(--border));
    border-radius: 6px;
  }

  .field-item :global(.field-icon) {
    width: 16px;
    height: 16px;
    color: hsl(var(--muted-foreground));
  }

  .field-name {
    font-weight: 500;
    font-size: 14px;
  }

  .field-type {
    font-size: 12px;
    color: hsl(var(--muted-foreground));
    margin-left: auto;
  }

  .delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    border-radius: 4px;
  }

  .delete-btn:hover {
    background: hsl(var(--destructive) / 0.1);
    color: hsl(var(--destructive));
  }

  .empty-state {
    padding: 32px;
    text-align: center;
    color: hsl(var(--muted-foreground));
    font-size: 14px;
  }

  .add-field-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid hsl(var(--border));
  }

  .add-type-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    font-size: 12px;
    border: 1px dashed hsl(var(--border));
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
  }

  .add-type-btn:hover {
    border-color: hsl(var(--primary));
    color: hsl(var(--primary));
  }

  .json-output {
    background: hsl(var(--muted));
    border-radius: 6px;
    padding: 12px;
    font-size: 12px;
    overflow-x: auto;
  }
</style>
