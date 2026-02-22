<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Sheet from '$lib/components/ui/sheet';
  import * as Table from '$lib/components/ui/table';
  import { Button } from '$lib/components/ui/button';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Input } from '$lib/components/ui/input';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import {
    PostApiSystemDepartmentQueryFieldEnum,
    PostApiSystemDepartmentQueryOrderEnum,
  } from '@qiyu-allinai/api';

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

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedUserIds: string[];
    onConfirm: (userIds: string[]) => void;
  }

  let { open, onOpenChange, selectedUserIds, onConfirm }: Props = $props();

  // State
  let departments = $state<DeptNode[]>([]);
  let users = $state<UserItem[]>([]);
  let selectedDeptId = $state<string | null>(null);
  let loading = $state(false);
  let userLoading = $state(false);
  let searchKeyword = $state('');
  let localSelectedIds = $state<Set<string>>(new Set());

  const api = authStore.createApi(true);

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

  function selectDept(deptId: string | null) {
    selectedDeptId = deptId;
    loadUsers(deptId);
  }

  function toggleDept(dept: DeptNode, e: Event) {
    e.stopPropagation();
    dept.expanded = !dept.expanded;
  }

  function toggleUser(userId: string) {
    const newSet = new Set(localSelectedIds);
    if (newSet.has(userId)) {
      newSet.delete(userId);
    } else {
      newSet.add(userId);
    }
    localSelectedIds = newSet;
  }

  function isUserSelected(userId: string): boolean {
    return localSelectedIds.has(userId);
  }

  function handleConfirm() {
    onConfirm(Array.from(localSelectedIds));
    onOpenChange(false);
  }

  // Filter users by search keyword
  let filteredUsers = $derived(
    searchKeyword
      ? users.filter(u => 
          u.loginName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          (u.name && u.name.toLowerCase().includes(searchKeyword.toLowerCase()))
        )
      : users
  );

  $effect(() => {
    if (open) {
      localSelectedIds = new Set(selectedUserIds);
      loading = true;
      Promise.all([
        loadDepartments(),
        loadUsers(null),
      ]).finally(() => {
        loading = false;
      });
    }
  });
</script>

<Sheet.Root {open} {onOpenChange}>
  <Sheet.Content side="right" class="!w-[70vw] !max-w-4xl p-0 flex flex-col">
    <Sheet.Header class="px-6 py-4 border-b shrink-0">
      <Sheet.Title>{t('page.notifications.userSelector')}</Sheet.Title>
      <Sheet.Description>{t('page.notifications.selectedUsers').replace('${count}', String(localSelectedIds.size))}</Sheet.Description>
    </Sheet.Header>

    <div class="flex-1 flex min-h-0 p-6 gap-4">
      {#if loading}
        <div class="flex-1 space-y-3">
          {#each [1, 2, 3, 4, 5] as _}
            <Skeleton class="h-12 w-full" />
          {/each}
        </div>
      {:else}
        <!-- Department tree -->
        <div class="w-56 shrink-0 border rounded-lg flex flex-col">
          <div class="px-3 py-2 border-b bg-muted/30 shrink-0">
            <span class="text-sm font-medium">{t('page.notifications.departmentList')}</span>
          </div>
          <ScrollArea class="flex-1">
            <div class="p-2">
              <button
                class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent {selectedDeptId === null ? 'bg-accent' : ''}"
                onclick={() => selectDept(null)}
              >
                <Icon icon="tdesign:tree-square-dot" class="size-4" />
                <span>{t('page.notifications.allDepartments')}</span>
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
          <div class="px-3 py-2 border-b bg-muted/30 shrink-0 flex items-center gap-2">
            <span class="text-sm font-medium">{t('page.notifications.userList')}</span>
            <div class="flex-1"></div>
            <Input
              type="text"
              placeholder={t('page.notifications.searchUser')}
              class="w-48 h-7 text-sm"
              bind:value={searchKeyword}
            />
          </div>
          <ScrollArea class="flex-1">
            {#if userLoading}
              <div class="p-4 space-y-2">
                {#each [1, 2, 3] as _}
                  <Skeleton class="h-10 w-full" />
                {/each}
              </div>
            {:else if filteredUsers.length === 0}
              <div class="p-8 text-center text-muted-foreground">{t('page.notifications.noUsers')}</div>
            {:else}
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.Head class="w-12"></Table.Head>
                    <Table.Head>{t('page.notifications.noticeTitle')}</Table.Head>
                    <Table.Head>{t('common.fields.name')}</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {#each filteredUsers as user}
                    <Table.Row 
                      class="cursor-pointer hover:bg-muted/50"
                      onclick={() => toggleUser(user.id)}
                    >
                      <Table.Cell>
                        <Checkbox 
                          checked={isUserSelected(user.id)} 
                          onCheckedChange={() => toggleUser(user.id)}
                        />
                      </Table.Cell>
                      <Table.Cell class="font-medium">{user.loginName}</Table.Cell>
                      <Table.Cell>{user.name || '-'}</Table.Cell>
                    </Table.Row>
                  {/each}
                </Table.Body>
              </Table.Root>
            {/if}
          </ScrollArea>
        </div>
      {/if}
    </div>

    <Sheet.Footer class="px-6 py-4 border-t shrink-0">
      <Button variant="outline" onclick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
      <Button onclick={handleConfirm}>{t('page.notifications.confirmSelection')}</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
