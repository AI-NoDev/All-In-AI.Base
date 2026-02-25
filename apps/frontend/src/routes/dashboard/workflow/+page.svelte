<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface Workflow {
    id: string;
    name: string;
    icon: string | null;
    description: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
  }

  interface PageSnapshot {
    workflows: Workflow[];
    searchKeyword: string;
    currentPage: number;
    total: number;
    dataLoaded: boolean;
  }

  let pageState: PageSnapshot = {
    workflows: [],
    searchKeyword: '',
    currentPage: 1,
    total: 0,
    dataLoaded: false,
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
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as Table from '$lib/components/ui/table';
  import * as Dialog from '$lib/components/ui/dialog';
  import { IconPicker } from '$lib/components/common';
  import { t } from '@/lib/stores/i18n.svelte';

  interface WorkflowForm {
    name: string;
    icon: string;
    description: string;
  }

  let workflows = $state<Workflow[]>(pageState.workflows);
  let loading = $state(!pageState.dataLoaded);
  let searchKeyword = $state(pageState.searchKeyword);
  let currentPage = $state(pageState.currentPage);
  let pageSize = $state(10);
  let total = $state(pageState.total);
  let snapshotRestored = $state(pageState.dataLoaded);

  // Register restore callback
  restoreCallback = (value) => {
    workflows = value.workflows;
    searchKeyword = value.searchKeyword;
    currentPage = value.currentPage;
    total = value.total;
    snapshotRestored = value.dataLoaded;
    loading = !value.dataLoaded;
  };

  // Sync state changes back to module-level state for snapshot
  $effect(() => {
    pageState = {
      workflows,
      searchKeyword,
      currentPage,
      total,
      dataLoaded: !loading,
    };
  });

  // 新建对话框状态
  let createDialogOpen = $state(false);
  let creating = $state(false);
  let form = $state<WorkflowForm>({
    name: '',
    icon: '',
    description: '',
  });

  // TODO: 实现加载工作流列表的 API 调用
  async function loadWorkflows() {
    loading = true;
    try {
      // 模拟数据
      workflows = [
        {
          id: '1',
          name: '客服问答工作流',
          icon: 'mdi:robot',
          description: '自动回答客户常见问题',
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: '文档摘要工作流',
          icon: 'mdi:file-document-outline',
          description: '自动生成文档摘要',
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      total = workflows.length;
    } catch (err) {
      console.error('Failed to load workflows:', err);
    } finally {
      loading = false;
    }
  }

  function handleOpenCreateDialog() {
    form = { name: '', icon: '', description: '' };
    createDialogOpen = true;
  }

  async function handleCreate() {
    if (!form.name.trim()) {
      alert(t('validation.required'));
      return;
    }

    creating = true;
    try {
      // TODO: 实现创建 API
      console.log('Create workflow:', form);
      
      // 模拟创建成功后跳转到编辑页
      const newId = crypto.randomUUID();
      createDialogOpen = false;
      goto(`/dashboard/workflow/${newId}`);
    } catch (err) {
      console.error('Failed to create workflow:', err);
      alert(t('common.tips.operationFailed'));
    } finally {
      creating = false;
    }
  }

  function handleEdit(id: string) {
    goto(`/dashboard/workflow/${id}`);
  }

  async function handleDelete(id: string) {
    if (!confirm(t('common.tips.deleteConfirm'))) return;
    // TODO: 实现删除 API
    console.log('Delete workflow:', id);
    loadWorkflows();
  }

  function handleSearch() {
    currentPage = 1;
    loadWorkflows();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString();
  }

  function getStatusLabel(status: string) {
    switch (status) {
      case 'published':
        return t('page.workflow.status.published');
      case 'draft':
        return t('page.workflow.status.draft');
      default:
        return status;
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }

  $effect(() => {
    if (!snapshotRestored) {
      loadWorkflows();
    }
  });
</script>

<div class="flex flex-col gap-4 px-4 lg:px-6 pb-4">
  <!-- 工具栏 -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <Input
        placeholder={t('common.tips.searchPlaceholder')}
        bind:value={searchKeyword}
        class="w-64"
        onkeydown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <Button variant="outline" onclick={handleSearch}>
        <Icon icon="tdesign:search" class="size-4" />
      </Button>
    </div>
    <Button onclick={handleOpenCreateDialog}>
      <Icon icon="tdesign:add" class="mr-1 size-4" />
      {t('page.workflow.create')}
    </Button>
  </div>

  <!-- 表格 -->
  <div class="rounded-md border">
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.Head class="w-[250px]">{t('page.workflow.name')}</Table.Head>
          <Table.Head>{t('page.workflow.description')}</Table.Head>
          <Table.Head class="w-[100px]">{t('common.fields.status')}</Table.Head>
          <Table.Head class="w-[180px]">{t('common.fields.updatedAt')}</Table.Head>
          <Table.Head class="w-[150px] text-right">{t('common.fields.actions')}</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {#if loading}
          <Table.Row>
            <Table.Cell colspan={5} class="text-center py-8">
              <Icon icon="tdesign:loading" class="size-6 animate-spin inline-block" />
            </Table.Cell>
          </Table.Row>
        {:else if workflows.length === 0}
          <Table.Row>
            <Table.Cell colspan={5} class="text-center py-8 text-muted-foreground">
              {t('common.tips.noData')}
            </Table.Cell>
          </Table.Row>
        {:else}
          {#each workflows as workflow}
            <Table.Row>
              <Table.Cell>
                <div class="flex items-center gap-2">
                  {#if workflow.icon}
                    <Icon icon={workflow.icon} class="size-5 text-muted-foreground" />
                  {:else}
                    <Icon icon="tdesign:flow" class="size-5 text-muted-foreground" />
                  {/if}
                  <span class="font-medium">{workflow.name}</span>
                </div>
              </Table.Cell>
              <Table.Cell class="text-muted-foreground">{workflow.description || '-'}</Table.Cell>
              <Table.Cell>
                <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {getStatusClass(workflow.status)}">
                  {getStatusLabel(workflow.status)}
                </span>
              </Table.Cell>
              <Table.Cell class="text-muted-foreground">{formatDate(workflow.updatedAt)}</Table.Cell>
              <Table.Cell class="text-right">
                <div class="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" onclick={() => handleEdit(workflow.id)}>
                    <Icon icon="tdesign:edit" class="size-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onclick={() => handleDelete(workflow.id)}>
                    <Icon icon="tdesign:delete" class="size-4 text-destructive" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          {/each}
        {/if}
      </Table.Body>
    </Table.Root>
  </div>

  <!-- 分页 -->
  {#if total > pageSize}
    <div class="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onclick={() => { currentPage--; loadWorkflows(); }}
      >
        {t('common.pagination.prev')}
      </Button>
      <span class="text-sm text-muted-foreground">
        {currentPage} / {Math.ceil(total / pageSize)}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= Math.ceil(total / pageSize)}
        onclick={() => { currentPage++; loadWorkflows(); }}
      >
        {t('common.pagination.next')}
      </Button>
    </div>
  {/if}
</div>

<!-- 新建工作流对话框 -->
<Dialog.Root bind:open={createDialogOpen}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{t('page.workflow.create')}</Dialog.Title>
      <Dialog.Description>{t('page.workflow.createDescription')}</Dialog.Description>
    </Dialog.Header>
    <div class="flex flex-col gap-4 py-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">
          {t('page.workflow.name')} <span class="text-destructive">*</span>
        </label>
        <Input
          placeholder={t('common.tips.inputPlaceholder')}
          bind:value={form.name}
        />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">{t('page.workflow.icon')}</label>
        <IconPicker bind:value={form.icon} placeholder={t('page.workflow.selectIcon')} />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">{t('page.workflow.description')}</label>
        <Textarea
          placeholder={t('common.tips.inputPlaceholder')}
          bind:value={form.description}
          rows={3}
        />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => createDialogOpen = false} disabled={creating}>
        {t('common.actions.cancel')}
      </Button>
      <Button onclick={handleCreate} disabled={creating}>
        {#if creating}
          <Icon icon="tdesign:loading" class="mr-1 size-4 animate-spin" />
        {/if}
        {t('common.actions.confirm')}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
