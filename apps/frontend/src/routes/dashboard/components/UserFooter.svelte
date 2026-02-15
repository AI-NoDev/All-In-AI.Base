<script lang="ts">
  import CreditCardIcon from '@iconify-svelte/tdesign/creditcard';
  import DotsVerticalIcon from '@iconify-svelte/tdesign/ellipsis';
  import LogoutIcon from '@iconify-svelte/tdesign/logout';
  import NotificationIcon from '@iconify-svelte/tdesign/notification';
  import UserCircleIcon from '@iconify-svelte/tdesign/user-circle';
  import * as Avatar from '@qiyu-allinai/ui/components/avatar';
  import * as DropdownMenu from '@qiyu-allinai/ui/components/dropdown-menu';
  import { Skeleton } from '@qiyu-allinai/ui/components/skeleton';
  import * as Sidebar from '@qiyu-allinai/ui/components/sidebar';
  import { goto } from '$app/navigation';
  import { authStore } from '@/lib/stores/auth.svelte';

  const sidebar = Sidebar.useSidebar();

  // 从 authStore 获取用户信息
  const user = $derived(authStore.user ? {
    name: authStore.user.name || authStore.user.loginName,
    email: authStore.user.email || '',
    avatar: authStore.user.avatar || ''
  } : null);

  // 获取用户名首字母作为头像 fallback
  const initials = $derived(user?.name ? user.name.slice(0, 2).toUpperCase() : 'U');

  async function handleLogout() {
    await authStore.logout();
    goto('/login', { replaceState: true });
  }
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton
            {...props}
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            {#if user}
              <Avatar.Root class="size-8 rounded-lg grayscale">
                <Avatar.Image src={user.avatar} alt={user.name} />
                <Avatar.Fallback class="rounded-lg">{initials}</Avatar.Fallback>
              </Avatar.Root>
              <div class="grid flex-1 text-start text-sm leading-tight">
                <span class="truncate font-medium">{user.name}</span>
                <span class="text-muted-foreground truncate text-xs">{user.email}</span>
              </div>
              <DotsVerticalIcon class="ms-auto size-4" />
            {:else}
              <Skeleton class="size-8 rounded-full" />
              <div class="grid flex-1 gap-1">
                <Skeleton class="h-4 w-24" />
                <Skeleton class="h-3 w-32" />
              </div>
              <Skeleton class="ms-auto size-4 rounded" />
            {/if}
          </Sidebar.MenuButton>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
        side={sidebar.isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Label class="p-0 font-normal">
          <div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
            {#if user}
              <Avatar.Root class="size-8 rounded-lg grayscale">
                <Avatar.Image src={user.avatar} alt={user.name} />
                <Avatar.Fallback class="rounded-lg">{initials}</Avatar.Fallback>
              </Avatar.Root>
              <div class="grid flex-1 text-start text-sm leading-tight">
                <span class="truncate font-medium">{user.name}</span>
                <span class="text-muted-foreground truncate text-xs">{user.email}</span>
              </div>
            {:else}
              <Skeleton class="size-8 rounded-full" />
              <div class="grid flex-1 gap-1">
                <Skeleton class="h-4 w-24" />
                <Skeleton class="h-3 w-32" />
              </div>
            {/if}
          </div>
        </DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Item>
            <UserCircleIcon />
            账户
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <CreditCardIcon />
            账单
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <NotificationIcon />
            通知
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onclick={handleLogout}>
          <LogoutIcon />
          退出登录
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
