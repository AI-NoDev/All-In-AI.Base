<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface UserMemory {
    id: string;
    userId: string;
    agentId: string | null;
    memoryType: string;
    content: string;
    importance: number;
    accessCount: number;
    lastAccessedAt: string | null;
    expiresAt: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
  }

  interface User {
    id: string;
    nickName: string;
    loginName: string;
  }

  interface Agent {
    id: string;
    name: string;
  }

  interface PageSnapshot {
    memories: UserMemory[];
    users: User[];
    agents: Agent[];
    total: number;
    page: number;
    filterUserId: string;
    filterMemoryType: string;
    dataLoaded: boolean;
  }

  let pageState: PageSnapshot = {
    memories: [],
    users: [],
    agents: [],
    total: 0,
    page: 1,
    filterUserId: '',
    filterMemoryType: '',
    dataLoaded: false
  };

  let restoreCallback: ((value: PageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<PageSnapshot> = {
    capture: () => pageState,
    restore: (value) => {
      pageState = value;
      if (restoreCallback) restoreCallback(value);
    }
  };
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '$lib/stores/i18n.svelte';
  import { MemoryList, MemoryDialog } from './components';

  interface MemoryForm {
    userId: string;
    agentId: string;
    memoryType: string;
    content: string;
    importance: number;
    expiresAt: string;
    metadata: string;
  }

  let memories = $state<UserMemory[]>(pageState.memories);
  let users = $state<User[]>(pageState.users);
  let agents = $state<Agent[]>(pageState.agents);
  let loading = $state(!pageState.dataLoaded);
  let total = $state(pageState.total);
  let page = $state(pageState.page);
  let pageSize = $state(20);
  let snapshotRestored = $state(pageState.dataLoaded);

  // Filter
  let filterUserId = $state(pageState.filterUserId);
  let filterMemoryType = $state(pageState.filterMemoryType);

  // Register restore callback
  restoreCallback = (value) => {
    memories = value.memories;
    users = value.users;
    agents = value.agents;
    total = value.total;
    page = value.page;
    filterUserId = value.filterUserId;
    filterMemoryType = value.filterMemoryType;
    snapshotRestored = value.dataLoaded;
    loading = !value.dataLoaded;
  };

  // Sync state to module-level for snapshot
  $effect(() => {
    pageState = {
      memories,
      users,
      agents,
      total,
      page,
      filterUserId,
      filterMemoryType,
      dataLoaded: !loading
    };
  });

  // Dialog
  let dialogOpen = $state(false);
  let editingMemory = $state<UserMemory | null>(null);
  let memoryForm = $state<MemoryForm>({
    userId: '',
    agentId: '',
    memoryType: 'LTM',
    content: '',
    importance: 5,
    expiresAt: '',
    metadata: '{}'
  });
  let saving = $state(false);

  async function loadUsers() {
    try {
      const api = authStore.createApi(true);
      const res = await api.system.postApiSystemUserQuery({ limit: 100, offset: 0 });
      if (res.data?.data) users = res.data.data;
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  }

  async function loadAgents() {
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiAgentQuery({ limit: 100, offset: 0 });
      if (res.data?.data) agents = res.data.data;
    } catch (err) {
      console.error('Failed to load agents:', err);
    }
  }

  async function loadMemories() {
    loading = true;
    try {
      const api = authStore.createApi(true);
      const filter: Record<string, string> = {};
      if (filterUserId) filter.userId = filterUserId;
      if (filterMemoryType) filter.memoryType = filterMemoryType;
      
      const res = await api.ai.postApiAiUserMemoryQuery({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit: pageSize,
        offset: (page - 1) * pageSize,
        sort: { field: 'createdAt', order: 'desc' }
      });
      if (res.data) {
        memories = res.data.data || [];
        total = res.data.total || 0;
      }
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      loading = false;
    }
  }

  function openCreateMemory() {
    editingMemory = null;
    memoryForm = {
      userId: '',
      agentId: '',
      memoryType: 'LTM',
      content: '',
      importance: 5,
      expiresAt: '',
      metadata: '{}'
    };
    dialogOpen = true;
  }

  function openEditMemory(m: UserMemory) {
    editingMemory = m;
    memoryForm = {
      userId: m.userId,
      agentId: m.agentId || '',
      memoryType: m.memoryType,
      content: m.content,
      importance: m.importance,
      expiresAt: m.expiresAt ? m.expiresAt.slice(0, 16) : '',
      metadata: m.metadata ? JSON.stringify(m.metadata, null, 2) : '{}'
    };
    dialogOpen = true;
  }

  async function handleSaveMemory() {
    if (!memoryForm.userId || !memoryForm.content.trim()) {
      alert(t('page.ai.memory_fillRequired'));
      return;
    }
    saving = true;
    try {
      const api = authStore.createApi(true);
      let parsedMetadata: Record<string, unknown> | null = null;
      if (memoryForm.metadata.trim()) {
        try {
          parsedMetadata = JSON.parse(memoryForm.metadata);
        } catch {
          alert(t('page.ai.memory_metadataJsonError'));
          saving = false;
          return;
        }
      }
      
      const data = {
        userId: memoryForm.userId,
        agentId: memoryForm.agentId || null,
        memoryType: memoryForm.memoryType,
        content: memoryForm.content,
        importance: memoryForm.importance,
        expiresAt: memoryForm.expiresAt ? new Date(memoryForm.expiresAt).toISOString() : null,
        metadata: parsedMetadata
      };
      
      if (editingMemory) {
        await api.ai.putApiAiUserMemoryById(
          { id: editingMemory.id },
          { data } as Parameters<typeof api.ai.putApiAiUserMemoryById>[1]
        );
      } else {
        await api.ai.postApiAiUserMemory({ data } as Parameters<typeof api.ai.postApiAiUserMemory>[0]);
      }
      dialogOpen = false;
      loadMemories();
    } catch (err) {
      console.error('Failed to save memory:', err);
      alert(t('page.ai.memory_saveFailed'));
    } finally {
      saving = false;
    }
  }

  async function handleDeleteMemory(id: string) {
    if (!confirm(t('page.ai.memory_deleteConfirm'))) return;
    try {
      const api = authStore.createApi(true);
      await api.ai.deleteApiAiUserMemoryById({ id });
      loadMemories();
    } catch (err) {
      console.error('Failed to delete memory:', err);
      alert(t('page.ai.memory_deleteFailed'));
    }
  }

  function handlePageChange(newPage: number) {
    page = newPage;
    loadMemories();
  }

  function handleFilter() {
    page = 1;
    loadMemories();
  }

  onMount(async () => {
    if (!snapshotRestored) {
      await Promise.all([loadUsers(), loadAgents()]);
      await loadMemories();
    }
  });
</script>

<div class="flex flex-1 min-h-0 gap-4 px-4 lg:px-6 pb-4">
  <MemoryList
    {memories}
    {users}
    {agents}
    {loading}
    {total}
    {page}
    {pageSize}
    bind:filterUserId
    bind:filterMemoryType
    onCreate={openCreateMemory}
    onEdit={openEditMemory}
    onDelete={handleDeleteMemory}
    onRefresh={loadMemories}
    onPageChange={handlePageChange}
    onFilter={handleFilter}
  />
</div>

<MemoryDialog
  open={dialogOpen}
  editing={editingMemory}
  bind:form={memoryForm}
  {users}
  {agents}
  {saving}
  onOpenChange={(v) => dialogOpen = v}
  onSave={handleSaveMemory}
/>
