<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
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
  import { pages, routePermissionMap } from '@/lib/generated-pages';

  let { children } = $props();
  let isChecking = $state(true);
  let isOpen = $state(true);
  let accessDenied = $state(false);
  
  // AI 聊天按钮状态
  let isButtonExpanded = $state(false);
  let collapseTimer: ReturnType<typeof setTimeout> | null = null;

  function handleTriggerEnter() {
    if (collapseTimer) {
      clearTimeout(collapseTimer);
      collapseTimer = null;
    }
    isButtonExpanded = true;
  }

  function handleTriggerLeave() {
    // 防抖收起，延迟 800ms
    collapseTimer = setTimeout(() => {
      isButtonExpanded = false;
    }, 800);
  }

  /**
   * 检查当前路由是否有访问权限
   * 支持动态路由参数匹配，如 /dashboard/system/users/123 匹配 /dashboard/system/users/[id]
   */
  function checkRoutePermission(pathname: string): boolean {
    // 超级管理员拥有所有权限
    if (authStore.hasRole('super_admin')) {
      return true;
    }

    // 首先尝试精确匹配
    const exactPermission = routePermissionMap[pathname];
    if (exactPermission) {
      return authStore.hasPermission(exactPermission);
    }

    // 尝试匹配动态路由
    // 将当前路径转换为可能的模式进行匹配
    for (const pageMeta of pages) {
      if (!pageMeta.permission) continue;
      
      // 将路由模式转换为正则表达式
      // [param] -> [^/]+
      const pattern = pageMeta.path
        .replace(/\[([^\]]+)\]/g, '[^/]+')
        .replace(/\//g, '\\/');
      
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pathname)) {
        return authStore.hasPermission(pageMeta.permission);
      }
    }

    // 没有定义权限的路由默认允许访问
    return true;
  }

  // 监听路由变化，进行权限检查
  $effect(() => {
    if (!isChecking && authStore.isAuthenticated) {
      const hasPermission = checkRoutePermission(page.url.pathname);
      accessDenied = !hasPermission;
    }
  });

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

    // 获取用户完整信息（包含权限和菜单）
    await authStore.fetchCurrentUser();
    
    // 初始化 IM store
    imStore.init();
    // 初始化 AI Chat store
    aiChatStore.init();
    // 预加载 Actions 列表（用于 MCP 配置等）
    actionsStore.load();
    
    isChecking = false;

    // 初始化完成后检查当前路由权限
    const hasPermission = checkRoutePermission(page.url.pathname);
    accessDenied = !hasPermission;
  });

  onDestroy(() => {
    imStore.cleanup();
    if (collapseTimer) {
      clearTimeout(collapseTimer);
    }
  });

  function handlePanelResize(sizes: number[]) {
    if (sizes.length >= 2) {
      aiChatStore.setPanelSize(sizes[1]);
    }
  }

  function goBack() {
    goto('/dashboard');
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
        {#if accessDenied}
          <!-- 无权限访问提示 -->
          <div class="flex flex-1 items-center justify-center">
            <div class="flex flex-col items-center gap-4 text-center">
              <div class="rounded-full bg-destructive/10 p-4">
                <Icon icon="tdesign:lock-on" class="size-12 text-destructive" />
              </div>
              <div class="space-y-2">
                <h2 class="text-xl font-semibold">访问受限</h2>
                <p class="text-muted-foreground max-w-md">
                  您没有权限访问此页面，请联系管理员获取相应权限。
                </p>
              </div>
              <Button onclick={goBack}>
                <Icon icon="tdesign:home" class="mr-2 size-4" />
                返回首页
              </Button>
            </div>
          </div>
        {:else}
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

          <!-- AI 聊天按钮（面板关闭时显示） - 右边缘吸附式 -->
          {#if !aiChatStore.isPanelOpen}
            <div 
              class="fixed right-0 top-1/2 -translate-y-1/2 z-50 group overflow-hidden"
              role="button"
              tabindex="0"
              onmouseenter={handleTriggerEnter}
              onmouseleave={handleTriggerLeave}
              onclick={() => aiChatStore.togglePanel()}
              onkeydown={(e) => e.key === 'Enter' && aiChatStore.togglePanel()}
            >
              <!-- 发光背景（仅展开时显示） -->
              <div class={[
                "absolute inset-0 bg-primary/20 blur-xl rounded-l-full transition-opacity duration-300",
                isButtonExpanded ? "opacity-60 group-hover:opacity-100" : "opacity-0"
              ].join(' ')}></div>
              
              <!-- 按钮主体 -->
              <div class={[
                "relative flex items-center gap-2 py-3 rounded-l-full",
                "bg-gradient-to-r from-primary to-primary/80",
                "shadow-lg shadow-primary/25",
                "transition-all duration-300 ease-out cursor-pointer",
                "hover:shadow-xl hover:shadow-primary/40",
                isButtonExpanded ? "pl-3 pr-2" : "pl-2 pr-1"
              ].join(' ')}>
                <!-- 图标 -->
                <Icon icon="mdi:robot-outline" class="size-5 text-primary-foreground shrink-0" />
                
                <!-- 文字（展开时显示） -->
                <span class={[
                  "text-sm font-medium text-primary-foreground whitespace-nowrap overflow-hidden",
                  "transition-all duration-300",
                  isButtonExpanded ? "opacity-100 max-w-24" : "opacity-0 max-w-0"
                ].join(' ')}>
                  AI 助手
                </span>
              </div>
            </div>
          {/if}
        {/if}
      </div>
    </Sidebar.Inset>
  </Sidebar.Provider>
{/if}
