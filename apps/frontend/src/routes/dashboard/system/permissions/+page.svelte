<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import * as Table from '@qiyu-allinai/ui/components/table';
  import * as Dialog from '@qiyu-allinai/ui/components/dialog';
  import * as Select from '@qiyu-allinai/ui/components/select';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Input } from '@qiyu-allinai/ui/components/input';
  import { Label } from '@qiyu-allinai/ui/components/label';
  import { Badge } from '@qiyu-allinai/ui/components/badge';
  import { Skeleton } from '@qiyu-allinai/ui/components/skeleton';
  import { ScrollArea } from '@qiyu-allinai/ui/components/scroll-area';
  import { authStore } from '@/lib/stores/auth.svelte';

  interface Permission {
    id: string;
    code: string;
    name: string;
    type: string;
    module: string | null;
    resource: string | null;
    action: string | null;
    description: string | null;
    parentId: string | null;
    orderNum: number;
    status: boolean;
    createdAt: string;
    children?: Permission[];
    expanded?: boolean;
    level?: number;
  }

  let permissions = $state<Permission[]>([]);
  let flatPermissions = $state<Permission[]>([]);
  let loading = $state(true);
  let saving = $state(false);
  let dialogOpen = $state(false);
  let editingPermission = $state<Permission | null>(null);

  let form = $state({
    code: '',
    name: '',
    type: 'action',
    module: '',
    resource: '',
    action: '',
    description: '',
    parentId: '',
    orderNum: 0,
    status: true,
  });

  const typeOptions = [
    { value: 'module', label: '模块', variant: 'default' as const },
    { value: 'resource', label: '资源', variant: 'secondary' as const },
    { value: 'action', label: '操作', variant: 'outline' as const },
  ];

  const actionLabels: Record<string, string> = {
    read: '查看',
    write: '编辑',
    delete: '删除',
    manage: '管理',
    export: '导出',
    import: '导入',
  };

  function buildTree(flatList: Permission[]): Permission[] {
    const map = new Map<string, Permission>();
    const roots: Permission[] = [];

    flatList.forEach(item => {
      map.set(item.id, { ...item, children: [], expanded: true, level: 0 });
    });

    flatList.forEach(item => {
      const node = map.get(item.id)!;
      if (item.parentId && map.has(item.parentId)) {
        const parent = map.get(item.parentId)!;
        node.level = (parent.level || 0) + 1;
        parent.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    // Sort by orderNum
    const sortChildren = (nodes: Permission[]) => {
      nodes.sort((a, b) => a.orderNum - b.orderNum);
      nodes.forEach(n => n.children && sortChildren(n.children));
    };
    sortChildren(roots);

    return roots;
  }

  function flattenTree(nodes: Permission[], result: Permission[] = []): Permission[] {
    for (const node of nodes) {
      result.push(node);
      if (node.expanded && node.children && node.children.length > 0) {
        flattenTree(node.children, result);
      }
    }
    return result;
  }

  function toggleExpand(id: string) {
    const toggle = (nodes: Permission[]): boolean => {
      for (const node of nodes) {
        if (node.id === id) {
          node.expanded = !node.expanded;
          return true;
        }
        if (node.children && toggle(node.children)) return true;
      }
      return false;
    };
    toggle(permissions);
    flatPermissions = flattenTree(permissions);
  }

  async function loadPermissions() {
    loading = true;
    try {
      const api = authStore.createApi(true);
      const res = await api.system.postApiSystemPermissionQuery({
        limit: 1000,
        offset: 0,
      });
      if (res.data?.data) {
        permissions = buildTree(res.data.data);
        flatPermissions = flattenTree(permissions);
      }
    } catch (err) {
      console.error('Failed to load permissions:', err);
    } finally {
      loading = false;
    }
  }

  function openCreate(parentId?: string) {
    editingPermission = null;
    form = {
      code: '',
      name: '',
      type: parentId ? 'action' : 'module',
      module: '',
      resource: '',
      action: '',
      description: '',
      parentId: parentId || '',
      orderNum: 0,
      status: true,
    };
    dialogOpen = true;
  }

  function openEdit(perm: Permission) {
    editingPermission = perm;
    form = {
      code: perm.code,
      name: perm.name,
      type: perm.type,
      module: perm.module || '',
      resource: perm.resource || '',
      action: perm.action || '',
      description: perm.description || '',
      parentId: perm.parentId || '',
      orderNum: perm.orderNum,
      status: perm.status,
    };
    dialogOpen = true;
  }

  async function handleSave() {
    if (!form.code.trim() || !form.name.trim()) {
      alert('请填写必填项');
      return;
    }
    saving = true;
    try {
      const api = authStore.createApi(true);
      const data = {
        ...form,
        parentId: form.parentId || undefined,
        module: form.module || undefined,
        resource: form.resource || undefined,
        action: form.action || undefined,
        description: form.description || undefined,
      };
      if (editingPermission) {
        await api.system.putApiSystemPermissionById(
          { id: editingPermission.id },
          { data }
        );
      } else {
        await api.system.postApiSystemPermission({ data });
      }
      dialogOpen = false;
      loadPermissions();
    } catch (err) {
      console.error('Failed to save permission:', err);
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除该权限吗？删除后子权限也会被删除。')) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemPermissionById({ id });
      loadPermissions();
    } catch (err) {
      console.error('Failed to delete permission:', err);
      alert('删除失败');
    }
  }

  onMount(() => loadPermissions());
</script>

<div class="flex flex-1 min-h-0 flex-col px-4 lg:px-6 pb-4">
  <div class="flex-1 flex flex-col min-h-0 pt-4">
    <div class="pb-3">
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <Button size="sm" onclick={() => openCreate()}>
            <Icon icon="tdesign:add" class="mr-1 size-4" />新增模块
          </Button>
        </div>
        <div class="flex gap-1">
          <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadPermissions}>
            <Icon icon="tdesign:refresh" class="size-4" />
          </Button>
        </div>
      </div>
    </div>

    <div class="flex-1 min-h-0 flex flex-col">
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
                  <Table.Head class="w-80">权限名称</Table.Head>
                  <Table.Head class="w-48">权限标识</Table.Head>
                  <Table.Head class="w-24">类型</Table.Head>
                  <Table.Head class="w-20">排序</Table.Head>
                  <Table.Head class="w-20">状态</Table.Head>
                  <Table.Head class="w-32 text-right">操作</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {#each flatPermissions as perm}
                  <Table.Row>
                    <Table.Cell>
                      <div class="flex items-center" style="padding-left: {(perm.level || 0) * 24}px">
                        {#if perm.children && perm.children.length > 0}
                          <button
                            class="mr-1 p-0.5 hover:bg-muted rounded"
                            onclick={() => toggleExpand(perm.id)}
                          >
                            <Icon
                              icon={perm.expanded ? 'tdesign:chevron-down' : 'tdesign:chevron-right'}
                              class="size-4"
                            />
                          </button>
                        {:else}
                          <span class="w-5"></span>
                        {/if}
                        <Icon
                          icon={perm.type === 'module' ? 'tdesign:folder' : perm.type === 'resource' ? 'tdesign:file' : 'tdesign:control-platform'}
                          class="mr-2 size-4 text-muted-foreground"
                        />
                        <span class="font-medium">{perm.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell class="text-muted-foreground font-mono text-sm">
                      {perm.code}
                    </Table.Cell>
                    <Table.Cell>
                      {@const typeOpt = typeOptions.find(t => t.value === perm.type)}
                      <Badge variant={typeOpt?.variant || 'outline'}>
                        {typeOpt?.label || perm.type}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>{perm.orderNum}</Table.Cell>
                    <Table.Cell>
                      <Badge variant={perm.status ? 'default' : 'secondary'}>
                        {perm.status ? '启用' : '禁用'}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell class="text-right">
                      <div class="flex justify-end gap-1">
                        {#if perm.type !== 'action'}
                          <Button
                            size="sm"
                            variant="ghost"
                            class="h-8 w-8 p-0"
                            onclick={() => openCreate(perm.id)}
                          >
                            <Icon icon="tdesign:add" class="size-4" />
                          </Button>
                        {/if}
                        <Button
                          size="sm"
                          variant="ghost"
                          class="h-8 w-8 p-0"
                          onclick={() => openEdit(perm)}
                        >
                          <Icon icon="tdesign:edit" class="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          class="h-8 w-8 p-0 text-destructive"
                          onclick={() => handleDelete(perm.id)}
                        >
                          <Icon icon="tdesign:delete" class="size-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                {:else}
                  <Table.Row>
                    <Table.Cell colspan={6} class="h-24 text-center text-muted-foreground">
                      暂无数据
                    </Table.Cell>
                  </Table.Row>
                {/each}
              </Table.Body>
            </Table.Root>
          </ScrollArea>
        </div>
      {/if}
    </div>
  </div>
</div>

<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{editingPermission ? '编辑权限' : '新增权限'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>权限标识 *</Label>
        <Input bind:value={form.code} placeholder="如：system:user:read" />
      </div>
      <div class="grid gap-2">
        <Label>权限名称 *</Label>
        <Input bind:value={form.name} placeholder="请输入权限名称" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>类型</Label>
          <Select.Root type="single" bind:value={form.type}>
            <Select.Trigger>
              {typeOptions.find(o => o.value === form.type)?.label}
            </Select.Trigger>
            <Select.Content>
              {#each typeOptions as opt}
                <Select.Item value={opt.value}>{opt.label}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        <div class="grid gap-2">
          <Label>排序</Label>
          <Input bind:value={form.orderNum} type="number" />
        </div>
      </div>
      <div class="grid gap-2">
        <Label>描述</Label>
        <Input bind:value={form.description} placeholder="权限描述（可选）" />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => (dialogOpen = false)}>取消</Button>
      <Button onclick={handleSave} disabled={saving}>
        {saving ? '保存中...' : '保存'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
