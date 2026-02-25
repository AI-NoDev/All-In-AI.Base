<script lang="ts">
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import XIcon from "@lucide/svelte/icons/x";
  import PlusCircleIcon from "@lucide/svelte/icons/plus-circle";
  import { cn } from "$lib/utils.js";
  import { Button } from "./ui/button/index.js";
  import { Input } from "./ui/input/index.js";
  import { Switch } from "./ui/switch/index.js";
  import { Badge } from "./ui/badge/index.js";
  import * as Select from "./ui/select/index.js";
  import * as Collapsible from "./ui/collapsible/index.js";
  import FieldItem from "./field-item.svelte";
  import {
    type Field,
    type FieldType,
    type ObjectField,
    type ArrayField,
    type StringField,
    type NumberField,
    type BooleanField,
    type StringFormat,
    TYPE_LABELS,
    TYPE_COLOR_CLASSES,
    STRING_FORMATS,
    createField,
    cloneField,
  } from '../types.js';
  import AddFieldDialog from './add-field-dialog.svelte';

  interface Props {
    field: Field;
    locale?: 'zh' | 'en';
    readonly?: boolean;
    onEdit?: () => void;
    onDelete: () => void;
    onDuplicate: () => void;
    onUpdate: (field: Field) => void;
  }

  let {
    field,
    locale = 'zh',
    readonly = false,
    onEdit,
    onDelete,
    onDuplicate,
    onUpdate,
  }: Props = $props();

  let expanded = $state(false);
  let showAddChildDialog = $state(false);
  let editingChildIndex = $state(-1);
  let editingChildField = $state<Field | null>(null);

  const labels = {
    zh: {
      required: '必填',
      optional: '可选',
      noChildren: '暂无子字段',
      addField: '添加字段',
      minLength: '最小长度',
      maxLength: '最大长度',
      pattern: '正则表达式',
      format: '格式',
      allowedValues: '允许的值 (enum)',
      noRestricted: '未设置限制值',
      addValue: '添加允许的值...',
      add: '添加',
      noMin: '无最小值',
      noMax: '无最大值',
      minValue: '最小值',
      maxValue: '最大值',
      exclusiveMin: '排他最小值',
      exclusiveMax: '排他最大值',
      multipleOf: '倍数',
      any: '任意',
      noExclusiveMin: '无排他最小值',
      noExclusiveMax: '无排他最大值',
      allowedValuesBoolean: '允许的值',
      allowTrue: '允许 true 值',
      allowFalse: '允许 false 值',
      minItems: '最小数量',
      maxItems: '最大数量',
      uniqueItems: '强制唯一',
      itemType: '元素类型',
    },
    en: {
      required: 'Required',
      optional: 'Optional',
      noChildren: 'No child fields',
      addField: 'Add Field',
      minLength: 'Minimum Length',
      maxLength: 'Maximum Length',
      pattern: 'Pattern (regex)',
      format: 'Format',
      allowedValues: 'Allowed Values (enum)',
      noRestricted: 'No restricted values set',
      addValue: 'Add allowed value...',
      add: 'Add',
      noMin: 'No minimum',
      noMax: 'No maximum',
      minValue: 'Minimum Value',
      maxValue: 'Maximum Value',
      exclusiveMin: 'Exclusive Minimum',
      exclusiveMax: 'Exclusive Maximum',
      multipleOf: 'Multiple Of',
      any: 'Any',
      noExclusiveMin: 'No exclusive min',
      noExclusiveMax: 'No exclusive max',
      allowedValuesBoolean: 'Allowed Values',
      allowTrue: 'Allow true value',
      allowFalse: 'Allow false value',
      minItems: 'Minimum Items',
      maxItems: 'Maximum Items',
      uniqueItems: 'Force unique items',
      itemType: 'Item Type',
    },
  };

  const t = $derived(labels[locale]);

  function getTypeLabel(type: FieldType): string {
    return TYPE_LABELS[type]?.[locale] ?? type;
  }

  function getTypeColorClasses(type: FieldType): { bg: string; text: string; border: string } {
    return TYPE_COLOR_CLASSES[type] ?? { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
  }

  const typeOptions: FieldType[] = ['string', 'number', 'boolean', 'object', 'array'];

  function changeFieldType(newType: FieldType) {
    if (newType === field.type) return;
    const newField = createField(newType, field.name);
    newField.id = field.id;
    newField.description = field.description;
    newField.required = field.required;
    onUpdate(newField);
  }

  function toggleRequired() {
    onUpdate({ ...field, required: !field.required });
  }

  let objectChildren = $derived.by(() => {
    if (field.type === 'object') {
      return (field as ObjectField).properties;
    }
    return [];
  });

  let objectChildNames = $derived(objectChildren.map(c => c.name));

  let arrayItemChildren = $derived.by(() => {
    if (field.type === 'array' && field.items.type === 'object') {
      return (field.items as ObjectField).properties;
    }
    return [];
  });

  let arrayItemChildNames = $derived(arrayItemChildren.map(c => c.name));

  // Derived typed fields for reactivity
  let stringField = $derived(field.type === 'string' ? field as StringField : null);
  let numberField = $derived(field.type === 'number' ? field as NumberField : null);
  let booleanField = $derived(field.type === 'boolean' ? field as BooleanField : null);
  let arrayField = $derived(field.type === 'array' ? field as ArrayField : null);

  // String handlers
  function updateStringField(updates: Partial<StringField>) {
    if (field.type === 'string') {
      onUpdate({ ...field, ...updates } as Field);
    }
  }

  let newEnumValue = $state('');
  function addStringEnumValue() {
    if (field.type === 'string' && newEnumValue.trim()) {
      const f = field as StringField;
      const newEnum = [...(f.enum || []), newEnumValue.trim()];
      updateStringField({ enum: newEnum });
      newEnumValue = '';
    }
  }

  function removeStringEnumValue(index: number) {
    if (field.type === 'string') {
      const f = field as StringField;
      const newEnum = (f.enum || []).filter((_, i) => i !== index);
      updateStringField({ enum: newEnum });
    }
  }

  // Number handlers
  function updateNumberField(updates: Partial<NumberField>) {
    if (field.type === 'number') {
      onUpdate({ ...field, ...updates } as Field);
    }
  }

  let newNumberEnumValue = $state('');
  function addNumberEnumValue() {
    if (field.type === 'number' && newNumberEnumValue.trim()) {
      const num = parseFloat(newNumberEnumValue);
      if (!isNaN(num)) {
        const f = field as NumberField;
        const newEnum = [...(f.enum || []), num];
        updateNumberField({ enum: newEnum });
        newNumberEnumValue = '';
      }
    }
  }

  function removeNumberEnumValue(index: number) {
    if (field.type === 'number') {
      const f = field as NumberField;
      const newEnum = (f.enum || []).filter((_, i) => i !== index);
      updateNumberField({ enum: newEnum });
    }
  }

  // Boolean handlers
  function updateBooleanField(updates: Partial<BooleanField>) {
    if (field.type === 'boolean') {
      onUpdate({ ...field, ...updates } as Field);
    }
  }

  // Array handlers
  function updateArrayField(updates: Partial<ArrayField>) {
    if (field.type === 'array') {
      onUpdate({ ...field, ...updates } as Field);
    }
  }

  function updateArrayItemType(newType: FieldType) {
    if (field.type === 'array') {
      const newItem = createField(newType, 'item');
      updateArrayField({ items: newItem });
    }
  }

  // Object child handlers
  function updateObjectChild(index: number, updated: Field) {
    if (field.type === 'object') {
      const newProps = [...(field as ObjectField).properties];
      newProps[index] = updated;
      onUpdate({ ...field, properties: newProps } as Field);
    }
  }

  function deleteObjectChild(index: number) {
    if (field.type === 'object') {
      const newProps = (field as ObjectField).properties.filter((_, i) => i !== index);
      onUpdate({ ...field, properties: newProps } as Field);
    }
  }

  function duplicateObjectChild(index: number) {
    if (field.type === 'object') {
      const cloned = cloneField((field as ObjectField).properties[index]);
      cloned.name = `${cloned.name}_copy`;
      const newProps = [...(field as ObjectField).properties];
      newProps.splice(index + 1, 0, cloned);
      onUpdate({ ...field, properties: newProps } as Field);
    }
  }

  function openAddObjectChildDialog() {
    editingChildField = null;
    editingChildIndex = -1;
    showAddChildDialog = true;
  }

  function handleSaveObjectChild(newField: Field) {
    if (field.type === 'object') {
      if (editingChildIndex >= 0) {
        updateObjectChild(editingChildIndex, newField);
      } else {
        const newProps = [...(field as ObjectField).properties, newField];
        onUpdate({ ...field, properties: newProps } as Field);
      }
    }
    showAddChildDialog = false;
    editingChildField = null;
    editingChildIndex = -1;
  }

  // Array item child handlers
  function updateArrayItemChild(index: number, updated: Field) {
    if (field.type === 'array' && field.items.type === 'object') {
      const itemObj = field.items as ObjectField;
      const newProps = [...itemObj.properties];
      newProps[index] = updated;
      updateArrayField({ items: { ...itemObj, properties: newProps } });
    }
  }

  function deleteArrayItemChild(index: number) {
    if (field.type === 'array' && field.items.type === 'object') {
      const itemObj = field.items as ObjectField;
      const newProps = itemObj.properties.filter((_, i) => i !== index);
      updateArrayField({ items: { ...itemObj, properties: newProps } });
    }
  }

  function duplicateArrayItemChild(index: number) {
    if (field.type === 'array' && field.items.type === 'object') {
      const itemObj = field.items as ObjectField;
      const cloned = cloneField(itemObj.properties[index]);
      cloned.name = `${cloned.name}_copy`;
      const newProps = [...itemObj.properties];
      newProps.splice(index + 1, 0, cloned);
      updateArrayField({ items: { ...itemObj, properties: newProps } });
    }
  }

  function openAddArrayItemChildDialog() {
    editingChildField = null;
    editingChildIndex = -1;
    showAddChildDialog = true;
  }

  function handleSaveArrayItemChild(newField: Field) {
    if (field.type === 'array' && field.items.type === 'object') {
      const itemObj = field.items as ObjectField;
      if (editingChildIndex >= 0) {
        updateArrayItemChild(editingChildIndex, newField);
      } else {
        const newProps = [...itemObj.properties, newField];
        updateArrayField({ items: { ...itemObj, properties: newProps } });
      }
    }
    showAddChildDialog = false;
    editingChildField = null;
    editingChildIndex = -1;
  }
</script>

<Collapsible.Root bind:open={expanded} class="rounded-lg bg-card">
  <div class="group flex items-center gap-2 p-3 hover:bg-muted/50 rounded-lg transition-colors">
    {#if !readonly || field.type === 'object' || field.type === 'array'}
      <Collapsible.Trigger class="flex items-center justify-center w-6 h-6 rounded hover:bg-muted transition-colors">
        <ChevronRightIcon class={cn("size-4 text-muted-foreground transition-transform", expanded && "rotate-90")} />
      </Collapsible.Trigger>
    {:else}
      <div class="w-6 h-6"></div>
    {/if}

    <span class="font-semibold text-sm">{field.name || '(unnamed)'}</span>

    {#if field.description}
      <span class="text-sm text-muted-foreground flex-1 truncate">{field.description}</span>
    {/if}

    <div class="flex items-center gap-2 ml-auto">
      {#if readonly}
        {@const colors = getTypeColorClasses(field.type)}
        <Badge variant="outline" class={cn(colors.bg, colors.text, colors.border)}>
          {getTypeLabel(field.type)}
        </Badge>
        {#if field.required}
          <Badge variant="destructive" class="text-xs">{t.required}</Badge>
        {/if}
      {:else}
        {@const colors = getTypeColorClasses(field.type)}
        <Select.Root type="single" value={field.type} onValueChange={(v) => v && changeFieldType(v as FieldType)}>
          <Select.Trigger class={cn("h-7 px-2 text-xs border-0", colors.bg, colors.text)}>
            {getTypeLabel(field.type)}
          </Select.Trigger>
          <Select.Content>
            {#each typeOptions as type}
              <Select.Item value={type} label={getTypeLabel(type)} />
            {/each}
          </Select.Content>
        </Select.Root>

        <Button
          variant="ghost"
          size="sm"
          class={cn(
            "h-7 px-2 text-xs",
            field.required ? "text-destructive bg-destructive/10 hover:bg-destructive/15" : "text-muted-foreground"
          )}
          onclick={toggleRequired}
        >
          {field.required ? t.required : t.optional}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          class="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 w-7"
          onclick={onDelete}
        >
          <XIcon class="size-4" />
        </Button>
      {/if}
    </div>
  </div>

  <Collapsible.Content>
    <div class="px-3 pb-3 space-y-3">
      {#if !readonly}
        {#if stringField}
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-medium">{t.minLength}</label>
              <Input
                type="number"
                placeholder={t.noMin}
                value={stringField.minLength ?? ''}
                onchange={(e) => updateStringField({ minLength: e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined })}
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium">{t.maxLength}</label>
              <Input
                type="number"
                placeholder={t.noMax}
                value={stringField.maxLength ?? ''}
                onchange={(e) => updateStringField({ maxLength: e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined })}
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium">{t.format}</label>
            <Select.Root type="single" value={stringField.format || 'none'} onValueChange={(v) => v && updateStringField({ format: v as StringFormat })}>
              <Select.Trigger class="w-full">
                {STRING_FORMATS.find(fmt => fmt.value === (stringField.format || 'none'))?.label[locale] || 'None'}
              </Select.Trigger>
              <Select.Content>
                {#each STRING_FORMATS as fmt}
                  <Select.Item value={fmt.value} label={fmt.label[locale]} />
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">{t.allowedValues}</label>
            {#if !stringField.enum || stringField.enum.length === 0}
              <p class="text-sm text-muted-foreground italic">{t.noRestricted}</p>
            {:else}
              <div class="flex flex-wrap gap-1.5">
                {#each stringField.enum as val, i}
                  <Badge variant="secondary" class="gap-1">
                    {val}
                    <button type="button" class="hover:text-destructive" onclick={() => removeStringEnumValue(i)}>
                      <XIcon class="size-3" />
                    </button>
                  </Badge>
                {/each}
              </div>
            {/if}
            <div class="flex gap-2">
              <Input
                type="text"
                class="flex-1"
                placeholder={t.addValue}
                bind:value={newEnumValue}
                onkeydown={(e) => e.key === 'Enter' && addStringEnumValue()}
              />
              <Button variant="secondary" size="sm" onclick={addStringEnumValue}>{t.add}</Button>
            </div>
          </div>
        {/if}

        {#if numberField}
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-medium">{t.minValue}</label>
              <Input
                type="number"
                placeholder={t.noMin}
                value={numberField.minimum ?? ''}
                onchange={(e) => updateNumberField({ minimum: e.currentTarget.value ? parseFloat(e.currentTarget.value) : undefined })}
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium">{t.maxValue}</label>
              <Input
                type="number"
                placeholder={t.noMax}
                value={numberField.maximum ?? ''}
                onchange={(e) => updateNumberField({ maximum: e.currentTarget.value ? parseFloat(e.currentTarget.value) : undefined })}
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">{t.allowedValues}</label>
            {#if !numberField.enum || numberField.enum.length === 0}
              <p class="text-sm text-muted-foreground italic">{t.noRestricted}</p>
            {:else}
              <div class="flex flex-wrap gap-1.5">
                {#each numberField.enum as val, i}
                  <Badge variant="secondary" class="gap-1">
                    {val}
                    <button type="button" class="hover:text-destructive" onclick={() => removeNumberEnumValue(i)}>
                      <XIcon class="size-3" />
                    </button>
                  </Badge>
                {/each}
              </div>
            {/if}
            <div class="flex gap-2">
              <Input
                type="number"
                class="flex-1"
                placeholder={t.addValue}
                bind:value={newNumberEnumValue}
                onkeydown={(e) => e.key === 'Enter' && addNumberEnumValue()}
              />
              <Button variant="secondary" size="sm" onclick={addNumberEnumValue}>{t.add}</Button>
            </div>
          </div>
        {/if}

        {#if booleanField}
          <div class="space-y-3">
            <label class="text-sm font-medium">{t.allowedValuesBoolean}</label>
            <div class="flex items-center gap-3">
              <Switch
                checked={booleanField.allowTrue !== false}
                onCheckedChange={(checked) => updateBooleanField({ allowTrue: checked })}
              />
              <span class="text-sm">{t.allowTrue}</span>
            </div>
            <div class="flex items-center gap-3">
              <Switch
                checked={booleanField.allowFalse !== false}
                onCheckedChange={(checked) => updateBooleanField({ allowFalse: checked })}
              />
              <span class="text-sm">{t.allowFalse}</span>
            </div>
          </div>
        {/if}

        {#if arrayField}
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="text-sm font-medium">{t.minItems}</label>
              <Input
                type="number"
                placeholder={t.noMin}
                value={arrayField.minItems ?? ''}
                onchange={(e) => updateArrayField({ minItems: e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined })}
              />
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium">{t.maxItems}</label>
              <Input
                type="number"
                placeholder={t.noMax}
                value={arrayField.maxItems ?? ''}
                onchange={(e) => updateArrayField({ maxItems: e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined })}
              />
            </div>
          </div>

          <div class="flex items-center gap-3">
            <Switch
              checked={arrayField.uniqueItems ?? false}
              onCheckedChange={(checked) => updateArrayField({ uniqueItems: checked })}
            />
            <span class="text-sm">{t.uniqueItems}</span>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium">{t.itemType}</label>
              <Select.Root type="single" value={arrayField.items.type} onValueChange={(v) => v && updateArrayItemType(v as FieldType)}>
                <Select.Trigger class={cn("h-7 px-2 text-xs border-0", getTypeColorClasses(arrayField.items.type).bg, getTypeColorClasses(arrayField.items.type).text)}>
                  {getTypeLabel(arrayField.items.type)}
                </Select.Trigger>
                <Select.Content>
                  {#each typeOptions as type}
                    <Select.Item value={type} label={getTypeLabel(type)} />
                  {/each}
                </Select.Content>
              </Select.Root>
            </div>

            {#if arrayField.items.type === 'object'}
              <div class="space-y-1 p-2 bg-muted/30 rounded-lg border border-border/50">
                {#each arrayItemChildren as child, index (child.id)}
                  <svelte:self
                    field={child}
                    {locale}
                    onDelete={() => deleteArrayItemChild(index)}
                    onDuplicate={() => duplicateArrayItemChild(index)}
                    onUpdate={(updated) => updateArrayItemChild(index, updated)}
                  />
                {/each}
                {#if arrayItemChildren.length === 0}
                  <p class="text-center text-sm text-muted-foreground py-3">{t.noChildren}</p>
                {/if}
                <Button variant="ghost" size="sm" class="w-full text-muted-foreground hover:text-primary" onclick={openAddArrayItemChildDialog}>
                  <PlusCircleIcon class="size-4 mr-1" />
                  {t.addField}
                </Button>
              </div>
            {/if}
          </div>
        {/if}

        {#if field.type === 'object'}
          <div class="space-y-1 p-2 bg-muted/30 rounded-lg border border-border/50">
            {#each objectChildren as child, index (child.id)}
              <svelte:self
                field={child}
                {locale}
                onDelete={() => deleteObjectChild(index)}
                onDuplicate={() => duplicateObjectChild(index)}
                onUpdate={(updated) => updateObjectChild(index, updated)}
              />
            {/each}
            {#if objectChildren.length === 0}
              <p class="text-center text-sm text-muted-foreground py-3">{t.noChildren}</p>
            {/if}
            <Button variant="ghost" size="sm" class="w-full text-muted-foreground hover:text-primary" onclick={openAddObjectChildDialog}>
              <PlusCircleIcon class="size-4 mr-1" />
              {t.addField}
            </Button>
          </div>
        {/if}
      {:else}
        <!-- Readonly mode: only show children for object/array types -->
        {#if arrayField && arrayField.items.type === 'object'}
          <div class="space-y-0.5 pl-2 border-l-2 border-border/50">
            {#each arrayItemChildren as child (child.id)}
              <svelte:self field={child} {locale} readonly={true} onDelete={() => {}} onDuplicate={() => {}} onUpdate={() => {}} />
            {/each}
          </div>
        {/if}

        {#if field.type === 'object'}
          <div class="space-y-0.5 pl-2 border-l-2 border-border/50">
            {#each objectChildren as child (child.id)}
              <svelte:self field={child} {locale} readonly={true} onDelete={() => {}} onDuplicate={() => {}} onUpdate={() => {}} />
            {/each}
          </div>
        {/if}
      {/if}
    </div>
  </Collapsible.Content>
</Collapsible.Root>

{#if !readonly}
  <AddFieldDialog
    bind:open={showAddChildDialog}
    field={editingChildField}
    existingNames={field.type === 'object' ? objectChildNames : arrayItemChildNames}
    {locale}
    onSave={field.type === 'object' ? handleSaveObjectChild : handleSaveArrayItemChild}
    onCancel={() => { showAddChildDialog = false; editingChildField = null; editingChildIndex = -1; }}
  />
{/if}
