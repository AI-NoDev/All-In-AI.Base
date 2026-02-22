<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { actionsStore } from '@/lib/stores/actions.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Switch } from '$lib/components/ui/switch';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Sheet from '$lib/components/ui/sheet';
  import * as Card from '$lib/components/ui/card';
  import { Badge } from '$lib/components/ui/badge';
  import { toast } from 'svelte-sonner';
  import ActionsSelector from '$lib/components/common/actions-selector.svelte';

  interface McpServer {
    id: string;
    name: string;
    description: string | null;
    actions: string[];
    isPublic: boolean;
    status: string;
    createdAt: string;
  }

  interface McpServerForm {
    name: string;
    description: string;
    actions: string[];
    isPublic: boolean;
    status: string;
  }

  interface ApiKey {
    id: string;
    name: string;
    tokenPrefix: string;
    accessAll: boolean;
    mcpServerIds: string[];
    isRevoked: boolean;
    expiresAt: string | null;
  }

  let servers = $state<McpServer[]>([]);
  let apiKeys = $state<ApiKey[]>([]);
  let loading = $state(true);
  
  // Server dialog
  let serverDialogOpen = $state(false);
  let editingServer = $state<McpServer | null>(null);
  let serverSaving = $state(false);
  let serverForm = $state<McpServerForm>({ name: '', description: '', actions: [], isPublic: false, status: '0' });
  
  // Actions selector drawer
  let actionsSelectorOpen = $state(false);

  // API Keys sheet for MCP
  let apiKeysSheetOpen = $state(false);
  let selectedMcpServer = $state<McpServer | null>(null);
  let apiKeysSaving = $state(false);

  // Config preview sheet
  let configSheetOpen = $state(false);
  let configMcpServer = $state<McpServer | null>(null);
  let configLoading = $state(false);
  let mcpConfig = $state<{ endpoint: string; configJson: string } | null>(null);

  async function loadServers() {
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiMcpServerQuery({ limit: 100, offset: 0 });
      if (res.data?.data) servers = res.data.data;
    } catch (err) {
      console.error('Failed to load servers:', err);
      toast.error('加载失败');
    } finally {
      loading = false;
    }
  }

  async function loadApiKeys() {
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiApiKeyQuery({ limit: 100, offset: 0 });
      if (res.data?.data) apiKeys = res.data.data;
    } catch (err) {
      console.error('Failed to load API keys:', err);
    }
  }

  // 获取可以访问指定 MCP 的 API Key 列表
  function getApiKeysForMcp(mcpId: string): ApiKey[] {
    return apiKeys.filter(k => !k.isRevoked && (k.accessAll || k.mcpServerIds.includes(mcpId)));
  }

  // 检查 API Key 是否过期
  function isExpired(exp: string | null): boolean {
    if (!exp) return false;
    return new Date(exp) < new Date();
  }

  function openApiKeysSheet(server: McpServer) {
    selectedMcpServer = server;
    apiKeysSheetOpen = true;
  }

  // 切换 API Key 对 MCP 的访问权限
  async function toggleApiKeyAccess(apiKey: ApiKey) {
    if (!selectedMcpServer || apiKey.accessAll) return;
    
    apiKeysSaving = true;
    try {
      const api = authStore.createApi(true);
      const hasAccess = apiKey.mcpServerIds.includes(selectedMcpServer.id);
      const newMcpServerIds = hasAccess
        ? apiKey.mcpServerIds.filter(id => id !== selectedMcpServer!.id)
        : [...apiKey.mcpServerIds, selectedMcpServer.id];
      
      await api.ai.putApiAiApiKeyById({ id: apiKey.id }, {
        data: { mcpServerIds: newMcpServerIds }
      });
      
      // 更新本地状态
      apiKeys = apiKeys.map(k => 
        k.id === apiKey.id ? { ...k, mcpServerIds: newMcpServerIds } : k
      );
      
      toast.success(hasAccess ? '已移除访问权限' : '已添加访问权限');
    } catch (err) {
      console.error('Failed to update:', err);
      toast.error('更新失败');
    } finally {
      apiKeysSaving = false;
    }
  }

  function openCreateServerDialog() {
    editingServer = null;
    serverForm = { name: '', description: '', actions: [], isPublic: false, status: '0' };
    serverDialogOpen = true;
  }

  function openEditServerDialog(server: McpServer) {
    editingServer = server;
    serverForm = {
      name: server.name,
      description: server.description || '',
      actions: [...server.actions],
      isPublic: server.isPublic,
      status: server.status,
    };
    serverDialogOpen = true;
  }

  function openActionsSelector() {
    actionsSelectorOpen = true;
  }

  function handleActionsChange(selected: string[]) {
    serverForm.actions = selected;
  }

  async function handleSaveServer() {
    if (!serverForm.name.trim()) {
      toast.error('请填写服务名称');
      return;
    }
    if (serverForm.actions.length === 0) {
      toast.error('请至少选择一个 Action');
      return;
    }
    serverSaving = true;
    try {
      const api = authStore.createApi(true);
      const data = {
        name: serverForm.name,
        description: serverForm.description || null,
        actions: serverForm.actions,
        isPublic: serverForm.isPublic,
        status: serverForm.status,
      };
      
      if (editingServer) {
        await api.ai.putApiAiMcpServerById({ id: editingServer.id }, { data });
      } else {
        await api.ai.postApiAiMcpServer({ data });
      }
      toast.success(editingServer ? '更新成功' : '创建成功');
      serverDialogOpen = false;
      loadServers();
    } catch (err) {
      console.error('Failed to save:', err);
      toast.error('保存失败');
    } finally {
      serverSaving = false;
    }
  }

  async function handleDeleteServer(id: string) {
    if (!confirm('确定要删除此 MCP 服务吗？')) return;
    try {
      const api = authStore.createApi(true);
      await api.ai.deleteApiAiMcpServerById({ id });
      toast.success('已删除');
      loadServers();
    } catch (err) {
      console.error('Failed to delete:', err);
      toast.error('删除失败');
    }
  }

  function openConfigSheet(server: McpServer) {
    configMcpServer = server;
    mcpConfig = null;
    configSheetOpen = true;
    loadMcpConfig(server.id);
  }

  async function loadMcpConfig(id: string) {
    configLoading = true;
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.getApiAiMcpServerByIdConfig({ id });
      if (res.data) {
        mcpConfig = { endpoint: res.data.endpoint, configJson: res.data.configJson };
      }
    } catch (err) {
      console.error('Failed to load MCP config:', err);
      toast.error('加载配置失败');
    } finally {
      configLoading = false;
    }
  }

  function copyEndpoint() {
    if (!mcpConfig) return;
    navigator.clipboard.writeText(mcpConfig.endpoint);
    toast.success('已复制 MCP 端点地址');
  }

  function copyConfig() {
    if (!mcpConfig) return;
    navigator.clipboard.writeText(mcpConfig.configJson);
    toast.success('已复制 MCP 配置');
  }

  function getActionDisplayName(actionName: string): string {
    const action = actionsStore.getByName(actionName);
    return action?.displayName || actionName.split('.').pop() || actionName;
  }

  onMount(() => {
    loadServers();
    loadApiKeys();
    actionsStore.load();
  });
</script>

<div class="flex flex-1 flex-col min-h-0 px-4 lg:px-6 pb-4">
  <div class="py-3 flex items-center justify-between border-b border-border">
    <div class="flex gap-2">
      <Button size="sm" onclick={openCreateServerDialog}>
        <Icon icon="mdi:plus" class="mr-1 size-4" />新增 MCP 服务
      </Button>
    </div>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadServers}>
      <Icon icon="mdi:refresh" class="size-4" />
    </Button>
  </div>

  <div class="flex-1 min-h-0 pt-4">
  {#if loading}
    <div class="flex items-center justify-center py-12 text-muted-foreground">
      <Icon icon="mdi:loading" class="size-6 animate-spin mr-2" />
      {t('common.tips.loading')}
    </div>
  {:else if servers.length === 0}
    <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Icon icon="mdi:api" class="size-12 mb-4 opacity-50" />
      <p>{t('page.ai.mcp.noServers')}</p>
      <p class="text-sm mt-1">{t('page.ai.mcp.createHint')}</p>
    </div>
  {:else}
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each servers as server}
        <Card.Root>
          <Card.Header class="pb-3">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-2">
                <Icon icon="mdi:api" class="size-5 text-primary" />
                <Card.Title class="text-base">{server.name}</Card.Title>
              </div>
              <div class="flex items-center gap-1">
                {#if server.isPublic}
                  <Badge variant="secondary">公开</Badge>
                {:else}
                  <Badge variant="outline">私有</Badge>
                {/if}
              </div>
            </div>
            {#if server.description}
              <Card.Description class="line-clamp-2">{server.description}</Card.Description>
            {/if}
          </Card.Header>
          <Card.Content class="pb-3">
            <div class="text-sm text-muted-foreground mb-2">
              包含 {server.actions.length} 个 Tools
            </div>
            <div class="flex flex-wrap gap-1">
              {#each server.actions.slice(0, 5) as action}
                <Badge variant="secondary" class="text-xs">{getActionDisplayName(action)}</Badge>
              {/each}
              {#if server.actions.length > 5}
                <Badge variant="outline" class="text-xs">+{server.actions.length - 5}</Badge>
              {/if}
            </div>
          </Card.Content>
          <Card.Footer class="pt-0">
            <div class="flex w-full gap-2">
              <Button variant="ghost" size="icon" onclick={() => openConfigSheet(server)} title="查看配置">
                <Icon icon="mdi:code-json" class="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onclick={() => copyEndpoint(server)} title="复制端点">
                <Icon icon="mdi:link" class="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onclick={() => openApiKeysSheet(server)} title="管理 API 密钥">
                <Icon icon="mdi:key-variant" class="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onclick={() => openEditServerDialog(server)} title="编辑">
                <Icon icon="mdi:pencil" class="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onclick={() => handleDeleteServer(server.id)} title="删除">
                <Icon icon="mdi:delete-outline" class="size-4 text-destructive" />
              </Button>
            </div>
          </Card.Footer>
        </Card.Root>
      {/each}
    </div>
  {/if}
  </div>
</div>

<!-- Server Dialog -->
<Dialog.Root bind:open={serverDialogOpen}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{editingServer ? '编辑' : '创建'} MCP 服务</Dialog.Title>
      <Dialog.Description>选择要发布的 Actions，组合成一个 MCP 服务</Dialog.Description>
    </Dialog.Header>
    
    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="name">服务名称</Label>
        <Input id="name" bind:value={serverForm.name} placeholder="例如：knowledge-tools" />
      </div>
      
      <div class="space-y-2">
        <Label for="description">描述</Label>
        <Textarea id="description" bind:value={serverForm.description} placeholder="描述此 MCP 服务的用途" rows={2} />
      </div>
      
      <div class="flex items-center justify-between rounded-lg border p-3">
        <div class="space-y-0.5">
          <Label>公开访问</Label>
          <p class="text-xs text-muted-foreground">开启后无需 API 密钥即可访问</p>
        </div>
        <Switch bind:checked={serverForm.isPublic} />
      </div>
      
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label>Actions ({serverForm.actions.length} 已选)</Label>
          <Button variant="outline" size="sm" onclick={openActionsSelector}>
            <Icon icon="mdi:plus" class="mr-1 size-4" />
            选择 Actions
          </Button>
        </div>
        {#if serverForm.actions.length > 0}
          <div class="flex flex-wrap gap-1 p-3 rounded-md border bg-muted/50 max-h-32 overflow-y-auto">
            {#each serverForm.actions as action}
              <Badge variant="secondary" class="text-xs">
                {getActionDisplayName(action)}
                <button 
                  type="button"
                  class="ml-1 hover:text-destructive"
                  onclick={() => serverForm.actions = serverForm.actions.filter(a => a !== action)}
                >
                  <Icon icon="mdi:close" class="size-3" />
                </button>
              </Badge>
            {/each}
          </div>
        {:else}
          <div class="text-center py-4 text-muted-foreground text-sm border rounded-md">
            点击上方按钮选择 Actions
          </div>
        {/if}
      </div>
    </div>
    
    <Dialog.Footer>
      <Button variant="outline" onclick={() => serverDialogOpen = false}>取消</Button>
      <Button onclick={handleSaveServer} disabled={serverSaving}>
        {#if serverSaving}
          <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
        {/if}
        {editingServer ? '更新' : '创建'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- Actions Selector Drawer -->
<ActionsSelector 
  bind:open={actionsSelectorOpen} 
  bind:selected={serverForm.actions}
  onchange={handleActionsChange}
/>

<!-- API Keys Management Sheet -->
<Sheet.Root bind:open={apiKeysSheetOpen}>
  <Sheet.Content side="right" class="w-full sm:max-w-md flex flex-col">
    <Sheet.Header>
      <Sheet.Title>API 密钥访问管理</Sheet.Title>
      <Sheet.Description>
        {#if selectedMcpServer}
          管理可以访问 "{selectedMcpServer.name}" 的 API 密钥
        {/if}
      </Sheet.Description>
    </Sheet.Header>
    
    {#if selectedMcpServer}
      <div class="flex-1 overflow-y-auto p-1 space-y-4">
        {#if selectedMcpServer.isPublic}
          <div class="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div class="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Icon icon="mdi:information" class="size-5 shrink-0" />
              <span class="text-sm">此 MCP 服务为公开访问，无需 API 密钥</span>
            </div>
          </div>
        {/if}

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">可访问的 API 密钥</span>
            <Button variant="outline" size="sm" onclick={() => goto('/dashboard/ai/api-keys')}>
              <Icon icon="mdi:plus" class="mr-1 size-4" />
              创建新密钥
            </Button>
          </div>
          
          {#if apiKeys.length === 0}
            <div class="text-center py-8 text-muted-foreground border rounded-lg">
              <Icon icon="mdi:key-variant" class="size-8 mb-2 mx-auto opacity-50" />
              <p class="text-sm">{t('page.ai.apiKey.noKeys')}</p>
              <p class="text-xs mt-1">{t('page.ai.apiKey.createHintForMcp')}</p>
            </div>
          {:else}
            <div class="rounded-lg border divide-y max-h-64 overflow-y-auto">
              {#each apiKeys as apiKey}
                {@const hasAccess = apiKey.accessAll || apiKey.mcpServerIds.includes(selectedMcpServer.id)}
                {@const expired = isExpired(apiKey.expiresAt)}
                <div class="flex items-center gap-3 px-3 py-2.5 {hasAccess ? 'bg-primary/5' : ''}">
                  <Checkbox 
                    checked={hasAccess}
                    disabled={apiKey.accessAll || apiKey.isRevoked || expired || apiKeysSaving}
                    onCheckedChange={() => toggleApiKeyAccess(apiKey)}
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium truncate">{apiKey.name}</span>
                      {#if apiKey.isRevoked}
                        <Badge variant="destructive" class="text-xs shrink-0">已撤销</Badge>
                      {:else if expired}
                        <Badge variant="secondary" class="text-xs shrink-0">已过期</Badge>
                      {:else if apiKey.accessAll}
                        <Badge variant="default" class="text-xs shrink-0">全部 MCP</Badge>
                      {:else if hasAccess}
                        <Badge variant="outline" class="text-xs shrink-0">已授权</Badge>
                      {/if}
                    </div>
                    <code class="text-xs text-muted-foreground">{apiKey.tokenPrefix}</code>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <p class="text-xs text-muted-foreground">
          勾选的 API 密钥可以访问此 MCP 服务。标记为"全部 MCP"的密钥自动拥有访问权限。
        </p>
      </div>
      
      <Sheet.Footer class="border-t pt-4">
        <Button variant="outline" onclick={() => apiKeysSheetOpen = false}>关闭</Button>
      </Sheet.Footer>
    {/if}
  </Sheet.Content>
</Sheet.Root>

<!-- Config Preview Sheet -->
<Sheet.Root bind:open={configSheetOpen}>
  <Sheet.Content side="right" class="w-full sm:max-w-lg flex flex-col">
    <Sheet.Header>
      <Sheet.Title>MCP 配置</Sheet.Title>
      <Sheet.Description>
        {#if configMcpServer}
          复制以下配置到你的 AI 工具中使用 "{configMcpServer.name}"
        {/if}
      </Sheet.Description>
    </Sheet.Header>
    
    {#if configMcpServer}
      <div class="flex-1 overflow-y-auto p-1 space-y-4">
        {#if configLoading}
          <div class="flex items-center justify-center py-12 text-muted-foreground">
            <Icon icon="mdi:loading" class="size-6 animate-spin mr-2" />
            {t('common.tips.loading')}
          </div>
        {:else if mcpConfig}
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label>端点地址</Label>
              <Button variant="ghost" size="sm" onclick={copyEndpoint}>
                <Icon icon="mdi:content-copy" class="mr-1 size-4" />
                复制
              </Button>
            </div>
            <code class="block p-3 bg-muted rounded-md text-sm break-all">
              {mcpConfig.endpoint}
            </code>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label>配置 JSON</Label>
              <Button variant="ghost" size="sm" onclick={copyConfig}>
                <Icon icon="mdi:content-copy" class="mr-1 size-4" />
                复制
              </Button>
            </div>
            <pre class="p-3 bg-muted rounded-md text-sm overflow-x-auto"><code>{mcpConfig.configJson}</code></pre>
          </div>

          {#if !configMcpServer.isPublic}
            <div class="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div class="flex items-start gap-2 text-amber-700 dark:text-amber-300">
                <Icon icon="mdi:information" class="size-5 shrink-0 mt-0.5" />
                <div class="text-sm space-y-1">
                  <p>此 MCP 服务需要 API 密钥访问</p>
                  <p class="text-xs opacity-80">请将 <code class="bg-amber-200/50 dark:bg-amber-800/50 px-1 rounded">&lt;YOUR_API_KEY&gt;</code> 替换为你的实际 API 密钥</p>
                </div>
              </div>
            </div>
          {/if}

          <div class="space-y-2">
            <Label>包含的 Tools ({configMcpServer.actions.length})</Label>
            <div class="flex flex-wrap gap-1 p-3 rounded-md border bg-muted/50 max-h-40 overflow-y-auto">
              {#each configMcpServer.actions as action}
                <Badge variant="secondary" class="text-xs">{getActionDisplayName(action)}</Badge>
              {/each}
            </div>
          </div>
        {/if}
      </div>
      
      <Sheet.Footer class="border-t pt-4">
        <Button variant="outline" onclick={() => configSheetOpen = false}>关闭</Button>
        {#if mcpConfig}
          <Button onclick={copyConfig}>
            <Icon icon="mdi:content-copy" class="mr-1 size-4" />
            复制配置
          </Button>
        {/if}
      </Sheet.Footer>
    {/if}
  </Sheet.Content>
</Sheet.Root>
