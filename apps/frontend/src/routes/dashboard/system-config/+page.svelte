<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { DataTable } from '$lib/components/common';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { PostApiSystemConfigQueryFieldEnum, PostApiSystemConfigQueryOrderEnum } from '@qiyu-allinai/api';

  interface ConfigItem {
    id: string;
    name: string;
    key: string;
    value: string;
    isSystem: boolean;
    createdAt: string;
  }

  let configs = $state<ConfigItem[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let dialogOpen = $state(false);
  let editingConfig = $state<ConfigItem | null>(null);
  let selectedIds = $state<Set<string>>(new Set());
  let deleting = $state(false);
  let showFilter = $state(true);

  let searchForm = $state({
    name: '',
    key: '',
  });

  let form = $state({ name: '', key: '', value: '' });

  const columns = [
    { key: 'name', title: '参数名称', width: 160, render: nameRender },
    { key: 'key', title: '参数键名', width: 200, render: keyRender },
    { key: 'value', title: '参数值', width: 200, render: valueRender },
    { key: 'isSystem', title: '类型', width: 96, render: typeRender },
    { key: 'createdAt', title: '创建时间', width: 170, render: dateRender },
    { key: 'id', title: '操作', width: 112, align: 'right' as const, fixed: 'right' as const, render: actionsRender },
  ];

  let deletableConfigs = $derived(configs.filter(c => !c.isSystem));

  function isSystemConfig(config: ConfigItem): boolean {
    return config.isSystem;
  }

  function toggleSelectAll() {
    if (deletableConfigs.length > 0 && deletableConfigs.every(c => selectedIds.has(c.id))) {
      selectedIds = new Set();
    } else {
      selectedIds = new Set(deletableConfigs.map(c => c.id));
    }
  }

  function toggleSelect(id: string) {
    const config = configs.find(c => c.id === id);
    if (config?.isSystem) return;
    const newSet = new Set(selectedIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    selectedIds = newSet;
  }

  async function loadConfigs() {
    loading = true;
    try {
      const api = authStore.createApi(true);
      const filter: Record<string, string> = {};
      if (searchForm.name.trim()) filter.name = searchForm.name.trim();
      if (searchForm.key.trim()) filter.key = searchForm.key.trim();

      const res = await api.system.postApiSystemConfigQuery({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: 100,
        offset: 0,
        sort: { field: PostApiSystemConfigQueryFieldEnum.CreatedAt, order: PostApiSystemConfigQueryOrderEnum.Desc },
      });
      if (res.data?.data) configs = res.data.data;
    } catch (err) {
      console.error('Failed to load configs:', err);
    } finally {
      loading = false;
    }
  }

  function handleSearch() {
    loadConfigs();
  }

  function handleReset() {
    searchForm = { name: '', key: '' };
    loadConfigs();
  }

  function openCreate() {
    editingConfig = null;
    form = { name: '', key: '', value: '' };
    dialogOpen = true;
  }

  function openEdit(config: ConfigItem) {
    editingConfig = config;
    form = { name: config.name, key: config.key, value: config.value };
    dialogOpen = true;
  }

  async function handleSave() {
    if (!form.name.trim() || !form.key.trim()) return alert('请填写必填项');
    saving = true;
    try {
      const api = authStore.createApi(true);
      if (editingConfig) {
        await api.system.putApiSystemConfigById(
          { id: editingConfig.id },
          { data: { name: form.name, key: form.key, value: form.value } }
        );
      } else {
        await api.system.postApiSystemConfig({
          data: {
            name: form.name,
            key: form.key,
            value: form.value,
            isSystem: false,
            createdBy: '',
            updatedBy: '',
          },
        });
      }
      dialogOpen = false;
      loadConfigs();
    } catch (err) {
      console.error('Failed to save config:', err);
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: string) {
    const config = configs.find(c => c.id === id);
    if (config?.isSystem) {
      alert('系统参数不允许删除');
      return;
    }
    if (!confirm('确定要删除该参数吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemConfigById({ id });
      loadConfigs();
    } catch (err) {
      console.error('Failed to delete config:', err);
      alert('删除失败');
    }
  }

  async function handleBatchDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 个参数吗？`)) return;
    deleting = true;
    try {
      const api = authStore.createApi(true);
      await Promise.all(Array.from(selectedIds).map(id => api.system.deleteApiSystemConfigById({ id })));
      selectedIds = new Set();
      loadConfigs();
    } catch (err) {
      console.error('Failed to delete configs:', err);
      alert('删除失败');
    } finally {
      deleting = false;
    }
  }

  onMount(() => loadConfigs());
</script>

{#snippet nameRender({ value })}
  <span class="font-medium">{value}</span>
{/snippet}

{#snippet keyRender({ value })}
  <code class="text-xs bg-muted px-1 py-0.5 rounded">{value}</code>
{/snippet}

{#snippet valueRender({ value })}
  <span class="max-w-xs truncate block" title={String(value)}>{value}</span>
{/snippet}

{#snippet typeRender({ row })}
  <Badge variant={row.isSystem ? 'default' : 'secondary'}>
    {row.isSystem ? '系统' : '自定义'}
  </Badge>
{/snippet}

{#snippet dateRender({ value })}
  <span class="text-muted-foreground">{new Date(String(value)).toLocaleString('zh-CN')}</span>
{/snippet}

{#snippet actionsRender({ row })}
  <div class="flex justify-end gap-1">
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openEdit(row)}>
      <Icon icon="tdesign:edit" class="size-4" />
    </Button>
    {#if !row.isSystem}
      <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => handleDelete(row.id)}>
        <Icon icon="tdesign:delete" class="size-4" />
      </Button>
    {/if}
  </div>
{/snippet}

<div class="flex flex-1 min-h-0 flex-col px-4 lg:px-6 pb-4">
  <!-- 搜索表单 -->
  {#if showFilter}
    <div class="py-3 border-b border-border">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">参数名称</span>
          <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.name} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">参数键名</span>
          <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.key} />
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
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadConfigs}><Icon icon="tdesign:refresh" class="size-4" /></Button>
        </div>
      </div>
    </div>
    <div class="flex-1 min-h-0 flex flex-col">
      <DataTable 
        {columns} 
        data={configs} 
        {loading}
        selectable
        {selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        disableSelect={isSystemConfig}
      />
    </div>
  </div>
</div>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{editingConfig ? '编辑参数' : '新增参数'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>参数名称 *</Label>
        <Input bind:value={form.name} placeholder="请输入参数名称" />
      </div>
      <div class="grid gap-2">
        <Label>参数键名 *</Label>
        <Input bind:value={form.key} placeholder="请输入参数键名，如 sys.site.name" disabled={!!editingConfig?.isSystem} />
      </div>
      <div class="grid gap-2">
        <Label>参数值</Label>
        <Input bind:value={form.value} placeholder="请输入参数值" />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>取消</Button>
      <Button onclick={handleSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
