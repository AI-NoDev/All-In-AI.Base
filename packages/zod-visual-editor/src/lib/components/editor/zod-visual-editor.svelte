<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Plus, Code, LayoutGrid, FileCode } from '@lucide/svelte';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Card from '$lib/components/ui/card';
  import * as Popover from '$lib/components/ui/popover';
  import * as ToggleGroup from '$lib/components/ui/toggle-group';
  import { DndContext, type DragEndEvent } from '@dnd-kit-svelte/core';
  import { SortableContext, arrayMove } from '@dnd-kit-svelte/sortable';
  import FieldItem from './field-item.svelte';
  import {
    type Field,
    type FieldType,
    type RootSchema,
    createField,
    createRootSchema,
    cloneField,
    TYPE_ICONS,
  } from '$lib/types.js';
  import { toTypeScriptCode, toJsonSchema } from '$lib/generator.js';
  import { m } from '@qiyu-allinai/i18n';

  type ViewMode = 'visual' | 'code';
  type MessageFn = (inputs?: Record<string, unknown>, options?: { locale?: string }) => string;
  type Messages = Record<string, MessageFn>;
  const msg = m as unknown as Messages;

  interface Props {
    schema?: RootSchema;
    onSchemaChange?: (schema: RootSchema) => void;
    height?: string;
    title?: string;
    actions?: Snippet;
  }

  // Type label mapping
  const typeLabels: Record<FieldType, MessageFn> = {
    string: msg['schemaEditor_types_string'],
    number: msg['schemaEditor_types_number'],
    boolean: msg['schemaEditor_types_boolean'],
    literal: msg['schemaEditor_types_literal'],
    enum: msg['schemaEditor_types_enum'],
    array: msg['schemaEditor_types_array'],
    union: msg['schemaEditor_types_union'],
    object: msg['schemaEditor_types_object'],
  };

  let {
    schema = $bindable(createRootSchema()),
    onSchemaChange,
    height = '600px',
    title,
    actions,
  }: Props = $props();

  let addMenuOpen = $state(false);
  let viewMode = $state<ViewMode>('visual');
  let codeTab = $state<'typescript' | 'json'>('typescript');

  const typeOptions: FieldType[] = ['string', 'number', 'boolean', 'literal', 'enum', 'array', 'union', 'object'];

  function getTypeLabel(type: FieldType): string {
    return typeLabels[type]?.() ?? type;
  }

  function notifyChange() {
    onSchemaChange?.(schema);
  }

  function addField(type: FieldType) {
    const newField = createField(type, `field_${schema.fields.length + 1}`);
    schema = { ...schema, fields: [...schema.fields, newField] };
    addMenuOpen = false;
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

  function duplicateField(index: number) {
    const cloned = cloneField(schema.fields[index]);
    cloned.name = `${cloned.name}_copy`;
    const newFields = [...schema.fields];
    newFields.splice(index + 1, 0, cloned);
    schema = { ...schema, fields: newFields };
    notifyChange();
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = schema.fields.findIndex(f => f.id === active.id);
    const newIndex = schema.fields.findIndex(f => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newFields = arrayMove([...schema.fields], oldIndex, newIndex);
    schema = { ...schema, fields: newFields };
    notifyChange();
  }

  let generatedCode = $derived(toTypeScriptCode(schema));
  let jsonSchema = $derived(JSON.stringify(toJsonSchema(schema), null, 2));

  // Display title
  let displayTitle = $derived(title ?? msg['schemaEditor_title']());

  // Exported methods
  export function getSchema(): RootSchema {
    return schema;
  }

  export function setSchema(newSchema: RootSchema): void {
    schema = newSchema;
    notifyChange();
  }

  export function getGeneratedCode(): string {
    return generatedCode;
  }

  export function getJsonSchema(): Record<string, unknown> {
    return toJsonSchema(schema);
  }
</script>

<Card.Root class="w-full flex flex-col" style="height: {height}">
  <Card.Header class="shrink-0">
    <div class="flex items-center justify-between">
      <Card.Title class="text-lg">{displayTitle}</Card.Title>
      <div class="flex items-center gap-2">
        {#if actions}
          {@render actions()}
        {/if}
        <ToggleGroup.Root type="single" value={viewMode} onValueChange={(v: string) => v && (viewMode = v as ViewMode)}>
          <ToggleGroup.Item value="visual" class="h-8 px-3 gap-1.5">
            <LayoutGrid class="size-4" />
            <span class="text-xs">{msg['schemaEditor_visual']()}</span>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="code" class="h-8 px-3 gap-1.5">
            <Code class="size-4" />
            <span class="text-xs">{msg['schemaEditor_code']()}</span>
          </ToggleGroup.Item>
        </ToggleGroup.Root>
      </div>
    </div>
  </Card.Header>

  <Card.Content class="flex-1 min-h-0 overflow-hidden">
    {#if viewMode === 'visual'}
      <div class="h-full overflow-y-auto pr-2">
        <div class="space-y-2 pb-4">
          {#if schema.fields.length > 0}
            <DndContext onDragEnd={handleDragEnd}>
              <SortableContext items={schema.fields}>
                {#each schema.fields as field, index (field.id)}
                  <FieldItem
                    {field}
                    onUpdate={(updated: Field) => updateField(index, updated)}
                    onDelete={() => deleteField(index)}
                    onDuplicate={() => duplicateField(index)}
                  />
                {/each}
              </SortableContext>
            </DndContext>
          {:else}
            <div class="flex flex-col items-center justify-center h-48 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
              <FileCode class="size-10 mb-3 opacity-50" />
              <p class="text-sm">{msg['schemaEditor_noFields']()}</p>
              <p class="text-xs mt-1">{msg['schemaEditor_noFieldsHint']()}</p>
            </div>
          {/if}

          <!-- Add Field Button -->
          <Popover.Root bind:open={addMenuOpen}>
            <Popover.Trigger class="w-full">
              <Button variant="outline" class="w-full h-10 border-dashed">
                <Plus class="size-4 mr-2" />
                {msg['schemaEditor_addField']()}
              </Button>
            </Popover.Trigger>
            <Popover.Content class="w-56 p-1" align="center">
              <div class="grid grid-cols-2 gap-1">
                {#each typeOptions as opt}
                  <button
                    class="px-3 py-2 text-left text-sm hover:bg-muted rounded flex items-center gap-2"
                    onclick={() => addField(opt)}
                  >
                    <Icon icon={TYPE_ICONS[opt]} class="size-4 text-muted-foreground" />
                    {getTypeLabel(opt)}
                  </button>
                {/each}
              </div>
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>
    {:else}
      <!-- Code View -->
      <div class="h-full flex flex-col">
        <div class="flex gap-1 mb-2 shrink-0">
          <button
            class="px-3 py-1 text-xs rounded {codeTab === 'typescript' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}"
            onclick={() => codeTab = 'typescript'}
          >
            TypeScript
          </button>
          <button
            class="px-3 py-1 text-xs rounded {codeTab === 'json' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}"
            onclick={() => codeTab = 'json'}
          >
            JSON Schema
          </button>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto">
          {#if codeTab === 'typescript'}
            <pre class="text-xs bg-muted p-3 rounded-lg whitespace-pre-wrap break-words"><code>{generatedCode}</code></pre>
          {:else}
            <pre class="text-xs bg-muted p-3 rounded-lg whitespace-pre-wrap break-words"><code>{jsonSchema}</code></pre>
          {/if}
        </div>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
