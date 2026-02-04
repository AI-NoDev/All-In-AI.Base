<script lang="ts">
  import { ModeWatcher } from 'mode-watcher';
  import { onMount } from 'svelte';
  import { preferencesStore } from '@/lib/stores/preferences.svelte';

  let { children } = $props();

  onMount(() => {
    preferencesStore.init();
  });
</script>

<ModeWatcher defaultMode={preferencesStore.theme} />
{@render children()}
