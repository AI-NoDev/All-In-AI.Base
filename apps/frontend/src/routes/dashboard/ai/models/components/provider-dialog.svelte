<script lang="ts">
  import * as Dialog from '@qiyu-allinai/ui/components/dialog';
  import * as Select from '@qiyu-allinai/ui/components/select';
  import { Button } from '@qiyu-allinai/ui/components/button';
  import { Input } from '@qiyu-allinai/ui/components/input';
  import { Label } from '@qiyu-allinai/ui/components/label';
  import { Textarea } from '@qiyu-allinai/ui/components/textarea';

  interface Provider {
    id: string;
    name: string;
    baseUrl: string;
    token: string;
    status: string;
    remark: string | null;
  }

  interface ProviderForm {
    name: string;
    baseUrl: string;
    token: string;
    status: string;
    remark: string;
  }

  interface Props {
    open: boolean;
    editing: Provider | null;
    form: ProviderForm;
    saving: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
  }

  let { open, editing, form = $bindable(), saving, onOpenChange, onSave }: Props = $props();

  const statusOptions = [
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];
</script>

<Dialog.Root {open} onOpenChange={onOpenChange}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{editing ? '编辑提供商' : '新增提供商'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>名称 *</Label>
        <Input bind:value={form.name} placeholder="如：OpenAI、Claude" />
      </div>
      <div class="grid gap-2">
        <Label>API 地址 *</Label>
        <Input bind:value={form.baseUrl} placeholder="如：https://api.openai.com/v1" />
      </div>
      <div class="grid gap-2">
        <Label>API Token *</Label>
        <Input bind:value={form.token} type="password" placeholder="请输入 API Token" />
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
