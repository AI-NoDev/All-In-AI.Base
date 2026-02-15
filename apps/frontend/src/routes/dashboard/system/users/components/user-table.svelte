<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import * as Table from '$lib/components/ui/table';
  import * as Pagination from '$lib/components/ui/pagination';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { authStore } from '@/lib/stores/auth.svelte';

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

  interface Props {
    users: User[];
    loading: boolean;
    total: number;
    currentPage: number;
    pageSize: number;
    selectedIds: Set<string>;
    showFilter: boolean;
    deleting: boolean;
    onPageChange: (page: number) => void;
    onToggleFilter: () => void;
    onRefresh: () => void;
    onBatchDelete: () => void;
    onDelete: (id: string) => void;
    onContact: (user: User) => void;
    onResetPassword: (user: User) => void;
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    onAssignRoles: (user: User) => void;
  }

  let { 
    users, 
    loading, 
    total, 
    currentPage = $bindable(), 
    pageSize, 
    selectedIds,
    showFilter,
    deleting,
    onPageChange,
    onToggleFilter,
    onRefresh,
    onBatchDelete,
    onDelete,
    onContact,
    onResetPassword,
    onToggleSelect,
    onToggleSelectAll,
    onAssignRoles
  }: Props = $props();

  function isSystemAdmin(user: User): boolean {
    return user.userType === '00';
  }

  let selectableUsers = $derived(users.filter(u => !isSystemAdmin(u)));
  let allSelected = $derived(selectableUsers.length > 0 && selectableUsers.every(u => selectedIds.has(u.id)));
  let someSelected = $derived(selectedIds.size > 0 && !allSelected);

  function getStatusBadge(status: string) {
    return status === '0' 
      ? { variant: 'default' as const, text: '正常' }
      : { variant: 'secondary' as const, text: '停用' };
  }
</script>

<div class="flex-1 flex flex-col min-h-0 pt-4">
  <div class="pb-1">
    <div class="flex items-center justify-between">
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
          <Button size="sm" variant="destructive" onclick={onBatchDelete} disabled={deleting}>
            {#if deleting}
              <Icon icon="tdesign:loading" class="mr-1 size-4 animate-spin" />
            {:else}
              <Icon icon="tdesign:delete" class="mr-1 size-4" />
            {/if}
            删除({selectedIds.size})
          </Button>
        {/if}
      </div>
      <div class="flex gap-1">
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onToggleFilter} title={showFilter ? '隐藏筛选' : '显示筛选'}>
          <Icon icon={showFilter ? 'tdesign:filter-clear' : 'tdesign:filter'} class="size-4" />
        </Button>
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onRefresh} title="刷新">
          <Icon icon="tdesign:refresh" class="size-4" />
        </Button>
      </div>
    </div>
  </div>
  <div class="flex-1 min-h-0 flex flex-col pt-2">
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
              <Table.Head class="w-12">
                <Checkbox 
                  checked={allSelected}
                  indeterminate={someSelected}
                  onCheckedChange={onToggleSelectAll}
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
                  onCheckedChange={() => onToggleSelect(user.id)}
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
                        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => onContact(user)}>
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
                        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => onResetPassword(user)}>
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
                          <Icon icon="tdesign:usergroup" class="size-4" />
                        </Button>
                      {:else}
                        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => onAssignRoles(user)}>
                          <Icon icon="tdesign:usergroup" class="size-4" />
                        </Button>
                      {/if}
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                      {isSysAdmin ? '系统管理员拥有所有角色' : '分配角色'}
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
                        <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => onDelete(user.id)}>
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
          <Pagination.Root count={total} perPage={pageSize} bind:page={currentPage} onPageChange={() => onPageChange(currentPage)}>
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
  </div>
</div>
