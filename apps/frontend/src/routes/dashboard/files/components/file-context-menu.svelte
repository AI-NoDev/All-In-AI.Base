<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as ContextMenu from '$lib/components/ui/context-menu';
  import type { Snippet } from 'svelte';

  // Generic item interface that works with both FolderItem/FileItem and GenericFolder/GenericFile
  interface GenericItem {
    id: string;
    name: string;
    extension?: string | null;
    versionCount?: number;
  }

  interface Props {
    type: 'folder' | 'file';
    item: GenericItem;
    children: Snippet;
    isFavorited?: boolean;
    // All actions are optional - only show menu items for provided callbacks
    onEditDescription?: () => void;
    onDelete?: () => void;
    onDownload?: () => void;
    onCopy?: () => void;
    onCut?: () => void;
    onRename?: () => void;
    onShowInfo?: () => void;
    onEdit?: () => void;
    onEditStyle?: () => void;
    onEditPermission?: () => void;
    onViewVersions?: () => void;
    onToggleFavorite?: () => void;
  }

  let {
    type,
    item,
    children,
    isFavorited = false,
    onEditDescription,
    onDelete,
    onDownload,
    onCopy,
    onCut,
    onRename,
    onShowInfo,
    onEdit,
    onEditStyle,
    onEditPermission,
    onViewVersions,
    onToggleFavorite,
  }: Props = $props();

  let isTextFile = $derived(
    type === 'file' && 
    ['txt', 'md', 'json', 'js', 'ts', 'html', 'css', 'xml', 'yaml', 'yml'].includes(
      (item.extension || '').toLowerCase()
    )
  );

  let hasVersions = $derived(
    type === 'file' && (item.versionCount || 0) > 0
  );
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger class="contents">
    {@render children()}
  </ContextMenu.Trigger>
  <ContextMenu.Content class="w-56">
    <!-- Favorite action -->
    {#if onToggleFavorite}
      <ContextMenu.Item onclick={onToggleFavorite}>
        <Icon icon={isFavorited ? 'tdesign:star-filled' : 'tdesign:star'} class="mr-2 size-4 {isFavorited ? 'text-yellow-500' : ''}" />
        {isFavorited ? '取消收藏' : '收藏'}
      </ContextMenu.Item>
      <ContextMenu.Separator />
    {/if}

    <!-- Primary actions: Edit Description, Delete, Download -->
    {#if onEditDescription}
      <ContextMenu.Item onclick={onEditDescription}>
        <Icon icon="tdesign:file-setting" class="mr-2 size-4" />
        <span class="flex-1">编辑描述</span>
        <span class="text-xs text-muted-foreground ml-2">AI</span>
      </ContextMenu.Item>
    {/if}

    {#if onDownload}
      <ContextMenu.Item onclick={onDownload}>
        <Icon icon="tdesign:download" class="mr-2 size-4" />
        下载
      </ContextMenu.Item>
    {/if}

    {#if onDelete}
      <ContextMenu.Item onclick={onDelete} class="text-destructive focus:text-destructive">
        <Icon icon="tdesign:delete" class="mr-2 size-4" />
        删除
      </ContextMenu.Item>
    {/if}

    <!-- Secondary actions -->
    {#if onCopy || onCut || onRename || onEdit || onEditStyle || onEditPermission || onViewVersions || onShowInfo}
      <ContextMenu.Separator />
    {/if}

    {#if type === 'file' && isTextFile && onEdit}
      <ContextMenu.Item onclick={onEdit}>
        <Icon icon="tdesign:edit" class="mr-2 size-4" />
        编辑文件
      </ContextMenu.Item>
    {/if}

    {#if onCopy}
      <ContextMenu.Item onclick={onCopy}>
        <Icon icon="tdesign:file-copy" class="mr-2 size-4" />
        复制
      </ContextMenu.Item>
    {/if}

    {#if onCut}
      <ContextMenu.Item onclick={onCut}>
        <Icon icon="tdesign:cut" class="mr-2 size-4" />
        剪切
      </ContextMenu.Item>
    {/if}

    {#if onRename}
      <ContextMenu.Item onclick={onRename}>
        <Icon icon="tdesign:edit-1" class="mr-2 size-4" />
        重命名
      </ContextMenu.Item>
    {/if}

    {#if type === 'folder' && onEditStyle}
      <ContextMenu.Item onclick={onEditStyle}>
        <Icon icon="tdesign:palette" class="mr-2 size-4" />
        修改样式
      </ContextMenu.Item>
    {/if}

    {#if onShowInfo}
      <ContextMenu.Item onclick={onShowInfo}>
        <Icon icon="tdesign:info-circle" class="mr-2 size-4" />
        显示简介
      </ContextMenu.Item>
    {/if}

    {#if onEditPermission}
      <ContextMenu.Item onclick={onEditPermission}>
        <Icon icon="tdesign:lock-on" class="mr-2 size-4" />
        编辑权限
      </ContextMenu.Item>
    {/if}

    {#if type === 'file' && hasVersions && onViewVersions}
      <ContextMenu.Item onclick={onViewVersions}>
        <Icon icon="mdi:source-branch" class="mr-2 size-4" />
        查看版本
      </ContextMenu.Item>
    {/if}
  </ContextMenu.Content>
</ContextMenu.Root>
