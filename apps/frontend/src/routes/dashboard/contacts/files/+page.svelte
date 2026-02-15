<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { FileIcon } from '@qiyu-allinai/file-icons';
  import * as Table from '$lib/components/ui/table';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import * as Empty from '$lib/components/ui/empty';
  import { authStore } from '$lib/stores/auth.svelte';

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

  let loading = $state(true);
  let files = $state<ConversationFile[]>([]);
  let conversations = $state<ConversationOption[]>([]);
  let selectedConversationId = $state<string | null>(null);
  let filterType = $state<'all' | 'image' | 'video' | 'audio' | 'file'>('all');

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

  async function loadConversationFiles() {
    loading = true;
    try {
      // 使用 execute API 调用 action
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
      console.error('加载会话文件失败:', err);
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
      console.error('下载失败:', err);
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
      '03': '图片',
      '04': '视频',
      '05': '音频',
      '06': '文件',
    };
    return labels[msgType] || '未知';
  }

  function getFileExtension(fileName: string): string {
    return fileName.split('.').pop() || 'unknown';
  }

  onMount(() => {
    loadConversationFiles();
  });
</script>

<div class="flex-1 flex flex-col min-h-0 p-4">
  <!-- 筛选栏 -->
  <div class="flex items-center gap-4 mb-4">
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">会话:</span>
      <Select.Root 
        type="single"
        value={selectedConversationId ? { value: selectedConversationId, label: conversations.find(c => c.id === selectedConversationId)?.name || '' } : undefined}
        onValueChange={(v) => selectedConversationId = v?.value || null}
      >
        <Select.Trigger class="w-48">
          {#snippet child({ open })}
            <Select.Value placeholder="全部会话" />
          {/snippet}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value={null} label="全部会话">全部会话</Select.Item>
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
      <span class="text-sm text-muted-foreground">类型:</span>
      <Select.Root 
        type="single"
        value={{ value: filterType, label: '' }}
        onValueChange={(v) => filterType = (v?.value || 'all') as typeof filterType}
      >
        <Select.Trigger class="w-32">
          {#snippet child({ open })}
            <Select.Value placeholder="全部类型" />
          {/snippet}
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="all" label="全部类型">全部类型</Select.Item>
          <Select.Item value="image" label="图片">图片</Select.Item>
          <Select.Item value="video" label="视频">视频</Select.Item>
          <Select.Item value="audio" label="音频">音频</Select.Item>
          <Select.Item value="file" label="文件">文件</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>

    <Button variant="outline" size="sm" onclick={loadConversationFiles}>
      <Icon icon="tdesign:refresh" class="size-4 mr-1" />
      刷新
    </Button>
  </div>

  <!-- 文件列表 -->
  {#if loading}
    <div class="space-y-3">
      {#each [1, 2, 3, 4, 5] as _}
        <Skeleton class="h-12 w-full" />
      {/each}
    </div>
  {:else if filteredFiles.length === 0}
    <div class="flex-1 flex items-center justify-center">
      <Empty.Root>
        <Empty.Media>
          <Icon icon="tdesign:file" class="size-16 text-muted-foreground/50" />
        </Empty.Media>
        <Empty.Header>
          <Empty.Title>暂无会话文件</Empty.Title>
          <Empty.Description>
            聊天中发送的图片、视频、音频和文件会显示在这里
          </Empty.Description>
        </Empty.Header>
      </Empty.Root>
    </div>
  {:else}
    <div class="flex-1 min-h-0 overflow-auto border rounded-lg">
      <Table.Root>
        <Table.Header class="bg-muted/50 sticky top-0">
          <Table.Row>
            <Table.Head class="text-left">文件名</Table.Head>
            <Table.Head class="w-20 text-left">类型</Table.Head>
            <Table.Head class="w-24 text-left">大小</Table.Head>
            <Table.Head class="w-40 text-left">会话</Table.Head>
            <Table.Head class="w-32 text-left">发送者</Table.Head>
            <Table.Head class="w-40 text-left">时间</Table.Head>
            <Table.Head class="w-20 text-center">操作</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each filteredFiles as file}
            <Table.Row class="hover:bg-muted/50">
              <Table.Cell class="font-medium text-left">
                <span class="flex items-center gap-2">
                  <FileIcon type={getFileExtension(file.fileName)} size={20} />
                  <span class="truncate max-w-[300px]" title={file.fileName}>{file.fileName}</span>
                </span>
              </Table.Cell>
              <Table.Cell class="text-muted-foreground text-left">{getFileTypeLabel(file.msgType)}</Table.Cell>
              <Table.Cell class="text-muted-foreground text-left">{formatSize(file.fileSize)}</Table.Cell>
              <Table.Cell class="text-left">
                <span class="flex items-center gap-1">
                  <Icon icon={file.conversationType === 'group' ? 'tdesign:usergroup' : 'tdesign:user'} class="size-4 text-muted-foreground" />
                  <span class="truncate max-w-[100px]" title={file.conversationName}>{file.conversationName}</span>
                </span>
              </Table.Cell>
              <Table.Cell class="text-muted-foreground text-left truncate max-w-[100px]" title={file.senderName}>{file.senderName}</Table.Cell>
              <Table.Cell class="text-muted-foreground text-left">{new Date(file.createdAt).toLocaleString('zh-CN')}</Table.Cell>
              <Table.Cell class="text-center">
                <Button variant="ghost" size="icon" class="size-8" onclick={() => handleDownload(file)}>
                  <Icon icon="tdesign:download" class="size-4" />
                </Button>
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>
  {/if}
</div>
