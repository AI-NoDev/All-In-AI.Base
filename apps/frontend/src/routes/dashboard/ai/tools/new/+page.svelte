<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Settings2, GitBranch, ArrowLeft } from '@lucide/svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import * as Select from '@/lib/components/ui/select';
  import { Button } from '@/lib/components/ui/button';
  import { Input } from '@/lib/components/ui/input';
  import { Label } from '@/lib/components/ui/label';
  import { Textarea } from '@/lib/components/ui/textarea';
  import { Checkbox } from '@/lib/components/ui/checkbox';
  import { Badge } from '@/lib/components/ui/badge';
  import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/card';
  import SchemaEditorSheet from '../components/schema-editor-sheet.svelte';
  import FlowEditorSheet from '../components/flow-editor-sheet.svelte';

  interface ToolGroup {
    id: string;
    name: string;
  }

  interface ToolForm {
    groupId: string;
    name: string;
    description: string;
    isAsync: boolean;
    status: string;
    inputSchema: string;
    implementation: string;
  }

  let groups = $state<ToolGroup[]>([]);
  let form = $state<ToolForm>({
    groupId: '',
    name: '',
    description: '',
    isAsync: false,
    status: '0',
    inputSchema: '',
    implementation: '',
  });
  let saving = $state(false);
  let schemaEditorOpen = $state(false);
  let flowEditorOpen = $state(false);

  const statusOptions = [
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];

  async function loadGroups() {
    try {
      const api = authStore.createApi(true);
      const res = await api.ai.postApiAiToolGroupQuery({ limit: 100, offset: 0 });
      if (res.data?.data) groups = res.data.data;
    } catch (err) {
      console.error('Failed to load tool groups:', err);
    }
  }

  function handleSchemaConfirm(jsonSchema: string) {
    form.inputSchema = jsonSchema;
  }

  function handleFlowConfirm(workflow: string) {
    form.implementation = workflow;
  }

  function getSchemaFieldCount(): number {
    if (!form.inputSchema) return 0;
    try {
      const parsed = JSON.parse(form.inputSchema);
      if (parsed.properties) {
        return Object.keys(parsed.properties).length;
      }
    } catch {
      // ignore
    }
    return 0;
  }

  function getFlowNodeCount(): number {
    if (!form.implementation) return 0;
    try {
      const parsed = JSON.parse(form.implementation);
      if (parsed.nodes && Array.isArray(parsed.nodes)) {
        return parsed.nodes.length;
      }
    } catch {
      // ignore
    }
    return 0;
  }

  let schemaFieldCount = $derived(getSchemaFieldCount());
  let flowNodeCount = $derived(getFlowNodeCount());

  async function handleSave() {
    if (!form.name.trim()) {
      alert('请填写工具名称');
      return;
    }
    saving = true;
    try {
      const api = authStore.createApi(true);
      let inputSchema: Record<string, unknown> | null = null;
      if (form.inputSchema.trim()) {
        try {
          inputSchema = JSON.parse(form.inputSchema);
        } catch {
          alert('输入参数 Schema 格式错误');
          saving = false;
          return;
        }
      }
      const data = {
        groupId: form.groupId || null,
        name: form.name,
        description: form.description || null,
        isAsync: form.isAsync,
        status: form.status,
        inputSchema,
        implementation: form.implementation || null,
      };
      // @ts-expect-error audit fields (createdBy, updatedBy) are auto-injected by authStore
      await api.ai.postApiAiTool({ data });
      goto('/dashboard/ai/tools');
    } catch (err) {
      console.error('Failed to save tool:', err);
      alert('保存失败');
    } finally {
      saving = false;
    }
  }

  onMount(() => {
    loadGroups();
  });
</script>

<div class="flex flex-col gap-4 px-4 lg:px-6 pb-4">
  <div class="flex items-center gap-4">
    <Button variant="ghost" size="icon" onclick={() => goto('/dashboard/ai/tools')}>
      <ArrowLeft class="size-4" />
    </Button>
    <h1 class="text-xl font-semibold">新建工具</h1>
  </div>

  <Card>
    <CardHeader>
      <CardTitle>基本信息</CardTitle>
    </CardHeader>
    <CardContent class="grid gap-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>工具名称 *</Label>
          <Input bind:value={form.name} placeholder="如 read_file" />
        </div>
        <div class="grid gap-2">
          <Label>所属分组</Label>
          <Select.Root type="single" bind:value={form.groupId}>
            <Select.Trigger>{groups.find(g => g.id === form.groupId)?.name || '未分组'}</Select.Trigger>
            <Select.Content>
              <Select.Item value="">未分组</Select.Item>
              {#each groups as g}
                <Select.Item value={g.id}>{g.name}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
      </div>
      <div class="grid gap-2">
        <Label>描述</Label>
        <Textarea bind:value={form.description} placeholder="工具功能描述" rows={2} />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>状态</Label>
          <Select.Root type="single" bind:value={form.status}>
            <Select.Trigger>{statusOptions.find(o => o.value === form.status)?.label}</Select.Trigger>
            <Select.Content>
              {#each statusOptions as opt}
                <Select.Item value={opt.value}>{opt.label}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        <div class="flex items-end gap-2 pb-2">
          <Checkbox bind:checked={form.isAsync} />
          <Label>异步执行</Label>
        </div>
      </div>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>输入参数</CardTitle>
    </CardHeader>
    <CardContent>
      <Button 
        variant="outline" 
        class="w-full justify-start h-auto py-3 px-4"
        onclick={() => schemaEditorOpen = true}
      >
        <Settings2 class="size-4 mr-2 shrink-0" />
        <span class="flex-1 text-left">
          {#if schemaFieldCount > 0}
            已定义 {schemaFieldCount} 个参数
          {:else}
            点击编辑输入参数
          {/if}
        </span>
        {#if schemaFieldCount > 0}
          <Badge variant="secondary" class="ml-2">{schemaFieldCount}</Badge>
        {/if}
      </Button>
    </CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>执行流程</CardTitle>
    </CardHeader>
    <CardContent>
      <Button 
        variant="outline" 
        class="w-full justify-start h-auto py-3 px-4"
        onclick={() => flowEditorOpen = true}
      >
        <GitBranch class="size-4 mr-2 shrink-0" />
        <span class="flex-1 text-left">
          {#if flowNodeCount > 0}
            已定义 {flowNodeCount} 个节点
          {:else}
            点击编辑执行流程
          {/if}
        </span>
        {#if flowNodeCount > 0}
          <Badge variant="secondary" class="ml-2">{flowNodeCount}</Badge>
        {/if}
      </Button>
    </CardContent>
  </Card>

  <div class="flex justify-end gap-2">
    <Button variant="outline" onclick={() => goto('/dashboard/ai/tools')}>取消</Button>
    <Button onclick={handleSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
  </div>
</div>

<SchemaEditorSheet
  open={schemaEditorOpen}
  initialSchema={form.inputSchema}
  onOpenChange={(v) => schemaEditorOpen = v}
  onConfirm={handleSchemaConfirm}
/>

<FlowEditorSheet
  open={flowEditorOpen}
  initialWorkflow={form.implementation}
  onOpenChange={(v) => flowEditorOpen = v}
  onConfirm={handleFlowConfirm}
/>
