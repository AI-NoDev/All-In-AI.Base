<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Skeleton } from '@qiyu-allinai/ui/components/skeleton';
  import { FileIcon } from '@qiyu-allinai/file-icons';
  import { PermissionSheet, type PermissionGrantee } from '../components';

  interface SharedToInfo {
    subjectType: string;
    subjectId: string;
    permission: string;
  }

  interface MySharedFolder {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
    isPublic: boolean;
    createdAt: string;
    sharedTo: SharedToInfo[];
  }

  interface MySharedFile {
    id: string;
    name: string;
    folderId: string | null;
    extension: string | null;
    mimeType: string | null;
    size: number;
    isPublic: boolean;
    createdAt: string;
    sharedTo: SharedToInfo[];
  }

  let loading = $state(true);
  let folders = $state<MySharedFolder[]>([]);
  let files = $state<MySharedFile[]>([]);
  let permissionSheetOpen = $state(false);

  interface PermissionTarget {
    type: 'folder' | 'file';
    id: string;
    name: string;
    isPublic: boolean;
  }
  let permissionTarget = $state<PermissionTarget | null>(null);

  const api = authStore.createApi(true);

  async function loadData() {
    loading = true;
    try {
      const res = await api.files.postApiFilesShareMyShared({ limit: 100, offset: 0 });
      folders = (res.data?.folders || []) as MySharedFolder[];
      files = (res.data?.files || []) as MySharedFile[];
    } catch (err) {
      console.error('加载我的共享数据失败:', err);
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

  function getSharedCount(sharedTo: SharedToInfo[]): string {
    const count = sharedTo?.length || 0;
    return count > 0 ? `${count} 人/角色` : '未共享';
  }

  function handleEditFolderPermission(folder: MySharedFolder) {
    permissionTarget = { type: 'folder', id: folder.id, name: folder.name, isPublic: folder.isPublic };
    permissionSheetOpen = true;
  }

  function handleEditFilePermission(file: MySharedFile) {
    permissionTarget = { type: 'file', id: file.id, name: file.name, isPublic: file.isPublic };
    permissionSheetOpen = true;
  }

  async function handleSavePermission(isPublic: boolean, permissions: PermissionGrantee[]) {
    if (!permissionTarget) return;
    try {
      if (permissionTarget.type === 'folder') {
        await api.knowledge.putApiKnowledgeFolderById({ id: permissionTarget.id }, { data: { isPublic, updatedBy: '' } });
      } else {
        await api.knowledge.putApiKnowledgeFileById({ id: permissionTarget.id }, { data: { isPublic, updatedBy: '' } });
      }
      await api.files.postApiFilesPermissionByResourceTypeByResourceId(
        { resourceType: permissionTarget.type, resourceId: permissionTarget.id },
        { permissions: permissions.map(p => ({ subjectType: p.subjectType, subjectId: p.subjectId, permission: p.permission, effect: p.effect })) }
      );
      permissionSheetOpen = false;
      permissionTarget = null;
      await loadData();
    } catch (err) {
      console.error('保存权限失败:', err);
    }
  }

  onMount(() => loadData());
</script>

<div class="px-4 lg:px-6 flex-1 flex flex-col min-h-0">
  <div class="flex items-center justify-between py-2 border-b mb-2">
    <h2 class="text-lg font-medium">我的共享</h2>
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
        <Icon icon="tdesign:share" class="size-16 mb-4 opacity-50" />
        <p class="text-lg">您还没有共享任何文件</p>
        <p class="text-sm">在"我的知识库"中选择文件，点击共享按钮即可共享</p>
      </div>
    {:else}
      <table class="w-full">
        <thead class="sticky top-0 bg-background border-b">
          <tr class="text-left text-sm text-muted-foreground">
            <th class="p-2 font-medium">名称</th>
            <th class="p-2 font-medium">共享给</th>
            <th class="p-2 font-medium">大小</th>
            <th class="p-2 font-medium">创建时间</th>
            <th class="p-2 font-medium w-20">操作</th>
          </tr>
        </thead>
        <tbody>
          {#each folders as folder}
            <tr class="border-b hover:bg-muted/50">
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <Icon icon={folder.icon || 'tdesign:folder'} class="size-5" style={folder.color ? `color: ${folder.color}` : ''} />
                  <span class="truncate">{folder.name}</span>
                  {#if folder.isPublic}
                    <Icon icon="tdesign:earth" class="size-4 text-muted-foreground" title="公开" />
                  {/if}
                </div>
              </td>
              <td class="p-2 text-sm text-muted-foreground">{getSharedCount(folder.sharedTo)}</td>
              <td class="p-2 text-sm text-muted-foreground">-</td>
              <td class="p-2 text-sm text-muted-foreground">{formatDate(folder.createdAt)}</td>
              <td class="p-2">
                <Button variant="ghost" size="sm" onclick={() => handleEditFolderPermission(folder)}>
                  <Icon icon="tdesign:setting" class="size-4" />
                </Button>
              </td>
            </tr>
          {/each}
          {#each files as file}
            <tr class="border-b hover:bg-muted/50">
              <td class="p-2">
                <div class="flex items-center gap-2">
                  <FileIcon filename={file.name} class="size-5" />
                  <span class="truncate">{file.name}</span>
                  {#if file.isPublic}
                    <Icon icon="tdesign:earth" class="size-4 text-muted-foreground" title="公开" />
                  {/if}
                </div>
              </td>
              <td class="p-2 text-sm text-muted-foreground">{getSharedCount(file.sharedTo)}</td>
              <td class="p-2 text-sm text-muted-foreground">{formatSize(file.size)}</td>
              <td class="p-2 text-sm text-muted-foreground">{formatDate(file.createdAt)}</td>
              <td class="p-2">
                <Button variant="ghost" size="sm" onclick={() => handleEditFilePermission(file)}>
                  <Icon icon="tdesign:setting" class="size-4" />
                </Button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<PermissionSheet
  open={permissionSheetOpen}
  onOpenChange={(o: boolean) => (permissionSheetOpen = o)}
  resourceType={permissionTarget?.type || 'folder'}
  resourceId={permissionTarget?.id || ''}
  resourceName={permissionTarget?.name || ''}
  isPublic={permissionTarget?.isPublic || false}
  onSave={handleSavePermission}
/>
