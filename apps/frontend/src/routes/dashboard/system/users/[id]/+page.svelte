<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface UserFormSnapshot {
    name: string;
    deptId: string;
    phonenumber: string;
    email: string;
    loginName: string;
    sex: string;
    status: string;
    postIds: string[];
    roleIds: string[];
  }

  let formState: UserFormSnapshot = {
    name: '',
    deptId: '',
    phonenumber: '',
    email: '',
    loginName: '',
    sex: '0',
    status: '0',
    postIds: [],
    roleIds: [],
  };

  let restoreCallback: ((value: UserFormSnapshot) => void) | null = null;

  export const snapshot: Snapshot<UserFormSnapshot> = {
    capture: () => formState,
    restore: (value) => {
      formState = value;
      if (restoreCallback) restoreCallback(value);
    }
  };
</script>

<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Icon from '@iconify/svelte';
  import * as Select from '@qiyu-allinai/ui/components/select';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Input } from '@qiyu-allinai/ui/components/input';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { SelectByDictGroup } from '@/lib/components/common';

  interface Option { id: string; name: string; }
  interface DeptOption { id: string; name: string; parentId: string | null; }

  let userId = $derived(page.params.id);

  let departments = $state<DeptOption[]>([]);
  let roles = $state<Option[]>([]);
  let posts = $state<Option[]>([]);
  let loading = $state(true);
  let submitting = $state(false);
  let dataLoaded = $state(false);
  let isSystemAdmin = $state(false);
  let snapshotRestored = $state(formState.name !== '');

  let form = $state<UserFormSnapshot>({ ...formState });

  // Register restore callback
  restoreCallback = (value) => {
    form = { ...value, postIds: [...value.postIds], roleIds: [...value.roleIds] };
  };

  // Sync form changes back to module-level state for snapshot
  $effect(() => {
    formState = { ...form, postIds: [...form.postIds], roleIds: [...form.roleIds] };
  });

  async function loadData(id: string) {
    // Skip loading user data if form was restored from snapshot
    if (snapshotRestored) {
      // Still need to load options for dropdowns
      try {
        const api = authStore.createApi(true);
        const [deptRes, roleRes, postRes] = await Promise.all([
          api.system.postApiSystemDepartmentQuery({ limit: 100, offset: 0 } as Parameters<typeof api.system.postApiSystemDepartmentQuery>[0]),
          api.system.postApiSystemRoleQuery({ limit: 100, offset: 0 } as Parameters<typeof api.system.postApiSystemRoleQuery>[0]),
          api.system.postApiSystemPostQuery({ limit: 100, offset: 0 } as Parameters<typeof api.system.postApiSystemPostQuery>[0]),
        ]);
        if (deptRes.data?.data) departments = deptRes.data.data;
        if (roleRes.data?.data) roles = roleRes.data.data;
        if (postRes.data?.data) posts = postRes.data.data;
      } catch (err) {
        console.error('Failed to load options:', err);
      } finally {
        loading = false;
      }
      return;
    }
    try {
      const api = authStore.createApi(true);
      const [deptRes, roleRes, postRes, userRes] = await Promise.all([
        api.system.postApiSystemDepartmentQuery({ limit: 100, offset: 0 } as Parameters<typeof api.system.postApiSystemDepartmentQuery>[0]),
        api.system.postApiSystemRoleQuery({ limit: 100, offset: 0 } as Parameters<typeof api.system.postApiSystemRoleQuery>[0]),
        api.system.postApiSystemPostQuery({ limit: 100, offset: 0 } as Parameters<typeof api.system.postApiSystemPostQuery>[0]),
        api.system.getApiSystemUserById({ id }),
      ]);
      if (deptRes.data?.data) departments = deptRes.data.data;
      if (roleRes.data?.data) roles = roleRes.data.data;
      if (postRes.data?.data) posts = postRes.data.data;
      
      const user = userRes.data;
      if (user) {
        if (user.userType === '00') {
          isSystemAdmin = true;
        }
        
        form.name = user.name || '';
        form.deptId = user.deptId || '';
        form.phonenumber = user.phonenumber || '';
        form.email = user.email || '';
        form.loginName = user.loginName || '';
        form.sex = user.sex || '0';
        form.status = user.status || '0';
        form.postIds = user.postIds || [];
        form.roleIds = user.roleIds || [];
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    if (userId && !dataLoaded) {
      dataLoaded = true;
      loadData(userId);
    }
  });

  async function handleSubmit() {
    if (!userId) return;
    
    if (isSystemAdmin) {
      alert('系统管理员用户不能修改');
      return;
    }
    
    if (!form.loginName || !form.name) {
      alert('请填写必填项');
      return;
    }
    submitting = true;
    try {
      const api = authStore.createApi(true);
      await (api as any).http.request({
        path: `/api/system/user/${userId}`,
        method: 'PUT',
        body: {
          data: {
            name: form.name,
            deptId: form.deptId || null,
            phonenumber: form.phonenumber || null,
            email: form.email || null,
            loginName: form.loginName,
            sex: form.sex,
            status: form.status,
            postIds: form.postIds.length > 0 ? form.postIds : null,
            roleIds: form.roleIds.length > 0 ? form.roleIds : null,
          }
        },
        type: 'application/json',
        format: 'json',
      });
      goto('/dashboard/system/users');
    } catch (err) {
      console.error('Failed to update user:', err);
      alert('更新失败');
    } finally {
      submitting = false;
    }
  }

  function handleCancel() {
    goto('/dashboard/system/users');
  }
</script>

<div class="flex flex-col gap-6 px-4 lg:px-6">
  <div>
    <h2 class="text-lg font-semibold">
      编辑用户
      {#if isSystemAdmin}
        <span class="ml-2 text-sm font-normal text-destructive">（系统管理员，不可修改）</span>
      {/if}
    </h2>
    <p class="text-sm text-muted-foreground">修改用户信息</p>
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-8">
      <Icon icon="tdesign:loading" class="size-6 animate-spin" />
    </div>
  {:else}
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">用户名称 <span class="text-destructive">*</span></label>
        <Input placeholder="请输入用户名称" bind:value={form.name} />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">归属部门</label>
        <Select.Root type="single" bind:value={form.deptId}>
          <Select.Trigger>{departments.find(d => d.id === form.deptId)?.name || '请选择'}</Select.Trigger>
          <Select.Content>
            <Select.Item value="">无</Select.Item>
            {#each departments as dept}
              <Select.Item value={dept.id}>{dept.name}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">手机号码</label>
        <Input placeholder="请输入手机号码" bind:value={form.phonenumber} />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">邮箱</label>
        <Input type="email" placeholder="请输入邮箱" bind:value={form.email} />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">登录账号 <span class="text-destructive">*</span></label>
        <Input placeholder="请输入登录账号" bind:value={form.loginName} />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-muted-foreground">登录密码（不修改请留空）</label>
        <Input type="password" placeholder="不修改请留空" disabled />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">用户性别</label>
        <SelectByDictGroup groupKey="sys_user_sex" bind:value={form.sex} />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">用户状态</label>
        <SelectByDictGroup groupKey="sys_normal_disable" bind:value={form.status} />
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">岗位</label>
        <Select.Root type="multiple" bind:value={form.postIds}>
          <Select.Trigger>{form.postIds.length > 0 ? `已选 ${form.postIds.length} 个` : '请选择'}</Select.Trigger>
          <Select.Content>
            {#each posts as post}
              <Select.Item value={post.id}>{post.name}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium">角色</label>
        <Select.Root type="multiple" bind:value={form.roleIds}>
          <Select.Trigger>{form.roleIds.length > 0 ? `已选 ${form.roleIds.length} 个` : '请选择'}</Select.Trigger>
          <Select.Content>
            {#each roles as role}
              <Select.Item value={role.id}>{role.name}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  {/if}

  <div class="flex justify-end gap-2">
    <Button variant="outline" onclick={handleCancel} disabled={submitting}>取消</Button>
    <Button onclick={handleSubmit} disabled={loading || submitting || isSystemAdmin}>
      {#if submitting}
        <Icon icon="tdesign:loading" class="mr-1 size-4 animate-spin" />
      {/if}
      确定
    </Button>
  </div>
</div>
