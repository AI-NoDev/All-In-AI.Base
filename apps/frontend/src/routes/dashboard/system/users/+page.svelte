<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import * as Card from '@/lib/components/ui/card';
  import * as Table from '@/lib/components/ui/table';
  import * as Pagination from '@/lib/components/ui/pagination';
  import * as Select from '@/lib/components/ui/select';
  import * as Tooltip from '@/lib/components/ui/tooltip';
  import { Button } from '@/lib/components/ui/button';
  import { Input } from '@/lib/components/ui/input';
  import { Badge } from '@/lib/components/ui/badge';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { ScrollArea } from '@/lib/components/ui/scroll-area';
  import { Checkbox } from '@/lib/components/ui/checkbox';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { 
    PostApiSystemUserQueryFieldEnum, 
    PostApiSystemUserQueryOrderEnum,
    PostApiSystemDepartmentQueryFieldEnum,
    PostApiSystemDepartmentQueryOrderEnum,
    PostApiSystemRoleQueryFieldEnum,
    PostApiSystemRoleQueryOrderEnum
  } from '@/lib/api/Api';

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
    email: string | null;
    phonenumber: string | null;
    status: string;
    userType: string;
    deptId: string | null;
    createdAt: string;
  }

  interface Role {
    id: string;
    name: string;
  }

  let departments = $state<DeptNode[]>([]);
  let roles = $state<Role[]>([]);
  let users = $state<User[]>([]);
  let loading = $state(true);
  let userLoading = $state(false);
  let selectedDeptId = $state<string | null>(null);
  let currentPage = $state(1);
  let pageSize = $state(10);
  let total = $state(0);
  let showFilter = $state(true);
  let selectedIds = $state<Set<string>>(new Set());
  let deleting = $state(false);

  let searchForm = $state({
    loginName: '',
    phonenumber: '',
    status: '',
    roleId: '',
    createdAtStart: '',
    createdAtEnd: '',
  });

  const statusOptions = [
    { value: '', label: '全部' },
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];

  // 是否是系统管理员（不可编辑/删除）
  function isSystemAdmin(user: User): boolean {
    return user.userType === '00';
  }

  // 是否全选（排除系统管理员）
  let selectableUsers = $derived(users.filter(u => !isSystemAdmin(u)));
  let allSelected = $derived(selectableUsers.length > 0 && selectableUsers.every(u => selectedIds.has(u.id)));
  let someSelected = $derived(selectedIds.size > 0 && !allSelected);

  function toggleSelectAll() {
    if (allSelected) {
      selectedIds = new Set();
    } else {
      // 只选择非系统管理员用户
      selectedIds = new Set(selectableUsers.map(u => u.id));
    }
  }

  function toggleSelect(id: string) {
    // 系统管理员不可选择
    const user = users.find(u => u.id === id);
    if (user && isSystemAdmin(user)) return;
    
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    selectedIds = newSet;
  }

  function buildDeptTree(flatDepts: any[]): DeptNode[] {
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
      const api = authStore.createApi(true);
      const res = await api.system.postApiSystemDepartmentQuery({
        limit: 100,
        offset: 0,
        sort: { field: PostApiSystemDepartmentQueryFieldEnum.OrderNum, order: PostApiSystemDepartmentQueryOrderEnum.Asc }
      });
      if (res.data?.data) {
        departments = buildDeptTree(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load departments:', err);
    }
  }

  async function loadRoles() {
    try {
      const api = authStore.createApi(true);
      const res = await api.system.postApiSystemRoleQuery({
        limit: 100,
        offset: 0,
        sort: { field: PostApiSystemRoleQueryFieldEnum.Sort, order: PostApiSystemRoleQueryOrderEnum.Asc }
      });
      if (res.data?.data) {
        roles = res.data.data;
      }
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  }

  async function loadUsers() {
    userLoading = true;
    selectedIds = new Set(); // 清空选中
    try {
      const api = authStore.createApi(true);
      const filter: Record<string, string | string[]> = {};
      if (selectedDeptId) filter.deptId = selectedDeptId;
      if (searchForm.loginName.trim()) filter.loginName = searchForm.loginName.trim();
      if (searchForm.phonenumber.trim()) filter.phonenumber = searchForm.phonenumber.trim();
      if (searchForm.status) filter.status = searchForm.status;
      if (searchForm.roleId) filter.roleId = searchForm.roleId;
      if (searchForm.createdAtStart) filter.createdAtStart = new Date(searchForm.createdAtStart).toISOString();
      if (searchForm.createdAtEnd) filter.createdAtEnd = new Date(searchForm.createdAtEnd + 'T23:59:59').toISOString();

      const res = await api.system.postApiSystemUserQuery({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        sort: { field: PostApiSystemUserQueryFieldEnum.CreatedAt, order: PostApiSystemUserQueryOrderEnum.Desc }
      } as Parameters<typeof api.system.postApiSystemUserQuery>[0]);
      if (res.data?.data) {
        users = res.data.data;
        total = res.data.total || users.length;
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      userLoading = false;
    }
  }

  function selectDept(deptId: string | null) {
    selectedDeptId = deptId;
    currentPage = 1;
    loadUsers();
  }

  function toggleDept(dept: DeptNode, e: Event) {
    e.stopPropagation();
    dept.expanded = !dept.expanded;
  }

  function handleSearch() {
    currentPage = 1;
    loadUsers();
  }

  function handleReset() {
    searchForm = { loginName: '', phonenumber: '', status: '', roleId: '', createdAtStart: '', createdAtEnd: '' };
    selectedDeptId = null;
    currentPage = 1;
    loadUsers();
  }

  function handleRefresh() {
    loadUsers();
  }

  async function handleBatchDelete() {
    if (selectedIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.size} 个用户吗？`)) return;
    
    deleting = true;
    try {
      const api = authStore.createApi(true);
      const ids = Array.from(selectedIds);
      // 批量删除
      await Promise.all(ids.map(id => 
        api.system.deleteApiSystemUserById({ id })
      ));
      selectedIds = new Set();
      loadUsers();
    } catch (err) {
      console.error('Failed to delete users:', err);
      alert('删除失败');
    } finally {
      deleting = false;
    }
  }

  async function handleDelete(id: string) {
    // 检查是否是系统管理员
    const user = users.find(u => u.id === id);
    if (user && isSystemAdmin(user)) {
      alert('系统管理员用户不能删除');
      return;
    }
    
    if (!confirm('确定要删除该用户吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.system.deleteApiSystemUserById({ id });
      loadUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('删除失败');
    }
  }

  async function handleContact(user: User) {
    // 不能和自己聊天
    if (user.id === authStore.user?.id) {
      alert('不能和自己发起会话');
      return;
    }
    
    try {
      const api = authStore.createApi(true);
      const res = await api.im.postApiImConversationPrivate({
        targetUserId: user.id,
        targetUserName: user.name || user.loginName,
      });
      
      if (res.data?.conversation) {
        // 跳转到联系人页面，带上会话ID
        goto(`/dashboard/contacts?conversationId=${res.data.conversation.id}`);
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
      alert('创建会话失败');
    }
  }

  async function handleResetPassword(user: User) {
    // 检查是否是系统管理员
    if (isSystemAdmin(user)) {
      alert('系统管理员用户不能重置密码');
      return;
    }
    
    if (!confirm(`确定要重置用户 "${user.loginName}" 的密码吗？`)) return;
    
    try {
      const api = authStore.createApi(true);
      const res = await api.system.postApiSystemUserByIdResetPassword({ id: user.id });
      if (res.data?.success) {
        alert('密码重置成功');
      } else {
        alert('密码重置失败');
      }
    } catch (err) {
      console.error('Failed to reset password:', err);
      alert('密码重置失败');
    }
  }

  function getStatusBadge(status: string) {
    return status === '0' 
      ? { variant: 'default' as const, text: '正常' }
      : { variant: 'secondary' as const, text: '停用' };
  }

  onMount(async () => {
    await Promise.all([loadDepartments(), loadRoles()]);
    await loadUsers();
    loading = false;
  });
</script>

<div class="flex flex-1 min-h-0 gap-4 px-4 lg:px-6 pb-4">
  <!-- 左侧部门树 -->
  <Card.Root class="w-56 shrink-0 flex flex-col">
    <Card.Header>
      <Card.Title class="text-base">部门列表</Card.Title>
    </Card.Header>
    <Card.Content class="p-0 flex-1 min-h-0">
      <ScrollArea class="h-full">
        {#if loading}
          <div class="space-y-2 p-4">
            {#each [1, 2, 3, 4, 5] as _}
              <Skeleton class="h-8 w-full" />
            {/each}
          </div>
        {:else}
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
        {/if}
      </ScrollArea>
    </Card.Content>
  </Card.Root>

  <!-- 右侧内容区 -->
  <div class="flex flex-1 flex-col gap-4">
    <!-- 搜索表单 -->
    {#if showFilter}
      <Card.Root>
        <Card.Content>
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground whitespace-nowrap">登录名</span>
              <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.loginName} />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground whitespace-nowrap">手机号</span>
              <Input placeholder="请输入" class="w-32 h-8" bind:value={searchForm.phonenumber} />
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
            <div class="flex items-center gap-2">
              <span class="text-sm text-muted-foreground whitespace-nowrap">角色</span>
              <Select.Root type="single" bind:value={searchForm.roleId}>
                <Select.Trigger class="w-32 h-8">
                  {roles.find(r => r.id === searchForm.roleId)?.name || '全部'}
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="">全部</Select.Item>
                  {#each roles as role}
                    <Select.Item value={role.id}>{role.name}</Select.Item>
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
        </Card.Content>
      </Card.Root>
    {/if}

    <!-- 用户列表 -->
    <Card.Root class="flex-1 flex flex-col min-h-0">
      <Card.Header class="pb-1">
        <div class="flex items-center justify-between">
          <!-- 左侧：新增、导入、导出、批量删除 -->
          <div class="flex gap-2">
            <Button size="sm" onclick={() => goto('/dashboard/system/users/new')}>
              <Icon icon="tdesign:add" class="mr-1 size-4" />新增
            </Button>
            <Button size="sm" variant="outline">
              <Icon icon="tdesign:upload" class="mr-1 size-4" />导入
            </Button>
            <Button size="sm" variant="outline">
              <Icon icon="tdesign:download" class="mr-1 size-4" />导出
            </Button>
            {#if selectedIds.size > 0}
              <Button size="sm" variant="destructive" onclick={handleBatchDelete} disabled={deleting}>
                {#if deleting}
                  <Icon icon="tdesign:loading" class="mr-1 size-4 animate-spin" />
                {:else}
                  <Icon icon="tdesign:delete" class="mr-1 size-4" />
                {/if}
                删除({selectedIds.size})
              </Button>
            {/if}
          </div>
          <!-- 右侧：筛选、刷新 -->
          <div class="flex gap-1">
            <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => showFilter = !showFilter} title={showFilter ? '隐藏筛选' : '显示筛选'}>
              <Icon icon={showFilter ? 'tdesign:filter-clear' : 'tdesign:filter'} class="size-4" />
            </Button>
            <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={handleRefresh} title="刷新">
              <Icon icon="tdesign:refresh" class="size-4" />
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Content class="flex-1 min-h-0 flex flex-col">
        {#if loading || userLoading}
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
                  <Table.Head class="w-12">
                    <Checkbox 
                      checked={allSelected}
                      indeterminate={someSelected}
                      onCheckedChange={toggleSelectAll}
                    />
                  </Table.Head>
                  <Table.Head class="w-32">用户名</Table.Head>
                  <Table.Head class="w-24">姓名</Table.Head>
                  <Table.Head class="w-40">邮箱</Table.Head>
                  <Table.Head class="w-32">手机号</Table.Head>
                  <Table.Head class="w-20">状态</Table.Head>
                  <Table.Head class="w-40">创建时间</Table.Head>
                  <Table.Head class="w-48 text-right">操作</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
              {#each users as user}
                {@const status = getStatusBadge(user.status)}
                {@const isSysAdmin = isSystemAdmin(user)}
                <Table.Row class={selectedIds.has(user.id) ? 'bg-muted/50' : ''}>
                  <Table.Cell>
                    <Checkbox 
                      checked={selectedIds.has(user.id)}
                      onCheckedChange={() => toggleSelect(user.id)}
                      disabled={isSysAdmin}
                    />
                  </Table.Cell>
                  <Table.Cell class="font-medium">
                    {user.loginName}
                    {#if isSysAdmin}
                      <Badge variant="outline" class="ml-1 text-xs">管理员</Badge>
                    {/if}
                  </Table.Cell>
                  <Table.Cell>{user.name || '-'}</Table.Cell>
                  <Table.Cell class="text-muted-foreground">{user.email || '-'}</Table.Cell>
                  <Table.Cell>{user.phonenumber || '-'}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={status.variant}>{status.text}</Badge>
                  </Table.Cell>
                  <Table.Cell class="text-muted-foreground">
                    {new Date(user.createdAt).toLocaleString('zh-CN')}
                  </Table.Cell>
                  <Table.Cell class="text-right">
                    <div class="flex justify-end gap-1">
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          {#if user.id === authStore.user?.id}
                            <Button size="sm" variant="ghost" class="h-8 w-8 p-0 opacity-50 cursor-not-allowed">
                              <Icon icon="tdesign:chat" class="size-4" />
                            </Button>
                          {:else}
                            <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => handleContact(user)}>
                              <Icon icon="tdesign:chat" class="size-4" />
                            </Button>
                          {/if}
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {user.id === authStore.user?.id ? '不能和自己聊天' : '联系'}
                        </Tooltip.Content>
                      </Tooltip.Root>
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          {#if isSysAdmin}
                            <Button size="sm" variant="ghost" class="h-8 w-8 p-0 opacity-50 cursor-not-allowed">
                              <Icon icon="tdesign:lock-on" class="size-4" />
                            </Button>
                          {:else}
                            <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => handleResetPassword(user)}>
                              <Icon icon="tdesign:lock-on" class="size-4" />
                            </Button>
                          {/if}
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {isSysAdmin ? '系统管理员不允许重置密码' : '重置密码'}
                        </Tooltip.Content>
                      </Tooltip.Root>
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          {#if isSysAdmin}
                            <Button size="sm" variant="ghost" class="h-8 w-8 p-0 opacity-50 cursor-not-allowed">
                              <Icon icon="tdesign:edit" class="size-4" />
                            </Button>
                          {:else}
                            <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => goto(`/dashboard/system/users/${user.id}`)}>
                              <Icon icon="tdesign:edit" class="size-4" />
                            </Button>
                          {/if}
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {isSysAdmin ? '系统管理员不允许编辑' : '编辑'}
                        </Tooltip.Content>
                      </Tooltip.Root>
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          {#if isSysAdmin}
                            <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive opacity-50 cursor-not-allowed">
                              <Icon icon="tdesign:delete" class="size-4" />
                            </Button>
                          {:else}
                            <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => handleDelete(user.id)}>
                              <Icon icon="tdesign:delete" class="size-4" />
                            </Button>
                          {/if}
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                          {isSysAdmin ? '系统管理员不允许删除' : '删除'}
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </div>
                  </Table.Cell>
                </Table.Row>
              {:else}
                <Table.Row>
                  <Table.Cell colspan={8} class="h-24 text-center text-muted-foreground">暂无数据</Table.Cell>
                </Table.Row>
              {/each}
              </Table.Body>
            </Table.Root>
          </ScrollArea>
          </div>

          {#if total > 0}
            <div class="mt-4 flex items-center justify-between">
              <span class="text-sm text-muted-foreground whitespace-nowrap">共 {total} 条记录</span>
              <Pagination.Root count={total} perPage={pageSize} bind:page={currentPage} onPageChange={() => loadUsers()}>
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
      </Card.Content>
    </Card.Root>
  </div>
</div>
