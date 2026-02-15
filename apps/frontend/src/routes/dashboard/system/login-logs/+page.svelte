<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface LoginLogsPageSnapshot {
    currentPage: number;
    showFilter: boolean;
    selectedIds: string[];
    searchForm: {
      loginName: string;
      ipaddr: string;
      status: string;
    };
  }

  let pageState: LoginLogsPageSnapshot = {
    currentPage: 1,
    showFilter: true,
    selectedIds: [],
    searchForm: { loginName: '', ipaddr: '', status: '' },
  };

  let restoreCallback: ((value: LoginLogsPageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<LoginLogsPageSnapshot> = {
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
  import * as Table from '$lib/components/ui/table';
  import * as Pagination from '$lib/components/ui/pagination';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { authStore } from '@/lib/stores/auth.svelte';

  interface LoginLog {
    id: string;
    loginName: string | null;
    ipaddr: string | null;
    loginLocation: string | null;
    browser: string | null;
    os: string | null;
    status: string | null;
    msg: string | null;
    loginTime: string | null;
  }

  let logs = $state<LoginLog[]>([]);
  let loading = $state(true);
  let currentPage = $state(pageState.currentPage);
  let pageSize = $state(10);
  let total = $state(0);
  let showFilter = $state(pageState.showFilter);
  let selectedIds = $state<Set<string>>(new Set(pageState.selectedIds));
  let deleting = $state(false);

  // 详情弹窗
  let detailOpen = $state(false);
  let detailLog = $state<LoginLog | null>(null);

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

  const statusOptions = [
    { value: '', label: '全部' },
    { value: '0', label: '成功' },
    { value: '1', label: '失败' },
  ];

  let allSelected = $derived(logs.length > 0 && logs.every(l => selectedIds.has(l.id)));
  let someSelected = $derived(selectedIds.size > 0 && !allSelected);

  function toggleSelectAll() {
    if (allSelected) {
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
      if (searchForm.loginName.trim()) filter.loginName = searchForm.loginName.trim();
      if (searchForm.ipaddr.trim()) filter.ipaddr = searchForm.ipaddr.trim();
      if (searchForm.status) filter.status = searchForm.status;

      const res = await api.system.postApiSystemLoginInfoQuery({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        sort: { field: 'loginTime', order: 'desc' },
      } as any);
      if (res.data?.data) {
        logs = res.data.data;
        total = res.data.total || logs.length;
      }
    } catch (err) {
      console.error('Failed to load login logs:', err);
    } finally {
      loading = false;
    }
  }

  function handleSearch() {
    currentPage = 1;
    loadLogs();
  }

  function handleReset() {
    searchForm = { loginName: '', ipaddr: '', status: '' };
    currentPage = 1;
    loadLogs();
  }

  function handleRefresh() {
    loadLogs();
  }

  function showDetail(log: LoginLog) {
    detailLog = log;
    detailOpen = true;
  }

  async function handleBatchDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 条记录吗？`)) return;
    
    deleting = true;
    try {
      const api = authStore.createApi(true);
      const ids = Array.from(selectedIds);
      await Promise.all(ids.map(id => 
        api.system.deleteApiSystemLoginInfoById({ id })
      ));
      selectedIds = new Set();
      loadLogs();
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('删除失败');
    } finally {
      deleting = false;
    }
  }

  function getStatusBadge(status: string | null) {
    return status === '0' 
      ? { variant: 'default' as const, text: '成功' }
      : { variant: 'destructive' as const, text: '失败' };
  }

  function formatTime(time: string | null) {
    if (!time) return '-';
    return new Date(time).toLocaleString('zh-CN');
  }

  onMount(() => { loadLogs(); });
</script>

<div class="flex flex-1 min-h-0 flex-col px-4 lg:px-6 pb-4">
  <!-- 搜索表单 -->
  {#if showFilter}
    <div class="py-3 border-b border-border">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">登录账号</span>
          <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.loginName} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">IP地址</span>
          <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.ipaddr} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">状态</span>
          <Select.Root type="single" bind:value={searchForm.status}>
            <Select.Trigger class="w-24 h-8">
              {statusOptions.find(o => o.value === searchForm.status)?.label || '全部'}
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
            <Icon icon="tdesign:search" class="mr-1 size-4" />搜索
          </Button>
          <Button size="sm" variant="outline" class="h-8" onclick={handleReset}>
            <Icon icon="tdesign:refresh" class="mr-1 size-4" />重置
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
              删除({selectedIds.size})
            </Button>
          {/if}
          <Button size="sm" variant="outline">
            <Icon icon="tdesign:download" class="mr-1 size-4" />导出
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
      {#if loading}
        <div class="space-y-3">
          {#each [1, 2, 3, 4, 5] as _}
            <Skeleton class="h-12 w-full" />
          {/each}
        </div>
      {:else}
        <div class="flex-1 min-h-0">
          <ScrollArea class="h-full" orientation="both">
          <Table.Root>
            <Table.Header class="sticky top-0 bg-background z-10">
              <Table.Row>
                <Table.Head class="w-12">
                  <Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleSelectAll} />
                </Table.Head>
                <Table.Head class="w-32">登录账号</Table.Head>
                <Table.Head class="w-32">IP地址</Table.Head>
                <Table.Head class="w-40">登录地点</Table.Head>
                <Table.Head class="w-32">浏览器</Table.Head>
                <Table.Head class="w-24">操作系统</Table.Head>
                <Table.Head class="w-20">状态</Table.Head>
                <Table.Head class="w-40">登录时间</Table.Head>
                <Table.Head class="w-20 text-right">操作</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {#each logs as log}
              {@const status = getStatusBadge(log.status)}
              <Table.Row class={selectedIds.has(log.id) ? 'bg-muted/50' : ''}>
                <Table.Cell>
                  <Checkbox checked={selectedIds.has(log.id)} onCheckedChange={() => toggleSelect(log.id)} />
                </Table.Cell>
                <Table.Cell class="font-medium">{log.loginName || '-'}</Table.Cell>
                <Table.Cell>{log.ipaddr || '-'}</Table.Cell>
                <Table.Cell class="text-muted-foreground">{log.loginLocation || '-'}</Table.Cell>
                <Table.Cell>{log.browser || '-'}</Table.Cell>
                <Table.Cell>{log.os || '-'}</Table.Cell>
                <Table.Cell>
                  <Badge variant={status.variant}>{status.text}</Badge>
                </Table.Cell>
                <Table.Cell class="text-muted-foreground">{formatTime(log.loginTime)}</Table.Cell>
                <Table.Cell class="text-right">
                  <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => showDetail(log)}>
                    <Icon icon="tdesign:browse" class="size-4" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            {:else}
              <Table.Row>
                <Table.Cell colspan={9} class="h-24 text-center text-muted-foreground">暂无数据</Table.Cell>
              </Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
        </ScrollArea>
        </div>

        {#if total > 0}
          <div class="mt-4 flex items-center justify-between">
            <span class="text-sm text-muted-foreground whitespace-nowrap">共 {total} 条记录</span>
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
      {/if}
    </div>
  </div>
</div>

<!-- 详情弹窗 -->
<Dialog.Root bind:open={detailOpen}>
  <Dialog.Content class="max-w-lg">
    <Dialog.Header>
      <Dialog.Title>登录日志详情</Dialog.Title>
    </Dialog.Header>
    {#if detailLog}
      <div class="grid grid-cols-2 gap-4 py-4">
        <div>
          <div class="text-sm text-muted-foreground">登录账号</div>
          <div class="font-medium">{detailLog.loginName || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">状态</div>
          <Badge variant={getStatusBadge(detailLog.status).variant}>
            {getStatusBadge(detailLog.status).text}
          </Badge>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">IP地址</div>
          <div class="font-medium">{detailLog.ipaddr || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">登录地点</div>
          <div class="font-medium">{detailLog.loginLocation || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">浏览器</div>
          <div class="font-medium">{detailLog.browser || '-'}</div>
        </div>
        <div>
          <div class="text-sm text-muted-foreground">操作系统</div>
          <div class="font-medium">{detailLog.os || '-'}</div>
        </div>
        <div class="col-span-2">
          <div class="text-sm text-muted-foreground">登录时间</div>
          <div class="font-medium">{formatTime(detailLog.loginTime)}</div>
        </div>
        <div class="col-span-2">
          <div class="text-sm text-muted-foreground">消息</div>
          <div class="font-medium whitespace-pre-wrap">{detailLog.msg || '-'}</div>
        </div>
      </div>
    {/if}
    <Dialog.Footer>
      <Button variant="outline" onclick={() => detailOpen = false}>关闭</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
