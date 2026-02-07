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

  type ViewMode = 'visual' | 'code';
  type TFunction = (key: string, fallback?: string) => string;

  interface Props {
    schema?: RootSchema;
    onSchemaChange?: (schema: RootSchema) => void;
    height?: string;
    title?: string;
    t?: TFunction;
    actions?: Snippet;
  }

  // Default fallback translations
  const defaultT: TFunction = (key: string, fallback?: string) => {
    const defaults: Record<string, string> = {
      'schemaEditor.title': 'Schema Editor',
      'schemaEditor.visual': 'Visual',
      'schemaEditor.code': 'Code',
      'schemaEditor.addField': 'Add Field',
      'schemaEditor.noFields': 'No fields yet',
      'schemaEditor.noFieldsHint': 'Click "Add Field" to start',
      'schemaEditor.types.string': 'String',
      'schemaEditor.types.number': 'Number',
      'schemaEditor.types.boolean': 'Boolean',
      'schemaEditor.types.literal': 'Literal',
      'schemaEditor.types.enum': 'Enum',
      'schemaEditor.types.array': 'Array',
      'schemaEditor.types.union': 'Union',
      'schemaEditor.types.object': 'Object',
    };
    return defaults[key] ?? fallback ?? key;
  };

  let {
    schema = $bindable(createRootSchema()),
    onSchemaChange,
    height = '600px',
    title,
    t = defaultT,
    actions,
  }: Props = $props();

  let addMenuOpen = $state(false);
  let viewMode = $state<ViewMode>('visual');
  let codeTab = $state<'typescript' | 'json'>('typescript');

  const typeOptions: FieldType[] = ['string', 'number', 'boolean', 'literal', 'enum', 'array', 'union', 'object'];

  function getTypeLabel(type: FieldType): string {
    return t(`schemaEditor.types.${type}`, type);
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
  let displayTitle = $derived(title ?? t('schemaEditor.title', 'Schema Editor'));

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
            <span class="text-xs">{t('schemaEditor.visual', 'Visual')}</span>
          </ToggleGroup.Item>
          <ToggleGroup.Item value="code" class="h-8 px-3 gap-1.5">
            <Code class="size-4" />
            <span class="text-xs">{t('schemaEditor.code', 'Code')}</span>
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
                    {t}
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
              <p class="text-sm">{t('schemaEditor.noFields', 'No fields yet')}</p>
              <p class="text-xs mt-1">{t('schemaEditor.noFieldsHint', 'Click "Add Field" to start')}</p>
            </div>
          {/if}

          <!-- Add Field Button -->
          <Popover.Root bind:open={addMenuOpen}>
            <Popover.Trigger class="w-full">
              <Button variant="outline" class="w-full h-10 border-dashed">
                <Plus class="size-4 mr-2" />
                {t('schemaEditor.addField', 'Add Field')}
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
