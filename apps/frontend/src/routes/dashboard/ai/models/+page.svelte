<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { ProviderList, ModelList, ProviderDialog, ModelDialog } from './components';

  interface Provider {
    id: string;
    name: string;
    baseUrl: string;
    token: string;
    status: string;
    remark: string | null;
  }

  interface Model {
    id: string;
    providerId: string;
    name: string;
    modelId: string;
    status: string;
    supportTools: boolean;
    maxTokens: number | null;
    remark: string | null;
    createdAt: string;
  }

  interface ProviderForm {
    name: string;
    baseUrl: string;
    token: string;
    status: string;
    remark: string;
  }

  interface ModelForm {
    providerId: string;
    name: string;
    modelId: string;
    status: string;
    supportTools: boolean;
    maxTokens: number | null;
    remark: string;
  }

  let providers = $state<Provider[]>([]);
  let models = $state<Model[]>([]);
  let loading = $state(true);
  let modelLoading = $state(false);
  let selectedProviderId = $state<string | null>(null);
  let selectedModelIds = $state<Set<string>>(new Set());

  // Provider dialog
  let providerDialogOpen = $state(false);
  let editingProvider = $state<Provider | null>(null);
  let providerForm = $state<ProviderForm>({ name: '', baseUrl: '', token: '', status: '0', remark: '' });
  let providerSaving = $state(false);

  // Model dialog
  let modelDialogOpen = $state(false);
  let editingModel = $state<Model | null>(null);
  let modelForm = $state<ModelForm>({ providerId: '', name: '', modelId: '', status: '0', supportTools: false, maxTokens: null, remark: '' });
  let modelSaving = $state(false);

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
    modelLoading = true;
    selectedModelIds = new Set();
    try {
      const api = authStore.createApi(true);
      const filter = selectedProviderId ? { providerId: selectedProviderId } : undefined;
      const res = await api.ai.postApiAiModelQuery({ filter, limit: 100, offset: 0 });
      if (res.data?.data) models = res.data.data;
    } catch (err) {
      console.error('Failed to load models:', err);
    } finally {
      modelLoading = false;
    }
  }

  function handleSelectProvider(id: string | null) {
    selectedProviderId = id;
    loadModels();
  }

  // Provider CRUD
  function openCreateProvider() {
    editingProvider = null;
    providerForm = { name: '', baseUrl: '', token: '', status: '0', remark: '' };
    providerDialogOpen = true;
  }

  function openEditProvider(p: Provider) {
    editingProvider = p;
    providerForm = { name: p.name, baseUrl: p.baseUrl, token: p.token, status: p.status, remark: p.remark || '' };
    providerDialogOpen = true;
  }

  async function handleSaveProvider() {
    if (!providerForm.name.trim() || !providerForm.baseUrl.trim() || !providerForm.token.trim()) {
      alert('请填写必填项');
      return;
    }
    providerSaving = true;
    try {
      const api = authStore.createApi(true);
      const data = { ...providerForm, remark: providerForm.remark || null };
      if (editingProvider) {
        await api.ai.putApiAiProviderById({ id: editingProvider.id }, { data });
      } else {
        await api.ai.postApiAiProvider({ data });
      }
      providerDialogOpen = false;
      loadProviders();
    } catch (err) {
      console.error('Failed to save provider:', err);
      alert('保存失败');
    } finally {
      providerSaving = false;
    }
  }

  async function handleDeleteProvider(id: string) {
    if (!confirm('确定要删除该提供商吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.ai.deleteApiAiProviderById({ id });
      if (selectedProviderId === id) selectedProviderId = null;
      loadProviders();
      loadModels();
    } catch (err) {
      console.error('Failed to delete provider:', err);
      alert('删除失败');
    }
  }

  // Model CRUD
  function openCreateModel() {
    editingModel = null;
    modelForm = { providerId: selectedProviderId || '', name: '', modelId: '', status: '0', supportTools: false, maxTokens: null, remark: '' };
    modelDialogOpen = true;
  }

  function openEditModel(m: Model) {
    editingModel = m;
    modelForm = { providerId: m.providerId, name: m.name, modelId: m.modelId, status: m.status, supportTools: m.supportTools, maxTokens: m.maxTokens, remark: m.remark || '' };
    modelDialogOpen = true;
  }

  async function handleSaveModel() {
    if (!modelForm.providerId || !modelForm.name.trim() || !modelForm.modelId.trim()) {
      alert('请填写必填项');
      return;
    }
    modelSaving = true;
    try {
      const api = authStore.createApi(true);
      const data = { ...modelForm, remark: modelForm.remark || null };
      if (editingModel) {
        await api.ai.putApiAiModelById({ id: editingModel.id }, { data });
      } else {
        await api.ai.postApiAiModel({ data });
      }
      modelDialogOpen = false;
      loadModels();
    } catch (err) {
      console.error('Failed to save model:', err);
      alert('保存失败');
    } finally {
      modelSaving = false;
    }
  }

  async function handleDeleteModel(id: string) {
    if (!confirm('确定要删除该模型吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.ai.deleteApiAiModelById({ id });
      loadModels();
    } catch (err) {
      console.error('Failed to delete model:', err);
      alert('删除失败');
    }
  }

  async function handleBatchDeleteModels() {
    if (selectedModelIds.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedModelIds.size} 个模型吗？`)) return;
    try {
      const api = authStore.createApi(true);
      await Promise.all(Array.from(selectedModelIds).map(id => api.ai.deleteApiAiModelById({ id })));
      selectedModelIds = new Set();
      loadModels();
    } catch (err) {
      console.error('Failed to delete models:', err);
      alert('删除失败');
    }
  }

  function toggleSelectModel(id: string) {
    const s = new Set(selectedModelIds);
    s.has(id) ? s.delete(id) : s.add(id);
    selectedModelIds = s;
  }

  function toggleSelectAllModels() {
    if (models.length > 0 && models.every(m => selectedModelIds.has(m.id))) {
      selectedModelIds = new Set();
    } else {
      selectedModelIds = new Set(models.map(m => m.id));
    }
  }

  onMount(async () => {
    await loadProviders();
    await loadModels();
    loading = false;
  });
</script>

<div class="flex flex-1 min-h-0 gap-4 px-4 lg:px-6 pb-4">
  <ProviderList
    {providers}
    {loading}
    selectedId={selectedProviderId}
    onSelect={handleSelectProvider}
    onCreate={openCreateProvider}
    onEdit={openEditProvider}
    onDelete={handleDeleteProvider}
  />

  <ModelList
    {models}
    {providers}
    loading={modelLoading}
    selectedIds={selectedModelIds}
    onToggleSelect={toggleSelectModel}
    onToggleSelectAll={toggleSelectAllModels}
    onCreate={openCreateModel}
    onEdit={openEditModel}
    onDelete={handleDeleteModel}
    onBatchDelete={handleBatchDeleteModels}
    onRefresh={loadModels}
  />
</div>

<ProviderDialog
  open={providerDialogOpen}
  editing={editingProvider}
  bind:form={providerForm}
  saving={providerSaving}
  onOpenChange={(v) => providerDialogOpen = v}
  onSave={handleSaveProvider}
/>

<ModelDialog
  open={modelDialogOpen}
  editing={editingModel}
  bind:form={modelForm}
  {providers}
  saving={modelSaving}
  onOpenChange={(v) => modelDialogOpen = v}
  onSave={handleSaveModel}
/>
