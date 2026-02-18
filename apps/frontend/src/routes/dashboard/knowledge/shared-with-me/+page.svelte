<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { Button } from '$lib/components/ui/button';
  import * as Table from '$lib/components/ui/table';
  import {
    FileBreadcrumb,
    KnowledgeFileList,
    type GenericFolder,
    type GenericFile,
  } from '../components';

  interface PathItem {
    id: string | null;
    name: string;
  }

  let loading = $state(true);
  let folders = $state<GenericFolder[]>([]);
  let files = $state<GenericFile[]>([]);
  let pathStack = $state<PathItem[]>([{ id: null, name: '收到的共享' }]);
  let currentFolderId = $state<string | null>(null);
  let favoritedFolderIds = $state<Set<string>>(new Set());
  let favoritedFileIds = $state<Set<string>>(new Set());

  const api = authStore.createApi(true);

  async function loadData() {
    loading = true;
    try {
      if (currentFolderId === null) {
        const res = await api.files.postApiFilesShareSharedWithMe({ limit: 100, offset: 0 });
        folders = (res.data?.folders || []) as GenericFolder[];
        files = (res.data?.files || []) as GenericFile[];
      } else {
        const res = await api.files.postApiFilesShareFolderContents({
          folderId: currentFolderId,
          viewMode: 'shared-with-me',
          limit: 100,
          offset: 0,
        });
        folders = (res.data?.folders || []) as GenericFolder[];
        files = (res.data?.files || []) as GenericFile[];
      }
      // 加载收藏状态
      await loadFavoriteStatus();
    } catch (err) {
      console.error('加载共享数据失败:', err);
      folders = [];
      files = [];
    } finally {
      loading = false;
    }
  }

  async function loadFavoriteStatus() {
    if (folders.length === 0 && files.length === 0) return;
    try {
      const res = await api.knowledge.postApiKnowledgeFavoriteCheckBatch({
        folderIds: folders.map(f => f.id),
        fileIds: files.map(f => f.id),
      });
      favoritedFolderIds = new Set(res.data?.favoritedFolderIds || []);
      favoritedFileIds = new Set(res.data?.favoritedFileIds || []);
    } catch (err) {
      console.error('加载收藏状态失败:', err);
    }
  }

  async function toggleFolderFavorite(folder: GenericFolder) {
    try {
      if (favoritedFolderIds.has(folder.id)) {
        await api.knowledge.deleteApiKnowledgeFavoriteByResourceTypeByResourceId({
          resourceType: 'folder',
          resourceId: folder.id,
        });
        favoritedFolderIds = new Set([...favoritedFolderIds].filter(id => id !== folder.id));
      } else {
        await api.knowledge.postApiKnowledgeFavorite({
          resourceType: 'folder',
          resourceId: folder.id,
        });
        favoritedFolderIds = new Set([...favoritedFolderIds, folder.id]);
      }
    } catch (err) {
      console.error('切换收藏状态失败:', err);
    }
  }

  async function toggleFileFavorite(file: GenericFile) {
    try {
      if (favoritedFileIds.has(file.id)) {
        await api.knowledge.deleteApiKnowledgeFavoriteByResourceTypeByResourceId({
          resourceType: 'file',
          resourceId: file.id,
        });
        favoritedFileIds = new Set([...favoritedFileIds].filter(id => id !== file.id));
      } else {
        await api.knowledge.postApiKnowledgeFavorite({
          resourceType: 'file',
          resourceId: file.id,
        });
        favoritedFileIds = new Set([...favoritedFileIds, file.id]);
      }
    } catch (err) {
      console.error('切换收藏状态失败:', err);
    }
  }

  function navigateToFolder(folder: GenericFolder) {
    currentFolderId = folder.id;
    pathStack = [...pathStack, { id: folder.id, name: folder.name }];
    loadData();
  }

  function navigateUp() {
    if (pathStack.length <= 1) return;
    pathStack = pathStack.slice(0, -1);
    currentFolderId = pathStack[pathStack.length - 1].id;
    loadData();
  }

  function navigateToPath(index: number) {
    if (index >= pathStack.length - 1) return;
    pathStack = pathStack.slice(0, index + 1);
    currentFolderId = pathStack[index].id;
    loadData();
  }

  function handleFileClick(file: GenericFile) {
    if (file.permission === 'write') {
      goto(`/dashboard/knowledge/my-files/${file.folderId || 'root'}/edit/${file.id}`);
    } else {
      // 只读模式查看
      goto(`/dashboard/knowledge/my-files/${file.folderId || 'root'}/edit/${file.id}?readonly=true`);
    }
  }

  async function handleDownloadFile(file: GenericFile) {
    try {
      const res = await api.files.getApiFilesByIdDownloadUrl({ id: file.id });
      if (res.data?.url) {
        window.open(res.data.url, '_blank');
      }
    } catch (err) {
      console.error('获取下载链接失败:', err);
    }
  }

  onMount(() => loadData());
</script>

<div class="px-4 lg:px-6 flex-1 flex flex-col min-h-0">
  <div class="flex items-center justify-between py-2 border-b mb-2">
    <FileBreadcrumb {pathStack} onNavigate={navigateToPath} />
    <Button variant="ghost" size="sm" onclick={loadData}>
      <Icon icon="tdesign:refresh" class="size-4" />
    </Button>
  </div>

  <div class="flex-1 flex flex-col min-h-0">
    {#if !loading && folders.length === 0 && files.length === 0 && currentFolderId === null}
      <div class="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Icon icon="tdesign:user-transmit" class="size-16 mb-4 opacity-50" />
        <p class="text-lg">还没有人与您共享文件</p>
        <p class="text-sm">当有人共享文件给您时，会显示在这里</p>
      </div>
    {:else}
      <KnowledgeFileList
        viewMode="shared-with-me"
        {loading}
        {folders}
        {files}
        {currentFolderId}
        {favoritedFolderIds}
        {favoritedFileIds}
        onNavigateUp={navigateUp}
        onNavigateToFolder={navigateToFolder}
        onDownloadFile={handleDownloadFile}
        onFileDoubleClick={handleFileClick}
        onToggleFolderFavorite={toggleFolderFavorite}
        onToggleFileFavorite={toggleFileFavorite}
      >
        {#snippet extraHeaderColumns()}
          <Table.Head class="text-left">共享者</Table.Head>
          <Table.Head class="text-left w-20">权限</Table.Head>
        {/snippet}
        {#snippet extraFolderColumns(folder)}
          <Table.Cell class="text-sm text-muted-foreground">{folder.sharedBy || '-'}</Table.Cell>
          <Table.Cell class="text-sm">
            <span class="px-2 py-0.5 rounded bg-muted text-xs">{folder.permission === 'write' ? '可编辑' : '只读'}</span>
          </Table.Cell>
        {/snippet}
        {#snippet extraFileColumns(file)}
          <Table.Cell class="text-sm text-muted-foreground">{file.sharedBy || '-'}</Table.Cell>
          <Table.Cell class="text-sm">
            <span class="px-2 py-0.5 rounded bg-muted text-xs">{file.permission === 'write' ? '可编辑' : '只读'}</span>
          </Table.Cell>
        {/snippet}
      </KnowledgeFileList>
    {/if}
  </div>
</div>
