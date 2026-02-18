<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import Icon from '@iconify/svelte';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { PaneGroup, Pane, Handle } from '$lib/components/ui/resizable';
  import { Button } from '$lib/components/ui/button';
  import SideHeader from './components/SideHeader.svelte';
  import SideNav from './components/SideNav.svelte';
  import SiteHeader from './components/SiteHeader.svelte';
  import UserFooter from './components/UserFooter.svelte';
  import ChatPanel from './components/ai-chat/chat-panel.svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { imStore } from '@/lib/stores/im.svelte';
  import { aiChatStore } from '@/lib/stores/ai-chat.svelte';
  import { actionsStore } from '@/lib/stores/actions.svelte';

  let { children } = $props();
  let isChecking = $state(true);
  let isOpen = $state(true);

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
    // 初始化 AI Chat store
    aiChatStore.init();
    // 预加载 Actions 列表（用于 MCP 配置等）
    actionsStore.load();
    
    isChecking = false;
  });

  onDestroy(() => {
    imStore.cleanup();
  });

  function handlePanelResize(sizes: number[]) {
    if (sizes.length >= 2) {
      aiChatStore.setPanelSize(sizes[1]);
    }
  }
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
    open={isOpen}
    onOpenChange={(newOpen) => {
      isOpen = newOpen;
    }}
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
    <Sidebar.Inset class="flex flex-col overflow-hidden">
      <SiteHeader />
      <div class="@container/main flex flex-1 overflow-hidden relative">
        <PaneGroup 
          direction="horizontal" 
          class="h-full w-full"
          onLayoutChange={handlePanelResize}
        >
          <!-- 主内容区域 -->
          <Pane defaultSize={aiChatStore.isPanelOpen ? 100 - aiChatStore.panelSize : 100} minSize={50}>
            <div class="flex flex-col h-full overflow-hidden">
              {@render children()}
            </div>
          </Pane>

          {#if aiChatStore.isPanelOpen}
            <Handle withHandle />
            <!-- AI 聊天面板 -->
            <Pane defaultSize={aiChatStore.panelSize} minSize={20} maxSize={50}>
              <ChatPanel />
            </Pane>
          {/if}
        </PaneGroup>

        <!-- AI 聊天按钮（面板关闭时显示） -->
        {#if !aiChatStore.isPanelOpen}
          <div class="fixed right-4 bottom-4 z-50">
            <Button 
              size="lg" 
              class="rounded-full size-12 shadow-lg"
              onclick={() => aiChatStore.togglePanel()}
            >
              <Icon icon="mdi:robot-outline" class="size-6" />
            </Button>
          </div>
        {/if}
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}
