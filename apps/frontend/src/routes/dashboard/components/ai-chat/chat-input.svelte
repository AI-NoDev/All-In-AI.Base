<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Textarea } from '$lib/components/ui/textarea';
  import * as Alert from '$lib/components/ui/alert';
  import { aiChatStore } from '@/lib/stores/ai-chat.svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '$lib/stores/i18n.svelte';
  import ModelAgentSelector from './model-agent-selector.svelte';

  // 附件类型
  interface Attachment {
    id: string;
    file: File;
    type: 'image' | 'audio' | 'video';
    previewUrl: string;
    uploading: boolean;
    uploadedUrl?: string;
    error?: string;
  }

  // 消息部分类型
  interface MessagePart {
    type: 'text' | 'file';
    text?: string;
    mediaType?: string;
    url?: string;
  }

  interface Props {
    onSend: (content: string, attachments?: MessagePart[]) => Promise<void>;
    onAbort: () => Promise<void>;
  }

  let { onSend, onAbort }: Props = $props();

  let messageInput = $state('');
  let attachments = $state<Attachment[]>([]);
  let fileInputRef = $state<HTMLInputElement | null>(null);

  // 获取当前模型支持的媒体类型
  const acceptedTypes = $derived(() => {
    const model = aiChatStore.selectedModel;
    if (!model) return '';
    
    const types: string[] = [];
    if (model.supportImageInput) types.push('image/*');
    if (model.supportAudioInput) types.push('audio/*');
    if (model.supportVideoInput) types.push('video/*');
    return types.join(',');
  });

  // 是否支持任何媒体输入
  const supportsMedia = $derived(() => {
    const model = aiChatStore.selectedModel;
    if (!model) return false;
    return model.supportImageInput || model.supportAudioInput || model.supportVideoInput;
  });

  // 是否有正在上传的附件
  const hasUploadingAttachments = $derived(attachments.some(a => a.uploading));

  // 是否所有附件都已上传成功
  const allAttachmentsUploaded = $derived(attachments.every(a => !a.uploading && a.uploadedUrl && !a.error));

  function handleAttachmentClick() {
    fileInputRef?.click();
  }

  // 上传单个文件到 MinIO
  async function uploadFileToStorage(attachment: Attachment): Promise<string> {
    const api = authStore.createApi(true);
    
    // 读取文件为 base64
    const base64Content = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // 移除 data:xxx;base64, 前缀
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(attachment.file);
    });
    
    // 调用上传 API
    const res = await api.files.postApiFilesAiChatUpload({
      filename: attachment.file.name,
      content: base64Content,
      mimeType: attachment.file.type,
    });
    
    if (res.data?.url) {
      return res.data.url;
    }
    
    throw new Error(t('page.ai.chat_uploadFailed'));
  }

  async function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    const model = aiChatStore.selectedModel;
    if (!model) return;

    for (const file of Array.from(files)) {
      // 检查文件类型是否支持
      let type: 'image' | 'audio' | 'video' | null = null;
      if (file.type.startsWith('image/') && model.supportImageInput) {
        type = 'image';
      } else if (file.type.startsWith('audio/') && model.supportAudioInput) {
        type = 'audio';
      } else if (file.type.startsWith('video/') && model.supportVideoInput) {
        type = 'video';
      }

      if (!type) continue;

      // 创建预览 URL
      const previewUrl = URL.createObjectURL(file);
      const attachmentId = crypto.randomUUID();
      
      // 添加附件（标记为上传中）
      const newAttachment: Attachment = {
        id: attachmentId,
        file,
        type,
        previewUrl,
        uploading: true,
      };
      
      attachments = [...attachments, newAttachment];
      
      // 异步上传文件
      uploadFileToStorage(newAttachment)
        .then(url => {
          attachments = attachments.map(a => 
            a.id === attachmentId 
              ? { ...a, uploading: false, uploadedUrl: url }
              : a
          );
        })
        .catch(err => {
          console.error('Upload failed:', err);
          attachments = attachments.map(a => 
            a.id === attachmentId 
              ? { ...a, uploading: false, error: t('page.ai.chat_uploadFailed') }
              : a
          );
        });
    }

    // 清空 input 以便重复选择同一文件
    input.value = '';
  }

  function removeAttachment(id: string) {
    const attachment = attachments.find(a => a.id === id);
    if (attachment) {
      URL.revokeObjectURL(attachment.previewUrl);
    }
    attachments = attachments.filter(a => a.id !== id);
  }

  async function handleSendMessage() {
    if ((!messageInput.trim() && attachments.length === 0) || aiChatStore.isSending) return;
    if (!aiChatStore.selectedModelId && !aiChatStore.selectedAgentId) {
      alert(t('page.ai.chat_selectModelOrAgent'));
      return;
    }
    
    // 检查是否有正在上传的附件
    if (hasUploadingAttachments) {
      alert(t('page.ai.chat_waitUpload'));
      return;
    }
    
    // 检查是否有上传失败的附件
    const failedAttachments = attachments.filter(a => a.error);
    if (failedAttachments.length > 0) {
      alert(t('page.ai.chat_uploadFailedRetry'));
      return;
    }

    const content = messageInput.trim();
    
    // 构建消息部分
    const parts: MessagePart[] = [];
    
    // 添加已上传的附件（使用 MinIO URL）
    for (const attachment of attachments) {
      if (attachment.uploadedUrl) {
        parts.push({
          type: 'file',
          mediaType: attachment.file.type,
          url: attachment.uploadedUrl,
        });
      }
      // 清理预览 URL
      URL.revokeObjectURL(attachment.previewUrl);
    }
    
    // 添加文本
    if (content) {
      parts.push({ type: 'text', text: content });
    }

    messageInput = '';
    attachments = [];
    
    await onSend(content, parts.length > 0 ? parts : undefined);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  function handleUseAgentModel() {
    aiChatStore.useAgentDefaultModel();
  }
</script>

<div class="border-t p-3 space-y-3 shrink-0">
  <!-- 模型不匹配提示 -->
  {#if aiChatStore.isAgentModelMismatch}
    <Alert.Root variant="default" class="py-2">
      <Icon icon="mdi:alert-circle-outline" class="size-4" />
      <Alert.Description class="flex items-center justify-between">
        <span class="text-xs">{t('page.ai.chat_agentModelMismatch')}</span>
        <Button variant="link" size="sm" class="h-auto p-0 text-xs" onclick={handleUseAgentModel}>
          {t('page.ai.chat_useAgentModel')}
        </Button>
      </Alert.Description>
    </Alert.Root>
  {/if}

  <!-- 模型/智能体选择器 -->
  <ModelAgentSelector />

  <!-- 附件预览 -->
  {#if attachments.length > 0}
    <div class="flex flex-wrap gap-2">
      {#each attachments as attachment (attachment.id)}
        <div class="relative group">
          {#if attachment.type === 'image'}
            <img 
              src={attachment.previewUrl} 
              alt={t('page.ai.chat_attachmentPreview')} 
              class="h-16 w-16 object-cover rounded border {attachment.uploading ? 'opacity-50' : ''}"
            />
          {:else if attachment.type === 'audio'}
            <div class="h-16 w-16 flex items-center justify-center rounded border bg-muted {attachment.uploading ? 'opacity-50' : ''}">
              <Icon icon="mdi:music" class="size-6 text-muted-foreground" />
            </div>
          {:else if attachment.type === 'video'}
            <div class="h-16 w-16 flex items-center justify-center rounded border bg-muted {attachment.uploading ? 'opacity-50' : ''}">
              <Icon icon="mdi:video" class="size-6 text-muted-foreground" />
            </div>
          {/if}
          
          <!-- 上传中指示器 -->
          {#if attachment.uploading}
            <div class="absolute inset-0 flex items-center justify-center">
              <Icon icon="mdi:loading" class="size-5 animate-spin text-primary" />
            </div>
          {/if}
          
          <!-- 上传失败指示器 -->
          {#if attachment.error}
            <div class="absolute inset-0 flex items-center justify-center bg-destructive/20 rounded">
              <Icon icon="mdi:alert-circle" class="size-5 text-destructive" />
            </div>
          {/if}
          
          <!-- 上传成功指示器 -->
          {#if attachment.uploadedUrl && !attachment.uploading}
            <div class="absolute bottom-0 right-0 size-4 bg-green-500 rounded-full flex items-center justify-center">
              <Icon icon="mdi:check" class="size-3 text-white" />
            </div>
          {/if}
          
          <button
            type="button"
            class="absolute -top-1 -right-1 size-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            onclick={() => removeAttachment(attachment.id)}
            aria-label={t('page.ai.chat_removeAttachment')}
          >
            <Icon icon="mdi:close" class="size-3" />
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <!-- 输入框 -->
  <div class="flex items-end gap-2">
    <!-- 附件按钮 -->
    {#if supportsMedia()}
      <input
        bind:this={fileInputRef}
        type="file"
        accept={acceptedTypes()}
        multiple
        class="hidden"
        onchange={handleFileSelect}
      />
      <Button
        size="sm"
        variant="ghost"
        onclick={handleAttachmentClick}
        disabled={aiChatStore.isSending}
        title={t('common.actions.upload')}
      >
        <Icon icon="mdi:plus" class="size-4" />
      </Button>
    {/if}
    
    <Textarea 
      placeholder={t('page.ai.chatInputPlaceholder')} 
      class="flex-1 min-h-[40px] max-h-32 resize-none text-sm" 
      bind:value={messageInput}
      onkeydown={handleKeyDown}
      disabled={aiChatStore.isSending}
      rows={1}
    />
    {#if aiChatStore.isSending}
      <Button 
        size="sm" 
        variant="destructive"
        onclick={onAbort}
        title={t('common.actions.stop')}
      >
        <Icon icon="mdi:stop" class="size-4" />
      </Button>
    {:else}
      <Button 
        size="sm" 
        onclick={handleSendMessage} 
        disabled={(!messageInput.trim() && attachments.length === 0) || hasUploadingAttachments || attachments.some(a => a.error)}
        title={hasUploadingAttachments ? t('page.ai.chat_waitUploadTitle') : attachments.some(a => a.error) ? t('page.ai.chat_removeFailedTitle') : t('page.ai.chat_sendMessage')}
      >
        <Icon icon="tdesign:send" class="size-4" />
      </Button>
    {/if}
  </div>
</div>
