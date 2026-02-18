<script lang="ts">
  import Icon from '@iconify/svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import * as Collapsible from '$lib/components/ui/collapsible';
  import * as ContextMenu from '$lib/components/ui/context-menu';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Button } from '$lib/components/ui/button';
  import { MarkdownRenderer, AudioPlayer } from '$lib/components/common';
  import { aiChatStore, type AIAgent, type AIModel } from '@/lib/stores/ai-chat.svelte';
  import { toast } from 'svelte-sonner';
  import type { UIMessage } from 'ai';

  interface TextPart {
    type: 'text';
    text: string;
  }

  interface ReasoningPart {
    type: 'reasoning';
    text: string;
  }

  interface ImagePart {
    type: 'image';
    image: string;
  }

  interface FilePart {
    type: 'file';
    mimeType?: string;
    mediaType?: string;
    data?: string;
    url?: string;
  }

  type MessagePart = TextPart | ReasoningPart | ImagePart | FilePart | { type: string };

  interface TokenUsage {
    totalTokens?: number;
    inputTokens?: number;
    outputTokens?: number;
    inputTokenDetails?: {
      noCacheTokens?: number;
      cacheReadTokens?: number;
      cacheWriteTokens?: number;
    };
    outputTokenDetails?: {
      textTokens?: number;
      reasoningTokens?: number;
    };
  }

  interface ExtendedUIMessage extends UIMessage {
    tokenUsage?: TokenUsage;
    latencyMs?: number;
  }

  interface Props {
    messages: ExtendedUIMessage[];
    status: string;
    onEditMessage?: (messageId: string, newContent: string, messageIndex: number) => void;
  }

  let { messages, status, onEditMessage }: Props = $props();

  let viewportRef = $state<HTMLElement | null>(null);
  let userExpandedIds = $state<Set<string>>(new Set());
  let editingMessageId = $state<string | null>(null);
  let editContent = $state('');

  $effect(() => {
    if (messages.length && viewportRef) {
      setTimeout(() => {
        viewportRef?.scrollTo({ top: viewportRef.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  });

  function getMessageText(message: UIMessage): string {
    if (message.parts && message.parts.length > 0) {
      return (message.parts as MessagePart[])
        .filter((part): part is TextPart => part.type === 'text')
        .map(part => part.text)
        .join('');
    }
    return message.content || '';
  }

  function getReasoningText(message: UIMessage): string | null {
    if (!message.parts) return null;
    const reasoningParts = (message.parts as MessagePart[]).filter((part): part is ReasoningPart => part.type === 'reasoning');
    if (reasoningParts.length === 0) return null;
    return reasoningParts.map(part => part.text).join('');
  }

  function getImageParts(message: UIMessage): ImagePart[] {
    if (!message.parts) return [];
    return (message.parts as MessagePart[]).filter((part): part is ImagePart => part.type === 'image');
  }

  function getFileParts(message: UIMessage): FilePart[] {
    if (!message.parts) return [];
    return (message.parts as MessagePart[]).filter((part): part is FilePart => part.type === 'file');
  }

  function isAudioFile(part: FilePart): boolean {
    const mimeType = part.mimeType || part.mediaType || '';
    return mimeType.startsWith('audio/');
  }

  function isVideoFile(part: FilePart): boolean {
    const mimeType = part.mimeType || part.mediaType || '';
    return mimeType.startsWith('video/');
  }

  function isImageFile(part: FilePart): boolean {
    const mimeType = part.mimeType || part.mediaType || '';
    return mimeType.startsWith('image/');
  }

  function getFileUrl(part: FilePart): string {
    return part.url || part.data || '';
  }

  function getFileMimeType(part: FilePart): string {
    return part.mimeType || part.mediaType || 'application/octet-stream';
  }

  function getFileExtension(mimeType: string): string {
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav',
      'audio/ogg': 'ogg',
      'video/mp4': 'mp4',
      'video/webm': 'webm',
      'video/ogg': 'ogv',
    };
    return mimeToExt[mimeType] || mimeType.split('/')[1] || 'bin';
  }

  function getFileTypeLabel(part: FilePart): string {
    if (isImageFile(part)) return '图片';
    if (isAudioFile(part)) return '音频';
    if (isVideoFile(part)) return '视频';
    return '文件';
  }

  async function downloadFile(part: FilePart) {
    try {
      const url = getFileUrl(part);
      const mimeType = getFileMimeType(part);
      const ext = getFileExtension(mimeType);
      const filename = `attachment_${Date.now()}.${ext}`;

      // 如果是 data URL，直接下载
      if (url.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // 如果是普通 URL，fetch 后下载
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      }
      toast.success('下载成功');
    } catch (e) {
      console.error('Download failed:', e);
      toast.error('下载失败');
    }
  }

  function openInNewTab(part: FilePart) {
    const url = getFileUrl(part);
    window.open(url, '_blank');
  }

  function formatTime(createdAt: Date | undefined): string {
    if (!createdAt) return '';
    const date = createdAt instanceof Date ? createdAt : new Date(createdAt);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  }

  function formatLatency(ms: number | undefined): string {
    if (!ms) return '';
    return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('已复制到剪贴板');
    } catch (e) {
      console.error('Failed to copy:', e);
      toast.error('复制失败');
    }
  }

  function startEdit(message: ExtendedUIMessage) {
    editingMessageId = message.id;
    editContent = getMessageText(message);
  }

  function cancelEdit() {
    editingMessageId = null;
    editContent = '';
  }

  function saveEdit(messageIndex: number) {
    if (editingMessageId && editContent.trim() && onEditMessage) {
      onEditMessage(editingMessageId, editContent.trim(), messageIndex);
    }
    cancelEdit();
  }

  function shouldReasoningBeOpen(message: ExtendedUIMessage, index: number): boolean {
    if (userExpandedIds.has(message.id)) return true;
    const isStreaming = status === 'streaming' || status === 'submitted';
    if (!isStreaming) return false;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        return i === index;
      }
    }
    return false;
  }

  function handleReasoningToggle(messageId: string, isOpen: boolean) {
    if (isOpen) {
      userExpandedIds.add(messageId);
      userExpandedIds = new Set(userExpandedIds);
    }
  }

  let isStreaming = $derived(status === 'streaming' || status === 'submitted');
  let hasStreamingAssistantMessage = $derived(() => {
    if (!isStreaming) return false;
    if (messages.length === 0) return false;
    const lastMsg = messages[messages.length - 1];
    return lastMsg.role === 'assistant';
  });
</script>

{#snippet fileAttachment(file: FilePart, maxWidth: string = '200px')}
  <ContextMenu.Root>
    <ContextMenu.Trigger>
      {#if isImageFile(file)}
        <img 
          src={getFileUrl(file)} 
          alt="附件图片" 
          class="max-h-[200px] rounded-lg object-cover cursor-pointer hover:opacity-90"
          style="max-width: {maxWidth}"
        />
      {:else if isAudioFile(file)}
        <div class="rounded-lg border bg-muted/50 p-2" style="max-width: {maxWidth}">
          <AudioPlayer src={getFileUrl(file)} />
        </div>
      {:else if isVideoFile(file)}
        <video src={getFileUrl(file)} controls class="rounded-lg" style="max-width: {maxWidth}" preload="metadata">
          <track kind="captions" />
        </video>
      {:else}
        <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer">
          <Icon icon="mdi:file-outline" class="size-4" />
          <span class="text-sm">附件文件</span>
        </div>
      {/if}
    </ContextMenu.Trigger>
    <ContextMenu.Content class="w-48">
      <ContextMenu.Item onclick={() => openInNewTab(file)}>
        <Icon icon="mdi:open-in-new" class="mr-2 size-4" />
        在新标签页打开
      </ContextMenu.Item>
      <ContextMenu.Item onclick={() => downloadFile(file)}>
        <Icon icon="mdi:download" class="mr-2 size-4" />
        下载{getFileTypeLabel(file)}
      </ContextMenu.Item>
      <ContextMenu.Separator />
      <ContextMenu.Item onclick={() => copyToClipboard(getFileUrl(file))}>
        <Icon icon="mdi:link" class="mr-2 size-4" />
        复制链接
      </ContextMenu.Item>
    </ContextMenu.Content>
  </ContextMenu.Root>
{/snippet}

<div class="flex-1 overflow-hidden">
  <ScrollArea class="h-full" bind:viewportRef={viewportRef}>
    <div class="p-4 space-y-6 max-w-4xl mx-auto">
      {#if messages.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Icon icon="mdi:robot-outline" class="size-12 mb-4 opacity-50" />
          <p class="text-sm">开始一个新对话</p>
          <p class="text-xs mt-1">选择模型或智能体，然后输入消息</p>
        </div>
      {:else}
        {#each messages as message, index (message.id)}
          {@const textContent = getMessageText(message)}
          {@const reasoning = getReasoningText(message)}
          {@const images = getImageParts(message)}
          {@const files = getFileParts(message)}
          {@const isEditing = editingMessageId === message.id}
          
          {#if message.role === 'user'}
            <!-- 用户消息：右对齐气泡 -->
            <div class="flex justify-end">
              <div class="max-w-[80%] flex flex-col items-end gap-1">
                {#if images.length > 0}
                  <div class="flex flex-wrap gap-2 justify-end">
                    {#each images as img}
                      <img 
                        src={img.image} 
                        alt="消息图片" 
                        class="max-w-[200px] max-h-[200px] rounded-lg object-cover cursor-pointer hover:opacity-90"
                        onclick={() => window.open(img.image, '_blank')}
                      />
                    {/each}
                  </div>
                {/if}
                
                {#if files.length > 0}
                  <div class="flex flex-wrap gap-2 justify-end">
                    {#each files as file}
                      {@render fileAttachment(file, '200px')}
                    {/each}
                  </div>
                {/if}
                
                {#if isEditing}
                  <!-- 编辑模式 -->
                  <div class="w-full min-w-[300px]">
                    <textarea
                      bind:value={editContent}
                      class="w-full p-3 rounded-2xl bg-primary/10 border border-primary/20 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                      rows="3"
                    ></textarea>
                    <div class="flex justify-end gap-2 mt-2">
                      <Button variant="ghost" size="sm" onclick={cancelEdit}>
                        取消
                      </Button>
                      <Button size="sm" onclick={() => saveEdit(index)}>
                        保存并重新生成
                      </Button>
                    </div>
                  </div>
                {:else if textContent}
                  <!-- 用户消息气泡 -->
                  <div class="rounded-2xl px-4 py-2.5 bg-primary text-primary-foreground text-sm whitespace-pre-wrap break-words">
                    {textContent}
                  </div>
                  <!-- 用户消息底部操作 -->
                  <div class="flex items-center gap-2 text-xs text-muted-foreground">
                    <button 
                      class="hover:text-foreground transition-colors p-1"
                      onclick={() => copyToClipboard(textContent)}
                      title="复制"
                    >
                      <Icon icon="mdi:content-copy" class="size-3.5" />
                    </button>
                    <button 
                      class="hover:text-foreground transition-colors p-1"
                      onclick={() => startEdit(message)}
                      title="编辑"
                    >
                      <Icon icon="mdi:pencil" class="size-3.5" />
                    </button>
                  </div>
                {/if}
              </div>
            </div>
          {:else}
            <!-- AI 回复：全宽无底座 -->
            <div class="w-full">
              <!-- 思考内容（有底座） -->
              {#if reasoning}
                <Collapsible.Root 
                  class="mb-3" 
                  open={shouldReasoningBeOpen(message, index)}
                  onOpenChange={(open) => handleReasoningToggle(message.id, open)}
                >
                  <Collapsible.Trigger class="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
                    <Icon icon="mdi:lightbulb-outline" class="size-4" />
                    <span>思考过程</span>
                    <Icon icon="mdi:chevron-down" class="size-4 ml-auto" />
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <div class="mt-2 p-3 text-sm text-muted-foreground bg-muted/30 rounded-lg border border-border/50 whitespace-pre-wrap">
                      {reasoning}
                    </div>
                  </Collapsible.Content>
                </Collapsible.Root>
              {/if}
              
              <!-- 图片内容 -->
              {#if images.length > 0}
                <div class="flex flex-wrap gap-2 mb-3">
                  {#each images as img}
                    <img 
                      src={img.image} 
                      alt="消息图片" 
                      class="max-w-[300px] max-h-[300px] rounded-lg object-cover cursor-pointer hover:opacity-90"
                      onclick={() => window.open(img.image, '_blank')}
                    />
                  {/each}
                </div>
              {/if}
              
              <!-- 文件内容 -->
              {#if files.length > 0}
                <div class="flex flex-wrap gap-2 mb-3">
                  {#each files as file}
                    {@render fileAttachment(file, '300px')}
                  {/each}
                </div>
              {/if}
              
              <!-- 文本内容（无底座，直接渲染） -->
              {#if textContent}
                <div class="prose prose-sm dark:prose-invert max-w-none">
                  <MarkdownRenderer content={textContent} />
                </div>
              {/if}
              
              <!-- 底部信息栏 -->
              <div class="flex items-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
                {#if message.createdAt}
                  <span>{formatTime(message.createdAt)}</span>
                {/if}
                {#if message.latencyMs}
                  <span>耗时 {formatLatency(message.latencyMs)}</span>
                {/if}
                {#if message.tokenUsage?.totalTokens}
                  <Tooltip.Root>
                    <Tooltip.Trigger class="cursor-help hover:text-foreground transition-colors">
                      {message.tokenUsage.totalTokens} tokens
                    </Tooltip.Trigger>
                    <Tooltip.Content class="max-w-xs">
                      <div class="space-y-1 text-xs">
                        <div class="font-medium">Token 使用详情</div>
                        <div class="grid grid-cols-2 gap-x-4 gap-y-0.5">
                          {#if message.tokenUsage.inputTokens !== undefined}
                            <span class="text-muted-foreground">输入:</span>
                            <span>{message.tokenUsage.inputTokens}</span>
                          {/if}
                          {#if message.tokenUsage.outputTokens !== undefined}
                            <span class="text-muted-foreground">输出:</span>
                            <span>{message.tokenUsage.outputTokens}</span>
                          {/if}
                          {#if message.tokenUsage.inputTokenDetails?.cacheReadTokens}
                            <span class="text-muted-foreground">缓存读取:</span>
                            <span>{message.tokenUsage.inputTokenDetails.cacheReadTokens}</span>
                          {/if}
                          {#if message.tokenUsage.inputTokenDetails?.cacheWriteTokens}
                            <span class="text-muted-foreground">缓存写入:</span>
                            <span>{message.tokenUsage.inputTokenDetails.cacheWriteTokens}</span>
                          {/if}
                          {#if message.tokenUsage.outputTokenDetails?.reasoningTokens}
                            <span class="text-muted-foreground">推理:</span>
                            <span>{message.tokenUsage.outputTokenDetails.reasoningTokens}</span>
                          {/if}
                          {#if message.tokenUsage.outputTokenDetails?.textTokens}
                            <span class="text-muted-foreground">文本:</span>
                            <span>{message.tokenUsage.outputTokenDetails.textTokens}</span>
                          {/if}
                        </div>
                      </div>
                    </Tooltip.Content>
                  </Tooltip.Root>
                {/if}
                <button 
                  class="hover:text-foreground transition-colors p-1 ml-auto"
                  onclick={() => copyToClipboard(textContent)}
                  title="复制"
                >
                  <Icon icon="mdi:content-copy" class="size-3.5" />
                </button>
              </div>
            </div>
          {/if}
        {/each}
        
        <!-- 流式加载指示器 -->
        {#if isStreaming && !hasStreamingAssistantMessage()}
          <div class="w-full">
            <div class="flex items-center gap-2 text-muted-foreground">
              <Icon icon="mdi:loading" class="size-4 animate-spin" />
              <span class="text-sm">正在思考...</span>
            </div>
          </div>
        {/if}
      {/if}
    </div>
  </ScrollArea>
</div>
