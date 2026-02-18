// 知识库相关类型定义
// 基础类型从 store 导出，组件特定类型在此定义

// Re-export from store
export type { FolderItem, FileItem, PathItem, ClipboardItem as KnowledgeClipboardItem } from '@/lib/stores/knowledge.svelte';

// Alias for clarity
export type ClipboardItemType = import('@/lib/stores/knowledge.svelte').ClipboardItem;

// File permission types (Casbin-based)
export type FilePermission = 'read' | 'write' | 'manage';
export type PermissionEffect = 'allow' | 'deny';
export type SubjectType = 'user' | 'role' | 'dept';
export type ResourceType = 'folder' | 'file';

// Legacy permission level (for backward compatibility)
export type PermissionLevel = 'r' | 'w' | 'm';

export interface FilePermissionEntry {
  subjectType: SubjectType;
  subjectId: string;
  resourceType: ResourceType;
  resourceId: string;
  permission: FilePermission;
  effect: PermissionEffect;
}

export interface PermissionGrantee {
  subjectType: SubjectType;
  subjectId: string;
  permission: FilePermission;
  effect: PermissionEffect;
}

export interface EffectivePermission {
  permission: FilePermission;
  effect: PermissionEffect;
  source: 'direct' | 'inherited' | 'role' | 'dept';
  sourceId?: string;
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
