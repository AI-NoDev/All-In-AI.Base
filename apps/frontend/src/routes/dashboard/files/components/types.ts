// 知识库相关类型定义
// 基础类型从 store 导出，组件特定类型在此定义

// Re-export from store
export type { FolderItem, FileItem, PathItem, ClipboardItem as KnowledgeClipboardItem } from '@/lib/stores/knowledge.svelte';

// Alias for clarity
export type ClipboardItemType = import('@/lib/stores/knowledge.svelte').ClipboardItem;

// Permission level: 'r' = read, 'w' = write, 'm' = manage
export type PermissionLevel = 'r' | 'w' | 'm';

export interface ResourcePermission {
  id: string;
  resourceType: 'folder' | 'file';
  resourceId: string;
  granteeType: 'user' | 'role' | 'dept';
  granteeId: string;
  permissionLevel: PermissionLevel;
}

export interface PermissionGrantee {
  granteeType: 'user' | 'role' | 'dept';
  granteeId: string;
  permissionLevel: PermissionLevel;
}

// Conflict resolution mode for file uploads
export type ConflictMode = 'overwrite' | 'newVersion' | 'copy' | 'skip';

export interface UploadItem {
  id: string;
  file: File;
  relativePath: string;
  status: 'pending' | 'uploading' | 'success' | 'error' | 'duplicate' | 'skipped';
  progress: number;
  error?: string;
  targetFolderId?: string | null;
  existingFileId?: string; // ID of existing file if duplicate
  conflictMode?: ConflictMode; // How to handle conflict
}

export type ContextMenuTarget = 
  | { type: 'folder'; item: import('@/lib/stores/knowledge.svelte').FolderItem }
  | { type: 'file'; item: import('@/lib/stores/knowledge.svelte').FileItem }
  | null;

// Paste conflict item for paste operations
export interface PasteConflictItem {
  clipboardItem: ClipboardItemType;
  existingFileId?: string;
  status: 'pending' | 'conflict' | 'resolved' | 'processing' | 'success' | 'error' | 'skipped';
  conflictMode?: ConflictMode;
  error?: string;
}
