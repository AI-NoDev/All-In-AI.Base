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
  import { PostApiSystemMenuQueryFieldEnum, PostApiSystemMenuQueryOrderEnum } from '@qiyu-allinai/api';
  import { pages } from '@/lib/generated-pages';
  import MissingMenuDialog from './components/missing-menu-dialog.svelte';

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

  interface MenuNode extends Menu {
    children?: MenuNode[];
    expanded?: boolean;
    level?: number;
  }

  let flatMenus = $state<Menu[]>([]);
  let menuTree = $state<MenuNode[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let dialogOpen = $state(false);
  let editingMenu = $state<Menu | null>(null);
  let allExpanded = $state(true);
  let showFilter = $state(true);

  let searchForm = $state({
    name: '',
    visible: '',
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
    { value: 'M', label: '目录' },
    { value: 'C', label: '菜单' },
    { value: 'L', label: '外链' },
  ];

  // 可选的类型列表：有父级时不能选择目录
  let availableTypeOptions = $derived.by(() => {
    if (form.parentId) {
      return typeOptions.filter(o => o.value !== 'M');
    }
    return typeOptions;
  });

  const linkTargetOptions = [
    { value: '_self', label: '当前窗口（iframe）' },
    { value: '_blank', label: '新窗口' },
  ];

  // 获取可选的父级菜单列表
  let parentOptions = $derived.by(() => {
    if (form.type === 'M') {
      return [];
    }
    return flatMenus.filter(m => m.id !== editingMenu?.id && m.type === 'M');
  });

  const visibleOptions = [
    { value: '', label: '全部' },
    { value: 'true', label: '显示' },
    { value: 'false', label: '隐藏' },
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
    if (!form.name.trim()) return alert('请填写菜单名称');
    if (form.type === 'L' && !form.linkUrl.trim()) return alert('请填写外链地址');
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
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除该菜单吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemMenuById({ id });
      loadMenus();
    } catch (err) {
      console.error('Failed to delete menu:', err);
      alert('删除失败');
    }
  }

  function getTypeLabel(type: string) {
    return typeOptions.find(o => o.value === type)?.label || type;
  }

  const columns = [
    { key: 'name', title: '菜单名称', width: 240, render: nameRender },
    { key: 'icon', title: '图标', width: 60, render: iconRender },
    { key: 'orderNum', title: '排序', width: 60 },
    { key: 'perms', title: '权限标识', width: 140, render: permsRender },
    { key: 'path', title: '路由地址', width: 180, render: pathRender },
    { key: 'type', title: '类型', width: 70, render: typeRender },
    { key: 'visible', title: '可见', width: 60, render: visibleRender },
    { key: 'id', title: '操作', width: 100, align: 'center' as const, fixed: 'right' as const, render: actionsRender },
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

  onMount(() => loadMenus().then(() => detectMissingMenus()));
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
  <Badge variant={row.visible ? 'default' : 'secondary'}>{row.visible ? '是' : '否'}</Badge>
{/snippet}

{#snippet actionsRender({ row })}
  <div class="flex justify-center gap-1">
    {#if row.type === 'M'}
      <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openCreate(row.id)} title="新增子菜单"><Icon icon="tdesign:add" class="size-4" /></Button>
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
      <Alert.Title>检测到缺失菜单</Alert.Title>
      <Alert.Description class="flex items-center justify-between">
        <span>发现 {missingCount} 个页面在菜单中不存在，可能导致用户无法访问。</span>
        <Button size="sm" variant="outline" onclick={() => missingDialogOpen = true}>
          <Icon icon="tdesign:tools" class="mr-1 size-4" />处理
        </Button>
      </Alert.Description>
    </Alert.Root>
  {/if}

  <!-- 搜索表单 -->
  {#if showFilter}
    <div class="py-3 border-b border-border">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">菜单名称</span>
          <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.name} />
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">状态</span>
          <Select.Root type="single" bind:value={searchForm.visible}>
            <Select.Trigger class="w-24 h-8">
              {visibleOptions.find(o => o.value === searchForm.visible)?.label || '全部'}
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
          <Button size="sm" onclick={() => openCreate()}><Icon icon="tdesign:add" class="mr-1 size-4" />新增</Button>
          <Button size="sm" variant="outline" onclick={toggleExpandAll}>
            <Icon icon={allExpanded ? 'tdesign:chevron-up-double' : 'tdesign:chevron-down-double'} class="mr-1 size-4" />
            {allExpanded ? '全部收起' : '全部展开'}
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
      <Dialog.Title>{editingMenu ? '编辑菜单' : '新增菜单'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>菜单类型 *</Label>
          <Select.Root type="single" bind:value={form.type} onValueChange={() => { if (form.type === 'M') form.parentId = ''; }}>
            <Select.Trigger>{typeOptions.find(o => o.value === form.type)?.label}</Select.Trigger>
            <Select.Content>{#each availableTypeOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
          </Select.Root>
        </div>
        <div class="grid gap-2">
          <Label>菜单名称 *</Label>
          <Input bind:value={form.name} placeholder="请输入" />
        </div>
      </div>
      {#if form.type !== 'M'}
        <div class="grid gap-2">
          <Label>上级目录</Label>
          <Select.Root type="single" bind:value={form.parentId}>
            <Select.Trigger>{flatMenus.find(m => m.id === form.parentId)?.name || '无（顶级）'}</Select.Trigger>
            <Select.Content>
              <Select.Item value="">无（顶级）</Select.Item>
              {#each parentOptions as menu}
                <Select.Item value={menu.id}>{menu.name}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
      {/if}
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>图标</Label>
          <Input bind:value={form.icon} placeholder="如：tdesign:home" />
        </div>
        <div class="grid gap-2">
          <Label>排序</Label>
          <Input bind:value={form.orderNum} type="number" />
        </div>
      </div>
      {#if form.type === 'C'}
        <div class="grid gap-2">
          <Label>路由地址</Label>
          <Input bind:value={form.path} placeholder="请输入路由地址" />
        </div>
        <div class="flex items-center gap-2">
          <Label>是否外链</Label>
          <Switch bind:checked={form.isFrame} />
        </div>
        {#if form.isFrame}
          <div class="grid gap-2">
            <Label>外链地址</Label>
            <Input bind:value={form.linkUrl} placeholder="如：https://example.com" />
          </div>
          <div class="grid gap-2">
            <Label>打开方式</Label>
            <Select.Root type="single" bind:value={form.linkTarget}>
              <Select.Trigger>{linkTargetOptions.find(o => o.value === form.linkTarget)?.label || '当前窗口（iframe）'}</Select.Trigger>
              <Select.Content>{#each linkTargetOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
            </Select.Root>
          </div>
        {/if}
      {/if}
      {#if form.type === 'L'}
        <div class="grid gap-2">
          <Label>外链地址 *</Label>
          <Input bind:value={form.linkUrl} placeholder="如：https://example.com" />
        </div>
        <div class="grid gap-2">
          <Label>打开方式</Label>
          <Select.Root type="single" bind:value={form.linkTarget}>
            <Select.Trigger>{linkTargetOptions.find(o => o.value === form.linkTarget)?.label || '当前窗口（iframe）'}</Select.Trigger>
            <Select.Content>{#each linkTargetOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
          </Select.Root>
        </div>
      {/if}
      <div class="grid gap-2">
        <Label>权限标识</Label>
        <Input bind:value={form.perms} placeholder="如：system:user:list" />
      </div>
      <div class="flex flex-wrap gap-6">
        <div class="flex items-center gap-2">
          <Label>显示状态</Label>
          <Switch bind:checked={form.visible} />
        </div>
        <div class="flex items-center gap-2">
          <Label>是否缓存</Label>
          <Switch bind:checked={form.isCache} />
        </div>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>取消</Button>
      <Button onclick={handleSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- 缺失菜单处理对话框 -->
<MissingMenuDialog bind:open={missingDialogOpen} menus={flatMenus} onCreated={handleMissingCreated} />
