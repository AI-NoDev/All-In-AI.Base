<script lang="ts">
  import CloseIcon from '@iconify-svelte/tdesign/close';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { Button } from '@/lib/components/ui/button';
  import { Separator } from '@/lib/components/ui/separator';
  import * as Sidebar from '@/lib/components/ui/sidebar';
  import { tabsStore } from '@/lib/stores/tabs.svelte';
  import { cn } from '@/lib/utils';

  // 同步当前路由到标签页
  $effect(() => {
    tabsStore.sync(page.url.pathname);
  });

  function handleTabClick(path: string) {
    goto(path);
  }

  function handleTabClose(e: MouseEvent, path: string) {
    e.stopPropagation();
    tabsStore.close(path);
  }
</script>

<header
  class="flex h-(--header-height) shrink-0 flex-col border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
>
  <div class="flex h-12 items-center gap-1 px-4 lg:gap-2 lg:px-6">
    <Sidebar.Trigger class="-ms-1" />
    <Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />

    <!-- 标签页区域 -->
    <div class="flex flex-1 items-center gap-1 overflow-x-auto">
      {#each tabsStore.tabs as tab (tab.path)}
        <button
          onclick={() => handleTabClick(tab.path)}
          class={cn(
            'group relative flex h-8 items-center gap-1.5 rounded-md px-3 text-sm transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            tabsStore.activeTab === tab.path
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground'
          )}
        >
          <span class="max-w-32 truncate">{tab.title}</span>
          {#if tab.closable}
            <span
              role="button"
              tabindex="0"
              onclick={(e) => handleTabClose(e, tab.path)}
              onkeydown={(e) => e.key === 'Enter' && handleTabClose(e as unknown as MouseEvent, tab.path)}
              class="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-muted-foreground/20 group-hover:opacity-100"
            >
              <CloseIcon class="size-3" />
            </span>
          {/if}
        </button>
      {/each}
    </div>
  </div>
</header>
