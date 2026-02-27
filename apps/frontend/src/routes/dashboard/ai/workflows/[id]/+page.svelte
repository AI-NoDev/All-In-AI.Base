<script lang="ts" module>
  import type { Snapshot } from './$types';
  import type { WorkflowGraph } from '$lib/components/workflow';

  interface WorkflowSnapshot {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    graph: WorkflowGraph;
    remark: string | null;
    status: string | null;
  }

  interface PageSnapshot {
    workflow: WorkflowSnapshot | null;
    isDirty: boolean;
  }

  let pageState: PageSnapshot = {
    workflow: null,
    isDirty: false
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
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { toast } from 'svelte-sonner';
  import { WorkflowEditor } from '$lib/components/workflow';
  import { IconPicker } from '$lib/components/common';

  interface Workflow {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    graph: WorkflowGraph;
    remark: string | null;
    status: string | null;
  }

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

  let workflow = $state<Workflow | null>(pageState.workflow);
  let loading = $state(pageState.workflow === null);
  let saving = $state(false);
  let isDirty = $state(pageState.isDirty);
  let snapshotRestored = $state(pageState.workflow !== null);

  // Editor 组件引用
  let editorRef = $state<{ getCurrentGraph: () => WorkflowGraph; markAsSaved: () => void } | null>(null);

  // Edit Dialog state
  let editDialogOpen = $state(false);
  let editForm = $state<FormData>({ name: '', description: '', icon: '', remark: '', status: '0' });
  let editSaving = $state(false);

  const workflowId = $derived(page.params.id);

  // 注册 restore 回调
  restoreCallback = (value) => {
    // 只有当快照的 workflow ID 与当前路由 ID 匹配时才恢复
    if (value.workflow && value.workflow.id === workflowId) {
      workflow = value.workflow;
      isDirty = value.isDirty;
      snapshotRestored = true;
      loading = false;
    } else {
      // ID 不匹配，清空快照状态，重新加载
      pageState = { workflow: null, isDirty: false };
      snapshotRestored = false;
    }
  };

  // 同步状态到 module-level 用于快照捕获
  $effect(() => {
    // 获取编辑器的当前 graph 状态
    const currentGraph = editorRef?.getCurrentGraph();
    pageState = {
      workflow: workflow ? { ...workflow, graph: currentGraph ?? workflow.graph } : null,
      isDirty
    };
  });

  onMount(() => {
    // 检查快照的 workflow ID 是否与当前路由 ID 匹配
    if (snapshotRestored && pageState.workflow?.id !== workflowId) {
      // ID 不匹配，需要重新加载
      snapshotRestored = false;
      workflow = null;
      pageState = { workflow: null, isDirty: false };
    }
    
    // 只有没有从快照恢复时才加载数据
    if (!snapshotRestored && workflowId) {
      loadWorkflow();
    }
  });

  async function loadWorkflow() {
    loading = true;
    isDirty = false;
    
    try {
      const api = authStore.createApi(true);
      const res = await api.actions.postApiActionsExecuteByName(
        { name: 'ai.workflow.getByPk' },
        { id: workflowId }
      );
      if (res.data) {
        workflow = res.data as Workflow;
      }
    } catch (err) {
      console.error('Failed to load workflow:', err);
      toast.error(t('common.tips.loadFailed'));
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    if (!workflow || !editorRef) return;
    
    saving = true;
    try {
      const api = authStore.createApi(true);
      const currentGraph = editorRef.getCurrentGraph();
      await api.actions.postApiActionsExecuteByName(
        { name: 'ai.workflow.update' },
        {
          id: workflow.id,
          data: { graph: currentGraph }
        }
      );
      toast.success(t('common.tips.saveSuccess'));
      // 标记为已保存，重置脏状态
      editorRef.markAsSaved();
      isDirty = false;
      // 更新 workflow 的 graph 以同步
      workflow = { ...workflow, graph: currentGraph };
    } catch (err) {
      console.error('Failed to save workflow:', err);
      toast.error(t('common.tips.saveFailed'));
    } finally {
      saving = false;
    }
  }

  function handleGraphChange(dirty: boolean) {
    isDirty = dirty;
  }

  function openEditDialog() {
    if (!workflow) return;
    editForm = {
      name: workflow.name,
      description: workflow.description || '',
      icon: workflow.icon || '',
      remark: workflow.remark || '',
      status: workflow.status || '0',
    };
    editDialogOpen = true;
  }

  async function handleUpdateInfo() {
    if (!workflow) return;
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
          id: workflow.id,
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
      editDialogOpen = false;
      await loadWorkflow();
    } catch (err) {
      console.error('Failed to update:', err);
      toast.error(t('common.tips.updateFailed'));
    } finally {
      editSaving = false;
    }
  }

  function goBack() {
    goto('/dashboard/ai/workflows');
  }
</script>

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="flex items-center gap-3 px-4 py-3 border-b bg-background">
    <Button variant="ghost" size="icon" onclick={goBack}>
      <Icon icon="mdi:arrow-left" class="size-5" />
    </Button>
    
    {#if workflow}
      <div class="flex items-center gap-2">
        {#if workflow.icon}
          <Icon icon={workflow.icon} class="size-5" />
        {/if}
        <h1 class="text-lg font-semibold">{workflow.name}</h1>
        {#if workflow.description}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Icon icon="mdi:information-outline" class="size-4 text-muted-foreground cursor-help" />
            </Tooltip.Trigger>
            <Tooltip.Content side="bottom" class="max-w-xs">
              <p class="text-sm">{workflow.description}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        {/if}
      </div>
    {:else}
      <h1 class="text-lg font-semibold">{t('page.ai.workflow_editTitle')}</h1>
    {/if}

    <div class="flex-1" />

    {#if workflow}
      <Button variant="outline" size="sm" onclick={openEditDialog}>
        <Icon icon="mdi:pencil" class="mr-1 size-4" />
        {t('page.ai.workflow_editInfo')}
      </Button>
      <Button onclick={handleSave} disabled={saving}>
        {#if saving}
          <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
        {:else}
          <!-- 脏状态指示器 -->
          <span class="mr-2 size-2 rounded-full {isDirty ? 'bg-red-500' : 'bg-green-500'}"></span>
        {/if}
        {t('common.actions.save')}
      </Button>
    {/if}
  </div>

  <!-- Editor -->
  <div class="flex-1 min-h-0">
    {#if loading}
      <div class="flex items-center justify-center h-full text-muted-foreground">
        <Icon icon="mdi:loading" class="size-6 animate-spin mr-2" />
        {t('common.tips.loading')}
      </div>
    {:else if workflow}
      {#key workflow.id}
        <WorkflowEditor
          bind:this={editorRef}
          initialGraph={workflow.graph}
          onGraphChange={handleGraphChange}
        />
      {/key}
    {:else}
      <div class="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Icon icon="mdi:alert-circle-outline" class="size-12 mb-4 opacity-50" />
        <p>{t('common.tips.noData')}</p>
      </div>
    {/if}
  </div>
</div>

<!-- Edit Info Dialog -->
<Dialog.Root bind:open={editDialogOpen}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{t('page.ai.workflow_editTitle')}</Dialog.Title>
      <Dialog.Description>{t('page.ai.workflow_dialogDesc')}</Dialog.Description>
    </Dialog.Header>
    
    <div class="space-y-4">
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
    </div>
    
    <Dialog.Footer>
      <Button variant="outline" onclick={() => editDialogOpen = false}>{t('common.actions.cancel')}</Button>
      <Button onclick={handleUpdateInfo} disabled={editSaving}>
        {#if editSaving}
          <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
        {/if}
        {t('common.actions.save')}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
