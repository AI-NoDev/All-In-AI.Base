<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { PathItem } from './types';

  interface Props {
    pathStack: PathItem[];
    onNavigate: (index: number) => void;
  }

  let { pathStack, onNavigate }: Props = $props();
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
        {item.name}
      </button>
    {:else}
      <span class="font-medium">{item.name}</span>
    {/if}
  {/each}
</div>
