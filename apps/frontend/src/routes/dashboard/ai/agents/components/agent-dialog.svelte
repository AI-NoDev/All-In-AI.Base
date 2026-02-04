<script lang="ts">
  import * as Dialog from '@/lib/components/ui/dialog';
  import * as Select from '@/lib/components/ui/select';
  import { Button } from '@/lib/components/ui/button';
  import { Input } from '@/lib/components/ui/input';
  import { Label } from '@/lib/components/ui/label';
  import { Textarea } from '@/lib/components/ui/textarea';
  import { Checkbox } from '@/lib/components/ui/checkbox';

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

  interface Props {
    open: boolean;
    editing: Agent | null;
    form: AgentForm;
    providers: Provider[];
    models: Model[];
    saving: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
  }

  let { open, editing, form = $bindable(), providers, models, saving, onOpenChange, onSave }: Props = $props();

  const statusOptions = [
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];

  let filteredModels = $derived(
    form.providerId ? models.filter(m => m.providerId === form.providerId) : models
  );
</script>

<Dialog.Root {open} onOpenChange={onOpenChange}>
  <Dialog.Content class="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>{editing ? '编辑智能体' : '新增智能体'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>名称 *</Label>
          <Input bind:value={form.name} placeholder="智能体名称" />
        </div>
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
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>提供商 *</Label>
          <Select.Root type="single" bind:value={form.providerId} onValueChange={() => form.modelId = ''}>
            <Select.Trigger>{providers.find(p => p.id === form.providerId)?.name || '请选择'}</Select.Trigger>
            <Select.Content>
              {#each providers as p}
                <Select.Item value={p.id}>{p.name}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        <div class="grid gap-2">
          <Label>模型 *</Label>
          <Select.Root type="single" bind:value={form.modelId}>
            <Select.Trigger>{filteredModels.find(m => m.id === form.modelId)?.name || '请选择'}</Select.Trigger>
            <Select.Content>
              {#each filteredModels as m}
                <Select.Item value={m.id}>{m.name}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      <div class="grid gap-2">
        <Label>描述</Label>
        <Textarea bind:value={form.description} placeholder="智能体描述" rows={2} />
      </div>

      <div class="grid gap-2">
        <Label>系统提示词</Label>
        <Textarea bind:value={form.systemPrompt} placeholder="定义智能体的角色和行为..." rows={4} />
      </div>

      <div class="grid grid-cols-3 gap-4">
        <div class="grid gap-2">
          <Label>温度 (0-2)</Label>
          <Input bind:value={form.temperature} type="number" step="0.1" min="0" max="2" />
        </div>
        <div class="grid gap-2">
          <Label>头像 URL</Label>
          <Input bind:value={form.avatar} placeholder="https://..." />
        </div>
        <div class="grid gap-2">
          <Label>主题色</Label>
          <Input bind:value={form.color} type="color" class="h-10" />
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <Checkbox bind:checked={form.supportLoop} />
          <Label>支持循环调用</Label>
        </div>
        {#if form.supportLoop}
          <div class="flex items-center gap-2">
            <Label>最大循环次数</Label>
            <Input bind:value={form.maxLoops} type="number" class="w-20" min="1" max="100" />
          </div>
        {/if}
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
      <Button onclick={onSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
