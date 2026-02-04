<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import * as Sidebar from '@/lib/components/ui/sidebar';
  import SideHeader from './components/SideHeader.svelte';
  import SideNav from './components/SideNav.svelte';
  import SiteHeader from './components/SiteHeader.svelte';
  import UserFooter from './components/UserFooter.svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { imStore } from '@/lib/stores/im.svelte';

  let { children } = $props();
  let isChecking = $state(true);

  onMount(async () => {
    // 检查是否已登录
    if (!authStore.isAuthenticated) {
      goto('/login', { replaceState: true });
      return;
    }
    
    // 验证 token 是否有效
    if (authStore.isTokenExpired()) {
      const refreshed = await authStore.refreshAccessToken();
      if (!refreshed) {
        await authStore.logout();
        goto('/login', { replaceState: true });
        return;
      }
    }
    
    // 初始化 IM store
    imStore.init();
    
    isChecking = false;
  });

  onDestroy(() => {
    imStore.cleanup();
  });
</script>

{#if isChecking}
  <div class="flex min-h-svh items-center justify-center">
    <div class="flex flex-col items-center gap-2">
      <svg class="h-8 w-8 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-muted-foreground text-sm">加载中...</span>
    </div>
  </div>
{:else}
  <Sidebar.Provider
    style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
  >
    <Sidebar.Root collapsible="offcanvas" variant="inset">
      <Sidebar.Header>
        <SideHeader />
      </Sidebar.Header>
      <Sidebar.Content>
        <SideNav />
      </Sidebar.Content>
      <Sidebar.Footer>
        <UserFooter />
      </Sidebar.Footer>
    </Sidebar.Root>
    <Sidebar.Inset>
        <SiteHeader />
        <div class="@container/main pt-2 flex flex-1 flex-col min-h-0">
            {@render children()}
        </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}
