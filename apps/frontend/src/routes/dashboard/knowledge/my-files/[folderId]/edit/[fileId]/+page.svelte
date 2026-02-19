<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { authStore } from '$lib/stores/auth.svelte';

  interface ApiError {
    message?: string;
    status?: number;
  }

  interface FileData {
    id: string;
    name: string;
    extension: string | null;
    mimeType: string;
    folderId: string | null;
    size: number;
  }

  type FileType = 'text' | 'image' | 'video' | 'audio' | 'other';

  let fileId = $derived($page.params.fileId);
  let folderId = $derived($page.params.folderId);
  let isReadonly = $derived($page.url.searchParams.get('readonly') === 'true');
  
  let loading = $state(true);
  let saving = $state(false);
  let uploading = $state(false);
  let fileData = $state<FileData | null>(null);
  let content = $state('');
  let downloadUrl = $state<string | null>(null);
  let error = $state<string | null>(null);
  let uploadError = $state<string | null>(null);
  let fileInputRef = $state<HTMLInputElement | null>(null);
  let confirmDialogOpen = $state(false);
  let pendingFile = $state<File | null>(null);

  const api = authStore.createApi(true);

  function getFileType(mimeType: string | undefined): FileType {
    if (!mimeType) return 'other';
    const mime = mimeType.toLowerCase();
    if (mime.startsWith('text/') || mime === 'application/json' || mime === 'application/xml' || mime === 'application/javascript') return 'text';
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';
    return 'other';
  }

  function getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot > 0 ? filename.substring(lastDot + 1).toLowerCase() : '';
  }

  let fileType = $derived(getFileType(fileData?.mimeType));
  let isTextEditable = $derived(fileType === 'text' && !isReadonly);
  let canReplace = $derived(!isReadonly);
  let currentExtension = $derived(fileData?.extension?.toLowerCase() || getFileExtension(fileData?.name || ''));

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  }

  async function loadFile() {
    loading = true;
    error = null;
    try {
      // 先获取文件基本信息
      const res = await api.knowledge.getApiKnowledgeNodesById({ id: fileId });
      const fileInfo = res.data;
      if (!fileInfo) {
        throw new Error('文件不存在');
      }
      fileData = {
        id: fileInfo.id,
        name: fileInfo.name,
        extension: fileInfo.extension,
        mimeType: fileInfo.mimeType || 'application/octet-stream',
        folderId: fileInfo.parentId,
        size: fileInfo.size,
      };
      
      // 如果是文本文件，获取内容
      const type = getFileType(fileInfo.mimeType || undefined);
      if (type === 'text') {
        try {
          const textRes = await api.knowledge.getApiKnowledgeNodesByIdText({ id: fileId });
          content = textRes.data?.content || '';
        } catch {
          // 获取文本内容失败，可能不是真正的文本文件
        }
      }
      
      // 获取下载URL用于预览
      const urlRes = await api.knowledge.getApiKnowledgeNodesByIdDownloadUrl({ id: fileId });
      downloadUrl = urlRes.data?.url || null;
    } catch (err: unknown) {
      const e = err as ApiError;
      // 检查是否是 403 权限错误
      if (e?.status === 403 || e?.message?.includes('permissionDenied') || e?.message?.includes('permission')) {
        error = '您没有权限访问此文件';
      } else {
        error = e?.message || '加载文件失败';
      }
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    if (!fileData || saving) return;
    saving = true;
    try {
      await api.knowledge.putApiKnowledgeNodesByIdText({ id: fileId }, { content });
      goBack();
    } catch (err: unknown) {
      const e = err as { message?: string };
      error = e?.message || '保存失败';
    } finally {
      saving = false;
    }
  }

  function handleFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    uploadError = null;
    const uploadExt = getFileExtension(file.name);
    
    if (uploadExt !== currentExtension) {
      uploadError = `文件后缀名不匹配，需要 .${currentExtension} 格式的文件`;
      input.value = '';
      return;
    }
    
    pendingFile = file;
    confirmDialogOpen = true;
    input.value = '';
  }

  async function handleUploadReplace() {
    if (!pendingFile || !fileData || uploading) return;
    
    uploading = true;
    confirmDialogOpen = false;
    uploadError = null;
    
    try {
      const buffer = await pendingFile.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
      
      await api.knowledge.postApiKnowledgeUploadForce({
        parentId: fileData.folderId,
        name: fileData.name,
        content: base64,
        mimeType: pendingFile.type || fileData.mimeType,
        conflictMode: 'overwrite',
        existingNodeId: fileData.id,
      });
      
      // 重新加载文件
      await loadFile();
    } catch (err: unknown) {
      const e = err as { message?: string };
      uploadError = e?.message || '上传替换失败';
    } finally {
      uploading = false;
      pendingFile = null;
    }
  }

  function handleDownload() {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  }

  function goBack() {
    history.back();
  }

  onMount(() => {
    loadFile();
  });
</script>

<script lang="ts" module>
  export const _meta = {
    title: '编辑文件',
    icon: 'tdesign:edit',
    group: '知识库',
    order: 100,
    hidden: true,
  };
</script>

{#if loading}
  <div class="flex items-center justify-center h-64">
    <Icon icon="svg-spinners:ring-resize" class="w-8 h-8 text-primary" />
  </div>
{:else if error}
  <div class="flex flex-col items-center justify-center h-64 gap-4">
    <Icon icon="tdesign:error-circle" class="w-12 h-12 text-destructive" />
    <p class="text-destructive">{error}</p>
    <Button variant="outline" onclick={goBack}>返回</Button>
  </div>
{:else if fileData}
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between p-4 border-b">
      <div class="flex items-center gap-3">
        <Button variant="ghost" size="icon" onclick={goBack}>
          <Icon icon="tdesign:chevron-left" class="w-5 h-5" />
        </Button>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-lg font-medium">{fileData.name}</h1>
            {#if isReadonly}
              <Badge variant="secondary">只读</Badge>
            {/if}
          </div>
          <p class="text-sm text-muted-foreground">
            {fileData.mimeType} · {formatFileSize(fileData.size)}
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" onclick={handleDownload}>
          <Icon icon="tdesign:download" class="w-4 h-4 mr-2" />
          下载
        </Button>
        {#if isTextEditable}
          <Button onclick={handleSave} disabled={saving}>
            {#if saving}
              <Icon icon="svg-spinners:ring-resize" class="w-4 h-4 mr-2" />
            {:else}
              <Icon icon="tdesign:save" class="w-4 h-4 mr-2" />
            {/if}
            保存
          </Button>
        {:else if canReplace}
          <Button variant="outline" onclick={() => fileInputRef?.click()} disabled={uploading}>
            {#if uploading}
              <Icon icon="svg-spinners:ring-resize" class="w-4 h-4 mr-2" />
            {:else}
              <Icon icon="tdesign:upload" class="w-4 h-4 mr-2" />
            {/if}
            上传替换
          </Button>
        {/if}
        {#if isReadonly}
          <Button variant="outline" onclick={goBack}>返回</Button>
        {/if}
      </div>
    </div>

    <!-- Hidden file input -->
    <input
      type="file"
      class="hidden"
      bind:this={fileInputRef}
      onchange={handleFileSelect}
      accept={currentExtension ? `.${currentExtension}` : undefined}
    />

    <!-- Upload error -->
    {#if uploadError}
      <div class="mx-4 mt-4 p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
        <Icon icon="tdesign:error-circle" class="w-4 h-4" />
        {uploadError}
      </div>
    {/if}

    <!-- Content area -->
    <div class="flex-1 overflow-auto p-4">
      {#if fileType === 'text'}
        {#if isReadonly}
          <pre class="w-full h-full p-4 bg-muted rounded-md overflow-auto whitespace-pre-wrap font-mono text-sm">{content}</pre>
        {:else}
          <textarea
            class="w-full h-full min-h-[400px] p-4 border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            bind:value={content}
            placeholder="输入文件内容..."
          ></textarea>
        {/if}
      {:else if fileType === 'image' && downloadUrl}
        <div class="flex items-center justify-center h-full">
          <img src={downloadUrl} alt={fileData.name} class="max-w-full max-h-[600px] object-contain rounded-md" />
        </div>
      {:else if fileType === 'video' && downloadUrl}
        <div class="flex items-center justify-center h-full">
          <video src={downloadUrl} controls class="max-w-full max-h-[600px] rounded-md">
            <track kind="captions" />
          </video>
        </div>
      {:else if fileType === 'audio' && downloadUrl}
        <div class="flex items-center justify-center h-full">
          <audio src={downloadUrl} controls class="w-full max-w-md">
            <track kind="captions" />
          </audio>
        </div>
      {:else}
        <div class="flex flex-col items-center justify-center h-64 gap-4">
          <Icon icon="tdesign:file" class="w-16 h-16 text-muted-foreground" />
          <p class="text-muted-foreground">此文件类型不支持预览</p>
          {#if canReplace}
            <p class="text-sm text-muted-foreground">可以上传相同后缀名的文件进行替换</p>
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Confirm replace dialog -->
  <AlertDialog.Root bind:open={confirmDialogOpen}>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>确认替换文件</AlertDialog.Title>
        <AlertDialog.Description>
          {#if pendingFile}
            确定要用 "{pendingFile.name}" 替换当前文件吗？此操作不可撤销。
          {/if}
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel onclick={() => { pendingFile = null; }}>取消</AlertDialog.Cancel>
        <AlertDialog.Action onclick={handleUploadReplace}>确认替换</AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{/if}
