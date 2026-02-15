<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as ContextMenu from '$lib/components/ui/context-menu';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import type { Snippet } from 'svelte';
  import type { FolderItem, FileItem } from './types';

  interface Props {
    type: 'folder' | 'file';
    item: FolderItem | FileItem;
    children: Snippet;
    onEditDescription: () => void;
    onDelete: () => void;
    onDownload: () => void;
    // Optional actions
    onCopy?: () => void;
    onCut?: () => void;
    onRename?: () => void;
    onShowInfo?: () => void;
    onEdit?: () => void;
    onEditStyle?: () => void;
    onEditPermission?: () => void;
    onViewVersions?: () => void;
  }

  let {
    type,
    item,
    children,
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
  }: Props = $props();

  let isTextFile = $derived(
    type === 'file' && 
    ['txt', 'md', 'json', 'js', 'ts', 'html', 'css', 'xml', 'yaml', 'yml'].includes(
      ((item as FileItem).extension || '').toLowerCase()
    )
  );

  let hasVersions = $derived(
    type === 'file' && (item as FileItem).versionCount > 0
  );
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger class="contents">
    {@render children()}
  </ContextMenu.Trigger>
  <ContextMenu.Content class="w-56">
    <!-- Primary actions: Edit Description, Delete, Download -->
    <ContextMenu.Item onclick={onEditDescription}>
      <Icon icon="tdesign:file-setting" class="mr-2 size-4" />
      <span class="flex-1">编辑描述</span>
      <span class="text-xs text-muted-foreground ml-2">AI</span>
    </ContextMenu.Item>

    <ContextMenu.Item onclick={onDownload}>
      <Icon icon="tdesign:download" class="mr-2 size-4" />
      下载
    </ContextMenu.Item>

    <ContextMenu.Item onclick={onDelete} class="text-destructive focus:text-destructive">
      <Icon icon="tdesign:delete" class="mr-2 size-4" />
      删除
    </ContextMenu.Item>

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
