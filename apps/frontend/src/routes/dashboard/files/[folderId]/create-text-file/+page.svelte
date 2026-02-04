<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import * as Card from '@/lib/components/ui/card';
  import { Button } from '@/lib/components/ui/button';
  import { Input } from '@/lib/components/ui/input';
  import { Label } from '@/lib/components/ui/label';
  import { MarkdownEditor } from '@/lib/components/common';
  import { authStore } from '@/lib/stores/auth.svelte';

  interface FormData {
    name: string;
    content: string;
  }

  let form = $state<FormData>({
    name: '',
    content: '',
  });

  let saving = $state(false);

  const api = authStore.createApi(true);

  let folderId = $derived(page.params.folderId === 'root' ? null : page.params.folderId);

  function handleContentChange(value: string) {
    form.content = value;
  }

  async function handleSave() {
    if (!form.name.trim()) return;

    saving = true;
    try {
      const fileName = form.name.endsWith('.md') ? form.name : `${form.name}.md`;
      const content = btoa(unescape(encodeURIComponent(form.content)));
      
      await api.files.postApiFilesUpload({
        folderId: folderId ?? null,
        name: fileName,
        content,
        mimeType: 'text/markdown',
      });

      goto('/dashboard/files');
    } catch (err) {
      console.error('保存失败:', err);
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  function handleCancel() {
    goto('/dashboard/files');
  }
</script>

<div class="px-4 lg:px-6">
  <Card.Root>
    <Card.Header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" class="h-8 w-8 p-0" onclick={handleCancel}>
            <Icon icon="tdesign:chevron-left" class="size-5" />
          </Button>
          <span class="text-lg font-medium">新建文档</span>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="outline" onclick={handleCancel} disabled={saving}>
            取消
          </Button>
          <Button onclick={handleSave} disabled={saving || !form.name.trim()}>
            {#if saving}
              <Icon icon="tdesign:loading" class="mr-2 size-4 animate-spin" />
            {/if}
            保存
          </Button>
        </div>
      </div>
    </Card.Header>
    <Card.Content class="space-y-4">
      <div class="space-y-2">
        <Label for="filename">文件名</Label>
        <div class="flex items-center gap-2">
          <Input
            id="filename"
            bind:value={form.name}
            placeholder="请输入文件名"
            class="max-w-md"
          />
          <span class="text-muted-foreground">.md</span>
        </div>
      </div>

      <div class="space-y-2">
        <Label>文件内容</Label>
        <MarkdownEditor
          value={form.content}
          placeholder="请输入 Markdown 内容..."
          height={500}
          mode="ir"
          onInput={handleContentChange}
        />
      </div>
    </Card.Content>
  </Card.Root>
</div>
