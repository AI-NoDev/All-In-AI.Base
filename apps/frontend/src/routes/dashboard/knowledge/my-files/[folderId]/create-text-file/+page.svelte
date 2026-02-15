<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { authStore } from '$lib/stores/auth.svelte';

  let folderId = $derived($page.params.folderId);
  
  let fileName = $state('');
  let content = $state('');
  let saving = $state(false);
  let error = $state<string | null>(null);

  const api = authStore.createApi(true);

  async function handleCreate() {
    if (!fileName.trim()) {
      error = '请输入文件名';
      return;
    }
    
    saving = true;
    error = null;
    try {
      const name = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
      const base64Content = btoa(unescape(encodeURIComponent(content)));
      const targetFolderId = folderId === 'root' ? null : folderId;
      
      await api.files.postApiFilesUpload({
        folderId: targetFolderId,
        name,
        content: base64Content,
        mimeType: 'text/plain',
      });
      
      goBack();
    } catch (err) {
      error = err instanceof Error ? err.message : '创建失败';
    } finally {
      saving = false;
    }
  }

  function goBack() {
    const targetFolder = folderId === 'root' ? '' : folderId;
    goto(`/dashboard/knowledge/my-files${targetFolder ? `?folder=${targetFolder}` : ''}`);
  }
</script>

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="flex items-center justify-between px-4 py-3 border-b">
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" onclick={goBack}>
        <Icon icon="tdesign:chevron-left" class="size-5" />
      </Button>
      <div>
        <h1 class="text-lg font-medium">新建文本文件</h1>
        <p class="text-sm text-muted-foreground">创建一个新的文本文件</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <Button variant="outline" onclick={goBack} disabled={saving}>
        取消
      </Button>
      <Button onclick={handleCreate} disabled={saving}>
        {#if saving}
          <Icon icon="tdesign:loading" class="size-4 mr-2 animate-spin" />
        {/if}
        创建
      </Button>
    </div>
  </div>

  <!-- Content -->
  <div class="flex-1 p-4 min-h-0 flex flex-col gap-4">
    <div class="space-y-2">
      <Label for="fileName">文件名</Label>
      <Input
        id="fileName"
        bind:value={fileName}
        placeholder="输入文件名（不含扩展名将自动添加 .txt）"
      />
    </div>
    
    {#if error}
      <p class="text-sm text-destructive">{error}</p>
    {/if}
    
    <div class="flex-1 flex flex-col gap-2 min-h-0">
      <Label for="content">文件内容</Label>
      <textarea
        id="content"
        bind:value={content}
        class="flex-1 p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="输入文件内容..."
      ></textarea>
    </div>
  </div>
</div>
