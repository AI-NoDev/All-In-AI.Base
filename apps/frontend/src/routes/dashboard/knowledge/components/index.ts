// Re-export all components from files/components for backward compatibility
// These components are shared across all knowledge pages
export { default as FileBreadcrumb } from '../../files/components/file-breadcrumb.svelte';
export { default as FileToolbar } from '../../files/components/file-toolbar.svelte';
export { default as FileList } from '../../files/components/file-list.svelte';
export { default as SharedFileList } from '../../files/components/shared-file-list.svelte';
export { default as NewFolderDialog } from '../../files/components/new-folder-dialog.svelte';
export { default as SearchDialog } from '../../files/components/search-dialog.svelte';
export { default as FileContextMenu } from '../../files/components/file-context-menu.svelte';
export { default as RenameDialog } from '../../files/components/rename-dialog.svelte';
export { default as DescriptionDialog } from '../../files/components/description-dialog.svelte';
export { default as DescriptionSheet } from '../../files/components/description-sheet.svelte';
export { default as FolderStyleDialog } from '../../files/components/folder-style-dialog.svelte';
export { default as UploadDialog } from '../../files/components/upload-dialog.svelte';
export { default as PermissionSheet } from '../../files/components/permission-sheet.svelte';
export { default as VersionSheet } from '../../files/components/version-sheet.svelte';
export { default as PasteConflictDialog } from '../../files/components/paste-conflict-dialog.svelte';
export * from '../../files/components/types';

// Knowledge page view mode type
export type KnowledgeViewMode = 'my-files' | 'shared-with-me' | 'my-shared' | 'favorites';

// Permission config for each view mode
export interface KnowledgePagePermissions {
  canCreate: boolean;      // 新建文件�?文件
  canUpload: boolean;      // 上传文件
  canDelete: boolean;      // 删除
  canEdit: boolean;        // 编辑/重命�?
  canShare: boolean;       // 共享权限设置
  canDownload: boolean;    // 下载
  canCopyPaste: boolean;   // 复制粘贴
}

// Default permissions for each view mode
export const VIEW_MODE_PERMISSIONS: Record<KnowledgeViewMode, KnowledgePagePermissions> = {
  'my-files': {
    canCreate: true,
    canUpload: true,
    canDelete: true,
    canEdit: true,
    canShare: true,
    canDownload: true,
    canCopyPaste: true,
  },
  'shared-with-me': {
    canCreate: false,
    canUpload: false,
    canDelete: false,
    canEdit: false,  // 根据共享权限动态判�?
    canShare: false,
    canDownload: true,
    canCopyPaste: false,
  },
  'my-shared': {
    canCreate: false,
    canUpload: false,
    canDelete: false,
    canEdit: true,   // 可以取消共享
    canShare: true,  // 可以修改共享设置
    canDownload: true,
    canCopyPaste: false,
  },
  'favorites': {
    canCreate: false,
    canUpload: false,
    canDelete: false,  // 只能取消收藏
    canEdit: false,
    canShare: false,
    canDownload: true,
    canCopyPaste: false,
  },
};
