<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { authStore } from '$lib/stores/auth.svelte';
  import { t } from '$lib/stores/i18n.svelte';

  let folderId = $derived($page.params.folderId);
  
  let fileName = $state('');
  let content = $state('');
  let saving = $state(false);
  let error = $state<string | null>(null);

  const api = authStore.createApi(true);

  async function handleCreate() {
    if (!fileName.trim()) {
      error = t('page.knowledge.enterFileName');
      return;
    }
    
    saving = true;
    error = null;
    try {
      const name = fileName.endsWith('.txt') ? fileName : `${fileName}.txt`;
      const base64Content = btoa(unescape(encodeURIComponent(content)));
      const targetFolderId = folderId === 'root' ? null : folderId;
      
      await api.knowledge.postApiKnowledgeUploadDirect({
        parentId: targetFolderId,
        name,
        content: base64Content,
        mimeType: 'text/plain',
      });
      
      goBack();
    } catch (err) {
      error = err instanceof Error ? err.message : t('page.knowledge.createFailed');
    } finally {
      saving = false;
    }
  }

  function goBack() {
    const targetFolder = folderId === 'root' ? '' : folderId;
    goto(`/dashboard/knowledge/my-files${targetFolder ? `?folder=${targetFolder}` : ''}`);
  }
</script>

<script lang="ts" module>
  export const _meta = {
    title: 'page.knowledge.newTextFile',
    icon: 'tdesign:file-add',
    group: 'page.knowledge.myFiles',
    order: 101,
    hidden: true,
  };
</script>

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="flex items-center justify-between px-4 py-3 border-b">
    <div class="flex items-center gap-3">
      <Button variant="ghost" size="icon" onclick={goBack}>
        <Icon icon="tdesign:chevron-left" class="size-5" />
      </Button>
      <div>
        <h1 class="text-lg font-medium">{t('page.knowledge.newTextFile')}</h1>
        <p class="text-sm text-muted-foreground">{t('page.knowledge.newDocument')}</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <Button variant="outline" onclick={goBack} disabled={saving}>
        {t('page.knowledge.cancel')}
      </Button>
      <Button onclick={handleCreate} disabled={saving}>
        {#if saving}
          <Icon icon="tdesign:loading" class="size-4 mr-2 animate-spin" />
        {/if}
        {t('page.knowledge.new')}
      </Button>
    </div>
  </div>

  <!-- Content -->
  <div class="flex-1 p-4 min-h-0 flex flex-col gap-4">
    <div class="space-y-2">
      <Label for="fileName">{t('page.knowledge.fileNameLabel')}</Label>
      <Input
        id="fileName"
        bind:value={fileName}
        placeholder={t('page.knowledge.fileNameHint')}
      />
    </div>
    
    {#if error}
      <p class="text-sm text-destructive">{error}</p>
    {/if}
    
    <div class="flex-1 flex flex-col gap-2 min-h-0">
      <Label for="content">{t('page.knowledge.fileContentLabel')}</Label>
      <textarea
        id="content"
        bind:value={content}
        class="flex-1 p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder={t('page.knowledge.inputContentPlaceholder')}
      ></textarea>
    </div>
  </div>
</div>
