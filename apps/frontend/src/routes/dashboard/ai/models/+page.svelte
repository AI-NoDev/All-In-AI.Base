<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { ProviderList, ModelList, ProviderDialog, ModelDialog } from './components';
  import * as Dialog from '$lib/components/ui/dialog';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';

  interface Provider {
    id: string;
    name: string;
    providerType: string;
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
    remark: string | null;
    createdAt: string;
    // 能力支持
    supportTools: boolean;
    supportThinking: boolean;
    supportPrefixCompletion: boolean;
    supportFIM: boolean;
    supportJsonOutput: boolean;
    // 输入能力
    supportImageInput: boolean;
    supportVideoInput: boolean;
    supportAudioInput: boolean;
    // 输出能力
    supportImageOutput: boolean;
    supportVideoOutput: boolean;
    supportAudioOutput: boolean;
    // Token 限制
    contextWindow: number | null;
    maxInputTokens: number | null;
    maxOutputTokens: number | null;
    maxThinkingTokens: number | null;
    // 成本
    inputPricePerMillion: string | null;
    outputPricePerMillion: string | null;
    cacheHitPricePerMillion: string | null;
    cacheMissPricePerMillion: string | null;
  }

  interface ProviderForm {
    name: string;
    providerType: string;
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
    remark: string;
    // 能力支持
    supportTools: boolean;
    supportThinking: boolean;
    supportPrefixCompletion: boolean;
    supportFIM: boolean;
    supportJsonOutput: boolean;
    // 输入能力
    supportImageInput: boolean;
    supportVideoInput: boolean;
    supportAudioInput: boolean;
    // 输出能力
    supportImageOutput: boolean;
    supportVideoOutput: boolean;
    supportAudioOutput: boolean;
    // Token 限制
    contextWindow: number | null;
    maxInputTokens: number | null;
    maxOutputTokens: number | null;
    maxThinkingTokens: number | null;
    // 成本
    inputPricePerMillion: string | null;
    outputPricePerMillion: string | null;
    cacheHitPricePerMillion: string | null;
    cacheMissPricePerMillion: string | null;
  }

  const defaultModelForm: ModelForm = {
    providerId: '',
    name: '',
    modelId: '',
    status: '0',
    remark: '',
    supportTools: false,
    supportThinking: false,
    supportPrefixCompletion: false,
    supportFIM: false,
    supportJsonOutput: false,
    supportImageInput: false,
    supportVideoInput: false,
    supportAudioInput: false,
    supportImageOutput: false,
    supportVideoOutput: false,
    supportAudioOutput: false,
    contextWindow: null,
    maxInputTokens: null,
    maxOutputTokens: null,
    maxThinkingTokens: null,
    inputPricePerMillion: null,
    outputPricePerMillion: null,
    cacheHitPricePerMillion: null,
    cacheMissPricePerMillion: null,
  };

  let providers = $state<Provider[]>([]);
  let models = $state<Model[]>([]);
  let loading = $state(true);
  let modelLoading = $state(false);
  let selectedProviderId = $state<string | null>(null);
  let selectedModelIds = $state<Set<string>>(new Set());

  // Provider dialog
  let providerDialogOpen = $state(false);
  let editingProvider = $state<Provider | null>(null);
  let providerForm = $state<ProviderForm>({ name: '', providerType: 'openai-compatible', baseUrl: '', token: '', status: '0', remark: '' });
  let providerSaving = $state(false);

  // Model dialog
  let modelDialogOpen = $state(false);
  let editingModel = $state<Model | null>(null);
  let modelForm = $state<ModelForm>({ ...defaultModelForm });
  let modelSaving = $state(false);

  // Test dialog
  let testDialogOpen = $state(false);
  let testingModel = $state<Model | null>(null);
  let testLoading = $state(false);
  
  interface ThinkingItem {
    type: string;
    text: string;
  }
  
  let testResult = $state<{ success: boolean; response: string | null; thinking: ThinkingItem[] | null; supportThinking: boolean; error: string | null; latencyMs: number } | null>(null);

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
    providerForm = { name: '', providerType: 'openai-compatible', baseUrl: '', token: '', status: '0', remark: '' };
    providerDialogOpen = true;
  }

  function openEditProvider(p: Provider) {
    editingProvider = p;
    providerForm = { name: p.name, providerType: p.providerType || 'openai-compatible', baseUrl: p.baseUrl, token: p.token, status: p.status, remark: p.remark || '' };
    providerDialogOpen = true;
  }

  async function handleSaveProvider() {
    // 检查必填项：名称和 token 始终必填
    if (!providerForm.name.trim() || !providerForm.token.trim()) {
      alert('请填写必填项');
      return;
    }
    // 对于需要自定义 baseUrl 的 provider 类型，baseUrl 必填
    const requiresBaseUrl = ['azure', 'gateway', 'openai-compatible'].includes(providerForm.providerType);
    if (requiresBaseUrl && !providerForm.baseUrl.trim()) {
      alert('请填写 API 地址');
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
    modelForm = { ...defaultModelForm, providerId: selectedProviderId || '' };
    modelDialogOpen = true;
  }

  function openEditModel(m: Model) {
    editingModel = m;
    modelForm = {
      providerId: m.providerId,
      name: m.name,
      modelId: m.modelId,
      status: m.status,
      remark: m.remark || '',
      // 能力支持
      supportTools: m.supportTools,
      supportThinking: m.supportThinking,
      supportPrefixCompletion: m.supportPrefixCompletion,
      supportFIM: m.supportFIM,
      supportJsonOutput: m.supportJsonOutput,
      // 输入能力
      supportImageInput: m.supportImageInput,
      supportVideoInput: m.supportVideoInput,
      supportAudioInput: m.supportAudioInput,
      // 输出能力
      supportImageOutput: m.supportImageOutput,
      supportVideoOutput: m.supportVideoOutput,
      supportAudioOutput: m.supportAudioOutput,
      // Token 限制
      contextWindow: m.contextWindow,
      maxInputTokens: m.maxInputTokens,
      maxOutputTokens: m.maxOutputTokens,
      maxThinkingTokens: m.maxThinkingTokens,
      // 成本
      inputPricePerMillion: m.inputPricePerMillion,
      outputPricePerMillion: m.outputPricePerMillion,
      cacheHitPricePerMillion: m.cacheHitPricePerMillion,
      cacheMissPricePerMillion: m.cacheMissPricePerMillion,
    };
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
      const data = {
        ...modelForm,
        remark: modelForm.remark || null,
        // 确保数值类型正确
        contextWindow: modelForm.contextWindow ? Number(modelForm.contextWindow) : null,
        maxInputTokens: modelForm.maxInputTokens ? Number(modelForm.maxInputTokens) : null,
        maxOutputTokens: modelForm.maxOutputTokens ? Number(modelForm.maxOutputTokens) : null,
        maxThinkingTokens: modelForm.maxThinkingTokens ? Number(modelForm.maxThinkingTokens) : null,
        // 价格字段转为字符串（数据库 numeric 类型）
        inputPricePerMillion: modelForm.inputPricePerMillion != null ? String(modelForm.inputPricePerMillion) : null,
        outputPricePerMillion: modelForm.outputPricePerMillion != null ? String(modelForm.outputPricePerMillion) : null,
        cacheHitPricePerMillion: modelForm.cacheHitPricePerMillion != null ? String(modelForm.cacheHitPricePerMillion) : null,
        cacheMissPricePerMillion: modelForm.cacheMissPricePerMillion != null ? String(modelForm.cacheMissPricePerMillion) : null,
      };
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

  // Test model
  function openTestModel(m: Model) {
    testingModel = m;
    testResult = null;
    testDialogOpen = true;
  }

  async function handleTestModel() {
    if (!testingModel) return;
    testLoading = true;
    testResult = null;
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiModelByIdTest({ id: testingModel.id }, { message: 'Hello, please respond with a brief greeting.' });
      if (res.data) {
        testResult = res.data;
      }
    } catch (err) {
      console.error('Failed to test model:', err);
      testResult = { success: false, response: null, error: err instanceof Error ? err.message : 'Unknown error', latencyMs: 0 };
    } finally {
      testLoading = false;
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
    onTest={openTestModel}
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

<!-- Test Model Dialog -->
<Dialog.Root bind:open={testDialogOpen}>
  <Dialog.Content class="sm:max-w-xl" interactOutsideBehavior="ignore">
    <Dialog.Header>
      <Dialog.Title>测试模型</Dialog.Title>
      <Dialog.Description>
        {#if testingModel}
          测试 {testingModel.name} ({testingModel.modelId})
        {/if}
      </Dialog.Description>
    </Dialog.Header>
    <div class="space-y-4 py-4">
      {#if !testResult && !testLoading}
        <p class="text-sm text-muted-foreground">
          点击"开始测试"向模型发送一条测试消息，验证模型是否正常工作。
        </p>
      {/if}
      
      {#if testLoading}
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon icon="mdi:loading" class="size-4 animate-spin" />
          正在测试...
        </div>
      {/if}
      
      {#if testResult}
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <Badge variant={testResult.success ? 'default' : 'destructive'}>
              {testResult.success ? '成功' : '失败'}
            </Badge>
            {#if testResult.supportThinking}
              <Badge variant="secondary">支持思考</Badge>
            {/if}
            <span class="text-xs text-muted-foreground">
              耗时: {testResult.latencyMs}ms
            </span>
          </div>
          
          {#if testResult.success && testResult.thinking && testResult.thinking.length > 0}
            <div class="rounded-md bg-blue-50 dark:bg-blue-950 p-3 border border-blue-200 dark:border-blue-800">
              <p class="text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">思考过程:</p>
              {#each testResult.thinking as item}
                <p class="text-sm text-blue-600 dark:text-blue-400 whitespace-pre-wrap">{item.text}</p>
              {/each}
            </div>
          {/if}
          
          {#if testResult.success && testResult.response}
            <div class="rounded-md bg-muted p-3">
              <p class="text-sm font-medium mb-1">AI 回复:</p>
              <p class="text-sm text-muted-foreground whitespace-pre-wrap">{testResult.response}</p>
            </div>
          {/if}
          
          {#if !testResult.success && testResult.error}
            <div class="rounded-md bg-destructive/10 p-3">
              <p class="text-sm font-medium text-destructive mb-1">错误信息:</p>
              <p class="text-sm text-destructive/80">{testResult.error}</p>
            </div>
          {/if}
        </div>
      {/if}
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => testDialogOpen = false}>关闭</Button>
      <Button onclick={handleTestModel} disabled={testLoading}>
        {#if testLoading}
          <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
        {:else}
          <Icon icon="mdi:play" class="mr-2 size-4" />
        {/if}
        {testResult ? '重新测试' : '开始测试'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
