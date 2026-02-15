<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import * as Avatar from '$lib/components/ui/avatar';

  interface Agent {
    id: string;
    name: string;
    description: string | null;
    avatar: string | null;
    color: string | null;
    providerId: string;
    modelId: string;
    systemPrompt: string | null;
    temperature: number | null;
    supportLoop: boolean;
    maxLoops: number | null;
    status: string;
    createdAt: string;
  }

  interface Provider {
    id: string;
    name: string;
  }

  interface Model {
    id: string;
    name: string;
    providerId: string;
  }

  interface Props {
    agents: Agent[];
    providers: Provider[];
    models: Model[];
    loading: boolean;
    onCreate: () => void;
    onEdit: (agent: Agent) => void;
    onDelete: (id: string) => void;
    onRefresh: () => void;
  }

  let { agents, providers, models, loading, onCreate, onEdit, onDelete, onRefresh }: Props = $props();

  function getProviderName(providerId: string): string {
    return providers.find(p => p.id === providerId)?.name || '-';
  }

  function getModelName(modelId: string): string {
    return models.find(m => m.id === modelId)?.name || '-';
  }
</script>

<div class="flex-1 flex flex-col min-h-0">
  <div class="py-3 flex items-center justify-between border-b border-border">
    <div class="flex gap-2">
      <Button size="sm" onclick={onCreate}>
        <Icon icon="mdi:plus" class="mr-1 size-4" />新增智能体
      </Button>
    </div>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onRefresh}>
      <Icon icon="mdi:refresh" class="size-4" />
    </Button>
  </div>
  <div class="flex-1 min-h-0 pt-4">
    {#if loading}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each [1, 2, 3, 4, 5, 6] as _}
          <Skeleton class="h-40 w-full" />
        {/each}
      </div>
    {:else}
      <ScrollArea class="h-full">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
          {#each agents as agent}
            <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-start gap-3">
                <Avatar.Root class="size-12 shrink-0" style={agent.color ? `background-color: ${agent.color}` : ''}>
                  {#if agent.avatar}
                    <Avatar.Image src={agent.avatar} alt={agent.name} />
                  {/if}
                  <Avatar.Fallback>
                    <Icon icon="mdi:robot" class="size-6" />
                  </Avatar.Fallback>
                </Avatar.Root>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="font-medium truncate">{agent.name}</h3>
                    <Badge variant={agent.status === '0' ? 'default' : 'secondary'} class="shrink-0">
                      {agent.status === '0' ? '正常' : '停用'}
                    </Badge>
                  </div>
                  <p class="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {agent.description || '暂无描述'}
                  </p>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t">
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <div class="flex items-center gap-1">
                    <Icon icon="mdi:cloud" class="size-3" />
                    <span>{getProviderName(agent.providerId)}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Icon icon="mdi:brain" class="size-3" />
                    <span>{getModelName(agent.modelId)}</span>
                  </div>
                </div>
              </div>
              <div class="mt-3 flex justify-end gap-1">
                <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => onEdit(agent)}>
                  <Icon icon="mdi:pencil" class="size-4" />
                </Button>
                <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => onDelete(agent.id)}>
                  <Icon icon="mdi:delete" class="size-4" />
                </Button>
              </div>
            </div>
          {:else}
            <div class="col-span-full h-48 flex items-center justify-center text-muted-foreground">
              暂无智能体
            </div>
          {/each}
        </div>
      </ScrollArea>
    {/if}
  </div>
</div>
