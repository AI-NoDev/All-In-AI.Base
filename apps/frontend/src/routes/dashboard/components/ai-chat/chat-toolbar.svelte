<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Sheet from '$lib/components/ui/sheet';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { aiChatStore, type AISession } from '@/lib/stores/ai-chat.svelte';
  import { t } from '@/lib/stores/i18n.svelte';

  let showHistory = $state(false);

  // 当前会话标题（截取第一条用户消息）
  // 检查 title 是否为空或是旧版默认值 '新对话'
  const isDefaultTitle = (title: string | null) => !title || title === '新对话';
  
  const currentTitle = $derived(() => {
    const session = aiChatStore.currentSession;
    if (session?.title && !isDefaultTitle(session.title)) {
      return session.title.length > 20 ? session.title.slice(0, 20) + '...' : session.title;
    }
    return null;
  });

  async function handleNewSession() {
    if (!aiChatStore.canSendMessage) {
      alert(t('page.ai.chat_selectModelOrAgent'));
      return;
    }
    try {
      await aiChatStore.createSession();
    } catch (e) {
      console.error('Failed to create session:', e);
    }
  }

  async function handleSelectSession(sessionId: string) {
    showHistory = false;
    await aiChatStore.selectSession(sessionId);
  }

  async function handleDeleteSession(e: Event, sessionId: string) {
    e.stopPropagation();
    await aiChatStore.deleteSession(sessionId);
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return t('page.ai.chat_yesterday');
    } else if (days < 7) {
      return t('page.ai.chat_daysAgo').replace('${days}', String(days));
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }
  }

  // 获取会话显示标题
  function getSessionTitle(session: { title: string | null; messageCount: number }): string {
    if (session.title && !isDefaultTitle(session.title)) {
      return session.title.length > 25 ? session.title.slice(0, 25) + '...' : session.title;
    }
    return t('page.ai.chat_newChat');
  }

  // 获取会话的模型名称
  function getSessionModelName(session: AISession): string | null {
    if (session.modelId) {
      const model = aiChatStore.models.find(m => m.id === session.modelId);
      return model?.name || null;
    }
    return null;
  }

  // 占位符 UUID（旧 API 兼容用）
  const PLACEHOLDER_AGENT_ID = '00000000-0000-0000-0000-000000000000';

  // 获取会话的智能体
  function getSessionAgent(session: AISession): { name: string; avatar: string | null; color: string | null } | null {
    // 检查 agentId 是否有效（不是占位符）
    if (session.agentId && session.agentId !== PLACEHOLDER_AGENT_ID) {
      const agent = aiChatStore.agents.find(a => a.id === session.agentId);
      if (agent) {
        return { name: agent.name, avatar: agent.avatar, color: agent.color };
      }
    }
    return null;
  }
</script>

<div class="flex items-center justify-between px-3 py-2 border-b shrink-0">
  <div class="flex items-center gap-2">
    <Sheet.Root bind:open={showHistory}>
      <Sheet.Trigger>
        <Button variant="ghost" size="sm" class="h-8 px-2">
          <Icon icon="mdi:history" class="size-4 mr-1" />
          {t('page.ai.chat_history')}
        </Button>
      </Sheet.Trigger>
      <Sheet.Content side="left" class="w-80">
        <Sheet.Header>
          <Sheet.Title>{t('page.ai.chat_historyTitle')}</Sheet.Title>
          <Sheet.Description>{t('page.ai.chat_historyDesc')}</Sheet.Description>
        </Sheet.Header>
        <ScrollArea class="h-[calc(100vh-120px)] mt-4">
          <div class="space-y-1 pr-4">
            {#if aiChatStore.sessions.length === 0}
              <div class="text-center text-muted-foreground py-8">
                {t('page.ai.chat_noHistory')}
              </div>
            {:else}
              {#each aiChatStore.sessions as session}
                {@const modelName = getSessionModelName(session)}
                {@const agent = getSessionAgent(session)}
                <button
                  class="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors group {session.id === aiChatStore.currentSessionId ? 'bg-muted' : ''}"
                  onclick={() => handleSelectSession(session.id)}
                >
                  <div class="flex items-start gap-3">
                    <!-- 头像区域 -->
                    <div class="shrink-0 mt-0.5">
                      {#if agent?.avatar}
                        <img src={agent.avatar} alt={agent.name} class="size-8 rounded-full object-cover" />
                      {:else if agent}
                        <div 
                          class="size-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                          style="background-color: {agent.color || '#6366f1'}"
                        >
                          {agent.name.charAt(0)}
                        </div>
                      {:else}
                        <div class="size-8 rounded-full bg-muted flex items-center justify-center">
                          <Icon icon="mdi:robot-outline" class="size-4 text-muted-foreground" />
                        </div>
                      {/if}
                    </div>
                    
                    <!-- 内容区域 -->
                    <div class="flex-1 min-w-0">
                      <div class="font-medium text-sm truncate">{getSessionTitle(session)}</div>
                      <div class="text-xs text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                        {#if agent}
                          <span class="px-1.5 py-0.5 rounded bg-primary/10 text-primary">{agent.name}</span>
                        {:else if modelName}
                          <span class="px-1.5 py-0.5 rounded bg-muted-foreground/10">{modelName}</span>
                        {/if}
                        <span>{session.messageCount} {t('page.ai.chat_messages')}</span>
                        <span>·</span>
                        <span>{formatDate(session.lastMessageAt || session.createdAt)}</span>
                      </div>
                    </div>
                    
                    <!-- 删除按钮 -->
                    <Button
                      variant="ghost"
                      size="sm"
                      class="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 shrink-0"
                      onclick={(e) => handleDeleteSession(e, session.id)}
                    >
                      <Icon icon="mdi:delete-outline" class="size-4" />
                    </Button>
                  </div>
                </button>
              {/each}
            {/if}
          </div>
        </ScrollArea>
      </Sheet.Content>
    </Sheet.Root>

    <!-- 当前会话标题 -->
    {#if currentTitle()}
      <span class="text-sm text-muted-foreground truncate max-w-[200px]">
        {currentTitle()}
      </span>
    {/if}
  </div>

  <div class="flex items-center gap-1">
    <Button variant="ghost" size="sm" class="h-8 px-2" onclick={handleNewSession}>
      <Icon icon="mdi:plus" class="size-4 mr-1" />
      {t('page.ai.chat_newChat')}
    </Button>
    <Button variant="ghost" size="sm" class="h-8 w-8 p-0" onclick={() => aiChatStore.togglePanel()}>
      <Icon icon="mdi:close" class="size-4" />
    </Button>
  </div>
</div>
