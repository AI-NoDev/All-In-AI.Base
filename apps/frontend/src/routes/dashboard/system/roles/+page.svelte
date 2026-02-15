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
  import * as Table from '$lib/components/ui/table';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import * as Pagination from '$lib/components/ui/pagination';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { authStore } from '@/lib/stores/auth.svelte';
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
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];

  const statusFilterOptions = [
    { value: '', label: '全部' },
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];

  const dataScopeOptions: Array<{ value: string; label: string; variant: 'destructive' | 'default' | 'secondary' | 'outline' }> = [
    { value: '1', label: '全部数据权限', variant: 'destructive' },
    { value: '2', label: '自定义数据权限', variant: 'default' },
    { value: '3', label: '本部门数据权限', variant: 'secondary' },
    { value: '4', label: '本部门及以下数据权限', variant: 'secondary' },
    { value: '5', label: '仅本人数据权限', variant: 'outline' },
  ];

  const ADMIN_ROLE_KEY = 'admin';

  function isAdminRole(role: Role): boolean {
    return role.key === ADMIN_ROLE_KEY;
  }

  let allSelected = $derived(roles.length > 0 && roles.every(r => selectedIds.has(r.id)));
  let someSelected = $derived(selectedIds.size > 0 && !allSelected);

  function toggleSelectAll() {
    selectedIds = allSelected ? new Set() : new Set(roles.map(r => r.id));
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
    if (!form.name.trim() || !form.key.trim()) return alert('请填写必填项');
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
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除该角色吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemRoleById({ id });
      loadRoles();
    } catch (err) {
      console.error('Failed to delete role:', err);
      alert('删除失败');
    }
  }

  async function handleBatchDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 个角色吗？`)) return;
    deleting = true;
    try {
      const api = authStore.createApi(true);
      await Promise.all(Array.from(selectedIds).map(id => api.system.deleteApiSystemRoleById({ id })));
      selectedIds = new Set();
      loadRoles();
    } catch (err) {
      console.error('Failed to delete roles:', err);
      alert('删除失败');
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

<div class="flex flex-1 min-h-0 flex-col px-4 lg:px-6 pb-4">
  <!-- 搜索表单 -->
  {#if showFilter}
    <div class="py-3 border-b border-border">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">角色名称</span>
          <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.name} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">权限字符</span>
          <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.key} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">状态</span>
          <Select.Root type="single" bind:value={searchForm.status}>
            <Select.Trigger class="w-24 h-8">
              {statusFilterOptions.find(o => o.value === searchForm.status)?.label || '全部'}
            </Select.Trigger>
            <Select.Content>
              {#each statusFilterOptions as option}
                <Select.Item value={option.value}>{option.label}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">创建时间</span>
          <Input type="date" class="w-32 h-8" bind:value={searchForm.createdAtStart} />
          <span class="text-muted-foreground">-</span>
          <Input type="date" class="w-32 h-8" bind:value={searchForm.createdAtEnd} />
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
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadRoles}><Icon icon="tdesign:refresh" class="size-4" /></Button>
        </div>
      </div>
    </div>
    <div class="flex-1 min-h-0 flex flex-col">
      {#if loading}
        <div class="space-y-3">{#each [1,2,3,4,5] as _}<Skeleton class="h-12 w-full" />{/each}</div>
      {:else}
        <div class="flex-1 min-h-0">
          <ScrollArea class="h-full" orientation="both">
          <Table.Root>
            <Table.Header class="sticky top-0 bg-background z-10">
              <Table.Row>
                <Table.Head class="w-12"><Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleSelectAll} /></Table.Head>
                <Table.Head>角色名称</Table.Head>
                <Table.Head>权限字符</Table.Head>
                <Table.Head class="w-20">排序</Table.Head>
                <Table.Head class="w-32">数据权限</Table.Head>
                <Table.Head class="w-20">状态</Table.Head>
                <Table.Head class="w-40">创建时间</Table.Head>
                <Table.Head class="w-36 text-right">操作</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {#each roles as role}
              <Table.Row class={selectedIds.has(role.id) ? 'bg-muted/50' : ''}>
                <Table.Cell><Checkbox checked={selectedIds.has(role.id)} onCheckedChange={() => toggleSelect(role.id)} /></Table.Cell>
                <Table.Cell class="font-medium">{role.name}</Table.Cell>
                <Table.Cell class="text-muted-foreground">{role.key}</Table.Cell>
                <Table.Cell>{role.sort}</Table.Cell>
                <Table.Cell>{@const scopeOption = dataScopeOptions.find(o => o.value === role.dataScope)}<Badge variant={scopeOption?.variant || 'outline'}>{scopeOption?.label || '未设置'}</Badge></Table.Cell>
                <Table.Cell><Badge variant={role.status === '0' ? 'default' : 'secondary'}>{role.status === '0' ? '正常' : '停用'}</Badge></Table.Cell>
                <Table.Cell class="text-muted-foreground">{new Date(role.createdAt).toLocaleString('zh-CN')}</Table.Cell>
                <Table.Cell class="text-right">
                  <div class="flex justify-end gap-1">
                    {#if isAdminRole(role)}
                      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" disabled><Icon icon="tdesign:edit" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>管理员角色不允许编辑</Tooltip.Content></Tooltip.Root>
                      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" disabled><Icon icon="tdesign:lock-on" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>管理员拥有所有权限</Tooltip.Content></Tooltip.Root>
                      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" disabled><Icon icon="tdesign:menu-application" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>管理员拥有所有菜单</Tooltip.Content></Tooltip.Root>
                      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" disabled><Icon icon="tdesign:delete" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>管理员角色不允许删除</Tooltip.Content></Tooltip.Root>
                    {:else}
                      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openEdit(role)}><Icon icon="tdesign:edit" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>编辑</Tooltip.Content></Tooltip.Root>
                      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openPermissionDialog(role)}><Icon icon="tdesign:lock-on" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>分配权限</Tooltip.Content></Tooltip.Root>
                      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openMenuDialog(role)}><Icon icon="tdesign:menu-application" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>分配菜单</Tooltip.Content></Tooltip.Root>
                      <Tooltip.Root><Tooltip.Trigger><Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => handleDelete(role.id)}><Icon icon="tdesign:delete" class="size-4" /></Button></Tooltip.Trigger><Tooltip.Content>删除</Tooltip.Content></Tooltip.Root>
                    {/if}
                  </div>
                </Table.Cell>
              </Table.Row>
            {:else}
              <Table.Row><Table.Cell colspan={8} class="h-24 text-center text-muted-foreground">暂无数据</Table.Cell></Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
        </ScrollArea>
        </div>

        {#if total > 0}
          <div class="mt-4 flex items-center justify-between">
            <span class="text-sm text-muted-foreground whitespace-nowrap">共 {total} 条记录</span>
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
      {/if}
    </div>
  </div>
</div>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{editingRole ? '编辑角色' : '新增角色'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>角色名称 *</Label>
        <Input bind:value={form.name} placeholder="请输入角色名称" />
      </div>
      <div class="grid gap-2">
        <Label>权限字符 *</Label>
        <Input bind:value={form.key} placeholder="请输入权限字符" />
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
      <div class="grid gap-2">
        <Label>数据权限</Label>
        <Select.Root type="single" bind:value={form.dataScope}>
          <Select.Trigger>{dataScopeOptions.find(o => o.value === form.dataScope)?.label}</Select.Trigger>
          <Select.Content>{#each dataScopeOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
        </Select.Root>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>取消</Button>
      <Button onclick={handleSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
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
