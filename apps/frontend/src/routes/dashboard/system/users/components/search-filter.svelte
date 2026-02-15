<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';

  interface Role {
    id: string;
    name: string;
  }

  interface SearchForm {
    loginName: string;
    phonenumber: string;
    status: string;
    roleId: string;
    createdAtStart: string;
    createdAtEnd: string;
  }

  interface Props {
    searchForm: SearchForm;
    roles: Role[];
    onSearch: () => void;
    onReset: () => void;
  }

  let { searchForm = $bindable(), roles, onSearch, onReset }: Props = $props();

  const statusOptions = [
    { value: '', label: '全部' },
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];
</script>

<div class="py-3 border-b border-border">
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
      <Button size="sm" class="h-8" onclick={onSearch}>
        <Icon icon="tdesign:search" class="mr-1 size-4" />搜索
      </Button>
      <Button size="sm" variant="outline" class="h-8" onclick={onReset}>
        <Icon icon="tdesign:refresh" class="mr-1 size-4" />重置
      </Button>
    </div>
  </div>
</div>
