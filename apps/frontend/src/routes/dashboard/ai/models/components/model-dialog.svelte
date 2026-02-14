<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Checkbox } from '$lib/components/ui/checkbox';

  interface Model {
    id: string;
    providerId: string;
    name: string;
    modelId: string;
    status: string;
    supportTools: boolean;
    maxTokens: number | null;
    remark: string | null;
  }

  interface Provider {
    id: string;
    name: string;
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

  interface Props {
    open: boolean;
    editing: Model | null;
    form: ModelForm;
    providers: Provider[];
    saving: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
  }

  let { open, editing, form = $bindable(), providers, saving, onOpenChange, onSave }: Props = $props();

  const statusOptions = [
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];
</script>

<Dialog.Root {open} onOpenChange={onOpenChange}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{editing ? '编辑模型' : '新增模型'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>提供商 *</Label>
        <Select.Root type="single" bind:value={form.providerId}>
          <Select.Trigger>{providers.find(p => p.id === form.providerId)?.name || '请选择'}</Select.Trigger>
          <Select.Content>
            {#each providers as p}
              <Select.Item value={p.id}>{p.name}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>模型名称 *</Label>
          <Input bind:value={form.name} placeholder="如：GPT-4o" />
        </div>
        <div class="grid gap-2">
          <Label>模型ID *</Label>
          <Input bind:value={form.modelId} placeholder="如：gpt-4o" />
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>最大 Token</Label>
          <Input bind:value={form.maxTokens} type="number" placeholder="如：128000" />
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
      <div class="flex items-center gap-2">
        <Checkbox bind:checked={form.supportTools} />
        <Label>支持工具调用 (Function Calling)</Label>
      </div>
      <div class="grid gap-2">
        <Label>备注</Label>
        <Textarea bind:value={form.remark} placeholder="请输入备注" rows={2} />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
      <Button onclick={onSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
