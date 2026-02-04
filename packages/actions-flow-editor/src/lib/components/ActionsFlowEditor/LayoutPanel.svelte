<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import type { LayoutDirection } from '../../layout.js';

  interface Props {
    onApplyLayout: (direction: LayoutDirection) => void;
  }

  let { onApplyLayout }: Props = $props();
</script>

<div class="flex gap-1">
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <button
          {...props}
          class="px-3 py-1.5 bg-card border border-border rounded text-xs text-muted-foreground hover:bg-muted hover:border-border transition-colors"
          onclick={() => onApplyLayout('TB')}
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="8" y="2" width="8" height="4" rx="1" />
            <rect x="3" y="18" width="8" height="4" rx="1" />
            <rect x="13" y="18" width="8" height="4" rx="1" />
            <path d="M12 6v6M12 12l-5 6M12 12l5 6" />
          </svg>
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>垂直布局</p>
    </Tooltip.Content>
  </Tooltip.Root>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <button
          {...props}
          class="px-3 py-1.5 bg-card border border-border rounded text-xs text-muted-foreground hover:bg-muted hover:border-border transition-colors"
          onclick={() => onApplyLayout('LR')}
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="8" width="4" height="8" rx="1" />
            <rect x="18" y="3" width="4" height="8" rx="1" />
            <rect x="18" y="13" width="4" height="8" rx="1" />
            <path d="M6 12h6M12 12l6-5M12 12l6 5" />
          </svg>
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>水平布局</p>
    </Tooltip.Content>
  </Tooltip.Root>
</div>
