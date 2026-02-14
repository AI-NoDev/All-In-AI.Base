<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Empty from '$lib/components/ui/empty';
  import { Button } from '$lib/components/ui/button';
  import { imStore } from '@/lib/stores/im';
  import {
    ConversationList,
    ChatHeader,
    MessageList,
    MessageInput,
    CreateGroupSheet,
    DissolveDialog,
  } from './components';

  // ============ State ============
  let showCreateGroup = $state(false);
  let showDissolveDialog = $state(false);
  let dissolveConversationId = $state<string | null>(null);
  let isDragging = $state(false);
  let dragCounter = $state(0);
  let viewportRef = $state<HTMLElement | null>(null);
  let showScrollToBottom = $state(false);
  let messageInputRef = $state<{ handleFileDrop: (files: File[]) => void } | null>(null);

  // ============ Drag & Drop Handlers ============
  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.dataTransfer?.types.includes('Files')) {
      isDragging = true;
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter === 0) {
      isDragging = false;
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;
    dragCounter = 0;

    const items = e.dataTransfer?.items;
    if (!items) return;

    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry?.();
        if (entry && entry.isFile) {
          const file = item.getAsFile();
          if (file) files.push(file);
        } else if (!entry) {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }
    }

    if (files.length > 0 && messageInputRef) {
      messageInputRef.handleFileDrop(files);
    }
  }

  // ============ Scroll Handlers ============
  function handleScroll(e: Event) {
    const target = e.target as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    showScrollToBottom = distanceFromBottom > 100;
    
    if (scrollTop < 50 && imStore.hasMoreMessages && !imStore.isLoadingMoreMessages) {
      loadMoreMessagesWithScrollPreserve();
    }
  }

  async function loadMoreMessagesWithScrollPreserve() {
    if (!viewportRef) return;
    
    const prevScrollHeight = viewportRef.scrollHeight;
    const prevScrollTop = viewportRef.scrollTop;
    
    await imStore.loadMoreMessages();
    
    requestAnimationFrame(() => {
      if (viewportRef) {
        const newScrollHeight = viewportRef.scrollHeight;
        const scrollDiff = newScrollHeight - prevScrollHeight;
        viewportRef.scrollTop = prevScrollTop + scrollDiff;
      }
    });
  }

  function scrollToBottom() {
    if (viewportRef) {
      viewportRef.scrollTo({ 
        top: viewportRef.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }

  // Auto-scroll to bottom when new message arrives
  $effect(() => {
    const unsubscribe = imStore.onNewMessage(() => {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    });
    return unsubscribe;
  });

  // Scroll to bottom when conversation changes
  $effect(() => {
    if (imStore.selectedConversationId && !imStore.isLoadingMessages) {
      requestAnimationFrame(() => {
        if (viewportRef) {
          viewportRef.scrollTo({ top: viewportRef.scrollHeight, behavior: 'instant' });
        }
      });
    }
  });

  // ============ Handlers ============
  async function handleGroupCreated(conversationId: string) {
    await imStore.loadConversations();
    imStore.selectConversation(conversationId);
  }

  function openDissolveDialog(convId: string) {
    dissolveConversationId = convId;
    showDissolveDialog = true;
  }

  function isGroupDissolved(conv: { status: string | null }): boolean {
    return conv.status === '1';
  }
</script>

<div class="flex flex-1 min-h-0">
  <!-- 左侧会话列表 -->
  <ConversationList onCreateGroup={() => showCreateGroup = true} />

  <!-- 右侧聊天区域 -->
  <div 
    class="flex-1 flex flex-col min-h-0 relative"
    role="region"
    aria-label="聊天区域"
    ondragenter={handleDragEnter}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    <!-- 拖拽提示遮罩 -->
    {#if isDragging && imStore.selectedConversation && !isGroupDissolved(imStore.selectedConversation)}
      <div class="absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center pointer-events-none">
        <div class="text-center">
          <Icon icon="mdi:file-upload-outline" class="size-12 text-primary mx-auto mb-2" />
          <p class="text-primary font-medium">释放文件以发送</p>
          <p class="text-sm text-muted-foreground">仅支持文件，不支持文件夹</p>
        </div>
      </div>
    {/if}

    {#if imStore.selectedConversation}
      <!-- 聊天头部 -->
      <ChatHeader onDissolve={openDissolveDialog} />

      <!-- 消息列表 -->
      <MessageList 
        bind:viewportRef={viewportRef}
        {showScrollToBottom}
        onScroll={handleScroll}
        onScrollToBottom={scrollToBottom}
      />

      <!-- 输入区域 -->
      <MessageInput 
        bind:this={messageInputRef}
        {showScrollToBottom}
        onScrollToBottom={scrollToBottom}
      />
    {:else}
      <!-- 空状态 -->
      <div class="flex-1 flex items-center justify-center">
        <Empty.Root>
          <Empty.Media>
            <Icon icon="tdesign:chat" class="size-16 text-muted-foreground/50" />
          </Empty.Media>
          <Empty.Header>
            <Empty.Title>选择一个会话开始聊天</Empty.Title>
            <Empty.Description>
              从左侧列表选择会话，或者创建新的群聊
            </Empty.Description>
          </Empty.Header>
          <Empty.Content>
            <div class="flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" onclick={() => showCreateGroup = true}>
                <Icon icon="tdesign:chat-add" class="mr-2 size-4" />
                新建会话
              </Button>
            </div>
          </Empty.Content>
        </Empty.Root>
      </div>
    {/if}
  </div>
</div>

<!-- 创建群聊 Sheet -->
<CreateGroupSheet 
  bind:open={showCreateGroup} 
  onOpenChange={(v) => showCreateGroup = v}
  onCreated={handleGroupCreated}
/>

<!-- 解散群聊确认对话框 -->
<DissolveDialog 
  bind:open={showDissolveDialog}
  conversationId={dissolveConversationId}
  onOpenChange={(v) => { showDissolveDialog = v; if (!v) dissolveConversationId = null; }}
/>
