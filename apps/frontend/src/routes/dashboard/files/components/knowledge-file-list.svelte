<script lang="ts">
  import Icon from '@iconify/svelte';
  import { FileIcon } from '@qiyu-allinai/file-icons';
  import * as Table from '$lib/components/ui/table';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import FileContextMenu from './file-context-menu.svelte';
  import { t } from '$lib/stores/i18n.svelte';
  import type { Snippet } from 'svelte';

  // 视图模式
  export type ViewMode = 'my-files' | 'shared-with-me' | 'my-shared' | 'favorites';

  // 通用文件夹类型
  export interface GenericFolder {
    id: string;
    name: string;
    parentId?: string | null;
    icon?: string | null;
    color?: string | null;
    isPublic?: boolean;
    createdAt: string;
    updatedAt?: string;
    // 共享相关
    sharedBy?: string | null;
    permission?: string;
    sharedTo?: Array<{ subjectType: string; subjectId: string; permission: string }>;
  }

  // 通用文件类型
  export interface GenericFile {
    id: string;
    name: string;
    folderId?: string | null;
    extension?: string | null;
    mimeType?: string | null;
    size: number;
    description?: string | null;
    isPublic?: boolean;
    versionCount?: number;
    createdAt: string;
    updatedAt?: string;
    // 共享相关
    sharedBy?: string | null;
    permission?: string;
    sharedTo?: Array<{ subjectType: string; subjectId: string; permission: string }>;
  }

  // 权限配置
  export interface ViewPermissions {
    canSelect: boolean;
    canNavigate: boolean;
    canCopy: boolean;
    canCut: boolean;
    canRename: boolean;
    canDelete: boolean;
    canDownload: boolean;
    canShowInfo: boolean;
    canEditDescription: boolean;
    canEditStyle: boolean;
    canEditPermission: boolean;
    canFavorite: boolean;
    canViewVersions: boolean;
    canEdit: boolean;
  }

  // 默认权限配置
  const DEFAULT_PERMISSIONS: Record<ViewMode, ViewPermissions> = {
    'my-files': {
      canSelect: true, canNavigate: true, canCopy: true, canCut: true,
      canRename: true, canDelete: true, canDownload: true, canShowInfo: true,
      canEditDescription: true, canEditStyle: true, canEditPermission: true,
      canFavorite: true, canViewVersions: true, canEdit: true,
    },
    'shared-with-me': {
      canSelect: false, canNavigate: true, canCopy: false, canCut: false,
      canRename: false, canDelete: false, canDownload: true, canShowInfo: true,
      canEditDescription: false, canEditStyle: false, canEditPermission: false,
      canFavorite: true, canViewVersions: false, canEdit: false, // 根据 permission 动态判断
    },
    'my-shared': {
      canSelect: false, canNavigate: true, canCopy: false, canCut: false,
      canRename: false, canDelete: false, canDownload: true, canShowInfo: true,
      canEditDescription: false, canEditStyle: false, canEditPermission: true,
      canFavorite: true, canViewVersions: false, canEdit: false,
    },
    'favorites': {
      canSelect: false, canNavigate: true, canCopy: false, canCut: false,
      canRename: false, canDelete: false, canDownload: true, canShowInfo: true,
      canEditDescription: false, canEditStyle: false, canEditPermission: false,
      canFavorite: true, canViewVersions: false, canEdit: false,
    },
  };

  interface Props {
    viewMode: ViewMode;
    loading: boolean;
    folders: GenericFolder[];
    files: GenericFile[];
    currentFolderId: string | null;
    selectedFolderIds?: Set<string>;
    selectedFileIds?: Set<string>;
    favoritedFolderIds?: Set<string>;
    favoritedFileIds?: Set<string>;
    permissions?: Partial<ViewPermissions>;
    // 额外列 slot
    extraHeaderColumns?: Snippet;
    extraFolderColumns?: Snippet<[GenericFolder]>;
    extraFileColumns?: Snippet<[GenericFile]>;
    // 操作列 slot
    folderActions?: Snippet<[GenericFolder]>;
    fileActions?: Snippet<[GenericFile]>;
    // 事件
    onNavigateUp?: () => void;
    onNavigateToFolder?: (folder: GenericFolder) => void;
    onToggleSelectAll?: () => void;
    onToggleFolderSelect?: (id: string) => void;
    onToggleFileSelect?: (id: string) => void;
    onCopyFolder?: (folder: GenericFolder) => void;
    onCutFolder?: (folder: GenericFolder) => void;
    onRenameFolder?: (folder: GenericFolder) => void;
    onDeleteFolder?: (folder: GenericFolder) => void;
    onDownloadFolder?: (folder: GenericFolder) => void;
    onShowFolderInfo?: (folder: GenericFolder) => void;
    onEditFolderDescription?: (folder: GenericFolder) => void;
    onEditFolderStyle?: (folder: GenericFolder) => void;
    onEditFolderPermission?: (folder: GenericFolder) => void;
    onToggleFolderFavorite?: (folder: GenericFolder) => void;
    onCopyFile?: (file: GenericFile) => void;
    onCutFile?: (file: GenericFile) => void;
    onRenameFile?: (file: GenericFile) => void;
    onDeleteFile?: (file: GenericFile) => void;
    onDownloadFile?: (file: GenericFile) => void;
    onShowFileInfo?: (file: GenericFile) => void;
    onEditFileDescription?: (file: GenericFile) => void;
    onEditFile?: (file: GenericFile) => void;
    onEditFilePermission?: (file: GenericFile) => void;
    onViewFileVersions?: (file: GenericFile) => void;
    onToggleFileFavorite?: (file: GenericFile) => void;
    onFileDoubleClick?: (file: GenericFile) => void;
  }

  let {
    viewMode, loading, folders, files, currentFolderId,
    selectedFolderIds = new Set(), selectedFileIds = new Set(),
    favoritedFolderIds = new Set(), favoritedFileIds = new Set(),
    permissions: customPermissions,
    extraHeaderColumns, extraFolderColumns, extraFileColumns,
    folderActions, fileActions,
    onNavigateUp, onNavigateToFolder, onToggleSelectAll, onToggleFolderSelect, onToggleFileSelect,
    onCopyFolder, onCutFolder, onRenameFolder, onDeleteFolder, onDownloadFolder,
    onShowFolderInfo, onEditFolderDescription, onEditFolderStyle, onEditFolderPermission, onToggleFolderFavorite,
    onCopyFile, onCutFile, onRenameFile, onDeleteFile, onDownloadFile,
    onShowFileInfo, onEditFileDescription, onEditFile, onEditFilePermission, onViewFileVersions, onToggleFileFavorite,
    onFileDoubleClick,
  }: Props = $props();

  // 合并权限配置
  let perms = $derived({ ...DEFAULT_PERMISSIONS[viewMode], ...customPermissions });

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

  function getFolderIcon(folder: GenericFolder): string { return folder.icon || 'tdesign:folder'; }
  function getFolderColor(folder: GenericFolder): string { return folder.color || '#f59e0b'; }

  // 检查文件是否可编辑（对于 shared-with-me 模式）
  function canEditFile(file: GenericFile): boolean {
    if (viewMode === 'shared-with-me') {
      return file.permission === 'write';
    }
    return perms.canEdit;
  }
</script>

{#if loading}
  <div class="space-y-3">
    {#each [1, 2, 3, 4, 5] as _}
      <Skeleton class="h-12 w-full" />
    {/each}
  </div>
{:else}
  <div class="flex flex-col flex-1 min-h-0">
    <ScrollArea class="h-full">
      <Table.Root>
        <Table.Header class="sticky top-0 bg-muted/50 z-10">
          <Table.Row>
            {#if perms.canSelect}
              <Table.Head class="w-8">
                <Checkbox checked={allSelected} indeterminate={hasSelection && !allSelected} onCheckedChange={onToggleSelectAll} />
              </Table.Head>
            {/if}
            <Table.Head class="text-left">{t('page.knowledge.name')}</Table.Head>
            {#if extraHeaderColumns}
              {@render extraHeaderColumns()}
            {/if}
            <Table.Head class="w-24 text-left">{t('page.knowledge.size')}</Table.Head>
            <Table.Head class="w-40 text-left">{t('page.knowledge.modifiedTime')}</Table.Head>
            {#if folderActions || fileActions || perms.canShowInfo}
              <Table.Head class="w-20 text-center">{t('page.knowledge.actions')}</Table.Head>
            {/if}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#if currentFolderId !== null && perms.canNavigate}
            <Table.Row class="cursor-pointer hover:bg-muted/50" onclick={onNavigateUp}>
              {#if perms.canSelect}<Table.Cell></Table.Cell>{/if}
              <Table.Cell class="font-medium text-left">
                <span class="flex items-center gap-2">
                  <Icon icon="tdesign:folder" class="size-5 text-yellow-500 shrink-0" />
                  ..
                </span>
              </Table.Cell>
              {#if extraHeaderColumns}<Table.Cell colspan={2}></Table.Cell>{/if}
              <Table.Cell class="text-left">-</Table.Cell>
              <Table.Cell class="text-left">-</Table.Cell>
              {#if folderActions || fileActions || perms.canShowInfo}<Table.Cell></Table.Cell>{/if}
            </Table.Row>
          {/if}

          {#each folders as folder}
            <FileContextMenu type="folder" item={folder}
              isFavorited={favoritedFolderIds.has(folder.id)}
              onCopy={perms.canCopy ? () => onCopyFolder?.(folder) : undefined}
              onCut={perms.canCut ? () => onCutFolder?.(folder) : undefined}
              onRename={perms.canRename ? () => onRenameFolder?.(folder) : undefined}
              onDelete={perms.canDelete ? () => onDeleteFolder?.(folder) : undefined}
              onDownload={perms.canDownload ? () => onDownloadFolder?.(folder) : undefined}
              onShowInfo={perms.canShowInfo ? () => onShowFolderInfo?.(folder) : undefined}
              onEditDescription={perms.canEditDescription ? () => onEditFolderDescription?.(folder) : undefined}
              onEditStyle={perms.canEditStyle ? () => onEditFolderStyle?.(folder) : undefined}
              onEditPermission={perms.canEditPermission ? () => onEditFolderPermission?.(folder) : undefined}
              onToggleFavorite={perms.canFavorite ? () => onToggleFolderFavorite?.(folder) : undefined}>
              <Table.Row class="cursor-pointer hover:bg-muted/50 {selectedFolderIds.has(folder.id) ? 'bg-muted/50' : ''}">
                {#if perms.canSelect}
                  <Table.Cell class="w-8" onclick={(e: MouseEvent) => e.stopPropagation()}>
                    <Checkbox checked={selectedFolderIds.has(folder.id)} onCheckedChange={() => onToggleFolderSelect?.(folder.id)} />
                  </Table.Cell>
                {/if}
                <Table.Cell class="font-medium text-left" onclick={() => perms.canNavigate && onNavigateToFolder?.(folder)}>
                  <span class="flex items-center gap-2">
                    <Icon icon={getFolderIcon(folder)} class="size-5 shrink-0" style="color: {getFolderColor(folder)}" />
                    {folder.name}
                    {#if favoritedFolderIds.has(folder.id)}
                      <Icon icon="tdesign:star-filled" class="size-4 text-yellow-500" />
                    {/if}
                    {#if folder.isPublic}
                      <Badge variant="destructive" class="text-xs px-1.5 py-0">{t('page.knowledge.public')}</Badge>
                    {/if}
                  </span>
                </Table.Cell>
                {#if extraFolderColumns}
                  {@render extraFolderColumns(folder)}
                {/if}
                <Table.Cell class="text-left w-24" onclick={() => perms.canNavigate && onNavigateToFolder?.(folder)}>-</Table.Cell>
                <Table.Cell class="text-muted-foreground text-left w-40" onclick={() => perms.canNavigate && onNavigateToFolder?.(folder)}>
                  {new Date(folder.updatedAt || folder.createdAt).toLocaleString('zh-CN')}
                </Table.Cell>
                {#if folderActions || fileActions || perms.canShowInfo}
                  <Table.Cell class="w-20 text-center" onclick={(e: MouseEvent) => e.stopPropagation()}>
                    {#if folderActions}
                      {@render folderActions(folder)}
                    {:else if perms.canShowInfo}
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          <Button variant="ghost" size="icon" class="size-8" onclick={() => onShowFolderInfo?.(folder)}>
                            <Icon icon="tdesign:file-setting" class="size-4" />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>{t('page.knowledge.viewDetails')}</Tooltip.Content>
                      </Tooltip.Root>
                    {/if}
                  </Table.Cell>
                {/if}
              </Table.Row>
            </FileContextMenu>
          {/each}

          {#each files as file}
            <FileContextMenu type="file" item={file}
              isFavorited={favoritedFileIds.has(file.id)}
              onCopy={perms.canCopy ? () => onCopyFile?.(file) : undefined}
              onCut={perms.canCut ? () => onCutFile?.(file) : undefined}
              onRename={perms.canRename ? () => onRenameFile?.(file) : undefined}
              onDelete={perms.canDelete ? () => onDeleteFile?.(file) : undefined}
              onDownload={perms.canDownload ? () => onDownloadFile?.(file) : undefined}
              onShowInfo={perms.canShowInfo ? () => onShowFileInfo?.(file) : undefined}
              onEditDescription={perms.canEditDescription ? () => onEditFileDescription?.(file) : undefined}
              onEdit={canEditFile(file) ? () => onEditFile?.(file) : undefined}
              onEditPermission={perms.canEditPermission ? () => onEditFilePermission?.(file) : undefined}
              onViewVersions={perms.canViewVersions ? () => onViewFileVersions?.(file) : undefined}
              onToggleFavorite={perms.canFavorite ? () => onToggleFileFavorite?.(file) : undefined}>
              <Table.Row 
                class="hover:bg-muted/50 cursor-pointer {selectedFileIds.has(file.id) ? 'bg-muted/50' : ''}"
                ondblclick={() => onFileDoubleClick?.(file)}
              >
                {#if perms.canSelect}
                  <Table.Cell class="w-8" onclick={(e: MouseEvent) => e.stopPropagation()}>
                    <Checkbox checked={selectedFileIds.has(file.id)} onCheckedChange={() => onToggleFileSelect?.(file.id)} />
                  </Table.Cell>
                {/if}
                <Table.Cell class="font-medium text-left">
                  <span class="flex items-center gap-2">
                    <FileIcon type={file.extension || 'unknown'} size={20} />
                    {file.name}
                    {#if favoritedFileIds.has(file.id)}
                      <Icon icon="tdesign:star-filled" class="size-4 text-yellow-500" />
                    {/if}
                    {#if file.versionCount && file.versionCount > 0}
                      <span title={t('page.knowledge.hasVersions').replace('${count}', String(file.versionCount))}>
                        <Icon icon="mdi:source-branch" class="size-4 text-blue-500" />
                      </span>
                    {/if}
                    {#if file.isPublic}
                      <Badge variant="destructive" class="text-xs px-1.5 py-0">{t('page.knowledge.public')}</Badge>
                    {/if}
                  </span>
                </Table.Cell>
                {#if extraFileColumns}
                  {@render extraFileColumns(file)}
                {/if}
                <Table.Cell class="text-muted-foreground text-left w-24">{formatSize(file.size)}</Table.Cell>
                <Table.Cell class="text-muted-foreground text-left w-40">{new Date(file.updatedAt || file.createdAt).toLocaleString('zh-CN')}</Table.Cell>
                {#if folderActions || fileActions || perms.canShowInfo}
                  <Table.Cell class="w-20 text-center" onclick={(e: MouseEvent) => e.stopPropagation()}>
                    {#if fileActions}
                      {@render fileActions(file)}
                    {:else if perms.canShowInfo}
                      <Tooltip.Root>
                        <Tooltip.Trigger>
                          <Button variant="ghost" size="icon" class="size-8" onclick={() => onShowFileInfo?.(file)}>
                            <Icon icon="tdesign:file-setting" class="size-4" />
                          </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>{t('page.knowledge.viewDetails')}</Tooltip.Content>
                      </Tooltip.Root>
                    {/if}
                  </Table.Cell>
                {/if}
              </Table.Row>
            </FileContextMenu>
          {/each}

          {#if folders.length === 0 && files.length === 0}
            <Table.Row>
              <Table.Cell colspan={10} class="h-24 text-center text-muted-foreground">
                {#if currentFolderId === null}
                  {t('page.knowledge.noContent')}
                {:else}
                  {t('page.knowledge.folderIsEmpty')}
                {/if}
              </Table.Cell>
            </Table.Row>
          {/if}
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  </div>
{/if}
