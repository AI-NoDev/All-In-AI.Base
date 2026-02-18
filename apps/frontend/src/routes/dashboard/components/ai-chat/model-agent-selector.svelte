<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Badge } from '$lib/components/ui/badge';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { aiChatStore, type AIAgent } from '@/lib/stores/ai-chat.svelte';
  import { authStore } from '@/lib/stores/auth.svelte';

  // 模型选择 Dialog 状态
  let modelDialogOpen = $state(false);
  let selectedProviderIdInDialog = $state<string | null>(null);

  // 智能体选择 Dialog 状态
  let agentDialogOpen = $state(false);
  let agentSearchQuery = $state('');
  let agentList = $state<AIAgent[]>([]);
  let agentTotal = $state(0);
  let agentLoading = $state(false);
  let agentPage = $state(0);
  const agentPageSize = 12;

  // 当前 Provider 下的模型
  let modelsInProvider = $derived(
    selectedProviderIdInDialog 
      ? aiChatStore.models.filter(m => m.providerId === selectedProviderIdInDialog)
      : []
  );

  // 搜索智能体
  async function searchAgents(reset = false) {
    if (reset) {
      agentPage = 0;
      agentList = [];
    }
    
    agentLoading = true;
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiAgentQuery({
        filter: { 
          status: '0',
          name: agentSearchQuery || undefined,
        },
        limit: agentPageSize,
        offset: agentPage * agentPageSize,
      });
      
      if (res.data?.data) {
        const newAgents = res.data.data.map((a: { id: string; name: string; description: string | null; avatar: string | null; color: string | null; modelId: string; providerId: string; systemPrompt: string | null }) => ({
          id: a.id,
          name: a.name,
          description: a.description,
          avatar: a.avatar,
          color: a.color,
          modelId: a.modelId,
          providerId: a.providerId,
          systemPrompt: a.systemPrompt,
        }));
        
        if (reset) {
          agentList = newAgents;
        } else {
          agentList = [...agentList, ...newAgents];
        }
        agentTotal = res.data.total ?? 0;
      }
    } catch (e) {
      console.error('Failed to search agents:', e);
    } finally {
      agentLoading = false;
    }
  }

  function openModelDialog() {
    modelDialogOpen = true;
    // 默认选中当前模型的 Provider
    if (aiChatStore.selectedModel) {
      selectedProviderIdInDialog = aiChatStore.selectedModel.providerId;
    } else if (aiChatStore.providers.length > 0) {
      selectedProviderIdInDialog = aiChatStore.providers[0].id;
    }
  }

  function selectModel(modelId: string) {
    aiChatStore.setSelectedModel(modelId);
    modelDialogOpen = false;
  }

  function openAgentDialog() {
    agentDialogOpen = true;
    agentSearchQuery = '';
    searchAgents(true);
  }

  function selectAgent(agent: AIAgent | null) {
    aiChatStore.setSelectedAgent(agent?.id || null);
    agentDialogOpen = false;
  }

  function clearAgent() {
    aiChatStore.setSelectedAgent(null);
  }

  function loadMoreAgents() {
    if (agentLoading || agentList.length >= agentTotal) return;
    agentPage++;
    searchAgents(false);
  }

  function getAgentInitial(name: string): string {
    return name.charAt(0);
  }

  function getProviderName(providerId: string): string {
    return aiChatStore.providers.find(p => p.id === providerId)?.name || '-';
  }

  function getModelName(modelId: string): string {
    return aiChatStore.models.find(m => m.id === modelId)?.name || '-';
  }

  // 当搜索词变化时，延迟搜索
  let searchTimeout: ReturnType<typeof setTimeout>;
  $effect(() => {
    if (agentDialogOpen && agentSearchQuery !== undefined) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchAgents(true);
      }, 300);
    }
    return () => clearTimeout(searchTimeout);
  });
</script>

<div class="flex items-center gap-2 flex-wrap">
  <!-- 模型选择：Badge 样式，点击弹出选择器 -->
  <button
    class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-muted hover:bg-muted/80 transition-colors"
    onclick={openModelDialog}
  >
    <Icon icon="mdi:chip" class="size-3" />
    <span class="max-w-[120px] truncate">
      {aiChatStore.selectedModel?.name || '选择模型'}
    </span>
    <Icon icon="mdi:chevron-down" class="size-3" />
  </button>

  <!-- 智能体选择：Badge 样式 -->
  {#if aiChatStore.selectedAgent}
    <div class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-muted">
      <button
        class="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
        onclick={openAgentDialog}
      >
        <div 
          class="size-4 rounded-full flex items-center justify-center text-[8px] text-white shrink-0"
          style="background-color: {aiChatStore.selectedAgent.color || '#6366f1'}"
        >
          {getAgentInitial(aiChatStore.selectedAgent.name)}
        </div>
        <span class="max-w-[80px] truncate">{aiChatStore.selectedAgent.name}</span>
      </button>
      <button 
        class="hover:text-destructive ml-1" 
        onclick={clearAgent}
      >
        <Icon icon="mdi:close" class="size-3" />
      </button>
    </div>
  {:else}
    <button
      class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-muted hover:bg-muted/80 transition-colors"
      onclick={openAgentDialog}
    >
      <Icon icon="mdi:robot" class="size-3" />
      <span>智能体</span>
      <Icon icon="mdi:chevron-down" class="size-3" />
    </button>
  {/if}
</div>

<!-- 模型选择 Dialog：左边 Provider，右边 Model -->
<Dialog.Root bind:open={modelDialogOpen}>
  <Dialog.Content class="sm:max-w-2xl" interactOutsideBehavior="ignore">
    <Dialog.Header>
      <Dialog.Title>选择模型</Dialog.Title>
      <Dialog.Description>选择一个 AI 模型进行对话</Dialog.Description>
    </Dialog.Header>
    
    <div class="flex gap-4 h-[400px]">
      <!-- 左侧：Provider 列表 -->
      <div class="w-40 shrink-0 border-r pr-4">
        <div class="text-xs text-muted-foreground mb-2">提供商</div>
        <ScrollArea class="h-[360px]">
          <div class="space-y-1">
            {#each aiChatStore.providers as provider}
              <button
                class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors {selectedProviderIdInDialog === provider.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}"
                onclick={() => selectedProviderIdInDialog = provider.id}
              >
                {provider.name}
              </button>
            {/each}
          </div>
        </ScrollArea>
      </div>

      <!-- 右侧：Model 列表 -->
      <div class="flex-1 min-w-0">
        <div class="text-xs text-muted-foreground mb-2">模型</div>
        <ScrollArea class="h-[360px]">
          <div class="space-y-1 p-1">
            {#if modelsInProvider.length === 0}
              <div class="flex items-center justify-center h-32 text-muted-foreground text-sm">
                该提供商暂无可用模型
              </div>
            {:else}
              {#each modelsInProvider as model}
                <button
                  class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between {aiChatStore.selectedModelId === model.id ? 'bg-muted ring-1 ring-primary' : 'hover:bg-muted'}"
                  onclick={() => selectModel(model.id)}
                >
                  <span class="truncate">{model.name}</span>
                  {#if aiChatStore.selectedModelId === model.id}
                    <Icon icon="mdi:check" class="size-4 text-primary shrink-0" />
                  {/if}
                </button>
              {/each}
            {/if}
          </div>
        </ScrollArea>
      </div>
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => modelDialogOpen = false}>取消</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- 智能体选择 Dialog：卡片网格布局 -->
<Dialog.Root bind:open={agentDialogOpen}>
  <Dialog.Content class="sm:max-w-4xl max-h-[90vh]" interactOutsideBehavior="ignore">
    <Dialog.Header>
      <Dialog.Title>选择智能体</Dialog.Title>
      <Dialog.Description>选择一个智能体来辅助对话，或直接与模型对话</Dialog.Description>
    </Dialog.Header>
    
    <!-- 搜索框 -->
    <div class="relative">
      <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input 
        placeholder="搜索智能体..." 
        class="pl-9"
        bind:value={agentSearchQuery}
      />
    </div>

    <!-- 智能体网格 -->
    <ScrollArea class="h-[400px]">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-1">
        <!-- 不使用智能体选项 -->
        <button
          class="border rounded-lg p-3 hover:shadow-md transition-shadow text-left {!aiChatStore.selectedAgentId ? 'ring-2 ring-primary' : ''}"
          onclick={() => selectAgent(null)}
        >
          <div class="flex items-start gap-3">
            <div class="size-10 shrink-0 rounded-full bg-muted flex items-center justify-center">
              <Icon icon="mdi:robot-off" class="size-5 text-muted-foreground" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="font-medium text-sm">不使用智能体</h3>
                {#if !aiChatStore.selectedAgentId}
                  <Icon icon="mdi:check-circle" class="size-4 text-primary" />
                {/if}
              </div>
              <p class="text-xs text-muted-foreground mt-1">直接与模型对话</p>
            </div>
          </div>
        </button>

        {#if agentLoading && agentList.length === 0}
          {#each [1, 2, 3, 4, 5] as _}
            <Skeleton class="h-24 w-full rounded-lg" />
          {/each}
        {:else}
          {#each agentList as agent}
            <button
              class="border rounded-lg p-3 hover:shadow-md transition-shadow text-left {aiChatStore.selectedAgentId === agent.id ? 'ring-2 ring-primary' : ''}"
              onclick={() => selectAgent(agent)}
            >
              <div class="flex items-start gap-3">
                <div 
                  class="size-10 shrink-0 rounded-full border-2 flex items-center justify-center bg-muted overflow-hidden" 
                  style={agent.color ? `border-color: ${agent.color}` : ''}
                >
                  {#if agent.avatar}
                    <img src={agent.avatar} alt={agent.name} class="size-full object-cover" />
                  {:else}
                    <span class="text-sm text-muted-foreground">
                      {agent.name ? agent.name.charAt(0).toUpperCase() : 'A'}
                    </span>
                  {/if}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <h3 class="font-medium text-sm truncate">{agent.name}</h3>
                    {#if aiChatStore.selectedAgentId === agent.id}
                      <Icon icon="mdi:check-circle" class="size-4 text-primary shrink-0" />
                    {/if}
                  </div>
                  <p class="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {agent.description || '暂无描述'}
                  </p>
                </div>
              </div>
              <div class="mt-2 pt-2 border-t">
                <div class="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <div class="flex items-center gap-1">
                    <Icon icon="mdi:cloud" class="size-3" />
                    <span>{getProviderName(agent.providerId)}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <Icon icon="mdi:brain" class="size-3" />
                    <span class="truncate max-w-[80px]">{getModelName(agent.modelId)}</span>
                  </div>
                </div>
              </div>
            </button>
          {/each}
        {/if}
      </div>

      <!-- 加载更多 -->
      {#if agentList.length < agentTotal}
        <div class="flex justify-center py-4">
          <Button
            variant="outline"
            size="sm"
            onclick={loadMoreAgents}
            disabled={agentLoading}
          >
            {#if agentLoading}
              <Icon icon="mdi:loading" class="size-4 animate-spin mr-1" />
            {/if}
            加载更多 ({agentList.length}/{agentTotal})
          </Button>
        </div>
      {/if}
    </ScrollArea>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => agentDialogOpen = false}>取消</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
