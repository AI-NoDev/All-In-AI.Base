<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Sheet from '$lib/components/ui/sheet';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import * as Table from '$lib/components/ui/table';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { knowledgeStore } from '@/lib/stores/knowledge.svelte';
  import { t } from '$lib/stores/i18n.svelte';
  import {
    PostApiKnowledgeVersionsQueryFieldEnum,
    PostApiKnowledgeVersionsQueryOrderEnum,
  } from '@qiyu-allinai/api';

  interface FileVersion {
    id: string;
    nodeId: string;
    versionNumber: string;
    storageKey: string;
    bucket: string;
    size: number;
    changeLog: string | null;
    createdAt: string;
    createdBy: string;
  }

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fileId: string;
    fileName: string;
  }

  let { open, onOpenChange, fileId, fileName }: Props = $props();

  let versions = $state<FileVersion[]>([]);
  let loading = $state(false);
  let actionLoading = $state<string | null>(null);

  const api = authStore.createApi(true);

  $effect(() => {
    if (open && fileId) {
      loadVersions();
    }
  });

  async function loadVersions() {
    loading = true;
    try {
      const res = await api.knowledge.postApiKnowledgeVersionsQuery({
        filter: { nodeId: fileId },
        sort: {
          field: PostApiKnowledgeVersionsQueryFieldEnum.CreatedAt,
          order: PostApiKnowledgeVersionsQueryOrderEnum.Desc,
        },
        limit: 100,
      });
      versions = (res.data?.data || []) as FileVersion[];
    } catch (err) {
      console.error(t('page.knowledge.loadVersionsFailed') + ':', err);
      versions = [];
    } finally {
      loading = false;
    }
  }

  async function handleDownload(version: FileVersion) {
    actionLoading = version.id;
    try {
      const res = await api.knowledge.getApiKnowledgeVersionsByIdDownload({ id: version.id });
      if (res.data?.url) {
        window.open(res.data.url, '_blank');
      }
    } catch (err) {
      console.error(t('page.knowledge.getDownloadUrlFailed') + ':', err);
    } finally {
      actionLoading = null;
    }
  }

  async function handleRestore(version: FileVersion) {
    if (!confirm(t('page.knowledge.confirmRestore').replace('${version}', version.versionNumber))) {
      return;
    }
    
    actionLoading = version.id;
    try {
      await api.knowledge.postApiKnowledgeVersionsByIdRestore({ id: version.id });
      // Refresh version list and file list
      await loadVersions();
      await knowledgeStore.refresh();
    } catch (err) {
      console.error(t('page.knowledge.restoreVersionFailed') + ':', err);
    } finally {
      actionLoading = null;
    }
  }

  function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('zh-CN');
  }
</script>

<Sheet.Root {open} {onOpenChange}>
  <Sheet.Content side="right" class="!w-[600px] !max-w-[90vw] p-0 flex flex-col">
    <Sheet.Header class="px-6 py-4 border-b shrink-0">
      <Sheet.Title class="flex items-center gap-2">
        <Icon icon="mdi:source-branch" class="size-5 text-blue-500" />
        {t('page.knowledge.versionHistory')}
      </Sheet.Title>
      <Sheet.Description class="truncate" title={fileName}>
        {fileName}
      </Sheet.Description>
    </Sheet.Header>

    <div class="flex-1 min-h-0">
      {#if loading}
        <div class="p-6 space-y-3">
          {#each [1, 2, 3, 4, 5] as _}
            <Skeleton class="h-12 w-full" />
          {/each}
        </div>
      {:else if versions.length === 0}
        <div class="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Icon icon="mdi:source-branch" class="size-12 mb-2 opacity-50" />
          <p>{t('page.knowledge.noVersions')}</p>
        </div>
      {:else}
        <ScrollArea class="h-full">
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head class="w-20 sticky top-0 bg-background">{t('page.knowledge.version')}</Table.Head>
                <Table.Head class="w-20 sticky top-0 bg-background">{t('page.knowledge.size')}</Table.Head>
                <Table.Head class="sticky top-0 bg-background">{t('page.knowledge.changeLog')}</Table.Head>
                <Table.Head class="w-36 sticky top-0 bg-background">{t('common.fields_createdAt')}</Table.Head>
                <Table.Head class="w-20 sticky top-0 bg-background">{t('page.knowledge.creator')}</Table.Head>
                <Table.Head class="w-24 text-right sticky top-0 bg-background">{t('page.knowledge.actions')}</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each versions as version}
                <Table.Row>
                  <Table.Cell class="font-medium font-mono">{version.versionNumber}</Table.Cell>
                  <Table.Cell class="text-muted-foreground">{formatSize(version.size)}</Table.Cell>
                  <Table.Cell class="text-muted-foreground">
                    <span class="truncate block max-w-32" title={version.changeLog || ''}>
                      {version.changeLog || '-'}
                    </span>
                  </Table.Cell>
                  <Table.Cell class="text-muted-foreground text-xs">{formatDate(version.createdAt)}</Table.Cell>
                  <Table.Cell class="text-muted-foreground">{version.createdBy}</Table.Cell>
                  <Table.Cell class="text-right">
                    <div class="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        class="h-7 w-7 p-0"
                        disabled={actionLoading === version.id}
                        onclick={() => handleDownload(version)}
                        title={t('page.knowledge.downloadVersion')}
                      >
                        {#if actionLoading === version.id}
                          <Icon icon="mdi:loading" class="size-4 animate-spin" />
                        {:else}
                          <Icon icon="mdi:download" class="size-4" />
                        {/if}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="h-7 w-7 p-0"
                        disabled={actionLoading === version.id}
                        onclick={() => handleRestore(version)}
                        title={t('page.knowledge.restoreVersion')}
                      >
                        <Icon icon="mdi:restore" class="size-4" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>
        </ScrollArea>
      {/if}
    </div>

    <Sheet.Footer class="px-6 py-4 border-t shrink-0">
      <Button variant="outline" onclick={() => onOpenChange(false)}>{t('common.actions_close')}</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
