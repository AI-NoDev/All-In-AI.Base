<script lang="ts">
  import Icon from '@iconify/svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { imStore } from '@/lib/stores/im.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
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

<div class="flex-1 overflow-hidden relative">
  <ScrollArea class="h-full" bind:ref={scrollAreaRef} bind:viewportRef={viewportRef}>
    <div class="p-4 space-y-4">
      {#if imStore.isLoadingMoreMessages}
        <div class="flex items-center justify-center py-2 text-muted-foreground text-sm">
          <Icon icon="mdi:loading" class="size-4 animate-spin mr-2" />
          {t('page.im.loadingMore')}
        </div>
      {:else if !imStore.hasMoreMessages && imStore.messages.length > 0}
        <div class="flex items-center justify-center py-2 text-muted-foreground text-sm">
          {t('page.im.noMoreMessages')}
        </div>
      {/if}
      {#if imStore.isLoadingMessages}
        <div class="flex items-center justify-center py-8 text-muted-foreground">
          {t('common.tips.loading')}
        </div>
      {:else if imStore.messages.length === 0}
        <div class="flex items-center justify-center py-8 text-muted-foreground">
          {t('page.im.noMessages')}
        </div>
      {:else}
        {#each imStore.messages as msg}
          <MessageItem message={msg} />
        {/each}
      {/if}
    </div>
  </ScrollArea>
</div>
