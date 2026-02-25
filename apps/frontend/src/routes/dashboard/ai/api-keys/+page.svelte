<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface McpServer {
    id: string;
    name: string;
    description: string | null;
    actions: string[];
  }

  interface ApiKey {
    id: string;
    name: string;
    tokenPrefix: string;
    accessAll: boolean;
    mcpServerIds: string[];
    expiresAt: string | null;
    isRevoked: boolean;
    revokedAt: string | null;
    lastUsedAt: string | null;
    createdAt: string;
    remark: string | null;
  }

  interface PageSnapshot {
    apiKeys: ApiKey[];
    mcpServers: McpServer[];
    dataLoaded: boolean;
  }

  let pageState: PageSnapshot = {
    apiKeys: [],
    mcpServers: [],
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
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '@/lib/stores/i18n.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Switch } from '$lib/components/ui/switch';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Card from '$lib/components/ui/card';
  import * as Sheet from '$lib/components/ui/sheet';
  import { Badge } from '$lib/components/ui/badge';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import * as Table from '$lib/components/ui/table';
  import { toast } from 'svelte-sonner';

  interface ApiKeyForm {
    name: string;
    accessAll: boolean;
    mcpServerIds: string[];
    expiresInDays: number;
    remark: string;
  }

  let apiKeys = $state<ApiKey[]>(pageState.apiKeys);
  let mcpServers = $state<McpServer[]>(pageState.mcpServers);
  let loading = $state(!pageState.dataLoaded);
  let snapshotRestored = $state(pageState.dataLoaded);

  // Register restore callback
  restoreCallback = (value) => {
    apiKeys = value.apiKeys;
    mcpServers = value.mcpServers;
    snapshotRestored = value.dataLoaded;
    loading = !value.dataLoaded;
  };

  // Sync state to module-level for snapshot
  $effect(() => {
    pageState = {
      apiKeys,
      mcpServers,
      dataLoaded: !loading
    };
  });
  
  // Create Dialog state
  let createDialogOpen = $state(false);
  let saving = $state(false);
  let form = $state<ApiKeyForm>({ name: '', accessAll: true, mcpServerIds: [], expiresInDays: 30, remark: '' });
  let newKeyValue = $state<string | null>(null);

  // Edit Sheet state
  let editSheetOpen = $state(false);
  let editingKey = $state<ApiKey | null>(null);
  let editForm = $state<{ name: string; accessAll: boolean; mcpServerIds: string[]; remark: string }>({
    name: '', accessAll: true, mcpServerIds: [], remark: ''
  });
  let editSaving = $state(false);

  function getMcpNames(ids: string[]): string[] {
    return ids.map(id => mcpServers.find(s => s.id === id)?.name || id);
  }

  async function loadApiKeys() {
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiApiKeyQuery({ 
        limit: 100, 
        offset: 0,
        sort: { field: 'createdAt', order: 'desc' }
      });
      if (res.data?.data) apiKeys = res.data.data;
    } catch (err) {
      console.error('Failed to load API keys:', err);
      toast.error(t('common.tips.loadFailed'));
    } finally {
      loading = false;
    }
  }

  async function loadMcpServers() {
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiMcpServerQuery({ limit: 100, offset: 0 });
      if (res.data?.data) mcpServers = res.data.data;
    } catch (err) {
      console.error('Failed to load MCP servers:', err);
    }
  }

  function openCreateDialog() {
    form = { name: '', accessAll: true, mcpServerIds: [], expiresInDays: 30, remark: '' };
    newKeyValue = null;
    createDialogOpen = true;
  }

  function openEditSheet(key: ApiKey) {
    editingKey = key;
    editForm = {
      name: key.name,
      accessAll: key.accessAll,
      mcpServerIds: [...key.mcpServerIds],
      remark: key.remark || '',
    };
    editSheetOpen = true;
  }

  function toggleMcp(mcpId: string, isEdit = false) {
    if (isEdit) {
      if (editForm.mcpServerIds.includes(mcpId)) {
        editForm.mcpServerIds = editForm.mcpServerIds.filter(id => id !== mcpId);
      } else {
        editForm.mcpServerIds = [...editForm.mcpServerIds, mcpId];
      }
    } else {
      if (form.mcpServerIds.includes(mcpId)) {
        form.mcpServerIds = form.mcpServerIds.filter(id => id !== mcpId);
      } else {
        form.mcpServerIds = [...form.mcpServerIds, mcpId];
      }
    }
  }

  async function handleCreate() {
    if (!form.name.trim()) {
      toast.error(t('page.ai.apiKey_fillKeyName'));
      return;
    }
    if (!form.accessAll && form.mcpServerIds.length === 0) {
      toast.error(t('page.ai.apiKey_selectAtLeastOneMcp'));
      return;
    }
    
    saving = true;
    try {
      const api = authStore.createApi(true);
      const expiresAt = form.expiresInDays > 0 
        ? new Date(Date.now() + form.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
        : undefined;
      
      const res = await api.ai.postApiAiApiKey({ 
        data: {
          name: form.name,
          accessAll: form.accessAll,
          mcpServerIds: form.accessAll ? [] : form.mcpServerIds,
          expiresAt,
          remark: form.remark || undefined,
        }
      });
      
      if (res.data?.token) {
        newKeyValue = res.data.token;
        toast.success(t('page.ai.apiKey_createSuccess'));
        loadApiKeys();
      }
    } catch (err) {
      console.error('Failed to create:', err);
      toast.error(t('common.tips.createFailed'));
    } finally {
      saving = false;
    }
  }

  async function handleUpdate() {
    if (!editingKey) return;
    if (!editForm.name.trim()) {
      toast.error(t('page.ai.apiKey_fillKeyName'));
      return;
    }
    if (!editForm.accessAll && editForm.mcpServerIds.length === 0) {
      toast.error(t('page.ai.apiKey_selectAtLeastOneMcp'));
      return;
    }
    
    editSaving = true;
    try {
      const api = authStore.createApi(true);
      await api.ai.putApiAiApiKeyById({ id: editingKey.id }, { 
        data: {
          name: editForm.name,
          accessAll: editForm.accessAll,
          mcpServerIds: editForm.accessAll ? [] : editForm.mcpServerIds,
          remark: editForm.remark || null,
        }
      });
      
      toast.success(t('page.ai.apiKey_updateSuccess'));
      editSheetOpen = false;
      loadApiKeys();
    } catch (err) {
      console.error('Failed to update:', err);
      toast.error(t('common.tips.updateFailed'));
    } finally {
      editSaving = false;
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm(t('page.ai.apiKey_revokeConfirm'))) return;
    
    try {
      const api = authStore.createApi(true);
      await api.ai.postApiAiApiKeyByIdRevoke({ id });
      toast.success(t('page.ai.apiKey_revokeSuccess'));
      loadApiKeys();
    } catch (err) {
      console.error('Failed to revoke:', err);
      toast.error(t('common.tips.operationFailed'));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t('page.ai.apiKey_deleteConfirm'))) return;
    
    try {
      const api = authStore.createApi(true);
      await api.ai.deleteApiAiApiKeyById({ id });
      toast.success(t('page.ai.apiKey_deleteSuccess'));
      loadApiKeys();
    } catch (err) {
      console.error('Failed to delete:', err);
      toast.error(t('common.tips.deleteFailed'));
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success(t('page.ai.apiKey_copiedToClipboard'));
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  }

  function isExpired(exp: string | null): boolean {
    if (!exp) return false;
    return new Date(exp) < new Date();
  }

  onMount(() => {
    if (!snapshotRestored) {
      loadMcpServers();
      loadApiKeys();
    }
  });
</script>

<div class="flex flex-1 flex-col min-h-0 px-4 lg:px-6 pb-4">
  <div class="py-3 flex items-center justify-between border-b border-border">
    <div class="flex gap-2">
      <Button size="sm" onclick={openCreateDialog}>
        <Icon icon="mdi:plus" class="mr-1 size-4" />{t('page.ai.apiKey_addKey')}
      </Button>
    </div>
    <Button size="sm" variant="ghost" class="h-8 w-8 p-0" onclick={loadApiKeys}>
      <Icon icon="mdi:refresh" class="size-4" />
    </Button>
  </div>

  <div class="flex-1 min-h-0 pt-4">
  {#if loading}
    <div class="flex items-center justify-center py-12 text-muted-foreground">
      <Icon icon="mdi:loading" class="size-6 animate-spin mr-2" />
      {t('common.tips.loading')}
    </div>
  {:else if apiKeys.length === 0}
    <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Icon icon="mdi:key-variant" class="size-12 mb-4 opacity-50" />
      <p>{t('page.ai.apiKey_noKeys')}</p>
      <p class="text-sm mt-1">{t('page.ai.apiKey_createHint')}</p>
    </div>
  {:else}
    <Card.Root>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>{t('page.ai.apiKey_name')}</Table.Head>
            <Table.Head>{t('page.ai.apiKey_key')}</Table.Head>
            <Table.Head>{t('page.ai.apiKey_mcpAccess')}</Table.Head>
            <Table.Head>{t('page.ai.apiKey_status')}</Table.Head>
            <Table.Head>{t('page.ai.apiKey_expiresAt')}</Table.Head>
            <Table.Head>{t('page.ai.apiKey_lastUsed')}</Table.Head>
            <Table.Head class="text-right">{t('page.ai.apiKey_actions')}</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each apiKeys as key}
            <Table.Row class="cursor-pointer hover:bg-muted/50" onclick={() => openEditSheet(key)}>
              <Table.Cell class="font-medium">{key.name}</Table.Cell>
              <Table.Cell>
                <code class="text-xs bg-muted px-1.5 py-0.5 rounded">{key.tokenPrefix}</code>
              </Table.Cell>
              <Table.Cell>
                {#if key.accessAll}
                  <Badge variant="default">{t('page.ai.apiKey_allMcp')}</Badge>
                {:else}
                  <div class="flex flex-wrap gap-1">
                    {#each getMcpNames(key.mcpServerIds).slice(0, 2) as name}
                      <Badge variant="secondary" class="text-xs">{name}</Badge>
                    {/each}
                    {#if key.mcpServerIds.length > 2}
                      <Badge variant="outline" class="text-xs">+{key.mcpServerIds.length - 2}</Badge>
                    {/if}
                    {#if key.mcpServerIds.length === 0}
                      <span class="text-muted-foreground text-xs">{t('page.ai.apiKey_none')}</span>
                    {/if}
                  </div>
                {/if}
              </Table.Cell>
              <Table.Cell>
                {#if key.isRevoked}
                  <Badge variant="destructive">{t('page.ai.apiKey_revoked')}</Badge>
                {:else if isExpired(key.expiresAt)}
                  <Badge variant="secondary">{t('page.ai.apiKey_expired')}</Badge>
                {:else}
                  <Badge variant="default">{t('page.ai.apiKey_active')}</Badge>
                {/if}
              </Table.Cell>
              <Table.Cell class="text-sm text-muted-foreground">
                {key.expiresAt ? formatDate(key.expiresAt) : t('page.ai.apiKey_neverExpire')}
              </Table.Cell>
              <Table.Cell class="text-sm text-muted-foreground">
                {formatDate(key.lastUsedAt)}
              </Table.Cell>
              <Table.Cell class="text-right" onclick={(e: MouseEvent) => e.stopPropagation()}>
                <div class="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onclick={() => openEditSheet(key)} title={t('common.edit')}>
                    <Icon icon="mdi:pencil" class="size-4" />
                  </Button>
                  {#if !key.isRevoked && !isExpired(key.expiresAt)}
                    <Button variant="ghost" size="icon" onclick={() => handleRevoke(key.id)} title={t('common.revoke')}>
                      <Icon icon="mdi:cancel" class="size-4" />
                    </Button>
                  {/if}
                  <Button variant="ghost" size="icon" onclick={() => handleDelete(key.id)} title={t('common.delete')}>
                    <Icon icon="mdi:delete-outline" class="size-4 text-destructive" />
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </Card.Root>
  {/if}
  </div>
</div>

<!-- Create Dialog -->
<Dialog.Root bind:open={createDialogOpen}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{t('page.ai.apiKey_createTitle')}</Dialog.Title>
      <Dialog.Description>{t('page.ai.apiKey_createDesc')}</Dialog.Description>
    </Dialog.Header>
    
    {#if newKeyValue}
      <div class="space-y-4">
        <div class="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div class="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
            <Icon icon="mdi:alert" class="size-5" />
            <span class="font-medium">{t('page.ai.apiKey_saveKeyWarning')}</span>
          </div>
          <p class="text-sm text-amber-600 dark:text-amber-400 mb-3">{t('page.ai.apiKey_saveKeyHint')}</p>
          <div class="flex items-center gap-2">
            <code class="flex-1 text-sm bg-background p-2 rounded border break-all font-mono">{newKeyValue}</code>
            <Button variant="outline" size="icon" onclick={() => copyToClipboard(newKeyValue!)}>
              <Icon icon="mdi:content-copy" class="size-4" />
            </Button>
          </div>
        </div>
        <Button class="w-full" onclick={() => { createDialogOpen = false; }}>
          {t('page.ai.apiKey_savedClose')}
        </Button>
      </div>
    {:else}
      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="name">{t('page.ai.apiKey_keyNameRequired')}</Label>
          <Input id="name" bind:value={form.name} placeholder={t('page.ai.apiKey_keyNameExample')} />
        </div>
        
        <div class="space-y-2">
          <Label for="expiresInDays">{t('page.ai.apiKey_validityDays')}</Label>
          <Input id="expiresInDays" type="number" bind:value={form.expiresInDays} min={0} max={365} />
          <p class="text-xs text-muted-foreground">{t('page.ai.apiKey_validityHint')}</p>
        </div>

        <div class="space-y-2">
          <Label for="remark">{t('page.ai.apiKey_remark')}</Label>
          <Input id="remark" bind:value={form.remark} placeholder={t('page.ai.apiKey_remarkPlaceholder')} />
        </div>
        
        <div class="flex items-center justify-between rounded-lg border p-3">
          <div class="space-y-0.5">
            <Label>{t('page.ai.apiKey_accessAllMcp')}</Label>
            <p class="text-xs text-muted-foreground">{t('page.ai.apiKey_accessAllMcpHint')}</p>
          </div>
          <Switch bind:checked={form.accessAll} />
        </div>
        
        {#if !form.accessAll}
          <div class="space-y-2">
            <Label>{t('page.ai.apiKey_selectMcp')} ({form.mcpServerIds.length} {t('page.ai.apiKey_selected')})</Label>
            <ScrollArea class="h-48 rounded-md border p-3">
              {#if mcpServers.length === 0}
                <div class="text-center py-4 text-muted-foreground">
                  {t('page.ai.mcp_noServersCreateFirst')}
                </div>
              {:else}
                {#each mcpServers as server}
                  <label class="flex items-start gap-3 p-2 rounded hover:bg-muted cursor-pointer">
                    <Checkbox 
                      checked={form.mcpServerIds.includes(server.id)}
                      onCheckedChange={() => toggleMcp(server.id)}
                    />
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium">{server.name}</div>
                      {#if server.description}
                        <div class="text-xs text-muted-foreground truncate">{server.description}</div>
                      {/if}
                      <div class="text-xs text-muted-foreground mt-1">
                        {server.actions.length} {t('page.ai.apiKey_tools')}
                      </div>
                    </div>
                  </label>
                {/each}
              {/if}
            </ScrollArea>
          </div>
        {/if}
      </div>
      
      <Dialog.Footer>
        <Button variant="outline" onclick={() => createDialogOpen = false}>{t('common.cancel')}</Button>
        <Button onclick={handleCreate} disabled={saving}>
          {#if saving}
            <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
          {/if}
          {t('common.create')}
        </Button>
      </Dialog.Footer>
    {/if}
  </Dialog.Content>
</Dialog.Root>

<!-- Edit Sheet -->
<Sheet.Root bind:open={editSheetOpen}>
  <Sheet.Content side="right" class="w-full sm:max-w-md flex flex-col">
    <Sheet.Header>
      <Sheet.Title>{t('page.ai.apiKey_editTitle')}</Sheet.Title>
      <Sheet.Description>{t('page.ai.apiKey_editDesc')}</Sheet.Description>
    </Sheet.Header>
    
    {#if editingKey}
      <div class="flex-1 overflow-y-auto p-1 space-y-4">
        <!-- 基本信息区域 -->
        <div class="space-y-3">
          <div class="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Icon icon="mdi:key-variant" class="size-8 text-muted-foreground" />
            <div class="flex-1 min-w-0">
              <code class="text-sm font-mono">{editingKey.tokenPrefix}</code>
              <div class="flex items-center gap-2 mt-1">
                {#if editingKey.isRevoked}
                  <Badge variant="destructive">{t('page.ai.apiKey_revoked')}</Badge>
                {:else if isExpired(editingKey.expiresAt)}
                  <Badge variant="secondary">{t('page.ai.apiKey_expired')}</Badge>
                {:else}
                  <Badge variant="default">{t('page.ai.apiKey_active')}</Badge>
                {/if}
              </div>
            </div>
          </div>

          <div class="grid gap-3">
            <div class="space-y-1.5">
              <Label for="edit-name">{t('page.ai.apiKey_name')}</Label>
              <Input id="edit-name" bind:value={editForm.name} />
            </div>

            <div class="space-y-1.5">
              <Label for="edit-remark">{t('page.ai.apiKey_remark')}</Label>
              <Input id="edit-remark" bind:value={editForm.remark} placeholder={t('common.optional')} />
            </div>
          </div>
        </div>
        
        <!-- MCP 访问范围 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2 px-3 rounded-lg border">
            <div>
              <div class="text-sm font-medium">{t('page.ai.apiKey_accessAllMcpShort')}</div>
              <div class="text-xs text-muted-foreground">{t('page.ai.apiKey_accessAllMcpShortHint')}</div>
            </div>
            <Switch bind:checked={editForm.accessAll} />
          </div>
          
          {#if !editForm.accessAll}
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label class="text-sm">{t('page.ai.apiKey_mcpServices')}</Label>
                <span class="text-xs text-muted-foreground">{editForm.mcpServerIds.length} {t('page.ai.apiKey_selected')}</span>
              </div>
              <div class="rounded-lg border divide-y max-h-40 overflow-y-auto">
                {#if mcpServers.length === 0}
                  <div class="text-center py-6 text-muted-foreground text-sm">
                    {t('page.ai.mcp_noServers')}
                  </div>
                {:else}
                  {#each mcpServers as server}
                    <label class="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 cursor-pointer">
                      <Checkbox 
                        checked={editForm.mcpServerIds.includes(server.id)}
                        onCheckedChange={() => toggleMcp(server.id, true)}
                      />
                      <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium truncate">{server.name}</div>
                        <div class="text-xs text-muted-foreground">{server.actions.length} Tools</div>
                      </div>
                    </label>
                  {/each}
                {/if}
              </div>
            </div>
          {/if}
        </div>

        <!-- 详细信息 -->
        <div class="rounded-lg border p-3 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">{t('page.ai.apiKey_createdAt')}</span>
            <span>{formatDate(editingKey.createdAt)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">{t('page.ai.apiKey_expiresAt')}</span>
            <span>{editingKey.expiresAt ? formatDate(editingKey.expiresAt) : t('page.ai.apiKey_neverExpire')}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">{t('page.ai.apiKey_lastUsed')}</span>
            <span>{formatDate(editingKey.lastUsedAt)}</span>
          </div>
        </div>
      </div>
      
      <Sheet.Footer class="border-t pt-4">
        <Button variant="outline" onclick={() => editSheetOpen = false}>{t('common.cancel')}</Button>
        <Button onclick={handleUpdate} disabled={editSaving || editingKey.isRevoked}>
          {#if editSaving}
            <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
          {/if}
          {t('common.save')}
        </Button>
      </Sheet.Footer>
    {/if}
  </Sheet.Content>
</Sheet.Root>
