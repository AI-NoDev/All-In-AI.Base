<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface UsersPageSnapshot {
    selectedDeptId: string | null;
    currentPage: number;
    showFilter: boolean;
    selectedIds: string[];
    searchForm: {
      loginName: string;
      phonenumber: string;
      status: string;
      roleId: string;
      createdAtStart: string;
      createdAtEnd: string;
    };
  }

  let pageState: UsersPageSnapshot = {
    selectedDeptId: null,
    currentPage: 1,
    showFilter: true,
    selectedIds: [],
    searchForm: {
      loginName: '',
      phonenumber: '',
      status: '',
      roleId: '',
      createdAtStart: '',
      createdAtEnd: '',
    },
  };

  let restoreCallback: ((value: UsersPageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<UsersPageSnapshot> = {
    capture: () => pageState,
    restore: (value) => {
      pageState = value;
      if (restoreCallback) restoreCallback(value);
    }
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { 
    PostApiSystemUserQueryFieldEnum, 
    PostApiSystemUserQueryOrderEnum,
    PostApiSystemDepartmentQueryFieldEnum,
    PostApiSystemDepartmentQueryOrderEnum,
    PostApiSystemRoleQueryFieldEnum,
    PostApiSystemRoleQueryOrderEnum
  } from '@qiyu-allinai/api';
  import DeptTree from './components/dept-tree.svelte';
  import SearchFilter from './components/search-filter.svelte';
  import UserTable from './components/user-table.svelte';
  import RoleDialog from './components/role-dialog.svelte';

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

  interface Department {
    id: string;
    name: string;
    parentId: string | null;
  }

  let departments = $state<DeptNode[]>([]);
  let roles = $state<Role[]>([]);
  let users = $state<User[]>([]);
  let loading = $state(true);
  let userLoading = $state(false);
  let selectedDeptId = $state<string | null>(pageState.selectedDeptId);
  let currentPage = $state(pageState.currentPage);
  let pageSize = $state(10);
  let total = $state(0);
  let showFilter = $state(pageState.showFilter);
  let selectedIds = $state<Set<string>>(new Set(pageState.selectedIds));
  let deleting = $state(false);

  // 角色分配对话框状态
  let roleDialogOpen = $state(false);
  let selectedUser = $state<User | null>(null);

  let searchForm = $state({ ...pageState.searchForm });

  // Register restore callback
  restoreCallback = (value) => {
    selectedDeptId = value.selectedDeptId;
    currentPage = value.currentPage;
    showFilter = value.showFilter;
    selectedIds = new Set(value.selectedIds);
    searchForm = { ...value.searchForm };
  };

  // Sync state changes back to module-level for snapshot
  $effect(() => {
    pageState = {
      selectedDeptId,
      currentPage,
      showFilter,
      selectedIds: Array.from(selectedIds),
      searchForm: { ...searchForm },
    };
  });

  function isSystemAdmin(user: User): boolean {
    return user.userType === '00';
  }

  function buildDeptTree(flatDepts: Department[]): DeptNode[] {
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
    selectedIds = new Set();
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

  function handleSelectDept(deptId: string | null) {
    selectedDeptId = deptId;
    currentPage = 1;
    loadUsers();
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

  function handlePageChange() {
    loadUsers();
  }

  function handleToggleFilter() {
    showFilter = !showFilter;
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
      await Promise.all(ids.map(id => api.system.deleteApiSystemUserById({ id })));
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
        goto(`/dashboard/contacts/chat?id=${res.data.conversation.id}`);
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
      alert('创建会话失败');
    }
  }

  async function handleResetPassword(user: User) {
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

  function handleToggleSelect(id: string) {
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

  function handleToggleSelectAll() {
    const selectableUsers = users.filter(u => !isSystemAdmin(u));
    const allSelected = selectableUsers.length > 0 && selectableUsers.every(u => selectedIds.has(u.id));
    
    if (allSelected) {
      selectedIds = new Set();
    } else {
      selectedIds = new Set(selectableUsers.map(u => u.id));
    }
  }

  function handleAssignRoles(user: User) {
    selectedUser = user;
    roleDialogOpen = true;
  }

  onMount(async () => {
    await Promise.all([loadDepartments(), loadRoles()]);
    await loadUsers();
    loading = false;
  });
</script>

<div class="flex flex-1 min-h-0 px-4 lg:px-6 pb-4">
  <DeptTree 
    {departments} 
    {loading} 
    {selectedDeptId} 
    onSelectDept={handleSelectDept} 
  />

  <div class="flex flex-1 flex-col pl-4">
    {#if showFilter}
      <SearchFilter 
        bind:searchForm 
        {roles} 
        onSearch={handleSearch} 
        onReset={handleReset} 
      />
    {/if}

    <UserTable 
      {users}
      loading={loading || userLoading}
      {total}
      bind:currentPage
      {pageSize}
      {selectedIds}
      {showFilter}
      {deleting}
      onPageChange={handlePageChange}
      onToggleFilter={handleToggleFilter}
      onRefresh={handleRefresh}
      onBatchDelete={handleBatchDelete}
      onDelete={handleDelete}
      onContact={handleContact}
      onResetPassword={handleResetPassword}
      onToggleSelect={handleToggleSelect}
      onToggleSelectAll={handleToggleSelectAll}
      onAssignRoles={handleAssignRoles}
    />
  </div>
</div>

{#if selectedUser}
  <RoleDialog 
    bind:open={roleDialogOpen}
    userId={selectedUser.id}
    userName={selectedUser.name || selectedUser.loginName}
    onClose={() => selectedUser = null}
    onSaved={() => {}}
  />
{/if}
