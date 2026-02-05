<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { onMount } from 'svelte';
  import { preferencesStore } from '@/lib/stores/preferences.svelte';
  import { Toaster } from '@/lib/components/ui/sonner';

  let { children } = $props();

  onMount(() => {
    preferencesStore.init();
  });
</script>

<ModeWatcher defaultMode={preferencesStore.theme} />
<Toaster />
{@render children()}
