<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { authStore } from '$lib/stores/auth.svelte';

  interface FileData {
    id: string;
    name: string;
    mimeType: string;
    folderId: string | null;
    size: number;
  }

  type FileType = 'text' | 'image' | 'video' | 'audio' | 'other';

  let fileId = $derived($page.params.fileId);
  let folderId = $derived($page.params.folderId);
  
  let loading = $state(true);
  let saving = $state(false);
  let fileData = $state<FileData | null>(null);
  let content = $state('');
  let downloadUrl = $state<string | null>(null);
  let error = $state<string | null>(null);

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

  let fileType = $derived(getFileType(fileData?.mimeType));

  let isEditable = $derived(fileType === 'text');

  async function loadFile() {
    loading = true;
    error = null;
    try {
      const res = await api.knowledge.getApiKnowledgeFileById({ id: fileId });
      if (res.data) {
        fileData = {
          id: res.data.id,
          name: res.data.name,
          mimeType: res.data.mimeType ?? 'application/octet-stream',
          folderId: res.data.folderId,
          size: res.data.size ?? 0,
        };
        
        // 获取下载链接
        const urlRes = await api.files.getApiFilesByIdDownloadUrl({ id: fileId });
        if (urlRes.data?.url) {
          downloadUrl = urlRes.data.url;
          
          // 文本文件加载内容
          const mime = fileData.mimeType.toLowerCase();
          if (mime.startsWith('text/') || mime === 'application/json' || mime === 'application/xml' || mime === 'application/javascript') {
            const response = await fetch(urlRes.data.url);
            if (response.ok) {
              content = await response.text();
            }
          }
        }
      }
    } catch (err) {
      error = err instanceof Error ? err.message : '加载文件失败';
    } finally {
      loading = false;
    }
  }

  async function handleSave() {
    if (!fileData || !isEditable) return;
    saving = true;
    try {
      const base64Content = btoa(unescape(encodeURIComponent(content)));
      await api.files.postApiFilesUploadForce({
        folderId: fileData.folderId,
        name: fileData.name,
        content: base64Content,
        mimeType: fileData.mimeType,
        conflictMode: 'overwrite',
        existingFileId: fileData.id,
      });
      goBack();
    } catch (err) {
      error = err instanceof Error ? err.message : '保存失败';
    } finally {
      saving = false;
    }
  }

  function handleDownload() {
    if (!downloadUrl || !fileData) return;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileData.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function goBack() {
    const targetFolder = folderId === 'root' ? '' : folderId;
    goto(`/dashboard/knowledge/my-files${targetFolder ? `?folder=${targetFolder}` : ''}`);
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onMount(() => {
    loadFile();
  });
</script>

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="flex items-center justify-between px-4 py-3 border-b">
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" onclick={goBack}>
        <Icon icon="tdesign:chevron-left" class="size-5" />
      </Button>
      <div>
        <h1 class="text-lg font-medium">{fileData?.name ?? '加载中...'}</h1>
        <p class="text-sm text-muted-foreground">
          {#if fileData}
            {fileData.mimeType} · {formatFileSize(fileData.size)}
          {:else}
            加载文件信息...
          {/if}
        </p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <Button variant="outline" onclick={handleDownload} disabled={!downloadUrl}>
        <Icon icon="tdesign:download" class="size-4 mr-2" />
        下载
      </Button>
      {#if isEditable}
        <Button variant="outline" onclick={goBack} disabled={saving}>
          取消
        </Button>
        <Button onclick={handleSave} disabled={loading || saving}>
          {#if saving}
            <Icon icon="tdesign:loading" class="size-4 mr-2 animate-spin" />
          {/if}
          保存
        </Button>
      {/if}
    </div>
  </div>

  <!-- Content -->
  <div class="flex-1 p-4 min-h-0 overflow-auto">
    {#if loading}
      <div class="flex items-center justify-center h-full">
        <Icon icon="tdesign:loading" class="size-8 animate-spin text-muted-foreground" />
      </div>
    {:else if error}
      <div class="flex flex-col items-center justify-center h-full gap-4">
        <Icon icon="tdesign:error-circle" class="size-12 text-destructive" />
        <p class="text-destructive">{error}</p>
        <Button variant="outline" onclick={loadFile}>重试</Button>
      </div>
    {:else if fileType === 'text'}
      <!-- 文本编辑器 -->
      <textarea
        bind:value={content}
        class="w-full h-full p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-background"
        placeholder="输入文件内容..."
      ></textarea>
    {:else if fileType === 'image'}
      <!-- 图片预览 -->
      <div class="flex items-center justify-center h-full">
        <img
          src={downloadUrl}
          alt={fileData?.name}
          class="max-w-full max-h-full object-contain rounded-lg shadow-lg"
        />
      </div>
    {:else if fileType === 'video'}
      <!-- 视频预览 -->
      <div class="flex items-center justify-center h-full">
        <video
          src={downloadUrl}
          controls
          class="max-w-full max-h-full rounded-lg shadow-lg"
        >
          <track kind="captions" />
          您的浏览器不支持视频播放
        </video>
      </div>
    {:else if fileType === 'audio'}
      <!-- 音频预览 -->
      <div class="flex flex-col items-center justify-center h-full gap-6">
        <div class="p-8 bg-muted rounded-full">
          <Icon icon="tdesign:sound" class="size-16 text-muted-foreground" />
        </div>
        <p class="text-lg font-medium">{fileData?.name}</p>
        <audio src={downloadUrl} controls class="w-full max-w-md">
          您的浏览器不支持音频播放
        </audio>
      </div>
    {:else}
      <!-- 不支持预览 -->
      <div class="flex flex-col items-center justify-center h-full gap-6">
        <div class="p-8 bg-muted rounded-full">
          <Icon icon="tdesign:file" class="size-16 text-muted-foreground" />
        </div>
        <div class="text-center">
          <p class="text-lg font-medium">{fileData?.name}</p>
          <p class="text-sm text-muted-foreground mt-1">
            此文件类型不支持在线预览
          </p>
          <p class="text-sm text-muted-foreground">
            {fileData?.mimeType} · {formatFileSize(fileData?.size ?? 0)}
          </p>
        </div>
        <Button onclick={handleDownload} size="lg">
          <Icon icon="tdesign:download" class="size-5 mr-2" />
          下载文件
        </Button>
      </div>
    {/if}
  </div>
</div>
