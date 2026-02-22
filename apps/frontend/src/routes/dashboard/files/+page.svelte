<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { knowledgeStore, type FolderItem, type FileItem } from '@/lib/stores/knowledge.svelte';
  import { PostApiKnowledgeUploadForceConflictModeEnum } from '@qiyu-allinai/api';
  import { t } from '$lib/stores/i18n.svelte';
  import {
    FileBreadcrumb,
    FileToolbar,
    FileList,
    NewFolderDialog,
    SearchDialog,
    RenameDialog,
    DescriptionDialog,
    FolderStyleDialog,
    UploadDialog,
    PermissionSheet,
    VersionSheet,
    PasteConflictDialog,
    type UploadItem,
    type PermissionGrantee,
    type ConflictMode,
    type PasteConflictItem,
  } from './components';

  // Dialog state
  let searchOpen = $state(false);
  let newFolderDialogOpen = $state(false);
  let renameDialogOpen = $state(false);
  let descriptionDialogOpen = $state(false);
  let folderStyleDialogOpen = $state(false);
  let uploadDialogOpen = $state(false);
  let permissionSheetOpen = $state(false);
  let versionSheetOpen = $state(false);
  let pasteConflictDialogOpen = $state(false);

  // Upload state
  let uploadItems = $state<UploadItem[]>([]);
  let isUploading = $state(false);
  let isUploadComplete = $state(false);
  let hasDuplicates = $derived(uploadItems.some(i => i.status === 'duplicate'));

  // Paste state
  let pasteItems = $state<PasteConflictItem[]>([]);
  let isPasting = $state(false);
  let isPasteComplete = $state(false);

  // Dialog targets
  interface RenameTarget {
    type: 'folder' | 'file';
    id: string;
    name: string;
  }
  interface DescriptionTarget {
    type: 'folder' | 'file';
    id: string;
    name: string;
    description: string | null;
    readOnly: boolean;
  }
  let renameTarget = $state<RenameTarget | null>(null);
  let descriptionTarget = $state<DescriptionTarget | null>(null);
  let styleTarget = $state<FolderItem | null>(null);

  interface PermissionTarget {
    type: 'folder' | 'file';
    id: string;
    name: string;
    isPublic: boolean;
  }
  let permissionTarget = $state<PermissionTarget | null>(null);

  interface VersionTarget {
    fileId: string;
    fileName: string;
  }
  let versionTarget = $state<VersionTarget | null>(null);

  // Drag state
  let isDragging = $state(false);

  const api = authStore.createApi(true);

  // Create folder
  async function handleCreateFolder(name: string) {
    await knowledgeStore.createFolder(name);
    newFolderDialogOpen = false;
  }

  function handleNewTextFile() {
    goto(`/dashboard/files/${knowledgeStore.currentFolderId || 'root'}/create-text-file`);
  }

  function handleSearch(query: string) {
    console.log('搜索:', query);
    searchOpen = false;
  }

  // Clipboard operations
  async function handlePaste() {
    if (!knowledgeStore.hasClipboard) return;
    
    const targetFolderId = knowledgeStore.currentFolderId;
    
    // Build paste items from clipboard
    const items: PasteConflictItem[] = knowledgeStore.clipboard.map(item => ({
      clipboardItem: item,
      status: 'pending' as const,
    }));
    
    // Check for conflicts (only for files, folders don't have conflict handling)
    const fileItems = items.filter(i => i.clipboardItem.type === 'file');
    if (fileItems.length > 0) {
      const fileNames = fileItems.map(i => i.clipboardItem.name);
      try {
        const res = await api.files.postApiFilesCheckExists({
          folderId: targetFolderId ?? null,
          names: fileNames,
        });
        
        if (res.data?.exists && res.data.exists.length > 0) {
          // Mark conflicting items
          const existingMap = new Map<string, string>();
          for (const existing of res.data.exists) {
            existingMap.set(existing.name, existing.fileId);
          }
          
          for (const item of items) {
            if (item.clipboardItem.type === 'file' && existingMap.has(item.clipboardItem.name)) {
              const existingFileId = existingMap.get(item.clipboardItem.name);
              const isSameFolder = item.clipboardItem.sourceFolderId === targetFolderId;
              const isSameFile = existingFileId === item.clipboardItem.id;
              
              // For copy to same folder, the file conflicts with itself - this is expected
              // We should still show conflict dialog but handle it differently
              if (isSameFolder && isSameFile && item.clipboardItem.action === 'copy') {
                // Copy to same folder - will create a copy with new name
                // Mark as conflict so user can choose how to handle
                item.status = 'conflict';
                item.existingFileId = existingFileId;
              } else if (!isSameFile) {
                // Different file with same name - real conflict
                item.status = 'conflict';
                item.existingFileId = existingFileId;
              }
              // If same file and cut operation to same folder, no conflict (nothing to do)
            }
          }
        }
      } catch (err) {
        console.error(t('page.knowledge.checkConflictFailed'), err);
      }
    }
    
    pasteItems = items;
    
    // If there are conflicts, show dialog
    const hasConflicts = items.some(i => i.status === 'conflict');
    if (hasConflicts) {
      isPasting = false;
      isPasteComplete = false;
      pasteConflictDialogOpen = true;
    } else {
      // No conflicts, execute paste directly
      await executePaste();
    }
  }

  function handlePasteResolve(itemId: string, action: ConflictMode | 'skip' | 'skip-all' | 'overwrite-all' | 'newVersion-all' | 'copy-all') {
    if (action === 'skip-all') {
      pasteItems = pasteItems.map(item => 
        item.status === 'conflict' ? { ...item, status: 'skipped' as const } : item
      );
    } else if (action === 'overwrite-all') {
      pasteItems = pasteItems.map(item => 
        item.status === 'conflict' ? { ...item, status: 'resolved' as const, conflictMode: 'overwrite' as ConflictMode } : item
      );
    } else if (action === 'newVersion-all') {
      pasteItems = pasteItems.map(item => 
        item.status === 'conflict' ? { ...item, status: 'resolved' as const, conflictMode: 'newVersion' as ConflictMode } : item
      );
    } else if (action === 'copy-all') {
      pasteItems = pasteItems.map(item => 
        item.status === 'conflict' ? { ...item, status: 'resolved' as const, conflictMode: 'copy' as ConflictMode } : item
      );
    } else if (action === 'skip') {
      pasteItems = pasteItems.map(item => 
        item.clipboardItem.id === itemId ? { ...item, status: 'skipped' as const } : item
      );
    } else {
      // overwrite, newVersion, copy
      pasteItems = pasteItems.map(item => 
        item.clipboardItem.id === itemId ? { ...item, status: 'resolved' as const, conflictMode: action as ConflictMode } : item
      );
    }
  }

  async function handlePasteConfirm() {
    await executePaste();
  }

  function handlePasteCancel() {
    if (!isPasting) {
      pasteConflictDialogOpen = false;
      pasteItems = [];
      isPasteComplete = false;
    }
  }

  async function executePaste() {
    const targetFolderId = knowledgeStore.currentFolderId;
    isPasting = true;
    
    for (let i = 0; i < pasteItems.length; i++) {
      const item = pasteItems[i];
      
      if (item.status === 'skipped') continue;
      
      // Update status to processing
      pasteItems = pasteItems.map((p, idx) => 
        idx === i ? { ...p, status: 'processing' as const } : p
      );
      
      try {
        const isSameFolder = item.clipboardItem.sourceFolderId === targetFolderId;
        
        if (item.clipboardItem.type === 'folder') {
          if (item.clipboardItem.action === 'cut') {
            // Move folder - skip if same folder
            if (isSameFolder) {
              throw new Error(t('page.knowledge.cannotMoveToSameFolder'));
            }
            await api.files.postApiFilesFoldersByIdMove(
              { id: item.clipboardItem.id },
              { targetParentId: targetFolderId }
            );
          } else {
            // Copy folder - not supported yet
            throw new Error(t('page.knowledge.copyFolderNotSupported'));
          }
        } else if (item.clipboardItem.type === 'file') {
          // Handle file paste with conflict modes using fileUploadForce (like drag-and-drop upload)
          const hasConflict = item.conflictMode && item.existingFileId;
          
          if (item.clipboardItem.action === 'cut') {
            // CUT operation
            if (isSameFolder && !hasConflict) {
              // Cut to same folder without conflict - nothing to do
              throw new Error(t('page.knowledge.cannotMoveToSameFolder'));
            }
            
            if (hasConflict) {
              // Has conflict - use fileUploadForce approach
              // 1. Download source file content via presigned URL
              const { content, mimeType } = await downloadFileAsBase64(item.clipboardItem.id);
              
              // 2. Upload using fileUploadForce with conflict mode
              await api.files.postApiFilesUploadForce({
                folderId: targetFolderId ?? null,
                name: item.clipboardItem.name,
                content,
                mimeType,
                conflictMode: mapConflictMode(item.conflictMode!),
                existingFileId: item.existingFileId,
              });
              
              // 3. Delete source file (since it's a cut operation)
              await api.knowledge.deleteApiKnowledgeFileById({ id: item.clipboardItem.id });
            } else {
              // No conflict - simple move
              await api.files.postApiFilesByIdMove(
                { id: item.clipboardItem.id },
                { targetFolderId }
              );
            }
          } else {
            // COPY operation
            if (hasConflict && item.conflictMode === 'copy') {
              // Copy mode - use fileCopyAsDuplicate API (S3 copy, auto-generate unique name)
              await api.files.postApiFilesByIdCopyAsDuplicate(
                { id: item.clipboardItem.id },
                { targetFolderId: targetFolderId ?? null }
              );
            } else if (hasConflict) {
              // Has conflict with overwrite or newVersion mode - use fileUploadForce approach
              // 1. Download source file content via presigned URL
              const { content, mimeType } = await downloadFileAsBase64(item.clipboardItem.id);
              
              // 2. Upload using fileUploadForce with conflict mode
              await api.files.postApiFilesUploadForce({
                folderId: targetFolderId ?? null,
                name: item.clipboardItem.name,
                content,
                mimeType,
                conflictMode: mapConflictMode(item.conflictMode!),
                existingFileId: item.existingFileId,
              });
            } else if (isSameFolder) {
              // Copy to same folder without conflict - use fileCopyAsDuplicate (S3 copy, auto-generate unique name)
              await api.files.postApiFilesByIdCopyAsDuplicate(
                { id: item.clipboardItem.id },
                { targetFolderId: targetFolderId ?? null }
              );
            } else {
              // Copy to different folder without conflict - simple copy
              await api.files.postApiFilesByIdCopy(
                { id: item.clipboardItem.id },
                { targetFolderId }
              );
            }
          }
        }
        
        // Update status to success
        pasteItems = pasteItems.map((p, idx) => 
          idx === i ? { ...p, status: 'success' as const } : p
        );
      } catch (err) {
        console.error(t('page.knowledge.pasteFailed') + ':', item.clipboardItem.name, err);
        const errorMessage = err instanceof Error ? err.message : t('page.knowledge.pasteFailed');
        pasteItems = pasteItems.map((p, idx) => 
          idx === i ? { ...p, status: 'error' as const, error: errorMessage } : p
        );
      }
    }
    
    isPasting = false;
    isPasteComplete = true;
    knowledgeStore.clearClipboard();
    await knowledgeStore.refresh();
    
    // If dialog wasn't open (no conflicts), don't show it
    if (!pasteConflictDialogOpen) {
      pasteItems = [];
    }
  }

  // Helper function to download file content as base64
  async function downloadFileAsBase64(fileId: string): Promise<{ content: string; mimeType: string }> {
    // Get presigned download URL
    const urlRes = await api.files.getApiFilesByIdDownloadUrl({ id: fileId });
    if (!urlRes.data?.url) {
      throw new Error(t('page.knowledge.getDownloadUrlFailed'));
    }
    
    // Fetch file content
    const response = await fetch(urlRes.data.url);
    if (!response.ok) {
      throw new Error(t('page.knowledge.downloadFileFailed'));
    }
    
    const blob = await response.blob();
    const mimeType = blob.type || 'application/octet-stream';
    
    // Convert blob to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:application/octet-stream;base64,")
        const base64 = result.split(',')[1] || result;
        resolve({ content: base64, mimeType });
      };
      reader.onerror = () => reject(new Error(t('page.knowledge.readFileContentFailed')));
      reader.readAsDataURL(blob);
    });
  }

  async function handleBatchDelete() {
    if (!confirm(t('page.knowledge.confirmDeleteSelected'))) return;
    await knowledgeStore.deleteSelected();
  }

  // Folder context menu handlers
  function handleRenameFolder(f: FolderItem) {
    renameTarget = { type: 'folder', id: f.id, name: f.name };
    renameDialogOpen = true;
  }

  async function handleDeleteFolder(f: FolderItem) {
    if (!confirm(t('page.knowledge.confirmDeleteFolder').replace('${name}', f.name))) return;
    await knowledgeStore.deleteFolder(f);
  }

  function handleDownloadFolder(f: FolderItem) {
    console.log('下载文件夹', f.name);
  }

  function handleShowFolderInfo(f: FolderItem) {
    descriptionTarget = {
      type: 'folder',
      id: f.id,
      name: f.name,
      description: f.description,
      readOnly: true,
    };
    descriptionDialogOpen = true;
  }

  function handleEditFolderDescription(f: FolderItem) {
    descriptionTarget = {
      type: 'folder',
      id: f.id,
      name: f.name,
      description: f.description,
      readOnly: false,
    };
    descriptionDialogOpen = true;
  }

  function handleEditFolderStyle(f: FolderItem) {
    styleTarget = f;
    folderStyleDialogOpen = true;
  }

  function handleEditFolderPermission(f: FolderItem) {
    permissionTarget = {
      type: 'folder',
      id: f.id,
      name: f.name,
      isPublic: f.isPublic,
    };
    permissionSheetOpen = true;
  }

  // File context menu handlers
  function handleRenameFile(f: FileItem) {
    renameTarget = { type: 'file', id: f.id, name: f.name };
    renameDialogOpen = true;
  }

  async function handleDeleteFile(f: FileItem) {
    if (!confirm(t('page.knowledge.confirmDeleteFile').replace('${name}', f.name))) return;
    await knowledgeStore.deleteFile(f);
  }

  async function handleDownloadFile(f: FileItem) {
    // TODO: Use api.files.getApiFilesIdDownloadUrl after API regeneration
    console.log('下载文件:', f.name);
  }

  function handleShowFileInfo(f: FileItem) {
    descriptionTarget = {
      type: 'file',
      id: f.id,
      name: f.name,
      description: f.description,
      readOnly: true,
    };
    descriptionDialogOpen = true;
  }

  function handleEditFileDescription(f: FileItem) {
    descriptionTarget = {
      type: 'file',
      id: f.id,
      name: f.name,
      description: f.description,
      readOnly: false,
    };
    descriptionDialogOpen = true;
  }

  function handleEditFile(f: FileItem) {
    goto(`/dashboard/files/${f.folderId || 'root'}/edit/${f.id}`);
  }

  function handleFileDoubleClick(f: FileItem) {
    goto(`/dashboard/files/${f.folderId || 'root'}/edit/${f.id}`);
  }

  function handleEditFilePermission(f: FileItem) {
    permissionTarget = {
      type: 'file',
      id: f.id,
      name: f.name,
      isPublic: f.isPublic,
    };
    permissionSheetOpen = true;
  }

  function handleViewFileVersions(f: FileItem) {
    versionTarget = {
      fileId: f.id,
      fileName: f.name,
    };
    versionSheetOpen = true;
  }

  // Dialog callbacks
  async function handleRename(newName: string) {
    if (!renameTarget) return;
    // TODO: Use api.files rename endpoints after API regeneration
    console.log('重命名', renameTarget.type, renameTarget.id, '->', newName);
    renameDialogOpen = false;
    renameTarget = null;
    await knowledgeStore.refresh();
  }

  async function handleSaveDescription(desc: string | null) {
    if (!descriptionTarget) return;
    // TODO: Use api.files description endpoints after API regeneration
    console.log('保存简介', descriptionTarget.type, descriptionTarget.id, desc);
    descriptionDialogOpen = false;
    descriptionTarget = null;
    await knowledgeStore.refresh();
  }

  async function handleSaveFolderStyle(icon: string | null, color: string | null) {
    if (!styleTarget) return;
    try {
      await api.files.putApiFilesFoldersByIdStyle(
        { id: styleTarget.id },
        { icon, color }
      );
      folderStyleDialogOpen = false;
      styleTarget = null;
      await knowledgeStore.refresh();
    } catch (err) {
      console.error(t('page.knowledge.saveFolderStyleFailed'), err);
    }
  }

  // Map local types to API enum types
  function mapConflictMode(mode: ConflictMode): PostApiKnowledgeUploadForceConflictModeEnum {
    // Only 'overwrite' and 'newVersion' are supported by the API
    // 'skip' is handled client-side, 'copy' falls back to 'newVersion'
    if (mode === 'overwrite') {
      return PostApiKnowledgeUploadForceConflictModeEnum.Overwrite;
    }
    return PostApiKnowledgeUploadForceConflictModeEnum.NewVersion;
  }

  async function handleSavePermission(isPublic: boolean, permissions: PermissionGrantee[]) {
    if (!permissionTarget) return;
    try {
      // Update isPublic on the resource
      if (permissionTarget.type === 'folder') {
        await api.knowledge.putApiKnowledgeFolderById(
          { id: permissionTarget.id },
          { data: { isPublic, updatedBy: '' } }
        );
      } else {
        await api.knowledge.putApiKnowledgeFileById(
          { id: permissionTarget.id },
          { data: { isPublic, updatedBy: '' } }
        );
      }

      // Set permissions using Casbin-based file permission API
      await api.files.postApiFilesPermissionByResourceTypeByResourceId(
        { resourceType: permissionTarget.type, resourceId: permissionTarget.id },
        { permissions: permissions.map(p => ({
          subjectType: p.subjectType,
          subjectId: p.subjectId,
          permission: p.permission,
          effect: p.effect,
        })) }
      );

      permissionSheetOpen = false;
      permissionTarget = null;
      await knowledgeStore.refresh();
    } catch (err) {
      console.error(t('page.knowledge.savePermissionFailed') + ':', err);
    }
  }

  // Drag and drop
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
  }

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    const items = e.dataTransfer?.items;
    if (!items) return;

    const fileList: UploadItem[] = [];
    let idCounter = 0;

    // 递归遍历文件夹
    async function traverseEntry(entry: FileSystemEntry, path: string): Promise<void> {
      if (entry.isFile) {
        const fileEntry = entry as FileSystemFileEntry;
        return new Promise((resolve) => {
          fileEntry.file((file) => {
            fileList.push({
              id: `upload-${idCounter++}`,
              file,
              relativePath: path + file.name,
              status: 'pending',
              progress: 0,
              targetFolderId: knowledgeStore.currentFolderId,
            });
            resolve();
          });
        });
      } else if (entry.isDirectory) {
        const dirEntry = entry as FileSystemDirectoryEntry;
        const reader = dirEntry.createReader();
        return new Promise((resolve) => {
          const readEntries = () => {
            reader.readEntries(async (entries) => {
              if (entries.length === 0) {
                resolve();
                return;
              }
              for (const childEntry of entries) {
                await traverseEntry(childEntry, path + entry.name + '/');
              }
              readEntries();
            });
          };
          readEntries();
        });
      }
    }

    const promises: Promise<void>[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          promises.push(traverseEntry(entry, ''));
        }
      }
    }

    await Promise.all(promises);

    if (fileList.length > 0) {
      uploadItems = fileList;
      await checkForDuplicates();
      uploadDialogOpen = true;
    }
  }

  // Check for duplicate files
  async function checkForDuplicates() {
    const folderPaths = new Set<string>();
    folderPaths.add('');
    
    for (const item of uploadItems) {
      const parts = item.relativePath.split('/');
      if (parts.length > 1) {
        let path = '';
        for (let i = 0; i < parts.length - 1; i++) {
          path = path ? `${path}/${parts[i]}` : parts[i];
          folderPaths.add(path);
        }
      }
    }

    const folderMap = new Map<string, string | null>();
    folderMap.set('', knowledgeStore.currentFolderId);

    const sortedPaths = Array.from(folderPaths)
      .filter(p => p !== '')
      .sort((a, b) => a.split('/').length - b.split('/').length);

    for (const folderPath of sortedPaths) {
      const parts = folderPath.split('/');
      const folderName = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join('/');
      const parentFolderId = folderMap.get(parentPath);
      
      if (parentFolderId === 'NEW') {
        folderMap.set(folderPath, 'NEW');
        continue;
      }
      
      const parentId = parentFolderId ?? knowledgeStore.currentFolderId;

      try {
        const res = await api.knowledge.postApiKnowledgeFolderQuery({
          filter: { parentId, names: [folderName] },
          limit: 1,
        });
        if (res.data?.data?.length) {
          folderMap.set(folderPath, res.data.data[0].id);
        } else {
          folderMap.set(folderPath, 'NEW');
        }
      } catch {
        folderMap.set(folderPath, 'NEW');
      }
    }

    const filesByFolder = new Map<string, string[]>();
    for (const item of uploadItems) {
      const parts = item.relativePath.split('/');
      const fileName = parts[parts.length - 1];
      const folderPath = parts.slice(0, -1).join('/');
      
      if (!filesByFolder.has(folderPath)) {
        filesByFolder.set(folderPath, []);
      }
      filesByFolder.get(folderPath)!.push(fileName);
    }

    const existingFilesMap = new Map<string, Map<string, string>>();
    
    for (const [folderPath, fileNames] of filesByFolder.entries()) {
      const folderId = folderMap.get(folderPath);
      
      if (folderId === 'NEW') {
        existingFilesMap.set(folderPath, new Map());
        continue;
      }
      
      try {
        const res = await api.files.postApiFilesCheckExists({
          folderId: folderId ?? null,
          names: fileNames,
        });
        
        const filesInFolder = new Map<string, string>();
        if (res.data?.exists) {
          for (const existing of res.data.exists) {
            filesInFolder.set(existing.name, existing.fileId);
          }
        }
        existingFilesMap.set(folderPath, filesInFolder);
      } catch {
        try {
          const res = await api.knowledge.postApiKnowledgeFileQuery({
            filter: { folderId },
            limit: 100,
          });
          const filesInFolder = new Map<string, string>();
          for (const file of res.data?.data || []) {
            filesInFolder.set(file.name, file.id);
          }
          existingFilesMap.set(folderPath, filesInFolder);
        } catch {
          existingFilesMap.set(folderPath, new Map());
        }
      }
    }

    uploadItems = uploadItems.map(item => {
      const parts = item.relativePath.split('/');
      const fileName = parts[parts.length - 1];
      const folderPath = parts.slice(0, -1).join('/');
      
      const filesInFolder = existingFilesMap.get(folderPath);
      if (filesInFolder?.has(fileName)) {
        return {
          ...item,
          status: 'duplicate' as const,
          existingFileId: filesInFolder.get(fileName),
        };
      }
      return item;
    });
  }

  // Handle duplicate file actions
  function handleDuplicate(itemId: string, action: ConflictMode | 'skip-all' | 'overwrite-all' | 'newVersion-all' | 'copy-all') {
    if (action === 'skip-all') {
      uploadItems = uploadItems.map(item => 
        item.status === 'duplicate' ? { ...item, status: 'skipped' as const } : item
      );
    } else if (action === 'overwrite-all') {
      uploadItems = uploadItems.map(item => 
        item.status === 'duplicate' ? { ...item, status: 'pending' as const, conflictMode: 'overwrite' as ConflictMode } : item
      );
    } else if (action === 'newVersion-all') {
      uploadItems = uploadItems.map(item => 
        item.status === 'duplicate' ? { ...item, status: 'pending' as const, conflictMode: 'newVersion' as ConflictMode } : item
      );
    } else if (action === 'copy-all') {
      uploadItems = uploadItems.map(item => 
        item.status === 'duplicate' ? { ...item, status: 'pending' as const, conflictMode: 'copy' as ConflictMode } : item
      );
    } else if (action === 'skip') {
      uploadItems = uploadItems.map(item => 
        item.id === itemId ? { ...item, status: 'skipped' as const } : item
      );
    } else if (action === 'overwrite' || action === 'newVersion' || action === 'copy') {
      uploadItems = uploadItems.map(item => 
        item.id === itemId ? { ...item, status: 'pending' as const, conflictMode: action as ConflictMode } : item
      );
    }
  }

  // 开始上传
  async function handleStartUpload() {
    if (uploadItems.length === 0) return;
    
    const itemsToUpload = uploadItems.filter(i => i.status !== 'skipped');
    if (itemsToUpload.length === 0) {
      isUploadComplete = true;
      return;
    }
    
    isUploading = true;

    const folderPaths = new Set<string>();
    for (const item of itemsToUpload) {
      const parts = item.relativePath.split('/');
      if (parts.length > 1) {
        let path = '';
        for (let i = 0; i < parts.length - 1; i++) {
          path = path ? `${path}/${parts[i]}` : parts[i];
          folderPaths.add(path);
        }
      }
    }

    const folderMap = new Map<string, string | null>();
    folderMap.set('', knowledgeStore.currentFolderId);

    const sortedPaths = Array.from(folderPaths).sort((a, b) => 
      a.split('/').length - b.split('/').length
    );

    for (const folderPath of sortedPaths) {
      const parts = folderPath.split('/');
      const folderName = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join('/');
      const parentFolderId = folderMap.get(parentPath);
      
      if (parentFolderId === '__FAILED__') {
        folderMap.set(folderPath, '__FAILED__');
        continue;
      }
      
      const parentId = parentFolderId ?? knowledgeStore.currentFolderId;

      try {
        const existingFolderRes = await api.knowledge.postApiKnowledgeFolderQuery({
          filter: { parentId, names: [folderName] },
          limit: 1,
        });
        
        if (existingFolderRes.data?.data?.length) {
          folderMap.set(folderPath, existingFolderRes.data.data[0].id);
        } else {
          const res = await api.knowledge.postApiKnowledgeFolder({
            data: {
              parentId: parentId ?? null,
              name: folderName,
              path: '/',
              createdBy: '',
              updatedBy: '',
            },
          });
          if (res.data?.id) {
            folderMap.set(folderPath, res.data.id);
          } else {
            throw new Error('创建文件夹失败：未返回ID');
          }
        }
      } catch (err) {
        console.error('创建文件夹失败', folderPath, err);
        folderMap.set(folderPath, '__FAILED__');
      }
    }

    for (let i = 0; i < uploadItems.length; i++) {
      const item = uploadItems[i];
      
      if (item.status === 'skipped') continue;
      
      uploadItems = uploadItems.map((u, idx) => 
        idx === i ? { ...u, status: 'uploading' as const, progress: 0 } : u
      );

      try {
        const parts = item.relativePath.split('/');
        const folderPath = parts.slice(0, -1).join('/');
        const targetFolderId = folderPath ? folderMap.get(folderPath) : knowledgeStore.currentFolderId;

        if (targetFolderId === '__FAILED__') {
          throw new Error(t('page.knowledge.targetFolderCreateFailed'));
        }

        const content = await readFileAsBase64(item.file);
        
        uploadItems = uploadItems.map((u, idx) => 
          idx === i ? { ...u, progress: 30 } : u
        );

        if (item.conflictMode && item.existingFileId) {
          await api.files.postApiFilesUploadForce({
            folderId: targetFolderId ?? null,
            name: item.file.name,
            content,
            mimeType: item.file.type || 'application/octet-stream',
            conflictMode: mapConflictMode(item.conflictMode),
            existingFileId: item.existingFileId,
          });
        } else {
          const uploadRes = await api.files.postApiFilesUpload({
            folderId: targetFolderId ?? null,
            name: item.file.name,
            content,
            mimeType: item.file.type || 'application/octet-stream',
          });
          
          if (uploadRes.data && !uploadRes.data.success && uploadRes.data.conflict) {
            throw new Error(t('page.knowledge.fileExists').replace('${name}', uploadRes.data.conflict.name));
          }
        }

        uploadItems = uploadItems.map((u, idx) => 
          idx === i ? { ...u, status: 'success' as const, progress: 100 } : u
        );
      } catch (err) {
        console.error(t('page.knowledge.uploadFailed') + ':', item.file.name, err);
        const errorMessage = err instanceof Error ? err.message : t('page.knowledge.uploadFailed');
        uploadItems = uploadItems.map((u, idx) => 
          idx === i ? { ...u, status: 'error' as const, error: errorMessage } : u
        );
      }
    }

    isUploading = false;
    isUploadComplete = true;
    await knowledgeStore.refresh();
  }

  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function handleCancelUpload() {
    if (!isUploading) {
      uploadDialogOpen = false;
      uploadItems = [];
      isUploadComplete = false;
    }
  }

  onMount(() => knowledgeStore.init());
</script>

<div
  class="px-4 lg:px-6 flex-1 flex flex-col min-h-0"
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
  role="region"
  aria-label={t('page.knowledge.fileManageArea')}
>
  <div class={`${isDragging ? 'ring-2 ring-primary ring-offset-2' : ''} flex-1 flex gap-2 flex-col min-h-0`}>
    <div class="flex items-center justify-between">
      <FileBreadcrumb pathStack={knowledgeStore.pathStack} onNavigate={knowledgeStore.navigateToPath} />
      <FileToolbar
        hasSelection={knowledgeStore.hasSelection}
        hasClipboard={knowledgeStore.hasClipboard}
        clipboardCount={knowledgeStore.clipboardCount}
        onNewFolder={() => (newFolderDialogOpen = true)}
        onNewTextFile={handleNewTextFile}
        onCopy={knowledgeStore.copySelected}
        onPaste={handlePaste}
        onDelete={handleBatchDelete}
        onSearch={() => (searchOpen = true)}
        onRefresh={knowledgeStore.refresh}
      />
    </div>
    <div class="flex-1 flex flex-col min-h-0">
      {#if isDragging}
        <div
          class="flex items-center justify-center h-48 border-2 border-dashed border-primary rounded-lg bg-primary/5"
        >
          <div class="text-center">
            <p class="text-lg font-medium text-primary">{t('page.knowledge.releaseToUpload')}</p>
            <p class="text-sm text-muted-foreground">{t('page.knowledge.supportDragFolder')}</p>
          </div>
        </div>
      {:else}
        <FileList
          loading={knowledgeStore.loading}
          folders={knowledgeStore.folders}
          files={knowledgeStore.files}
          currentFolderId={knowledgeStore.currentFolderId}
          selectedFolderIds={knowledgeStore.selectedFolderIds}
          selectedFileIds={knowledgeStore.selectedFileIds}
          onNavigateUp={knowledgeStore.navigateUp}
          onNavigateToFolder={knowledgeStore.navigateToFolder}
          onToggleSelectAll={knowledgeStore.toggleSelectAll}
          onToggleFolderSelect={knowledgeStore.toggleFolderSelect}
          onToggleFileSelect={knowledgeStore.toggleFileSelect}
          onCopyFolder={knowledgeStore.copyFolder}
          onCutFolder={knowledgeStore.cutFolder}
          onRenameFolder={handleRenameFolder}
          onDeleteFolder={handleDeleteFolder}
          onDownloadFolder={handleDownloadFolder}
          onShowFolderInfo={handleShowFolderInfo}
          onEditFolderDescription={handleEditFolderDescription}
          onEditFolderStyle={handleEditFolderStyle}
          onEditFolderPermission={handleEditFolderPermission}
          onCopyFile={knowledgeStore.copyFile}
          onCutFile={knowledgeStore.cutFile}
          onRenameFile={handleRenameFile}
          onDeleteFile={handleDeleteFile}
          onDownloadFile={handleDownloadFile}
          onShowFileInfo={handleShowFileInfo}
          onEditFileDescription={handleEditFileDescription}
          onEditFile={handleEditFile}
          onEditFilePermission={handleEditFilePermission}
          onViewFileVersions={handleViewFileVersions}
          onFileDoubleClick={handleFileDoubleClick}
        />
      {/if}
    </div>
  </div>
</div>

<NewFolderDialog
  open={newFolderDialogOpen}
  onOpenChange={(o) => (newFolderDialogOpen = o)}
  onCreate={handleCreateFolder}
/>
<SearchDialog open={searchOpen} onOpenChange={(o) => (searchOpen = o)} onSearch={handleSearch} />
<RenameDialog
  open={renameDialogOpen}
  onOpenChange={(o) => (renameDialogOpen = o)}
  currentName={renameTarget?.name || ''}
  onRename={handleRename}
/>
<DescriptionDialog
  open={descriptionDialogOpen}
  onOpenChange={(o) => (descriptionDialogOpen = o)}
  title={descriptionTarget?.name || ''}
  currentDescription={descriptionTarget?.description || null}
  readOnly={descriptionTarget?.readOnly || false}
  onSave={handleSaveDescription}
/>
<FolderStyleDialog
  open={folderStyleDialogOpen}
  onOpenChange={(o) => (folderStyleDialogOpen = o)}
  folderName={styleTarget?.name || ''}
  currentIcon={styleTarget?.icon || null}
  currentColor={styleTarget?.color || null}
  onSave={handleSaveFolderStyle}
/>
<UploadDialog
  open={uploadDialogOpen}
  onOpenChange={(o) => (uploadDialogOpen = o)}
  items={uploadItems}
  onStartUpload={handleStartUpload}
  onCancel={handleCancelUpload}
  onHandleDuplicate={handleDuplicate}
  {isUploading}
  isComplete={isUploadComplete}
  {hasDuplicates}
/>
<PermissionSheet
  open={permissionSheetOpen}
  onOpenChange={(o: boolean) => (permissionSheetOpen = o)}
  resourceType={permissionTarget?.type || 'folder'}
  resourceId={permissionTarget?.id || ''}
  resourceName={permissionTarget?.name || ''}
  isPublic={permissionTarget?.isPublic || false}
  onSave={handleSavePermission}
/>
<VersionSheet
  open={versionSheetOpen}
  onOpenChange={(o: boolean) => (versionSheetOpen = o)}
  fileId={versionTarget?.fileId || ''}
  fileName={versionTarget?.fileName || ''}
/>
<PasteConflictDialog
  open={pasteConflictDialogOpen}
  onOpenChange={(o: boolean) => (pasteConflictDialogOpen = o)}
  items={pasteItems}
  onResolve={handlePasteResolve}
  onConfirm={handlePasteConfirm}
  onCancel={handlePasteCancel}
  {isPasting}
  isComplete={isPasteComplete}
/>
