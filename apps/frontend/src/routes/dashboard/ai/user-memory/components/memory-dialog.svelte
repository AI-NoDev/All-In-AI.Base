<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Slider } from '$lib/components/ui/slider';

  interface UserMemory {
    id: string;
    userId: string;
    agentId: string | null;
    memoryType: string;
    content: string;
    importance: number;
    accessCount: number;
    lastAccessedAt: string | null;
    expiresAt: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
  }

  interface User {
    id: string;
    nickName: string;
    loginName: string;
  }

  interface Agent {
    id: string;
    name: string;
  }

  interface MemoryForm {
    userId: string;
    agentId: string;
    memoryType: string;
    content: string;
    importance: number;
    expiresAt: string;
    metadata: string;
  }

  interface Props {
    open: boolean;
    editing: UserMemory | null;
    form: MemoryForm;
    users: User[];
    agents: Agent[];
    saving: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
  }

  let { open, editing, form = $bindable(), users, agents, saving, onOpenChange, onSave }: Props = $props();

  const memoryTypes = [
    { value: 'STM', label: '短期记忆 (STM)' },
    { value: 'LTM', label: '长期记忆 (LTM)' },
    { value: 'PREFERENCE', label: '偏好 (PREFERENCE)' },
    { value: 'FACT', label: '事实 (FACT)' },
    { value: 'EPISODIC', label: '情景记忆 (EPISODIC)' }
  ];
</script>

<Dialog.Root {open} onOpenChange={onOpenChange}>
  <Dialog.Content class="max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{editing ? '编辑记忆' : '新增记忆'}</Dialog.Title>
      <Dialog.Description>
        {editing ? '修改用户记忆信息' : '创建新的用户记忆'}
      </Dialog.Description>
    </Dialog.Header>
    
    <div class="space-y-4 py-4">
      <div class="space-y-2">
        <Label for="userId">用户 *</Label>
        <Select.Root type="single" name="userId" bind:value={form.userId}>
          <Select.Trigger class="w-full">
            {users.find(u => u.id === form.userId)?.nickName || '请选择用户'}
          </Select.Trigger>
          <Select.Content>
            {#each users as user}
              <Select.Item value={user.id}>{user.nickName || user.loginName}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="space-y-2">
        <Label for="agentId">来源智能体</Label>
        <Select.Root type="single" name="agentId" bind:value={form.agentId}>
          <Select.Trigger class="w-full">
            {agents.find(a => a.id === form.agentId)?.name || '无（外部来源）'}
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="">无（外部来源）</Select.Item>
            {#each agents as agent}
              <Select.Item value={agent.id}>{agent.name}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="space-y-2">
        <Label for="memoryType">记忆类型 *</Label>
        <Select.Root type="single" name="memoryType" bind:value={form.memoryType}>
          <Select.Trigger class="w-full">
            {memoryTypes.find(t => t.value === form.memoryType)?.label || '请选择类型'}
          </Select.Trigger>
          <Select.Content>
            {#each memoryTypes as type}
              <Select.Item value={type.value}>{type.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="space-y-2">
        <Label for="content">内容 *</Label>
        <Textarea
          id="content"
          bind:value={form.content}
          placeholder="记忆内容..."
          rows={4}
        />
      </div>

      <div class="space-y-2">
        <Label>重要度: {form.importance}</Label>
        <Slider
          type="single"
          value={form.importance}
          onValueChange={(v) => form.importance = v}
          min={1}
          max={10}
          step={1}
        />
        <p class="text-xs text-muted-foreground">1-10，数值越高越重要</p>
      </div>

      <div class="space-y-2">
        <Label for="expiresAt">过期时间</Label>
        <Input
          id="expiresAt"
          type="datetime-local"
          bind:value={form.expiresAt}
        />
        <p class="text-xs text-muted-foreground">留空表示永不过期</p>
      </div>

      <div class="space-y-2">
        <Label for="metadata">元数据 (JSON)</Label>
        <Textarea
          id="metadata"
          bind:value={form.metadata}
          placeholder={'{}'}
          rows={3}
          class="font-mono text-sm"
        />
      </div>
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
      <Button onclick={onSave} disabled={saving}>
        {saving ? '保存中...' : '保存'}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
