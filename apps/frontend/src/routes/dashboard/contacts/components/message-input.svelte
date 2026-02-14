<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Popover from '$lib/components/ui/popover';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { Button } from '$lib/components/ui/button';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Kbd } from '$lib/components/ui/kbd';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { imStore } from '@/lib/stores/im';
  import { wsStore } from '@/lib/stores/websocket';
  import { preferencesStore } from '@/lib/stores/preferences';
	import { theme } from 'mode-watcher';

  interface PendingFile {
    file: File;
    id: string;
    isUploading: boolean;
    error?: string;
  }

  interface Props {
    showScrollToBottom: boolean;
    onScrollToBottom: () => void;
  }

  let { showScrollToBottom, onScrollToBottom }: Props = $props();

  let messageInput = $state('');
  let isSending = $state(false);
  let showEmojiPicker = $state(false);
  let pendingFiles = $state<PendingFile[]>([]);
  let fileInputRef = $state<HTMLInputElement | null>(null);
  let textareaRef = $state<HTMLTextAreaElement | null>(null);
  let emojiPickerRef = $state<HTMLDivElement | null>(null);

  // Initialize emoji-mart picker when ref is available
  $effect(() => {
    if (emojiPickerRef && emojiPickerRef.childElementCount === 0) {
      initEmojiPicker();
    }
  });

  async function initEmojiPicker() {
    if (!emojiPickerRef || emojiPickerRef.childElementCount > 0) return;
    
    const { Picker } = await import('emoji-mart');
    const data = (await import('@emoji-mart/data')).default;
    
    const picker = new Picker({
      data,
      onEmojiSelect: (emoji: { native: string }) => {
        insertEmoji(emoji.native);
        showEmojiPicker = false;
      },
      locale: 'zh',
      theme: preferencesStore.theme,
      previewPosition: 'none',
      skinTonePosition: 'search',
      perLine: 8,
      maxFrequentRows: 2,
    });
    emojiPickerRef.appendChild(picker as unknown as Node);
  }

  function isGroupDissolved(conv: { status: string | null }): boolean {
    return conv.status === '1';
  }

  function getMsgTypeByMimeType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '03';
    if (mimeType.startsWith('video/')) return '04';
    return '06';
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      addPendingFiles(Array.from(files));
    }
    input.value = '';
  }

  function addPendingFiles(files: File[]) {
    const newFiles: PendingFile[] = files.map(file => ({
      file,
      id: crypto.randomUUID(),
      isUploading: false,
    }));
    pendingFiles = [...pendingFiles, ...newFiles];
  }

  function removePendingFile(id: string) {
    pendingFiles = pendingFiles.filter(f => f.id !== id);
  }

  function clearPendingFiles() {
    pendingFiles = [];
  }

  async function uploadAndSendFiles() {
    if (!imStore.selectedConversation || pendingFiles.length === 0) return;

    const api = authStore.createApi(true);
    const conversationId = imStore.selectedConversation.id;

    for (const pf of pendingFiles) {
      pf.isUploading = true;
      pendingFiles = [...pendingFiles];

      try {
        const base64Data = await fileToBase64(pf.file);
        
        const res = await api.im.postApiImTempFileUpload({
          conversationId,
          fileName: pf.file.name,
          mimeType: pf.file.type || 'application/octet-stream',
          base64Data,
        });

        const uploadedFile = res.data;
        if (!uploadedFile) throw new Error('Upload failed');

        const msgType = getMsgTypeByMimeType(uploadedFile.mimeType || pf.file.type || 'application/octet-stream');

        const newMessage = await wsStore.sendMessage(
          conversationId,
          msgType,
          { 
            fileId: uploadedFile.id,
            fileName: uploadedFile.name,
            fileSize: uploadedFile.size,
            mimeType: uploadedFile.mimeType,
            downloadUrl: uploadedFile.downloadUrl,
          }
        );
        
        imStore.addMessage(newMessage);
      } catch (e) {
        console.error('Failed to upload file:', e);
        pf.error = '上传失败';
        pendingFiles = [...pendingFiles];
      }
    }

    clearPendingFiles();
  }

  function insertEmoji(emoji: string) {
    messageInput += emoji;
    textareaRef?.focus();
  }

  async function handleSendMessage() {
    if (!messageInput.trim() || !imStore.selectedConversation || isSending) return;
    
    if (imStore.selectedConversation.status === '1') return;

    const content = messageInput.trim();
    messageInput = '';
    isSending = true;

    try {
      const newMessage = await wsStore.sendMessage(
        imStore.selectedConversation.id,
        '01',
        { text: content }
      );
      
      imStore.addMessage(newMessage);
    } catch (e) {
      console.error('Failed to send message:', e);
      messageInput = content;
    } finally {
      isSending = false;
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  // Expose addPendingFiles for drag-drop from parent
  export function handleFileDrop(files: File[]) {
    addPendingFiles(files);
  }
</script>

<div class="p-4 border-t relative">
  <!-- 滚动到底部按钮 -->
  {#if showScrollToBottom}
    <button
      class="absolute -top-12 right-4 size-8 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-10"
      onclick={onScrollToBottom}
    >
      <Icon icon="mdi:chevron-down" class="size-4" />
    </button>
  {/if}

  {#if imStore.selectedConversation && isGroupDissolved(imStore.selectedConversation)}
    <div class="text-center text-muted-foreground text-sm py-2">
      该群聊已解散，无法发送消息
    </div>
  {:else}
    <!-- 待发送文件列表 -->
    {#if pendingFiles.length > 0}
      <div class="mb-3 p-3 bg-muted rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium">待发送文件 ({pendingFiles.length})</span>
          <Button size="sm" variant="ghost" class="h-6 px-2" onclick={clearPendingFiles}>
            清空
          </Button>
        </div>
        <div class="space-y-2 max-h-32 overflow-y-auto">
          {#each pendingFiles as pf}
            <div class="flex items-center gap-2 text-sm bg-background rounded px-2 py-1">
              <Icon icon="mdi:file-outline" class="size-4 shrink-0" />
              <span class="flex-1 truncate">{pf.file.name}</span>
              <span class="text-muted-foreground shrink-0">{formatFileSize(pf.file.size)}</span>
              {#if pf.isUploading}
                <Icon icon="mdi:loading" class="size-4 animate-spin" />
              {:else if pf.error}
                <span class="text-destructive text-xs">{pf.error}</span>
              {:else}
                <Button size="sm" variant="ghost" class="h-6 w-6 p-0" onclick={() => removePendingFile(pf.id)}>
                  <Icon icon="mdi:close" class="size-3" />
                </Button>
              {/if}
            </div>
          {/each}
        </div>
        <div class="flex justify-end gap-2 mt-2">
          <Button size="sm" variant="outline" onclick={clearPendingFiles}>取消</Button>
          <Button size="sm" onclick={uploadAndSendFiles}>发送文件</Button>
        </div>
      </div>
    {/if}

    <!-- 输入区域 -->
    <div class="space-y-2">
      <!-- 上方工具栏 -->
      <div class="flex items-center gap-1">
        <Popover.Root bind:open={showEmojiPicker}>
          <Popover.Trigger>
            <Button size="sm" variant="ghost" class="h-8 w-8 p-0">
              <Icon icon="mdi:emoticon-outline" class="size-4" />
            </Button>
          </Popover.Trigger>
          <Popover.Content class="w-auto p-0" align="start">
            <div bind:this={emojiPickerRef}></div>
          </Popover.Content>
        </Popover.Root>

        <Tooltip.Root>
          <Tooltip.Trigger>
            <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={() => fileInputRef?.click()}>
              <Icon icon="mdi:paperclip" class="size-4" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>支持拖拽文件快捷发送</p>
          </Tooltip.Content>
        </Tooltip.Root>

        <button 
          class="flex items-center gap-1 text-xs text-muted-foreground ml-2 hover:text-foreground transition-colors"
          onclick={() => { messageInput += '\n'; textareaRef?.focus(); }}
        >
          <Kbd>Shift</Kbd>
          <span>+</span>
          <Kbd>Enter</Kbd>
          <span>换行</span>
        </button>

        <input
          type="file"
          multiple
          class="hidden"
          bind:this={fileInputRef}
          onchange={handleFileSelect}
        />
      </div>

      <!-- 下方输入框和发送按钮 -->
      <div class="flex items-end gap-2">
        <Textarea 
          placeholder="输入消息..." 
          class="flex-1 min-h-[40px] max-h-32 resize-none" 
          bind:value={messageInput}
          bind:ref={textareaRef}
          onkeydown={handleKeyDown}
          disabled={isSending}
          rows={1}
        />
        <Button size="sm" onclick={handleSendMessage} disabled={isSending || !messageInput.trim()}>
          <Icon icon="tdesign:send" class="size-4" />
        </Button>
      </div>
    </div>
  {/if}
</div>
