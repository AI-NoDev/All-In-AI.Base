<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface McpServer {
    id: string;
    name: string;
    description: string | null;
    actions: string[];
    isPublic: boolean;
    status: string;
    createdAt: string;
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

  interface PageSnapshot {
    servers: McpServer[];
    apiKeys: ApiKey[];
    dataLoaded: boolean;
  }

  let pageState: PageSnapshot = {
    servers: [],
    apiKeys: [],
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

  interface McpServerForm {
    name: string;
    description: string;
    actions: string[];
    isPublic: boolean;
    status: string;
  }

  let servers = $state<McpServer[]>(pageState.servers);
  let apiKeys = $state<ApiKey[]>(pageState.apiKeys);
  let loading = $state(!pageState.dataLoaded);
  let snapshotRestored = $state(pageState.dataLoaded);

  // Register restore callback
  restoreCallback = (value) => {
    servers = value.servers;
    apiKeys = value.apiKeys;
    snapshotRestored = value.dataLoaded;
    loading = !value.dataLoaded;
  };

  // Sync state to module-level for snapshot
  $effect(() => {
    pageState = {
      servers,
      apiKeys,
      dataLoaded: !loading
    };
  });
  
  let serverDialogOpen = $state(false);
  let editingServer = $state<McpServer | null>(null);
  let serverSaving = $state(false);
  let serverForm = $state<McpServerForm>({ name: '', description: '', actions: [], isPublic: false, status: '0' });
  let actionsSelectorOpen = $state(false);
  let apiKeysSheetOpen = $state(false);
  let selectedMcpServer = $state<McpServer | null>(null);
  let apiKeysSaving = $state(false);
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
      toast.error(t('common.tips.loadFailed'));
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

  function isExpired(exp: string | null): boolean {
    if (!exp) return false;
    return new Date(exp) < new Date();
  }

  function openApiKeysSheet(server: McpServer) {
    selectedMcpServer = server;
    apiKeysSheetOpen = true;
  }

  async function toggleApiKeyAccess(apiKey: ApiKey) {
    if (!selectedMcpServer || apiKey.accessAll) return;
    apiKeysSaving = true;
    try {
      const api = authStore.createApi(true);
      const hasAccess = apiKey.mcpServerIds.includes(selectedMcpServer.id);
      const newMcpServerIds = hasAccess
        ? apiKey.mcpServerIds.filter(id => id !== selectedMcpServer!.id)
        : [...apiKey.mcpServerIds, selectedMcpServer.id];
      await api.ai.putApiAiApiKeyById({ id: apiKey.id }, { data: { mcpServerIds: newMcpServerIds } });
      apiKeys = apiKeys.map(k => k.id === apiKey.id ? { ...k, mcpServerIds: newMcpServerIds } : k);
      toast.success(hasAccess ? t('page.ai.mcp_accessRemoved') : t('page.ai.mcp_accessAdded'));
    } catch (err) {
      console.error('Failed to update:', err);
      toast.error(t('common.tips.updateFailed'));
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
    serverForm = { name: server.name, description: server.description || '', actions: [...server.actions], isPublic: server.isPublic, status: server.status };
    serverDialogOpen = true;
  }

  function openActionsSelector() {
    actionsSelectorOpen = true;
  }

  function handleActionsChange(selected: string[]) {
    serverForm.actions = selected;
  }

  async function handleSaveServer() {
    if (!serverForm.name.trim()) { toast.error(t('page.ai.mcp_fillServerName')); return; }
    if (serverForm.actions.length === 0) { toast.error(t('page.ai.mcp_selectAtLeastOneAction')); return; }
    serverSaving = true;
    try {
      const api = authStore.createApi(true);
      const data = { name: serverForm.name, description: serverForm.description || null, actions: serverForm.actions, isPublic: serverForm.isPublic, status: serverForm.status };
      if (editingServer) { await api.ai.putApiAiMcpServerById({ id: editingServer.id }, { data }); }
      else { await api.ai.postApiAiMcpServer({ data }); }
      toast.success(editingServer ? t('page.ai.mcp_updateSuccess') : t('page.ai.mcp_createSuccess'));
      serverDialogOpen = false;
      loadServers();
    } catch (err) {
      console.error('Failed to save:', err);
      toast.error(t('common.tips.saveFailed'));
    } finally {
      serverSaving = false;
    }
  }

  async function handleDeleteServer(id: string) {
    if (!confirm(t('page.ai.mcp_deleteConfirm'))) return;
    try {
      const api = authStore.createApi(true);
      await api.ai.deleteApiAiMcpServerById({ id });
      toast.success(t('page.ai.mcp_deleteSuccess'));
      loadServers();
    } catch (err) {
      console.error('Failed to delete:', err);
      toast.error(t('common.tips.deleteFailed'));
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
      if (res.data) { mcpConfig = { endpoint: res.data.endpoint, configJson: res.data.configJson }; }
    } catch (err) {
      console.error('Failed to load MCP config:', err);
      toast.error(t('page.ai.mcp_configLoadFailed'));
    } finally {
      configLoading = false;
    }
  }

  function copyEndpoint() {
    if (!mcpConfig) return;
    navigator.clipboard.writeText(mcpConfig.endpoint);
    toast.success(t('page.ai.mcp_endpointCopied'));
  }

  function copyConfig() {
    if (!mcpConfig) return;
    navigator.clipboard.writeText(mcpConfig.configJson);
    toast.success(t('page.ai.mcp_configCopied'));
  }

  function getActionDisplayName(actionName: string): string {
    const action = actionsStore.getByName(actionName);
    return action?.displayName || actionName.split('.').pop() || actionName;
  }

  onMount(() => {
    actionsStore.load();
    if (!snapshotRestored) {
      loadServers();
      loadApiKeys();
    }
  });
</script>

<div class="flex flex-1 flex-col min-h-0 px-4 lg:px-6 pb-4">
  <div class="py-3 flex items-center justify-between border-b border-border">
    <div class="flex gap-2">
      <Button size="sm" onclick={openCreateServerDialog}>
        <Icon icon="mdi:plus" class="mr-1 size-4" />{t('page.ai.mcp_addServer')}
      </Button>
    </div>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadServers}>
      <Icon icon="mdi:refresh" class="size-4" />
    </Button>
  </div>

  <div class="flex-1 min-h-0 pt-4">
  {#if loading}
    <div class="flex items-center justify-center py-12 text-muted-foreground">
      <Icon icon="mdi:loading" class="size-6 animate-spin mr-2" />{t('common.tips.loading')}
    </div>
  {:else if servers.length === 0}
    <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Icon icon="mdi:api" class="size-12 mb-4 opacity-50" />
      <p>{t('page.ai.mcp_noServers')}</p>
      <p class="text-sm mt-1">{t('page.ai.mcp_createHint')}</p>
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
                  <Badge variant="secondary">{t('page.ai.mcp_public')}</Badge>
                {:else}
                  <Badge variant="outline">{t('page.ai.mcp_private')}</Badge>
                {/if}
              </div>
            </div>
            {#if server.description}
              <Card.Description class="line-clamp-2">{server.description}</Card.Description>
            {/if}
          </Card.Header>
          <Card.Content class="pb-3">
            <div class="text-sm text-muted-foreground mb-2">
              {t('page.ai.mcp_containsTools').replace('${count}', String(server.actions.length))}
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
              <Button variant="ghost" size="icon" onclick={() => openConfigSheet(server)} title={t('page.ai.mcp_viewConfig')}>
                <Icon icon="mdi:code-json" class="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onclick={() => openApiKeysSheet(server)} title={t('page.ai.mcp_manageApiKeys')}>
                <Icon icon="mdi:key-variant" class="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onclick={() => openEditServerDialog(server)} title={t('common.edit')}>
                <Icon icon="mdi:pencil" class="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onclick={() => handleDeleteServer(server.id)} title={t('common.delete')}>
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

<Dialog.Root bind:open={serverDialogOpen}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{editingServer ? t('page.ai.mcp_editTitle') : t('page.ai.mcp_createTitle')}</Dialog.Title>
      <Dialog.Description>{t('page.ai.mcp_dialogDesc')}</Dialog.Description>
    </Dialog.Header>
    <div class="space-y-4">
      <div class="space-y-2">
        <Label for="name">{t('page.ai.mcp_serverName')}</Label>
        <Input id="name" bind:value={serverForm.name} placeholder={t('page.ai.mcp_serverNameExample')} />
      </div>
      <div class="space-y-2">
        <Label for="description">{t('page.ai.mcp_description')}</Label>
        <Textarea id="description" bind:value={serverForm.description} placeholder={t('page.ai.mcp_descriptionPlaceholder')} rows={2} />
      </div>
      <div class="flex items-center justify-between rounded-lg border p-3">
        <div class="space-y-0.5">
          <Label>{t('page.ai.mcp_publicAccess')}</Label>
          <p class="text-xs text-muted-foreground">{t('page.ai.mcp_publicAccessHint')}</p>
        </div>
        <Switch bind:checked={serverForm.isPublic} />
      </div>
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <Label>{t('page.ai.mcp_actions')} ({serverForm.actions.length} {t('page.ai.apiKey_selected')})</Label>
          <Button variant="outline" size="sm" onclick={openActionsSelector}>
            <Icon icon="mdi:plus" class="mr-1 size-4" />{t('page.ai.mcp_selectActions')}
          </Button>
        </div>
        {#if serverForm.actions.length > 0}
          <div class="flex flex-wrap gap-1 p-3 rounded-md border bg-muted/50 max-h-32 overflow-y-auto">
            {#each serverForm.actions as action}
              <Badge variant="secondary" class="text-xs">
                {getActionDisplayName(action)}
                <button type="button" class="ml-1 hover:text-destructive" onclick={() => serverForm.actions = serverForm.actions.filter(a => a !== action)}>
                  <Icon icon="mdi:close" class="size-3" />
                </button>
              </Badge>
            {/each}
          </div>
        {:else}
          <div class="text-center py-4 text-muted-foreground text-sm border rounded-md">{t('page.ai.mcp_selectActionsHint')}</div>
        {/if}
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => serverDialogOpen = false}>{t('common.cancel')}</Button>
      <Button onclick={handleSaveServer} disabled={serverSaving}>
        {#if serverSaving}<Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />{/if}
        {editingServer ? t('common.update') : t('common.create')}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<ActionsSelector bind:open={actionsSelectorOpen} bind:selected={serverForm.actions} onchange={handleActionsChange} />

<Sheet.Root bind:open={apiKeysSheetOpen}>
  <Sheet.Content side="right" class="w-full sm:max-w-md flex flex-col">
    <Sheet.Header>
      <Sheet.Title>{t('page.ai.mcp_apiKeyAccessTitle')}</Sheet.Title>
      <Sheet.Description>
        {#if selectedMcpServer}{t('page.ai.mcp_apiKeyAccessDesc').replace('${name}', selectedMcpServer.name)}{/if}
      </Sheet.Description>
    </Sheet.Header>
    {#if selectedMcpServer}
      <div class="flex-1 overflow-y-auto p-1 space-y-4">
        {#if selectedMcpServer.isPublic}
          <div class="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div class="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Icon icon="mdi:information" class="size-5 shrink-0" />
              <span class="text-sm">{t('page.ai.mcp_publicAccessNote')}</span>
            </div>
          </div>
        {/if}
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">{t('page.ai.mcp_accessibleApiKeys')}</span>
            <Button variant="outline" size="sm" onclick={() => goto('/dashboard/ai/api-keys')}>
              <Icon icon="mdi:plus" class="mr-1 size-4" />{t('page.ai.mcp_createNewKey')}
            </Button>
          </div>
          {#if apiKeys.length === 0}
            <div class="text-center py-8 text-muted-foreground border rounded-lg">
              <Icon icon="mdi:key-variant" class="size-8 mb-2 mx-auto opacity-50" />
              <p class="text-sm">{t('page.ai.apiKey_noKeys')}</p>
              <p class="text-xs mt-1">{t('page.ai.apiKey_createHintForMcp')}</p>
            </div>
          {:else}
            <div class="rounded-lg border divide-y max-h-64 overflow-y-auto">
              {#each apiKeys as apiKey}
                {@const hasAccess = apiKey.accessAll || apiKey.mcpServerIds.includes(selectedMcpServer.id)}
                {@const expired = isExpired(apiKey.expiresAt)}
                <div class="flex items-center gap-3 px-3 py-2.5 {hasAccess ? 'bg-primary/5' : ''}">
                  <Checkbox checked={hasAccess} disabled={apiKey.accessAll || apiKey.isRevoked || expired || apiKeysSaving} onCheckedChange={() => toggleApiKeyAccess(apiKey)} />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium truncate">{apiKey.name}</span>
                      {#if apiKey.isRevoked}<Badge variant="destructive" class="text-xs shrink-0">{t('page.ai.apiKey_revoked')}</Badge>
                      {:else if expired}<Badge variant="secondary" class="text-xs shrink-0">{t('page.ai.apiKey_expired')}</Badge>
                      {:else if apiKey.accessAll}<Badge variant="default" class="text-xs shrink-0">{t('page.ai.apiKey_allMcp')}</Badge>
                      {:else if hasAccess}<Badge variant="outline" class="text-xs shrink-0">{t('page.ai.apiKey_authorized')}</Badge>{/if}
                    </div>
                    <code class="text-xs text-muted-foreground">{apiKey.tokenPrefix}</code>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
        <p class="text-xs text-muted-foreground">{t('page.ai.mcp_apiKeyAccessHint')}</p>
      </div>
      <Sheet.Footer class="border-t pt-4">
        <Button variant="outline" onclick={() => apiKeysSheetOpen = false}>{t('common.close')}</Button>
      </Sheet.Footer>
    {/if}
  </Sheet.Content>
</Sheet.Root>

<Sheet.Root bind:open={configSheetOpen}>
  <Sheet.Content side="right" class="w-full sm:max-w-lg flex flex-col">
    <Sheet.Header>
      <Sheet.Title>{t('page.ai.mcp_configTitle')}</Sheet.Title>
      <Sheet.Description>
        {#if configMcpServer}{t('page.ai.mcp_configDesc').replace('${name}', configMcpServer.name)}{/if}
      </Sheet.Description>
    </Sheet.Header>
    {#if configMcpServer}
      <div class="flex-1 overflow-y-auto p-1 space-y-4">
        {#if configLoading}
          <div class="flex items-center justify-center py-12 text-muted-foreground">
            <Icon icon="mdi:loading" class="size-6 animate-spin mr-2" />{t('common.tips.loading')}
          </div>
        {:else if mcpConfig}
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label>{t('page.ai.mcp_endpoint')}</Label>
              <Button variant="ghost" size="sm" onclick={copyEndpoint}>
                <Icon icon="mdi:content-copy" class="mr-1 size-4" />{t('common.copy')}
              </Button>
            </div>
            <code class="block p-3 bg-muted rounded-md text-sm break-all">{mcpConfig.endpoint}</code>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label>{t('page.ai.mcp_configJson')}</Label>
              <Button variant="ghost" size="sm" onclick={copyConfig}>
                <Icon icon="mdi:content-copy" class="mr-1 size-4" />{t('common.copy')}
              </Button>
            </div>
            <pre class="p-3 bg-muted rounded-md text-sm overflow-x-auto"><code>{mcpConfig.configJson}</code></pre>
          </div>
          {#if !configMcpServer.isPublic}
            <div class="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div class="flex items-start gap-2 text-amber-700 dark:text-amber-300">
                <Icon icon="mdi:information" class="size-5 shrink-0 mt-0.5" />
                <div class="text-sm space-y-1">
                  <p>{t('page.ai.mcp_apiKeyRequired')}</p>
                  <p class="text-xs opacity-80">{t('page.ai.mcp_replaceApiKey')}</p>
                </div>
              </div>
            </div>
          {/if}
          <div class="space-y-2">
            <Label>{t('page.ai.mcp_includedTools')} ({configMcpServer.actions.length})</Label>
            <div class="flex flex-wrap gap-1 p-3 rounded-md border bg-muted/50 max-h-40 overflow-y-auto">
              {#each configMcpServer.actions as action}
                <Badge variant="secondary" class="text-xs">{getActionDisplayName(action)}</Badge>
              {/each}
            </div>
          </div>
        {/if}
      </div>
      <Sheet.Footer class="border-t pt-4">
        <Button variant="outline" onclick={() => configSheetOpen = false}>{t('common.close')}</Button>
        {#if mcpConfig}
          <Button onclick={copyConfig}>
            <Icon icon="mdi:content-copy" class="mr-1 size-4" />{t('page.ai.mcp_copyConfig')}
          </Button>
        {/if}
      </Sheet.Footer>
    {/if}
  </Sheet.Content>
</Sheet.Root>
