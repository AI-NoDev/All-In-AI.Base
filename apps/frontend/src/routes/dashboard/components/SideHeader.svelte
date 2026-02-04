<script lang="ts">
  import { onMount } from 'svelte';
  import * as Sidebar from '@/lib/components/ui/sidebar';
  import defaultLogo from '@/lib/assets/logo.png';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { systemConfigStore } from '@/lib/stores/system-config.svelte';

  let logo = $state<string | null>(null);
  let title = $state<string | null>(null);

  onMount(async () => {
    await systemConfigStore.load();
    logo = systemConfigStore.get('sys.site.logo', '') || defaultLogo;
    title = systemConfigStore.get('sys.site.name', 'All In AI Base System');
  });
</script>

<Sidebar.Menu>
  <Sidebar.MenuItem>
    <Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
      {#snippet child({ props })}
        <a href="/" {...props}>
          {#if logo}
            <img alt="logo" class="size-7" src={logo} />
          {:else}
            <Skeleton class="size-7 rounded-full" />
          {/if}
          {#if title}
            <span class="text-base font-semibold">{title}</span>
          {:else}
            <Skeleton class="h-6 w-[150px]" />
          {/if}
        </a>
      {/snippet}
    </Sidebar.MenuButton>
  </Sidebar.MenuItem>
</Sidebar.Menu>
