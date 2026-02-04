<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Sidebar from '@/lib/components/ui/sidebar';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { Badge } from '@/lib/components/ui/badge';
  import { tabsStore } from '@/lib/stores/tabs.svelte';
  import { imStore } from '@/lib/stores/im.svelte';
  import { groupedPages, type PageMeta } from '@/lib/generated-pages';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // 过滤隐藏页面
  const visibleGroups = Object.entries(groupedPages)
    .filter(([key]) => key !== 'default')
    .map(([label, items]) => ({
      label,
      items: items.filter((p) => !p.hidden)
    }))
    .filter((g) => g.items.length > 0);

  let loaded = $state(false);

  onMount(() => {
    const timer = setTimeout(() => {
      loaded = true;
    }, 800);
    return () => clearTimeout(timer);
  });

  function handleNavClick(item: PageMeta) {
    tabsStore.open(item.path, item.title);
    goto(item.path);
  }

  function isContactsPage(path: string): boolean {
    return path === '/dashboard/contacts';
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
              <Sidebar.MenuButton onclick={() => handleNavClick(item)}>
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
