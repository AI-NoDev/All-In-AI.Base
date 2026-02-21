<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Input } from '$lib/components/ui/input';
  import * as Select from '$lib/components/ui/select';

  interface UserMemory {
    id: string;
    userId: string;
    agentId: string | null;
    memoryType: string;
    content: string;
    importance: number;
    accessCount: number;
    lastAccessedAt: string | null;
    expiresAt: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
  }

  interface User {
    id: string;
    nickName: string;
    loginName: string;
  }

  interface Agent {
    id: string;
    name: string;
  }

  interface Props {
    memories: UserMemory[];
    users: User[];
    agents: Agent[];
    loading: boolean;
    total: number;
    page: number;
    pageSize: number;
    filterUserId: string;
    filterMemoryType: string;
    onCreate: () => void;
    onEdit: (memory: UserMemory) => void;
    onDelete: (id: string) => void;
    onRefresh: () => void;
    onPageChange: (page: number) => void;
    onFilter: () => void;
  }

  let {
    memories, users, agents, loading, total, page, pageSize,
    filterUserId = $bindable(), filterMemoryType = $bindable(),
    onCreate, onEdit, onDelete, onRefresh, onPageChange, onFilter
  }: Props = $props();

  const memoryTypes = [
    { value: '', label: '全部类型' },
    { value: 'STM', label: '短期记忆' },
    { value: 'LTM', label: '长期记忆' },
    { value: 'PREFERENCE', label: '偏好' },
    { value: 'FACT', label: '事实' },
    { value: 'EPISODIC', label: '情景记忆' }
  ];

  const memoryTypeLabels: Record<string, string> = {
    STM: '短期记忆',
    LTM: '长期记忆',
    PREFERENCE: '偏好',
    FACT: '事实',
    EPISODIC: '情景记忆'
  };

  const memoryTypeColors: Record<string, string> = {
    STM: 'bg-yellow-100 text-yellow-800',
    LTM: 'bg-blue-100 text-blue-800',
    PREFERENCE: 'bg-purple-100 text-purple-800',
    FACT: 'bg-green-100 text-green-800',
    EPISODIC: 'bg-pink-100 text-pink-800'
  };

  function getUserName(userId: string): string {
    const user = users.find(u => u.id === userId);
    return user ? (user.nickName || user.loginName) : '-';
  }

  function getAgentName(agentId: string | null): string {
    if (!agentId) return '-';
    return agents.find(a => a.id === agentId)?.name || '-';
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('zh-CN');
  }

  let totalPages = $derived(Math.ceil(total / pageSize));
</script>

<div class="flex-1 flex flex-col min-h-0">
  <div class="py-3 flex items-center justify-between border-b border-border gap-4">
    <div class="flex gap-2 items-center">
      <Button size="sm" onclick={onCreate}>
        <Icon icon="mdi:plus" class="mr-1 size-4" />新增记忆
      </Button>
      <Select.Root type="single" name="filterUser" bind:value={filterUserId} onValueChange={() => onFilter()}>
        <Select.Trigger class="w-40 h-8">
          {users.find(u => u.id === filterUserId)?.nickName || '全部用户'}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="">全部用户</Select.Item>
          {#each users as user}
            <Select.Item value={user.id}>{user.nickName || user.loginName}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <Select.Root type="single" name="filterType" bind:value={filterMemoryType} onValueChange={() => onFilter()}>
        <Select.Trigger class="w-32 h-8">
          {memoryTypes.find(t => t.value === filterMemoryType)?.label || '全部类型'}
        </Select.Trigger>
        <Select.Content>
          {#each memoryTypes as type}
            <Select.Item value={type.value}>{type.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">共 {total} 条</span>
      <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onRefresh}>
        <Icon icon="mdi:refresh" class="size-4" />
      </Button>
    </div>
  </div>
  
  <div class="flex-1 min-h-0 pt-4">
    {#if loading}
      <div class="space-y-3">
        {#each [1, 2, 3, 4, 5] as _}
          <Skeleton class="h-24 w-full" />
        {/each}
      </div>
    {:else}
      <ScrollArea class="h-full">
        <div class="space-y-3 pr-4">
          {#each memories as memory}
            <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2">
                    <Badge class={memoryTypeColors[memory.memoryType] || ''}>
                      {memoryTypeLabels[memory.memoryType] || memory.memoryType}
                    </Badge>
                    <span class="text-sm text-muted-foreground">
                      重要度: {memory.importance}/10
                    </span>
                    <span class="text-sm text-muted-foreground">
                      访问: {memory.accessCount}次
                    </span>
                  </div>
                  <p class="text-sm line-clamp-2">{memory.content}</p>
                  <div class="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <Icon icon="mdi:account" class="size-3" />
                      {getUserName(memory.userId)}
                    </span>
                    <span class="flex items-center gap-1">
                      <Icon icon="mdi:robot" class="size-3" />
                      {getAgentName(memory.agentId)}
                    </span>
                    <span class="flex items-center gap-1">
                      <Icon icon="mdi:clock" class="size-3" />
                      {formatDate(memory.createdAt)}
                    </span>
                    {#if memory.expiresAt}
                      <span class="flex items-center gap-1 text-orange-600">
                        <Icon icon="mdi:timer-sand" class="size-3" />
                        过期: {formatDate(memory.expiresAt)}
                      </span>
                    {/if}
                  </div>
                </div>
                <div class="flex gap-1 shrink-0">
                  <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => onEdit(memory)}>
                    <Icon icon="mdi:pencil" class="size-4" />
                  </Button>
                  <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={() => onDelete(memory.id)}>
                    <Icon icon="mdi:delete" class="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          {:else}
            <div class="h-48 flex items-center justify-center text-muted-foreground">
              暂无记忆数据
            </div>
          {/each}
        </div>
      </ScrollArea>
    {/if}
  </div>

  {#if totalPages > 1}
    <div class="pt-4 flex items-center justify-center gap-2 border-t">
      <Button size="sm" variant="outline" disabled={page <= 1} onclick={() => onPageChange(page - 1)}>
        <Icon icon="mdi:chevron-left" class="size-4" />
      </Button>
      <span class="text-sm">{page} / {totalPages}</span>
      <Button size="sm" variant="outline" disabled={page >= totalPages} onclick={() => onPageChange(page + 1)}>
        <Icon icon="mdi:chevron-right" class="size-4" />
      </Button>
    </div>
  {/if}
</div>
