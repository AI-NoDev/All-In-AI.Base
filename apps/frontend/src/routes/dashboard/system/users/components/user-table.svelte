<script lang="ts">
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import * as Pagination from '$lib/components/ui/pagination';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { DataTable } from '$lib/components/common';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';

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
    users, loading, total, currentPage = $bindable(), pageSize, selectedIds,
    showFilter, deleting, onPageChange, onToggleFilter, onRefresh, onBatchDelete,
    onDelete, onContact, onResetPassword, onToggleSelect, onToggleSelectAll, onAssignRoles
  }: Props = $props();

  function isSystemAdmin(user: User): boolean {
    return user.userType === '00';
  }

  const columns = [
    { key: 'loginName', title: t('db.system.user.loginName'), width: 128, fixed: 'left' as const, render: loginNameRender },
    { key: 'name', title: t('db.system.user.name'), width: 96 },
    { key: 'email', title: t('db.system.user.email'), width: 180, render: mutedRender },
    { key: 'phonenumber', title: t('db.system.user.phonenumber'), width: 128 },
    { key: 'status', title: t('common.fields.status'), width: 80, render: statusRender },
    { key: 'createdAt', title: t('common.fields.createdAt'), width: 170, render: dateRender },
    { key: 'id', title: t('common.actions.more'), width: 192, align: 'right' as const, fixed: 'right' as const, render: actionsRender },
  ];
</script>

{#snippet loginNameRender({ row })}
  <span class="font-medium">{row.loginName}</span>
  {#if isSystemAdmin(row)}
    <Badge variant="outline" class="ml-1 text-xs">{t('page.system.user.sysAdminHint')}</Badge>
  {/if}
{/snippet}

{#snippet mutedRender({ value })}
  <span class="text-muted-foreground">{value || '-'}</span>
{/snippet}

{#snippet statusRender({ value })}
  <Badge variant={value === '0' ? 'default' : 'secondary'}>
    {value === '0' ? t('common.status.enabled') : t('common.status.disabled')}
  </Badge>
{/snippet}

{#snippet dateRender({ value })}
  <span class="text-muted-foreground">{new Date(String(value)).toLocaleString('zh-CN')}</span>
{/snippet}

{#snippet actionsRender({ row })}
  {@const isSysAdmin = isSystemAdmin(row)}
  <div class="flex justify-end gap-1">
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0 {row.id === authStore.user?.id ? 'opacity-50 cursor-not-allowed' : ''}" 
          onclick={() => row.id !== authStore.user?.id && onContact(row)} disabled={row.id === authStore.user?.id}>
          <Icon icon="tdesign:chat" class="size-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{row.id === authStore.user?.id ? t('page.im.cannotChatSelf') : t('common.actions.send')}</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0 {isSysAdmin ? 'opacity-50 cursor-not-allowed' : ''}" 
          onclick={() => !isSysAdmin && onResetPassword(row)} disabled={isSysAdmin}>
          <Icon icon="tdesign:lock-on" class="size-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{isSysAdmin ? t('page.system.user.sysAdminHint') : t('page.system.user.resetPassword')}</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0 {isSysAdmin ? 'opacity-50 cursor-not-allowed' : ''}" 
          onclick={() => !isSysAdmin && onAssignRoles(row)} disabled={isSysAdmin}>
          <Icon icon="tdesign:usergroup" class="size-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{isSysAdmin ? t('page.system.user.sysAdminHint') : t('page.system.user.assignRoles')}</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0 {isSysAdmin ? 'opacity-50 cursor-not-allowed' : ''}" 
          onclick={() => !isSysAdmin && goto(`/dashboard/system/users/${row.id}`)} disabled={isSysAdmin}>
          <Icon icon="tdesign:edit" class="size-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{isSysAdmin ? t('page.system.user.sysAdminNoEdit') : t('common.actions.edit')}</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive {isSysAdmin ? 'opacity-50 cursor-not-allowed' : ''}" 
          onclick={() => !isSysAdmin && onDelete(row.id)} disabled={isSysAdmin}>
          <Icon icon="tdesign:delete" class="size-4" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{isSysAdmin ? t('page.system.user.sysAdminNoDelete') : t('common.actions.delete')}</Tooltip.Content>
    </Tooltip.Root>
  </div>
{/snippet}

<div class="flex-1 flex flex-col min-h-0 pt-4">
  <div class="pb-1">
    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <Button size="sm" onclick={() => goto('/dashboard/system/users/new')}>
          <Icon icon="tdesign:add" class="mr-1 size-4" />{t('common.actions.add')}
        </Button>
        <Button size="sm" variant="outline">
          <Icon icon="tdesign:upload" class="mr-1 size-4" />{t('common.actions.import')}
        </Button>
        <Button size="sm" variant="outline">
          <Icon icon="tdesign:download" class="mr-1 size-4" />{t('common.actions.export')}
        </Button>
        {#if selectedIds.size > 0}
          <Button size="sm" variant="destructive" onclick={onBatchDelete} disabled={deleting}>
            {#if deleting}
              <Icon icon="tdesign:loading" class="mr-1 size-4 animate-spin" />
            {:else}
              <Icon icon="tdesign:delete" class="mr-1 size-4" />
            {/if}
            {t('common.actions.delete')}({selectedIds.size})
          </Button>
        {/if}
      </div>
      <div class="flex gap-1">
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onToggleFilter}>
          <Icon icon={showFilter ? 'tdesign:filter-clear' : 'tdesign:filter'} class="size-4" />
        </Button>
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onRefresh}>
          <Icon icon="tdesign:refresh" class="size-4" />
        </Button>
      </div>
    </div>
  </div>
  <div class="flex-1 min-h-0 flex flex-col pt-2">
    <DataTable 
      {columns} 
      data={users} 
      {loading}
      selectable
      {selectedIds}
      {onToggleSelect}
      {onToggleSelectAll}
      disableSelect={isSystemAdmin}
    />

    {#if total > 0 && !loading}
      <div class="mt-4 flex items-center justify-between">
        <span class="text-sm text-muted-foreground whitespace-nowrap">{t('common.pagination.total').replace('${total}', String(total))}</span>
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
  </div>
</div>
