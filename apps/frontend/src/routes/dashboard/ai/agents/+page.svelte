<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface Agent {
    id: string;
    name: string;
    description: string | null;
    avatar: string | null;
    color: string | null;
    providerId: string;
    modelId: string;
    systemPrompt: string | null;
    temperature: number | null;
    supportLoop: boolean;
    maxLoops: number | null;
    status: string;
    createdAt: string;
  }

  interface Provider {
    id: string;
    name: string;
  }

  interface Model {
    id: string;
    name: string;
    providerId: string;
  }

  interface PageSnapshot {
    agents: Agent[];
    providers: Provider[];
    models: Model[];
    dataLoaded: boolean;
  }

  let pageState: PageSnapshot = {
    agents: [],
    providers: [],
    models: [],
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
  import { t } from '@/lib/stores/i18n.svelte';
  import { AgentList, AgentDialog } from './components';

  interface AgentForm {
    name: string;
    description: string;
    avatar: string;
    color: string;
    providerId: string;
    modelId: string;
    systemPrompt: string;
    temperature: number;
    supportLoop: boolean;
    maxLoops: number;
    status: string;
  }

  let agents = $state<Agent[]>(pageState.agents);
  let providers = $state<Provider[]>(pageState.providers);
  let models = $state<Model[]>(pageState.models);
  let loading = $state(!pageState.dataLoaded);
  let snapshotRestored = $state(pageState.dataLoaded);

  // Register restore callback
  restoreCallback = (value) => {
    agents = value.agents;
    providers = value.providers;
    models = value.models;
    snapshotRestored = value.dataLoaded;
    loading = !value.dataLoaded;
  };

  // Sync state to module-level for snapshot
  $effect(() => {
    pageState = {
      agents,
      providers,
      models,
      dataLoaded: !loading
    };
  });

  // Dialog
  let dialogOpen = $state(false);
  let editingAgent = $state<Agent | null>(null);
  let agentForm = $state<AgentForm>({
    name: '', description: '', avatar: '', color: '#6366f1',
    providerId: '', modelId: '', systemPrompt: '',
    temperature: 0.7, supportLoop: false, maxLoops: 10, status: '0'
  });
  let saving = $state(false);

  async function loadProviders() {
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiProviderQuery({ limit: 100, offset: 0 });
      if (res.data?.data) providers = res.data.data;
    } catch (err) {
      console.error('Failed to load providers:', err);
    }
  }

  async function loadModels() {
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiModelQuery({ limit: 100, offset: 0 });
      if (res.data?.data) models = res.data.data;
    } catch (err) {
      console.error('Failed to load models:', err);
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

  function openCreateAgent() {
    editingAgent = null;
    agentForm = {
      name: '', description: '', avatar: '', color: '#6366f1',
      providerId: '', modelId: '', systemPrompt: '',
      temperature: 0.7, supportLoop: false, maxLoops: 10, status: '0'
    };
    dialogOpen = true;
  }

  function openEditAgent(a: Agent) {
    editingAgent = a;
    agentForm = {
      name: a.name,
      description: a.description || '',
      avatar: a.avatar || '',
      color: a.color || '#6366f1',
      providerId: a.providerId,
      modelId: a.modelId,
      systemPrompt: a.systemPrompt || '',
      temperature: a.temperature ?? 0.7,
      supportLoop: a.supportLoop,
      maxLoops: a.maxLoops ?? 10,
      status: a.status,
    };
    dialogOpen = true;
  }

  async function handleSaveAgent() {
    if (!agentForm.name.trim() || !agentForm.providerId || !agentForm.modelId) {
      alert(t('page.ai.agent_fillRequired'));
      return;
    }
    saving = true;
    try {
      const api = authStore.createApi(true);
      const data = {
        name: agentForm.name,
        description: agentForm.description || null,
        avatar: agentForm.avatar || null,
        color: agentForm.color || null,
        providerId: agentForm.providerId,
        modelId: agentForm.modelId,
        systemPrompt: agentForm.systemPrompt || null,
        temperature: agentForm.temperature,
        supportLoop: agentForm.supportLoop,
        maxLoops: agentForm.supportLoop ? agentForm.maxLoops : null,
        status: agentForm.status,
      };
      if (editingAgent) {
        await api.ai.putApiAiAgentById({ id: editingAgent.id }, { data } as Parameters<typeof api.ai.putApiAiAgentById>[1]);
      } else {
        await api.ai.postApiAiAgent({ data } as Parameters<typeof api.ai.postApiAiAgent>[0]);
      }
      dialogOpen = false;
      loadAgents();
    } catch (err) {
      console.error('Failed to save agent:', err);
      alert(t('page.ai.agent_saveFailed'));
    } finally {
      saving = false;
    }
  }

  async function handleDeleteAgent(id: string) {
    if (!confirm(t('page.ai.agent_deleteConfirm'))) return;
    try {
      const api = authStore.createApi(true);
      await api.ai.deleteApiAiAgentById({ id });
      loadAgents();
    } catch (err) {
      console.error('Failed to delete agent:', err);
      alert(t('page.ai.agent_deleteFailed'));
    }
  }

  onMount(async () => {
    if (!snapshotRestored) {
      await Promise.all([loadProviders(), loadModels()]);
      await loadAgents();
      loading = false;
    }
  });
</script>

<div class="flex flex-1 min-h-0 gap-4 px-4 lg:px-6 pb-4">
  <AgentList
    {agents}
    {providers}
    {models}
    {loading}
    onCreate={openCreateAgent}
    onEdit={openEditAgent}
    onDelete={handleDeleteAgent}
    onRefresh={loadAgents}
  />
</div>

<AgentDialog
  open={dialogOpen}
  editing={editingAgent}
  bind:form={agentForm}
  {providers}
  {models}
  {saving}
  onOpenChange={(v) => dialogOpen = v}
  onSave={handleSaveAgent}
/>
