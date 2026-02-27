<script lang="ts">
  import { onMount } from 'svelte';
  import { knowledgeStore } from '$lib/stores/knowledge.svelte';
  import { t } from '$lib/stores/i18n.svelte';
  import KnowledgeFileList, { type GenericFile, type GenericFolder } from '../../files/components/knowledge-file-list.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import { toast } from 'svelte-sonner';
  import Icon from '@iconify/svelte';

  let loading = $state(true);
  let deleteDialogOpen = $state(false);
  let emptyDialogOpen = $state(false);
  let itemToDelete = $state<GenericFile | GenericFolder | null>(null);
  let isDeleting = $state(false);

  // Transform store nodes to GenericFolder/GenericFile
  // We map deletedAt to updatedAt so it shows in the list as the relevant date
  let folders = $derived(knowledgeStore.folders.map(f => ({
    ...f,
    updatedAt: f.deletedAt || f.updatedAt
  })));
  
  let files = $derived(knowledgeStore.files.map(f => ({
    ...f,
    updatedAt: f.deletedAt || f.updatedAt
  })));

  onMount(async () => {
    loading = true;
    try {
      await knowledgeStore.loadRecycleBin();
    } catch (err) {
      console.error(err);
      toast.error(t('common.loadFailed'));
    } finally {
      loading = false;
    }
  });

  async function handleRestore(item: GenericFile | GenericFolder) {
    try {
      await knowledgeStore.restore([item.id]);
      toast.success(t('common.success'));
      await knowledgeStore.loadRecycleBin();
    } catch (err) {
      console.error(err);
      toast.error(t('common.failed'));
    }
  }

  async function handleDeleteClick(item: GenericFile | GenericFolder) {
    itemToDelete = item;
    deleteDialogOpen = true;
  }

  async function confirmDelete() {
    if (!itemToDelete) return;
    
    isDeleting = true;
    try {
      await knowledgeStore.deletePermanently([itemToDelete.id]);
      toast.success(t('common.success'));
      deleteDialogOpen = false;
      await knowledgeStore.loadRecycleBin();
    } catch (err) {
      console.error(err);
      toast.error(t('common.failed'));
    } finally {
      isDeleting = false;
      itemToDelete = null;
    }
  }

  async function confirmEmpty() {
    isDeleting = true;
    try {
      // @ts-ignore
      await knowledgeStore.emptyRecycleBin();
      toast.success(t('common.success'));
      emptyDialogOpen = false;
      await knowledgeStore.loadRecycleBin();
    } catch (err) {
      console.error(err);
      toast.error(t('common.failed'));
    } finally {
      isDeleting = false;
    }
  }
</script>

<div class="flex flex-col h-full bg-background">
  <!-- Header -->
  <div class="flex items-center justify-between px-6 py-4 border-b shrink-0">
    <div class="flex items-center gap-2">
      <h1 class="text-lg font-semibold">{t('nav.title_recycleBin')}</h1>
      <span class="text-muted-foreground text-sm">
        ({folders.length + files.length})
      </span>
    </div>
    <div class="flex items-center gap-2">
      <Button 
        variant="destructive" 
        size="sm"
        disabled={folders.length === 0 && files.length === 0}
        onclick={() => emptyDialogOpen = true}
      >
        <Icon icon="tdesign:delete" class="mr-2 size-4" />
        {t('page.knowledge.emptyRecycleBin')}
      </Button>
    </div>
  </div>

  <!-- Content -->
  <div class="flex-1 min-h-0">
    {#if !loading && folders.length === 0 && files.length === 0 && knowledgeStore.currentFolderId === null}
      <div class="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Icon icon="tdesign:delete" class="size-16 mb-4 opacity-20" />
        <p class="text-lg font-medium">{t('page.knowledge.recycleBinEmpty')}</p>
        <p class="text-sm mt-1">{t('page.knowledge.recycleBinEmptyHint')}</p>
      </div>
    {:else}
      <KnowledgeFileList
      viewMode="recycle-bin"
      {loading}
      {folders}
      {files}
      currentFolderId={knowledgeStore.currentFolderId}
      deleteLabel={t('page.knowledge.deletePermanently')}
      onNavigateToFolder={(folder) => knowledgeStore.navigateToFolder(folder)}
      onNavigateUp={() => knowledgeStore.navigateUp()}
      onRestoreFolder={handleRestore}
      onRestoreFile={handleRestore}
      onDeleteFolder={handleDeleteClick}
      onDeleteFile={handleDeleteClick}
    />
    {/if}
  </div>
</div>

<!-- Delete Confirmation Dialog -->
<AlertDialog.Root bind:open={deleteDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{t('page.knowledge.deletePermanently')}</AlertDialog.Title>
      <AlertDialog.Description>
        {t('page.knowledge.confirmDeletePermanently')}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>{t('common.cancel')}</AlertDialog.Cancel>
      <AlertDialog.Action 
        class="bg-destructive hover:bg-destructive/90"
        onclick={confirmDelete}
        disabled={isDeleting}
      >
        {isDeleting ? t('common.processing') : t('page.knowledge.deletePermanently')}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<!-- Empty Recycle Bin Dialog -->
<AlertDialog.Root bind:open={emptyDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{t('page.knowledge.emptyRecycleBin')}</AlertDialog.Title>
      <AlertDialog.Description>
        {t('page.knowledge.confirmEmptyRecycleBin')}
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>{t('common.cancel')}</AlertDialog.Cancel>
      <AlertDialog.Action 
        class="bg-destructive hover:bg-destructive/90"
        onclick={confirmEmpty}
        disabled={isDeleting}
      >
        {isDeleting ? t('common.processing') : t('page.knowledge.emptyRecycleBin')}
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
