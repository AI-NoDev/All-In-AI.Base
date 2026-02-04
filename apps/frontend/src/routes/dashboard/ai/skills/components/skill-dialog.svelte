<script lang="ts">
  import * as Dialog from '@/lib/components/ui/dialog';
  import * as Select from '@/lib/components/ui/select';
  import { Button } from '@/lib/components/ui/button';
  import { Input } from '@/lib/components/ui/input';
  import { Label } from '@/lib/components/ui/label';
  import { Textarea } from '@/lib/components/ui/textarea';
  import { Checkbox } from '@/lib/components/ui/checkbox';

  interface Skill {
    id: string;
    name: string;
    parentId: string | null;
    isGroup: boolean;
    icon: string | null;
    orderNum: number;
    status: string;
    description: string | null;
    isA2a: boolean;
  }

  interface SkillForm {
    name: string;
    parentId: string;
    isGroup: boolean;
    icon: string;
    orderNum: number;
    status: string;
    description: string;
    isA2a: boolean;
  }

  interface Props {
    open: boolean;
    editing: Skill | null;
    form: SkillForm;
    groups: Skill[];
    saving: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
  }

  let { open, editing, form = $bindable(), groups, saving, onOpenChange, onSave }: Props = $props();

  const statusOptions = [
    { value: '0', label: '正常' },
    { value: '1', label: '停用' },
  ];
</script>

<Dialog.Root {open} onOpenChange={onOpenChange}>
  <Dialog.Content class="sm:max-w-lg">
    <Dialog.Header>
      <Dialog.Title>
        {#if editing}
          编辑{editing.isGroup ? '分组' : '技能'}
        {:else}
          新增{form.isGroup ? '分组' : '技能'}
        {/if}
      </Dialog.Title>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid gap-2">
        <Label>名称 *</Label>
        <Input bind:value={form.name} placeholder={form.isGroup ? '分组名称' : '技能名称'} />
      </div>

      <div class="grid gap-2">
        <Label>父级分组</Label>
        <Select.Root type="single" bind:value={form.parentId}>
          <Select.Trigger>{groups.find(g => g.id === form.parentId)?.name || '无'}</Select.Trigger>
          <Select.Content>
            <Select.Item value="">无</Select.Item>
            {#each groups as g}
              <Select.Item value={g.id}>{g.name}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label>图标</Label>
          <Input bind:value={form.icon} placeholder="如 mdi:star" />
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
        <Textarea bind:value={form.description} placeholder="请输入描述" rows={3} />
      </div>

      {#if !form.isGroup}
        <div class="flex items-center gap-2">
          <Checkbox bind:checked={form.isA2a} />
          <Label>使用 A2A 协议（减少会话上下文）</Label>
        </div>
      {/if}
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
      <Button onclick={onSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
