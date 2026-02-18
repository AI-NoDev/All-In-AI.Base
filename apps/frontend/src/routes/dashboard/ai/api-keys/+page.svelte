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
  }

  interface ApiKeyForm {
    name: string;
    accessAll: boolean;
    mcpServerIds: string[];
    expiresInDays: number;
  }

  let apiKeys = $state<ApiKey[]>([]);
  let mcpServers = $state<McpServer[]>([]);
  let loading = $state(true);
  
  // Dialog state
  let dialogOpen = $state(false);
  let saving = $state(false);
  let form = $state<ApiKeyForm>({ name: '', accessAll: true, mcpServerIds: [], expiresInDays: 30 });
  let newKeyValue = $state<string | null>(null);

  // 获取 MCP 服务名称
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
    form = { name: '', accessAll: true, mcpServerIds: [], expiresInDays: 30 };
    newKeyValue = null;
    dialogOpen = true;
  }

  function toggleMcp(mcpId: string) {
    if (form.mcpServerIds.includes(mcpId)) {
      form.mcpServerIds = form.mcpServerIds.filter(id => id !== mcpId);
    } else {
      form.mcpServerIds = [...form.mcpServerIds, mcpId];
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

<div class="flex flex-1 flex-col gap-4 px-4 lg:px-6 pb-4">
  <div class="flex items-center justify-between">
    <div>
      <h2 class="text-lg font-semibold">API 密钥管理</h2>
      <p class="text-sm text-muted-foreground">管理用于访问 MCP 服务的 API 密钥</p>
    </div>
    <Button onclick={openCreateDialog}>
      <Icon icon="mdi:plus" class="mr-2 size-4" />
      创建 API 密钥
    </Button>
  </div>

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
            <Table.Head>关联 MCP 服务</Table.Head>
            <Table.Head>状态</Table.Head>
            <Table.Head>过期时间</Table.Head>
            <Table.Head>最后使用</Table.Head>
            <Table.Head class="text-right">操作</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each apiKeys as key}
            <Table.Row>
              <Table.Cell class="font-medium">{key.name}</Table.Cell>
              <Table.Cell>
                <code class="text-xs bg-muted px-1.5 py-0.5 rounded">{key.tokenPrefix}</code>
              </Table.Cell>
              <Table.Cell>
                {#if key.accessAll}
                  <Badge variant="default">全部 MCP</Badge>
                {:else}
                  <div class="flex flex-wrap gap-1">
                    {#each getMcpNames(key.mcpServerIds).slice(0, 3) as name}
                      <Badge variant="secondary" class="text-xs">{name}</Badge>
                    {/each}
                    {#if key.mcpServerIds.length > 3}
                      <Badge variant="outline" class="text-xs">+{key.mcpServerIds.length - 3}</Badge>
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
              <Table.Cell class="text-right">
                <div class="flex justify-end gap-1">
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

<!-- Create Dialog -->
<Dialog.Root bind:open={dialogOpen}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>创建 API 密钥</Dialog.Title>
      <Dialog.Description>创建一个新的 API 密钥来访问 MCP 服务</Dialog.Description>
    </Dialog.Header>
    
    {#if newKeyValue}
      <div class="space-y-4">
        <div class="p-4 bg-muted rounded-lg">
          <p class="text-sm text-muted-foreground mb-2">请保存此密钥，它只会显示一次：</p>
          <div class="flex items-center gap-2">
            <code class="flex-1 text-sm bg-background p-2 rounded border break-all">{newKeyValue}</code>
            <Button variant="outline" size="icon" onclick={() => copyToClipboard(newKeyValue!)}>
              <Icon icon="mdi:content-copy" class="size-4" />
            </Button>
          </div>
        </div>
        <Button class="w-full" onclick={() => { dialogOpen = false; }}>
          完成
        </Button>
      </div>
    {:else}
      <div class="space-y-4">
        <div class="space-y-2">
          <Label for="name">密钥名称</Label>
          <Input id="name" bind:value={form.name} placeholder="例如：production, test" />
        </div>
        
        <div class="space-y-2">
          <Label for="expiresInDays">有效期（天，0 表示永不过期）</Label>
          <Input id="expiresInDays" type="number" bind:value={form.expiresInDays} min={0} max={365} />
        </div>
        
        <div class="flex items-center justify-between rounded-lg border p-3">
          <div class="space-y-0.5">
            <Label>访问全部 MCP</Label>
            <p class="text-xs text-muted-foreground">开启后可访问所有 MCP 服务</p>
          </div>
          <Switch bind:checked={form.accessAll} />
        </div>
        
        {#if !form.accessAll}
          <div class="space-y-2">
            <Label>选择 MCP 服务 ({form.mcpServerIds.length} 已选)</Label>
            <ScrollArea class="h-48 rounded-md border p-3">
              {#if mcpServers.length === 0}
                <div class="text-center py-4 text-muted-foreground">
                  暂无 MCP 服务，请先创建
                </div>
              {:else}
                {#each mcpServers as server}
                  <label class="flex items-start gap-2 p-2 rounded hover:bg-muted cursor-pointer">
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
                        {server.actions.length} 个 Actions
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
        <Button variant="outline" onclick={() => dialogOpen = false}>取消</Button>
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
