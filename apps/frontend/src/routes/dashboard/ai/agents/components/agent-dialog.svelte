<script lang="ts">
  import Icon from '@iconify/svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Select from '$lib/components/ui/select';
  import * as Sheet from '$lib/components/ui/sheet';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import MarkdownEditor from '$lib/components/common/markdown-editor.svelte';
  import MarkdownPreview from '$lib/components/common/markdown-preview.svelte';
  import AIGeneratorModal from '$lib/components/ai-generator/ai-generator-modal.svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { t } from '$lib/stores/i18n.svelte';

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
    { value: '0', label: t('common.status.enabled') },
    { value: '1', label: t('common.status.disabled') },
  ];

  let filteredModels = $derived(
    form.providerId ? models.filter(m => m.providerId === form.providerId) : models
  );

  let avatarUploading = $state(false);
  let fileInput: HTMLInputElement;
  
  // 编辑抽屉状态
  let editorSheetOpen = $state(false);
  let editor: MarkdownEditor;
  let editorReady = $state(false);
  
  // AI 生成器状态
  let aiGeneratorOpen = $state(false);

  function handleEditorReady() {
    editorReady = true;
    if (form.systemPrompt && editor) {
      editor.setValue(form.systemPrompt);
    }
  }

  function handleEditorInput(val: string) {
    form.systemPrompt = val;
  }

  function openEditorSheet() {
    editorSheetOpen = true;
  }

  function closeEditorSheet() {
    editorSheetOpen = false;
    editorReady = false;
  }

  function openAIGenerator() {
    aiGeneratorOpen = true;
  }

  function handleAIGeneratorApply(result: string) {
    form.systemPrompt = result;
  }

  async function handleAvatarUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert(t('validation.imageFormat'));
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(t('validation.imageSizeLimit'));
      return;
    }

    avatarUploading = true;
    try {
      const base64 = await fileToBase64(file);
      const api = authStore.createApi(true);
      const res = await api.public.postApiPublicUploadAvatar({
        category: 'agent-avatar',
        filename: file.name,
        content: base64,
        mimeType: file.type,
      });

      if (res.data?.success && res.data.url) {
        form.avatar = res.data.url;
      } else {
        alert(t('common.tips.uploadFailed'));
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
      alert(t('common.tips.uploadFailed'));
    } finally {
      avatarUploading = false;
      target.value = '';
    }
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function triggerFileInput() {
    fileInput?.click();
  }

  function clearAvatar() {
    form.avatar = '';
  }
</script>

<Dialog.Root {open} onOpenChange={onOpenChange}>
  <Dialog.Content class="sm:max-w-6xl" interactOutsideBehavior="ignore">
    <Dialog.Header>
      <Dialog.Title>{editing ? t('common.actions.edit') : t('common.actions.add')} {t('page.ai.agents')}</Dialog.Title>
    </Dialog.Header>
    <div class="h-[calc(90vh-180px)]">
      <ScrollArea class="h-full">
        <div class="grid grid-cols-2 gap-6 py-4 pr-4">
      <!-- 左侧：基础信息 -->
      <div class="grid gap-4">
        <!-- 头像上传区域 -->
        <div class="flex items-center gap-4">
          <div class="relative group cursor-pointer" onclick={triggerFileInput}>
            <div class="size-16 rounded-full border-2 flex items-center justify-center bg-muted overflow-hidden" style={form.color ? `border-color: ${form.color}` : ''}>
              {#if form.avatar}
                <img src={form.avatar} alt={t('common.fields.avatar')} class="size-full object-cover" />
              {:else}
                <span class="text-xl text-muted-foreground">
                  {form.name ? form.name.charAt(0).toUpperCase() : 'A'}
                </span>
              {/if}
            </div>
            <div
              class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full transition-opacity {avatarUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}"
            >
              {#if avatarUploading}
                <Icon icon="mdi:loading" class="size-5 text-white animate-spin" />
              {:else}
                <Icon icon="mdi:camera" class="size-5 text-white" />
              {/if}
            </div>
            <input
              bind:this={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              class="hidden"
              onchange={handleAvatarUpload}
            />
          </div>
          <div class="flex-1 space-y-1">
            <p class="text-sm text-muted-foreground">{t('common.tips.clickToUploadAvatar')}</p>
            {#if form.avatar}
              <Button variant="ghost" size="sm" onclick={clearAvatar} class="h-6 px-2 text-xs">
                <Icon icon="mdi:close" class="size-3 mr-1" />{t('common.actions.clear')}
              </Button>
            {/if}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="grid gap-1.5">
            <Label class="text-xs">{t('common.fields.name')} *</Label>
            <Input bind:value={form.name} placeholder={t('page.ai.agentNamePlaceholder')} class="h-9" />
          </div>
          <div class="grid gap-1.5">
            <Label class="text-xs">{t('common.fields.status')}</Label>
            <Select.Root type="single" bind:value={form.status}>
              <Select.Trigger class="h-9">{statusOptions.find(o => o.value === form.status)?.label}</Select.Trigger>
              <Select.Content>
                {#each statusOptions as opt}
                  <Select.Item value={opt.value}>{opt.label}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="grid gap-1.5">
            <Label class="text-xs">{t('db.ai.model.providerId')} *</Label>
            <Select.Root type="single" bind:value={form.providerId} onValueChange={() => form.modelId = ''}>
              <Select.Trigger class="h-9">{providers.find(p => p.id === form.providerId)?.name || t('common.tips.selectPlaceholder')}</Select.Trigger>
              <Select.Content>
                {#each providers as p}
                  <Select.Item value={p.id}>{p.name}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
          <div class="grid gap-1.5">
            <Label class="text-xs">{t('db.ai.agent.modelId')} *</Label>
            <Select.Root type="single" bind:value={form.modelId}>
              <Select.Trigger class="h-9">{filteredModels.find(m => m.id === form.modelId)?.name || t('common.tips.selectPlaceholder')}</Select.Trigger>
              <Select.Content>
                {#each filteredModels as m}
                  <Select.Item value={m.id}>{m.name}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <p class="text-xs text-muted-foreground -mt-2">{t('page.ai.defaultModelHint')}</p>

        <div class="grid gap-1.5">
          <Label class="text-xs">{t('common.fields.description')}</Label>
          <Textarea bind:value={form.description} placeholder={t('page.ai.agentDescPlaceholder')} rows={2} />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="grid gap-1.5">
            <Label class="text-xs">{t('db.ai.agent.temperature')} (0-2)</Label>
            <Input bind:value={form.temperature} type="number" step="0.1" min="0" max="2" class="h-9" />
          </div>
          <div class="grid gap-1.5">
            <Label class="text-xs">{t('db.ai.agent.color')}</Label>
            <Input bind:value={form.color} type="color" class="h-9" />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <Checkbox bind:checked={form.supportLoop} />
            <Label class="text-xs">{t('db.ai.agent.supportLoop')}</Label>
          </div>
          {#if form.supportLoop}
            <div class="flex items-center gap-2">
              <Label class="text-xs">{t('db.ai.agent.maxLoops')}</Label>
              <Input bind:value={form.maxLoops} type="number" class="w-16 h-8" min="1" max="100" />
            </div>
          {/if}
        </div>
      </div>

      <!-- 右侧：系统提示词预览 -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <Label class="text-xs">{t('page.ai.systemPrompt')}</Label>
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="sm" onclick={openAIGenerator} class="h-6 px-2 text-xs">
              <Icon icon="mdi:sparkles" class="size-3 mr-1" />AI
            </Button>
            <Button variant="ghost" size="sm" onclick={openEditorSheet} class="h-6 px-2 text-xs">
              <Icon icon="mdi:pencil" class="size-3 mr-1" />{t('common.actions.edit')}
            </Button>
          </div>
        </div>
        <div class="border rounded-[var(--radius)] h-[380px] bg-muted/30">
          <ScrollArea class="h-full p-4">
            {#if form.systemPrompt}
              <MarkdownPreview value={form.systemPrompt} />
            {:else}
              <div class="flex items-center justify-center h-[350px] text-muted-foreground text-sm">
                {t('page.ai.noSystemPrompt')}
              </div>
            {/if}
          </ScrollArea>
        </div>
      </div>
      </div>
      </ScrollArea>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>{t('common.actions.cancel')}</Button>
      <Button onclick={onSave} disabled={saving}>{saving ? t('common.tips.saving') : t('common.actions.save')}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- 编辑抽屉 -->
<Sheet.Root bind:open={editorSheetOpen} onOpenChange={(v) => { if (!v) closeEditorSheet(); }}>
  <Sheet.Content side="right" class="w-full sm:max-w-2xl flex flex-col">
    <Sheet.Header>
      <Sheet.Title class="flex items-center gap-2">
        <Icon icon="mdi:file-document-edit" class="size-5" />
        {t('page.ai.editSystemPrompt')}
      </Sheet.Title>
      <Sheet.Description>
        {t('page.ai.systemPromptDesc')}
      </Sheet.Description>
    </Sheet.Header>

    <div class="flex-1 flex flex-col min-h-0 py-4">
      {#if editorSheetOpen}
        <MarkdownEditor
          bind:this={editor}
          value={form.systemPrompt}
          placeholder={t('page.ai.systemPromptPlaceholder')}
          height={500}
          onInput={handleEditorInput}
          onReady={handleEditorReady}
        />
      {/if}
    </div>

    <Sheet.Footer>
      <Button onclick={closeEditorSheet}>{t('common.actions.done')}</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>

<!-- AI 生成器 -->
<AIGeneratorModal
  bind:open={aiGeneratorOpen}
  type="text"
  title="AI 生成系统提示词"
  description="描述您的 Agent 用途，AI 将帮您生成专业的系统提示词"
  prompt={`请根据以下信息生成一个专业的 AI Agent 系统提示词：

Agent 名称：${form.name || '未命名'}
Agent 描述：${form.description || '无描述'}

要求：
1. 明确定义 Agent 的角色和职责
2. 设定清晰的行为准则和限制
3. 包含输出格式要求（如适用）
4. 使用专业、清晰的语言
5. 适当使用 Markdown 格式增强可读性`}
  onOpenChange={(v) => aiGeneratorOpen = v}
  onApply={handleAIGeneratorApply}
/>
