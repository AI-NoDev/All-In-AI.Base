<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { ToolGroupList, ToolList, ToolGroupDialog } from './components';

  interface ToolGroup {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    orderNum: number;
    status: string;
  }

  interface Tool {
    id: string;
    groupId: string | null;
    name: string;
    description: string | null;
    isAsync: boolean;
    status: string;
    createdAt: string;
  }

  interface ToolGroupForm {
    name: string;
    description: string;
    icon: string;
    orderNum: number;
    status: string;
  }

  // Type for API data (audit fields are auto-injected by authStore)
  interface ToolGroupData {
    name: string;
    description: string | null;
    icon: string | null;
    orderNum: number;
    status: string;
  }

  let groups = $state<ToolGroup[]>([]);
  let tools = $state<Tool[]>([]);
  let loading = $state(true);
  let toolLoading = $state(false);
  let selectedGroupId = $state<string | null>(null);
  let selectedToolIds = $state<Set<string>>(new Set());

  // Group dialog
  let groupDialogOpen = $state(false);
  let editingGroup = $state<ToolGroup | null>(null);
  let groupForm = $state<ToolGroupForm>({ name: '', description: '', icon: '', orderNum: 1, status: '0' });
  let groupSaving = $state(false);

  async function loadGroups() {
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiToolGroupQuery({ limit: 100, offset: 0 });
      if (res.data?.data) groups = res.data.data;
    } catch (err) {
      console.error('Failed to load tool groups:', err);
    }
  }

  async function loadTools() {
    toolLoading = true;
    selectedToolIds = new Set();
    try {
      const api = authStore.createApi(true);
      const filter = selectedGroupId ? { groupId: selectedGroupId } : undefined;
      const res = await api.ai.postApiAiToolQuery({ filter, limit: 100, offset: 0 });
      if (res.data?.data) tools = res.data.data;
    } catch (err) {
      console.error('Failed to load tools:', err);
    } finally {
      toolLoading = false;
    }
  }

  function handleSelectGroup(id: string | null) {
    selectedGroupId = id;
    loadTools();
  }

  // Group CRUD
  function openCreateGroup() {
    editingGroup = null;
    groupForm = { name: '', description: '', icon: '', orderNum: 1, status: '0' };
    groupDialogOpen = true;
  }

  function openEditGroup(g: ToolGroup) {
    editingGroup = g;
    groupForm = { name: g.name, description: g.description || '', icon: g.icon || '', orderNum: g.orderNum, status: g.status };
    groupDialogOpen = true;
  }

  async function handleSaveGroup() {
    if (!groupForm.name.trim()) {
      alert('请填写分组名称');
      return;
    }
    groupSaving = true;
    try {
      const api = authStore.createApi(true);
      const data: ToolGroupData = { 
        name: groupForm.name,
        description: groupForm.description || null, 
        icon: groupForm.icon || null,
        orderNum: groupForm.orderNum,
        status: groupForm.status,
      };
      if (editingGroup) {
        await api.ai.putApiAiToolGroupById({ id: editingGroup.id }, { data });
      } else {
        // @ts-expect-error audit fields (createdBy, updatedBy) are auto-injected by authStore
        await api.ai.postApiAiToolGroup({ data });
      }
      groupDialogOpen = false;
      loadGroups();
    } catch (err) {
      console.error('Failed to save tool group:', err);
      alert('保存失败');
    } finally {
      groupSaving = false;
    }
  }

  async function handleDeleteGroup(id: string) {
    if (!confirm('确定要删除该分组吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.ai.deleteApiAiToolGroupById({ id });
      if (selectedGroupId === id) selectedGroupId = null;
      loadGroups();
      loadTools();
    } catch (err) {
      console.error('Failed to delete tool group:', err);
      alert('删除失败');
    }
  }

  // Tool CRUD - navigate to pages instead of dialog
  function openCreateTool() {
    goto('/dashboard/ai/tools/new');
  }

  function openEditTool(t: Tool) {
    goto(`/dashboard/ai/tools/${t.id}`);
  }

  async function handleDeleteTool(id: string) {
    if (!confirm('确定要删除该工具吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.ai.deleteApiAiToolById({ id });
      loadTools();
    } catch (err) {
      console.error('Failed to delete tool:', err);
      alert('删除失败');
    }
  }

  async function handleBatchDeleteTools() {
    if (selectedToolIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedToolIds.size} 个工具吗？`)) return;
    try {
      const api = authStore.createApi(true);
      await Promise.all(Array.from(selectedToolIds).map(id => api.ai.deleteApiAiToolById({ id })));
      selectedToolIds = new Set();
      loadTools();
    } catch (err) {
      console.error('Failed to delete tools:', err);
      alert('删除失败');
    }
  }

  function toggleSelectTool(id: string) {
    const s = new Set(selectedToolIds);
    s.has(id) ? s.delete(id) : s.add(id);
    selectedToolIds = s;
  }

  function toggleSelectAllTools() {
    if (tools.length > 0 && tools.every(t => selectedToolIds.has(t.id))) {
      selectedToolIds = new Set();
    } else {
      selectedToolIds = new Set(tools.map(t => t.id));
    }
  }

  onMount(async () => {
    await loadGroups();
    await loadTools();
    loading = false;
  });
</script>

<div class="flex flex-1 min-h-0 gap-4 px-4 lg:px-6 pb-4">
  <ToolGroupList
    {groups}
    {loading}
    selectedId={selectedGroupId}
    onSelect={handleSelectGroup}
    onCreate={openCreateGroup}
    onEdit={openEditGroup}
    onDelete={handleDeleteGroup}
  />

  <ToolList
    {tools}
    {groups}
    loading={toolLoading}
    selectedIds={selectedToolIds}
    onToggleSelect={toggleSelectTool}
    onToggleSelectAll={toggleSelectAllTools}
    onCreate={openCreateTool}
    onEdit={openEditTool}
    onDelete={handleDeleteTool}
    onBatchDelete={handleBatchDeleteTools}
    onRefresh={loadTools}
  />
</div>

<ToolGroupDialog
  open={groupDialogOpen}
  editing={editingGroup}
  bind:form={groupForm}
  saving={groupSaving}
  onOpenChange={(v) => groupDialogOpen = v}
  onSave={handleSaveGroup}
/>
