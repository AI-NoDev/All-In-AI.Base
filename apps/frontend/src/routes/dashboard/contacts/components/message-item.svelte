<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as ContextMenu from '@/lib/components/ui/context-menu';
  import { Avatar, AvatarFallback, AvatarImage } from '@/lib/components/ui/avatar';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { imStore } from '@/lib/stores/im.svelte';
  import { FileIcon } from '@qiyu-allinai/file-icons';

  interface MessageContent {
    text?: string;
    fileId?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    downloadUrl?: string;
    [key: string]: unknown;
  }

  interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    msgType: string;
    msgSeq: number;
    content: MessageContent;
    replyToId: string | null;
    atUserIds: string[];
    isRecalled: boolean;
    createdAt: string;
  }

  interface Props {
    message: Message;
  }

  let { message }: Props = $props();

  function getUserName(userId: string): string {
    const user = imStore.users.get(userId);
    return user?.name || user?.loginName || '未知用户';
  }

  function getInitials(name: string | null): string {
    if (!name) return '?';
    return name.slice(0, 2);
  }

  function isCurrentUser(userId: string): boolean {
    return userId === authStore.user?.id;
  }

  function canRecallMessage(msg: Message): boolean {
    if (msg.isRecalled) return false;
    if (msg.senderId !== authStore.user?.id) return false;
    const createdAt = new Date(msg.createdAt).getTime();
    const now = Date.now();
    return now - createdAt < 2 * 60 * 1000;
  }

  function isFileMessage(msgType: string): boolean {
    return msgType === '03' || msgType === '04' || msgType === '06';
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function copyMessageText(content: MessageContent, msgType: string) {
    let text = '';
    if (msgType === '01') {
      text = content.text || '';
    } else if (msgType === '06') {
      text = content.fileName || '';
    }
    if (text) {
      navigator.clipboard.writeText(text);
    }
  }

  function downloadFile(content: MessageContent) {
    if (content.downloadUrl) {
      const link = document.createElement('a');
      link.href = content.downloadUrl;
      link.download = content.fileName || 'file';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  async function handleRecallMessage(messageId: string) {
    try {
      await imStore.recallMessage(messageId);
    } catch (e) {
      console.error('Failed to recall message:', e);
    }
  }
</script>

<div class="flex {isCurrentUser(message.senderId) ? 'justify-end' : 'justify-start'}">
  <div class="flex gap-2 max-w-[70%] {isCurrentUser(message.senderId) ? 'flex-row-reverse' : ''}">
    <Avatar class="size-8 shrink-0">
      <AvatarImage src={imStore.users.get(message.senderId)?.avatar || ''} />
      <AvatarFallback class="text-xs">
        {getInitials(getUserName(message.senderId))}
      </AvatarFallback>
    </Avatar>
    <div class="{isCurrentUser(message.senderId) ? 'items-end' : 'items-start'} flex flex-col gap-1">
      {#if !isCurrentUser(message.senderId)}
        <span class="text-xs text-muted-foreground">{getUserName(message.senderId)}</span>
      {/if}
      <ContextMenu.Root>
        <ContextMenu.Trigger>
          <div class="rounded-lg cursor-pointer {message.msgType === '03' || message.msgType === '04' ? '' : 'px-3 py-2'} {message.msgType === '03' || message.msgType === '04' ? '' : isCurrentUser(message.senderId) ? 'bg-primary text-primary-foreground' : 'bg-muted'}">
            {#if message.isRecalled}
              <span class="text-muted-foreground italic text-sm">消息已撤回</span>
            {:else if message.msgType === '01'}
              <span class="whitespace-pre-wrap break-words">{message.content.text || ''}</span>
            {:else if message.msgType === '06'}
              {@const fileExt = (message.content.fileName || '').split('.').pop() || ''}
              <div class="flex items-center gap-2 min-w-48">
                <FileIcon type={fileExt} size={32} />
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate text-sm">{message.content.fileName}</div>
                  <div class="text-xs opacity-70">{formatFileSize(message.content.fileSize ?? 0)}</div>
                </div>
              </div>
            {:else if message.msgType === '03'}
              <div class="w-48 min-w-48 max-h-64 overflow-hidden rounded">
                <img 
                  src={message.content.downloadUrl} 
                  alt={message.content.fileName || '图片'} 
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            {:else if message.msgType === '04'}
              <div class="w-48 min-w-48 max-h-64 overflow-hidden rounded">
                <video 
                  src={message.content.downloadUrl}
                  class="w-full h-full object-cover"
                  controls
                  preload="metadata"
                >
                  <track kind="captions" />
                </video>
              </div>
            {:else if message.msgType === '05'}
              <span class="text-sm">[语音]</span>
            {:else if message.msgType === '07'}
              <span class="text-sm text-muted-foreground">{message.content.text || '[系统消息]'}</span>
            {:else}
              <span class="text-sm">[未知消息类型]</span>
            {/if}
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          {#if canRecallMessage(message)}
            <ContextMenu.Item onclick={() => handleRecallMessage(message.id)}>
              <Icon icon="mdi:undo" class="mr-2 size-4" />
              撤回
            </ContextMenu.Item>
          {/if}
          {#if !message.isRecalled}
            <ContextMenu.Item onclick={() => copyMessageText(message.content, message.msgType)}>
              <Icon icon="mdi:content-copy" class="mr-2 size-4" />
              复制
            </ContextMenu.Item>
            {#if isFileMessage(message.msgType) && message.content.downloadUrl}
              <ContextMenu.Item onclick={() => downloadFile(message.content)}>
                <Icon icon="mdi:download" class="mr-2 size-4" />
                下载
              </ContextMenu.Item>
            {/if}
          {/if}
        </ContextMenu.Content>
      </ContextMenu.Root>
      <span class="text-xs text-muted-foreground">
        {new Date(message.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  </div>
</div>
