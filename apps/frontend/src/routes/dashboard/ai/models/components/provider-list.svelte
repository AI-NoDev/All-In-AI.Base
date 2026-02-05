<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '@/lib/components/ui/button';
  import { Badge } from '@/lib/components/ui/badge';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { ScrollArea } from '@/lib/components/ui/scroll-area';

  interface Provider {
    id: string;
    name: string;
    baseUrl: string;
    status: string;
    remark: string | null;
  }

  interface Props {
    providers: Provider[];
    loading: boolean;
    selectedId: string | null;
    onSelect: (id: string | null) => void;
    onCreate: () => void;
    onEdit: (provider: Provider) => void;
    onDelete: (id: string) => void;
  }

  let { providers, loading, selectedId, onSelect, onCreate, onEdit, onDelete }: Props = $props();
</script>

<div class="w-72 shrink-0 flex flex-col pr-4 border-r border-border">
  <div class="py-3 px-2 flex items-center justify-between">
    <h3 class="text-base font-semibold">AI 服务提供商</h3>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onCreate}>
      <Icon icon="mdi:plus" class="size-4" />
    </Button>
  </div>
  <div class="flex-1 min-h-0">
    <ScrollArea class="h-full">
      {#if loading}
        <div class="space-y-2 p-4">
          {#each [1, 2, 3, 4] as _}
            <Skeleton class="h-16 w-full" />
          {/each}
        </div>
      {:else}
        <div class="p-2 space-y-1">
          <button
            class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent {selectedId === null ? 'bg-accent' : ''}"
            onclick={() => onSelect(null)}
          >
            <Icon icon="mdi:view-list" class="size-4" />
            <span>全部模型</span>
          </button>
          {#each providers as provider}
            <div
              class="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent cursor-pointer {selectedId === provider.id ? 'bg-accent' : ''}"
              role="button"
              tabindex="0"
              onclick={() => onSelect(provider.id)}
              onkeydown={(e) => e.key === 'Enter' && onSelect(provider.id)}
            >
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-medium truncate">{provider.name}</span>
                  <Badge variant={provider.status === '0' ? 'default' : 'secondary'} class="text-xs">
                    {provider.status === '0' ? '正常' : '停用'}
                  </Badge>
                </div>
                <div class="text-xs text-muted-foreground truncate mt-0.5">{provider.baseUrl}</div>
              </div>
              <div class="flex gap-1 ml-2 shrink-0">
                <button
                  class="p-1 hover:bg-muted rounded"
                  onclick={(e) => { e.stopPropagation(); onEdit(provider); }}
                >
                  <Icon icon="mdi:pencil" class="size-3" />
                </button>
                <button
                  class="p-1 hover:bg-muted rounded text-destructive"
                  onclick={(e) => { e.stopPropagation(); onDelete(provider.id); }}
                >
                  <Icon icon="mdi:delete" class="size-3" />
                </button>
              </div>
            </div>
          {:else}
            <div class="text-center text-muted-foreground py-8">暂无提供商</div>
          {/each}
        </div>
      {/if}
    </ScrollArea>
  </div>
</div>
