<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Separator } from '$lib/components/ui/separator';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { t } from '$lib/stores/i18n.svelte';

  interface Props {
    hasSelection: boolean;
    hasClipboard: boolean;
    clipboardCount: number;
    onNewFolder: () => void;
    onNewTextFile: () => void;
    onCopy: () => void;
    onPaste: () => void;
    onDelete: () => void;
    onSearch: () => void;
    onRefresh: () => void;
  }

  let {
    hasSelection,
    hasClipboard,
    clipboardCount,
    onNewFolder,
    onNewTextFile,
    onCopy,
    onPaste,
    onDelete,
    onSearch,
    onRefresh,
  }: Props = $props();
</script>

<div class="flex items-center gap-1">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button size="sm" variant="outline" class="h-8" {...props}>
          <Icon icon="tdesign:add" class="mr-1 size-4" />
          {t('page.knowledge.new')}
          <Icon icon="tdesign:chevron-down" class="ml-1 size-3" />
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Item onclick={onNewFolder}>
        <Icon icon="tdesign:folder-add" class="mr-2 size-4" />
        {t('page.knowledge.newFolder')}
      </DropdownMenu.Item>
      <DropdownMenu.Item onclick={onNewTextFile}>
        <Icon icon="tdesign:file-add" class="mr-2 size-4" />
        {t('page.knowledge.newTextFile')}
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>

  {#if hasSelection}
    <Separator orientation="vertical" class="h-6 mx-1" />
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onCopy} title={t('page.knowledge.copy')}>
      <Icon icon="tdesign:file-copy" class="size-4" />
    </Button>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0 text-destructive" onclick={onDelete} title={t('page.knowledge.delete')}>
      <Icon icon="tdesign:delete" class="size-4" />
    </Button>
  {/if}

  {#if hasClipboard}
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onPaste} title="{t('page.knowledge.paste')} ({clipboardCount})">
      <Icon icon="tdesign:paste" class="size-4" />
    </Button>
  {/if}

  <Separator orientation="vertical" class="h-6 mx-1" />

  <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onSearch} title={t('page.knowledge.search')}>
    <Icon icon="tdesign:search" class="size-4" />
  </Button>
  <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={onRefresh} title={t('page.knowledge.refresh')}>
    <Icon icon="tdesign:refresh" class="size-4" />
  </Button>
</div>
