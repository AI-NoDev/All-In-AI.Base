<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { FileIcon } from '@qiyu-allinai/file-icons';
  import type { SharedFolderItem, SharedFileItem, FileViewMode } from '@/lib/stores/knowledge.svelte';

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

  function getViewModeTitle(): string {
    switch (viewMode) {
      case 'my-shared': return '我共享的';
      case 'shared-with-me': return '收到的共享';
      case 'favorites': return '收藏';
      default: return '';
    }
  }
</script>

<div class="flex-1 overflow-auto">
  {#if loading}
    <div class="space-y-2 p-4">
      {#each Array(5) as _}
        <Skeleton class="h-12 w-full" />
      {/each}
    </div>
  {:else if folders.length === 0 && files.length === 0}
    <div class="flex flex-col items-center justify-center h-64 text-muted-foreground">
      <Icon icon="tdesign:folder-open" class="size-16 mb-4 opacity-50" />
      <p class="text-lg">{getViewModeTitle()}为空</p>
      <p class="text-sm">
        {#if viewMode === 'my-shared'}
          您还没有共享任何文件或文件夹
        {:else if viewMode === 'shared-with-me'}
          还没有人与您共享文件
        {:else if viewMode === 'favorites'}
          您还没有收藏任何文件或文件夹
        {/if}
      </p>
    </div>
  {:else}
    <table class="w-full">
      <thead class="sticky top-0 bg-background border-b">
        <tr class="text-left text-sm text-muted-foreground">
          <th class="p-2 font-medium">名称</th>
          {#if viewMode === 'my-shared'}
            <th class="p-2 font-medium">共享给</th>
          {:else if viewMode === 'shared-with-me'}
            <th class="p-2 font-medium">共享者</th>
            <th class="p-2 font-medium">权限</th>
          {/if}
          <th class="p-2 font-medium">大小</th>
          <th class="p-2 font-medium">创建时间</th>
          {#if viewMode === 'favorites'}
            <th class="p-2 font-medium w-20">操作</th>
          {/if}
        </tr>
      </thead>
      <tbody>
        {#each folders as folder}
          <tr
            class="border-b hover:bg-muted/50 cursor-pointer"
            onclick={() => onFolderClick?.(folder)}
          >
            <td class="p-2">
              <div class="flex items-center gap-2">
                <Icon
                  icon={folder.icon || 'tdesign:folder'}
                  class="size-5"
                  style={folder.color ? `color: ${folder.color}` : ''}
                />
                <span class="truncate">{folder.name}</span>
                {#if folder.isPublic}
                  <Icon icon="tdesign:earth" class="size-4 text-muted-foreground" title="公开" />
                {/if}
              </div>
            </td>
            {#if viewMode === 'my-shared'}
              <td class="p-2 text-sm text-muted-foreground">
                {folder.sharedTo?.length || 0} 人/角色
              </td>
            {:else if viewMode === 'shared-with-me'}
              <td class="p-2 text-sm text-muted-foreground">{folder.sharedBy || '-'}</td>
              <td class="p-2 text-sm">
                <span class="px-2 py-0.5 rounded bg-muted text-xs">{folder.permission || 'read'}</span>
              </td>
            {/if}
            <td class="p-2 text-sm text-muted-foreground">-</td>
            <td class="p-2 text-sm text-muted-foreground">{formatDate(folder.createdAt)}</td>
            {#if viewMode === 'favorites'}
              <td class="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={(e: MouseEvent) => { e.stopPropagation(); onRemoveFavorite?.('folder', folder.id); }}
                >
                  <Icon icon="tdesign:star-filled" class="size-4 text-yellow-500" />
                </Button>
              </td>
            {/if}
          </tr>
        {/each}
        {#each files as file}
          <tr
            class="border-b hover:bg-muted/50 cursor-pointer"
            onclick={() => onFileClick?.(file)}
          >
            <td class="p-2">
              <div class="flex items-center gap-2">
                <FileIcon filename={file.name} class="size-5" />
                <span class="truncate">{file.name}</span>
                {#if file.isPublic}
                  <Icon icon="tdesign:earth" class="size-4 text-muted-foreground" title="公开" />
                {/if}
              </div>
            </td>
            {#if viewMode === 'my-shared'}
              <td class="p-2 text-sm text-muted-foreground">
                {file.sharedTo?.length || 0} 人/角色
              </td>
            {:else if viewMode === 'shared-with-me'}
              <td class="p-2 text-sm text-muted-foreground">{file.sharedBy || '-'}</td>
              <td class="p-2 text-sm">
                <span class="px-2 py-0.5 rounded bg-muted text-xs">{file.permission || 'read'}</span>
              </td>
            {/if}
            <td class="p-2 text-sm text-muted-foreground">{formatSize(file.size)}</td>
            <td class="p-2 text-sm text-muted-foreground">{formatDate(file.createdAt)}</td>
            {#if viewMode === 'favorites'}
              <td class="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={(e: MouseEvent) => { e.stopPropagation(); onRemoveFavorite?.('file', file.id); }}
                >
                  <Icon icon="tdesign:star-filled" class="size-4 text-yellow-500" />
                </Button>
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
