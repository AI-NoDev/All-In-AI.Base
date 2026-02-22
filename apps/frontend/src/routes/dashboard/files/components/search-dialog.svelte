<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import { t } from '$lib/stores/i18n.svelte';

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSearch: (query: string) => void;
  }

  let { open, onOpenChange, onSearch }: Props = $props();

  let searchQuery = $state('');

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  }
</script>

<Dialog.Root {open} {onOpenChange}>
  <Dialog.Content class="sm:max-w-xl p-0 gap-0 overflow-hidden">
    <div class="flex items-center border-b px-4">
      <Icon icon="tdesign:search" class="size-5 text-muted-foreground mr-3" />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder={t('page.knowledge.searchPlaceholder')}
        class="flex-1 h-14 bg-transparent outline-none text-base placeholder:text-muted-foreground"
        onkeydown={handleKeydown}
      />
      <kbd class="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
        ESC
      </kbd>
    </div>
    <div class="max-h-80 overflow-y-auto p-2">
      {#if searchQuery.trim()}
        <div class="text-sm text-muted-foreground text-center py-8">
          {t('page.knowledge.search')} "{searchQuery}"
        </div>
      {:else}
        <div class="text-sm text-muted-foreground text-center py-8">
          {t('page.knowledge.searchPlaceholder')}
        </div>
      {/if}
    </div>
  </Dialog.Content>
</Dialog.Root>
