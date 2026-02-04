<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import * as Card from '@/lib/components/ui/card';
  import { Button } from '@/lib/components/ui/button';
  import { Skeleton } from '@/lib/components/ui/skeleton';
  import { MarkdownEditor } from '@/lib/components/common';
  import { authStore } from '@/lib/stores/auth.svelte';

  interface FileData {
    id: string;
    name: string;
    content: string;
    mimeType: string | null;
    extension: string | null;
    folderId: string | null;
  }

  let fileData = $state<FileData | null>(null);
  let content = $state('');
  let loading = $state(true);
  let saving = $state(false);
  let error = $state<string | null>(null);
  let hasChanges = $state(false);

  const api = authStore.createApi(true);

  let fileId = $derived(page.params.fileId ?? '');
  let folderId = $derived(page.params.folderId === 'root' ? null : page.params.folderId);

  onMount(() => {
    if (fileId) {
      loadFile();
    }
  });

  async function loadFile() {
    if (!fileId) return;
    loading = true;
    error = null;
    try {
      const res = await api.files.getApiFilesByIdTextContent({ id: fileId });
      if (res.data) {
        fileData = res.data as FileData;
        content = fileData.content;
      }
    } catch (err) {
      console.error('加载文件失败:', err);
      const message = (err as { error?: { message?: string } })?.error?.message;
      if (message === 'error.files.notTextFile') {
        error = '该文件不是纯文本文件，无法编辑';
      } else if (message === 'error.files.notFound') {
        error = '文件不存在';
      } else {
        error = '加载文件失败';
      }
    } finally {
      loading = false;
    }
  }

  function handleContentChange(value: string) {
    content = value;
    hasChanges = content !== fileData?.content;
  }

  async function handleSave() {
    if (!fileData) return;

    saving = true;
    try {
      await api.files.putApiFilesByIdContent({ id: fileData.id }, { content });
      hasChanges = false;
      // 更新原始内容
      fileData = { ...fileData, content };
    } catch (err) {
      console.error('保存失败:', err);
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  function handleBack() {
    if (hasChanges && !confirm('有未保存的更改，确定要离开吗？')) {
      return;
    }
    goto('/dashboard/files');
  }
</script>

<div class="px-4 lg:px-6 flex-1 flex flex-col min-h-0">
  <Card.Root class="flex-1 flex flex-col min-h-0">
    <Card.Header class="shrink-0">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" class="h-8 w-8 p-0" onclick={handleBack}>
            <Icon icon="tdesign:chevron-left" class="size-5" />
          </Button>
          {#if loading}
            <Skeleton class="h-6 w-48" />
          {:else if fileData}
            <span class="text-lg font-medium">{fileData.name}</span>
            {#if hasChanges}
              <span class="text-xs text-muted-foreground">(未保存)</span>
            {/if}
          {:else}
            <span class="text-lg font-medium text-muted-foreground">编辑文件</span>
          {/if}
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" onclick={handleBack} disabled={saving}>
            {hasChanges ? '放弃更改' : '返回'}
          </Button>
          <Button onclick={handleSave} disabled={saving || !hasChanges || !fileData}>
            {#if saving}
              <Icon icon="tdesign:loading" class="mr-2 size-4 animate-spin" />
            {/if}
            保存
          </Button>
        </div>
      </div>
    </Card.Header>
    <Card.Content class="flex-1 flex flex-col min-h-0">
      {#if loading}
        <div class="space-y-3">
          <Skeleton class="h-8 w-full" />
          <Skeleton class="h-[400px] w-full" />
        </div>
      {:else if error}
        <div class="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <Icon icon="tdesign:file-blocked" class="size-16 mb-4 opacity-50" />
          <p class="text-lg">{error}</p>
          <Button variant="outline" class="mt-4" onclick={handleBack}>
            返回文件列表
          </Button>
        </div>
      {:else if fileData}
        <div class="flex-1 min-h-0">
          <MarkdownEditor
            value={content}
            placeholder="请输入内容..."
            height={600}
            mode="ir"
            onInput={handleContentChange}
          />
        </div>
      {/if}
    </Card.Content>
  </Card.Root>
</div>
