<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Sidebar from '$lib/components/ui/sidebar';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Badge } from '$lib/components/ui/badge';
  import { tabsStore } from '@/lib/stores/tabs.svelte';
  import { imStore } from '@/lib/stores/im.svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { i18n, t } from '@/lib/stores/i18n.svelte';
  import { groupedPages, type PageMeta } from '@/lib/generated-pages';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { dev } from '$app/environment';
  import { onMount } from 'svelte';

  // 读取 i18n.version 建立响应式依赖
  let _ = $derived(i18n.version);

  // 开发模式分组名 (i18n key)
  const DEV_GROUP_NAME = 'nav.group.dev';

  /**
   * 检查用户是否有权限访问某个页面
   * - 没有 permission 字段的页面默认允许访问
   * - 超级管理员拥有所有权限
   */
  function hasPagePermission(pageMeta: PageMeta): boolean {
    // 没有定义权限的页面，默认允许访问
    if (!pageMeta.permission) return true;
    
    // 使用 authStore 的权限检查
    return authStore.hasPermission(pageMeta.permission);
  }

  // 过滤隐藏页面和无权限页面，生产模式下隐藏开发模式分组
  let visibleGroups = $derived(
    Object.entries(groupedPages)
      .filter(([key]) => key !== 'default')
      .filter(([key]) => dev || key !== DEV_GROUP_NAME) // 生产模式隐藏开发模式
      .map(([label, items]) => ({
        label,
        items: items
          .filter((p) => !p.hidden) // 过滤隐藏页面
          .filter((p) => hasPagePermission(p)) // 过滤无权限页面
      }))
      .filter((g) => g.items.length > 0) // 过滤空分组
  );

  let loaded = $state(false);

  onMount(() => {
    const timer = setTimeout(() => {
      loaded = true;
    }, 800);

    return () => {
      clearTimeout(timer);
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
    // 首页特殊处理dashboard 只精确匹配，不做前缀匹配
    if (itemPath === '/dashboard') return false;
    // 前缀匹配：当前路径以菜单路径开头（处理子路由如 /dashboard/users/123）
    if (currentPath.startsWith(itemPath + '/')) return true;
    return false;
  }
</script>

{#if loaded}
  {#key _}
  {#each visibleGroups as group}
    <Sidebar.Group>
      <Sidebar.GroupLabel>{t(group.label)}</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each group.items as item}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton 
                onclick={() => handleNavClick(item)}
                isActive={isMenuActive(item.path, page.url.pathname)}
              >
                {#if item.icon}
                  <Icon icon={item.icon} class="size-4" />
                {/if}
                <span>{t(item.title)}</span>
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
  {/key}

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
