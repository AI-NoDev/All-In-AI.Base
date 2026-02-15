<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Sheet from '@qiyu-allinai/ui/components/sheet';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Input } from '@qiyu-allinai/ui/components/input';
  import { Label } from '@qiyu-allinai/ui/components/label';
  import { ScrollArea } from '@qiyu-allinai/ui/components/scroll-area';
  import { Checkbox } from '@qiyu-allinai/ui/components/checkbox';
  import { Avatar, AvatarFallback, AvatarImage } from '@qiyu-allinai/ui/components/avatar';
  import { Badge } from '@qiyu-allinai/ui/components/badge';
  import { authStore } from '@/lib/stores/auth.svelte';

  interface DeptNode {
    id: string;
    name: string;
    parentId: string | null;
    children?: DeptNode[];
    expanded?: boolean;
  }

  interface User {
    id: string;
    loginName: string;
    name: string | null;
    avatar: string | null;
    deptId: string | null;
  }

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (conversationId: string) => void;
  }

  let { open = $bindable(), onOpenChange, onCreated }: Props = $props();

  let departments = $state<DeptNode[]>([]);
  let users = $state<User[]>([]);
  let selectedDeptId = $state<string | null>(null);
  let selectedUsersMap = $state<Map<string, User>>(new Map()); // 独立存储已选用户
  let groupName = $state('');
  let searchQuery = $state('');
  let isLoading = $state(false);
  let isCreating = $state(false);

  const api = authStore.createApi(true);
  const currentUser = authStore.user;

  // 已选用户ID集合（从Map派生）
  let selectedUserIds = $derived(new Set(selectedUsersMap.keys()));

  // 默认群名
  let defaultGroupName = $derived(() => {
    const count = selectedUsersMap.size + 1; // +1 for current user
    return `${currentUser?.name || currentUser?.loginName || '我'}的(${count})人群聊`;
  });

  // 过滤用户（当前部门下的用户列表）
  let filteredUsers = $derived(
    users.filter(u => {
      if (u.id === currentUser?.id) return false; // 排除自己
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (u.name || '').toLowerCase().includes(query) || 
               u.loginName.toLowerCase().includes(query);
      }
      return true;
    })
  );

  // 已选用户列表（从Map派生，不受部门筛选影响）
  let selectedUsers = $derived(Array.from(selectedUsersMap.values()));

  async function loadDepartments() {
    try {
      const res = await api.system.postApiSystemDepartmentQuery({
        filter: {},
        limit: 100,
        offset: 0,
      });
      const data = res.data?.data || [];
      departments = buildDeptTree(data as DeptNode[]);
    } catch (e) {
      console.error('Failed to load departments:', e);
    }
  }

  function buildDeptTree(flatList: DeptNode[]): DeptNode[] {
    const map = new Map<string, DeptNode>();
    const roots: DeptNode[] = [];

    flatList.forEach(item => {
      map.set(item.id, { ...item, children: [], expanded: true });
    });

    flatList.forEach(item => {
      const node = map.get(item.id)!;
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }

  async function loadUsers(deptId: string | null) {
    isLoading = true;
    try {
      const filter: Record<string, unknown> = { status: '0' };
      if (deptId) filter.deptId = deptId;
      
      const res = await api.system.postApiSystemUserQuery({
        filter: filter as Parameters<typeof api.system.postApiSystemUserQuery>[0]['filter'],
        limit: 100,
        offset: 0,
      });
      users = (res.data?.data || []) as User[];
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      isLoading = false;
    }
  }

  function selectDept(deptId: string | null) {
    selectedDeptId = deptId;
    loadUsers(deptId);
  }

  function toggleUser(user: User) {
    const newMap = new Map(selectedUsersMap);
    if (newMap.has(user.id)) {
      newMap.delete(user.id);
    } else {
      newMap.set(user.id, user);
    }
    selectedUsersMap = newMap;
  }

  function removeUser(userId: string) {
    const newMap = new Map(selectedUsersMap);
    newMap.delete(userId);
    selectedUsersMap = newMap;
  }

  function toggleDept(dept: DeptNode) {
    dept.expanded = !dept.expanded;
    departments = [...departments];
  }

  async function handleCreate() {
    if (selectedUserIds.size === 0) {
      alert('请至少选择一个成员');
      return;
    }

    isCreating = true;
    try {
      const name = groupName.trim() || defaultGroupName();
      const res = await api.im.postApiImConversationGroup({
        name,
        memberIds: Array.from(selectedUsersMap.keys()),
      });
      
      if (res.data?.conversation) {
        onCreated(res.data.conversation.id);
        handleClose();
      }
    } catch (e) {
      console.error('Failed to create group:', e);
      alert('创建群聊失败');
    } finally {
      isCreating = false;
    }
  }

  function handleClose() {
    open = false;
    onOpenChange(false);
    // 重置状态
    selectedUsersMap = new Map();
    groupName = '';
    searchQuery = '';
    selectedDeptId = null;
  }

  function getInitials(name: string | null): string {
    if (!name) return '?';
    return name.slice(0, 2);
  }

  $effect(() => {
    if (open) {
      loadDepartments();
      loadUsers(null);
    }
  });
</script>

<Sheet.Root bind:open onOpenChange={onOpenChange}>
  <Sheet.Content class="sm:max-w-3xl p-0 flex flex-col">
    <Sheet.Header class="p-6 pb-4 border-b shrink-0">
      <Sheet.Title>创建群聊</Sheet.Title>
      <Sheet.Description>选择成员创建新的群聊会话</Sheet.Description>
    </Sheet.Header>

    <div class="flex-1 flex min-h-0">
      <!-- 左侧：部门树 -->
      <div class="w-48 border-r flex flex-col">
        <div class="p-3 border-b">
          <span class="text-sm font-medium">部门</span>
        </div>
        <div class="flex-1 min-h-0">
          <ScrollArea class="h-full">
            <div class="p-2">
              <button
                class="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-accent {selectedDeptId === null ? 'bg-accent font-medium' : ''}"
                onclick={() => selectDept(null)}
              >
                全部用户
              </button>
              {#each departments as dept}
                {@render deptNode(dept, 0)}
              {/each}
            </div>
          </ScrollArea>
        </div>
      </div>

      <!-- 中间：用户列表 -->
      <div class="flex-1 flex flex-col min-w-0">
        <div class="p-2 border-b">
          <Input 
            placeholder="搜索用户..." 
            class="h-8" 
            bind:value={searchQuery}
          />
        </div>
        <div class="flex-1 min-h-0">
          <ScrollArea class="h-full">
            <div class="p-2 space-y-1">
              {#if isLoading}
                <div class="py-8 text-center text-muted-foreground text-sm">
                  加载中...
                </div>
              {:else if filteredUsers.length === 0}
                <div class="py-8 text-center text-muted-foreground text-sm">
                  暂无用户
                </div>
              {:else}
                {#each filteredUsers as user}
                  <button
                    class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left"
                    onclick={() => toggleUser(user)}
                  >
                    <Checkbox checked={selectedUserIds.has(user.id)} />
                    <Avatar class="size-8">
                      <AvatarImage src={user.avatar || ''} />
                      <AvatarFallback class="text-xs">
                        {getInitials(user.name || user.loginName)}
                      </AvatarFallback>
                    </Avatar>
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-sm truncate">{user.name || user.loginName}</div>
                      <div class="text-xs text-muted-foreground truncate">{user.loginName}</div>
                    </div>
                  </button>
                {/each}
              {/if}
            </div>
          </ScrollArea>
        </div>
      </div>

      <!-- 右侧：已选成员 -->
      <div class="w-56 border-l flex flex-col">
        <div class="p-3 border-b flex items-center justify-between">
          <span class="text-sm font-medium">已选成员</span>
          <Badge variant="secondary">{selectedUserIds.size}</Badge>
        </div>
        <div class="flex-1 min-h-0">
          <ScrollArea class="h-full">
            <div class="p-2 space-y-1">
              {#if selectedUsers.length === 0}
                <div class="py-4 text-center text-muted-foreground text-sm">
                  请选择成员
                </div>
              {:else}
                {#each selectedUsers as user}
                  <div class="flex items-center gap-2 p-2 rounded-lg bg-accent/50">
                    <Avatar class="size-6">
                      <AvatarImage src={user.avatar || ''} />
                      <AvatarFallback class="text-xs">
                        {getInitials(user.name || user.loginName)}
                      </AvatarFallback>
                    </Avatar>
                    <span class="flex-1 text-sm truncate">{user.name || user.loginName}</span>
                    <button
                      class="size-5 rounded hover:bg-destructive/20 flex items-center justify-center"
                      onclick={() => removeUser(user.id)}
                    >
                      <Icon icon="tdesign:close" class="size-3" />
                    </button>
                  </div>
                {/each}
              {/if}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>

    <!-- 底部：群名和操作 -->
    <div class="p-4 border-t space-y-4 shrink-0">
      <div class="space-y-2">
        <Label for="groupName">群聊名称</Label>
        <Input 
          id="groupName"
          placeholder={defaultGroupName()}
          bind:value={groupName}
        />
        <p class="text-xs text-muted-foreground">
          留空将使用默认名称：{defaultGroupName()}
        </p>
      </div>
      <div class="flex justify-end gap-2">
        <Button variant="outline" onclick={handleClose}>取消</Button>
        <Button onclick={handleCreate} disabled={isCreating || selectedUserIds.size === 0}>
          {#if isCreating}
            创建中...
          {:else}
            创建群聊 ({selectedUserIds.size + 1}人)
          {/if}
        </Button>
      </div>
    </div>
  </Sheet.Content>
</Sheet.Root>

{#snippet deptNode(dept: DeptNode, level: number)}
  <div>
    <div
      class="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-accent flex items-center gap-1 cursor-pointer {selectedDeptId === dept.id ? 'bg-accent font-medium' : ''}"
      style="padding-left: {8 + level * 12}px"
      role="button"
      tabindex="0"
      onclick={() => selectDept(dept.id)}
      onkeydown={(e) => e.key === 'Enter' && selectDept(dept.id)}
    >
      {#if dept.children && dept.children.length > 0}
        <span
          class="size-4 flex items-center justify-center cursor-pointer"
          role="button"
          tabindex="0"
          onclick={(e) => { e.stopPropagation(); toggleDept(dept); }}
          onkeydown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); toggleDept(dept); } }}
        >
          <Icon 
            icon={dept.expanded ? 'tdesign:chevron-down' : 'tdesign:chevron-right'} 
            class="size-3" 
          />
        </span>
      {:else}
        <span class="size-4"></span>
      {/if}
      <span class="truncate">{dept.name}</span>
    </div>
    {#if dept.expanded && dept.children}
      {#each dept.children as child}
        {@render deptNode(child, level + 1)}
      {/each}
    {/if}
  </div>
{/snippet}
