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
    PermissionSheet,
    type GenericFolder,
    type GenericFile,
    type PermissionGrantee,
  } from '../components';

  interface PathItem {
    id: string | null;
    name: string;
  }

  let loading = $state(true);
  let folders = $state<GenericFolder[]>([]);
  let files = $state<GenericFile[]>([]);
  let pathStack = $state<PathItem[]>([{ id: null, name: '我的共享' }]);
  let currentFolderId = $state<string | null>(null);
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
      if (currentFolderId === null) {
        const res = await api.files.postApiFilesShareMyShared({ limit: 100, offset: 0 });
        folders = (res.data?.folders || []) as GenericFolder[];
        files = (res.data?.files || []) as GenericFile[];
      } else {
        const res = await api.files.postApiFilesShareFolderContents({
          folderId: currentFolderId,
          viewMode: 'my-shared',
          limit: 100,
          offset: 0,
        });
        folders = (res.data?.folders || []) as GenericFolder[];
        files = (res.data?.files || []) as GenericFile[];
      }
    } catch (err) {
      console.error('加载我的共享数据失败:', err);
      folders = [];
      files = [];
    } finally {
      loading = false;
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

  function getSharedCount(sharedTo?: Array<{ subjectType: string; subjectId: string; permission: string }>): string {
    const count = sharedTo?.length || 0;
    return count > 0 ? `${count} 人/角色` : '未共享';
  }

  function handleEditFolderPermission(folder: GenericFolder) {
    permissionTarget = { type: 'folder', id: folder.id, name: folder.name, isPublic: folder.isPublic || false };
    permissionSheetOpen = true;
  }

  function handleEditFilePermission(file: GenericFile) {
    permissionTarget = { type: 'file', id: file.id, name: file.name, isPublic: file.isPublic || false };
    permissionSheetOpen = true;
  }

  function handleFileClick(file: GenericFile) {
    // 我的共享文件，自己是所有者，可以编辑
    goto(`/dashboard/knowledge/my-files/${file.folderId || 'root'}/edit/${file.id}`);
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
    <FileBreadcrumb {pathStack} onNavigate={navigateToPath} />
    <Button variant="ghost" size="sm" onclick={loadData}>
      <Icon icon="tdesign:refresh" class="size-4" />
    </Button>
  </div>

  <div class="flex-1 flex flex-col min-h-0">
    {#if !loading && folders.length === 0 && files.length === 0 && currentFolderId === null}
      <div class="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <Icon icon="tdesign:share" class="size-16 mb-4 opacity-50" />
        <p class="text-lg">您还没有共享任何文件</p>
        <p class="text-sm">在"我的知识库"中选择文件，点击共享按钮即可共享</p>
      </div>
    {:else}
      <KnowledgeFileList
        viewMode="my-shared"
        {loading}
        {folders}
        {files}
        {currentFolderId}
        onNavigateUp={navigateUp}
        onNavigateToFolder={navigateToFolder}
        onEditFolderPermission={handleEditFolderPermission}
        onEditFilePermission={handleEditFilePermission}
        onFileDoubleClick={handleFileClick}
      >
        {#snippet extraHeaderColumns()}
          {#if currentFolderId === null}
            <Table.Head class="text-left">共享给</Table.Head>
          {/if}
        {/snippet}
        {#snippet extraFolderColumns(folder)}
          {#if currentFolderId === null}
            <Table.Cell class="text-sm text-muted-foreground">{getSharedCount(folder.sharedTo)}</Table.Cell>
          {/if}
        {/snippet}
        {#snippet extraFileColumns(file)}
          {#if currentFolderId === null}
            <Table.Cell class="text-sm text-muted-foreground">{getSharedCount(file.sharedTo)}</Table.Cell>
          {/if}
        {/snippet}
        {#snippet folderActions(folder)}
          <Button variant="ghost" size="sm" onclick={() => handleEditFolderPermission(folder)}>
            <Icon icon="tdesign:setting" class="size-4" />
          </Button>
        {/snippet}
        {#snippet fileActions(file)}
          <Button variant="ghost" size="sm" onclick={() => handleEditFilePermission(file)}>
            <Icon icon="tdesign:setting" class="size-4" />
          </Button>
        {/snippet}
      </KnowledgeFileList>
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
