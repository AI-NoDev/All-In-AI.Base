<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface PostsPageSnapshot {
    currentPage: number;
    showFilter: boolean;
    selectedIds: string[];
    searchForm: {
      code: string;
      name: string;
    };
  }

  let pageState: PostsPageSnapshot = {
    currentPage: 1,
    showFilter: true,
    selectedIds: [],
    searchForm: { code: '', name: '' },
  };

  let restoreCallback: ((value: PostsPageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<PostsPageSnapshot> = {
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
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import * as Pagination from '$lib/components/ui/pagination';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { DataTable } from '$lib/components/common';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { PostApiSystemPostQueryFieldEnum, PostApiSystemPostQueryOrderEnum } from '@qiyu-allinai/api';

  interface Post {
    id: string;
    code: string;
    name: string;
    sort: string;
    status: string;
    createdAt: string;
  }

  let posts = $state<Post[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let dialogOpen = $state(false);
  let editingPost = $state<Post | null>(null);
  let selectedIds = $state<Set<string>>(new Set(pageState.selectedIds));
  let deleting = $state(false);
  let showFilter = $state(pageState.showFilter);
  let currentPage = $state(pageState.currentPage);
  let pageSize = $state(10);
  let total = $state(0);

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

  let form = $state({ code: '', name: '', sort: '0', status: '0' });

  const statusOptions = [
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];

  let allSelected = $derived(posts.length > 0 && posts.every(p => selectedIds.has(p.id)));

  function toggleSelectAll() {
    selectedIds = allSelected ? new Set() : new Set(posts.map(p => p.id));
  }

  function toggleSelect(id: string) {
    const newSet = new Set(selectedIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    selectedIds = newSet;
  }

  const columns = [
    { key: 'code', title: '岗位编码', width: 160, render: codeRender },
    { key: 'name', title: '岗位名称', width: 160 },
    { key: 'sort', title: '排序', width: 80 },
    { key: 'status', title: '状态', width: 80, render: statusRender },
    { key: 'createdAt', title: '创建时间', width: 170, render: dateRender },
    { key: 'id', title: '操作', width: 112, align: 'right' as const, fixed: 'right' as const, render: actionsRender },
  ];

  async function loadPosts() {
    loading = true;
    selectedIds = new Set();
    try {
      const api = authStore.createApi(true);
      const filter: Record<string, string> = {};
      if (searchForm.code.trim()) filter.code = searchForm.code.trim();
      if (searchForm.name.trim()) filter.name = searchForm.name.trim();

      const res = await api.system.postApiSystemPostQuery({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        sort: { field: PostApiSystemPostQueryFieldEnum.Sort, order: PostApiSystemPostQueryOrderEnum.Asc }
      } as Parameters<typeof api.system.postApiSystemPostQuery>[0]);
      if (res.data?.data) {
        posts = res.data.data;
        total = res.data.total || posts.length;
      }
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      loading = false;
    }
  }

  function handleSearch() {
    currentPage = 1;
    loadPosts();
  }

  function handleReset() {
    searchForm = { code: '', name: '' };
    currentPage = 1;
    loadPosts();
  }

  function openCreate() {
    editingPost = null;
    form = { code: '', name: '', sort: '0', status: '0' };
    dialogOpen = true;
  }

  function openEdit(post: Post) {
    editingPost = post;
    form = { code: post.code, name: post.name, sort: post.sort, status: post.status };
    dialogOpen = true;
  }

  async function handleSave() {
    if (!form.code.trim() || !form.name.trim()) return alert('请填写必填项');
    saving = true;
    try {
      const api = authStore.createApi(true);
      const data = { ...form, sort: String(form.sort) };
      if (editingPost) {
        await api.system.putApiSystemPostById({ id: editingPost.id }, { data } as any);
      } else {
        await api.system.postApiSystemPost({ data } as any);
      }
      dialogOpen = false;
      loadPosts();
    } catch (err) {
      console.error('Failed to save post:', err);
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除该岗位吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemPostById({ id });
      loadPosts();
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('删除失败');
    }
  }

  async function handleBatchDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 个岗位吗？`)) return;
    deleting = true;
    try {
      const api = authStore.createApi(true);
      await Promise.all(Array.from(selectedIds).map(id => api.system.deleteApiSystemPostById({ id })));
      selectedIds = new Set();
      loadPosts();
    } catch (err) {
      console.error('Failed to delete posts:', err);
      alert('删除失败');
    } finally {
      deleting = false;
    }
  }

  onMount(() => loadPosts());
</script>

{#snippet codeRender({ value })}
  <span class="font-medium">{value}</span>
{/snippet}

{#snippet statusRender({ value })}
  <Badge variant={value === '0' ? 'default' : 'secondary'}>{value === '0' ? '正常' : '停用'}</Badge>
{/snippet}

{#snippet dateRender({ value })}
  <span class="text-muted-foreground">{new Date(String(value)).toLocaleString('zh-CN')}</span>
{/snippet}

{#snippet actionsRender({ row })}
  <div class="flex justify-end gap-1">
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openEdit(row)}><Icon icon="tdesign:edit" class="size-4" /></Button>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => handleDelete(row.id)}><Icon icon="tdesign:delete" class="size-4" /></Button>
  </div>
{/snippet}

<div class="flex flex-1 min-h-0 flex-col px-4 lg:px-6 pb-4">
  <!-- 搜索表单 -->
  {#if showFilter}
    <div class="py-3 border-b border-border">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">岗位编码</span>
          <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.code} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">岗位名称</span>
          <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.name} />
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

  <div class="flex-1 flex flex-col min-h-0 pt-4">
    <div class="pb-3">
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <Button size="sm" onclick={openCreate}><Icon icon="tdesign:add" class="mr-1 size-4" />新增</Button>
          {#if selectedIds.size > 0}
            <Button size="sm" variant="destructive" onclick={handleBatchDelete} disabled={deleting}>
              <Icon icon={deleting ? 'tdesign:loading' : 'tdesign:delete'} class="mr-1 size-4 {deleting ? 'animate-spin' : ''}" />删除({selectedIds.size})
            </Button>
          {/if}
        </div>
        <div class="flex gap-1">
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => showFilter = !showFilter}>
            <Icon icon={showFilter ? 'tdesign:filter-clear' : 'tdesign:filter'} class="size-4" />
          </Button>
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadPosts}><Icon icon="tdesign:refresh" class="size-4" /></Button>
        </div>
      </div>
    </div>
    <div class="flex-1 min-h-0 flex flex-col">
      <DataTable 
        {columns} 
        data={posts} 
        {loading}
        selectable
        {selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
      />

      {#if total > 0 && !loading}
        <div class="mt-4 flex items-center justify-between">
          <span class="text-sm text-muted-foreground whitespace-nowrap">共 {total} 条记录</span>
          <Pagination.Root count={total} perPage={pageSize} bind:page={currentPage} onPageChange={() => loadPosts()}>
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

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{editingPost ? '编辑岗位' : '新增岗位'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>岗位编码 *</Label>
        <Input bind:value={form.code} placeholder="请输入岗位编码" />
      </div>
      <div class="grid gap-2">
        <Label>岗位名称 *</Label>
        <Input bind:value={form.name} placeholder="请输入岗位名称" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>排序</Label>
          <Input bind:value={form.sort} type="number" />
        </div>
        <div class="grid gap-2">
          <Label>状态</Label>
          <Select.Root type="single" bind:value={form.status}>
            <Select.Trigger>{statusOptions.find(o => o.value === form.status)?.label}</Select.Trigger>
            <Select.Content>{#each statusOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
          </Select.Root>
        </div>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>取消</Button>
      <Button onclick={handleSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
