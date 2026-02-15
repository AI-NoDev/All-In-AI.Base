<script lang="ts">
  import { Trash2, Copy, GripVertical, Pencil, ChevronRight } from '@lucide/svelte';
  import Icon from '@iconify/svelte';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Input } from '@qiyu-allinai/ui/components/input';
  import { Switch } from '@qiyu-allinai/ui/components/switch';
  import { Label } from '@qiyu-allinai/ui/components/label';
  import { Badge } from '@qiyu-allinai/ui/components/badge';
  import * as Select from '@qiyu-allinai/ui/components/select';
  import * as Dialog from '@qiyu-allinai/ui/components/dialog';
  import { useSortable } from '@dnd-kit-svelte/sortable';
  import { DndContext, type DragEndEvent } from '@dnd-kit-svelte/core';
  import { SortableContext, arrayMove } from '@dnd-kit-svelte/sortable';
  import Self from './field-item.svelte';
  import {
    type Field,
    type FieldType,
    type SchemaType,
    type ArraySchema,
    type UnionSchema,
    type ObjectSchema,
    type LiteralSchema,
    type EnumSchema,
    createField,
    createSchemaType,
    cloneField,
    TYPE_ICONS,
  } from '$lib/types.js';
  import { m } from '@qiyu-allinai/i18n';

  type MessageFn = (inputs?: Record<string, unknown>, options?: { locale?: string }) => string;
  type Messages = Record<string, MessageFn>;
  const msg = m as unknown as Messages;

  interface Props {
    field: Field;
    depth?: number;
    onUpdate: (field: Field) => void;
    onDelete: () => void;
    onDuplicate: () => void;
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

  let { field, depth = 0, onUpdate, onDelete, onDuplicate }: Props = $props();

  let isModalOpen = $state(false);
  let expanded = $state(false);

  // Form state (initialized in openModal)
  let formName = $state('');
  let formType = $state<FieldType>('string');
  let formDescription = $state('');
  let formOptional = $state(false);
  let formLiteralValue = $state('');
  let formEnumValues = $state<(string | number)[]>([]);
  let formArrayItemType = $state<FieldType>('string');
  let formUnionOptions = $state<SchemaType[]>([]);
  let newEnumValue = $state('');

  // Sortable
  const sortable = useSortable({ id: () => field.id });
  const { isDragging, setNodeRef, setActivatorNodeRef, listeners, attributes, transform, transition } = sortable;

  let dragStyle = $derived.by(() => {
    const tf = transform.current;
    const trans = transition.current;
    if (!tf) return '';
    return `transform: translate3d(${tf.x}px, ${tf.y}px, 0); ${trans ? `transition: ${trans};` : ''}`;
  });

  const typeOptions: FieldType[] = ['string', 'number', 'boolean', 'literal', 'enum', 'array', 'union', 'object'];

  function getTypeLabel(type: FieldType): string {
    return typeLabels[type]?.() ?? type;
  }

  // Derived
  let fieldSummary = $derived.by(() => {
    const parts: string[] = [];
    if (field.type === 'array') {
      parts.push(`${getTypeLabel((field as ArraySchema).item.type)}[]`);
    }
    if (field.type === 'union') {
      const opts = (field as UnionSchema).options.slice(0, 3).map(o => getTypeLabel(o.type));
      parts.push(opts.join(' | ') + ((field as UnionSchema).options.length > 3 ? '...' : ''));
    }
    if (field.type === 'enum') {
      const vals = (field as EnumSchema).values.slice(0, 3);
      if (vals.length > 0) parts.push(vals.join(' | ') + ((field as EnumSchema).values.length > 3 ? '...' : ''));
    }
    if (field.type === 'literal') {
      parts.push(`= ${JSON.stringify((field as LiteralSchema).value)}`);
    }
    return parts.join(' · ');
  });

  // Display name with optional marker
  let displayName = $derived(field.name ? (field.optional ? `${field.name}?` : field.name) : '(unnamed)');

  let children = $derived(field.type === 'object' ? (field as ObjectSchema).fields : []);
  let hasChildren = $derived(
    field.type === 'object' ||
    (field.type === 'array' && (field as ArraySchema).item.type === 'object') ||
    field.type === 'union'
  );

  function openModal() {
    formName = field.name;
    formType = field.type;
    formDescription = field.description || '';
    formOptional = field.optional || false;
    formLiteralValue = field.type === 'literal' ? String((field as LiteralSchema).value) : '';
    formEnumValues = field.type === 'enum' ? [...(field as EnumSchema).values] : [];
    formArrayItemType = field.type === 'array' ? (field as ArraySchema).item.type : 'string';
    formUnionOptions = field.type === 'union' ? [...(field as UnionSchema).options] : [];
    isModalOpen = true;
  }

  function saveField() {
    let updated: Field;

    if (formType !== field.type) {
      updated = createField(formType, formName);
      updated.id = field.id;
    } else {
      updated = { ...field };
    }

    updated.name = formName;
    updated.description = formDescription || undefined;
    updated.optional = formOptional;

    if (updated.type === 'literal') {
      let val: string | number | boolean = formLiteralValue;
      if (formLiteralValue === 'true') val = true;
      else if (formLiteralValue === 'false') val = false;
      else if (!isNaN(Number(formLiteralValue)) && formLiteralValue !== '') val = Number(formLiteralValue);
      (updated as LiteralSchema & { name: string }).value = val;
    }

    if (updated.type === 'enum') {
      (updated as EnumSchema & { name: string }).values = formEnumValues;
    }

    if (updated.type === 'array') {
      const arr = updated as ArraySchema & { name: string };
      if (arr.item.type !== formArrayItemType) {
        arr.item = createSchemaType(formArrayItemType);
      }
    }

    if (updated.type === 'union') {
      (updated as UnionSchema & { name: string }).options = formUnionOptions.length > 0
        ? formUnionOptions
        : [createSchemaType('string')];
    }

    onUpdate(updated);
    isModalOpen = false;
  }

  function addEnumValue() {
    if (!newEnumValue.trim()) return;
    const val = newEnumValue.trim();
    let parsed: string | number = val;
    if (!isNaN(Number(val))) parsed = Number(val);
    if (!formEnumValues.includes(parsed)) {
      formEnumValues = [...formEnumValues, parsed];
    }
    newEnumValue = '';
  }

  function removeEnumValue(index: number) {
    formEnumValues = formEnumValues.filter((_, i) => i !== index);
  }

  function addUnionOption(type: FieldType) {
    formUnionOptions = [...formUnionOptions, createSchemaType(type)];
  }

  function removeUnionOption(index: number) {
    if (formUnionOptions.length <= 1) return;
    formUnionOptions = formUnionOptions.filter((_, i) => i !== index);
  }

  function updateUnionOptionType(index: number, newType: FieldType) {
    formUnionOptions = formUnionOptions.map((opt, i) =>
      i === index ? createSchemaType(newType) : opt
    );
  }

  // Object children handlers
  function updateChild(index: number, updated: Field) {
    if (field.type !== 'object') return;
    const newFields = [...(field as ObjectSchema).fields];
    newFields[index] = updated;
    onUpdate({ ...field, fields: newFields } as Field);
  }

  function deleteChild(index: number) {
    if (field.type !== 'object') return;
    const newFields = (field as ObjectSchema).fields.filter((_, i) => i !== index);
    onUpdate({ ...field, fields: newFields } as Field);
  }

  function duplicateChild(index: number) {
    if (field.type !== 'object') return;
    const cloned = cloneField((field as ObjectSchema).fields[index]);
    cloned.name = `${cloned.name}_copy`;
    const newFields = [...(field as ObjectSchema).fields];
    newFields.splice(index + 1, 0, cloned);
    onUpdate({ ...field, fields: newFields } as Field);
  }

  function handleChildDragEnd(event: DragEndEvent) {
    if (field.type !== 'object') return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const objField = field as ObjectSchema;
    const oldIndex = objField.fields.findIndex(f => f.id === active.id);
    const newIndex = objField.fields.findIndex(f => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newFields = arrayMove([...objField.fields], oldIndex, newIndex);
    onUpdate({ ...field, fields: newFields } as Field);
  }

  function addChildField(type: FieldType) {
    if (field.type !== 'object') return;
    const objField = field as ObjectSchema;
    const newField = createField(type, `field_${objField.fields.length + 1}`);
    onUpdate({ ...field, fields: [...objField.fields, newField] } as Field);
  }

  // Array item object handlers
  let arrayItemFields = $derived(
    field.type === 'array' && (field as ArraySchema).item.type === 'object'
      ? ((field as ArraySchema).item as ObjectSchema).fields
      : []
  );

  let unionOptions = $derived(field.type === 'union' ? (field as UnionSchema).options : []);

  // Union option object handlers
  function updateUnionOptionChild(optionIndex: number, childIndex: number, updated: Field) {
    if (field.type !== 'union') return;
    const unionField = field as UnionSchema;
    const opt = unionField.options[optionIndex];
    if (opt.type !== 'object') return;
    const objOpt = opt as ObjectSchema;
    const newFields = [...objOpt.fields];
    newFields[childIndex] = updated;
    const newOptions = [...unionField.options];
    newOptions[optionIndex] = { ...objOpt, fields: newFields };
    onUpdate({ ...field, options: newOptions } as Field);
  }

  function deleteUnionOptionChild(optionIndex: number, childIndex: number) {
    if (field.type !== 'union') return;
    const unionField = field as UnionSchema;
    const opt = unionField.options[optionIndex];
    if (opt.type !== 'object') return;
    const objOpt = opt as ObjectSchema;
    const newFields = objOpt.fields.filter((_, i) => i !== childIndex);
    const newOptions = [...unionField.options];
    newOptions[optionIndex] = { ...objOpt, fields: newFields };
    onUpdate({ ...field, options: newOptions } as Field);
  }

  function duplicateUnionOptionChild(optionIndex: number, childIndex: number) {
    if (field.type !== 'union') return;
    const unionField = field as UnionSchema;
    const opt = unionField.options[optionIndex];
    if (opt.type !== 'object') return;
    const objOpt = opt as ObjectSchema;
    const cloned = cloneField(objOpt.fields[childIndex]);
    cloned.name = `${cloned.name}_copy`;
    const newFields = [...objOpt.fields];
    newFields.splice(childIndex + 1, 0, cloned);
    const newOptions = [...unionField.options];
    newOptions[optionIndex] = { ...objOpt, fields: newFields };
    onUpdate({ ...field, options: newOptions } as Field);
  }

  function addUnionOptionChildField(optionIndex: number, type: FieldType) {
    if (field.type !== 'union') return;
    const unionField = field as UnionSchema;
    const opt = unionField.options[optionIndex];
    if (opt.type !== 'object') return;
    const objOpt = opt as ObjectSchema;
    const newField = createField(type, `field_${objOpt.fields.length + 1}`);
    const newOptions = [...unionField.options];
    newOptions[optionIndex] = { ...objOpt, fields: [...objOpt.fields, newField] };
    onUpdate({ ...field, options: newOptions } as Field);
  }

  function handleUnionOptionChildDragEnd(optionIndex: number, event: DragEndEvent) {
    if (field.type !== 'union') return;
    const unionField = field as UnionSchema;
    const opt = unionField.options[optionIndex];
    if (opt.type !== 'object') return;
    const objOpt = opt as ObjectSchema;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = objOpt.fields.findIndex(f => f.id === active.id);
    const newIndex = objOpt.fields.findIndex(f => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newFields = arrayMove([...objOpt.fields], oldIndex, newIndex);
    const newOptions = [...unionField.options];
    newOptions[optionIndex] = { ...objOpt, fields: newFields };
    onUpdate({ ...field, options: newOptions } as Field);
  }

  function updateArrayItemChild(index: number, updated: Field) {
    if (field.type !== 'array') return;
    const arr = field as ArraySchema;
    if (arr.item.type !== 'object') return;
    const itemObj = arr.item as ObjectSchema;
    const newFields = [...itemObj.fields];
    newFields[index] = updated;
    onUpdate({ ...field, item: { ...itemObj, fields: newFields } } as Field);
  }

  function deleteArrayItemChild(index: number) {
    if (field.type !== 'array') return;
    const arr = field as ArraySchema;
    if (arr.item.type !== 'object') return;
    const itemObj = arr.item as ObjectSchema;
    const newFields = itemObj.fields.filter((_, i) => i !== index);
    onUpdate({ ...field, item: { ...itemObj, fields: newFields } } as Field);
  }

  function duplicateArrayItemChild(index: number) {
    if (field.type !== 'array') return;
    const arr = field as ArraySchema;
    if (arr.item.type !== 'object') return;
    const itemObj = arr.item as ObjectSchema;
    const cloned = cloneField(itemObj.fields[index]);
    cloned.name = `${cloned.name}_copy`;
    const newFields = [...itemObj.fields];
    newFields.splice(index + 1, 0, cloned);
    onUpdate({ ...field, item: { ...itemObj, fields: newFields } } as Field);
  }

  function handleArrayItemChildDragEnd(event: DragEndEvent) {
    if (field.type !== 'array') return;
    const arr = field as ArraySchema;
    if (arr.item.type !== 'object') return;
    const itemObj = arr.item as ObjectSchema;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = itemObj.fields.findIndex(f => f.id === active.id);
    const newIndex = itemObj.fields.findIndex(f => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newFields = arrayMove([...itemObj.fields], oldIndex, newIndex);
    onUpdate({ ...field, item: { ...itemObj, fields: newFields } } as Field);
  }

  function addArrayItemChildField(type: FieldType) {
    if (field.type !== 'array') return;
    const arr = field as ArraySchema;
    if (arr.item.type !== 'object') return;
    const itemObj = arr.item as ObjectSchema;
    const newField = createField(type, `field_${itemObj.fields.length + 1}`);
    onUpdate({ ...field, item: { ...itemObj, fields: [...itemObj.fields, newField] } } as Field);
  }
</script>

<!-- Row Display -->
<div
  use:setNodeRef
  class="border rounded-lg bg-card {isDragging.current ? 'opacity-50 shadow-lg z-10' : ''}"
  style={dragStyle}
  {...attributes.current}
>
  <div class="flex items-center gap-2 px-2 py-1.5 min-h-[40px]">
    <div
      use:setActivatorNodeRef
      class="cursor-grab active:cursor-grabbing touch-none p-0.5 hover:bg-muted rounded shrink-0"
      {...listeners.current}
    >
      <GripVertical class="size-4 text-muted-foreground" />
    </div>

    {#if hasChildren}
      <button class="p-0.5 hover:bg-muted rounded shrink-0" onclick={() => expanded = !expanded}>
        <ChevronRight class="size-4 transition-transform {expanded ? 'rotate-90' : ''}" />
      </button>
    {/if}

    <Icon icon={TYPE_ICONS[field.type]} class="size-4 text-muted-foreground shrink-0" />
    <span class="font-medium text-sm truncate min-w-[80px]">{displayName}</span>
    <Badge variant="outline" class="text-xs shrink-0">{getTypeLabel(field.type)}</Badge>

    {#if fieldSummary}
      <span class="text-xs text-muted-foreground truncate">{fieldSummary}</span>
    {/if}

    {#if field.description}
      <span class="text-xs text-muted-foreground/70 truncate hidden sm:block">— {field.description}</span>
    {/if}

    <div class="flex-1"></div>

    <Button size="sm" variant="ghost" class="h-7 w-7 p-0 shrink-0" onclick={openModal}>
      <Pencil class="size-3.5" />
    </Button>
    <Button size="sm" variant="ghost" class="h-7 w-7 p-0 shrink-0" onclick={onDuplicate}>
      <Copy class="size-3.5" />
    </Button>
    <Button size="sm" variant="ghost" class="h-7 w-7 p-0 text-destructive shrink-0" onclick={onDelete}>
      <Trash2 class="size-3.5" />
    </Button>
  </div>

  <!-- Nested children -->
  {#if expanded && hasChildren}
    <div class="border-t px-2 py-2 pl-8 space-y-1">
      {#if field.type === 'object' && children.length > 0}
        <DndContext onDragEnd={handleChildDragEnd}>
          <SortableContext items={children}>
            {#each children as child, index (child.id)}
              <Self
                field={child}
                depth={depth + 1}
                onUpdate={(updated: Field) => updateChild(index, updated)}
                onDelete={() => deleteChild(index)}
                onDuplicate={() => duplicateChild(index)}
              />
            {/each}
          </SortableContext>
        </DndContext>
      {:else if field.type === 'array' && arrayItemFields.length > 0}
        <DndContext onDragEnd={handleArrayItemChildDragEnd}>
          <SortableContext items={arrayItemFields}>
            {#each arrayItemFields as child, index (child.id)}
              <Self
                field={child}
                depth={depth + 1}
                onUpdate={(updated: Field) => updateArrayItemChild(index, updated)}
                onDelete={() => deleteArrayItemChild(index)}
                onDuplicate={() => duplicateArrayItemChild(index)}
              />
            {/each}
          </SortableContext>
        </DndContext>
      {:else if field.type === 'union' && unionOptions.length > 0}
        <div class="space-y-2">
          <div class="text-xs text-muted-foreground mb-2">{msg['schemaEditor_unionOptions']()}:</div>
          {#each unionOptions as opt, optIndex (opt.id)}
            <div class="border rounded bg-muted/20">
              <div class="flex items-center gap-2 p-2">
                <Icon icon={TYPE_ICONS[opt.type]} class="size-4 text-muted-foreground" />
                <span class="text-sm font-medium">{getTypeLabel(opt.type)}</span>
                {#if opt.type === 'object'}
                  <span class="text-xs text-muted-foreground">({(opt as ObjectSchema).fields.length} fields)</span>
                {/if}
              </div>
              {#if opt.type === 'object'}
                <div class="border-t px-2 py-2 pl-6 space-y-1">
                  {#if (opt as ObjectSchema).fields.length > 0}
                    <DndContext onDragEnd={(e: DragEndEvent) => handleUnionOptionChildDragEnd(optIndex, e)}>
                      <SortableContext items={(opt as ObjectSchema).fields}>
                        {#each (opt as ObjectSchema).fields as child, childIndex (child.id)}
                          <Self
                            field={child}
                            depth={depth + 1}
                            onUpdate={(updated: Field) => updateUnionOptionChild(optIndex, childIndex, updated)}
                            onDelete={() => deleteUnionOptionChild(optIndex, childIndex)}
                            onDuplicate={() => duplicateUnionOptionChild(optIndex, childIndex)}
                          />
                        {/each}
                      </SortableContext>
                    </DndContext>
                  {:else}
                    <div class="text-xs text-muted-foreground py-2 text-center">{msg['schemaEditor_noChildFields']()}</div>
                  {/if}
                  <div class="flex gap-1 flex-wrap pt-1">
                    {#each typeOptions as typeOpt}
                      <Button
                        size="sm"
                        variant="ghost"
                        class="h-6 px-2 text-xs"
                        onclick={() => addUnionOptionChildField(optIndex, typeOpt)}
                      >
                        <Icon icon={TYPE_ICONS[typeOpt]} class="size-3 mr-1" />
                        {getTypeLabel(typeOpt)}
                      </Button>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      {#if (field.type === 'object' && children.length === 0) || (field.type === 'array' && arrayItemFields.length === 0)}
        <div class="text-xs text-muted-foreground py-2 text-center">{msg['schemaEditor_noChildFields']()}</div>
      {/if}

      {#if field.type === 'object' || (field.type === 'array' && (field as ArraySchema).item.type === 'object')}
        <div class="flex gap-1 flex-wrap pt-1">
          {#each typeOptions as opt}
            <Button
              size="sm"
              variant="ghost"
              class="h-6 px-2 text-xs"
              onclick={() => field.type === 'object' ? addChildField(opt) : addArrayItemChildField(opt)}
            >
              <Icon icon={TYPE_ICONS[opt]} class="size-3 mr-1" />
              {getTypeLabel(opt)}
            </Button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<!-- Edit Modal -->
<Dialog.Root bind:open={isModalOpen}>
  <Dialog.Content class="max-w-lg max-h-[85vh] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>{msg['schemaEditor_editField']()}</Dialog.Title>
    </Dialog.Header>

    <div class="space-y-4 py-4">
      <div class="grid grid-cols-2 gap-3">
        <div class="space-y-1.5">
          <Label class="text-xs">{msg['schemaEditor_fieldName']()}</Label>
          <Input bind:value={formName} placeholder="field_name" class="h-9" />
        </div>
        <div class="space-y-1.5">
          <Label class="text-xs">{msg['schemaEditor_fieldType']()}</Label>
          <Select.Root type="single" value={formType} onValueChange={(v: string) => formType = v as FieldType}>
            <Select.Trigger class="h-9">
              <Icon icon={TYPE_ICONS[formType]} class="size-4 mr-2" />
              {getTypeLabel(formType)}
            </Select.Trigger>
            <Select.Content>
              {#each typeOptions as opt}
                <Select.Item value={opt}>
                  <Icon icon={TYPE_ICONS[opt]} class="size-4 mr-2" />
                  {getTypeLabel(opt)}
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      <div class="space-y-1.5">
        <Label class="text-xs">{msg['common_fields_description']()}</Label>
        <Input bind:value={formDescription} placeholder="Field description" class="h-9" />
      </div>

      <div class="flex gap-6">
        <div class="flex items-center gap-2">
        <Switch bind:checked={formOptional} />
        <Label class="text-sm">{msg['schemaEditor_optional']()}</Label>
      </div>
    </div>

      {#if formType === 'literal'}
        <div class="space-y-1.5">
          <Label class="text-xs">{msg['schemaEditor_literalValue']()}</Label>
          <Input bind:value={formLiteralValue} placeholder="Enter value" class="h-9" />
          <p class="text-xs text-muted-foreground">{msg['schemaEditor_literalValueHint']()}</p>
        </div>
      {/if}

      {#if formType === 'enum'}
        <div class="space-y-2">
          <Label class="text-xs">{msg['schemaEditor_enumValues']()}</Label>
          <div class="flex gap-2">
            <Input
              bind:value={newEnumValue}
              placeholder={msg['schemaEditor_enumValuePlaceholder']()}
              class="h-9 flex-1"
              onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && addEnumValue()}
            />
            <Button size="sm" variant="outline" class="h-9" onclick={addEnumValue}>{msg['common_actions_add']()}</Button>
          </div>
          {#if formEnumValues.length > 0}
            <div class="flex flex-wrap gap-1">
              {#each formEnumValues as val, i}
                <Badge variant="secondary" class="gap-1">
                  {val}
                  <button class="hover:text-destructive" onclick={() => removeEnumValue(i)}>×</button>
                </Badge>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      {#if formType === 'array'}
        <div class="space-y-3 p-3 bg-muted/30 rounded-lg">
          <Label class="text-xs">{msg['schemaEditor_itemType']()}</Label>
          <Select.Root type="single" value={formArrayItemType} onValueChange={(v: string) => formArrayItemType = v as FieldType}>
            <Select.Trigger class="h-9">
              <Icon icon={TYPE_ICONS[formArrayItemType]} class="size-4 mr-2" />
              {getTypeLabel(formArrayItemType)}
            </Select.Trigger>
            <Select.Content>
              {#each typeOptions as opt}
                <Select.Item value={opt}>
                  <Icon icon={TYPE_ICONS[opt]} class="size-4 mr-2" />
                  {getTypeLabel(opt)}
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
      {/if}

      {#if formType === 'union'}
        <div class="space-y-3 p-3 bg-muted/30 rounded-lg">
          <Label class="text-xs">{msg['schemaEditor_unionOptions']()}</Label>
          {#if formUnionOptions.length > 0}
            <div class="space-y-2">
              {#each formUnionOptions as opt, i (opt.id)}
                <div class="flex items-center gap-2 p-2 bg-background rounded border">
                  <Icon icon={TYPE_ICONS[opt.type]} class="size-4 text-muted-foreground" />
                  <Select.Root type="single" value={opt.type} onValueChange={(v: string) => updateUnionOptionType(i, v as FieldType)}>
                    <Select.Trigger class="h-8 flex-1">{getTypeLabel(opt.type)}</Select.Trigger>
                    <Select.Content>
                      {#each typeOptions.filter(tp => tp !== 'union') as typeOpt}
                        <Select.Item value={typeOpt}>
                          <Icon icon={TYPE_ICONS[typeOpt]} class="size-4 mr-2" />
                          {getTypeLabel(typeOpt)}
                        </Select.Item>
                      {/each}
                    </Select.Content>
                  </Select.Root>
                  <Button
                    size="sm"
                    variant="ghost"
                    class="h-8 w-8 p-0"
                    disabled={formUnionOptions.length <= 1}
                    onclick={() => removeUnionOption(i)}
                  >×</Button>
                </div>
              {/each}
            </div>
          {/if}
          <div class="flex gap-1 flex-wrap">
            {#each typeOptions.filter(tp => tp !== 'union') as opt}
              <Button size="sm" variant="outline" class="h-7 text-xs" onclick={() => addUnionOption(opt)}>
                <Icon icon={TYPE_ICONS[opt]} class="size-3 mr-1" />
                + {getTypeLabel(opt)}
              </Button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => isModalOpen = false}>{msg['common_actions_cancel']()}</Button>
      <Button onclick={saveField}>{msg['common_actions_save']()}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
