<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
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

  interface FavoriteFolder extends GenericFolder {
    isOwner?: boolean;
    permission?: 'read' | 'write' | 'manage' | 'none';
  }

  interface FavoriteFile extends GenericFile {
    isOwner?: boolean;
    permission?: 'read' | 'write' | 'manage' | 'none';
  }

  interface FavoriteItem {
    nodeId: string;
    type: 'folder' | 'file';
    name: string;
    parentId: string | null;
    icon?: string | null;
    color?: string | null;
    extension?: string | null;
    mimeType?: string | null;
    size?: number;
    createdAt: string;
  }

  let loading = $state(true);
  let folders = $state<FavoriteFolder[]>([]);
  let files = $state<FavoriteFile[]>([]);
  let pathStack = $state<PathItem[]>([{ id: null, name: '收藏' }]);
  let currentFolderId = $state<string | null>(null);
  let favoritedFolderIds = $state<Set<string>>(new Set());
  let favoritedFileIds = $state<Set<string>>(new Set());

  const api = authStore.createApi(true);

  async function loadData() {
    loading = true;
    try {
      if (currentFolderId === null) {
        const res = await api.knowledge.postApiKnowledgeFavoritesList({ limit: 100, offset: 0 });
        const items = (res.data?.data || []) as FavoriteItem[];
        folders = items.filter(i => i.type === 'folder').map(i => ({
          id: i.nodeId,
          name: i.name,
          parentId: i.parentId,
          icon: i.icon,
          color: i.color,
          createdAt: i.createdAt,
        })) as FavoriteFolder[];
        files = items.filter(i => i.type === 'file').map(i => ({
          id: i.nodeId,
          name: i.name,
          folderId: i.parentId,
          extension: i.extension,
          mimeType: i.mimeType,
          size: i.size || 0,
          createdAt: i.createdAt,
        })) as FavoriteFile[];
        favoritedFolderIds = new Set(folders.map(f => f.id));
        favoritedFileIds = new Set(files.map(f => f.id));
      } else {
        const res = await api.knowledge.getApiKnowledgeNodesByIdChildren({ id: currentFolderId });
        const nodes = res.data?.data || [];
        folders = nodes.filter((n: { type: string }) => n.type === 'folder').map((n: { id: string; name: string; parentId: string | null; icon?: string | null; color?: string | null; createdAt: string }) => ({
          id: n.id,
          name: n.name,
          parentId: n.parentId,
          icon: n.icon,
          color: n.color,
          createdAt: n.createdAt,
        })) as FavoriteFolder[];
        files = nodes.filter((n: { type: string }) => n.type === 'file').map((n: { id: string; name: string; parentId: string | null; extension?: string | null; mimeType?: string | null; size?: number; createdAt: string }) => ({
          id: n.id,
          name: n.name,
          folderId: n.parentId,
          extension: n.extension,
          mimeType: n.mimeType,
          size: n.size || 0,
          createdAt: n.createdAt,
        })) as FavoriteFile[];
        await loadFavoriteStatus();
      }
    } catch (err) {
      console.error('加载收藏数据失败:', err);
      folders = [];
      files = [];
    } finally {
      loading = false;
    }
  }

  async function loadFavoriteStatus() {
    const nodeIds = [...folders.map(f => f.id), ...files.map(f => f.id)];
    if (nodeIds.length === 0) {
      favoritedFolderIds = new Set();
      favoritedFileIds = new Set();
      return;
    }
    try {
      const res = await api.knowledge.postApiKnowledgeFavoritesCheck({ nodeIds });
      const favorites = res.data?.favorites || {};
      const favoritedIds = Object.entries(favorites).filter(([, v]) => v).map(([k]) => k);
      favoritedFolderIds = new Set(folders.filter(f => favoritedIds.includes(f.id)).map(f => f.id));
      favoritedFileIds = new Set(files.filter(f => favoritedIds.includes(f.id)).map(f => f.id));
    } catch (err) {
      console.error('加载收藏状态失败:', err);
    }
  }

  function navigateToFolder(folder: FavoriteFolder) {
    if (folder.permission === 'none') return;
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

  function handleFileClick(file: FavoriteFile) {
    if (file.permission === 'none') return;
    if (file.permission === 'write' || file.permission === 'manage' || file.isOwner) {
      goto(`/dashboard/knowledge/my-files/${file.folderId || 'root'}/edit/${file.id}`);
    } else {
      goto(`/dashboard/knowledge/my-files/${file.folderId || 'root'}/edit/${file.id}?readonly=true`);
    }
  }

  async function handleDownloadFile(file: FavoriteFile) {
    if (file.permission === 'none') return;
    try {
      const res = await api.knowledge.getApiKnowledgeNodesByIdDownloadUrl({ id: file.id });
      if (res.data?.url) {
        window.open(res.data.url, '_blank');
      }
    } catch (err) {
      console.error('获取下载链接失败:', err);
    }
  }

  async function handleToggleFolderFavorite(folder: FavoriteFolder) {
    try {
      const isFavorited = favoritedFolderIds.has(folder.id);
      if (isFavorited) {
        await api.knowledge.deleteApiKnowledgeFavoritesByNodeId({ nodeId: folder.id });
        const newSet = new Set(favoritedFolderIds);
        newSet.delete(folder.id);
        favoritedFolderIds = newSet;
        if (currentFolderId === null) {
          folders = folders.filter(f => f.id !== folder.id);
        }
      } else {
        await api.knowledge.postApiKnowledgeFavorites({ nodeId: folder.id });
        favoritedFolderIds = new Set([...favoritedFolderIds, folder.id]);
      }
    } catch (err) {
      console.error('切换收藏失败:', err);
    }
  }

  async function handleToggleFileFavorite(file: FavoriteFile) {
    try {
      const isFavorited = favoritedFileIds.has(file.id);
      if (isFavorited) {
        await api.knowledge.deleteApiKnowledgeFavoritesByNodeId({ nodeId: file.id });
        const newSet = new Set(favoritedFileIds);
        newSet.delete(file.id);
        favoritedFileIds = newSet;
        if (currentFolderId === null) {
          files = files.filter(f => f.id !== file.id);
        }
      } else {
        await api.knowledge.postApiKnowledgeFavorites({ nodeId: file.id });
        favoritedFileIds = new Set([...favoritedFileIds, file.id]);
      }
    } catch (err) {
      console.error('切换收藏失败:', err);
    }
  }

  function getPermissionLabel(permission: string | undefined): string {
    switch (permission) {
      case 'manage': return '管理';
      case 'write': return '编辑';
      case 'read': return '只读';
      case 'none': return '无权限';
      default: return '-';
    }
  }

  function getPermissionVariant(permission: string | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (permission) {
      case 'none': return 'destructive';
      case 'read': return 'secondary';
      default: return 'outline';
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
        <Icon icon="tdesign:star" class="size-16 mb-4 opacity-50" />
        <p class="text-lg">您还没有收藏任何文件</p>
        <p class="text-sm">在文件列表中点击星标即可收藏</p>
      </div>
    {:else}
      <KnowledgeFileList
        viewMode="favorites"
        {loading}
        {folders}
        {files}
        {currentFolderId}
        {favoritedFolderIds}
        {favoritedFileIds}
        onNavigateUp={navigateUp}
        onNavigateToFolder={navigateToFolder}
        onToggleFolderFavorite={handleToggleFolderFavorite}
        onToggleFileFavorite={handleToggleFileFavorite}
        onDownloadFile={handleDownloadFile}
        onFileDoubleClick={handleFileClick}
      >
        {#snippet extraHeaderColumns()}
          {#if currentFolderId === null}
            <Table.Head class="text-left w-20">来源</Table.Head>
            <Table.Head class="text-left w-20">权限</Table.Head>
          {/if}
        {/snippet}
        {#snippet extraFolderColumns(folder)}
          {#if currentFolderId === null}
            <Table.Cell class="text-sm">
              {#if folder.isOwner}
                <Badge variant="outline">我的</Badge>
              {:else}
                <Badge variant="secondary">共享</Badge>
              {/if}
            </Table.Cell>
            <Table.Cell class="text-sm">
              <Badge variant={getPermissionVariant(folder.permission)}>{getPermissionLabel(folder.permission)}</Badge>
            </Table.Cell>
          {/if}
        {/snippet}
        {#snippet extraFileColumns(file)}
          {#if currentFolderId === null}
            <Table.Cell class="text-sm">
              {#if file.isOwner}
                <Badge variant="outline">我的</Badge>
              {:else}
                <Badge variant="secondary">共享</Badge>
              {/if}
            </Table.Cell>
            <Table.Cell class="text-sm">
              <Badge variant={getPermissionVariant(file.permission)}>{getPermissionLabel(file.permission)}</Badge>
            </Table.Cell>
          {/if}
        {/snippet}
        {#snippet folderActions(folder)}
          <Button variant="ghost" size="sm" onclick={() => handleToggleFolderFavorite(folder)}>
            <Icon icon={favoritedFolderIds.has(folder.id) ? 'tdesign:star-filled' : 'tdesign:star'} class="size-4 {favoritedFolderIds.has(folder.id) ? 'text-yellow-500' : ''}" />
          </Button>
        {/snippet}
        {#snippet fileActions(file)}
          <Button variant="ghost" size="sm" onclick={() => handleToggleFileFavorite(file)}>
            <Icon icon={favoritedFileIds.has(file.id) ? 'tdesign:star-filled' : 'tdesign:star'} class="size-4 {favoritedFileIds.has(file.id) ? 'text-yellow-500' : ''}" />
          </Button>
        {/snippet}
      </KnowledgeFileList>
    {/if}
  </div>
</div>
