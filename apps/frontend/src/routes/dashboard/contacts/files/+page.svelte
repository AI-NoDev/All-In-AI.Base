<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface ConversationFile {
    messageId: string;
    conversationId: string;
    conversationName: string;
    conversationType: 'private' | 'group';
    fileId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    msgType: string;
    senderId: string;
    senderName: string;
    createdAt: string;
  }

  interface ConversationOption {
    id: string;
    name: string;
    type: 'private' | 'group';
  }

  interface PageSnapshot {
    files: ConversationFile[];
    conversations: ConversationOption[];
    selectedConversationId: string | null;
    filterType: 'all' | 'image' | 'video' | 'audio' | 'file';
    dataLoaded: boolean;
  }

  let pageState: PageSnapshot = {
    files: [],
    conversations: [],
    selectedConversationId: null,
    filterType: 'all',
    dataLoaded: false,
  };

  let restoreCallback: ((value: PageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<PageSnapshot> = {
    capture: () => pageState,
    restore: (value) => {
      pageState = value;
      if (restoreCallback) restoreCallback(value);
    }
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { FileIcon } from '@qiyu-allinai/file-icons';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import * as Empty from '$lib/components/ui/empty';
  import { DataTable } from '$lib/components/common';
  import { authStore } from '$lib/stores/auth.svelte';
  import { t } from '$lib/stores/i18n.svelte';

  let loading = $state(!pageState.dataLoaded);
  let files = $state<ConversationFile[]>(pageState.files);
  let conversations = $state<ConversationOption[]>(pageState.conversations);
  let selectedConversationId = $state<string | null>(pageState.selectedConversationId);
  let filterType = $state<typeof pageState.filterType>(pageState.filterType);
  let snapshotRestored = $state(pageState.dataLoaded);

  // Register restore callback
  restoreCallback = (value) => {
    files = value.files;
    conversations = value.conversations;
    selectedConversationId = value.selectedConversationId;
    filterType = value.filterType;
    snapshotRestored = value.dataLoaded;
    loading = !value.dataLoaded;
  };

  // Sync state changes back to module-level state for snapshot
  $effect(() => {
    pageState = {
      files,
      conversations,
      selectedConversationId,
      filterType,
      dataLoaded: !loading,
    };
  });

  const api = authStore.createApi(true);

  function getFilteredFiles(): ConversationFile[] {
    let result = files;
    if (selectedConversationId) {
      result = result.filter(f => f.conversationId === selectedConversationId);
    }
    if (filterType !== 'all') {
      const typeMap: Record<string, string> = {
        image: '03',
        video: '04',
        audio: '05',
        file: '06',
      };
      result = result.filter(f => f.msgType === typeMap[filterType]);
    }
    return result;
  }

  let filteredFiles = $derived(getFilteredFiles());

  let columns = $derived([
    { key: 'fileName', title: t('page.im.fileName'), width: 250, minWidth: 200, render: fileNameRender },
    { key: 'msgType', title: t('page.im.fileType'), width: 80, render: typeRender },
    { key: 'fileSize', title: t('page.im.fileSize'), width: 96, render: sizeRender },
    { key: 'conversationName', title: t('page.im.conversation'), width: 160, render: conversationRender },
    { key: 'senderName', title: t('page.im.sender'), width: 128, render: senderRender },
    { key: 'createdAt', title: t('page.im.time'), width: 170, render: timeRender },
    { key: 'fileId', title: t('common.fields_actions'), width: 80, align: 'center' as const, fixed: 'right' as const, render: actionsRender },
  ]);

  async function loadConversationFiles() {
    loading = true;
    try {
      const res = await fetch('/api/im/conversation-files', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authStore.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.data) {
        files = data.data.files || [];
        conversations = data.data.conversations || [];
      }
    } catch (err) {
      console.error('loadConversationFiles error:', err);
    } finally {
      loading = false;
    }
  }

  async function handleDownload(file: ConversationFile) {
    try {
      const res = await api.im.getApiImTempFileByIdDownloadUrl({ id: file.fileId });
      if (res.data?.url) {
        const link = document.createElement('a');
        link.href = res.data.url;
        link.download = file.fileName;
        link.click();
      }
    } catch (err) {
      console.error('download error:', err);
    }
  }

  function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function getFileTypeLabel(msgType: string): string {
    const labels: Record<string, string> = {
      '03': t('page.im.image'),
      '04': t('page.im.video'),
      '05': t('page.im.audio'),
      '06': t('page.im.file'),
    };
    return labels[msgType] || t('page.im.unknown');
  }

  function getFileExtension(fileName: string): string {
    return fileName.split('.').pop() || 'unknown';
  }

  onMount(() => {
    if (!snapshotRestored) {
      loadConversationFiles();
    }
  });
</script>

{#snippet fileNameRender({ row })}
  <span class="flex items-center gap-2">
    <FileIcon type={getFileExtension(row.fileName)} size={20} />
    <span class="truncate max-w-[300px]" title={row.fileName}>{row.fileName}</span>
  </span>
{/snippet}

{#snippet typeRender({ row })}
  <span class="text-muted-foreground">{getFileTypeLabel(row.msgType)}</span>
{/snippet}

{#snippet sizeRender({ row })}
  <span class="text-muted-foreground">{formatSize(row.fileSize)}</span>
{/snippet}

{#snippet conversationRender({ row })}
  <span class="flex items-center gap-1">
    <Icon icon={row.conversationType === 'group' ? 'tdesign:usergroup' : 'tdesign:user'} class="size-4 text-muted-foreground" />
    <span class="truncate max-w-[100px]" title={row.conversationName}>{row.conversationName}</span>
  </span>
{/snippet}

{#snippet senderRender({ row })}
  <span class="text-muted-foreground truncate max-w-[100px]" title={row.senderName}>{row.senderName}</span>
{/snippet}

{#snippet timeRender({ row })}
  <span class="text-muted-foreground">{new Date(row.createdAt).toLocaleString('zh-CN')}</span>
{/snippet}

{#snippet actionsRender({ row })}
  <Button variant="ghost" size="icon" class="size-8" onclick={() => handleDownload(row)}>
    <Icon icon="tdesign:download" class="size-4" />
  </Button>
{/snippet}

<div class="flex-1 flex flex-col min-h-0 p-4">
  <!-- 筛选栏 -->
  <div class="flex items-center gap-4 mb-4">
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">{t('page.im.conversation')}:</span>
      <Select.Root 
        type="single"
        value={selectedConversationId ? { value: selectedConversationId, label: conversations.find(c => c.id === selectedConversationId)?.name || '' } : undefined}
        onValueChange={(v) => selectedConversationId = v?.value || null}
      >
        <Select.Trigger class="w-48">
          {#snippet child({ open })}
            <Select.Value placeholder={t('page.im.allConversations')} />
          {/snippet}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value={null} label={t('page.im.allConversations')}>{t('page.im.allConversations')}</Select.Item>
          {#each conversations as conv}
            <Select.Item value={conv.id} label={conv.name}>
              <Icon icon={conv.type === 'group' ? 'tdesign:usergroup' : 'tdesign:user'} class="size-4 mr-2" />
              {conv.name}
            </Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
    </div>

    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">{t('page.im.fileType')}:</span>
      <Select.Root 
        type="single"
        value={{ value: filterType, label: '' }}
        onValueChange={(v) => filterType = (v?.value || 'all') as typeof filterType}
      >
        <Select.Trigger class="w-32">
          {#snippet child({ open })}
            <Select.Value placeholder={t('page.im.allTypes')} />
          {/snippet}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="all" label={t('page.im.allTypes')}>{t('page.im.allTypes')}</Select.Item>
          <Select.Item value="image" label={t('page.im.image')}>{t('page.im.image')}</Select.Item>
          <Select.Item value="video" label={t('page.im.video')}>{t('page.im.video')}</Select.Item>
          <Select.Item value="audio" label={t('page.im.audio')}>{t('page.im.audio')}</Select.Item>
          <Select.Item value="file" label={t('page.im.file')}>{t('page.im.file')}</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>

    <Button variant="outline" size="sm" onclick={loadConversationFiles}>
      <Icon icon="tdesign:refresh" class="size-4 mr-1" />
      {t('common.actions_refresh')}
    </Button>
  </div>

  <!-- 文件列表 -->
  {#if filteredFiles.length === 0 && !loading}
    <div class="flex-1 flex items-center justify-center">
      <Empty.Root>
        <Empty.Media>
          <Icon icon="tdesign:file" class="size-16 text-muted-foreground/50" />
        </Empty.Media>
        <Empty.Header>
          <Empty.Title>{t('page.im.noConversationFiles')}</Empty.Title>
          <Empty.Description>
            {t('page.im.conversationFilesHint')}
          </Empty.Description>
        </Empty.Header>
      </Empty.Root>
    </div>
  {:else}
    <div class="flex-1 min-h-0 overflow-hidden border rounded-lg">
      <DataTable 
        {columns} 
        data={filteredFiles} 
        {loading}
        rowKey="messageId"
      />
    </div>
  {/if}
</div>
