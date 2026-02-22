<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import * as Table from '$lib/components/ui/table';
  import { FileIcon } from '@qiyu-allinai/file-icons';
  import type { SharedFolderItem, SharedFileItem, FileViewMode } from '@/lib/stores/knowledge.svelte';
  import { t } from '$lib/stores/i18n.svelte';

  interface Props {
    loading: boolean;
    viewMode: FileViewMode;
    folders: SharedFolderItem[];
    files: SharedFileItem[];
    onFolderClick?: (folder: SharedFolderItem) => void;
    onFileClick?: (file: SharedFileItem) => void;
    onRemoveFavorite?: (type: 'folder' | 'file', id: string) => void;
  }

  let {
    loading,
    viewMode,
    folders,
    files,
    onFolderClick,
    onFileClick,
    onRemoveFavorite,
  }: Props = $props();

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  let viewModeTitle = $derived.by(() => {
    switch (viewMode) {
      case 'my-shared': return t('page.knowledge.mySharedTab');
      case 'shared-with-me': return t('page.knowledge.sharedWithMeTab');
      case 'favorites': return t('page.knowledge.favoritesTab');
      default: return '';
    }
  });

  let emptyHint = $derived.by(() => {
    switch (viewMode) {
      case 'my-shared': return t('page.knowledge.noMyShared');
      case 'shared-with-me': return t('page.knowledge.noSharedFiles');
      case 'favorites': return t('page.knowledge.noFavorites');
      default: return '';
    }
  });
</script>

<div class="flex flex-col flex-1 min-h-0">
  {#if loading}
    <div class="space-y-2 p-4">
      {#each Array(5) as _}
        <Skeleton class="h-12 w-full" />
      {/each}
    </div>
  {:else if folders.length === 0 && files.length === 0}
    <div class="flex flex-col items-center justify-center h-64 text-muted-foreground">
      <Icon icon="tdesign:folder-open" class="size-16 mb-4 opacity-50" />
      <p class="text-lg">{viewModeTitle}</p>
      <p class="text-sm">{emptyHint}</p>
    </div>
  {:else}
    <ScrollArea class="flex-1 min-h-0">
      <Table.Root>
        <Table.Header class="sticky top-0 bg-muted/50 z-10">
          <Table.Row>
            <Table.Head>{t('page.knowledge.name')}</Table.Head>
            {#if viewMode === 'my-shared'}
              <Table.Head>{t('page.knowledge.shareWith')}</Table.Head>
            {:else if viewMode === 'shared-with-me'}
              <Table.Head>{t('page.knowledge.sharedBy')}</Table.Head>
              <Table.Head>{t('page.knowledge.permission')}</Table.Head>
            {/if}
            <Table.Head>{t('page.knowledge.size')}</Table.Head>
            <Table.Head>{t('page.knowledge.createdTime')}</Table.Head>
            {#if viewMode === 'favorites'}
              <Table.Head class="w-20">{t('page.knowledge.actions')}</Table.Head>
            {/if}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each folders as folder}
            <Table.Row
              class="cursor-pointer hover:bg-muted/50"
              onclick={() => onFolderClick?.(folder)}
            >
              <Table.Cell>
                <div class="flex items-center gap-2">
                  <Icon
                    icon={folder.icon || 'tdesign:folder'}
                    class="size-5"
                    style={folder.color ? `color: ${folder.color}` : ''}
                  />
                  <span class="truncate">{folder.name}</span>
                  {#if folder.isPublic}
                    <Icon icon="tdesign:earth" class="size-4 text-muted-foreground" title={t('page.knowledge.public')} />
                  {/if}
                </div>
              </Table.Cell>
              {#if viewMode === 'my-shared'}
                <Table.Cell class="text-muted-foreground">
                  {folder.sharedTo?.length || 0} 人/角色
                </Table.Cell>
              {:else if viewMode === 'shared-with-me'}
                <Table.Cell class="text-muted-foreground">{folder.sharedBy || '-'}</Table.Cell>
                <Table.Cell>
                  <span class="px-2 py-0.5 rounded bg-muted text-xs">{folder.permission || 'read'}</span>
                </Table.Cell>
              {/if}
              <Table.Cell class="text-muted-foreground">-</Table.Cell>
              <Table.Cell class="text-muted-foreground">{formatDate(folder.createdAt)}</Table.Cell>
              {#if viewMode === 'favorites'}
                <Table.Cell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onclick={(e: MouseEvent) => { e.stopPropagation(); onRemoveFavorite?.('folder', folder.id); }}
                  >
                    <Icon icon="tdesign:star-filled" class="size-4 text-yellow-500" />
                  </Button>
                </Table.Cell>
              {/if}
            </Table.Row>
          {/each}
          {#each files as file}
            <Table.Row
              class="cursor-pointer hover:bg-muted/50"
              onclick={() => onFileClick?.(file)}
            >
              <Table.Cell>
                <div class="flex items-center gap-2">
                  <FileIcon filename={file.name} class="size-5" />
                  <span class="truncate">{file.name}</span>
                  {#if file.isPublic}
                    <Icon icon="tdesign:earth" class="size-4 text-muted-foreground" title={t('page.knowledge.public')} />
                  {/if}
                </div>
              </Table.Cell>
              {#if viewMode === 'my-shared'}
                <Table.Cell class="text-muted-foreground">
                  {file.sharedTo?.length || 0} 人/角色
                </Table.Cell>
              {:else if viewMode === 'shared-with-me'}
                <Table.Cell class="text-muted-foreground">{file.sharedBy || '-'}</Table.Cell>
                <Table.Cell>
                  <span class="px-2 py-0.5 rounded bg-muted text-xs">{file.permission || 'read'}</span>
                </Table.Cell>
              {/if}
              <Table.Cell class="text-muted-foreground">{formatSize(file.size)}</Table.Cell>
              <Table.Cell class="text-muted-foreground">{formatDate(file.createdAt)}</Table.Cell>
              {#if viewMode === 'favorites'}
                <Table.Cell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onclick={(e: MouseEvent) => { e.stopPropagation(); onRemoveFavorite?.('file', file.id); }}
                  >
                    <Icon icon="tdesign:star-filled" class="size-4 text-yellow-500" />
                  </Button>
                </Table.Cell>
              {/if}
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  {/if}
</div>
