<script lang="ts">
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import * as Select from '$lib/components/ui/select/index.js';
  import type { ActionSummary } from '../../types.js';

  interface Props {
    actions: ActionSummary[];
    onAddAction: (action: ActionSummary) => void;
  }

  let { actions, onAddAction }: Props = $props();

  let searchQuery = $state('');
  let selectedTag = $state<string>('');

  // 获取所有唯一的 tags
  let allTags = $derived(() => {
    const tags = new Set<string>();
    for (const action of actions) {
      for (const tag of action.tags) {
        tags.add(tag);
      }
    }
    return Array.from(tags).sort();
  });

  // 过滤后的 actions
  let filteredActions = $derived(() => {
    return actions.filter((action) => {
      const matchesSearch =
        !searchQuery ||
        action.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        action.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || action.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  });

  // 按 module tag 分组
  let groupedActions = $derived(() => {
    const groups: Record<string, ActionSummary[]> = {};
    for (const action of filteredActions()) {
      const moduleTag = action.tags[0] || 'other';
      if (!groups[moduleTag]) {
        groups[moduleTag] = [];
      }
      groups[moduleTag].push(action);
    }
    return groups;
  });
</script>

<div class="w-[280px] bg-card border-r border-border flex flex-col h-full">
  <div class="p-4 border-b border-border">
    <h3 class="m-0 text-base font-semibold text-card-foreground">Actions</h3>
  </div>

  <div class="px-4 py-3 flex flex-col gap-2">
    <input
      type="text"
      placeholder="搜索 Action..."
      bind:value={searchQuery}
      class="w-full px-3 py-2 border border-border rounded-md text-[13px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
    />
    <Select.Root type="single" bind:value={selectedTag}>
      <Select.Trigger class="w-full">
        <span data-slot="select-value">{selectedTag || '全部模块'}</span>
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="" label="全部模块" />
        {#each allTags() as tag}
          <Select.Item value={tag} label={tag} />
        {/each}
      </Select.Content>
    </Select.Root>
  </div>

  <div class="flex-1 overflow-y-auto px-2 pb-4">
    {#each Object.entries(groupedActions()) as [group, groupActions]}
      <div class="mb-3">
        <div class="p-2 text-[11px] font-semibold text-muted-foreground uppercase">{group}</div>
        {#each groupActions as action}
          {@const methodClass = {
            get: 'bg-primary/20 text-primary dark:bg-primary/30',
            post: 'bg-chart-2/20 text-chart-2 dark:bg-chart-2/30',
            put: 'bg-chart-4/20 text-chart-4 dark:bg-chart-4/30',
            delete: 'bg-destructive/20 text-destructive dark:bg-destructive/30',
          }[action.method.toLowerCase()] ?? 'bg-accent text-foreground'}
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <button
                  {...props}
                  class="flex items-center gap-2 w-full p-2 border-none bg-transparent rounded-md cursor-pointer text-left transition-colors hover:bg-accent"
                  onclick={() => onAddAction(action)}
                >
                  <span class="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase shrink-0 {methodClass}">
                    {action.method}
                  </span>
                  <span class="text-xs text-foreground overflow-hidden text-ellipsis whitespace-nowrap">{action.displayName}</span>
                </button>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>{action.description || action.displayName}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        {/each}
      </div>
    {/each}
  </div>
</div>
