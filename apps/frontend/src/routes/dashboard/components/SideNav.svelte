<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Sidebar from '@/lib/components/ui/sidebar';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { Badge } from '@/lib/components/ui/badge';
  import { tabsStore } from '@/lib/stores/tabs.svelte';
  import { imStore } from '@/lib/stores/im.svelte';
  import { groupedPages, type PageMeta } from '@/lib/generated-pages';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';

  // 过滤隐藏页面
  const visibleGroups = Object.entries(groupedPages)
    .filter(([key]) => key !== 'default')
    .map(([label, items]) => ({
      label,
      items: items.filter((p) => !p.hidden)
    }))
    .filter((g) => g.items.length > 0);

  let loaded = $state(false);
  let zoomLevel = $state(100);

  function detectZoom(): number {
    return Math.round(window.devicePixelRatio * 100);
  }

  function handleResize() {
    zoomLevel = detectZoom();
  }

  let mediaQuery: MediaQueryList | undefined;
  function handleMediaChange() {
    zoomLevel = detectZoom();
  }

  onMount(() => {
    const timer = setTimeout(() => {
      loaded = true;
    }, 800);

    zoomLevel = detectZoom();
    window.addEventListener('resize', handleResize);

    // 监听 devicePixelRatio 变化（更精确地捕获缩放）
    mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      mediaQuery?.removeEventListener('change', handleMediaChange);
    };
  });

  function handleNavClick(item: PageMeta) {
    tabsStore.open(item.path, item.title);
    goto(item.path);
  }

  function isContactsPage(path: string): boolean {
    return path === '/dashboard/contacts';
  }

  /**
   * 判断菜单项是否激活
   * 支持精确匹配和前缀匹配（子路由也高亮父菜单）
   */
  function isMenuActive(itemPath: string, currentPath: string): boolean {
    // 精确匹配
    if (currentPath === itemPath) return true;
    // 首页特殊处理：/dashboard 只精确匹配，不做前缀匹配
    if (itemPath === '/dashboard') return false;
    // 前缀匹配：当前路径以菜单路径开头（处理子路由如 /dashboard/users/123）
    if (currentPath.startsWith(itemPath + '/')) return true;
    return false;
  }
</script>

{#if loaded}
  {#each visibleGroups as group}
    <Sidebar.Group>
      <Sidebar.GroupLabel>{group.label}</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each group.items as item}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton 
                onclick={() => handleNavClick(item)}
                isActive={isMenuActive(item.path, $page.url.pathname)}
              >
                {#if item.icon}
                  <Icon icon={item.icon} class="size-4" />
                {/if}
                <span>{item.title}</span>
                {#if isContactsPage(item.path) && imStore.totalUnreadCount > 0}
                  <Badge variant="destructive" class="ml-auto h-5 min-w-5 px-1.5 text-xs">
                    {imStore.totalUnreadCount > 99 ? '99+' : imStore.totalUnreadCount}
                  </Badge>
                {/if}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  {/each}

  {#if zoomLevel !== 100}
    <Sidebar.Group>
      <Sidebar.GroupContent>
        <div class="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground">
          <Icon icon="tdesign:search" class="size-3.5" />
          <span>缩放 {zoomLevel}%</span>
        </div>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  {/if}
{:else}
  {#each [1, 2] as _}
    <Sidebar.Group>
      <Sidebar.GroupLabel>
        <Skeleton class="h-4 w-16" />
      </Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each [1, 2, 3] as __}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Skeleton class="size-4 rounded" />
                <Skeleton class="h-4 w-24" />
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  {/each}
{/if}
