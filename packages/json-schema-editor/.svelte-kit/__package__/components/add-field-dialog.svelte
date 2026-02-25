<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from './ui/button/index.js';
  import { Input } from './ui/input/index.js';
  import { Checkbox } from './ui/checkbox/index.js';
  import { Label } from './ui/label/index.js';
  import * as Dialog from './ui/dialog/index.js';
  import {
    type Field,
    type FieldType,
    createField,
    TYPE_ICONS,
    TYPE_COLOR_CLASSES,
  } from '../types.js';

  interface Props {
    open: boolean;
    field?: Field | null;
    locale?: 'zh' | 'en';
    existingNames?: string[];
    onSave: (field: Field) => void;
    onCancel: () => void;
  }

  let {
    open = $bindable(false),
    field = null,
    locale = 'zh',
    existingNames = [],
    onSave,
    onCancel,
  }: Props = $props();

  let formName = $state('');
  let formDescription = $state('');
  let formRequired = $state(false);
  let formType = $state<FieldType>('string');
  let nameError = $state('');

  const labels = {
    zh: {
      addField: '添加字段',
      editField: '编辑字段',
      fieldName: '字段名称',
      fieldNamePlaceholder: '输入字段名称',
      description: '描述',
      descriptionPlaceholder: '输入字段描述（可选）',
      required: '必填字段',
      fieldType: '字段类型',
      cancel: '取消',
      save: '保存',
      nameDuplicate: '字段名称已存在',
      types: {
        string: '文本',
        number: '数字',
        boolean: '是/否',
        array: '列表',
        object: '分组',
      },
    },
    en: {
      addField: 'Add Field',
      editField: 'Edit Field',
      fieldName: 'Field Name',
      fieldNamePlaceholder: 'Enter field name',
      description: 'Description',
      descriptionPlaceholder: 'Enter description (optional)',
      required: 'Required field',
      fieldType: 'Field Type',
      cancel: 'Cancel',
      save: 'Save',
      nameDuplicate: 'Field name already exists',
      types: {
        string: 'Text',
        number: 'Number',
        boolean: 'Yes/No',
        array: 'List',
        object: 'Group',
      },
    },
  };

  const t = $derived(labels[locale]);
  const isEditing = $derived(!!field);
  const title = $derived(isEditing ? t.editField : t.addField);

  const typeOptions: FieldType[] = ['string', 'number', 'boolean', 'object', 'array'];

  $effect(() => {
    if (open) {
      if (field) {
        formName = field.name;
        formDescription = field.description || '';
        formRequired = field.required;
        formType = field.type;
      } else {
        formName = '';
        formDescription = '';
        formRequired = false;
        formType = 'string';
      }
      nameError = '';
    }
  });

  function validateName(name: string): boolean {
    const trimmed = name.trim();
    if (!trimmed) return false;
    
    // 编辑时排除自己的名称
    const namesToCheck = field 
      ? existingNames.filter(n => n !== field.name)
      : existingNames;
    
    if (namesToCheck.includes(trimmed)) {
      nameError = t.nameDuplicate;
      return false;
    }
    nameError = '';
    return true;
  }

  function handleNameChange(e: Event) {
    const target = e.target as HTMLInputElement;
    formName = target.value;
    validateName(formName);
  }

  function handleSave() {
    if (!validateName(formName)) return;

    let newField: Field;

    if (field && field.type === formType) {
      newField = {
        ...field,
        name: formName.trim(),
        description: formDescription.trim() || undefined,
        required: formRequired,
      };
    } else {
      newField = createField(formType, formName.trim());
      newField.description = formDescription.trim() || undefined;
      newField.required = formRequired;
      if (field) {
        newField.id = field.id;
      }
    }

    onSave(newField);
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      onCancel();
    }
  }
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
    </Dialog.Header>

    <div class="space-y-4 py-4">
      <div class="space-y-2">
        <Label>{t.fieldName}</Label>
        <Input 
          type="text" 
          placeholder={t.fieldNamePlaceholder} 
          value={formName}
          oninput={handleNameChange}
          class={nameError ? 'border-destructive' : ''}
        />
        {#if nameError}
          <p class="text-sm text-destructive">{nameError}</p>
        {/if}
      </div>

      <div class="space-y-2">
        <Label>{t.description}</Label>
        <Input type="text" placeholder={t.descriptionPlaceholder} bind:value={formDescription} />
      </div>

      <div class="flex items-center gap-2">
        <Checkbox bind:checked={formRequired} />
        <Label class="cursor-pointer" onclick={() => formRequired = !formRequired}>{t.required}</Label>
      </div>

      <div class="space-y-2">
        <Label>{t.fieldType}</Label>
        <div class="flex flex-wrap gap-2">
          {#each typeOptions as type}
            {@const colors = TYPE_COLOR_CLASSES[type]}
            <button
              type="button"
              class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors {formType === type ? `${colors.bg} ${colors.text}` : 'bg-muted text-muted-foreground hover:bg-muted/80'}"
              onclick={() => formType = type}
            >
              <Icon icon={TYPE_ICONS[type]} class="size-4" />
              <span>{t.types[type]}</span>
            </button>
          {/each}
        </div>
      </div>
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={onCancel}>{t.cancel}</Button>
      <Button onclick={handleSave} disabled={!formName.trim()}>{t.save}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
