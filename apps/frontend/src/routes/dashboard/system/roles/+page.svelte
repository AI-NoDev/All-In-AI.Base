<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface RolesPageSnapshot {
    currentPage: number;
    showFilter: boolean;
    selectedIds: string[];
    searchForm: {
      name: string;
      key: string;
      status: string;
      createdAtStart: string;
      createdAtEnd: string;
    };
  }

  let pageState: RolesPageSnapshot = {
    currentPage: 1,
    showFilter: true,
    selectedIds: [],
    searchForm: {
      name: '',
      key: '',
      status: '',
      createdAtStart: '',
      createdAtEnd: '',
    },
  };

  let restoreCallback: ((value: RolesPageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<RolesPageSnapshot> = {
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
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { DataTable, DatePicker } from '$lib/components/common';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import { PostApiSystemRoleQueryFieldEnum, PostApiSystemRoleQueryOrderEnum } from '@qiyu-allinai/api';
  import PermissionDialog from './components/permission-dialog.svelte';
  import MenuDialog from './components/menu-dialog.svelte';

  interface Role {
    id: string;
    name: string;
    key: string;
    sort: string;
    status: string;
    dataScope: string | null;
    createdAt: string;
  }

  let roles = $state<Role[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let dialogOpen = $state(false);
  let editingRole = $state<Role | null>(null);
  let selectedIds = $state<Set<string>>(new Set(pageState.selectedIds));
  let deleting = $state(false);
  let showFilter = $state(pageState.showFilter);
  let currentPage = $state(pageState.currentPage);
  let pageSize = $state(10);
  let total = $state(0);

  // 权限和菜单分配对话框状态
  let permissionDialogOpen = $state(false);
  let menuDialogOpen = $state(false);
  let selectedRole = $state<Role | null>(null);

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

  let form = $state({
    name: '',
    key: '',
    sort: '0',
    status: '0',
    dataScope: '1',
  });

  const statusOptions = [
    { value: '0', label: t('common.status.enabled') },
    { value: '1', label: t('common.status.disabled') },
  ];

  const statusFilterOptions = [
    { value: '', label: t('common.filter.all') },
    { value: '0', label: t('common.status.enabled') },
    { value: '1', label: t('common.status.disabled') },
  ];

  const dataScopeOptions: Array<{ value: string; label: string; variant: 'destructive' | 'default' | 'secondary' | 'outline' }> = [
    { value: '1', label: t('page.system.role.dataScope.all'), variant: 'destructive' },
    { value: '2', label: t('page.system.role.dataScope.custom'), variant: 'default' },
    { value: '3', label: t('page.system.role.dataScope.dept'), variant: 'secondary' },
    { value: '4', label: t('page.system.role.dataScope.deptAndBelow'), variant: 'secondary' },
    { value: '5', label: t('page.system.role.dataScope.self'), variant: 'outline' },
  ];

  const ADMIN_ROLE_KEY = 'admin';

  function isAdminRole(role: Role): boolean {
    return role.key === ADMIN_ROLE_KEY;
  }

  const columns = [
    { key: 'name', title: t('page.system.role.name'), width: 128, render: nameRender },
    { key: 'key', title: t('page.system.role.key'), width: 128, render: keyRender },
    { key: 'sort', title: t('page.system.role.sort'), width: 80 },
    { key: 'dataScope', title: t('page.system.role.dataScope'), width: 160, render: dataScopeRender },
    { key: 'status', title: t('page.system.role.status'), width: 80, render: statusRender },
    { key: 'createdAt', title: t('page.system.role.createdAt'), width: 170, render: dateRender },
    { key: 'id', title: t('page.system.role.actions'), width: 144, align: 'right' as const, fixed: 'right' as const, render: actionsRender },
  ];

  function toggleSelectAll() {
    selectedIds = selectedIds.size === roles.filter(r => !isAdminRole(r)).length ? new Set() : new Set(roles.filter(r => !isAdminRole(r)).map(r => r.id));
  }

  function toggleSelect(id: string) {
    const newSet = new Set(selectedIds);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    selectedIds = newSet;
  }

  async function loadRoles() {
    loading = true;
    selectedIds = new Set();
    try {
      const api = authStore.createApi(true);
      const filter: Record<string, string> = {};
      if (searchForm.name.trim()) filter.name = searchForm.name.trim();
      if (searchForm.key.trim()) filter.key = searchForm.key.trim();
      if (searchForm.status) filter.status = searchForm.status;
      if (searchForm.createdAtStart) filter.createdAtStart = new Date(searchForm.createdAtStart).toISOString();
      if (searchForm.createdAtEnd) filter.createdAtEnd = new Date(searchForm.createdAtEnd + 'T23:59:59').toISOString();

      const res = await api.system.postApiSystemRoleQuery({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        sort: { field: PostApiSystemRoleQueryFieldEnum.Sort, order: PostApiSystemRoleQueryOrderEnum.Asc }
      } as Parameters<typeof api.system.postApiSystemRoleQuery>[0]);
      if (res.data?.data) {
        roles = res.data.data;
        total = res.data.total || roles.length;
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    } finally {
      loading = false;
    }
  }

  function handleSearch() {
    currentPage = 1;
    loadRoles();
  }

  function handleReset() {
    searchForm = { name: '', key: '', status: '', createdAtStart: '', createdAtEnd: '' };
    currentPage = 1;
    loadRoles();
  }

  function openCreate() {
    editingRole = null;
    form = { name: '', key: '', sort: '0', status: '0', dataScope: '1' };
    dialogOpen = true;
  }

  function openEdit(role: Role) {
    editingRole = role;
    form = { name: role.name, key: role.key, sort: role.sort, status: role.status, dataScope: role.dataScope || '1' };
    dialogOpen = true;
  }

  async function handleSave() {
    if (!form.name.trim() || !form.key.trim()) return alert(t('validation.required', { field: t('page.system.role.name') }));
    saving = true;
    try {
      const api = authStore.createApi(true);
      const data = { ...form, sort: String(form.sort) };
      if (editingRole) {
        await api.system.putApiSystemRoleById({ id: editingRole.id }, { data } as any);
      } else {
        await api.system.postApiSystemRole({ data } as any);
      }
      dialogOpen = false;
      loadRoles();
    } catch (err) {
      console.error('Failed to save role:', err);
      alert(t('common.tips.operationFailed'));
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('page.system.role.deleteConfirm'))) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemRoleById({ id });
      loadRoles();
    } catch (err) {
      console.error('Failed to delete role:', err);
      alert(t('common.tips.operationFailed'));
    }
  }

  async function handleBatchDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(t('page.system.role.batchDeleteConfirm', { count: selectedIds.size.toString() }))) return;
    deleting = true;
    try {
      const api = authStore.createApi(true);
      await Promise.all(Array.from(selectedIds).map(id => api.system.deleteApiSystemRoleById({ id })));
      selectedIds = new Set();
      loadRoles();
    } catch (err) {
      console.error('Failed to delete roles:', err);
      alert(t('common.tips.operationFailed'));
    } finally {
      deleting = false;
    }
  }

  function openPermissionDialog(role: Role) {
    selectedRole = role;
    permissionDialogOpen = true;
  }

  function openMenuDialog(role: Role) {
    selectedRole = role;
    menuDialogOpen = true;
  }

  onMount(() => loadRoles());
</script>

{#snippet nameRender({ row })}
  <span class="font-medium">{row.name}</span>
{/snippet}

{#snippet keyRender({ value })}
  <span class="text-muted-foreground">{value}</span>
{/snippet}

{#snippet dataScopeRender({ row })}
  {@const scopeOption = dataScopeOptions.find(o => o.value === row.dataScope)}
  <Badge variant={scopeOption?.variant || 'outline'}>{scopeOption?.label || t('page.system.role.dataScope.notSet')}</Badge>
{/snippet}

{#snippet statusRender({ value })}
  <Badge variant={value === '0' ? 'default' : 'secondary'}>{value === '0' ? t('common.status.enabled') : t('common.status.disabled')}</Badge>
{/snippet}

{#snippet dateRender({ value })}
  <span class="text-muted-foreground">{new Date(String(value)).toLocaleString('zh-CN')}</span>
{/snippet}

{#snippet actionsRender({ row })}
  {@const isAdmin = isAdminRole(row)}
  <div class="flex justify-end gap-1">
    {#if isAdmin}
      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" disabled><Icon icon="tdesign:edit" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>{t('page.system.role.adminNoEdit')}</Tooltip.Content></Tooltip.Root>
      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" disabled><Icon icon="tdesign:lock-on" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>{t('page.system.role.adminHasAllPermissions')}</Tooltip.Content></Tooltip.Root>
      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" disabled><Icon icon="tdesign:menu-application" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>{t('page.system.role.adminHasAllMenus')}</Tooltip.Content></Tooltip.Root>
      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" disabled><Icon icon="tdesign:delete" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>{t('page.system.role.adminNoDelete')}</Tooltip.Content></Tooltip.Root>
    {:else}
      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openEdit(row)}><Icon icon="tdesign:edit" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>{t('common.actions.edit')}</Tooltip.Content></Tooltip.Root>
      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openPermissionDialog(row)}><Icon icon="tdesign:lock-on" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>{t('page.system.role.assignPermission')}</Tooltip.Content></Tooltip.Root>
      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openMenuDialog(row)}><Icon icon="tdesign:menu-application" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>{t('page.system.role.assignMenu')}</Tooltip.Content></Tooltip.Root>
      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => handleDelete(row.id)}><Icon icon="tdesign:delete" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>{t('common.actions.delete')}</Tooltip.Content></Tooltip.Root>
    {/if}
  </div>
{/snippet}

<div class="flex flex-1 min-h-0 flex-col px-4 lg:px-6 pb-4">
  <!-- 搜索表单 -->
  {#if showFilter}
    <div class="py-3 border-b border-border">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.role.name')}</span>
          <Input placeholder={t('common.tips.inputPlaceholder')} class="w-32 h-8" bind:value={searchForm.name} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.role.key')}</span>
          <Input placeholder={t('common.tips.inputPlaceholder')} class="w-32 h-8" bind:value={searchForm.key} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.role.status')}</span>
          <Select.Root type="single" bind:value={searchForm.status}>
            <Select.Trigger class="w-24 h-8">
              {statusFilterOptions.find(o => o.value === searchForm.status)?.label || t('common.filter.all')}
            </Select.Trigger>
            <Select.Content>
              {#each statusFilterOptions as option}
                <Select.Item value={option.value}>{option.label}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.role.createdAt')}</span>
          <DatePicker bind:value={searchForm.createdAtStart} />
          <span class="text-muted-foreground">-</span>
          <DatePicker bind:value={searchForm.createdAtEnd} />
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
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadRoles}><Icon icon="tdesign:refresh" class="size-4" /></Button>
        </div>
      </div>
    </div>
    <div class="flex-1 min-h-0 flex flex-col">
      <DataTable 
        {columns} 
        data={roles} 
        {loading}
        selectable
        {selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        disableSelect={isAdminRole}
      />

      {#if total > 0 && !loading}
        <div class="mt-4 flex items-center justify-between">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.role.totalRecords', { total: total.toString() })}</span>
          <Pagination.Root count={total} perPage={pageSize} bind:page={currentPage} onPageChange={() => loadRoles()}>
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
      <Dialog.Title>{editingRole ? t('page.system.role.editRole') : t('page.system.role.addRole')}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>{t('page.system.role.name')} *</Label>
        <Input bind:value={form.name} placeholder={t('common.tips.inputPlaceholder')} />
      </div>
      <div class="grid gap-2">
        <Label>{t('page.system.role.key')} *</Label>
        <Input bind:value={form.key} placeholder={t('common.tips.inputPlaceholder')} />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>{t('page.system.role.sort')}</Label>
          <Input bind:value={form.sort} type="number" />
        </div>
        <div class="grid gap-2">
          <Label>{t('page.system.role.status')}</Label>
          <Select.Root type="single" bind:value={form.status}>
            <Select.Trigger>{statusOptions.find(o => o.value === form.status)?.label}</Select.Trigger>
            <Select.Content>{#each statusOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
          </Select.Root>
        </div>
      </div>
      <div class="grid gap-2">
        <Label>{t('page.system.role.dataScope')}</Label>
        <Select.Root type="single" bind:value={form.dataScope}>
          <Select.Trigger>{dataScopeOptions.find(o => o.value === form.dataScope)?.label}</Select.Trigger>
          <Select.Content>{#each dataScopeOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
        </Select.Root>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>{t('common.actions.cancel')}</Button>
      <Button onclick={handleSave} disabled={saving}>{saving ? t('common.tips.saving') : t('common.actions.save')}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

{#if selectedRole}
  <PermissionDialog 
    bind:open={permissionDialogOpen}
    roleKey={selectedRole.key}
    roleName={selectedRole.name}
    onClose={() => selectedRole = null}
    onSaved={() => {}}
  />
  <MenuDialog 
    bind:open={menuDialogOpen}
    roleId={selectedRole.id}
    roleName={selectedRole.name}
    onClose={() => selectedRole = null}
    onSaved={() => {}}
  />
{/if}
