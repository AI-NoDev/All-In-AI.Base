<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Slider } from '$lib/components/ui/slider';
  import { t } from '$lib/stores/i18n.svelte';

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

  const memoryTypes = $derived([
    { value: 'STM', label: t('page.ai.memory_typeSTMFull') },
    { value: 'LTM', label: t('page.ai.memory_typeLTMFull') },
    { value: 'PREFERENCE', label: t('page.ai.memory_typePREFERENCEFull') },
    { value: 'FACT', label: t('page.ai.memory_typeFACTFull') },
    { value: 'EPISODIC', label: t('page.ai.memory_typeEPISODICFull') }
  ]);
</script>

<Dialog.Root {open} onOpenChange={onOpenChange}>
  <Dialog.Content class="max-w-lg">
    <Dialog.Header>
      <Dialog.Title>{editing ? t('page.ai.memory_editMemory') : t('page.ai.memory_addMemory')}</Dialog.Title>
      <Dialog.Description>
        {editing ? t('page.ai.memory_editDesc') : t('page.ai.memory_createDesc')}
      </Dialog.Description>
    </Dialog.Header>
    
    <div class="space-y-4 py-4">
      <div class="space-y-2">
        <Label for="userId">{t('page.ai.memory_userRequired')}</Label>
        <Select.Root type="single" name="userId" bind:value={form.userId}>
          <Select.Trigger class="w-full">
            {users.find(u => u.id === form.userId)?.nickName || t('page.ai.memory_selectUser')}
          </Select.Trigger>
          <Select.Content>
            {#each users as user}
              <Select.Item value={user.id}>{user.nickName || user.loginName}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="space-y-2">
        <Label for="agentId">{t('page.ai.memory_sourceAgent')}</Label>
        <Select.Root type="single" name="agentId" bind:value={form.agentId}>
          <Select.Trigger class="w-full">
            {agents.find(a => a.id === form.agentId)?.name || t('page.ai.memory_noAgent')}
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="">{t('page.ai.memory_noAgent')}</Select.Item>
            {#each agents as agent}
              <Select.Item value={agent.id}>{agent.name}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="space-y-2">
        <Label for="memoryType">{t('page.ai.memory_typeRequired')}</Label>
        <Select.Root type="single" name="memoryType" bind:value={form.memoryType}>
          <Select.Trigger class="w-full">
            {memoryTypes.find(t => t.value === form.memoryType)?.label || t('page.ai.memory_selectType')}
          </Select.Trigger>
          <Select.Content>
            {#each memoryTypes as type}
              <Select.Item value={type.value}>{type.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>

      <div class="space-y-2">
        <Label for="content">{t('page.ai.memory_contentRequired')}</Label>
        <Textarea
          id="content"
          bind:value={form.content}
          placeholder={t('page.ai.memory_contentPlaceholder')}
          rows={4}
        />
      </div>

      <div class="space-y-2">
        <Label>{t('page.ai.memory_importanceLabel').replace('${value}', String(form.importance))}</Label>
        <Slider
          type="single"
          value={form.importance}
          onValueChange={(v) => form.importance = v}
          min={1}
          max={10}
          step={1}
        />
        <p class="text-xs text-muted-foreground">{t('page.ai.memory_importanceHint')}</p>
      </div>

      <div class="space-y-2">
        <Label for="expiresAt">{t('page.ai.memory_expiresAt')}</Label>
        <Input
          id="expiresAt"
          type="datetime-local"
          bind:value={form.expiresAt}
        />
        <p class="text-xs text-muted-foreground">{t('page.ai.memory_expiresAtHint')}</p>
      </div>

      <div class="space-y-2">
        <Label for="metadata">{t('page.ai.memory_metadata')}</Label>
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
      <Button variant="outline" onclick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
      <Button onclick={onSave} disabled={saving}>
        {saving ? t('common.saving') : t('common.save')}
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
