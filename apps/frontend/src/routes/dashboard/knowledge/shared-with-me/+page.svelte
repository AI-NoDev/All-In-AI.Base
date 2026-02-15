<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Skeleton } from '@qiyu-allinai/ui/components/skeleton';
  import { FileIcon } from '@qiyu-allinai/file-icons';

  interface SharedFolder {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    isPublic: boolean;
    createdAt: string;
    sharedBy: string | null;
    permission: string;
  }

  interface SharedFile {
    id: string;
    name: string;
    folderId: string | null;
    extension: string | null;
    mimeType: string | null;
    size: number;
    isPublic: boolean;
    createdAt: string;
    sharedBy: string | null;
    permission: string;
  }

  let loading = $state(true);
  let folders = $state<SharedFolder[]>([]);
  let files = $state<SharedFile[]>([]);

  const api = authStore.createApi(true);

  async function loadData() {
    loading = true;
    try {
      const res = await api.files.postApiFilesShareSharedWithMe({ limit: 100, offset: 0 });
      folders = (res.data?.folders || []) as SharedFolder[];
      files = (res.data?.files || []) as SharedFile[];
    } catch (err) {
      console.error('加载共享数据失败:', err);
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

  function handleFolderClick(folder: SharedFolder) {
    // 根据权限决定是否可以进入文件夹
    console.log('点击共享文件夹', folder.name, '权限:', folder.permission);
  }

  function handleFileClick(file: SharedFile) {
    // 根据权限决定是否可以编辑
    if (file.permission === 'write') {
      goto(`/dashboard/knowledge/shared-with-me/edit/${file.id}`);
    } else {
      goto(`/dashboard/knowledge/shared-with-me/view/${file.id}`);
    }
  }

  onMount(() => loadData());
</script>

<div class="px-4 lg:px-6 flex-1 flex flex-col min-h-0">
  <div class="flex items-center justify-between py-2 border-b mb-2">
    <h2 class="text-lg font-medium">收到的共享</h2>
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
        <Icon icon="tdesign:user-transmit" class="size-16 mb-4 opacity-50" />
        <p class="text-lg">还没有人与您共享文件</p>
        <p class="text-sm">当有人共享文件给您时，会显示在这里</p>
      </div>
    {:else}
      <table class="w-full">
        <thead class="sticky top-0 bg-background border-b">
          <tr class="text-left text-sm text-muted-foreground">
            <th class="p-2 font-medium">名称</th>
            <th class="p-2 font-medium">共享者</th>
            <th class="p-2 font-medium">权限</th>
            <th class="p-2 font-medium">大小</th>
            <th class="p-2 font-medium">共享时间</th>
          </tr>
        </thead>
        <tbody>
          {#each folders as folder}
            <tr class="border-b hover:bg-muted/50 cursor-pointer" onclick={() => handleFolderClick(folder)}>
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <Icon icon={folder.icon || 'tdesign:folder'} class="size-5" style={folder.color ? `color: ${folder.color}` : ''} />
                  <span class="truncate">{folder.name}</span>
                </div>
              </td>
              <td class="p-2 text-sm text-muted-foreground">{folder.sharedBy || '-'}</td>
              <td class="p-2 text-sm">
                <span class="px-2 py-0.5 rounded bg-muted text-xs">{folder.permission === 'write' ? '可编辑' : '只读'}</span>
              </td>
              <td class="p-2 text-sm text-muted-foreground">-</td>
              <td class="p-2 text-sm text-muted-foreground">{formatDate(folder.createdAt)}</td>
            </tr>
          {/each}
          {#each files as file}
            <tr class="border-b hover:bg-muted/50 cursor-pointer" onclick={() => handleFileClick(file)}>
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <FileIcon filename={file.name} class="size-5" />
                  <span class="truncate">{file.name}</span>
                </div>
              </td>
              <td class="p-2 text-sm text-muted-foreground">{file.sharedBy || '-'}</td>
              <td class="p-2 text-sm">
                <span class="px-2 py-0.5 rounded bg-muted text-xs">{file.permission === 'write' ? '可编辑' : '只读'}</span>
              </td>
              <td class="p-2 text-sm text-muted-foreground">{formatSize(file.size)}</td>
              <td class="p-2 text-sm text-muted-foreground">{formatDate(file.createdAt)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>
