<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Input } from '@qiyu-allinai/ui/components/input';
  import { Avatar, AvatarFallback, AvatarImage } from '@qiyu-allinai/ui/components/avatar';
  import { ScrollArea } from '@qiyu-allinai/ui/components/scroll-area';
  import { Badge } from '@qiyu-allinai/ui/components/badge';
  import { imStore } from '@/lib/stores/im';
  import { wsStore } from '@/lib/stores/websocket';

  interface Props {
    onCreateGroup: () => void;
  }

  let { onCreateGroup }: Props = $props();

  let searchQuery = $state('');

  let filteredConversations = $derived(
    imStore.visibleConversations.filter(c => 
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  function getConversationName(conv: { name: string | null; type: string }): string {
    if (conv.name) return conv.name;
    if (conv.type === '1') return '私聊';
    return '群聊';
  }

  function getInitials(name: string | null): string {
    if (!name) return '?';
    return name.slice(0, 2);
  }

  function formatTime(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
    } else if (days < 7) {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekdays[date.getDay()];
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
    }
  }

  function isGroupDissolved(conv: { status: string | null }): boolean {
    return conv.status === '1';
  }

  function selectConversation(convId: string) {
    imStore.selectConversation(convId);
  }
</script>

<div class="w-80 shrink-0 flex flex-col border-r">
  <!-- 头部 -->
  <div class="p-4 space-y-3">
    <div class="flex items-center justify-between">
      <h2 class="font-semibold">消息</h2>
      <div class="flex items-center gap-2">
        {#if wsStore.isConnected}
          <span class="size-2 rounded-full bg-green-500" title="已连接"></span>
        {:else}
          <span class="size-2 rounded-full bg-gray-400" title="未连接"></span>
        {/if}
        <Button size="sm" variant="ghost" class="h-8 w-8 p-0" title="新建会话" onclick={onCreateGroup}>
          <Icon icon="tdesign:chat-add" class="size-4" />
        </Button>
      </div>
    </div>
    <Input placeholder="搜索会话..." class="h-8" bind:value={searchQuery} />
  </div>

  <!-- 会话列表 -->
  <div class="flex-1 min-h-0">
    <ScrollArea class="h-full">
      <div class="px-2 pb-2 space-y-1">
        {#if imStore.isLoading}
          <div class="py-8 text-center text-muted-foreground text-sm">
            加载中...
          </div>
        {:else if filteredConversations.length === 0}
          <div class="py-8 text-center text-muted-foreground text-sm">
            暂无会话
          </div>
        {:else}
          {#each filteredConversations as conv}
            <button
              class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors text-left {imStore.selectedConversationId === conv.id ? 'bg-accent' : ''}"
              onclick={() => selectConversation(conv.id)}
            >
              <div class="relative">
                <Avatar class="size-10">
                  <AvatarImage src={conv.avatar || ''} alt={getConversationName(conv)} />
                  <AvatarFallback class={conv.type === '2' ? 'bg-blue-100 text-blue-600' : ''}>
                    {#if conv.type === '2'}
                      <Icon icon="tdesign:usergroup" class="size-5" />
                    {:else}
                      {getInitials(conv.name)}
                    {/if}
                  </AvatarFallback>
                </Avatar>
                {#if isGroupDissolved(conv)}
                  <div class="absolute -bottom-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded">
                    已解散
                  </div>
                {/if}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="font-medium truncate">{getConversationName(conv)}</span>
                  <span class="text-xs text-muted-foreground">{formatTime(conv.lastMessageAt)}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground truncate">
                    {conv.lastMessageContent || '暂无消息'}
                  </span>
                  {#if conv.unreadCount > 0}
                    <Badge variant="destructive" class="h-5 min-w-5 px-1.5 text-xs">
                      {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                    </Badge>
                  {/if}
                </div>
              </div>
            </button>
          {/each}
        {/if}
      </div>
    </ScrollArea>
  </div>
</div>
