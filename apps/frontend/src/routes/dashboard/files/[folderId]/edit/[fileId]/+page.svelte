<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { MarkdownEditor } from '@/lib/components/common';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '$lib/stores/i18n.svelte';

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
      console.error(t('page.knowledge.loadFileFailed') + ':', err);
      const message = (err as { error?: { message?: string } })?.error?.message;
      if (message === 'error.files.notTextFile') {
        error = t('page.knowledge.notTextFile');
      } else if (message === 'error.files.notFound') {
        error = t('page.knowledge.fileNotFound');
      } else {
        error = t('page.knowledge.loadFileFailed');
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
      fileData = { ...fileData, content };
    } catch (err) {
      console.error(t('page.knowledge.saveFailed') + ':', err);
      alert(t('page.knowledge.saveFailed'));
    } finally {
      saving = false;
    }
  }

  function handleBack() {
    if (hasChanges && !confirm(t('page.knowledge.confirmLeaveUnsaved'))) {
      return;
    }
    goto('/dashboard/files');
  }
</script>

<div class="flex flex-col gap-6 px-4 lg:px-6 flex-1 min-h-0">
  <div class="flex items-center justify-between shrink-0">
    <div class="flex items-center gap-2">
      <Button variant="ghost" size="sm" class="h-8 w-8 p-0" onclick={handleBack}>
        <Icon icon="tdesign:chevron-left" class="size-5" />
      </Button>
      {#if loading}
        <Skeleton class="h-6 w-48" />
      {:else if fileData}
        <span class="text-lg font-medium">{fileData.name}</span>
        {#if hasChanges}
          <span class="text-xs text-muted-foreground">({t('page.knowledge.unsavedChanges')})</span>
        {/if}
      {:else}
        <span class="text-lg font-medium text-muted-foreground">{t('page.knowledge.editFile')}</span>
      {/if}
    </div>
    <div class="flex items-center gap-2">
      <Button variant="outline" onclick={handleBack} disabled={saving}>
        {hasChanges ? t('page.knowledge.discardChanges') : t('common.actions_back')}
      </Button>
      <Button onclick={handleSave} disabled={saving || !hasChanges || !fileData}>
        {#if saving}
          <Icon icon="tdesign:loading" class="mr-2 size-4 animate-spin" />
        {/if}
        {t('common.actions_save')}
      </Button>
    </div>
  </div>

  <div class="flex-1 min-h-0">
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
          {t('page.knowledge.backToList')}
        </Button>
      </div>
    {:else if fileData}
      <MarkdownEditor
        value={content}
        placeholder={t('page.knowledge.inputPlaceholder')}
        height={600}
        mode="ir"
        onInput={handleContentChange}
      />
    {/if}
  </div>
</div>
