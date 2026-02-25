<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface DataModel {
    id: string;
    name: string;
    description: string | null;
    jsonSchema: Record<string, unknown>;
    remark: string | null;
    status: string | null;
    createdAt: string;
    updatedAt: string;
  }

  interface PageSnapshot {
    dataModels: DataModel[];
    dataLoaded: boolean;
  }

  let pageState: PageSnapshot = {
    dataModels: [],
    dataLoaded: false
  };

  let restoreCallback: ((value: PageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<PageSnapshot> = {
    capture: () => pageState,
    restore: (value) => {
      pageState = value;
      if (restoreCallback) restoreCallback(value);
    }
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Card from '$lib/components/ui/card';
  import * as Sheet from '$lib/components/ui/sheet';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Badge } from '$lib/components/ui/badge';
  import * as Table from '$lib/components/ui/table';
  import * as Select from '$lib/components/ui/select';
  import { toast } from 'svelte-sonner';
  import JsonSchemaEditor from '$lib/components/common/json-schema-editor.svelte';

  interface FormData {
    name: string;
    description: string;
    jsonSchema: Record<string, unknown> | null;
    remark: string;
    status: string;
  }

  const STATUS_OPTIONS = [
    { value: '0', label: () => t('page.ai.dataModel_statusActive') },
    { value: '1', label: () => t('page.ai.dataModel_statusDisabled') },
  ];

  let dataModels = $state<DataModel[]>(pageState.dataModels);
  let loading = $state(!pageState.dataLoaded);
  let snapshotRestored = $state(pageState.dataLoaded);

  // Register restore callback
  restoreCallback = (value) => {
    dataModels = value.dataModels;
    snapshotRestored = value.dataLoaded;
    loading = !value.dataLoaded;
  };

  // Sync state to module-level for snapshot
  $effect(() => {
    pageState = {
      dataModels,
      dataLoaded: !loading && dataModels.length >= 0
    };
  });
  
  // Create Dialog state
  let createDialogOpen = $state(false);
  let saving = $state(false);
  let form = $state<FormData>({ name: '', description: '', jsonSchema: null, remark: '', status: '0' });

  // Edit Sheet state
  let editSheetOpen = $state(false);
  let editingModel = $state<DataModel | null>(null);
  let editForm = $state<FormData>({ name: '', description: '', jsonSchema: null, remark: '', status: '0' });
  let editSaving = $state(false);

  async function loadDataModels() {
    try {
      const api = authStore.createApi(true);
      const res = await api.actions.postApiActionsExecuteByName(
        { name: 'ai.dataModel.getByPagination' },
        { 
          limit: 100, 
          offset: 0,
          sort: { field: 'createdAt', order: 'desc' }
        }
      );
      if (res.data?.data) dataModels = res.data.data;
    } catch (err) {
      console.error('Failed to load data models:', err);
      toast.error(t('common.tips.loadFailed'));
    } finally {
      loading = false;
    }
  }

  function openCreateDialog() {
    form = { name: '', description: '', jsonSchema: null, remark: '', status: '0' };
    createDialogOpen = true;
  }

  function openEditSheet(model: DataModel) {
    editingModel = model;
    editForm = {
      name: model.name,
      description: model.description || '',
      jsonSchema: model.jsonSchema || null,
      remark: model.remark || '',
      status: model.status || '0',
    };
    editSheetOpen = true;
  }

  async function handleCreate() {
    if (!form.name.trim()) {
      toast.error(t('page.ai.dataModel_fillRequired'));
      return;
    }
    
    saving = true;
    try {
      const api = authStore.createApi(true);
      await api.actions.postApiActionsExecuteByName(
        { name: 'ai.dataModel.create' },
        { 
          data: {
            name: form.name,
            description: form.description || null,
            jsonSchema: form.jsonSchema || {},
            remark: form.remark || null,
            status: form.status,
          }
        }
      );
      
      toast.success(t('common.tips.createSuccess'));
      createDialogOpen = false;
      loadDataModels();
    } catch (err) {
      console.error('Failed to create:', err);
      toast.error(t('common.tips.createFailed'));
    } finally {
      saving = false;
    }
  }

  async function handleUpdate() {
    if (!editingModel) return;
    if (!editForm.name.trim()) {
      toast.error(t('page.ai.dataModel_fillRequired'));
      return;
    }
    
    editSaving = true;
    try {
      const api = authStore.createApi(true);
      await api.actions.postApiActionsExecuteByName(
        { name: 'ai.dataModel.update' },
        { 
          params: { id: editingModel.id },
          data: {
            name: editForm.name,
            description: editForm.description || null,
            jsonSchema: editForm.jsonSchema || {},
            remark: editForm.remark || null,
            status: editForm.status,
          }
        }
      );
      
      toast.success(t('common.tips.updateSuccess'));
      editSheetOpen = false;
      loadDataModels();
    } catch (err) {
      console.error('Failed to update:', err);
      toast.error(t('common.tips.updateFailed'));
    } finally {
      editSaving = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('page.ai.dataModel_deleteConfirm'))) return;
    
    try {
      const api = authStore.createApi(true);
      await api.actions.postApiActionsExecuteByName(
        { name: 'ai.dataModel.deleteByPk' },
        { params: { id } }
      );
      toast.success(t('common.tips.deleteSuccess'));
      loadDataModels();
    } catch (err) {
      console.error('Failed to delete:', err);
      toast.error(t('common.tips.deleteFailed'));
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('zh-CN');
  }

  function getStatusLabel(status: string | null): string {
    return status === '1' ? t('page.ai.dataModel_statusDisabled') : t('page.ai.dataModel_statusActive');
  }

  function getStatusVariant(status: string | null): 'default' | 'secondary' {
    return status === '1' ? 'secondary' : 'default';
  }

  onMount(() => {
    if (!snapshotRestored) {
      loadDataModels();
    }
  });
</script>


<div class="flex flex-1 flex-col min-h-0 px-4 lg:px-6 pb-4">
  <div class="py-3 flex items-center justify-between border-b border-border">
    <div class="flex gap-2">
      <Button size="sm" onclick={openCreateDialog}>
        <Icon icon="mdi:plus" class="mr-1 size-4" />{t('page.ai.dataModel_addModel')}
      </Button>
    </div>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadDataModels}>
      <Icon icon="mdi:refresh" class="size-4" />
    </Button>
  </div>

  <div class="flex-1 min-h-0 pt-4">
  {#if loading}
    <div class="flex items-center justify-center py-12 text-muted-foreground">
      <Icon icon="mdi:loading" class="size-6 animate-spin mr-2" />
      {t('common.tips.loading')}
    </div>
  {:else if dataModels.length === 0}
    <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Icon icon="mdi:database-outline" class="size-12 mb-4 opacity-50" />
      <p>{t('page.ai.dataModel_noModels')}</p>
      <p class="text-sm mt-1">{t('page.ai.dataModel_createHint')}</p>
    </div>
  {:else}
    <Card.Root>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>{t('page.ai.dataModel_name')}</Table.Head>
            <Table.Head>{t('page.ai.dataModel_description')}</Table.Head>
            <Table.Head>{t('page.ai.dataModel_status')}</Table.Head>
            <Table.Head>{t('common.createdAt')}</Table.Head>
            <Table.Head class="text-right">{t('common.actions')}</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each dataModels as model}
            <Table.Row class="cursor-pointer hover:bg-muted/50" onclick={() => openEditSheet(model)}>
              <Table.Cell class="font-medium">{model.name}</Table.Cell>
              <Table.Cell class="text-muted-foreground max-w-xs truncate">
                {model.description || '-'}
              </Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(model.status)}>{getStatusLabel(model.status)}</Badge>
              </Table.Cell>
              <Table.Cell class="text-sm text-muted-foreground">
                {formatDate(model.createdAt)}
              </Table.Cell>
              <Table.Cell class="text-right" onclick={(e: MouseEvent) => e.stopPropagation()}>
                <div class="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onclick={() => openEditSheet(model)} title={t('common.edit')}>
                    <Icon icon="mdi:pencil" class="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onclick={() => handleDelete(model.id)} title={t('common.delete')}>
                    <Icon icon="mdi:delete-outline" class="size-4 text-destructive" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </Card.Root>
  {/if}
  </div>
</div>

<!-- Create Dialog -->
<Dialog.Root bind:open={createDialogOpen}>
  <Dialog.Content class="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
    <Dialog.Header>
      <Dialog.Title>{t('page.ai.dataModel_createTitle')}</Dialog.Title>
      <Dialog.Description>{t('page.ai.dataModel_dialogDesc')}</Dialog.Description>
    </Dialog.Header>
    
    <div class="h-[calc(85vh-200px)]">
      <ScrollArea class="h-full">
        <div class="space-y-4 py-2 pr-4">
          <div class="space-y-2">
            <Label for="name">{t('page.ai.dataModel_name')} *</Label>
            <Input id="name" bind:value={form.name} placeholder={t('page.ai.dataModel_namePlaceholder')} />
          </div>
          
          <div class="space-y-2">
            <Label for="description">{t('page.ai.dataModel_description')}</Label>
            <Input id="description" bind:value={form.description} placeholder={t('page.ai.dataModel_descriptionPlaceholder')} />
          </div>

          <div class="space-y-2">
            <Label for="jsonSchema">{t('page.ai.dataModel_jsonSchema')}</Label>
            <JsonSchemaEditor bind:value={form.jsonSchema} class="border rounded-lg p-3" />
          </div>

          <div class="space-y-2">
            <Label for="status">{t('page.ai.dataModel_status')}</Label>
            <Select.Root type="single" bind:value={form.status}>
              <Select.Trigger class="w-full">
                {STATUS_OPTIONS.find(o => o.value === form.status)?.label() || t('common.select')}
              </Select.Trigger>
              <Select.Content>
                {#each STATUS_OPTIONS as option}
                  <Select.Item value={option.value}>{option.label()}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>

          <div class="space-y-2">
            <Label for="remark">{t('page.ai.dataModel_remark')}</Label>
            <Input id="remark" bind:value={form.remark} placeholder={t('page.ai.dataModel_remarkPlaceholder')} />
          </div>
        </div>
      </ScrollArea>
    </div>
    
    <Dialog.Footer>
      <Button variant="outline" onclick={() => createDialogOpen = false}>{t('common.cancel')}</Button>
      <Button onclick={handleCreate} disabled={saving}>
        {#if saving}
          <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
        {/if}
        {t('common.create')}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Edit Sheet -->
<Sheet.Root bind:open={editSheetOpen}>
  <Sheet.Content side="right" class="w-full sm:max-w-lg flex flex-col">
    <Sheet.Header>
      <Sheet.Title>{t('page.ai.dataModel_editTitle')}</Sheet.Title>
      <Sheet.Description>{t('page.ai.dataModel_dialogDesc')}</Sheet.Description>
    </Sheet.Header>
    
    {#if editingModel}
      <div class="flex-1 overflow-y-auto p-1 space-y-4">
        <div class="space-y-2">
          <Label for="edit-name">{t('page.ai.dataModel_name')} *</Label>
          <Input id="edit-name" bind:value={editForm.name} placeholder={t('page.ai.dataModel_namePlaceholder')} />
        </div>
        
        <div class="space-y-2">
          <Label for="edit-description">{t('page.ai.dataModel_description')}</Label>
          <Input id="edit-description" bind:value={editForm.description} placeholder={t('page.ai.dataModel_descriptionPlaceholder')} />
        </div>

        <div class="space-y-2">
          <Label for="edit-jsonSchema">{t('page.ai.dataModel_jsonSchema')}</Label>
          <JsonSchemaEditor bind:value={editForm.jsonSchema} class="border rounded-lg p-3" />
        </div>

        <div class="space-y-2">
          <Label for="edit-status">{t('page.ai.dataModel_status')}</Label>
          <Select.Root type="single" bind:value={editForm.status}>
            <Select.Trigger class="w-full">
              {STATUS_OPTIONS.find(o => o.value === editForm.status)?.label() || t('common.select')}
            </Select.Trigger>
            <Select.Content>
              {#each STATUS_OPTIONS as option}
                <Select.Item value={option.value}>{option.label()}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>

        <div class="space-y-2">
          <Label for="edit-remark">{t('page.ai.dataModel_remark')}</Label>
          <Input id="edit-remark" bind:value={editForm.remark} placeholder={t('page.ai.dataModel_remarkPlaceholder')} />
        </div>

        <div class="rounded-lg border p-3 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">{t('common.createdAt')}</span>
            <span>{formatDate(editingModel.createdAt)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">{t('common.updatedAt')}</span>
            <span>{formatDate(editingModel.updatedAt)}</span>
          </div>
        </div>
      </div>
      
      <Sheet.Footer class="border-t pt-4">
        <Button variant="outline" onclick={() => editSheetOpen = false}>{t('common.cancel')}</Button>
        <Button onclick={handleUpdate} disabled={editSaving}>
          {#if editSaving}
            <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
          {/if}
          {t('common.save')}
        </Button>
      </Sheet.Footer>
    {/if}
  </Sheet.Content>
</Sheet.Root>
