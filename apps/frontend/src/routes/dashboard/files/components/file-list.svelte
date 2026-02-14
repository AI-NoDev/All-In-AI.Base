<script lang="ts">
  import Icon from '@iconify/svelte';
  import { FileIcon } from '@qiyu-allinai/file-icons';
  import * as Table from '$lib/components/ui/table';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Badge } from '$lib/components/ui/badge';
  import FileContextMenu from './file-context-menu.svelte';
  import type { FolderItem, FileItem } from './types';

  interface Props {
    loading: boolean;
    folders: FolderItem[];
    files: FileItem[];
    currentFolderId: string | null;
    selectedFolderIds: Set<string>;
    selectedFileIds: Set<string>;
    onNavigateUp: () => void;
    onNavigateToFolder: (folder: FolderItem) => void;
    onToggleSelectAll: () => void;
    onToggleFolderSelect: (id: string) => void;
    onToggleFileSelect: (id: string) => void;
    onCopyFolder: (folder: FolderItem) => void;
    onCutFolder: (folder: FolderItem) => void;
    onRenameFolder: (folder: FolderItem) => void;
    onDeleteFolder: (folder: FolderItem) => void;
    onDownloadFolder: (folder: FolderItem) => void;
    onShowFolderInfo: (folder: FolderItem) => void;
    onEditFolderDescription: (folder: FolderItem) => void;
    onEditFolderStyle: (folder: FolderItem) => void;
    onEditFolderPermission: (folder: FolderItem) => void;
    onCopyFile: (file: FileItem) => void;
    onCutFile: (file: FileItem) => void;
    onRenameFile: (file: FileItem) => void;
    onDeleteFile: (file: FileItem) => void;
    onDownloadFile: (file: FileItem) => void;
    onShowFileInfo: (file: FileItem) => void;
    onEditFileDescription: (file: FileItem) => void;
    onEditFile: (file: FileItem) => void;
    onEditFilePermission: (file: FileItem) => void;
    onViewFileVersions: (file: FileItem) => void;
    onFileDoubleClick?: (file: FileItem) => void;
  }

  let {
    loading, folders, files, currentFolderId, selectedFolderIds, selectedFileIds,
    onNavigateUp, onNavigateToFolder, onToggleSelectAll, onToggleFolderSelect, onToggleFileSelect,
    onCopyFolder, onCutFolder, onRenameFolder, onDeleteFolder, onDownloadFolder,
    onShowFolderInfo, onEditFolderDescription, onEditFolderStyle, onEditFolderPermission,
    onCopyFile, onCutFile, onRenameFile, onDeleteFile, onDownloadFile,
    onShowFileInfo, onEditFileDescription, onEditFile, onEditFilePermission, onViewFileVersions,
    onFileDoubleClick,
  }: Props = $props();

  let hasSelection = $derived(selectedFolderIds.size > 0 || selectedFileIds.size > 0);
  let allSelected = $derived(
    (folders.length > 0 || files.length > 0) &&
    folders.every(f => selectedFolderIds.has(f.id)) &&
    files.every(f => selectedFileIds.has(f.id))
  );

  function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function getFolderIcon(folder: FolderItem): string { return folder.icon || 'tdesign:folder'; }
  function getFolderColor(folder: FolderItem): string { return folder.color || '#f59e0b'; }
</script>

{#if loading}
  <div class="space-y-3">
    {#each [1, 2, 3, 4, 5] as _}
      <Skeleton class="h-12 w-full" />
    {/each}
  </div>
{:else}
  <div class="flex flex-col flex-1 min-h-0">
    <div class="shrink-0">
      <Table.Root>
        <Table.Header class="bg-background">
          <Table.Row>
            <Table.Head class="w-8">
              <Checkbox checked={allSelected} indeterminate={hasSelection && !allSelected} onCheckedChange={onToggleSelectAll} />
            </Table.Head>
            <Table.Head class="text-left">名称</Table.Head>
            <Table.Head class="w-24 text-left">大小</Table.Head>
            <Table.Head class="w-40 text-left">修改时间</Table.Head>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </div>
    <div class="flex-1 min-h-0 overflow-auto">
        <Table.Root>
          <Table.Body>
          {#if currentFolderId !== null}
            <Table.Row class="cursor-pointer hover:bg-muted/50" onclick={onNavigateUp}>
              <Table.Cell></Table.Cell>
              <Table.Cell class="font-medium text-left">
                <span class="flex items-center gap-2">
                  <Icon icon="tdesign:folder" class="size-5 text-yellow-500 shrink-0" />
                  ..
                </span>
              </Table.Cell>
              <Table.Cell class="text-left">-</Table.Cell>
              <Table.Cell class="text-left">-</Table.Cell>
            </Table.Row>
          {/if}

          {#each folders as folder}
            <FileContextMenu type="folder" item={folder}
              onCopy={() => onCopyFolder(folder)} onCut={() => onCutFolder(folder)}
              onRename={() => onRenameFolder(folder)} onDelete={() => onDeleteFolder(folder)}
              onDownload={() => onDownloadFolder(folder)} onShowInfo={() => onShowFolderInfo(folder)}
              onEditDescription={() => onEditFolderDescription(folder)} onEditStyle={() => onEditFolderStyle(folder)}
              onEditPermission={() => onEditFolderPermission(folder)}>
              <Table.Row class="cursor-pointer hover:bg-muted/50 {selectedFolderIds.has(folder.id) ? 'bg-muted/50' : ''}">
                <Table.Cell class="w-8" onclick={(e: MouseEvent) => e.stopPropagation()}>
                  <Checkbox checked={selectedFolderIds.has(folder.id)} onCheckedChange={() => onToggleFolderSelect(folder.id)} />
                </Table.Cell>
                <Table.Cell class="font-medium text-left" onclick={() => onNavigateToFolder(folder)}>
                  <span class="flex items-center gap-2">
                    <Icon icon={getFolderIcon(folder)} class="size-5 shrink-0" style="color: {getFolderColor(folder)}" />
                    {folder.name}
                    {#if folder.isPublic}
                      <Badge variant="destructive" class="text-xs px-1.5 py-0">公开</Badge>
                    {/if}
                  </span>
                </Table.Cell>
                <Table.Cell class="text-left w-24" onclick={() => onNavigateToFolder(folder)}>-</Table.Cell>
                <Table.Cell class="text-muted-foreground text-left w-40" onclick={() => onNavigateToFolder(folder)}>
                  {new Date(folder.updatedAt || folder.createdAt).toLocaleString('zh-CN')}
                </Table.Cell>
              </Table.Row>
            </FileContextMenu>
          {/each}

          {#each files as file}
            <FileContextMenu type="file" item={file}
              onCopy={() => onCopyFile(file)} onCut={() => onCutFile(file)}
              onRename={() => onRenameFile(file)} onDelete={() => onDeleteFile(file)}
              onDownload={() => onDownloadFile(file)} onShowInfo={() => onShowFileInfo(file)}
              onEditDescription={() => onEditFileDescription(file)} onEdit={() => onEditFile(file)}
              onEditPermission={() => onEditFilePermission(file)}
              onViewVersions={() => onViewFileVersions(file)}>
              <Table.Row 
                class="hover:bg-muted/50 cursor-pointer {selectedFileIds.has(file.id) ? 'bg-muted/50' : ''}"
                ondblclick={() => onFileDoubleClick?.(file)}
              >
                <Table.Cell class="w-8" onclick={(e: MouseEvent) => e.stopPropagation()}>
                  <Checkbox checked={selectedFileIds.has(file.id)} onCheckedChange={() => onToggleFileSelect(file.id)} />
                </Table.Cell>
                <Table.Cell class="font-medium text-left">
                  <span class="flex items-center gap-2">
                    <FileIcon type={file.extension || 'unknown'} size={20} />
                    {file.name}
                    {#if file.versionCount > 0}
                      <span title="具备 {file.versionCount} 个版本">
                        <Icon icon="mdi:source-branch" class="size-4 text-blue-500" />
                      </span>
                    {/if}
                    {#if file.isPublic}
                      <Badge variant="destructive" class="text-xs px-1.5 py-0">公开</Badge>
                    {/if}
                  </span>
                </Table.Cell>
                <Table.Cell class="text-muted-foreground text-left w-24">{formatSize(file.size)}</Table.Cell>
                <Table.Cell class="text-muted-foreground text-left w-40">{new Date(file.updatedAt || file.createdAt).toLocaleString('zh-CN')}</Table.Cell>
              </Table.Row>
            </FileContextMenu>
          {/each}

          {#if folders.length === 0 && files.length === 0 && currentFolderId === null}
            <Table.Row>
              <Table.Cell colspan={4} class="h-24 text-center text-muted-foreground">暂无文件</Table.Cell>
            </Table.Row>
          {/if}
        </Table.Body>
        </Table.Root>
    </div>
  </div>
{/if}
