/**
 * 知识库 Store
 * 管理文件系统的状态、导航和剪贴板
 */

import { authStore } from './auth.svelte';
import {
  PostApiKnowledgeFolderQueryFieldEnum,
  PostApiKnowledgeFolderQueryOrderEnum,
  PostApiKnowledgeFileQueryFieldEnum,
  PostApiKnowledgeFileQueryOrderEnum,
} from '@qiyu-allinai/api';

// ============ Types ============
export type FileViewMode = 'all' | 'my-shared' | 'shared-with-me' | 'favorites';

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  path: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  orderNum: number | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

export interface FileItem {
  id: string;
  name: string;
  folderId: string | null;
  originalName: string;
  extension: string | null;
  mimeType: string | null;
  size: number;
  description: string | null;
  storageKey: string;
  bucket: string;
  isPublic: boolean;
  versionCount: number;
  createdAt: string;
  updatedAt: string;
  createdById: string;
}

// Shared item types with additional metadata
export interface SharedFolderItem extends Omit<FolderItem, 'path' | 'orderNum' | 'updatedAt' | 'createdById'> {
  sharedTo?: Array<{ subjectType: string; subjectId: string; permission: string }>;
  sharedBy?: string | null;
  permission?: string;
}

export interface SharedFileItem extends Omit<FileItem, 'originalName' | 'storageKey' | 'bucket' | 'versionCount' | 'updatedAt' | 'createdById'> {
  sharedTo?: Array<{ subjectType: string; subjectId: string; permission: string }>;
  sharedBy?: string | null;
  permission?: string;
}

export interface PathItem {
  id: string | null;
  name: string;
}

export interface ClipboardItem {
  type: 'folder' | 'file';
  id: string;
  name: string;
  action: 'copy' | 'cut';
  sourceFolderId: string | null; // The folder where the item was copied/cut from
}

const STORAGE_KEY = 'knowledge-path';

function createKnowledgeStore() {
  // State
  let folders = $state<FolderItem[]>([]);
  let files = $state<FileItem[]>([]);
  let loading = $state(false);
  let currentFolderId = $state<string | null>(null);
  let pathStack = $state<PathItem[]>([{ id: null, name: '根目录' }]);
  let selectedFolderIds = $state<Set<string>>(new Set());
  let selectedFileIds = $state<Set<string>>(new Set());
  let clipboard = $state<ClipboardItem[]>([]);
  let viewMode = $state<FileViewMode>('all');
  
  // Shared/Favorites data
  let sharedFolders = $state<SharedFolderItem[]>([]);
  let sharedFiles = $state<SharedFileItem[]>([]);

  const api = authStore.createApi(true);

  // ============ LocalStorage ============
  function loadPathFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { pathStack: PathItem[]; currentFolderId: string | null };
        if (parsed.pathStack?.length > 0) {
          pathStack = parsed.pathStack;
          currentFolderId = parsed.currentFolderId;
        }
      } catch {
        // 解析失败，使用默认值
      }
    }
  }

  function savePathToStorage(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      pathStack,
      currentFolderId,
    }));
  }

  // ============ Data Loading ============
  async function loadContents(folderId: string | null = currentFolderId): Promise<void> {
    loading = true;
    clearSelection();
    
    try {
      const [folderRes, fileRes] = await Promise.all([
        api.knowledge.postApiKnowledgeFolderQuery({
          filter: { parentId: folderId },
          sort: {
            field: PostApiKnowledgeFolderQueryFieldEnum.Name,
            order: PostApiKnowledgeFolderQueryOrderEnum.Asc,
          },
          limit: 100,
        }),
        api.knowledge.postApiKnowledgeFileQuery({
          filter: { folderId: folderId },
          sort: {
            field: PostApiKnowledgeFileQueryFieldEnum.Name,
            order: PostApiKnowledgeFileQueryOrderEnum.Asc,
          },
          limit: 100,
        }),
      ]);
      folders = (folderRes.data?.data || []) as FolderItem[];
      files = (fileRes.data?.data || []) as FileItem[];
    } catch (err) {
      console.error('加载失败:', err);
      folders = [];
      files = [];
    } finally {
      loading = false;
    }
  }

  async function refresh(): Promise<void> {
    if (viewMode === 'all') {
      await loadContents(currentFolderId);
    } else {
      await loadViewModeData();
    }
  }

  // ============ View Mode ============
  function setViewMode(mode: FileViewMode): void {
    viewMode = mode;
    clearSelection();
    if (mode === 'all') {
      loadContents(currentFolderId);
    } else {
      loadViewModeData();
    }
  }

  async function loadViewModeData(): Promise<void> {
    loading = true;
    clearSelection();
    sharedFolders = [];
    sharedFiles = [];
    
    try {
      if (viewMode === 'my-shared') {
        // Load resources I shared with others
        const res = await api.files.postApiFilesShareMyShared({ limit: 100, offset: 0 });
        if (res.data) {
          sharedFolders = res.data.folders || [];
          sharedFiles = res.data.files || [];
        }
      } else if (viewMode === 'shared-with-me') {
        // Load resources shared with me
        const res = await api.files.postApiFilesShareSharedWithMe({ limit: 100, offset: 0 });
        if (res.data) {
          sharedFolders = res.data.folders || [];
          sharedFiles = res.data.files || [];
        }
      } else if (viewMode === 'favorites') {
        // Load favorited resources
        const res = await api.knowledge.postApiKnowledgeFavoriteList({ resourceType: 'all', limit: 100, offset: 0 });
        if (res.data) {
          sharedFolders = res.data.folders || [];
          sharedFiles = res.data.files || [];
        }
      }
    } catch (err) {
      console.error('加载数据失败:', err);
      sharedFolders = [];
      sharedFiles = [];
    } finally {
      loading = false;
    }
  }

  // ============ Favorites ============
  async function toggleFavorite(resourceType: 'folder' | 'file', resourceId: string): Promise<boolean> {
    try {
      const checkRes = await api.knowledge.getApiKnowledgeFavoriteCheckByResourceTypeByResourceId({
        resourceType,
        resourceId,
      });
      
      if (checkRes.data?.isFavorited) {
        await api.knowledge.deleteApiKnowledgeFavoriteByResourceTypeByResourceId({
          resourceType,
          resourceId,
        });
      } else {
        await api.knowledge.postApiKnowledgeFavorite({
          resourceType,
          resourceId,
        });
      }
      
      // Refresh if in favorites view
      if (viewMode === 'favorites') {
        await loadViewModeData();
      }
      
      return !checkRes.data?.isFavorited;
    } catch (err) {
      console.error('切换收藏失败:', err);
      return false;
    }
  }

  // ============ Navigation ============
  function navigateToFolder(folder: FolderItem): void {
    currentFolderId = folder.id;
    pathStack = [...pathStack, { id: folder.id, name: folder.name }];
    savePathToStorage();
    loadContents(folder.id);
  }

  function navigateUp(): void {
    if (pathStack.length <= 1) return;
    pathStack = pathStack.slice(0, -1);
    currentFolderId = pathStack[pathStack.length - 1].id;
    savePathToStorage();
    loadContents(currentFolderId);
  }

  function navigateToPath(index: number): void {
    if (index >= pathStack.length - 1) return;
    pathStack = pathStack.slice(0, index + 1);
    currentFolderId = pathStack[index].id;
    savePathToStorage();
    loadContents(currentFolderId);
  }

  function navigateToRoot(): void {
    pathStack = [{ id: null, name: '根目录' }];
    currentFolderId = null;
    savePathToStorage();
    loadContents(null);
  }

  // ============ Selection ============
  function clearSelection(): void {
    selectedFolderIds = new Set();
    selectedFileIds = new Set();
  }

  function toggleSelectAll(): void {
    const allSelected =
      (folders.length > 0 || files.length > 0) &&
      folders.every((f) => selectedFolderIds.has(f.id)) &&
      files.every((f) => selectedFileIds.has(f.id));
    
    if (allSelected) {
      clearSelection();
    } else {
      selectedFolderIds = new Set(folders.map((f) => f.id));
      selectedFileIds = new Set(files.map((f) => f.id));
    }
  }

  function toggleFolderSelect(id: string): void {
    const s = new Set(selectedFolderIds);
    s.has(id) ? s.delete(id) : s.add(id);
    selectedFolderIds = s;
  }

  function toggleFileSelect(id: string): void {
    const s = new Set(selectedFileIds);
    s.has(id) ? s.delete(id) : s.add(id);
    selectedFileIds = s;
  }

  // ============ Clipboard ============
  function copySelected(): void {
    const items: ClipboardItem[] = [];
    selectedFolderIds.forEach((id) => {
      const f = folders.find((x) => x.id === id);
      if (f) items.push({ type: 'folder', id, name: f.name, action: 'copy', sourceFolderId: f.parentId });
    });
    selectedFileIds.forEach((id) => {
      const f = files.find((x) => x.id === id);
      if (f) items.push({ type: 'file', id, name: f.name, action: 'copy', sourceFolderId: f.folderId });
    });
    clipboard = items;
  }

  function cutSelected(): void {
    const items: ClipboardItem[] = [];
    selectedFolderIds.forEach((id) => {
      const f = folders.find((x) => x.id === id);
      if (f) items.push({ type: 'folder', id, name: f.name, action: 'cut', sourceFolderId: f.parentId });
    });
    selectedFileIds.forEach((id) => {
      const f = files.find((x) => x.id === id);
      if (f) items.push({ type: 'file', id, name: f.name, action: 'cut', sourceFolderId: f.folderId });
    });
    clipboard = items;
  }

  function copyFolder(folder: FolderItem): void {
    clipboard = [{ type: 'folder', id: folder.id, name: folder.name, action: 'copy', sourceFolderId: folder.parentId }];
  }

  function cutFolder(folder: FolderItem): void {
    clipboard = [{ type: 'folder', id: folder.id, name: folder.name, action: 'cut', sourceFolderId: folder.parentId }];
  }

  function copyFile(file: FileItem): void {
    clipboard = [{ type: 'file', id: file.id, name: file.name, action: 'copy', sourceFolderId: file.folderId }];
  }

  function cutFile(file: FileItem): void {
    clipboard = [{ type: 'file', id: file.id, name: file.name, action: 'cut', sourceFolderId: file.folderId }];
  }

  function clearClipboard(): void {
    clipboard = [];
  }

  // ============ CRUD Operations ============
  async function createFolder(name: string): Promise<FolderItem | null> {
    try {
      const res = await api.knowledge.postApiKnowledgeFolder({
        data: {
          parentId: currentFolderId,
          name,
          path: '/',
          createdBy: '',
          updatedBy: '',
        },
      });
      await refresh();
      return res.data as FolderItem;
    } catch (err) {
      console.error('创建文件夹失败:', err);
      return null;
    }
  }

  async function deleteFolder(folder: FolderItem): Promise<boolean> {
    try {
      await api.knowledge.deleteApiKnowledgeFolderById({ id: folder.id });
      await refresh();
      return true;
    } catch (err) {
      console.error('删除文件夹失败:', err);
      return false;
    }
  }

  async function deleteFile(file: FileItem): Promise<boolean> {
    try {
      await api.knowledge.deleteApiKnowledgeFileById({ id: file.id });
      await refresh();
      return true;
    } catch (err) {
      console.error('删除文件失败:', err);
      return false;
    }
  }

  async function deleteSelected(): Promise<void> {
    const folderPromises = Array.from(selectedFolderIds).map((id) =>
      api.knowledge.deleteApiKnowledgeFolderById({ id })
    );
    const filePromises = Array.from(selectedFileIds).map((id) =>
      api.knowledge.deleteApiKnowledgeFileById({ id })
    );
    await Promise.all([...folderPromises, ...filePromises]);
    await refresh();
  }

  // ============ Initialization ============
  function init(): void {
    loadPathFromStorage();
    loadContents(currentFolderId);
  }

  // ============ Derived State ============
  const hasSelection = () => selectedFolderIds.size > 0 || selectedFileIds.size > 0;
  const hasClipboard = () => clipboard.length > 0;
  const isAllSelected = () => 
    (folders.length > 0 || files.length > 0) &&
    folders.every((f) => selectedFolderIds.has(f.id)) &&
    files.every((f) => selectedFileIds.has(f.id));

  return {
    // State getters
    get folders() { return folders; },
    get files() { return files; },
    get loading() { return loading; },
    get currentFolderId() { return currentFolderId; },
    get pathStack() { return pathStack; },
    get selectedFolderIds() { return selectedFolderIds; },
    get selectedFileIds() { return selectedFileIds; },
    get clipboard() { return clipboard; },
    get viewMode() { return viewMode; },
    get sharedFolders() { return sharedFolders; },
    get sharedFiles() { return sharedFiles; },
    
    // Derived
    get hasSelection() { return hasSelection(); },
    get hasClipboard() { return hasClipboard(); },
    get isAllSelected() { return isAllSelected(); },
    get clipboardCount() { return clipboard.length; },

    // Navigation
    navigateToFolder,
    navigateUp,
    navigateToPath,
    navigateToRoot,

    // Selection
    clearSelection,
    toggleSelectAll,
    toggleFolderSelect,
    toggleFileSelect,

    // Clipboard
    copySelected,
    cutSelected,
    copyFolder,
    cutFolder,
    copyFile,
    cutFile,
    clearClipboard,

    // CRUD
    createFolder,
    deleteFolder,
    deleteFile,
    deleteSelected,

    // View Mode
    setViewMode,
    loadViewModeData,
    
    // Favorites
    toggleFavorite,

    // Data
    loadContents,
    refresh,
    init,
  };
}

export const knowledgeStore = createKnowledgeStore();
