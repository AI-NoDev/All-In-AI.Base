<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import * as Sheet from '@/lib/components/ui/sheet';
  import * as Table from '@/lib/components/ui/table';
  import * as Select from '@/lib/components/ui/select';
  import { Button } from '@/lib/components/ui/button';
  import { Checkbox } from '@/lib/components/ui/checkbox';
  import { ScrollArea } from '@/lib/components/ui/scroll-area';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { Badge } from '@/lib/components/ui/badge';
  import { authStore } from '@/lib/stores/auth.svelte';
  import {
    PostApiSystemDepartmentQueryFieldEnum,
    PostApiSystemDepartmentQueryOrderEnum,
  } from '@/lib/api/Api';
  import type { PermissionLevel, PermissionGrantee } from './types';

  interface DeptNode {
    id: string;
    name: string;
    parentId: string | null;
    children?: DeptNode[];
    expanded?: boolean;
  }

  interface UserItem {
    id: string;
    loginName: string;
    name: string | null;
    deptId: string | null;
  }

  interface RoleItem {
    id: string;
    name: string;
  }

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resourceType: 'folder' | 'file';
    resourceId: string;
    resourceName: string;
    isPublic: boolean;
    onSave: (isPublic: boolean, permissions: PermissionGrantee[]) => void;
  }

  let { open, onOpenChange, resourceType, resourceId, resourceName, isPublic: initialIsPublic, onSave }: Props = $props();

  // State
  let isPublic = $state(false);
  let activeTab = $state<'users' | 'roles' | 'depts'>('users');
  let departments = $state<DeptNode[]>([]);
  let users = $state<UserItem[]>([]);
  let roles = $state<RoleItem[]>([]);
  let selectedDeptId = $state<string | null>(null);
  let loading = $state(false);
  let userLoading = $state(false);

  // Permission map: granteeType:granteeId -> permissionLevel
  let permissionMap = $state<Map<string, PermissionLevel>>(new Map());

  const api = authStore.createApi(true);

  const permissionLevelOptions = [
    { value: '', label: '无权限' },
    { value: 'r', label: '只读' },
    { value: 'w', label: '读写' },
    { value: 'm', label: '管理' },
  ];

  function getPermissionKey(granteeType: string, granteeId: string): string {
    return `${granteeType}:${granteeId}`;
  }

  function getPermissionLevel(granteeType: string, granteeId: string): PermissionLevel | '' {
    return permissionMap.get(getPermissionKey(granteeType, granteeId)) || '';
  }

  function setPermissionLevel(granteeType: string, granteeId: string, level: PermissionLevel | '') {
    const key = getPermissionKey(granteeType, granteeId);
    const newMap = new Map(permissionMap);
    if (level === '') {
      newMap.delete(key);
    } else {
      newMap.set(key, level);
    }
    permissionMap = newMap;
  }

  function buildDeptTree(flatDepts: DeptNode[]): DeptNode[] {
    const map = new Map<string, DeptNode>();
    const roots: DeptNode[] = [];
    flatDepts.forEach(dept => {
      map.set(dept.id, { ...dept, children: [], expanded: true });
    });
    flatDepts.forEach(dept => {
      const node = map.get(dept.id)!;
      if (dept.parentId && map.has(dept.parentId)) {
        map.get(dept.parentId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }

  async function loadDepartments() {
    try {
      const res = await api.system.postApiSystemDepartmentQuery({
        limit: 100,
        offset: 0,
        sort: { field: PostApiSystemDepartmentQueryFieldEnum.OrderNum, order: PostApiSystemDepartmentQueryOrderEnum.Asc }
      });
      if (res.data?.data) {
        departments = buildDeptTree(res.data.data as DeptNode[]);
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  }

  async function loadRoles() {
    try {
      const res = await api.system.postApiSystemRoleQuery({ limit: 100 });
      roles = (res.data?.data || []) as RoleItem[];
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  }

  async function loadUsers(deptId: string | null) {
    userLoading = true;
    try {
      const filter = deptId ? { deptId } : undefined;
      const res = await api.system.postApiSystemUserQuery({
        filter,
        limit: 100,
      });
      users = (res.data?.data || []) as UserItem[];
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      userLoading = false;
    }
  }

  async function loadExistingPermissions() {
    try {
      const res = await api.knowledge.getApiKnowledgeResourcePermissionResourceByResourceTypeByResourceId({
        resourceType,
        resourceId,
      });
      const permissions = res.data || [];
      const newMap = new Map<string, PermissionLevel>();
      for (const p of permissions) {
        const key = getPermissionKey(p.granteeType, p.granteeId);
        newMap.set(key, p.permissionLevel as PermissionLevel);
      }
      permissionMap = newMap;
    } catch (err) {
      console.error('Failed to load existing permissions:', err);
      permissionMap = new Map();
    }
  }

  function selectDept(deptId: string | null) {
    selectedDeptId = deptId;
    loadUsers(deptId);
  }

  function toggleDept(dept: DeptNode, e: Event) {
    e.stopPropagation();
    dept.expanded = !dept.expanded;
  }

  function handleSave() {
    const permissions: PermissionGrantee[] = [];
    permissionMap.forEach((level, key) => {
      const [granteeType, granteeId] = key.split(':');
      permissions.push({
        granteeType: granteeType as 'user' | 'role' | 'dept',
        granteeId,
        permissionLevel: level,
      });
    });
    onSave(isPublic, permissions);
  }

  function getPermissionBadge(level: PermissionLevel | ''): { variant: 'default' | 'secondary' | 'outline'; text: string } {
    switch (level) {
      case 'r': return { variant: 'secondary', text: '只读' };
      case 'w': return { variant: 'default', text: '读写' };
      case 'm': return { variant: 'default', text: '管理' };
      default: return { variant: 'outline', text: '无' };
    }
  }

  // Count permissions by type
  let userPermCount = $derived(
    Array.from(permissionMap.keys()).filter(k => k.startsWith('user:')).length
  );
  let rolePermCount = $derived(
    Array.from(permissionMap.keys()).filter(k => k.startsWith('role:')).length
  );
  let deptPermCount = $derived(
    Array.from(permissionMap.keys()).filter(k => k.startsWith('dept:')).length
  );

  $effect(() => {
    if (open) {
      isPublic = initialIsPublic;
      permissionMap = new Map();
      loading = true;
      Promise.all([
        loadDepartments(),
        loadRoles(),
        loadUsers(null),
        loadExistingPermissions(),
      ]).finally(() => {
        loading = false;
      });
    }
  });
</script>

<Sheet.Root {open} {onOpenChange}>
  <Sheet.Content side="right" class="!w-[80vw] !max-w-none p-0 flex flex-col">
    <Sheet.Header class="px-6 py-4 border-b shrink-0">
      <Sheet.Title>编辑权限 - {resourceName}</Sheet.Title>
      <Sheet.Description>设置{resourceType === 'folder' ? '文件夹' : '文件'}的访问权限</Sheet.Description>
    </Sheet.Header>

    <div class="flex-1 flex flex-col min-h-0 p-6">
      <!-- Public toggle -->
      <div class="flex items-center gap-4 mb-4 shrink-0">
        <div class="flex items-center gap-2">
          <Checkbox id="isPublic" checked={isPublic} onCheckedChange={(v) => (isPublic = !!v)} />
          <label for="isPublic" class="text-sm font-medium">公开访问</label>
        </div>
        <span class="text-sm text-muted-foreground">
          {isPublic ? '所有人都可以访问此资源' : '仅授权用户可以访问'}
        </span>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 border-b mb-4 shrink-0">
        <button
          class="px-4 py-2.5 text-sm {activeTab === 'users' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}"
          onclick={() => (activeTab = 'users')}
        >
          用户权限 ({userPermCount})
        </button>
        <button
          class="px-4 py-2.5 text-sm {activeTab === 'roles' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}"
          onclick={() => (activeTab = 'roles')}
        >
          角色权限 ({rolePermCount})
        </button>
        <button
          class="px-4 py-2.5 text-sm {activeTab === 'depts' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}"
          onclick={() => (activeTab = 'depts')}
        >
          部门权限 ({deptPermCount})
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 min-h-0">
        {#if loading}
          <div class="space-y-3">
            {#each [1, 2, 3, 4, 5] as _}
              <Skeleton class="h-12 w-full" />
            {/each}
          </div>
        {:else if activeTab === 'users'}
          <!-- Users tab: department tree on left, user list on right -->
          <div class="flex gap-4 h-full">
            <!-- Department tree -->
            <div class="w-56 shrink-0 border rounded-lg">
              <div class="px-3 py-2 border-b bg-muted/30">
                <span class="text-sm font-medium">部门列表</span>
              </div>
              <ScrollArea class="h-[calc(100%-40px)]">
                <div class="p-2">
                  <button
                    class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent {selectedDeptId === null ? 'bg-accent' : ''}"
                    onclick={() => selectDept(null)}
                  >
                    <Icon icon="tdesign:tree-square-dot" class="size-4" />
                    <span>全部部门</span>
                  </button>
                  {#snippet renderTree(nodes: DeptNode[], level: number = 0)}
                    {#each nodes as node}
                      <div style="padding-left: {level * 12}px">
                        <div
                          class="flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:bg-accent cursor-pointer {selectedDeptId === node.id ? 'bg-accent' : ''}"
                          role="button"
                          tabindex="0"
                          onclick={() => selectDept(node.id)}
                          onkeydown={(e) => e.key === 'Enter' && selectDept(node.id)}
                        >
                          {#if node.children && node.children.length > 0}
                            <span 
                              class="p-0.5 hover:bg-muted rounded cursor-pointer"
                              role="button"
                              tabindex="0"
                              onclick={(e) => toggleDept(node, e)}
                              onkeydown={(e) => e.key === 'Enter' && toggleDept(node, e)}
                            >
                              <Icon icon={node.expanded ? 'tdesign:chevron-down' : 'tdesign:chevron-right'} class="size-3" />
                            </span>
                          {:else}
                            <span class="w-4"></span>
                          {/if}
                          <Icon icon="tdesign:folder" class="size-4 text-muted-foreground" />
                          <span class="truncate">{node.name}</span>
                        </div>
                        {#if node.expanded && node.children && node.children.length > 0}
                          {@render renderTree(node.children, level + 1)}
                        {/if}
                      </div>
                    {/each}
                  {/snippet}
                  {@render renderTree(departments)}
                </div>
              </ScrollArea>
            </div>

            <!-- User list -->
            <div class="flex-1 border rounded-lg flex flex-col min-h-0">
              <div class="px-3 py-2 border-b bg-muted/30 shrink-0">
                <span class="text-sm font-medium">用户列表</span>
              </div>
              <ScrollArea class="flex-1">
                {#if userLoading}
                  <div class="p-4 space-y-2">
                    {#each [1, 2, 3] as _}
                      <Skeleton class="h-10 w-full" />
                    {/each}
                  </div>
                {:else if users.length === 0}
                  <div class="p-8 text-center text-muted-foreground">暂无用户</div>
                {:else}
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.Head class="w-32">用户名</Table.Head>
                        <Table.Head class="w-24">姓名</Table.Head>
                        <Table.Head class="w-32">权限</Table.Head>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {#each users as user}
                        {@const level = getPermissionLevel('user', user.id)}
                        <Table.Row>
                          <Table.Cell class="font-medium">{user.loginName}</Table.Cell>
                          <Table.Cell>{user.name || '-'}</Table.Cell>
                          <Table.Cell>
                            <Select.Root type="single" value={level} onValueChange={(v) => setPermissionLevel('user', user.id, v as PermissionLevel | '')}>
                              <Select.Trigger class="w-24 h-8">
                                {@const badge = getPermissionBadge(level)}
                                <Badge variant={badge.variant}>{badge.text}</Badge>
                              </Select.Trigger>
                              <Select.Content>
                                {#each permissionLevelOptions as opt}
                                  <Select.Item value={opt.value}>{opt.label}</Select.Item>
                                {/each}
                              </Select.Content>
                            </Select.Root>
                          </Table.Cell>
                        </Table.Row>
                      {/each}
                    </Table.Body>
                  </Table.Root>
                {/if}
              </ScrollArea>
            </div>
          </div>
        {:else if activeTab === 'roles'}
          <!-- Roles tab -->
          <div class="border rounded-lg flex flex-col h-full">
            <div class="px-3 py-2 border-b bg-muted/30 shrink-0">
              <span class="text-sm font-medium">角色列表</span>
            </div>
            <ScrollArea class="flex-1">
              {#if roles.length === 0}
                <div class="p-8 text-center text-muted-foreground">暂无角色</div>
              {:else}
                <Table.Root>
                  <Table.Header>
                    <Table.Row>
                      <Table.Head>角色名称</Table.Head>
                      <Table.Head class="w-32">权限</Table.Head>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {#each roles as role}
                      {@const level = getPermissionLevel('role', role.id)}
                      <Table.Row>
                        <Table.Cell class="font-medium">{role.name}</Table.Cell>
                        <Table.Cell>
                          <Select.Root type="single" value={level} onValueChange={(v) => setPermissionLevel('role', role.id, v as PermissionLevel | '')}>
                            <Select.Trigger class="w-24 h-8">
                              {@const badge = getPermissionBadge(level)}
                              <Badge variant={badge.variant}>{badge.text}</Badge>
                            </Select.Trigger>
                            <Select.Content>
                              {#each permissionLevelOptions as opt}
                                <Select.Item value={opt.value}>{opt.label}</Select.Item>
                              {/each}
                            </Select.Content>
                          </Select.Root>
                        </Table.Cell>
                      </Table.Row>
                    {/each}
                  </Table.Body>
                </Table.Root>
              {/if}
            </ScrollArea>
          </div>
        {:else}
          <!-- Departments tab -->
          <div class="border rounded-lg flex flex-col h-full">
            <div class="px-3 py-2 border-b bg-muted/30 shrink-0">
              <span class="text-sm font-medium">部门列表</span>
            </div>
            <ScrollArea class="flex-1">
              {#if departments.length === 0}
                <div class="p-8 text-center text-muted-foreground">暂无部门</div>
              {:else}
                <div class="p-2">
                  {#snippet renderDeptPermTree(nodes: DeptNode[], level: number = 0)}
                    {#each nodes as node}
                      {@const level_perm = getPermissionLevel('dept', node.id)}
                      <div style="padding-left: {level * 16}px" class="flex items-center gap-2 py-1.5 px-2 hover:bg-muted/50 rounded">
                        <Icon icon="tdesign:folder" class="size-4 text-muted-foreground shrink-0" />
                        <span class="flex-1 text-sm">{node.name}</span>
                        <Select.Root type="single" value={level_perm} onValueChange={(v) => setPermissionLevel('dept', node.id, v as PermissionLevel | '')}>
                          <Select.Trigger class="w-24 h-8">
                            {@const badge = getPermissionBadge(level_perm)}
                            <Badge variant={badge.variant}>{badge.text}</Badge>
                          </Select.Trigger>
                          <Select.Content>
                            {#each permissionLevelOptions as opt}
                              <Select.Item value={opt.value}>{opt.label}</Select.Item>
                            {/each}
                          </Select.Content>
                        </Select.Root>
                      </div>
                      {#if node.children && node.children.length > 0}
                        {@render renderDeptPermTree(node.children, level + 1)}
                      {/if}
                    {/each}
                  {/snippet}
                  {@render renderDeptPermTree(departments)}
                </div>
              {/if}
            </ScrollArea>
          </div>
        {/if}
      </div>
    </div>

    <Sheet.Footer class="px-6 py-4 border-t shrink-0">
      <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
      <Button onclick={handleSave}>保存</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
