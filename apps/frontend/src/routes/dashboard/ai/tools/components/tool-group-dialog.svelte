<script lang="ts">
  import * as Dialog from '@/lib/components/ui/dialog';
  import * as Select from '@/lib/components/ui/select';
  import { Button } from '@/lib/components/ui/button';
  import { Input } from '@/lib/components/ui/input';
  import { Label } from '@/lib/components/ui/label';
  import { Textarea } from '@/lib/components/ui/textarea';
  import { IconPicker } from '@/lib/components/common';

  interface ToolGroup {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    orderNum: number;
    status: string;
  }

  interface ToolGroupForm {
    name: string;
    description: string;
    icon: string;
    orderNum: number;
    status: string;
  }

  interface Props {
    open: boolean;
    editing: ToolGroup | null;
    form: ToolGroupForm;
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
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{editing ? '编辑分组' : '新增分组'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>分组名称 *</Label>
        <Input bind:value={form.name} placeholder="如 文件操作" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>图标</Label>
          <IconPicker bind:value={form.icon} placeholder="选择图标" />
        </div>
        <div class="grid gap-2">
          <Label>排序</Label>
          <Input bind:value={form.orderNum} type="number" />
        </div>
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
        <Label>描述</Label>
        <Textarea bind:value={form.description} placeholder="请输入描述" rows={2} />
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
      <Button onclick={onSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
