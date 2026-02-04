<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import * as Card from '@/lib/components/ui/card';
  import * as Table from '@/lib/components/ui/table';
  import * as Dialog from '@/lib/components/ui/dialog';
  import * as Select from '@/lib/components/ui/select';
  import { Button } from '@/lib/components/ui/button';
  import { Input } from '@/lib/components/ui/input';
  import { Label } from '@/lib/components/ui/label';
  import { Badge } from '@/lib/components/ui/badge';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { Switch } from '@/lib/components/ui/switch';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { PostApiSystemMenuQueryFieldEnum, PostApiSystemMenuQueryOrderEnum } from '@/lib/api/Api';

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
    perms: string | null;
    icon: string | null;
    component: string | null;
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
    component: '',
  });

  const typeOptions = [
    { value: 'M', label: '目录' },
    { value: 'C', label: '菜单' },
    { value: 'F', label: '按钮' },
  ];

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
    form = { name: '', parentId: parentId || '', orderNum: 1, path: '', type: 'M', visible: true, isCache: true, isFrame: false, perms: '', icon: '', component: '' };
    dialogOpen = true;
  }

  function openEdit(menu: Menu) {
    editingMenu = menu;
    form = { name: menu.name, parentId: menu.parentId || '', orderNum: menu.orderNum, path: menu.path || '', type: menu.type, visible: menu.visible, isCache: menu.isCache, isFrame: menu.isFrame, perms: menu.perms || '', icon: menu.icon || '', component: menu.component || '' };
    dialogOpen = true;
  }

  async function handleSave() {
    if (!form.name.trim()) return alert('请填写菜单名称');
    saving = true;
    try {
      const api = authStore.createApi(true);
      const data = { ...form, orderNum: Number(form.orderNum), parentId: form.parentId || null, path: form.path || null, perms: form.perms || null, icon: form.icon || null, component: form.component || null };
      if (editingMenu) {
        await api.system.putApiSystemMenuById({ id: editingMenu.id }, { data: data as any });
      } else {
        await api.system.postApiSystemMenu({ data: data as any });
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

  onMount(() => loadMenus());
</script>

<div class="px-4 lg:px-6">
  <!-- 搜索表单 -->
  {#if showFilter}
    <Card.Root class="mb-4">
      <Card.Content>
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
      </Card.Content>
    </Card.Root>
  {/if}

  <Card.Root>
    <Card.Header class="pb-3">
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
    </Card.Header>
    <Card.Content>
      {#if loading}
        <div class="space-y-3">{#each [1,2,3,4,5] as _}<Skeleton class="h-12 w-full" />{/each}</div>
      {:else}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head class="w-64">菜单名称</Table.Head>
              <Table.Head class="w-16">图标</Table.Head>
              <Table.Head class="w-20">排序</Table.Head>
              <Table.Head>权限标识</Table.Head>
              <Table.Head>路由地址</Table.Head>
              <Table.Head class="w-20">类型</Table.Head>
              <Table.Head class="w-20">可见</Table.Head>
              <Table.Head class="w-28 text-right">操作</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each visibleMenus as menu}
              <Table.Row>
                <Table.Cell>
                  <div class="flex items-center" style="padding-left: {(menu.level || 0) * 20}px">
                    {#if menu.children && menu.children.length > 0}
                      <button class="p-0.5 hover:bg-muted rounded mr-1" onclick={() => toggleExpand(menu)}>
                        <Icon icon={menu.expanded ? 'tdesign:chevron-down' : 'tdesign:chevron-right'} class="size-4" />
                      </button>
                    {:else}
                      <span class="w-5 mr-1"></span>
                    {/if}
                    <span class="font-medium">{menu.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>{#if menu.icon}<Icon icon={menu.icon} class="size-4" />{:else}-{/if}</Table.Cell>
                <Table.Cell>{menu.orderNum}</Table.Cell>
                <Table.Cell class="text-muted-foreground">{menu.perms || '-'}</Table.Cell>
                <Table.Cell class="text-muted-foreground">{menu.path || '-'}</Table.Cell>
                <Table.Cell><Badge variant={menu.type === 'M' ? 'default' : menu.type === 'C' ? 'secondary' : 'outline'}>{getTypeLabel(menu.type)}</Badge></Table.Cell>
                <Table.Cell><Badge variant={menu.visible ? 'default' : 'secondary'}>{menu.visible ? '是' : '否'}</Badge></Table.Cell>
                <Table.Cell class="text-right">
                  <div class="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openCreate(menu.id)} title="新增子菜单"><Icon icon="tdesign:add" class="size-4" /></Button>
                    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openEdit(menu)}><Icon icon="tdesign:edit" class="size-4" /></Button>
                    <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => handleDelete(menu.id)}><Icon icon="tdesign:delete" class="size-4" /></Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            {:else}
              <Table.Row><Table.Cell colspan={8} class="h-24 text-center text-muted-foreground">暂无数据</Table.Cell></Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      {/if}
    </Card.Content>
  </Card.Root>
</div>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{editingMenu ? '编辑菜单' : '新增菜单'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
      <div class="grid gap-2">
        <Label>上级菜单</Label>
        <Select.Root type="single" bind:value={form.parentId}>
          <Select.Trigger>{flatMenus.find(m => m.id === form.parentId)?.name || '无（顶级菜单）'}</Select.Trigger>
          <Select.Content>
            <Select.Item value="">无（顶级菜单）</Select.Item>
            {#each flatMenus.filter(m => m.id !== editingMenu?.id && m.type !== 'F') as menu}
              <Select.Item value={menu.id}>{menu.name}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>菜单类型 *</Label>
          <Select.Root type="single" bind:value={form.type}>
            <Select.Trigger>{typeOptions.find(o => o.value === form.type)?.label}</Select.Trigger>
            <Select.Content>{#each typeOptions as opt}<Select.Item value={opt.value}>{opt.label}</Select.Item>{/each}</Select.Content>
          </Select.Root>
        </div>
        <div class="grid gap-2">
          <Label>菜单名称 *</Label>
          <Input bind:value={form.name} placeholder="请输入" />
        </div>
      </div>
      {#if form.type !== 'F'}
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label>图标</Label>
            <Input bind:value={form.icon} placeholder="如 tdesign:home" />
          </div>
          <div class="grid gap-2">
            <Label>排序</Label>
            <Input bind:value={form.orderNum} type="number" />
          </div>
        </div>
        <div class="grid gap-2">
          <Label>路由地址</Label>
          <Input bind:value={form.path} placeholder="请输入路由地址" />
        </div>
      {/if}
      {#if form.type === 'C'}
        <div class="grid gap-2">
          <Label>组件路径</Label>
          <Input bind:value={form.component} placeholder="请输入组件路径" />
        </div>
      {/if}
      <div class="grid gap-2">
        <Label>权限标识</Label>
        <Input bind:value={form.perms} placeholder="如 system:user:list" />
      </div>
      {#if form.type !== 'F'}
        <div class="flex flex-wrap gap-6">
          <div class="flex items-center gap-2">
            <Label>显示状态</Label>
            <Switch bind:checked={form.visible} />
          </div>
          <div class="flex items-center gap-2">
            <Label>是否缓存</Label>
            <Switch bind:checked={form.isCache} />
          </div>
          <div class="flex items-center gap-2">
            <Label>是否外链</Label>
            <Switch bind:checked={form.isFrame} />
          </div>
        </div>
      {/if}
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>取消</Button>
      <Button onclick={handleSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
