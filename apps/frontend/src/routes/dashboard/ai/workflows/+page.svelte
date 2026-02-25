<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface WorkflowsPageSnapshot {
    workflows: Workflow[];
    dataLoaded: boolean;
  }

  interface Workflow {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    graph: WorkflowGraph;
    remark: string | null;
    status: string | null;
    createdAt: string;
    updatedAt: string;
  }

  interface WorkflowGraph {
    nodes: Array<{ id: string; type: string; position: { x: number; y: number }; data: Record<string, unknown> }>;
    edges: Array<{ id: string; source: string; target: string }>;
  }

  let pageState: WorkflowsPageSnapshot = {
    workflows: [],
    dataLoaded: false
  };

  let restoreCallback: ((value: WorkflowsPageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<WorkflowsPageSnapshot> = {
    capture: () => pageState,
    restore: (value) => {
      pageState = value;
      if (restoreCallback) restoreCallback(value);
    }
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Card from '$lib/components/ui/card';
  import * as Sheet from '$lib/components/ui/sheet';
  import { Badge } from '$lib/components/ui/badge';
  import * as Table from '$lib/components/ui/table';
  import * as Select from '$lib/components/ui/select';
  import { toast } from 'svelte-sonner';
  import { IconPicker } from '$lib/components/common';

  interface FormData {
    name: string;
    description: string;
    icon: string;
    remark: string;
    status: string;
  }

  const STATUS_OPTIONS = [
    { value: '0', label: () => t('page.ai.workflow_statusDraft') },
    { value: '1', label: () => t('page.ai.workflow_statusPublished') },
    { value: '2', label: () => t('page.ai.workflow_statusDisabled') },
  ];

  let workflows = $state<Workflow[]>(pageState.workflows);
  let loading = $state(!pageState.dataLoaded);
  let snapshotRestored = $state(pageState.dataLoaded);
  
  // Create Dialog state
  let createDialogOpen = $state(false);
  let saving = $state(false);
  let form = $state<FormData>({ name: '', description: '', icon: '', remark: '', status: '0' });

  // Edit Sheet state
  let editSheetOpen = $state(false);
  let editingWorkflow = $state<Workflow | null>(null);
  let editForm = $state<FormData>({ name: '', description: '', icon: '', remark: '', status: '0' });
  let editSaving = $state(false);

  // Copy state
  let copyingId = $state<string | null>(null);

  // 注册 restore 回调
  restoreCallback = (value) => {
    workflows = value.workflows;
    snapshotRestored = value.dataLoaded;
    loading = !value.dataLoaded;
  };

  // 同步状态到 module-level
  $effect(() => {
    pageState = {
      workflows,
      dataLoaded: !loading && workflows.length >= 0
    };
  });

  async function loadWorkflows() {
    try {
      const api = authStore.createApi(true);
      // Use execute endpoint since workflow routes may not be in generated API client yet
      const res = await api.actions.postApiActionsExecuteByName(
        { name: 'ai.workflow.getByPagination' }, 
        { 
          limit: 100, 
          offset: 0,
          sort: { field: 'createdAt', order: 'desc' }
        }
      );
      if (res.data?.data) workflows = res.data.data as Workflow[];
    } catch (err) {
      console.error('Failed to load workflows:', err);
      toast.error(t('common.tips.loadFailed'));
    } finally {
      loading = false;
    }
  }

  function openCreateDialog() {
    form = { name: '', description: '', icon: '', remark: '', status: '0' };
    createDialogOpen = true;
  }

  function openEditSheet(workflow: Workflow) {
    editingWorkflow = workflow;
    editForm = {
      name: workflow.name,
      description: workflow.description || '',
      icon: workflow.icon || '',
      remark: workflow.remark || '',
      status: workflow.status || '0',
    };
    editSheetOpen = true;
  }

  async function handleCreate() {
    if (!form.name.trim()) {
      toast.error(t('page.ai.workflow_fillRequired'));
      return;
    }
    
    saving = true;
    try {
      const api = authStore.createApi(true);
      await api.actions.postApiActionsExecuteByName(
        { name: 'ai.workflow.create' }, 
        { 
          data: {
            name: form.name,
            description: form.description || null,
            icon: form.icon || null,
            graph: { nodes: [], edges: [] },
            remark: form.remark || null,
            status: form.status,
          }
        }
      );
      
      toast.success(t('common.tips.createSuccess'));
      createDialogOpen = false;
      loadWorkflows();
    } catch (err) {
      console.error('Failed to create:', err);
      toast.error(t('common.tips.createFailed'));
    } finally {
      saving = false;
    }
  }

  async function handleUpdate() {
    if (!editingWorkflow) return;
    if (!editForm.name.trim()) {
      toast.error(t('page.ai.workflow_fillRequired'));
      return;
    }
    
    editSaving = true;
    try {
      const api = authStore.createApi(true);
      await api.actions.postApiActionsExecuteByName(
        { name: 'ai.workflow.update' }, 
        { 
          id: editingWorkflow.id,
          data: {
            name: editForm.name,
            description: editForm.description || null,
            icon: editForm.icon || null,
            remark: editForm.remark || null,
            status: editForm.status,
          }
        }
      );
      
      toast.success(t('common.tips.updateSuccess'));
      editSheetOpen = false;
      loadWorkflows();
    } catch (err) {
      console.error('Failed to update:', err);
      toast.error(t('common.tips.updateFailed'));
    } finally {
      editSaving = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('page.ai.workflow_deleteConfirm'))) return;
    
    try {
      const api = authStore.createApi(true);
      await api.actions.postApiActionsExecuteByName({ name: 'ai.workflow.deleteByPk' }, { id });
      toast.success(t('common.tips.deleteSuccess'));
      loadWorkflows();
    } catch (err) {
      console.error('Failed to delete:', err);
      toast.error(t('common.tips.deleteFailed'));
    }
  }

  async function handleCopy(workflow: Workflow) {
    if (!confirm(t('page.ai.workflow_copyConfirm'))) return;
    
    copyingId = workflow.id;
    try {
      const api = authStore.createApi(true);
      await api.actions.postApiActionsExecuteByName(
        { name: 'ai.workflow.create' },
        {
          data: {
            name: workflow.name + '_副本',
            description: workflow.description,
            icon: workflow.icon,
            graph: workflow.graph,
            remark: workflow.remark,
            status: '0', // 复制后默认为草稿状态
          }
        }
      );
      toast.success(t('common.tips.copySuccess'));
      loadWorkflows();
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error(t('common.tips.copyFailed'));
    } finally {
      copyingId = null;
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('zh-CN');
  }

  function getStatusLabel(status: string | null): string {
    const opt = STATUS_OPTIONS.find(o => o.value === status);
    return opt ? opt.label() : t('page.ai.workflow_statusDraft');
  }

  function getStatusVariant(status: string | null): 'default' | 'secondary' | 'destructive' {
    if (status === '1') return 'default';
    if (status === '2') return 'destructive';
    return 'secondary';
  }

  function goToEditor(id: string) {
    goto(`/dashboard/ai/workflows/${id}`);
  }

  onMount(() => {
    loadWorkflows();
  });
</script>


<div class="flex flex-1 flex-col min-h-0 px-4 lg:px-6 pb-4">
  <div class="py-3 flex items-center justify-between border-b border-border">
    <div class="flex gap-2">
      <Button size="sm" onclick={openCreateDialog}>
        <Icon icon="mdi:plus" class="mr-1 size-4" />{t('page.ai.workflow_addWorkflow')}
      </Button>
    </div>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadWorkflows}>
      <Icon icon="mdi:refresh" class="size-4" />
    </Button>
  </div>

  <div class="flex-1 min-h-0 pt-4">
  {#if loading}
    <div class="flex items-center justify-center py-12 text-muted-foreground">
      <Icon icon="mdi:loading" class="size-6 animate-spin mr-2" />
      {t('common.tips.loading')}
    </div>
  {:else if workflows.length === 0}
    <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Icon icon="mdi:sitemap-outline" class="size-12 mb-4 opacity-50" />
      <p>{t('page.ai.workflow_noWorkflows')}</p>
      <p class="text-sm mt-1">{t('page.ai.workflow_createHint')}</p>
    </div>
  {:else}
    <Card.Root>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>{t('page.ai.workflow_name')}</Table.Head>
            <Table.Head>{t('page.ai.workflow_description')}</Table.Head>
            <Table.Head>{t('page.ai.workflow_nodes')}</Table.Head>
            <Table.Head>{t('page.ai.workflow_status')}</Table.Head>
            <Table.Head>{t('common.fields.createdAt')}</Table.Head>
            <Table.Head class="text-right">{t('common.fields.actions')}</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each workflows as workflow}
            <Table.Row class="cursor-pointer hover:bg-muted/50" onclick={() => openEditSheet(workflow)}>
              <Table.Cell class="font-medium">
                <div class="flex items-center gap-2">
                  {#if workflow.icon}
                    <Icon icon={workflow.icon} class="size-4" />
                  {/if}
                  {workflow.name}
                </div>
              </Table.Cell>
              <Table.Cell class="text-muted-foreground max-w-xs truncate">
                {workflow.description || '-'}
              </Table.Cell>
              <Table.Cell class="text-sm text-muted-foreground">
                {workflow.graph?.nodes?.length || 0}
              </Table.Cell>
              <Table.Cell>
                <Badge variant={getStatusVariant(workflow.status)}>{getStatusLabel(workflow.status)}</Badge>
              </Table.Cell>
              <Table.Cell class="text-sm text-muted-foreground">
                {formatDate(workflow.createdAt)}
              </Table.Cell>
              <Table.Cell class="text-right" onclick={(e: MouseEvent) => e.stopPropagation()}>
                <div class="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onclick={() => goToEditor(workflow.id)} title={t('page.ai.workflow_editFlow')}>
                    <Icon icon="mdi:sitemap" class="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onclick={() => handleCopy(workflow)} disabled={copyingId === workflow.id} title={t('common.actions.copy')}>
                    {#if copyingId === workflow.id}
                      <Icon icon="mdi:loading" class="size-4 animate-spin" />
                    {:else}
                      <Icon icon="mdi:content-copy" class="size-4" />
                    {/if}
                  </Button>
                  <Button variant="ghost" size="icon" onclick={() => openEditSheet(workflow)} title={t('common.actions.edit')}>
                    <Icon icon="mdi:pencil" class="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onclick={() => handleDelete(workflow.id)} title={t('common.actions.delete')}>
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
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{t('page.ai.workflow_createTitle')}</Dialog.Title>
      <Dialog.Description>{t('page.ai.workflow_dialogDesc')}</Dialog.Description>
    </Dialog.Header>
    
    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="name">{t('page.ai.workflow_name')} *</Label>
        <Input id="name" bind:value={form.name} placeholder={t('page.ai.workflow_namePlaceholder')} />
      </div>
      
      <div class="space-y-2">
        <Label for="description">{t('page.ai.workflow_description')}</Label>
        <Input id="description" bind:value={form.description} placeholder={t('page.ai.workflow_descriptionPlaceholder')} />
      </div>

      <div class="space-y-2">
        <Label for="icon">{t('page.ai.workflow_icon')}</Label>
        <IconPicker bind:value={form.icon} placeholder={t('page.ai.workflow_iconPlaceholder')} />
      </div>

      <div class="space-y-2">
        <Label for="status">{t('page.ai.workflow_status')}</Label>
        <Select.Root type="single" bind:value={form.status}>
          <Select.Trigger class="w-full">
            {STATUS_OPTIONS.find(o => o.value === form.status)?.label() || t('common.tips.selectPlaceholder')}
          </Select.Trigger>
          <Select.Content>
            {#each STATUS_OPTIONS as option}
              <Select.Item value={option.value}>{option.label()}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="space-y-2">
        <Label for="remark">{t('page.ai.workflow_remark')}</Label>
        <Input id="remark" bind:value={form.remark} placeholder={t('page.ai.workflow_remarkPlaceholder')} />
      </div>
    </div>
    
    <Dialog.Footer>
      <Button variant="outline" onclick={() => createDialogOpen = false}>{t('common.actions.cancel')}</Button>
      <Button onclick={handleCreate} disabled={saving}>
        {#if saving}
          <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
        {/if}
        {t('common.actions.create')}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Edit Sheet -->
<Sheet.Root bind:open={editSheetOpen}>
  <Sheet.Content side="right" class="w-full sm:max-w-lg flex flex-col">
    <Sheet.Header>
      <Sheet.Title>{t('page.ai.workflow_editTitle')}</Sheet.Title>
      <Sheet.Description>{t('page.ai.workflow_dialogDesc')}</Sheet.Description>
    </Sheet.Header>
    
    {#if editingWorkflow}
      <div class="flex-1 overflow-y-auto p-1 space-y-4">
        <div class="space-y-2">
          <Label for="edit-name">{t('page.ai.workflow_name')} *</Label>
          <Input id="edit-name" bind:value={editForm.name} placeholder={t('page.ai.workflow_namePlaceholder')} />
        </div>
        
        <div class="space-y-2">
          <Label for="edit-description">{t('page.ai.workflow_description')}</Label>
          <Input id="edit-description" bind:value={editForm.description} placeholder={t('page.ai.workflow_descriptionPlaceholder')} />
        </div>

        <div class="space-y-2">
          <Label for="edit-icon">{t('page.ai.workflow_icon')}</Label>
          <IconPicker bind:value={editForm.icon} placeholder={t('page.ai.workflow_iconPlaceholder')} />
        </div>

        <div class="space-y-2">
          <Label for="edit-status">{t('page.ai.workflow_status')}</Label>
          <Select.Root type="single" bind:value={editForm.status}>
            <Select.Trigger class="w-full">
              {STATUS_OPTIONS.find(o => o.value === editForm.status)?.label() || t('common.tips.selectPlaceholder')}
            </Select.Trigger>
            <Select.Content>
              {#each STATUS_OPTIONS as option}
                <Select.Item value={option.value}>{option.label()}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>

        <div class="space-y-2">
          <Label for="edit-remark">{t('page.ai.workflow_remark')}</Label>
          <Input id="edit-remark" bind:value={editForm.remark} placeholder={t('page.ai.workflow_remarkPlaceholder')} />
        </div>

        <!-- Workflow Stats -->
        <div class="rounded-lg border p-3 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">{t('page.ai.workflow_nodes')}</span>
            <span>{editingWorkflow.graph?.nodes?.length || 0}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">{t('page.ai.workflow_edges')}</span>
            <span>{editingWorkflow.graph?.edges?.length || 0}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">{t('common.fields.createdAt')}</span>
            <span>{formatDate(editingWorkflow.createdAt)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">{t('common.fields.updatedAt')}</span>
            <span>{formatDate(editingWorkflow.updatedAt)}</span>
          </div>
        </div>
      </div>
      
      <Sheet.Footer class="border-t pt-4">
        <Button variant="outline" onclick={() => editSheetOpen = false}>{t('common.actions.cancel')}</Button>
        <Button onclick={handleUpdate} disabled={editSaving}>
          {#if editSaving}
            <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
          {/if}
          {t('common.actions.save')}
        </Button>
      </Sheet.Footer>
    {/if}
  </Sheet.Content>
</Sheet.Root>
