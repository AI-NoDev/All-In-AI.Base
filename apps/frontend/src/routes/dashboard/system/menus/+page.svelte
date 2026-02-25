<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface Menu {
    id: string;
    name: string;
    parentId: string | null;
    orderNum: number;
    path: string | null;
    type: string;
    visible: boolean;
    isCache: boolean;
    isFrame: boolean;
    isSystem: boolean;
    linkUrl: string | null;
    linkTarget: string | null;
    perms: string | null;
    icon: string | null;
    createdAt: string;
  }

  interface PageSnapshot {
    flatMenus: Menu[];
    searchForm: { name: string; visible: string };
    allExpanded: boolean;
    dataLoaded: boolean;
  }

  let pageState: PageSnapshot = {
    flatMenus: [],
    searchForm: { name: '', visible: '' },
    allExpanded: true,
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
  import * as Select from '$lib/components/ui/select';
  import * as Alert from '$lib/components/ui/alert';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { Switch } from '$lib/components/ui/switch';
  import { DataTable } from '$lib/components/common';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import { PostApiSystemMenuQueryFieldEnum, PostApiSystemMenuQueryOrderEnum } from '@qiyu-allinai/api';
  import { pages } from '@/lib/generated-pages';
  import MissingMenuDialog from './components/missing-menu-dialog.svelte';

  interface MenuNode extends Menu {
    children?: MenuNode[];
    expanded?: boolean;
    level?: number;
  }

  let flatMenus = $state<Menu[]>(pageState.flatMenus);
  let menuTree = $state<MenuNode[]>([]);
  let loading = $state(!pageState.dataLoaded);
  let saving = $state(false);
  let dialogOpen = $state(false);
  let editingMenu = $state<Menu | null>(null);
  let allExpanded = $state(pageState.allExpanded);
  let showFilter = $state(true);
  let snapshotRestored = $state(pageState.dataLoaded);

  let searchForm = $state({ ...pageState.searchForm });

  // Register restore callback
  restoreCallback = (value) => {
    flatMenus = value.flatMenus;
    searchForm = { ...value.searchForm };
    allExpanded = value.allExpanded;
    snapshotRestored = value.dataLoaded;
    loading = !value.dataLoaded;
    if (value.dataLoaded) {
      menuTree = buildTree(flatMenus);
    }
  };

  // Sync state to module-level for snapshot
  $effect(() => {
    pageState = {
      flatMenus,
      searchForm: { ...searchForm },
      allExpanded,
      dataLoaded: !loading
    };
  });

  // 缺失菜单检测
  let missingCount = $state(0);
  let missingDialogOpen = $state(false);

  let form = $state({
    name: '',
    parentId: '' as string,
    orderNum: 1,
    path: '',
    type: 'M',
    visible: true,
    isCache: true,
    isFrame: false,
    perms: '',
    icon: '',
    linkUrl: '',
    linkTarget: '_self',
  });

  const typeOptions = [
    { value: 'M', label: t('page.system.menu.type_M') },
    { value: 'C', label: t('page.system.menu.type_C') },
    { value: 'L', label: t('page.system.menu.type_L') },
  ];

  // 可选的类型列表：有父级时不能选择目录
  let availableTypeOptions = $derived.by(() => {
    if (form.parentId) {
      return typeOptions.filter(o => o.value !== 'M');
    }
    return typeOptions;
  });

  const linkTargetOptions = [
    { value: '_self', label: t('page.system.menu.linkTargetSelf') },
    { value: '_blank', label: t('page.system.menu.linkTargetBlank') },
  ];

  // 获取可选的父级菜单列表
  let parentOptions = $derived.by(() => {
    if (form.type === 'M') {
      return [];
    }
    return flatMenus.filter(m => m.id !== editingMenu?.id && m.type === 'M');
  });

  const visibleOptions = [
    { value: '', label: t('common.filter.all') },
    { value: 'true', label: t('common.status.enabled') },
    { value: 'false', label: t('common.status.disabled') },
  ];

  function buildTree(items: Menu[]): MenuNode[] {
    const map = new Map<string, MenuNode>();
    const roots: MenuNode[] = [];
    items.forEach(m => map.set(m.id, { ...m, children: [], expanded: allExpanded, level: 0 }));
    items.forEach(m => {
      const node = map.get(m.id)!;
      if (m.parentId && map.has(m.parentId)) {
        const parent = map.get(m.parentId)!;
        node.level = (parent.level || 0) + 1;
        parent.children!.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }

  function flattenTree(nodes: MenuNode[], result: MenuNode[] = []): MenuNode[] {
    for (const node of nodes) {
      result.push(node);
      if (node.expanded && node.children?.length) flattenTree(node.children, result);
    }
    return result;
  }

  let visibleMenus = $derived(flattenTree(menuTree));

  function toggleExpand(node: MenuNode) {
    node.expanded = !node.expanded;
    menuTree = [...menuTree];
  }

  function toggleExpandAll() {
    const setExpanded = (nodes: MenuNode[], val: boolean) => {
      nodes.forEach(n => { n.expanded = val; if (n.children?.length) setExpanded(n.children, val); });
    };
    allExpanded = !allExpanded;
    setExpanded(menuTree, allExpanded);
    menuTree = [...menuTree];
  }

  async function loadMenus() {
    loading = true;
    try {
      const api = authStore.createApi(true);
      const filter: Record<string, string | boolean> = {};
      if (searchForm.name.trim()) filter.name = searchForm.name.trim();
      if (searchForm.visible !== '') filter.visible = searchForm.visible === 'true';

      const res = await api.system.postApiSystemMenuQuery({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: 100, offset: 0,
        sort: { field: PostApiSystemMenuQueryFieldEnum.OrderNum, order: PostApiSystemMenuQueryOrderEnum.Asc }
      } as Parameters<typeof api.system.postApiSystemMenuQuery>[0]);
      if (res.data?.data) {
        flatMenus = res.data.data;
        menuTree = buildTree(flatMenus);
      }
    } catch (err) {
      console.error('Failed to load menus:', err);
    } finally {
      loading = false;
    }
  }

  function handleSearch() {
    loadMenus();
  }

  function handleReset() {
    searchForm = { name: '', visible: '' };
    loadMenus();
  }

  function openCreate(parentId: string | null = null) {
    editingMenu = null;
    const defaultType = parentId ? 'C' : 'M';
    form = { name: '', parentId: parentId || '', orderNum: 1, path: '', type: defaultType, visible: true, isCache: true, isFrame: false, perms: '', icon: '', linkUrl: '', linkTarget: '_self' };
    dialogOpen = true;
  }

  function openEdit(menu: Menu) {
    editingMenu = menu;
    form = { name: menu.name, parentId: menu.parentId || '', orderNum: menu.orderNum, path: menu.path || '', type: menu.type, visible: menu.visible, isCache: menu.isCache, isFrame: menu.isFrame, perms: menu.perms || '', icon: menu.icon || '', linkUrl: menu.linkUrl || '', linkTarget: menu.linkTarget || '_self' };
    dialogOpen = true;
  }

  async function handleSave() {
    if (!form.name.trim()) return alert(t('page.system.post.requiredFields'));
    if (form.type === 'L' && !form.linkUrl.trim()) return alert(t('page.system.post.requiredFields'));
    saving = true;
    try {
      const api = authStore.createApi(true);
      const parentId = form.type === 'M' ? null : (form.parentId || null);
      const isFrame = form.type === 'L' ? true : form.isFrame;
      const data = { 
        ...form, 
        orderNum: Number(form.orderNum), 
        parentId, 
        isFrame,
        path: form.path || null, 
        perms: form.perms || null, 
        icon: form.icon || null, 
        linkUrl: form.linkUrl || null,
        linkTarget: form.linkTarget || null,
      };
      if (editingMenu) {
        await api.system.putApiSystemMenuById({ id: editingMenu.id }, { data: data as Parameters<typeof api.system.putApiSystemMenuById>[1]['data'] });
      } else {
        await api.system.postApiSystemMenu({ data: data as Parameters<typeof api.system.postApiSystemMenu>[0]['data'] });
      }
      dialogOpen = false;
      loadMenus();
    } catch (err) {
      console.error('Failed to save menu:', err);
      alert(t('common.tips.operationFailed'));
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('page.system.menu.deleteConfirm'))) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemMenuById({ id });
      loadMenus();
    } catch (err) {
      console.error('Failed to delete menu:', err);
      alert(t('common.tips.operationFailed'));
    }
  }

  function getTypeLabel(type: string) {
    return typeOptions.find(o => o.value === type)?.label || type;
  }

  const columns = [
    { key: 'name', title: t('page.system.menu.name'), width: 240, render: nameRender },
    { key: 'icon', title: t('page.system.menu.icon'), width: 60, render: iconRender },
    { key: 'orderNum', title: t('page.system.menu.orderNum'), width: 60 },
    { key: 'perms', title: t('page.system.menu.perms'), width: 140, render: permsRender },
    { key: 'path', title: t('page.system.menu.path'), width: 180, render: pathRender },
    { key: 'type', title: t('page.system.menu.type'), width: 70, render: typeRender },
    { key: 'visible', title: t('page.system.menu.visible'), width: 60, render: visibleRender },
    { key: 'id', title: t('page.system.menu.actions'), width: 100, align: 'center' as const, fixed: 'right' as const, render: actionsRender },
  ];

  function detectMissingMenus() {
    const existingPaths = new Set(flatMenus.map(m => m.path).filter(Boolean));
    const visiblePages = pages.filter(p => 
      !p.hidden && 
      p.group && 
      !p.path.includes('[') && 
      p.path.startsWith('/dashboard')
    );
    missingCount = visiblePages.filter(p => !existingPaths.has(p.path)).length;
  }

  function handleMissingCreated() {
    loadMenus().then(() => detectMissingMenus());
  }

  onMount(() => {
    if (!snapshotRestored) {
      loadMenus().then(() => detectMissingMenus());
    } else {
      detectMissingMenus();
    }
  });
</script>

{#snippet nameRender({ row })}
  <div class="flex items-center" style="padding-left: {(row.level || 0) * 20}px">
    {#if row.children && row.children.length > 0}
      <button class="p-0.5 hover:bg-muted rounded mr-1" onclick={() => toggleExpand(row)}>
        <Icon icon={row.expanded ? 'tdesign:chevron-down' : 'tdesign:chevron-right'} class="size-4" />
      </button>
    {:else}
      <span class="w-5 mr-1"></span>
    {/if}
    <span class="font-medium truncate">{row.name}</span>
  </div>
{/snippet}

{#snippet iconRender({ row })}
  {#if row.icon}<Icon icon={row.icon} class="size-4" />{:else}-{/if}
{/snippet}

{#snippet permsRender({ value })}
  <span class="text-muted-foreground truncate">{value || '-'}</span>
{/snippet}

{#snippet pathRender({ value })}
  <span class="text-muted-foreground truncate">{value || '-'}</span>
{/snippet}

{#snippet typeRender({ row })}
  <Badge variant={row.type === 'M' ? 'default' : row.type === 'C' ? 'secondary' : 'outline'}>{getTypeLabel(row.type)}</Badge>
{/snippet}

{#snippet visibleRender({ row })}
  <Badge variant={row.visible ? 'default' : 'secondary'}>{row.visible ? t('common.status.enabled') : t('common.status.disabled')}</Badge>
{/snippet}

{#snippet actionsRender({ row })}
  <div class="flex justify-center gap-1">
    {#if row.type === 'M'}
      <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openCreate(row.id)} title={t('page.system.menu.addSubMenu')}><Icon icon="tdesign:add" class="size-4" /></Button>
    {/if}
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openEdit(row)}><Icon icon="tdesign:edit" class="size-4" /></Button>
    {#if !row.isSystem || row.type === 'M'}
      <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => handleDelete(row.id)}><Icon icon="tdesign:delete" class="size-4" /></Button>
    {/if}
  </div>
{/snippet}

<div class="flex flex-1 min-h-0 flex-col px-4 lg:px-6 pb-4">
  <!-- 缺失菜单警告 -->
  {#if missingCount > 0}
    <Alert.Root variant="destructive" class="mt-3">
      <Icon icon="tdesign:error-circle" class="size-4" />
      <Alert.Title>{t('page.system.menu.missingMenuAlert')}</Alert.Title>
      <Alert.Description class="flex items-center justify-between">
        <span>{t('page.system.menu.missingMenuDesc').replace('${count}', String(missingCount))}</span>
        <Button size="sm" variant="outline" onclick={() => missingDialogOpen = true}>
          <Icon icon="tdesign:tools" class="mr-1 size-4" />{t('page.system.menu.handleMissing')}
        </Button>
      </Alert.Description>
    </Alert.Root>
  {/if}

  <!-- 搜索表单 -->
  {#if showFilter}
    <div class="py-3 border-b border-border">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.menu.name')}</span>
          <Input placeholder={t('common.tips.inputPlaceholder')} class="w-32 h-8" bind:value={searchForm.name} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">{t('page.system.menu.status')}</span>
          <Select.Root type="single" bind:value={searchForm.visible}>
            <Select.Trigger class="w-24 h-8">
              {visibleOptions.find(o => o.value === searchForm.visible)?.label || t('common.filter.all')}
            </Select.Trigger>
            <Select.Content>
              {#each visibleOptions as option}
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

  <div class="flex-1 flex flex-col min-h-0 pt-4">
    <div class="pb-3">
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <Button size="sm" onclick={() => openCreate()}><Icon icon="tdesign:add" class="mr-1 size-4" />{t('common.actions.add')}</Button>
          <Button size="sm" variant="outline" onclick={toggleExpandAll}>
            <Icon icon={allExpanded ? 'tdesign:chevron-up-double' : 'tdesign:chevron-down-double'} class="mr-1 size-4" />
            {allExpanded ? t('common.actions.collapse') : t('common.actions.expand')}
          </Button>
        </div>
        <div class="flex gap-1">
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => showFilter = !showFilter}>
            <Icon icon={showFilter ? 'tdesign:filter-clear' : 'tdesign:filter'} class="size-4" />
          </Button>
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadMenus}><Icon icon="tdesign:refresh" class="size-4" /></Button>
        </div>
      </div>
    </div>
    <div class="flex-1 min-h-0 flex flex-col">
      <DataTable 
        {columns} 
        data={visibleMenus} 
        {loading}
      />
    </div>
  </div>
</div>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{editingMenu ? t('page.system.menu.editMenu') : t('page.system.menu.addMenu')}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>{t('page.system.menu.menuType')} *</Label>
          <Select.Root type="single" bind:value={form.type} onValueChange={() => { if (form.type === 'M') form.parentId = ''; }}>
            <Select.Trigger>{typeOptions.find(o => o.value === form.type)?.label}</Select.Trigger>
            <Select.Content>{#each availableTypeOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
          </Select.Root>
        </div>
        <div class="grid gap-2">
          <Label>{t('page.system.menu.menuName')} *</Label>
          <Input bind:value={form.name} placeholder={t('common.tips.inputPlaceholder')} />
        </div>
      </div>
      {#if form.type !== 'M'}
        <div class="grid gap-2">
          <Label>{t('page.system.menu.parentDirectory')}</Label>
          <Select.Root type="single" bind:value={form.parentId}>
            <Select.Trigger>{flatMenus.find(m => m.id === form.parentId)?.name || t('page.system.menu.noParent')}</Select.Trigger>
            <Select.Content>
              <Select.Item value="">{t('page.system.menu.noParent')}</Select.Item>
              {#each parentOptions as menu}
                <Select.Item value={menu.id}>{menu.name}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
      {/if}
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>{t('page.system.menu.icon')}</Label>
          <Input bind:value={form.icon} placeholder="tdesign:home" />
        </div>
        <div class="grid gap-2">
          <Label>{t('page.system.menu.orderNum')}</Label>
          <Input bind:value={form.orderNum} type="number" />
        </div>
      </div>
      {#if form.type === 'C'}
        <div class="grid gap-2">
          <Label>{t('page.system.menu.routePath')}</Label>
          <Input bind:value={form.path} placeholder={t('common.tips.inputPlaceholder')} />
        </div>
        <div class="flex items-center gap-2">
          <Label>{t('page.system.menu.isFrame')}</Label>
          <Switch bind:checked={form.isFrame} />
        </div>
        {#if form.isFrame}
          <div class="grid gap-2">
            <Label>{t('page.system.menu.linkUrl')}</Label>
            <Input bind:value={form.linkUrl} placeholder="https://example.com" />
          </div>
          <div class="grid gap-2">
            <Label>{t('page.system.menu.linkTarget')}</Label>
            <Select.Root type="single" bind:value={form.linkTarget}>
              <Select.Trigger>{linkTargetOptions.find(o => o.value === form.linkTarget)?.label || t('page.system.menu.linkTargetSelf')}</Select.Trigger>
              <Select.Content>{#each linkTargetOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
            </Select.Root>
          </div>
        {/if}
      {/if}
      {#if form.type === 'L'}
        <div class="grid gap-2">
          <Label>{t('page.system.menu.linkUrl')} *</Label>
          <Input bind:value={form.linkUrl} placeholder="https://example.com" />
        </div>
        <div class="grid gap-2">
          <Label>{t('page.system.menu.linkTarget')}</Label>
          <Select.Root type="single" bind:value={form.linkTarget}>
            <Select.Trigger>{linkTargetOptions.find(o => o.value === form.linkTarget)?.label || t('page.system.menu.linkTargetSelf')}</Select.Trigger>
            <Select.Content>{#each linkTargetOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
          </Select.Root>
        </div>
      {/if}
      <div class="grid gap-2">
        <Label>{t('page.system.menu.perms')}</Label>
        <Input bind:value={form.perms} placeholder="system:user:list" />
      </div>
      <div class="flex flex-wrap gap-6">
        <div class="flex items-center gap-2">
          <Label>{t('page.system.menu.displayStatus')}</Label>
          <Switch bind:checked={form.visible} />
        </div>
        <div class="flex items-center gap-2">
          <Label>{t('page.system.menu.isCache')}</Label>
          <Switch bind:checked={form.isCache} />
        </div>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>{t('common.actions.cancel')}</Button>
      <Button onclick={handleSave} disabled={saving}>{saving ? t('common.tips.saving') : t('common.actions.save')}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- 缺失菜单处理对话框 -->
<MissingMenuDialog bind:open={missingDialogOpen} menus={flatMenus} onCreated={handleMissingCreated} />
