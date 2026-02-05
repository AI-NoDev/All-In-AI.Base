<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Table from '@/lib/components/ui/table';
  import { Button } from '@/lib/components/ui/button';
  import { Badge } from '@/lib/components/ui/badge';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { ScrollArea } from '@/lib/components/ui/scroll-area';
  import { Checkbox } from '@/lib/components/ui/checkbox';

  interface Model {
    id: string;
    providerId: string;
    name: string;
    modelId: string;
    status: string;
    supportTools: boolean;
    maxTokens: number | null;
    remark: string | null;
    createdAt: string;
  }

  interface Provider {
    id: string;
    name: string;
  }

  interface Props {
    models: Model[];
    providers: Provider[];
    loading: boolean;
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    onCreate: () => void;
    onEdit: (model: Model) => void;
    onDelete: (id: string) => void;
    onBatchDelete: () => void;
    onRefresh: () => void;
  }

  let { models, providers, loading, selectedIds, onToggleSelect, onToggleSelectAll, onCreate, onEdit, onDelete, onBatchDelete, onRefresh }: Props = $props();

  let allSelected = $derived(models.length > 0 && models.every(m => selectedIds.has(m.id)));
  let someSelected = $derived(selectedIds.size > 0 && !allSelected);

  function getProviderName(providerId: string): string {
    return providers.find(p => p.id === providerId)?.name || '-';
  }
</script>

<div class="flex-1 flex flex-col min-h-0 pl-4">
  <div class="py-3 flex items-center justify-between border-b border-border">
    <div class="flex gap-2">
      <Button size="sm" onclick={onCreate}>
        <Icon icon="mdi:plus" class="mr-1 size-4" />新增模型
      </Button>
      {#if selectedIds.size > 0}
        <Button size="sm" variant="destructive" onclick={onBatchDelete}>
          <Icon icon="mdi:delete" class="mr-1 size-4" />删除({selectedIds.size})
        </Button>
      {/if}
    </div>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onRefresh}>
      <Icon icon="mdi:refresh" class="size-4" />
    </Button>
  </div>
  <div class="flex-1 min-h-0 flex flex-col pt-4">
    {#if loading}
      <div class="space-y-3">
        {#each [1, 2, 3, 4, 5] as _}
          <Skeleton class="h-12 w-full" />
        {/each}
      </div>
    {:else}
      <div class="flex-1 min-h-0">
        <ScrollArea class="h-full" orientation="both">
          <Table.Root>
            <Table.Header class="sticky top-0 bg-background z-10">
              <Table.Row>
                <Table.Head class="w-12">
                  <Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={onToggleSelectAll} />
                </Table.Head>
                <Table.Head>模型名称</Table.Head>
                <Table.Head>模型ID</Table.Head>
                <Table.Head>提供商</Table.Head>
                <Table.Head class="w-24">工具调用</Table.Head>
                <Table.Head class="w-24">最大Token</Table.Head>
                <Table.Head class="w-20">状态</Table.Head>
                <Table.Head class="w-28 text-right">操作</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each models as model}
                <Table.Row class={selectedIds.has(model.id) ? 'bg-muted/50' : ''}>
                  <Table.Cell>
                    <Checkbox checked={selectedIds.has(model.id)} onCheckedChange={() => onToggleSelect(model.id)} />
                  </Table.Cell>
                  <Table.Cell class="font-medium">{model.name}</Table.Cell>
                  <Table.Cell class="text-muted-foreground font-mono text-xs">{model.modelId}</Table.Cell>
                  <Table.Cell>{getProviderName(model.providerId)}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={model.supportTools ? 'default' : 'outline'}>
                      {model.supportTools ? '支持' : '不支持'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{model.maxTokens || '-'}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={model.status === '0' ? 'default' : 'secondary'}>
                      {model.status === '0' ? '正常' : '停用'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell class="text-right">
                    <div class="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => onEdit(model)}>
                        <Icon icon="mdi:pencil" class="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => onDelete(model.id)}>
                        <Icon icon="mdi:delete" class="size-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              {:else}
                <Table.Row>
                  <Table.Cell colspan={8} class="h-24 text-center text-muted-foreground">暂无数据</Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
      </div>
    {/if}
  </div>
</div>
