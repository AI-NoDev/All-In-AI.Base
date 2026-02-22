<script lang="ts">
  import DotsVerticalIcon from '@iconify-svelte/tdesign/ellipsis';
  import LogoutIcon from '@iconify-svelte/tdesign/logout';
  import NotificationIcon from '@iconify-svelte/tdesign/notification';
  import UserCircleIcon from '@iconify-svelte/tdesign/user-circle';
  import * as Avatar from '$lib/components/ui/avatar';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Badge } from '$lib/components/ui/badge';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { goto } from '$app/navigation';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { notificationStore } from '@/lib/stores/notification.svelte';
  import { i18n, t } from '@/lib/stores/i18n.svelte';
  import { tabsStore } from '@/lib/stores/tabs.svelte';

  let _ = $derived(i18n.version);

  const sidebar = Sidebar.useSidebar();

  const user = $derived(authStore.user ? {
    name: authStore.user.name || authStore.user.loginName,
    email: authStore.user.email || '',
    avatar: authStore.user.avatar || ''
  } : null);

  const initials = $derived(user?.name ? user.name.slice(0, 2).toUpperCase() : 'U');

  function handleAccount() {
    tabsStore.open('/dashboard/account', 'nav.title.account');
    goto('/dashboard/account');
  }

  function handleNotifications() {
    tabsStore.open('/dashboard/notifications', 'nav.title.notifications');
    goto('/dashboard/notifications');
  }

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
        {#key _}
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
          <DropdownMenu.Item onclick={handleAccount}>
            <UserCircleIcon />
            {t('nav.userMenu_account')}
          </DropdownMenu.Item>
          <DropdownMenu.Item onclick={handleNotifications}>
            <NotificationIcon />
            {t('nav.userMenu_notifications')}
            {#if notificationStore.unreadCount > 0}
              <Badge variant="destructive" class="ml-auto h-5 min-w-5 px-1.5 text-xs">
                {notificationStore.unreadCount > 99 ? '99+' : notificationStore.unreadCount}
              </Badge>
            {/if}
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onclick={handleLogout}>
          <LogoutIcon />
          {t('nav.userMenu_logout')}
        </DropdownMenu.Item>
        {/key}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </Sidebar.MenuItem>
</Sidebar.Menu>
