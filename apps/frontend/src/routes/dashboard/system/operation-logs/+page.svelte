<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface OperationLogsPageSnapshot {
    currentPage: number;
    showFilter: boolean;
    selectedIds: string[];
    searchForm: {
      title: string;
      name: string;
      status: string;
    };
  }

  let pageState: OperationLogsPageSnapshot = {
    currentPage: 1,
    showFilter: true,
    selectedIds: [],
    searchForm: { title: '', name: '', status: '' },
  };

  let restoreCallback: ((value: OperationLogsPageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<OperationLogsPageSnapshot> = {
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
  import * as Pagination from '$lib/components/ui/pagination';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import { DataTable } from '$lib/components/common';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';

  interface OperationLog {
    id: string;
    title: string;
    businessType: number | null;
    method: string | null;
    requestMethod: string | null;
    type: number | null;
    name: string | null;
    departmentName: string | null;
    url: string | null;
    ip: string | null;
    location: string | null;
    param: string | null;
    jsonResult: string | null;
    status: string | null;
    errorMsg: string | null;
    time: string | null;
    costTime: string | null;
  }

  let logs = $state<OperationLog[]>([]);
  let loading = $state(true);
  let currentPage = $state(pageState.currentPage);
  let pageSize = $state(10);
  let total = $state(0);
  let showFilter = $state(pageState.showFilter);
  let selectedIds = $state<Set<string>>(new Set(pageState.selectedIds));
  let deleting = $state(false);

  // 详情弹窗
  let detailOpen = $state(false);
  let detailLog = $state<OperationLog | null>(null);

  let searchForm = $state({ ...pageState.searchForm });

  // Register restore callback
  restoreCallback = (value) => {
    currentPage = value.currentPage;
    showFilter = value.showFilter;
    selectedIds = new Set(value.selectedIds);
    searchForm = { ...value.searchForm };
  };

  // Sync state changes back to module-level for snapshot
  $effect(() => {
    pageState = {
      currentPage,
      showFilter,
      selectedIds: Array.from(selectedIds),
      searchForm: { ...searchForm },
    };
  });

  let statusOptions = $derived([
    { value: '', label: t('common.tips.all') },
    { value: '0', label: t('common.status.success') },
    { value: '1', label: t('common.status.failed') },
  ]);

  const businessTypeMap: Record<number, string> = {
    0: 'businessTypeOther',
    1: 'businessTypeAdd',
    2: 'businessTypeModify',
    3: 'businessTypeDelete',
    4: 'businessTypeAuth',
    5: 'businessTypeExport',
    6: 'businessTypeImport',
    7: 'businessTypeForceLogout',
    8: 'businessTypeGenCode',
    9: 'businessTypeClearData',
  };

  let columns = $derived([
    { key: 'title', title: t('page.system.systemModule'), width: 128, render: titleRender },
    { key: 'businessType', title: t('page.system.operationType'), width: 96, render: businessTypeRender },
    { key: 'name', title: t('page.system.operator'), width: 96 },
    { key: 'ip', title: t('page.system.ipAddress'), width: 128 },
    { key: 'location', title: t('page.system.operationLocation'), width: 128, render: mutedRender },
    { key: 'status', title: t('common.fields.status'), width: 80, render: statusRender },
    { key: 'time', title: t('page.system.operationTime'), width: 170, render: timeRender },
    { key: 'costTime', title: t('page.system.costTime'), width: 96, render: costTimeRender },
    { key: 'id', title: t('common.fields.actions'), width: 80, align: 'right' as const, fixed: 'right' as const, render: actionsRender },
  ]);

  function toggleSelectAll() {
    if (logs.length > 0 && logs.every(l => selectedIds.has(l.id))) {
      selectedIds = new Set();
    } else {
      selectedIds = new Set(logs.map(l => l.id));
    }
  }

  function toggleSelect(id: string) {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    selectedIds = newSet;
  }

  async function loadLogs() {
    loading = true;
    selectedIds = new Set();
    try {
      const api = authStore.createApi(true);
      const filter: Record<string, string> = {};
      if (searchForm.title.trim()) filter.title = searchForm.title.trim();
      if (searchForm.name.trim()) filter.name = searchForm.name.trim();
      if (searchForm.status) filter.status = searchForm.status;

      const res = await api.system.postApiSystemOperationLogQuery({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        sort: { field: 'time', order: 'desc' },
      } as any);
      if (res.data?.data) {
        logs = res.data.data;
        total = res.data.total || logs.length;
      }
    } catch (err) {
      console.error('Failed to load operation logs:', err);
    } finally {
      loading = false;
    }
  }

  function handleSearch() {
    currentPage = 1;
    loadLogs();
  }

  function handleReset() {
    searchForm = { title: '', name: '', status: '' };
    currentPage = 1;
    loadLogs();
  }

  function handleRefresh() {
    loadLogs();
  }

  function showDetail(log: OperationLog) {
    detailLog = log;
    detailOpen = true;
  }

  async function handleBatchDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(t('page.system.confirmDeleteLogs').replace('${count}', String(selectedIds.size)))) return;
    
    deleting = true;
    try {
      const api = authStore.createApi(true);
      const ids = Array.from(selectedIds);
      await Promise.all(ids.map(id => 
        api.system.deleteApiSystemOperationLogById({ id })
      ));
      selectedIds = new Set();
      loadLogs();
    } catch (err) {
      console.error('Failed to delete:', err);
      alert(t('common.tips.deleteFailed'));
    } finally {
      deleting = false;
    }
  }

  function getStatusBadge(status: string | null) {
    return status === '0' 
      ? { variant: 'default' as const, text: t('common.status.success') }
      : { variant: 'destructive' as const, text: t('common.status.failed') };
  }

  function getBusinessType(type: number | null) {
    if (type === null) return '-';
    const key = businessTypeMap[type] || 'businessTypeOther';
    return t(`page.system.${key}`);
  }

  function formatTime(time: string | null) {
    if (!time) return '-';
    return new Date(time).toLocaleString('zh-CN');
  }

  onMount(() => { loadLogs(); });
</script>

{#snippet titleRender({ value })}
  <span class="font-medium">{value}</span>
{/snippet}

{#snippet businessTypeRender({ row })}
  <Badge variant="outline">{getBusinessType(row.businessType)}</Badge>
{/snippet}

{#snippet mutedRender({ value })}
  <span class="text-muted-foreground">{value || '-'}</span>
{/snippet}

{#snippet statusRender({ row })}
  {@const status = getStatusBadge(row.status)}
  <Badge variant={status.variant}>{status.text}</Badge>
{/snippet}

{#snippet timeRender({ value })}
  <span class="text-muted-foreground">{formatTime(String(value))}</span>
{/snippet}

{#snippet costTimeRender({ value })}
  {value ? `${value}ms` : '-'}
{/snippet}

{#snippet actionsRender({ row })}
  <div class="flex justify-end">
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => showDetail(row)}>
      <Icon icon="tdesign:browse" class="size-4" />
    </Button>
  </div>
{/snippet}

<div class="flex flex-1 min-h-0 flex-col px-4 lg:px-6 pb-4">
  <!-- 搜索表单 -->
  {#if showFilter}
    <div class="py-3 border-b border-border">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.systemModule')}</span>
          <Input placeholder={t('common.tips.inputPlaceholder')} class="w-32 h-8" bind:value={searchForm.title} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.operator')}</span>
          <Input placeholder={t('common.tips.inputPlaceholder')} class="w-32 h-8" bind:value={searchForm.name} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('common.fields.status')}</span>
          <Select.Root type="single" bind:value={searchForm.status}>
            <Select.Trigger class="w-24 h-8">
              {statusOptions.find(o => o.value === searchForm.status)?.label || t('common.tips.all')}
            </Select.Trigger>
            <Select.Content>
              {#each statusOptions as option}
                <Select.Item value={option.value}>{option.label}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        <div class="flex gap-2">
          <Button size="sm" class="h-8" onclick={handleSearch}>
            <Icon icon="tdesign:search" class="mr-1 size-4" />{t('common.actions.search')}
          </Button>
          <Button size="sm" variant="outline" class="h-8" onclick={handleReset}>
            <Icon icon="tdesign:refresh" class="mr-1 size-4" />{t('common.actions.reset')}
          </Button>
        </div>
      </div>
    </div>
  {/if}

  <!-- 列表 -->
  <div class="flex-1 flex flex-col min-h-0 pt-4">
    <div class="pb-1">
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          {#if selectedIds.size > 0}
            <Button size="sm" variant="destructive" onclick={handleBatchDelete} disabled={deleting}>
              {#if deleting}
                <Icon icon="tdesign:loading" class="mr-1 size-4 animate-spin" />
              {:else}
                <Icon icon="tdesign:delete" class="mr-1 size-4" />
              {/if}
              {t('common.actions.delete')}({selectedIds.size})
            </Button>
          {/if}
          <Button size="sm" variant="outline">
            <Icon icon="tdesign:download" class="mr-1 size-4" />{t('common.actions.export')}
          </Button>
        </div>
        <div class="flex gap-1">
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => showFilter = !showFilter}>
            <Icon icon={showFilter ? 'tdesign:filter-clear' : 'tdesign:filter'} class="size-4" />
          </Button>
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={handleRefresh}>
            <Icon icon="tdesign:refresh" class="size-4" />
          </Button>
        </div>
      </div>
    </div>
    <div class="flex-1 min-h-0 flex flex-col pt-2">
      <DataTable 
        {columns} 
        data={logs} 
        {loading}
        selectable
        {selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
      />

      {#if total > 0 && !loading}
        <div class="mt-4 flex items-center justify-between">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.totalRecords').replace('${count}', String(total))}</span>
          <Pagination.Root count={total} perPage={pageSize} bind:page={currentPage} onPageChange={() => loadLogs()}>
            {#snippet children({ pages, currentPage: cp })}
              <Pagination.Content>
                <Pagination.Item><Pagination.PrevButton /></Pagination.Item>
                {#each pages as page (page.key)}
                  {#if page.type === "ellipsis"}
                    <Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
                  {:else}
                    <Pagination.Item>
                      <Pagination.Link {page} isActive={cp === page.value}>{page.value}</Pagination.Link>
                    </Pagination.Item>
                  {/if}
                {/each}
                <Pagination.Item><Pagination.NextButton /></Pagination.Item>
              </Pagination.Content>
            {/snippet}
          </Pagination.Root>
        </div>
      {/if}
    </div>
  </div>
</div>

<!-- 详情弹窗 -->
<Dialog.Root bind:open={detailOpen}>
  <Dialog.Content class="max-w-2xl max-h-[80vh] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>{t('page.system.operationLogDetail')}</Dialog.Title>
    </Dialog.Header>
    {#if detailLog}
      <div class="grid grid-cols-2 gap-4 py-4">
        <div>
          <div class="text-sm text-muted-foreground">{t('page.system.systemModule')}</div>
          <div class="font-medium">{detailLog.title}</div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">{t('page.system.operationType')}</div>
          <Badge variant="outline">{getBusinessType(detailLog.businessType)}</Badge>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">{t('page.system.operator')}</div>
          <div class="font-medium">{detailLog.name || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">{t('page.system.department')}</div>
          <div class="font-medium">{detailLog.departmentName || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">{t('page.system.requestMethod')}</div>
          <div class="font-medium">{detailLog.requestMethod || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">{t('common.fields.status')}</div>
          <Badge variant={getStatusBadge(detailLog.status).variant}>
            {getStatusBadge(detailLog.status).text}
          </Badge>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">{t('page.system.ipAddress')}</div>
          <div class="font-medium">{detailLog.ip || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">{t('page.system.operationLocation')}</div>
          <div class="font-medium">{detailLog.location || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">{t('page.system.operationTime')}</div>
          <div class="font-medium">{formatTime(detailLog.time)}</div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">{t('page.system.costTime')}</div>
          <div class="font-medium">{detailLog.costTime ? `${detailLog.costTime}${t('common.unit.ms')}` : '-'}</div>
        </div>
        <div class="col-span-2">
          <div class="text-sm text-muted-foreground">{t('page.system.requestUrl')}</div>
          <div class="font-medium break-all">{detailLog.url || '-'}</div>
        </div>
        <div class="col-span-2">
          <div class="text-sm text-muted-foreground">{t('page.system.requestMethodName')}</div>
          <div class="font-medium break-all">{detailLog.method || '-'}</div>
        </div>
        <div class="col-span-2">
          <div class="text-sm text-muted-foreground">{t('page.system.requestParams')}</div>
          <pre class="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto max-h-32">{detailLog.param || '-'}</pre>
        </div>
        <div class="col-span-2">
          <div class="text-sm text-muted-foreground">{t('page.system.responseResult')}</div>
          <pre class="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto max-h-32">{detailLog.jsonResult || '-'}</pre>
        </div>
        {#if detailLog.status === '1' && detailLog.errorMsg}
          <div class="col-span-2">
            <div class="text-sm text-muted-foreground">{t('page.system.errorMessage')}</div>
            <pre class="mt-1 p-2 bg-destructive/10 text-destructive rounded text-xs overflow-x-auto max-h-32">{detailLog.errorMsg}</pre>
          </div>
        {/if}
      </div>
    {/if}
    <Dialog.Footer>
      <Button variant="outline" onclick={() => detailOpen = false}>{t('common.actions.close')}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
