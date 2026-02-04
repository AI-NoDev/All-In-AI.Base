<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Card from '@/lib/components/ui/card';
  import * as Table from '@/lib/components/ui/table';
  import { Button } from '@/lib/components/ui/button';
  import { Badge } from '@/lib/components/ui/badge';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { ScrollArea } from '@/lib/components/ui/scroll-area';
  import { Checkbox } from '@/lib/components/ui/checkbox';

  interface Tool {
    id: string;
    groupId: string | null;
    name: string;
    description: string | null;
    isAsync: boolean;
    status: string;
    createdAt: string;
  }

  interface ToolGroup {
    id: string;
    name: string;
  }

  interface Props {
    tools: Tool[];
    groups: ToolGroup[];
    loading: boolean;
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    onCreate: () => void;
    onEdit: (tool: Tool) => void;
    onDelete: (id: string) => void;
    onBatchDelete: () => void;
    onRefresh: () => void;
  }

  let { tools, groups, loading, selectedIds, onToggleSelect, onToggleSelectAll, onCreate, onEdit, onDelete, onBatchDelete, onRefresh }: Props = $props();

  let allSelected = $derived(tools.length > 0 && tools.every(t => selectedIds.has(t.id)));
  let someSelected = $derived(selectedIds.size > 0 && !allSelected);

  function getGroupName(groupId: string | null): string {
    if (!groupId) return '未分组';
    return groups.find(g => g.id === groupId)?.name || '-';
  }
</script>

<Card.Root class="flex-1 flex flex-col min-h-0">
  <Card.Header class="pb-3">
    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <Button size="sm" onclick={onCreate}>
          <Icon icon="mdi:plus" class="mr-1 size-4" />新增工具
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
  </Card.Header>
  <Card.Content class="flex-1 min-h-0 flex flex-col">
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
                <Table.Head>工具名称</Table.Head>
                <Table.Head>描述</Table.Head>
                <Table.Head>分组</Table.Head>
                <Table.Head class="w-20">异步</Table.Head>
                <Table.Head class="w-20">状态</Table.Head>
                <Table.Head class="w-28 text-right">操作</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each tools as tool}
                <Table.Row class={selectedIds.has(tool.id) ? 'bg-muted/50' : ''}>
                  <Table.Cell>
                    <Checkbox checked={selectedIds.has(tool.id)} onCheckedChange={() => onToggleSelect(tool.id)} />
                  </Table.Cell>
                  <Table.Cell class="font-medium">{tool.name}</Table.Cell>
                  <Table.Cell class="text-muted-foreground max-w-xs truncate">{tool.description || '-'}</Table.Cell>
                  <Table.Cell>{getGroupName(tool.groupId)}</Table.Cell>
                  <Table.Cell>
                    <Badge variant={tool.isAsync ? 'default' : 'outline'}>
                      {tool.isAsync ? '是' : '否'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={tool.status === '0' ? 'default' : 'secondary'}>
                      {tool.status === '0' ? '正常' : '停用'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell class="text-right">
                    <div class="flex justify-end gap-1">
                      <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => onEdit(tool)}>
                        <Icon icon="mdi:pencil" class="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => onDelete(tool.id)}>
                        <Icon icon="mdi:delete" class="size-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              {:else}
                <Table.Row>
                  <Table.Cell colspan={7} class="h-24 text-center text-muted-foreground">暂无数据</Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
      </div>
    {/if}
  </Card.Content>
</Card.Root>
