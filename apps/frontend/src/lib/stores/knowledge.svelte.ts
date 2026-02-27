/**
 * 知识库 Store
 * 管理文件系统的状态、导航和剪贴板
 * 使用统一的 Node 模式（文件和文件夹统一为节点）
 */

import { authStore } from './auth.svelte';
import { PostApiKnowledgeNodesTypeEnum } from '@qiyu-allinai/api';

// ============ Types ============
export type FileViewMode = 'all' | 'my-shared' | 'shared-with-me' | 'favorites' | 'recycle-bin';
export type NodeType = 'folder' | 'file';

export interface NodeItem {
  id: string;
  type: NodeType;
  name: string;
  parentId: string | null;
  path: string;
  materializedPath: string | null;
  description: string | null;
  icon: string | null;
  color: string | null;
  orderNum: number | null;
  isPublic: boolean;
  // 文件特有字段
  originalName: string | null;
  extension: string | null;
  mimeType: string | null;
  size: number;
  storageKey: string | null;
  bucket: string | null;
  etag: string | null;
  versionId: string | null;
  downloadCount: number;
  tags: string[] | null;
  // 审计字段
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdById: string;
  deletedAt?: string | null;
  deletedBy?: string | null;
  deletedById?: string | null;
}

// 兼容旧的 FolderItem 和 FileItem 类型
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
  deletedAt?: string | null;
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
  deletedAt?: string | null;
}

export interface PathItem {
  id: string | null;
  name: string;
}

export interface ClipboardItem {
  type: NodeType;
  id: string;
  name: string;
  action: 'copy' | 'cut';
  sourceFolderId: string | null;
}

// Shared item types with additional metadata
export interface SharedNodeItem extends NodeItem {
  sharedTo?: Array<{ subjectType: string; subjectId: string; permission: string }>;
  sharedBy?: string | null;
  permission?: string;
}

const STORAGE_KEY = 'knowledge-path';

// 将 NodeItem 转换为 FolderItem（兼容旧组件）
function nodeToFolder(n: NodeItem): FolderItem {
  return {
    id: n.id,
    name: n.name,
    parentId: n.parentId,
    path: n.path,
    description: n.description,
    icon: n.icon,
    color: n.color,
    orderNum: n.orderNum,
    isPublic: n.isPublic,
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
    createdById: n.createdById,
    deletedAt: n.deletedAt,
  };
}

// 将 NodeItem 转换为 FileItem（兼容旧组件）
function nodeToFile(n: NodeItem): FileItem {
  return {
    id: n.id,
    name: n.name,
    folderId: n.parentId,
    originalName: n.originalName || n.name,
    extension: n.extension,
    mimeType: n.mimeType,
    size: n.size,
    description: n.description,
    storageKey: n.storageKey || '',
    bucket: n.bucket || '',
    isPublic: n.isPublic,
    versionCount: 0, // TODO: 从版本表获取
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
    createdById: n.createdById,
    deletedAt: n.deletedAt,
  };
}

function createKnowledgeStore() {
  // State - 使用统一的 nodes
  let nodes = $state<NodeItem[]>([]);
  let loading = $state(false);
  
  // Navigation State per View Mode
  interface ViewState {
    currentFolderId: string | null;
    pathStack: PathItem[];
  }

  const defaultViewState: ViewState = {
    currentFolderId: null,
    pathStack: [{ id: null, name: '根目录' }]
  };
  
  // Initialize view states with deep copies
  let viewStates = $state<Record<FileViewMode, ViewState>>({
    'all': JSON.parse(JSON.stringify(defaultViewState)),
    'my-shared': JSON.parse(JSON.stringify(defaultViewState)),
    'shared-with-me': JSON.parse(JSON.stringify(defaultViewState)),
    'favorites': JSON.parse(JSON.stringify(defaultViewState)),
    'recycle-bin': { currentFolderId: null, pathStack: [{ id: null, name: '回收站' }] }
  });

  let selectedNodeIds = $state<Set<string>>(new Set());
  let clipboard = $state<ClipboardItem[]>([]);
  let viewMode = $state<FileViewMode>('all');
  
  // Favorites state
  let favoritedNodeIds = $state<Set<string>>(new Set());
  
  // Shared data
  let sharedNodes = $state<SharedNodeItem[]>([]);

  const api = authStore.createApi(true);

  // ============ Derived State ============
  // Current view navigation state
  let currentFolderId = $derived(viewStates[viewMode].currentFolderId);
  let pathStack = $derived(viewStates[viewMode].pathStack);

  // 根据视图模式选择当前显示的节点列表
  let activeNodes = $derived(viewMode === 'all' ? nodes : sharedNodes);

  // 分离文件夹和文件（兼容旧组件）
  let folders = $derived(activeNodes.filter(n => n.type === 'folder').map(nodeToFolder));
  let files = $derived(activeNodes.filter(n => n.type === 'file').map(nodeToFile));
  
  let selectedFolderIds = $derived(new Set(
    Array.from(selectedNodeIds).filter(id => activeNodes.find(n => n.id === id)?.type === 'folder')
  ));
  let selectedFileIds = $derived(new Set(
    Array.from(selectedNodeIds).filter(id => activeNodes.find(n => n.id === id)?.type === 'file')
  ));
  let favoritedFolderIds = $derived(new Set(
    Array.from(favoritedNodeIds).filter(id => activeNodes.find(n => n.id === id)?.type === 'folder')
  ));
  let favoritedFileIds = $derived(new Set(
    Array.from(favoritedNodeIds).filter(id => activeNodes.find(n => n.id === id)?.type === 'file')
  ));

  // ============ LocalStorage ============
  function loadPathFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        
        // Handle legacy format (single view state)
        if (parsed.pathStack && Array.isArray(parsed.pathStack)) {
           // Only restore for 'all' view if it's legacy format
           viewStates['all'].pathStack = parsed.pathStack;
           viewStates['all'].currentFolderId = parsed.currentFolderId;
        } 
        // Handle new format (multi-view state)
        else if (parsed.viewStates) {
          // Merge stored states into current states
          Object.keys(parsed.viewStates).forEach((key) => {
             const mode = key as FileViewMode;
             if (viewStates[mode]) {
               viewStates[mode].pathStack = parsed.viewStates[mode].pathStack;
               viewStates[mode].currentFolderId = parsed.viewStates[mode].currentFolderId;
             }
          });
        }
      } catch {
        // 解析失败，使用默认值
      }
    }
  }

  function savePathToStorage(): void {
    if (typeof window === 'undefined') return;
    // Save all view states
    // We create a plain object representation to avoid proxy issues if any
    const stateToSave = {
      viewStates: {
        'all': { ...viewStates['all'] },
        'my-shared': { ...viewStates['my-shared'] },
        'shared-with-me': { ...viewStates['shared-with-me'] },
        'favorites': { ...viewStates['favorites'] },
        'recycle-bin': { ...viewStates['recycle-bin'] }
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }

  // ============ Data Loading ============
  async function loadContents(folderId: string | null = viewStates[viewMode].currentFolderId): Promise<void> {
    loading = true;
    clearSelection();
    
    try {
      // 使用新的 node API 获取子节点
      const parentId = folderId === null ? 'root' : folderId;
      const res = await api.knowledge.getApiKnowledgeNodesByIdChildren({ id: parentId });
      nodes = (res.data?.data || []) as NodeItem[];
      
      // Load favorite status
      await loadFavoriteStatus();
    } catch (err) {
      console.error('加载失败:', err);
      nodes = [];
    } finally {
      loading = false;
    }
  }
  
  async function loadFavoriteStatus(): Promise<void> {
    const nodeIds = nodes.map(n => n.id);
    
    if (nodeIds.length === 0) {
      favoritedNodeIds = new Set();
      return;
    }
    
    try {
      const res = await api.knowledge.postApiKnowledgeFavoritesCheck({ nodeIds });
      const favorites = res.data?.favorites || {};
      favoritedNodeIds = new Set(Object.entries(favorites).filter(([, v]) => v).map(([k]) => k));
    } catch (err) {
      console.error('加载收藏状态失败:', err);
      favoritedNodeIds = new Set();
    }
  }

  async function refresh(): Promise<void> {
    if (viewMode === 'all') {
      await loadContents(viewStates[viewMode].currentFolderId);
    } else {
      await loadViewModeData();
    }
  }

  // ============ View Mode ============
  function setViewMode(mode: FileViewMode): void {
    viewMode = mode;
    clearSelection();
    
    // We no longer need to manually reset pathStack here as each view has its own state
    
    if (mode === 'all') {
      loadContents(viewStates[mode].currentFolderId);
    } else {
      loadViewModeData();
    }
  }

  async function loadViewModeData(): Promise<void> {
    loading = true;
    clearSelection();
    sharedNodes = [];
    
    try {
      if (viewMode === 'my-shared') {
        const res = await api.knowledge.postApiKnowledgeShareMyShared({ limit: 100, offset: 0 });
        if (res.data) {
          sharedNodes = res.data.map((item: { node: NodeItem; sharedTo?: Array<{ subjectType: string; subjectId: string; permission: string }> }) => ({
            ...item.node,
            sharedTo: item.sharedTo,
          })) as SharedNodeItem[];
        }
      } else if (viewMode === 'shared-with-me') {
        const res = await api.knowledge.postApiKnowledgeShareSharedWithMe({ limit: 100, offset: 0 });
        if (res.data) {
          sharedNodes = res.data.map((item: { node: NodeItem; sharedBy?: { userName?: string }; permissions?: string[] }) => ({
            ...item.node,
            sharedBy: item.sharedBy?.userName,
            permission: item.permissions?.[0],
          })) as SharedNodeItem[];
        }
      } else if (viewMode === 'favorites') {
        const res = await api.knowledge.postApiKnowledgeFavoritesList({ limit: 100, offset: 0 });
        if (res.data) {
          sharedNodes = res.data.map((item: { nodeId: string; type: NodeType; name: string; parentId: string | null; icon?: string | null; color?: string | null; extension?: string | null; mimeType?: string | null; size?: number; createdAt: string }) => ({
            id: item.nodeId,
            type: item.type,
            name: item.name,
            parentId: item.parentId,
            path: '/',
            materializedPath: null,
            description: null,
            icon: item.icon,
            color: item.color,
            orderNum: null,
            isPublic: false,
            originalName: null,
            extension: item.extension,
            mimeType: item.mimeType,
            size: item.size || 0,
            storageKey: null,
            bucket: null,
            etag: null,
            versionId: null,
            downloadCount: 0,
            tags: null,
            createdAt: item.createdAt,
            updatedAt: item.createdAt,
            createdBy: '',
            createdById: '',
            deletedAt: null,
          })) as SharedNodeItem[];
        }
      } else if (viewMode === 'recycle-bin') {
        const currentId = viewStates[viewMode].currentFolderId;
        const res = await api.knowledge.postApiKnowledgeNodesRecycleBin({
          limit: 100,
          offset: 0,
          sort: { field: 'deletedAt', order: 'desc' },
          filter: currentId ? { parentId: currentId } : { rootOnly: true } as any
        });
        if (res.data?.data) {
          sharedNodes = (res.data.data as NodeItem[]) as SharedNodeItem[];
        }
      }
    } catch (err) {
      console.error('加载数据失败:', err);
      sharedNodes = [];
    } finally {
      loading = false;
    }
  }

  // ============ Favorites ============
  async function toggleFavorite(_resourceType: 'folder' | 'file', resourceId: string): Promise<boolean> {
    try {
      const isFavorited = favoritedNodeIds.has(resourceId);
      
      if (isFavorited) {
        await api.knowledge.deleteApiKnowledgeFavoritesByNodeId({ nodeId: resourceId });
        const newSet = new Set(favoritedNodeIds);
        newSet.delete(resourceId);
        favoritedNodeIds = newSet;
      } else {
        await api.knowledge.postApiKnowledgeFavorites({ nodeId: resourceId });
        favoritedNodeIds = new Set([...favoritedNodeIds, resourceId]);
      }
      
      // Refresh if in favorites view
      if (viewMode === 'favorites') {
        await loadViewModeData();
      }
      
      return !isFavorited;
    } catch (err) {
      console.error('切换收藏失败:', err);
      return false;
    }
  }
  
  function isFolderFavorited(folderId: string): boolean {
    return favoritedNodeIds.has(folderId);
  }
  
  function isFileFavorited(fileId: string): boolean {
    return favoritedNodeIds.has(fileId);
  }

  // ============ Navigation ============
  function navigateToFolder(folder: FolderItem): void {
    viewStates[viewMode].currentFolderId = folder.id;
    viewStates[viewMode].pathStack = [...viewStates[viewMode].pathStack, { id: folder.id, name: folder.name }];
    savePathToStorage();
    refresh();
  }

  function navigateUp(): void {
    const stack = viewStates[viewMode].pathStack;
    if (stack.length <= 1) return;
    
    viewStates[viewMode].pathStack = stack.slice(0, -1);
    viewStates[viewMode].currentFolderId = viewStates[viewMode].pathStack[viewStates[viewMode].pathStack.length - 1].id;
    savePathToStorage();
    refresh();
  }

  function navigateToPath(index: number): void {
    const stack = viewStates[viewMode].pathStack;
    if (index >= stack.length - 1) return;
    
    viewStates[viewMode].pathStack = stack.slice(0, index + 1);
    viewStates[viewMode].currentFolderId = viewStates[viewMode].pathStack[index].id;
    savePathToStorage();
    refresh();
  }

  function navigateToRoot(): void {
    // Reset based on view mode default
    const rootName = viewMode === 'recycle-bin' ? '回收站' : '根目录';
    viewStates[viewMode].pathStack = [{ id: null, name: rootName }];
    viewStates[viewMode].currentFolderId = null;
    savePathToStorage();
    refresh();
  }

  // ============ Selection ============
  function clearSelection(): void {
    selectedNodeIds = new Set();
  }

  function toggleSelectAll(): void {
    const allSelected = activeNodes.length > 0 && activeNodes.every(n => selectedNodeIds.has(n.id));
    
    if (allSelected) {
      clearSelection();
    } else {
      selectedNodeIds = new Set(activeNodes.map(n => n.id));
    }
  }

  function toggleFolderSelect(id: string): void {
    const s = new Set(selectedNodeIds);
    s.has(id) ? s.delete(id) : s.add(id);
    selectedNodeIds = s;
  }

  function toggleFileSelect(id: string): void {
    const s = new Set(selectedNodeIds);
    s.has(id) ? s.delete(id) : s.add(id);
    selectedNodeIds = s;
  }

  // ============ Clipboard ============
  function copySelected(): void {
    const items: ClipboardItem[] = [];
    selectedNodeIds.forEach(id => {
      const n = activeNodes.find(x => x.id === id);
      if (n) items.push({ type: n.type, id, name: n.name, action: 'copy', sourceFolderId: n.parentId });
    });
    clipboard = items;
  }

  function cutSelected(): void {
    const items: ClipboardItem[] = [];
    selectedNodeIds.forEach(id => {
      const n = activeNodes.find(x => x.id === id);
      if (n) items.push({ type: n.type, id, name: n.name, action: 'cut', sourceFolderId: n.parentId });
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
      const res = await api.knowledge.postApiKnowledgeNodes({
        type: PostApiKnowledgeNodesTypeEnum.Folder,
        parentId: currentFolderId,
        name,
      });
      await refresh();
      return res.data ? nodeToFolder(res.data as NodeItem) : null;
    } catch (err) {
      console.error('创建文件夹失败:', err);
      return null;
    }
  }

  async function deleteFolder(folder: FolderItem): Promise<boolean> {
    try {
      await api.knowledge.deleteApiKnowledgeNodesById({ id: folder.id });
      await refresh();
      return true;
    } catch (err) {
      console.error('删除文件夹失败:', err);
      return false;
    }
  }

  async function deleteFile(file: FileItem): Promise<boolean> {
    try {
      await api.knowledge.deleteApiKnowledgeNodesById({ id: file.id });
      await refresh();
      return true;
    } catch (err) {
      console.error('删除文件失败:', err);
      return false;
    }
  }

  async function deleteSelected(): Promise<void> {
    const ids = Array.from(selectedNodeIds);
    if (ids.length === 0) return;
    
    try {
      if (viewMode === 'recycle-bin') {
        await api.knowledge.deleteApiKnowledgeNodesRecycleBinDelete({ ids });
      } else {
        await api.knowledge.postApiKnowledgeNodesDeleteBatch({ ids });
      }
      await refresh();
      clearSelection();
    } catch (err) {
      console.error('批量删除失败:', err);
    }
  }

  async function restoreSelected(): Promise<void> {
    const ids = Array.from(selectedNodeIds);
    if (ids.length === 0) return;
    
    try {
      await api.knowledge.postApiKnowledgeNodesRestore({ ids });
      await refresh();
      clearSelection();
    } catch (err) {
      console.error('还原失败:', err);
    }
  }

  async function restoreNode(id: string): Promise<void> {
    try {
      await api.knowledge.postApiKnowledgeNodesRestore({ ids: [id] });
      await refresh();
    } catch (err) {
      console.error('还原失败:', err);
    }
  }

  async function deleteNodePermanently(id: string): Promise<void> {
    try {
      await api.knowledge.deleteApiKnowledgeNodesRecycleBinDelete({ ids: [id] });
      await refresh();
    } catch (err) {
      console.error('永久删除失败:', err);
    }
  }

  async function renameFolder(folder: FolderItem, newName: string): Promise<boolean> {
    try {
      await api.knowledge.putApiKnowledgeNodesById({ id: folder.id }, { name: newName });
      await refresh();
      return true;
    } catch (err) {
      console.error('重命名文件夹失败:', err);
      return false;
    }
  }

  async function renameFile(file: FileItem, newName: string): Promise<boolean> {
    try {
      await api.knowledge.putApiKnowledgeNodesById({ id: file.id }, { name: newName });
      await refresh();
      return true;
    } catch (err) {
      console.error('重命名文件失败:', err);
      return false;
    }
  }

  // ============ Initialization ============
  function init(): void {
    // Reset view mode to 'all' when initializing (e.g. entering My Files page)
    viewMode = 'all';
    
    loadPathFromStorage();
    
    // Check URL parameters for folder ID
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const folderId = urlParams.get('folderId');
      if (folderId) {
        // If URL has folderId, use it
        viewStates['all'].currentFolderId = folderId;
      }
    }
    
    loadContents(viewStates['all'].currentFolderId);
  }

  // ============ Derived State ============
  const hasSelection = () => selectedNodeIds.size > 0;
  const hasClipboard = () => clipboard.length > 0;
  const isAllSelected = () => activeNodes.length > 0 && activeNodes.every(n => selectedNodeIds.has(n.id));

  return {
    // State getters
    get nodes() { return nodes; },
    get folders() { return folders; },
    get files() { return files; },
    get loading() { return loading; },
    get currentFolderId() { return currentFolderId; },
    get pathStack() { return pathStack; },
    get selectedNodeIds() { return selectedNodeIds; },
    get selectedFolderIds() { return selectedFolderIds; },
    get selectedFileIds() { return selectedFileIds; },
    get clipboard() { return clipboard; },
    get viewMode() { return viewMode; },
    get sharedNodes() { return sharedNodes; },
    get favoritedNodeIds() { return favoritedNodeIds; },
    get favoritedFolderIds() { return favoritedFolderIds; },
    get favoritedFileIds() { return favoritedFileIds; },
    
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
    loadRecycleBin: () => setViewMode('recycle-bin'),
    setViewMode,

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

    // Actions
    createFolder,
    deleteFolder,
    deleteFile,
    deleteSelected,
    restore: async (ids: string[]) => {
      await api.knowledge.postApiKnowledgeNodesRestore({ ids });
      await refresh();
    },
    deletePermanently: async (ids: string[]) => {
      await api.knowledge.deleteApiKnowledgeNodesRecycleBinDelete({ ids });
      await refresh();
    },
    emptyRecycleBin: async () => {
      // @ts-ignore
      await api.knowledge.deleteApiKnowledgeNodesRecycleBin();
      await refresh();
    },
    renameFolder,
    renameFile,
    loadViewModeData,
    
    // Favorites
    toggleFavorite,
    isFolderFavorited,
    isFileFavorited,

    // Data
    loadContents,
    refresh,
    init,
  };
}

export const knowledgeStore = createKnowledgeStore();
