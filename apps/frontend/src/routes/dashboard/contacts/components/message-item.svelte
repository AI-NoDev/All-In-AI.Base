<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as ContextMenu from '$lib/components/ui/context-menu';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { imStore } from '@/lib/stores/im.svelte';
  import { FileIcon } from '@qiyu-allinai/file-icons';
  import { onMount } from 'svelte';

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
  // 媒体文件（图片03、视频04、语音05）需要立即获取新的 URL 用于显示
  // 消息中的 downloadUrl 可能已过期，所以媒体类型始终重新获取
  let mediaUrl = $state('');
  let isLoadingUrl = $state(false);

  // 判断是否是需要立即显示的媒体类型（图片、视频、语音）
  function isMediaMessage(msgType: string): boolean {
    return msgType === '03' || msgType === '04' || msgType === '05';
  }

  // 图片/视频/语音立即获取 URL，文件类型不需要
  onMount(async () => {
    // 媒体类型始终获取新的 URL（消息中的 downloadUrl 可能已过期）
    if (message.content.fileId && isMediaMessage(message.msgType)) {
      await refreshMediaUrl();
    }
  });

  async function refreshMediaUrl() {
    if (!message.content.fileId || isLoadingUrl) return;
    isLoadingUrl = true;
    try {
      const api = authStore.createApi(true);
      const res = await api.im.getApiImTempFileByIdDownloadUrl({ id: message.content.fileId });
      if (res.data?.url) {
        mediaUrl = res.data.url;
      }
    } catch (e) {
      console.warn('Failed to get media url:', e);
    } finally {
      isLoadingUrl = false;
    }
  }

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
    return msgType === '06';
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

  async function downloadFile(content: MessageContent) {
    // 文件类型需要实时获取下载链接（带 download=true 参数强制下载）
    let url = '';
    if (content.fileId) {
      try {
        const api = authStore.createApi(true);
        // 使用 fetch 直接调用，因为生成的 API 可能不支持 query 参数
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030';
        const res = await fetch(`${API_BASE}/api/im/temp-file/${content.fileId}/download-url?download=true`, {
          headers: { 'Authorization': `Bearer ${authStore.accessToken}` }
        });
        const data = await res.json();
        if (data?.data?.url) {
          url = data.data.url;
        }
      } catch (e) {
        console.error('Failed to get download url:', e);
      }
    }
    
    if (url) {
      window.open(url, '_blank');
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
              <div class="flex items-center gap-2 w-72">
                <FileIcon type={fileExt} size={32} />
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-sm line-clamp-2 break-all">{message.content.fileName}</div>
                  <div class="text-xs opacity-70">{formatFileSize(message.content.fileSize ?? 0)}</div>
                </div>
              </div>
            {:else if message.msgType === '03'}
              <div class="w-96 max-h-80 overflow-hidden rounded">
                {#if isLoadingUrl}
                  <div class="w-full h-32 flex items-center justify-center bg-muted">
                    <Icon icon="mdi:loading" class="size-8 text-muted-foreground animate-spin" />
                  </div>
                {:else if mediaUrl}
                  <img 
                    src={mediaUrl} 
                    alt={message.content.fileName || '图片'} 
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                {:else}
                  <div class="w-full h-32 flex items-center justify-center bg-muted">
                    <Icon icon="mdi:image-broken" class="size-8 text-muted-foreground" />
                  </div>
                {/if}
              </div>
            {:else if message.msgType === '04'}
              <div class="w-96 max-h-80 overflow-hidden rounded">
                {#if isLoadingUrl}
                  <div class="w-full h-32 flex items-center justify-center bg-muted">
                    <Icon icon="mdi:loading" class="size-8 text-muted-foreground animate-spin" />
                  </div>
                {:else if mediaUrl}
                  <video 
                    src={mediaUrl}
                    class="w-full h-full object-cover"
                    controls
                    preload="metadata"
                  >
                    <track kind="captions" />
                  </video>
                {:else}
                  <div class="w-full h-32 flex items-center justify-center bg-muted">
                    <Icon icon="mdi:video-off" class="size-8 text-muted-foreground" />
                  </div>
                {/if}
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
            {#if (isFileMessage(message.msgType) || isMediaMessage(message.msgType)) && message.content.fileId}
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
