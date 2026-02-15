<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Skeleton } from '@qiyu-allinai/ui/components/skeleton';
  import { FileIcon } from '@qiyu-allinai/file-icons';

  interface FavoriteFolder {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    isPublic: boolean;
    createdAt: string;
  }

  interface FavoriteFile {
    id: string;
    name: string;
    folderId: string | null;
    extension: string | null;
    mimeType: string | null;
    size: number;
    isPublic: boolean;
    createdAt: string;
  }

  let loading = $state(true);
  let folders = $state<FavoriteFolder[]>([]);
  let files = $state<FavoriteFile[]>([]);

  const api = authStore.createApi(true);

  async function loadData() {
    loading = true;
    try {
      const res = await api.knowledge.postApiKnowledgeFavoriteList({ resourceType: 'all', limit: 100, offset: 0 });
      folders = (res.data?.folders || []) as FavoriteFolder[];
      files = (res.data?.files || []) as FavoriteFile[];
    } catch (err) {
      console.error('加载收藏数据失败:', err);
      folders = [];
      files = [];
    } finally {
      loading = false;
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  function handleFolderClick(folder: FavoriteFolder) {
    // 导航到文件夹（在我的知识库中打开）
    goto(`/dashboard/knowledge/my-files?folderId=${folder.id}`);
  }

  function handleFileClick(file: FavoriteFile) {
    goto(`/dashboard/knowledge/my-files/${file.folderId || 'root'}/edit/${file.id}`);
  }

  async function handleRemoveFavorite(type: 'folder' | 'file', id: string) {
    try {
      await api.knowledge.deleteApiKnowledgeFavoriteByResourceTypeByResourceId({ resourceType: type, resourceId: id });
      await loadData();
    } catch (err) {
      console.error('取消收藏失败:', err);
    }
  }

  onMount(() => loadData());
</script>

<div class="px-4 lg:px-6 flex-1 flex flex-col min-h-0">
  <div class="flex items-center justify-between py-2 border-b mb-2">
    <h2 class="text-lg font-medium">收藏</h2>
    <Button variant="ghost" size="sm" onclick={loadData}>
      <Icon icon="tdesign:refresh" class="size-4" />
    </Button>
  </div>

  <div class="flex-1 overflow-auto">
    {#if loading}
      <div class="space-y-2 p-4">
        {#each Array(5) as _}
          <Skeleton class="h-12 w-full" />
        {/each}
      </div>
    {:else if folders.length === 0 && files.length === 0}
      <div class="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Icon icon="tdesign:star" class="size-16 mb-4 opacity-50" />
        <p class="text-lg">您还没有收藏任何文件</p>
        <p class="text-sm">在文件列表中点击星标即可收藏</p>
      </div>
    {:else}
      <table class="w-full">
        <thead class="sticky top-0 bg-background border-b">
          <tr class="text-left text-sm text-muted-foreground">
            <th class="p-2 font-medium">名称</th>
            <th class="p-2 font-medium">大小</th>
            <th class="p-2 font-medium">创建时间</th>
            <th class="p-2 font-medium w-20">操作</th>
          </tr>
        </thead>
        <tbody>
          {#each folders as folder}
            <tr class="border-b hover:bg-muted/50 cursor-pointer" onclick={() => handleFolderClick(folder)}>
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <Icon icon={folder.icon || 'tdesign:folder'} class="size-5" style={folder.color ? `color: ${folder.color}` : ''} />
                  <span class="truncate">{folder.name}</span>
                  {#if folder.isPublic}
                    <Icon icon="tdesign:earth" class="size-4 text-muted-foreground" title="公开" />
                  {/if}
                </div>
              </td>
              <td class="p-2 text-sm text-muted-foreground">-</td>
              <td class="p-2 text-sm text-muted-foreground">{formatDate(folder.createdAt)}</td>
              <td class="p-2">
                <Button variant="ghost" size="sm" onclick={(e: MouseEvent) => { e.stopPropagation(); handleRemoveFavorite('folder', folder.id); }}>
                  <Icon icon="tdesign:star-filled" class="size-4 text-yellow-500" />
                </Button>
              </td>
            </tr>
          {/each}
          {#each files as file}
            <tr class="border-b hover:bg-muted/50 cursor-pointer" onclick={() => handleFileClick(file)}>
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <FileIcon filename={file.name} class="size-5" />
                  <span class="truncate">{file.name}</span>
                  {#if file.isPublic}
                    <Icon icon="tdesign:earth" class="size-4 text-muted-foreground" title="公开" />
                  {/if}
                </div>
              </td>
              <td class="p-2 text-sm text-muted-foreground">{formatSize(file.size)}</td>
              <td class="p-2 text-sm text-muted-foreground">{formatDate(file.createdAt)}</td>
              <td class="p-2">
                <Button variant="ghost" size="sm" onclick={(e: MouseEvent) => { e.stopPropagation(); handleRemoveFavorite('file', file.id); }}>
                  <Icon icon="tdesign:star-filled" class="size-4 text-yellow-500" />
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
