<script lang="ts">
  import Icon from '@iconify/svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { imStore } from '@/lib/stores/im.svelte';
  import MessageItem from './message-item.svelte';

  interface Props {
    viewportRef: HTMLElement | null;
    showScrollToBottom: boolean;
    onScroll: (e: Event) => void;
    onScrollToBottom: () => void;
  }

  let { viewportRef = $bindable(), showScrollToBottom, onScroll, onScrollToBottom }: Props = $props();

  let scrollAreaRef = $state<HTMLDivElement | null>(null);

  // Attach scroll event listener to viewport
  $effect(() => {
    if (viewportRef) {
      viewportRef.addEventListener('scroll', onScroll);
      return () => {
        viewportRef?.removeEventListener('scroll', onScroll);
      };
    }
  });
</script>

<div class="flex-1 min-h-0 relative">
  <ScrollArea class="h-full" bind:ref={scrollAreaRef} bind:viewportRef={viewportRef}>
    <div class="p-4 space-y-4">
      {#if imStore.isLoadingMoreMessages}
        <div class="flex items-center justify-center py-2 text-muted-foreground text-sm">
          <Icon icon="mdi:loading" class="size-4 animate-spin mr-2" />
          加载更多消息...
        </div>
      {:else if !imStore.hasMoreMessages && imStore.messages.length > 0}
        <div class="flex items-center justify-center py-2 text-muted-foreground text-sm">
          没有更多消息了
        </div>
      {/if}
      {#if imStore.isLoadingMessages}
        <div class="flex items-center justify-center py-8 text-muted-foreground">
          加载中...
        </div>
      {:else if imStore.messages.length === 0}
        <div class="flex items-center justify-center py-8 text-muted-foreground">
          暂无消息记录
        </div>
      {:else}
        {#each imStore.messages as msg}
          <MessageItem message={msg} />
        {/each}
      {/if}
    </div>
  </ScrollArea>
</div>
