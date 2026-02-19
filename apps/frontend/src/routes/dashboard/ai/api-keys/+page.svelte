<script lang="ts">
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
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

  interface ApiKeyForm {
    name: string;
    accessAll: boolean;
    mcpServerIds: string[];
    expiresInDays: number;
    remark: string;
  }

  let apiKeys = $state<ApiKey[]>([]);
  let mcpServers = $state<McpServer[]>([]);
  let loading = $state(true);
  
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
      toast.error('加载失败');
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
      toast.error('请填写密钥名称');
      return;
    }
    if (!form.accessAll && form.mcpServerIds.length === 0) {
      toast.error('请至少选择一个 MCP 服务');
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
        toast.success('API 密钥创建成功');
        loadApiKeys();
      }
    } catch (err) {
      console.error('Failed to create:', err);
      toast.error('创建失败');
    } finally {
      saving = false;
    }
  }

  async function handleUpdate() {
    if (!editingKey) return;
    if (!editForm.name.trim()) {
      toast.error('请填写密钥名称');
      return;
    }
    if (!editForm.accessAll && editForm.mcpServerIds.length === 0) {
      toast.error('请至少选择一个 MCP 服务');
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
      
      toast.success('更新成功');
      editSheetOpen = false;
      loadApiKeys();
    } catch (err) {
      console.error('Failed to update:', err);
      toast.error('更新失败');
    } finally {
      editSaving = false;
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm('确定要撤销此 API 密钥吗？撤销后将无法恢复。')) return;
    
    try {
      const api = authStore.createApi(true);
      await api.ai.postApiAiApiKeyByIdRevoke({ id });
      toast.success('已撤销');
      loadApiKeys();
    } catch (err) {
      console.error('Failed to revoke:', err);
      toast.error('撤销失败');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除此 API 密钥吗？')) return;
    
    try {
      const api = authStore.createApi(true);
      await api.ai.deleteApiAiApiKeyById({ id });
      toast.success('已删除');
      loadApiKeys();
    } catch (err) {
      console.error('Failed to delete:', err);
      toast.error('删除失败');
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success('已复制到剪贴板');
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
    loadMcpServers();
    loadApiKeys();
  });
</script>

<div class="flex flex-1 flex-col min-h-0 px-4 lg:px-6 pb-4">
  <div class="py-3 flex items-center justify-between border-b border-border">
    <div class="flex gap-2">
      <Button size="sm" onclick={openCreateDialog}>
        <Icon icon="mdi:plus" class="mr-1 size-4" />新增密钥
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
      加载中...
    </div>
  {:else if apiKeys.length === 0}
    <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Icon icon="mdi:key-variant" class="size-12 mb-4 opacity-50" />
      <p>暂无 API 密钥</p>
      <p class="text-sm mt-1">创建一个 API 密钥来访问 MCP 服务</p>
    </div>
  {:else}
    <Card.Root>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>名称</Table.Head>
            <Table.Head>密钥</Table.Head>
            <Table.Head>MCP 访问范围</Table.Head>
            <Table.Head>状态</Table.Head>
            <Table.Head>过期时间</Table.Head>
            <Table.Head>最后使用</Table.Head>
            <Table.Head class="text-right">操作</Table.Head>
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
                  <Badge variant="default">全部 MCP</Badge>
                {:else}
                  <div class="flex flex-wrap gap-1">
                    {#each getMcpNames(key.mcpServerIds).slice(0, 2) as name}
                      <Badge variant="secondary" class="text-xs">{name}</Badge>
                    {/each}
                    {#if key.mcpServerIds.length > 2}
                      <Badge variant="outline" class="text-xs">+{key.mcpServerIds.length - 2}</Badge>
                    {/if}
                    {#if key.mcpServerIds.length === 0}
                      <span class="text-muted-foreground text-xs">无</span>
                    {/if}
                  </div>
                {/if}
              </Table.Cell>
              <Table.Cell>
                {#if key.isRevoked}
                  <Badge variant="destructive">已撤销</Badge>
                {:else if isExpired(key.expiresAt)}
                  <Badge variant="secondary">已过期</Badge>
                {:else}
                  <Badge variant="default">有效</Badge>
                {/if}
              </Table.Cell>
              <Table.Cell class="text-sm text-muted-foreground">
                {key.expiresAt ? formatDate(key.expiresAt) : '永不过期'}
              </Table.Cell>
              <Table.Cell class="text-sm text-muted-foreground">
                {formatDate(key.lastUsedAt)}
              </Table.Cell>
              <Table.Cell class="text-right" onclick={(e: MouseEvent) => e.stopPropagation()}>
                <div class="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" onclick={() => openEditSheet(key)} title="编辑">
                    <Icon icon="mdi:pencil" class="size-4" />
                  </Button>
                  {#if !key.isRevoked && !isExpired(key.expiresAt)}
                    <Button variant="ghost" size="icon" onclick={() => handleRevoke(key.id)} title="撤销">
                      <Icon icon="mdi:cancel" class="size-4" />
                    </Button>
                  {/if}
                  <Button variant="ghost" size="icon" onclick={() => handleDelete(key.id)} title="删除">
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
      <Dialog.Title>创建 API 密钥</Dialog.Title>
      <Dialog.Description>创建一个新的 API 密钥来访问 MCP 服务</Dialog.Description>
    </Dialog.Header>
    
    {#if newKeyValue}
      <div class="space-y-4">
        <div class="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div class="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-2">
            <Icon icon="mdi:alert" class="size-5" />
            <span class="font-medium">请保存此密钥</span>
          </div>
          <p class="text-sm text-amber-600 dark:text-amber-400 mb-3">密钥只会显示一次，请立即复制保存：</p>
          <div class="flex items-center gap-2">
            <code class="flex-1 text-sm bg-background p-2 rounded border break-all font-mono">{newKeyValue}</code>
            <Button variant="outline" size="icon" onclick={() => copyToClipboard(newKeyValue!)}>
              <Icon icon="mdi:content-copy" class="size-4" />
            </Button>
          </div>
        </div>
        <Button class="w-full" onclick={() => { createDialogOpen = false; }}>
          我已保存，关闭
        </Button>
      </div>
    {:else}
      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="name">密钥名称 *</Label>
          <Input id="name" bind:value={form.name} placeholder="例如：production, test, dev-local" />
        </div>
        
        <div class="space-y-2">
          <Label for="expiresInDays">有效期（天）</Label>
          <Input id="expiresInDays" type="number" bind:value={form.expiresInDays} min={0} max={365} />
          <p class="text-xs text-muted-foreground">设为 0 表示永不过期</p>
        </div>

        <div class="space-y-2">
          <Label for="remark">备注</Label>
          <Input id="remark" bind:value={form.remark} placeholder="可选，记录用途等信息" />
        </div>
        
        <div class="flex items-center justify-between rounded-lg border p-3">
          <div class="space-y-0.5">
            <Label>访问全部 MCP 服务</Label>
            <p class="text-xs text-muted-foreground">开启后可访问所有 MCP 服务</p>
          </div>
          <Switch bind:checked={form.accessAll} />
        </div>
        
        {#if !form.accessAll}
          <div class="space-y-2">
            <Label>选择可访问的 MCP 服务 ({form.mcpServerIds.length} 已选)</Label>
            <ScrollArea class="h-48 rounded-md border p-3">
              {#if mcpServers.length === 0}
                <div class="text-center py-4 text-muted-foreground">
                  暂无 MCP 服务，请先创建
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
                        {server.actions.length} 个 Tools
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
        <Button variant="outline" onclick={() => createDialogOpen = false}>取消</Button>
        <Button onclick={handleCreate} disabled={saving}>
          {#if saving}
            <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
          {/if}
          创建
        </Button>
      </Dialog.Footer>
    {/if}
  </Dialog.Content>
</Dialog.Root>

<!-- Edit Sheet -->
<Sheet.Root bind:open={editSheetOpen}>
  <Sheet.Content side="right" class="w-full sm:max-w-md flex flex-col">
    <Sheet.Header>
      <Sheet.Title>编辑 API 密钥</Sheet.Title>
      <Sheet.Description>修改密钥名称和 MCP 访问范围</Sheet.Description>
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
                  <Badge variant="destructive">已撤销</Badge>
                {:else if isExpired(editingKey.expiresAt)}
                  <Badge variant="secondary">已过期</Badge>
                {:else}
                  <Badge variant="default">有效</Badge>
                {/if}
              </div>
            </div>
          </div>

          <div class="grid gap-3">
            <div class="space-y-1.5">
              <Label for="edit-name">密钥名称</Label>
              <Input id="edit-name" bind:value={editForm.name} />
            </div>

            <div class="space-y-1.5">
              <Label for="edit-remark">备注</Label>
              <Input id="edit-remark" bind:value={editForm.remark} placeholder="可选" />
            </div>
          </div>
        </div>
        
        <!-- MCP 访问范围 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between py-2 px-3 rounded-lg border">
            <div>
              <div class="text-sm font-medium">访问全部 MCP</div>
              <div class="text-xs text-muted-foreground">开启后可访问所有服务</div>
            </div>
            <Switch bind:checked={editForm.accessAll} />
          </div>
          
          {#if !editForm.accessAll}
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <Label class="text-sm">MCP 服务</Label>
                <span class="text-xs text-muted-foreground">{editForm.mcpServerIds.length} 已选</span>
              </div>
              <div class="rounded-lg border divide-y max-h-40 overflow-y-auto">
                {#if mcpServers.length === 0}
                  <div class="text-center py-6 text-muted-foreground text-sm">
                    暂无 MCP 服务
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
            <span class="text-muted-foreground">创建时间</span>
            <span>{formatDate(editingKey.createdAt)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">过期时间</span>
            <span>{editingKey.expiresAt ? formatDate(editingKey.expiresAt) : '永不过期'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">最后使用</span>
            <span>{formatDate(editingKey.lastUsedAt)}</span>
          </div>
        </div>
      </div>
      
      <Sheet.Footer class="border-t pt-4">
        <Button variant="outline" onclick={() => editSheetOpen = false}>取消</Button>
        <Button onclick={handleUpdate} disabled={editSaving || editingKey.isRevoked}>
          {#if editSaving}
            <Icon icon="mdi:loading" class="mr-2 size-4 animate-spin" />
          {/if}
          保存
        </Button>
      </Sheet.Footer>
    {/if}
  </Sheet.Content>
</Sheet.Root>
