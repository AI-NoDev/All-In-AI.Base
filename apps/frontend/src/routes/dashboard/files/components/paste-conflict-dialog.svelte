<script lang="ts">
  import * as Dialog from '@qiyu-allinai/ui/components/dialog';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Badge } from '@qiyu-allinai/ui/components/badge';
  import Icon from '@iconify/svelte';
  import type { ConflictMode, PasteConflictItem } from './types';

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    items: PasteConflictItem[];
    onResolve: (itemId: string, action: ConflictMode | 'skip' | 'skip-all' | 'overwrite-all' | 'newVersion-all' | 'copy-all') => void;
    onConfirm: () => void;
    onCancel: () => void;
    isPasting: boolean;
    isComplete: boolean;
  }

  let { 
    open = $bindable(false), 
    onOpenChange, 
    items, 
    onResolve,
    onConfirm,
    onCancel,
    isPasting,
    isComplete,
  }: Props = $props();

  let conflictCount = $derived(items.filter(i => i.status === 'conflict').length);
  let successCount = $derived(items.filter(i => i.status === 'success').length);
  let errorCount = $derived(items.filter(i => i.status === 'error').length);
  let skippedCount = $derived(items.filter(i => i.status === 'skipped').length);
  let totalCount = $derived(items.length);
  let hasConflicts = $derived(conflictCount > 0);
  let showBatchButtons = $derived(conflictCount > 1);

  function getStatusIcon(status: PasteConflictItem['status']): string {
    switch (status) {
      case 'pending': return 'mdi:clock-outline';
      case 'conflict': return 'mdi:file-alert';
      case 'resolved': return 'mdi:check';
      case 'processing': return 'mdi:loading';
      case 'success': return 'mdi:check-circle';
      case 'error': return 'mdi:alert-circle';
      case 'skipped': return 'mdi:skip-next-circle';
    }
  }

  function getStatusColor(status: PasteConflictItem['status']): string {
    switch (status) {
      case 'pending': return 'text-muted-foreground';
      case 'conflict': return 'text-amber-500';
      case 'resolved': return 'text-blue-500';
      case 'processing': return 'text-blue-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'skipped': return 'text-gray-400';
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (!isPasting) {
      open = newOpen;
      onOpenChange(newOpen);
    }
  }
</script>

<Dialog.Root bind:open onOpenChange={handleOpenChange}>
  <Dialog.Content class="sm:max-w-2xl max-h-[80vh] flex flex-col">
    <Dialog.Header>
      <Dialog.Title class="flex items-center gap-2">
        <Icon icon="mdi:content-paste" class="w-5 h-5" />
        粘贴文件
        {#if isPasting || isComplete}
          <span class="text-sm font-normal text-muted-foreground">
            ({successCount}/{totalCount - skippedCount})
          </span>
        {/if}
      </Dialog.Title>
    </Dialog.Header>

    {#if hasConflicts}
      <div class="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div class="flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
          <Icon icon="mdi:alert" class="w-5 h-5" />
          <span class="font-medium">发现 {conflictCount} 个重复文件</span>
        </div>
        <p class="text-sm text-amber-600 dark:text-amber-500 mb-3">
          目标文件夹中已存在同名文件，请选择处理方式：
        </p>
        {#if showBatchButtons}
          <div class="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onclick={() => onResolve('', 'overwrite-all')}>
              <Icon icon="mdi:file-replace" class="w-4 h-4 mr-1" />
              全部覆盖
            </Button>
            <Button size="sm" variant="outline" onclick={() => onResolve('', 'newVersion-all')}>
              <Icon icon="mdi:file-document-plus" class="w-4 h-4 mr-1" />
              全部创建新版本
            </Button>
            <Button size="sm" variant="outline" onclick={() => onResolve('', 'copy-all')}>
              <Icon icon="mdi:file-multiple" class="w-4 h-4 mr-1" />
              全部保存为副本
            </Button>
            <Button size="sm" variant="outline" onclick={() => onResolve('', 'skip-all')}>
              <Icon icon="mdi:skip-forward" class="w-4 h-4 mr-1" />
              全部跳过
            </Button>
          </div>
        {/if}
      </div>
    {/if}

    <div class="max-h-[400px] overflow-y-auto">
      <div class="space-y-2 pr-2">
        {#each items as item (item.clipboardItem.id)}
          <div class="flex items-center gap-3 p-2 rounded-lg border bg-card {item.status === 'conflict' ? 'border-amber-300 dark:border-amber-700' : ''}">
            <Icon 
              icon={getStatusIcon(item.status)} 
              class="w-5 h-5 flex-shrink-0 {getStatusColor(item.status)} {item.status === 'processing' ? 'animate-spin' : ''}"
            />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-medium truncate {item.status === 'skipped' ? 'text-muted-foreground line-through' : ''}">
                  {item.clipboardItem.name}
                </p>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="outline" class="text-xs">
                    {item.clipboardItem.type === 'folder' ? '文件夹' : '文件'}
                  </Badge>
                  <Badge variant={item.clipboardItem.action === 'cut' ? 'default' : 'secondary'} class="text-xs">
                    {item.clipboardItem.action === 'cut' ? '剪切' : '复制'}
                  </Badge>
                  {#if item.status === 'conflict'}
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
                </div>
              </div>
              {#if item.status === 'conflict'}
                <div class="mt-2 flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" class="h-7 text-xs" onclick={() => onResolve(item.clipboardItem.id, 'overwrite')}>
                    <Icon icon="mdi:file-replace" class="w-3 h-3 mr-1" />
                    覆盖
                  </Button>
                  <Button size="sm" variant="outline" class="h-7 text-xs" onclick={() => onResolve(item.clipboardItem.id, 'newVersion')}>
                    <Icon icon="mdi:file-document-plus" class="w-3 h-3 mr-1" />
                    新版本
                  </Button>
                  <Button size="sm" variant="outline" class="h-7 text-xs" onclick={() => onResolve(item.clipboardItem.id, 'copy')}>
                    <Icon icon="mdi:file-multiple" class="w-3 h-3 mr-1" />
                    副本
                  </Button>
                  <Button size="sm" variant="ghost" class="h-7 text-xs" onclick={() => onResolve(item.clipboardItem.id, 'skip')}>
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
      {#if !isPasting && !isComplete && !hasConflicts}
        <div class="flex items-center justify-between w-full">
          <span class="text-sm text-muted-foreground">
            共 {totalCount} 个项目
          </span>
          <div class="flex gap-2">
            <Button variant="outline" onclick={onCancel}>取消</Button>
            <Button onclick={onConfirm}>
              <Icon icon="mdi:content-paste" class="w-4 h-4 mr-1" />
              确认粘贴
            </Button>
          </div>
        </div>
      {:else if hasConflicts}
        <div class="flex items-center justify-between w-full">
          <span class="text-sm text-muted-foreground">
            请处理重复文件后继续
          </span>
          <div class="flex gap-2">
            <Button variant="outline" onclick={onCancel}>取消</Button>
            <Button onclick={onConfirm} disabled={conflictCount > 0}>
              <Icon icon="mdi:content-paste" class="w-4 h-4 mr-1" />
              继续粘贴
            </Button>
          </div>
        </div>
      {:else if isComplete}
        <div class="flex items-center justify-between w-full">
          <span class="text-sm text-green-600 font-medium flex items-center gap-1">
            <Icon icon="mdi:check-circle" class="w-4 h-4" />
            粘贴完成
            {#if skippedCount > 0}
              <span class="text-muted-foreground font-normal">（{skippedCount} 个已跳过）</span>
            {/if}
            {#if errorCount > 0}
              <span class="text-red-500 font-normal">（{errorCount} 个失败）</span>
            {/if}
          </span>
          <Button onclick={onCancel}>完成</Button>
        </div>
      {:else}
        <div class="flex items-center justify-between w-full">
          <span class="text-sm text-muted-foreground">正在粘贴...</span>
          <Button variant="outline" disabled>取消</Button>
        </div>
      {/if}
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
