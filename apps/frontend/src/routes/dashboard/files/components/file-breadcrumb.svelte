<script lang="ts">
  import Icon from '@iconify/svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import type { PathItem } from './types';

  interface Props {
    pathStack: PathItem[];
    onNavigate: (index: number) => void;
  }

  let { pathStack, onNavigate }: Props = $props();

  // Translate root folder name
  function getDisplayName(item: PathItem, index: number): string {
    // First item with null id is the root folder
    if (index === 0 && item.id === null) {
      return t('page.knowledge.rootFolder');
    }
    return item.name;
  }
</script>

<div class="flex items-center gap-1 text-sm">
  {#each pathStack as item, index}
    {#if index > 0}
      <Icon icon="tdesign:chevron-right" class="size-4 text-muted-foreground" />
    {/if}
    {#if index < pathStack.length - 1}
      <button
        class="text-muted-foreground hover:text-foreground transition-colors"
        onclick={() => onNavigate(index)}
      >
        {getDisplayName(item, index)}
      </button>
    {:else}
      <span class="font-medium">{getDisplayName(item, index)}</span>
    {/if}
  {/each}
</div>
