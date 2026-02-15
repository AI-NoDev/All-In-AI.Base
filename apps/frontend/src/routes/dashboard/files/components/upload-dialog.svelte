<script lang="ts">
  import * as Dialog from '@qiyu-allinai/ui/components/dialog';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Badge } from '@qiyu-allinai/ui/components/badge';
  import Icon from '@iconify/svelte';
  import type { ConflictMode } from './types';

  interface UploadItem {
    id: string;
    file: File;
    relativePath: string;
    status: 'pending' | 'uploading' | 'success' | 'error' | 'duplicate' | 'skipped';
    progress: number;
    error?: string;
    existingFileId?: string;
    conflictMode?: ConflictMode;
  }

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: UploadItem[];
    onStartUpload: () => void;
    onCancel: () => void;
    onHandleDuplicate: (itemId: string, action: ConflictMode | 'skip-all' | 'overwrite-all' | 'newVersion-all' | 'copy-all') => void;
    isUploading: boolean;
    isComplete: boolean;
    hasDuplicates: boolean;
  }

  let { 
    open = $bindable(false), 
    onOpenChange, 
    items, 
    onStartUpload, 
    onCancel, 
    onHandleDuplicate,
    isUploading,
    isComplete,
    hasDuplicates
  }: Props = $props();

  let completedCount = $derived(items.filter(i => i.status === 'success').length);
  let errorCount = $derived(items.filter(i => i.status === 'error').length);
  let skippedCount = $derived(items.filter(i => i.status === 'skipped').length);
  let duplicateCount = $derived(items.filter(i => i.status === 'duplicate').length);
  let totalCount = $derived(items.length);
  
  let overallProgress = $derived(
    totalCount > 0 ? Math.round(((completedCount + skippedCount) / totalCount) * 100) : 0
  );

  // Show batch buttons only when there are multiple duplicates
  let showBatchButtons = $derived(duplicateCount > 1);

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function getStatusIcon(status: UploadItem['status']): string {
    switch (status) {
      case 'pending': return 'mdi:clock-outline';
      case 'uploading': return 'mdi:loading';
      case 'success': return 'mdi:check-circle';
      case 'error': return 'mdi:alert-circle';
      case 'duplicate': return 'mdi:file-alert';
      case 'skipped': return 'mdi:skip-next-circle';
    }
  }

  function getStatusColor(status: UploadItem['status']): string {
    switch (status) {
      case 'pending': return 'text-muted-foreground';
      case 'uploading': return 'text-blue-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'duplicate': return 'text-amber-500';
      case 'skipped': return 'text-gray-400';
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (!isUploading) {
      open = newOpen;
      onOpenChange(newOpen);
    }
  }

  function handleClose() {
    if (!isUploading || isComplete) {
      onCancel();
    }
  }
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
  <Dialog.Content class="sm:max-w-2xl max-h-[80vh] flex flex-col">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <Icon icon="mdi:upload" class="w-5 h-5" />
        上传文件
        {#if isUploading || isComplete}
          <span class="text-sm font-normal text-muted-foreground">
            ({completedCount}/{totalCount - skippedCount})
          </span>
        {/if}
      </Dialog.Title>
    </Dialog.Header>

    {#if hasDuplicates && duplicateCount > 0}
      <div class="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div class="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
          <Icon icon="mdi:alert" class="w-5 h-5" />
          <span class="font-medium">发现 {duplicateCount} 个重复文件</span>
        </div>
        <p class="text-sm text-amber-600 dark:text-amber-500 mb-3">
          以下文件已存在，请选择处理方式：
        </p>
        {#if showBatchButtons}
          <div class="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onclick={() => onHandleDuplicate('', 'overwrite-all')}>
              <Icon icon="mdi:file-replace" class="w-4 h-4 mr-1" />
              全部覆盖
            </Button>
            <Button size="sm" variant="outline" onclick={() => onHandleDuplicate('', 'newVersion-all')}>
              <Icon icon="mdi:file-document-plus" class="w-4 h-4 mr-1" />
              全部创建新版本
            </Button>
            <Button size="sm" variant="outline" onclick={() => onHandleDuplicate('', 'copy-all')}>
              <Icon icon="mdi:file-multiple" class="w-4 h-4 mr-1" />
              全部保存为副本
            </Button>
            <Button size="sm" variant="outline" onclick={() => onHandleDuplicate('', 'skip-all')}>
              <Icon icon="mdi:skip-forward" class="w-4 h-4 mr-1" />
              全部跳过
            </Button>
          </div>
        {/if}
      </div>
    {/if}

    {#if (isUploading || isComplete) && !hasDuplicates}
      <div class="mb-4">
        <div class="flex justify-between text-sm mb-1">
          <span>总进度</span>
          <span>{overallProgress}%</span>
        </div>
        <div class="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            class="h-full bg-primary transition-all duration-300"
            style="width: {overallProgress}%"
          ></div>
        </div>
        <div class="flex gap-4 mt-2 text-sm">
          {#if completedCount > 0}
            <span class="text-green-500">{completedCount} 成功</span>
          {/if}
          {#if errorCount > 0}
            <span class="text-red-500">{errorCount} 失败</span>
          {/if}
          {#if skippedCount > 0}
            <span class="text-gray-400">{skippedCount} 跳过</span>
          {/if}
        </div>
      </div>
    {/if}

    <div class="max-h-[400px] overflow-y-auto">
      <div class="space-y-2 pr-2">
        {#each items as item (item.id)}
          <div class="flex items-center gap-3 p-2 rounded-lg border bg-card {item.status === 'duplicate' ? 'border-amber-300 dark:border-amber-700' : ''}">
            <Icon 
              icon={getStatusIcon(item.status)} 
              class="w-5 h-5 flex-shrink-0 {getStatusColor(item.status)} {item.status === 'uploading' ? 'animate-spin' : ''}"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-medium truncate {item.status === 'skipped' ? 'text-muted-foreground line-through' : ''}" title={item.relativePath}>
                  {item.file.name}
                </p>
                <div class="flex items-center gap-2 flex-shrink-0">
                  {#if item.status === 'duplicate'}
                    <Badge variant="outline" class="text-amber-600 border-amber-300">重复</Badge>
                  {:else if item.status === 'skipped'}
                    <Badge variant="secondary">已跳过</Badge>
                  {:else if item.conflictMode === 'overwrite'}
                    <Badge variant="outline" class="text-blue-600 border-blue-300">覆盖</Badge>
                  {:else if item.conflictMode === 'newVersion'}
                    <Badge variant="outline" class="text-green-600 border-green-300">新版本</Badge>
                  {:else if item.conflictMode === 'copy'}
                    <Badge variant="outline" class="text-purple-600 border-purple-300">副本</Badge>
                  {/if}
                  <span class="text-xs text-muted-foreground">
                    {formatFileSize(item.file.size)}
                  </span>
                </div>
              </div>
              {#if item.relativePath !== item.file.name}
                <p class="text-xs text-muted-foreground truncate" title={item.relativePath}>
                  {item.relativePath}
                </p>
              {/if}
              {#if item.status === 'uploading' || item.status === 'success'}
                <div class="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    class="h-full transition-all duration-300 {item.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}"
                    style="width: {item.progress}%"
                  ></div>
                </div>
              {/if}
              {#if item.status === 'duplicate'}
                <div class="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" class="h-7 text-xs" onclick={() => onHandleDuplicate(item.id, 'overwrite')}>
                    <Icon icon="mdi:file-replace" class="w-3 h-3 mr-1" />
                    覆盖
                  </Button>
                  <Button size="sm" variant="outline" class="h-7 text-xs" onclick={() => onHandleDuplicate(item.id, 'newVersion')}>
                    <Icon icon="mdi:file-document-plus" class="w-3 h-3 mr-1" />
                    新版本
                  </Button>
                  <Button size="sm" variant="outline" class="h-7 text-xs" onclick={() => onHandleDuplicate(item.id, 'copy')}>
                    <Icon icon="mdi:file-multiple" class="w-3 h-3 mr-1" />
                    副本
                  </Button>
                  <Button size="sm" variant="ghost" class="h-7 text-xs" onclick={() => onHandleDuplicate(item.id, 'skip')}>
                    <Icon icon="mdi:skip-next" class="w-3 h-3 mr-1" />
                    跳过
                  </Button>
                </div>
              {/if}
              {#if item.error}
                <p class="text-xs text-red-500 mt-1">{item.error}</p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <Dialog.Footer class="mt-4">
      {#if !isUploading && !isComplete && !hasDuplicates}
        <div class="flex items-center justify-between w-full">
          <span class="text-sm text-muted-foreground">
            共 {totalCount} 个文件
          </span>
          <div class="flex gap-2">
            <Button variant="outline" onclick={handleClose}>取消</Button>
            <Button onclick={onStartUpload} disabled={totalCount === 0}>
              <Icon icon="mdi:upload" class="w-4 h-4 mr-1" />
              开始上传
            </Button>
          </div>
        </div>
      {:else if hasDuplicates}
        <div class="flex items-center justify-between w-full">
          <span class="text-sm text-muted-foreground">
            请处理重复文件后继续
          </span>
          <div class="flex gap-2">
            <Button variant="outline" onclick={handleClose}>取消</Button>
            <Button onclick={onStartUpload} disabled={duplicateCount > 0}>
              <Icon icon="mdi:upload" class="w-4 h-4 mr-1" />
              继续上传
            </Button>
          </div>
        </div>
      {:else if isComplete}
        <div class="flex items-center justify-between w-full">
          <span class="text-sm text-green-600 font-medium flex items-center gap-1">
            <Icon icon="mdi:check-circle" class="w-4 h-4" />
            上传完成
            {#if skippedCount > 0}
              <span class="text-muted-foreground font-normal">（{skippedCount} 个已跳过）</span>
            {/if}
          </span>
          <Button onclick={handleClose}>
            完成
          </Button>
        </div>
      {:else}
        <div class="flex items-center justify-between w-full">
          <span class="text-sm text-muted-foreground">
            正在上传...
          </span>
          <Button variant="outline" disabled>
            取消
          </Button>
        </div>
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
