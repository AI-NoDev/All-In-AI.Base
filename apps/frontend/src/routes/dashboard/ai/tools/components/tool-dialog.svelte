<script lang="ts">
  import { Settings2, GitBranch } from '@lucide/svelte';
  import * as Dialog from '@/lib/components/ui/dialog';
  import * as Select from '@/lib/components/ui/select';
  import { Button } from '@/lib/components/ui/button';
  import { Input } from '@/lib/components/ui/input';
  import { Label } from '@/lib/components/ui/label';
  import { Textarea } from '@/lib/components/ui/textarea';
  import { Checkbox } from '@/lib/components/ui/checkbox';
  import { Badge } from '@/lib/components/ui/badge';
  import SchemaEditorSheet from './schema-editor-sheet.svelte';
  import FlowEditorSheet from './flow-editor-sheet.svelte';

  interface Tool {
    id: string;
    groupId: string | null;
    name: string;
    description: string | null;
    isAsync: boolean;
    status: string;
    inputSchema: Record<string, unknown> | null;
    implementation: string | null;
  }

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

  interface Props {
    open: boolean;
    editing: Tool | null;
    form: ToolForm;
    groups: ToolGroup[];
    saving: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
  }

  let { open, editing, form = $bindable(), groups, saving, onOpenChange, onSave }: Props = $props();

  let schemaEditorOpen = $state(false);
  let flowEditorOpen = $state(false);

  const statusOptions = [
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];

  function handleSchemaConfirm(jsonSchema: string) {
    form.inputSchema = jsonSchema;
  }

  function handleFlowConfirm(workflow: string) {
    form.implementation = workflow;
  }

  // 计算 schema 中的字段数量
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

  // 计算流程中的节点数量
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
</script>

<Dialog.Root {open} onOpenChange={onOpenChange}>
  <Dialog.Content class="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>{editing ? '编辑工具' : '新增工具'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
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
      <div class="grid gap-2">
        <Label>输入参数 Schema</Label>
        <Button 
          variant="outline" 
          class="justify-start h-auto py-3 px-4"
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
      </div>
      <div class="grid gap-2">
        <Label>执行流程</Label>
        <Button 
          variant="outline" 
          class="justify-start h-auto py-3 px-4"
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
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
      <Button onclick={onSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<SchemaEditorSheet
  open={schemaEditorOpen}
  initialSchema={form.inputSchema}
  onOpenChange={(v) => schemaEditorOpen = v}
  onConfirm={handleSchemaConfirm}
/>
