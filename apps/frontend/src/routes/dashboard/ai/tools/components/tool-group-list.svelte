<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Card from '@/lib/components/ui/card';
  import { Button } from '@/lib/components/ui/button';
  import { Badge } from '@/lib/components/ui/badge';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { ScrollArea } from '@/lib/components/ui/scroll-area';

  interface ToolGroup {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    orderNum: number;
    status: string;
  }

  interface Props {
    groups: ToolGroup[];
    loading: boolean;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onCreate: () => void;
    onEdit: (group: ToolGroup) => void;
    onDelete: (id: string) => void;
  }

  let { groups, loading, selectedId, onSelect, onCreate, onEdit, onDelete }: Props = $props();
</script>

<Card.Root class="w-64 shrink-0 flex flex-col">
  <Card.Header>
    <div class="flex items-center justify-between">
      <Card.Title class="text-base">工具分组</Card.Title>
      <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onCreate}>
        <Icon icon="mdi:plus" class="size-4" />
      </Button>
    </div>
  </Card.Header>
  <Card.Content class="p-0 flex-1 min-h-0">
    <ScrollArea class="h-full">
      {#if loading}
        <div class="space-y-2 p-4">
          {#each [1, 2, 3, 4] as _}
            <Skeleton class="h-12 w-full" />
          {/each}
        </div>
      {:else}
        <div class="p-2 space-y-1">
          <button
            class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent {selectedId === null ? 'bg-accent' : ''}"
            onclick={() => onSelect(null)}
          >
            <Icon icon="mdi:view-list" class="size-4" />
            <span>全部工具</span>
          </button>
          {#each groups as group}
            <div
              class="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent cursor-pointer {selectedId === group.id ? 'bg-accent' : ''}"
              role="button"
              tabindex="0"
              onclick={() => onSelect(group.id)}
              onkeydown={(e) => e.key === 'Enter' && onSelect(group.id)}
            >
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <Icon icon={group.icon || 'mdi:folder'} class="size-4 shrink-0" />
                <span class="font-medium truncate">{group.name}</span>
              </div>
              <div class="flex gap-1 ml-2 shrink-0">
                <button
                  class="p-1 hover:bg-muted rounded"
                  onclick={(e) => { e.stopPropagation(); onEdit(group); }}
                >
                  <Icon icon="mdi:pencil" class="size-3" />
                </button>
                <button
                  class="p-1 hover:bg-muted rounded text-destructive"
                  onclick={(e) => { e.stopPropagation(); onDelete(group.id); }}
                >
                  <Icon icon="mdi:delete" class="size-3" />
                </button>
              </div>
            </div>
          {:else}
            <div class="text-center text-muted-foreground py-8">暂无分组</div>
          {/each}
        </div>
      {/if}
    </ScrollArea>
  </Card.Content>
</Card.Root>
