<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth.svelte';
  import { knowledgeStore, type FolderItem, type FileItem } from '$lib/stores/knowledge.svelte';
  import { 
    PostApiKnowledgeUploadForceConflictModeEnum,
    PostApiKnowledgeNodesTypeEnum,
  } from '@qiyu-allinai/api';
  import {
    FileBreadcrumb,
    FileToolbar,
    FileList,
    NewFolderDialog,
    SearchDialog,
    RenameDialog,
    DescriptionSheet,
    FolderStyleDialog,
    UploadDialog,
    PermissionSheet,
    VersionSheet,
    PasteConflictDialog,
    type UploadItem,
    type PermissionGrantee,
    type ConflictMode,
    type PasteConflictItem,
  } from '../components';

  // Dialog state
  let searchOpen = $state(false);
  let newFolderDialogOpen = $state(false);
  let renameDialogOpen = $state(false);
  let descriptionSheetOpen = $state(false);
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

  // Drag state
  let isDragging = $state(false);

  // Dialog targets
  interface RenameTarget { type: 'folder' | 'file'; id: string; name: string; }
  interface DescriptionTarget { type: 'folder' | 'file'; id: string; name: string; description: string | null; readOnly: boolean; }
  interface PermissionTarget { type: 'folder' | 'file'; id: string; name: string; isPublic: boolean; }
  interface VersionTarget { fileId: string; fileName: string; }

  let renameTarget = $state<RenameTarget | null>(null);
  let descriptionTarget = $state<DescriptionTarget | null>(null);
  let styleTarget = $state<FolderItem | null>(null);
  let permissionTarget = $state<PermissionTarget | null>(null);
  let versionTarget = $state<VersionTarget | null>(null);

  const api = authStore.createApi(true);

  async function handleCreateFolder(name: string) {
    await knowledgeStore.createFolder(name);
    newFolderDialogOpen = false;
  }

  function handleNewTextFile() {
    goto(`/dashboard/knowledge/my-files/${knowledgeStore.currentFolderId || 'root'}/create-text-file`);
  }

  function handleSearch(query: string) {
    console.log('搜索:', query);
    searchOpen = false;
  }

  async function handlePaste() {
    if (!knowledgeStore.hasClipboard) return;
    const targetFolderId = knowledgeStore.currentFolderId;
    const items: PasteConflictItem[] = knowledgeStore.clipboard.map(item => ({ clipboardItem: item, status: 'pending' as const }));
    
    const fileItems = items.filter(i => i.clipboardItem.type === 'file');
    if (fileItems.length > 0) {
      try {
        const res = await api.knowledge.postApiKnowledgeNodesCheckExists({ 
          parentId: targetFolderId ?? null, 
          names: fileItems.map(i => i.clipboardItem.name),
          type: PostApiKnowledgeNodesTypeEnum.File,
        });
        if (res.data?.exists?.length) {
          const existingMap = new Map(res.data.exists.map((e: { name: string; nodeId: string }) => [e.name, e.nodeId]));
          for (const item of items) {
            if (item.clipboardItem.type === 'file' && existingMap.has(item.clipboardItem.name)) {
              const existingFileId = existingMap.get(item.clipboardItem.name);
              const isSameFolder = item.clipboardItem.sourceFolderId === targetFolderId;
              const isSameFile = existingFileId === item.clipboardItem.id;
              if ((isSameFolder && isSameFile && item.clipboardItem.action === 'copy') || !isSameFile) {
                item.status = 'conflict';
                item.existingFileId = existingFileId;
              }
            }
          }
        }
      } catch (err) { console.error('检查文件冲突失败', err); }
    }
    
    pasteItems = items;
    if (items.some(i => i.status === 'conflict')) {
      isPasting = false; isPasteComplete = false; pasteConflictDialogOpen = true;
    } else { await executePaste(); }
  }

  function handlePasteResolve(itemId: string, action: ConflictMode | 'skip' | 'skip-all' | 'overwrite-all' | 'newVersion-all' | 'copy-all') {
    const updateStatus = (status: 'skipped' | 'resolved', mode?: ConflictMode) => 
      pasteItems.map(item => item.status === 'conflict' ? { ...item, status, ...(mode && { conflictMode: mode }) } : item);
    if (action === 'skip-all') pasteItems = updateStatus('skipped');
    else if (action === 'overwrite-all') pasteItems = updateStatus('resolved', 'overwrite');
    else if (action === 'newVersion-all') pasteItems = updateStatus('resolved', 'newVersion');
    else if (action === 'copy-all') pasteItems = updateStatus('resolved', 'copy');
    else if (action === 'skip') pasteItems = pasteItems.map(item => item.clipboardItem.id === itemId ? { ...item, status: 'skipped' as const } : item);
    else pasteItems = pasteItems.map(item => item.clipboardItem.id === itemId ? { ...item, status: 'resolved' as const, conflictMode: action as ConflictMode } : item);
  }

  async function handlePasteConfirm() { await executePaste(); }
  function handlePasteCancel() { if (!isPasting) { pasteConflictDialogOpen = false; pasteItems = []; isPasteComplete = false; } }

  async function executePaste() {
    const targetFolderId = knowledgeStore.currentFolderId;
    isPasting = true;
    for (let i = 0; i < pasteItems.length; i++) {
      const item = pasteItems[i];
      if (item.status === 'skipped') continue;
      pasteItems = pasteItems.map((p, idx) => idx === i ? { ...p, status: 'processing' as const } : p);
      try {
        const isSameFolder = item.clipboardItem.sourceFolderId === targetFolderId;
        if (item.clipboardItem.type === 'folder') {
          if (item.clipboardItem.action === 'cut') {
            if (isSameFolder) throw new Error('不能移动到同一文件夹');
            await api.knowledge.postApiKnowledgeNodesByIdMove({ id: item.clipboardItem.id }, { targetParentId: targetFolderId });
          } else {
            await api.knowledge.postApiKnowledgeNodesByIdCopy({ id: item.clipboardItem.id }, { targetParentId: targetFolderId });
          }
        } else {
          const hasConflict = item.conflictMode && item.existingFileId;
          if (item.clipboardItem.action === 'cut') {
            if (isSameFolder && !hasConflict) throw new Error('不能移动到同一文件夹');
            if (hasConflict) {
              const { content, mimeType } = await downloadFileAsBase64(item.clipboardItem.id);
              await api.knowledge.postApiKnowledgeUploadForce({ 
                parentId: targetFolderId ?? null, 
                name: item.clipboardItem.name, 
                content, 
                mimeType, 
                conflictMode: mapConflictMode(item.conflictMode!), 
                existingNodeId: item.existingFileId 
              });
              await api.knowledge.deleteApiKnowledgeNodesById({ id: item.clipboardItem.id });
            } else {
              await api.knowledge.postApiKnowledgeNodesByIdMove({ id: item.clipboardItem.id }, { targetParentId: targetFolderId });
            }
          } else {
            if (hasConflict && item.conflictMode === 'copy') {
              // 复制为副本
              await api.knowledge.postApiKnowledgeNodesByIdCopy({ id: item.clipboardItem.id }, { targetParentId: targetFolderId ?? null });
            } else if (hasConflict) {
              const { content, mimeType } = await downloadFileAsBase64(item.clipboardItem.id);
              await api.knowledge.postApiKnowledgeUploadForce({ 
                parentId: targetFolderId ?? null, 
                name: item.clipboardItem.name, 
                content, 
                mimeType, 
                conflictMode: mapConflictMode(item.conflictMode!), 
                existingNodeId: item.existingFileId 
              });
            } else if (isSameFolder) {
              // 同文件夹复制为副本
              await api.knowledge.postApiKnowledgeNodesByIdCopy({ id: item.clipboardItem.id }, { targetParentId: targetFolderId ?? null });
            } else {
              await api.knowledge.postApiKnowledgeNodesByIdCopy({ id: item.clipboardItem.id }, { targetParentId: targetFolderId });
            }
          }
        }
        pasteItems = pasteItems.map((p, idx) => idx === i ? { ...p, status: 'success' as const } : p);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '粘贴失败';
        pasteItems = pasteItems.map((p, idx) => idx === i ? { ...p, status: 'error' as const, error: errorMessage } : p);
      }
    }
    isPasting = false; isPasteComplete = true; knowledgeStore.clearClipboard(); await knowledgeStore.refresh();
    if (!pasteConflictDialogOpen) pasteItems = [];
  }

  async function downloadFileAsBase64(fileId: string): Promise<{ content: string; mimeType: string }> {
    const urlRes = await api.knowledge.getApiKnowledgeNodesByIdDownloadUrl({ id: fileId });
    if (!urlRes.data?.url) throw new Error('获取下载链接失败');
    const response = await fetch(urlRes.data.url);
    if (!response.ok) throw new Error('下载文件失败');
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ content: (reader.result as string).split(',')[1] || '', mimeType: blob.type || 'application/octet-stream' });
      reader.onerror = () => reject(new Error('读取文件内容失败'));
      reader.readAsDataURL(blob);
    });
  }

  function mapConflictMode(mode: ConflictMode): PostApiKnowledgeUploadForceConflictModeEnum {
    return mode === 'overwrite' ? PostApiKnowledgeUploadForceConflictModeEnum.Overwrite : PostApiKnowledgeUploadForceConflictModeEnum.NewVersion;
  }

  async function handleBatchDelete() { if (confirm('确定要删除选中的项目吗？')) await knowledgeStore.deleteSelected(); }

  // Folder handlers
  function handleRenameFolder(f: FolderItem) { renameTarget = { type: 'folder', id: f.id, name: f.name }; renameDialogOpen = true; }
  async function handleDeleteFolder(f: FolderItem) { if (confirm(`确定要删除文件夹 "${f.name}" 吗？`)) await knowledgeStore.deleteFolder(f); }
  function handleDownloadFolder(f: FolderItem) { console.log('下载文件夹', f.name); }
  function handleShowFolderInfo(f: FolderItem) { descriptionTarget = { type: 'folder', id: f.id, name: f.name, description: f.description, readOnly: true }; descriptionSheetOpen = true; }
  function handleEditFolderDescription(f: FolderItem) { descriptionTarget = { type: 'folder', id: f.id, name: f.name, description: f.description, readOnly: false }; descriptionSheetOpen = true; }
  function handleEditFolderStyle(f: FolderItem) { styleTarget = f; folderStyleDialogOpen = true; }
  function handleEditFolderPermission(f: FolderItem) { permissionTarget = { type: 'folder', id: f.id, name: f.name, isPublic: f.isPublic }; permissionSheetOpen = true; }

  // File handlers
  function handleRenameFile(f: FileItem) { renameTarget = { type: 'file', id: f.id, name: f.name }; renameDialogOpen = true; }
  async function handleDeleteFile(f: FileItem) { if (confirm(`确定要删除文件 "${f.name}" 吗？`)) await knowledgeStore.deleteFile(f); }
  function handleDownloadFile(f: FileItem) { console.log('下载文件:', f.name); }
  function handleShowFileInfo(f: FileItem) { descriptionTarget = { type: 'file', id: f.id, name: f.name, description: f.description, readOnly: true }; descriptionSheetOpen = true; }
  function handleEditFileDescription(f: FileItem) { descriptionTarget = { type: 'file', id: f.id, name: f.name, description: f.description, readOnly: false }; descriptionSheetOpen = true; }
  function handleEditFile(f: FileItem) { goto(`/dashboard/knowledge/my-files/${f.folderId || 'root'}/edit/${f.id}`); }
  function handleFileDoubleClick(f: FileItem) { goto(`/dashboard/knowledge/my-files/${f.folderId || 'root'}/edit/${f.id}`); }
  function handleEditFilePermission(f: FileItem) { permissionTarget = { type: 'file', id: f.id, name: f.name, isPublic: f.isPublic }; permissionSheetOpen = true; }
  function handleViewFileVersions(f: FileItem) { versionTarget = { fileId: f.id, fileName: f.name }; versionSheetOpen = true; }

  // Dialog callbacks
  async function handleRename(newName: string) {
    if (!renameTarget) return;
    try {
      await api.knowledge.putApiKnowledgeNodesById({ id: renameTarget.id }, { name: newName });
      renameDialogOpen = false; renameTarget = null; await knowledgeStore.refresh();
    } catch (err) {
      console.error('重命名失败:', err);
    }
  }

  async function handleSaveDescription(desc: string | null) {
    if (!descriptionTarget) return;
    try {
      await api.knowledge.putApiKnowledgeNodesById({ id: descriptionTarget.id }, { description: desc });
      descriptionSheetOpen = false; descriptionTarget = null; await knowledgeStore.refresh();
    } catch (err) {
      console.error('保存描述失败:', err);
    }
  }

  async function handleSaveFolderStyle(icon: string | null, color: string | null) {
    if (!styleTarget) return;
    try {
      await api.knowledge.putApiKnowledgeNodesById({ id: styleTarget.id }, { icon, color });
      folderStyleDialogOpen = false; styleTarget = null; await knowledgeStore.refresh();
    } catch (err) { console.error('保存文件夹样式失败', err); }
  }

  async function handleSavePermission(isPublic: boolean, permissions: PermissionGrantee[]) {
    if (!permissionTarget) return;
    try {
      await api.knowledge.putApiKnowledgeNodesById({ id: permissionTarget.id }, { isPublic });
      // 设置权限
      await api.knowledge.putApiKnowledgeNodesByIdPermissions(
        { id: permissionTarget.id },
        { permissions: permissions.map(p => ({ subjectType: p.subjectType, subjectId: p.subjectId, permission: p.permission, effect: p.effect })) }
      );
      permissionSheetOpen = false; permissionTarget = null; await knowledgeStore.refresh();
    } catch (err) { console.error('保存权限失败:', err); }
  }

  // Drag and drop
  function handleDragOver(e: DragEvent) { e.preventDefault(); isDragging = true; }
  function handleDragLeave(e: DragEvent) { e.preventDefault(); isDragging = false; }

  async function handleDrop(e: DragEvent) {
    e.preventDefault(); isDragging = false;
    const items = e.dataTransfer?.items;
    if (!items) return;
    const fileList: UploadItem[] = [];
    let idCounter = 0;

    async function traverseEntry(entry: FileSystemEntry, path: string): Promise<void> {
      if (entry.isFile) {
        return new Promise((resolve) => {
          (entry as FileSystemFileEntry).file((file) => {
            fileList.push({ id: `upload-${idCounter++}`, file, relativePath: path + file.name, status: 'pending', progress: 0, targetFolderId: knowledgeStore.currentFolderId });
            resolve();
          });
        });
      } else if (entry.isDirectory) {
        const reader = (entry as FileSystemDirectoryEntry).createReader();
        return new Promise((resolve) => {
          const readEntries = () => {
            reader.readEntries(async (entries) => {
              if (entries.length === 0) { resolve(); return; }
              for (const childEntry of entries) await traverseEntry(childEntry, path + entry.name + '/');
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
        if (entry) promises.push(traverseEntry(entry, ''));
      }
    }
    await Promise.all(promises);
    if (fileList.length > 0) { uploadItems = fileList; await checkForDuplicates(); uploadDialogOpen = true; }
  }

  async function checkForDuplicates() {
    const folderPaths = new Set<string>(['']);
    for (const item of uploadItems) {
      const parts = item.relativePath.split('/');
      if (parts.length > 1) {
        let path = '';
        for (let i = 0; i < parts.length - 1; i++) { path = path ? `${path}/${parts[i]}` : parts[i]; folderPaths.add(path); }
      }
    }
    const folderMap = new Map<string, string | null>([['', knowledgeStore.currentFolderId]]);
    const sortedPaths = Array.from(folderPaths).filter(p => p !== '').sort((a, b) => a.split('/').length - b.split('/').length);
    for (const folderPath of sortedPaths) {
      const parts = folderPath.split('/');
      const folderName = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join('/');
      const parentFolderId = folderMap.get(parentPath);
      if (parentFolderId === 'NEW') { folderMap.set(folderPath, 'NEW'); continue; }
      try {
        const res = await api.knowledge.postApiKnowledgeNodesQuery({ 
          filter: { parentId: parentFolderId ?? knowledgeStore.currentFolderId, name: folderName, type: PostApiKnowledgeNodesTypeEnum.Folder }, 
          limit: 1 
        });
        folderMap.set(folderPath, res.data?.length ? res.data[0].id : 'NEW');
      } catch { folderMap.set(folderPath, 'NEW'); }
    }
    const filesByFolder = new Map<string, string[]>();
    for (const item of uploadItems) {
      const parts = item.relativePath.split('/');
      const folderPath = parts.slice(0, -1).join('/');
      if (!filesByFolder.has(folderPath)) filesByFolder.set(folderPath, []);
      filesByFolder.get(folderPath)!.push(parts[parts.length - 1]);
    }
    const existingFilesMap = new Map<string, Map<string, string>>();
    for (const [folderPath, fileNames] of filesByFolder.entries()) {
      const folderId = folderMap.get(folderPath);
      if (folderId === 'NEW') { existingFilesMap.set(folderPath, new Map()); continue; }
      try {
        const res = await api.knowledge.postApiKnowledgeNodesCheckExists({ 
          parentId: folderId ?? null, 
          names: fileNames,
          type: PostApiKnowledgeNodesTypeEnum.File,
        });
        existingFilesMap.set(folderPath, new Map(res.data?.exists?.map((e: { name: string; nodeId: string }) => [e.name, e.nodeId]) || []));
      } catch { existingFilesMap.set(folderPath, new Map()); }
    }
    uploadItems = uploadItems.map(item => {
      const parts = item.relativePath.split('/');
      const folderPath = parts.slice(0, -1).join('/');
      const existingFileId = existingFilesMap.get(folderPath)?.get(parts[parts.length - 1]);
      return existingFileId ? { ...item, status: 'duplicate' as const, existingFileId } : item;
    });
  }

  function handleDuplicate(itemId: string, action: ConflictMode | 'skip-all' | 'overwrite-all' | 'newVersion-all' | 'copy-all') {
    const updateAll = (status: 'skipped' | 'pending', mode?: ConflictMode) =>
      uploadItems.map(item => item.status === 'duplicate' ? { ...item, status, ...(mode && { conflictMode: mode }) } : item);
    if (action === 'skip-all') uploadItems = updateAll('skipped');
    else if (action === 'overwrite-all') uploadItems = updateAll('pending', 'overwrite');
    else if (action === 'newVersion-all') uploadItems = updateAll('pending', 'newVersion');
    else if (action === 'copy-all') uploadItems = updateAll('pending', 'copy');
    else if (action === 'skip') uploadItems = uploadItems.map(item => item.id === itemId ? { ...item, status: 'skipped' as const } : item);
    else uploadItems = uploadItems.map(item => item.id === itemId ? { ...item, status: 'pending' as const, conflictMode: action as ConflictMode } : item);
  }

  async function handleStartUpload() {
    if (uploadItems.length === 0) return;
    const itemsToUpload = uploadItems.filter(i => i.status !== 'skipped');
    if (itemsToUpload.length === 0) { isUploadComplete = true; return; }
    isUploading = true;

    const folderPaths = new Set<string>();
    for (const item of itemsToUpload) {
      const parts = item.relativePath.split('/');
      if (parts.length > 1) { let path = ''; for (let i = 0; i < parts.length - 1; i++) { path = path ? `${path}/${parts[i]}` : parts[i]; folderPaths.add(path); } }
    }
    const folderMap = new Map<string, string | null>([['', knowledgeStore.currentFolderId]]);
    const sortedPaths = Array.from(folderPaths).sort((a, b) => a.split('/').length - b.split('/').length);
    for (const folderPath of sortedPaths) {
      const parts = folderPath.split('/');
      const folderName = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join('/');
      const parentFolderId = folderMap.get(parentPath);
      if (parentFolderId === '__FAILED__') { folderMap.set(folderPath, '__FAILED__'); continue; }
      try {
        const existingRes = await api.knowledge.postApiKnowledgeNodesQuery({ 
          filter: { parentId: parentFolderId ?? knowledgeStore.currentFolderId, name: folderName, type: PostApiKnowledgeNodesTypeEnum.Folder }, 
          limit: 1 
        });
        if (existingRes.data?.length) folderMap.set(folderPath, existingRes.data[0].id);
        else {
          const res = await api.knowledge.postApiKnowledgeNodes({ 
            type: PostApiKnowledgeNodesTypeEnum.Folder,
            parentId: (parentFolderId ?? knowledgeStore.currentFolderId) ?? null, 
            name: folderName,
          });
          folderMap.set(folderPath, res.id ?? '__FAILED__');
        }
      } catch { folderMap.set(folderPath, '__FAILED__'); }
    }

    for (let i = 0; i < uploadItems.length; i++) {
      const item = uploadItems[i];
      if (item.status === 'skipped') continue;
      uploadItems = uploadItems.map((u, idx) => idx === i ? { ...u, status: 'uploading' as const, progress: 0 } : u);
      try {
        const parts = item.relativePath.split('/');
        const folderPath = parts.slice(0, -1).join('/');
        const targetFolderId = folderPath ? folderMap.get(folderPath) : knowledgeStore.currentFolderId;
        if (targetFolderId === '__FAILED__') throw new Error('目标文件夹创建失败');
        const content = await readFileAsBase64(item.file);
        uploadItems = uploadItems.map((u, idx) => idx === i ? { ...u, progress: 30 } : u);
        if (item.conflictMode && item.existingFileId) {
          await api.knowledge.postApiKnowledgeUploadForce({ 
            parentId: targetFolderId ?? null, 
            name: item.file.name, 
            content, 
            mimeType: item.file.type || 'application/octet-stream', 
            conflictMode: mapConflictMode(item.conflictMode), 
            existingNodeId: item.existingFileId 
          });
        } else {
          await api.knowledge.postApiKnowledgeUploadDirect({ 
            parentId: targetFolderId ?? null, 
            name: item.file.name, 
            content, 
            mimeType: item.file.type || 'application/octet-stream' 
          });
        }
        uploadItems = uploadItems.map((u, idx) => idx === i ? { ...u, status: 'success' as const, progress: 100 } : u);
      } catch (err) {
        uploadItems = uploadItems.map((u, idx) => idx === i ? { ...u, status: 'error' as const, error: err instanceof Error ? err.message : '上传失败' } : u);
      }
    }
    isUploading = false; isUploadComplete = true; await knowledgeStore.refresh();
  }

  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1] || '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function handleCancelUpload() { if (!isUploading) { uploadDialogOpen = false; uploadItems = []; isUploadComplete = false; } }

  onMount(() => knowledgeStore.init());
</script>

<div
  class="px-4 lg:px-6 flex-1 flex flex-col min-h-0"
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
  role="region"
  aria-label="文件管理区域"
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
        <div class="flex items-center justify-center h-48 border-2 border-dashed border-primary rounded-lg bg-primary/5">
          <div class="text-center">
            <p class="text-lg font-medium text-primary">释放文件以上传</p>
            <p class="text-sm text-muted-foreground">支持拖拽文件或文件夹</p>
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
          favoritedFolderIds={knowledgeStore.favoritedFolderIds}
          favoritedFileIds={knowledgeStore.favoritedFileIds}
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
          onToggleFolderFavorite={(f) => knowledgeStore.toggleFavorite('folder', f.id)}
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
          onToggleFileFavorite={(f) => knowledgeStore.toggleFavorite('file', f.id)}
          onFileDoubleClick={handleFileDoubleClick}
        />
      {/if}
    </div>
  </div>
</div>

<NewFolderDialog open={newFolderDialogOpen} onOpenChange={(o) => (newFolderDialogOpen = o)} onCreate={handleCreateFolder} />
<SearchDialog open={searchOpen} onOpenChange={(o) => (searchOpen = o)} onSearch={handleSearch} />
<RenameDialog open={renameDialogOpen} onOpenChange={(o) => (renameDialogOpen = o)} currentName={renameTarget?.name || ''} onRename={handleRename} />
<DescriptionSheet open={descriptionSheetOpen} onOpenChange={(o) => (descriptionSheetOpen = o)} title={descriptionTarget?.name || ''} currentDescription={descriptionTarget?.description || null} readOnly={descriptionTarget?.readOnly || false} onSave={handleSaveDescription} />
<FolderStyleDialog open={folderStyleDialogOpen} onOpenChange={(o) => (folderStyleDialogOpen = o)} folderName={styleTarget?.name || ''} currentIcon={styleTarget?.icon || null} currentColor={styleTarget?.color || null} onSave={handleSaveFolderStyle} />
<UploadDialog open={uploadDialogOpen} onOpenChange={(o) => (uploadDialogOpen = o)} items={uploadItems} onStartUpload={handleStartUpload} onCancel={handleCancelUpload} onHandleDuplicate={handleDuplicate} {isUploading} isComplete={isUploadComplete} {hasDuplicates} />
<PermissionSheet open={permissionSheetOpen} onOpenChange={(o: boolean) => (permissionSheetOpen = o)} resourceType={permissionTarget?.type || 'folder'} resourceId={permissionTarget?.id || ''} resourceName={permissionTarget?.name || ''} isPublic={permissionTarget?.isPublic || false} onSave={handleSavePermission} />
<VersionSheet open={versionSheetOpen} onOpenChange={(o: boolean) => (versionSheetOpen = o)} fileId={versionTarget?.fileId || ''} fileName={versionTarget?.fileName || ''} />
<PasteConflictDialog open={pasteConflictDialogOpen} onOpenChange={(o: boolean) => (pasteConflictDialogOpen = o)} items={pasteItems} onResolve={handlePasteResolve} onConfirm={handlePasteConfirm} onCancel={handlePasteCancel} {isPasting} isComplete={isPasteComplete} />
