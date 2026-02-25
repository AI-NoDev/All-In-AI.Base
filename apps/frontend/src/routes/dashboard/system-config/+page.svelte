<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface ConfigItem {
    id: string;
    name: string;
    key: string;
    value: string;
    isSystem: boolean;
    createdAt: string;
  }

  interface PageSnapshot {
    configs: ConfigItem[];
    searchForm: { name: string; key: string };
    dataLoaded: boolean;
  }

  let pageState: PageSnapshot = {
    configs: [],
    searchForm: { name: '', key: '' },
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
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { DataTable } from '$lib/components/common';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import { PostApiSystemConfigQueryFieldEnum, PostApiSystemConfigQueryOrderEnum } from '@qiyu-allinai/api';

  let configs = $state<ConfigItem[]>(pageState.configs);
  let loading = $state(!pageState.dataLoaded);
  let saving = $state(false);
  let dialogOpen = $state(false);
  let editingConfig = $state<ConfigItem | null>(null);
  let selectedIds = $state<Set<string>>(new Set());
  let deleting = $state(false);
  let showFilter = $state(true);
  let snapshotRestored = $state(pageState.dataLoaded);

  let searchForm = $state({ ...pageState.searchForm });

  // Register restore callback
  restoreCallback = (value) => {
    configs = value.configs;
    searchForm = { ...value.searchForm };
    snapshotRestored = value.dataLoaded;
    loading = !value.dataLoaded;
  };

  // Sync state to module-level for snapshot
  $effect(() => {
    pageState = {
      configs,
      searchForm: { ...searchForm },
      dataLoaded: !loading
    };
  });

  let form = $state({ name: '', key: '', value: '' });

  const columns = $derived([
    { key: 'name', title: t('page.system.config_paramName'), width: 160, render: nameRender },
    { key: 'key', title: t('page.system.config_paramKey'), width: 200, render: keyRender },
    { key: 'value', title: t('page.system.config_paramValue'), width: 200, render: valueRender },
    { key: 'isSystem', title: t('page.system.config_paramType'), width: 96, render: typeRender },
    { key: 'createdAt', title: t('common.fields.createdAt'), width: 170, render: dateRender },
    { key: 'id', title: t('common.actions.more'), width: 112, align: 'right' as const, fixed: 'right' as const, render: actionsRender },
  ]);

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
    if (!form.name.trim() || !form.key.trim()) return alert(t('validation.required', '请填写必填项'));
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
      alert(t('common.tips.operationFailed'));
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: string) {
    const config = configs.find(c => c.id === id);
    if (config?.isSystem) {
      alert(t('page.system.config_system') + t('common.tips.confirmDelete'));
      return;
    }
    if (!confirm(t('common.tips.confirmDelete'))) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemConfigById({ id });
      loadConfigs();
    } catch (err) {
      console.error('Failed to delete config:', err);
      alert(t('common.tips.operationFailed'));
    }
  }

  async function handleBatchDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(t('common.tips.confirmDelete'))) return;
    deleting = true;
    try {
      const api = authStore.createApi(true);
      await Promise.all(Array.from(selectedIds).map(id => api.system.deleteApiSystemConfigById({ id })));
      selectedIds = new Set();
      loadConfigs();
    } catch (err) {
      console.error('Failed to delete configs:', err);
      alert(t('common.tips.operationFailed'));
    } finally {
      deleting = false;
    }
  }

  onMount(() => {
    if (!snapshotRestored) {
      loadConfigs();
    }
  });
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
    {row.isSystem ? t('page.system.config_system') : t('page.system.config_custom')}
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
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.config_paramName')}</span>
          <Input placeholder={t('common.tips.inputPlaceholder')} class="w-32 h-8" bind:value={searchForm.name} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.config_paramKey')}</span>
          <Input placeholder={t('common.tips.inputPlaceholder')} class="w-32 h-8" bind:value={searchForm.key} />
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

  <div class="flex-1 flex flex-col min-h-0 pt-4">
    <div class="pb-3">
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <Button size="sm" onclick={openCreate}><Icon icon="tdesign:add" class="mr-1 size-4" />{t('common.actions.add')}</Button>
          {#if selectedIds.size > 0}
            <Button size="sm" variant="destructive" onclick={handleBatchDelete} disabled={deleting}>
              <Icon icon={deleting ? 'tdesign:loading' : 'tdesign:delete'} class="mr-1 size-4 {deleting ? 'animate-spin' : ''}" />{t('common.actions.delete')}({selectedIds.size})
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
      <Dialog.Title>{editingConfig ? t('page.system.config_editParam') : t('page.system.config_addParam')}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>{t('page.system.config_paramName')} *</Label>
        <Input bind:value={form.name} placeholder={t('common.tips.inputPlaceholder')} />
      </div>
      <div class="grid gap-2">
        <Label>{t('page.system.config_paramKey')} *</Label>
        <Input bind:value={form.key} placeholder={t('page.system.config_keyPlaceholder')} disabled={!!editingConfig?.isSystem} />
      </div>
      <div class="grid gap-2">
        <Label>{t('page.system.config_paramValue')}</Label>
        <Input bind:value={form.value} placeholder={t('common.tips.inputPlaceholder')} />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>{t('common.actions.cancel')}</Button>
      <Button onclick={handleSave} disabled={saving}>{saving ? t('common.tips.saving') : t('common.actions.save')}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
