<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface DepartmentsPageSnapshot {
    showFilter: boolean;
    allExpanded: boolean;
    searchForm: {
      name: string;
      status: string;
    };
  }

  let pageState: DepartmentsPageSnapshot = {
    showFilter: true,
    allExpanded: true,
    searchForm: { name: '', status: '' },
  };

  let restoreCallback: ((value: DepartmentsPageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<DepartmentsPageSnapshot> = {
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
  import { PostApiSystemDepartmentQueryFieldEnum, PostApiSystemDepartmentQueryOrderEnum } from '@/lib/api/Api';

  interface Dept {
    id: string;
    name: string;
    parentId: string | null;
    orderNum: number;
    leader: string | null;
    phone: string | null;
    email: string | null;
    status: boolean;
    createdAt: string;
  }

  interface DeptNode extends Dept {
    children?: DeptNode[];
    expanded?: boolean;
    level?: number;
  }

  let flatDepts = $state<Dept[]>([]);
  let deptTree = $state<DeptNode[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let dialogOpen = $state(false);
  let editingDept = $state<Dept | null>(null);
  let allExpanded = $state(pageState.allExpanded);
  let showFilter = $state(pageState.showFilter);

  let searchForm = $state({ ...pageState.searchForm });

  // Register restore callback
  restoreCallback = (value) => {
    showFilter = value.showFilter;
    allExpanded = value.allExpanded;
    searchForm = { ...value.searchForm };
  };

  // Sync state changes back to module-level for snapshot
  $effect(() => {
    pageState = {
      showFilter,
      allExpanded,
      searchForm: { ...searchForm },
    };
  });

  const statusOptions = [
    { value: '', label: '全部' },
    { value: 'true', label: '正常' },
    { value: 'false', label: '停用' },
  ];

  let form = $state({
    name: '',
    parentId: '' as string | null,
    orderNum: 1,
    leader: '',
    phone: '',
    email: '',
    status: true,
  });

  function buildTree(items: Dept[]): DeptNode[] {
    const map = new Map<string, DeptNode>();
    const roots: DeptNode[] = [];
    items.forEach(d => map.set(d.id, { ...d, children: [], expanded: allExpanded, level: 0 }));
    items.forEach(d => {
      const node = map.get(d.id)!;
      if (d.parentId && map.has(d.parentId)) {
        const parent = map.get(d.parentId)!;
        node.level = (parent.level || 0) + 1;
        parent.children!.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }

  function flattenTree(nodes: DeptNode[], result: DeptNode[] = []): DeptNode[] {
    for (const node of nodes) {
      result.push(node);
      if (node.expanded && node.children?.length) flattenTree(node.children, result);
    }
    return result;
  }

  let visibleDepts = $derived(flattenTree(deptTree));

  function toggleExpand(node: DeptNode) {
    node.expanded = !node.expanded;
    deptTree = [...deptTree];
  }

  function toggleExpandAll() {
    const setExpanded = (nodes: DeptNode[], val: boolean) => {
      nodes.forEach(n => { n.expanded = val; if (n.children?.length) setExpanded(n.children, val); });
    };
    allExpanded = !allExpanded;
    setExpanded(deptTree, allExpanded);
    deptTree = [...deptTree];
  }

  async function loadDepts() {
    loading = true;
    try {
      const api = authStore.createApi(true);
      const filter: Record<string, string | boolean> = {};
      if (searchForm.name.trim()) filter.name = searchForm.name.trim();
      if (searchForm.status !== '') filter.status = searchForm.status === 'true';

      const res = await api.system.postApiSystemDepartmentQuery({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: 100, offset: 0,
        sort: { field: PostApiSystemDepartmentQueryFieldEnum.OrderNum, order: PostApiSystemDepartmentQueryOrderEnum.Asc }
      } as Parameters<typeof api.system.postApiSystemDepartmentQuery>[0]);
      if (res.data?.data) {
        flatDepts = res.data.data;
        deptTree = buildTree(flatDepts);
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
    } finally {
      loading = false;
    }
  }

  function handleSearch() {
    loadDepts();
  }

  function handleReset() {
    searchForm = { name: '', status: '' };
    loadDepts();
  }

  function openCreate(parentId: string | null = null) {
    editingDept = null;
    form = { name: '', parentId, orderNum: 1, leader: '', phone: '', email: '', status: true };
    dialogOpen = true;
  }

  function openEdit(dept: Dept) {
    editingDept = dept;
    form = { name: dept.name, parentId: dept.parentId, orderNum: dept.orderNum, leader: dept.leader || '', phone: dept.phone || '', email: dept.email || '', status: dept.status };
    dialogOpen = true;
  }

  async function handleSave() {
    if (!form.name.trim()) return alert('请填写部门名称');
    saving = true;
    try {
      const api = authStore.createApi(true);
      const data = { ...form, parentId: form.parentId || null };
      if (editingDept) {
        await api.system.putApiSystemDepartmentById({ id: editingDept.id }, { data });
      } else {
        await api.system.postApiSystemDepartment({ data });
      }
      dialogOpen = false;
      loadDepts();
    } catch (err) {
      console.error('Failed to save department:', err);
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除该部门吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemDepartmentById({ id });
      loadDepts();
    } catch (err) {
      console.error('Failed to delete department:', err);
      alert('删除失败');
    }
  }

  onMount(() => loadDepts());
</script>

<div class="flex flex-1 min-h-0 flex-col px-4 lg:px-6 pb-4">
  <!-- 搜索表单 -->
  {#if showFilter}
    <div class="py-3 border-b border-border">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-muted-foreground whitespace-nowrap">部门名称</span>
          <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.name} />
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
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadDepts}><Icon icon="tdesign:refresh" class="size-4" /></Button>
        </div>
      </div>
    </div>
    <div class="flex-1 min-h-0">
      {#if loading}
        <div class="space-y-3">{#each [1,2,3,4,5] as _}<Skeleton class="h-12 w-full" />{/each}</div>
      {:else}
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head class="w-64">部门名称</Table.Head>
              <Table.Head class="w-20">排序</Table.Head>
              <Table.Head>负责人</Table.Head>
              <Table.Head>联系电话</Table.Head>
              <Table.Head class="w-20">状态</Table.Head>
              <Table.Head class="w-40">创建时间</Table.Head>
              <Table.Head class="w-28 text-right">操作</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {#each visibleDepts as dept}
              <Table.Row>
                <Table.Cell>
                  <div class="flex items-center" style="padding-left: {(dept.level || 0) * 20}px">
                    {#if dept.children && dept.children.length > 0}
                      <button class="p-0.5 hover:bg-muted rounded mr-1" onclick={() => toggleExpand(dept)}>
                        <Icon icon={dept.expanded ? 'tdesign:chevron-down' : 'tdesign:chevron-right'} class="size-4" />
                      </button>
                    {:else}
                      <span class="w-5 mr-1"></span>
                    {/if}
                    <Icon icon="tdesign:folder" class="size-4 mr-2 text-muted-foreground" />
                    <span class="font-medium">{dept.name}</span>
                  </div>
                </Table.Cell>
                <Table.Cell>{dept.orderNum}</Table.Cell>
                <Table.Cell>{dept.leader || '-'}</Table.Cell>
                <Table.Cell class="text-muted-foreground">{dept.phone || '-'}</Table.Cell>
                <Table.Cell><Badge variant={dept.status ? 'default' : 'secondary'}>{dept.status ? '正常' : '停用'}</Badge></Table.Cell>
                <Table.Cell class="text-muted-foreground">{new Date(dept.createdAt).toLocaleString('zh-CN')}</Table.Cell>
                <Table.Cell class="text-right">
                  <div class="flex justify-end gap-1">
                    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openCreate(dept.id)} title="新增子部门"><Icon icon="tdesign:add" class="size-4" /></Button>
                    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => openEdit(dept)}><Icon icon="tdesign:edit" class="size-4" /></Button>
                    <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => handleDelete(dept.id)}><Icon icon="tdesign:delete" class="size-4" /></Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            {:else}
              <Table.Row><Table.Cell colspan={7} class="h-24 text-center text-muted-foreground">暂无数据</Table.Cell></Table.Row>
            {/each}
          </Table.Body>
        </Table.Root>
      {/if}
    </div>
  </div>
</div>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{editingDept ? '编辑部门' : '新增部门'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>上级部门</Label>
        <Select.Root type="single" bind:value={form.parentId}>
          <Select.Trigger>{flatDepts.find(d => d.id === form.parentId)?.name || '无（顶级部门）'}</Select.Trigger>
          <Select.Content>
            <Select.Item value="">无（顶级部门）</Select.Item>
            {#each flatDepts.filter(d => d.id !== editingDept?.id) as dept}
              <Select.Item value={dept.id}>{dept.name}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
      <div class="grid gap-2">
        <Label>部门名称 *</Label>
        <Input bind:value={form.name} placeholder="请输入部门名称" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>排序</Label>
          <Input bind:value={form.orderNum} type="number" />
        </div>
        <div class="grid gap-2">
          <Label>负责人</Label>
          <Input bind:value={form.leader} placeholder="请输入" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>联系电话</Label>
          <Input bind:value={form.phone} placeholder="请输入" />
        </div>
        <div class="grid gap-2">
          <Label>邮箱</Label>
          <Input bind:value={form.email} placeholder="请输入" />
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Label>状态</Label>
        <Switch bind:checked={form.status} />
        <span class="text-sm text-muted-foreground">{form.status ? '正常' : '停用'}</span>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => dialogOpen = false}>取消</Button>
      <Button onclick={handleSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
