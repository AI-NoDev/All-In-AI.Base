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
  import { authStore } from '@/lib/stores/auth.svelte';
  import { browser } from '$app/environment';
  import { mode } from 'mode-watcher';

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

  let avatarUploading = $state(false);
  let fileInput: HTMLInputElement;
  
  // 编辑抽屉状态
  let editorSheetOpen = $state(false);
  let editor: MarkdownEditor;
  let editorReady = $state(false);

  // 预览相关
  let previewRef: HTMLDivElement | undefined = $state();
  let isDark = $derived(mode.current === 'dark');

  // 渲染预览
  async function renderPreview() {
    if (!browser || !previewRef) return;
    
    const Vditor = (await import('vditor')).default;
    await import('vditor/dist/index.css');
    
    if (form.systemPrompt) {
      Vditor.preview(previewRef, form.systemPrompt, {
        mode: isDark ? 'dark' : 'light',
        theme: {
          current: isDark ? 'dark' : 'light',
        },
      });
    } else {
      previewRef.innerHTML = '';
    }
  }

  // 当 dialog 打开或 systemPrompt 变化时渲染预览
  $effect(() => {
    if (open && previewRef) {
      renderPreview();
    }
  });

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
    // 关闭后刷新预览
    setTimeout(() => renderPreview(), 100);
  }

  async function handleAvatarUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('请选择 JPG、PNG、GIF 或 WebP 格式的图片');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过 2MB');
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
        alert('上传失败');
      }
    } catch (err) {
      console.error('Avatar upload failed:', err);
      alert('上传失败');
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
  <Dialog.Content class="sm:max-w-6xl max-h-[90vh] overflow-y-auto" interactOutsideBehavior="ignore">
    <Dialog.Header>
      <Dialog.Title>{editing ? '编辑智能体' : '新增智能体'}</Dialog.Title>
    </Dialog.Header>
    <div class="grid grid-cols-2 gap-6 py-4">
      <!-- 左侧：基础信息 -->
      <div class="grid gap-4">
        <!-- 头像上传区域 -->
        <div class="flex items-center gap-4">
          <div class="relative group cursor-pointer" onclick={triggerFileInput}>
            <div class="size-16 rounded-full border-2 flex items-center justify-center bg-muted overflow-hidden" style={form.color ? `border-color: ${form.color}` : ''}>
              {#if form.avatar}
                <img src={form.avatar} alt="头像" class="size-full object-cover" />
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
            <p class="text-sm text-muted-foreground">点击上传头像</p>
            {#if form.avatar}
              <Button variant="ghost" size="sm" onclick={clearAvatar} class="h-6 px-2 text-xs">
                <Icon icon="mdi:close" class="size-3 mr-1" />清除
              </Button>
            {/if}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="grid gap-1.5">
            <Label class="text-xs">名称 *</Label>
            <Input bind:value={form.name} placeholder="智能体名称" class="h-9" />
          </div>
          <div class="grid gap-1.5">
            <Label class="text-xs">状态</Label>
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
            <Label class="text-xs">提供商 *</Label>
            <Select.Root type="single" bind:value={form.providerId} onValueChange={() => form.modelId = ''}>
              <Select.Trigger class="h-9">{providers.find(p => p.id === form.providerId)?.name || '请选择'}</Select.Trigger>
              <Select.Content>
                {#each providers as p}
                  <Select.Item value={p.id}>{p.name}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
          <div class="grid gap-1.5">
            <Label class="text-xs">模型 *</Label>
            <Select.Root type="single" bind:value={form.modelId}>
              <Select.Trigger class="h-9">{filteredModels.find(m => m.id === form.modelId)?.name || '请选择'}</Select.Trigger>
              <Select.Content>
                {#each filteredModels as m}
                  <Select.Item value={m.id}>{m.name}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
        <p class="text-xs text-muted-foreground -mt-2">默认模型，对话时可切换其他模型</p>

        <div class="grid gap-1.5">
          <Label class="text-xs">描述</Label>
          <Textarea bind:value={form.description} placeholder="智能体描述" rows={2} />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="grid gap-1.5">
            <Label class="text-xs">温度 (0-2)</Label>
            <Input bind:value={form.temperature} type="number" step="0.1" min="0" max="2" class="h-9" />
          </div>
          <div class="grid gap-1.5">
            <Label class="text-xs">主题色</Label>
            <Input bind:value={form.color} type="color" class="h-9" />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <Checkbox bind:checked={form.supportLoop} />
            <Label class="text-xs">支持循环调用</Label>
          </div>
          {#if form.supportLoop}
            <div class="flex items-center gap-2">
              <Label class="text-xs">最大循环</Label>
              <Input bind:value={form.maxLoops} type="number" class="w-16 h-8" min="1" max="100" />
            </div>
          {/if}
        </div>
      </div>

      <!-- 右侧：系统提示词预览 -->
      <div class="flex flex-col gap-1.5">
        <div class="flex items-center justify-between">
          <Label class="text-xs">系统提示词</Label>
          <Button variant="ghost" size="sm" onclick={openEditorSheet} class="h-6 px-2 text-xs">
            <Icon icon="mdi:pencil" class="size-3 mr-1" />编辑
          </Button>
        </div>
        <div class="border rounded-[var(--radius)] h-[380px] bg-muted/30">
          <ScrollArea class="h-full p-4">
            {#if form.systemPrompt}
              <div bind:this={previewRef} class="vditor-preview prose prose-sm dark:prose-invert max-w-none"></div>
            {:else}
              <div class="flex items-center justify-center h-[350px] text-muted-foreground text-sm">
                暂无系统提示词，点击编辑添加
              </div>
            {/if}
          </ScrollArea>
        </div>
      </div>
    </div>
    <Dialog.Footer>
      <Button variant="outline" onclick={() => onOpenChange(false)}>取消</Button>
      <Button onclick={onSave} disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>

<!-- 编辑抽屉 -->
<Sheet.Root bind:open={editorSheetOpen} onOpenChange={(v) => { if (!v) closeEditorSheet(); }}>
  <Sheet.Content side="right" class="w-full sm:max-w-2xl flex flex-col">
    <Sheet.Header>
      <Sheet.Title class="flex items-center gap-2">
        <Icon icon="mdi:file-document-edit" class="size-5" />
        编辑系统提示词
      </Sheet.Title>
      <Sheet.Description>
        定义智能体的角色、行为和约束
      </Sheet.Description>
    </Sheet.Header>

    <div class="flex-1 flex flex-col min-h-0 py-4">
      {#if editorSheetOpen}
        <MarkdownEditor
          bind:this={editor}
          value={form.systemPrompt}
          placeholder="定义智能体的角色和行为..."
          height={500}
          onInput={handleEditorInput}
          onReady={handleEditorReady}
        />
      {/if}
    </div>

    <Sheet.Footer>
      <Button onclick={closeEditorSheet}>完成</Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>

<style>
  :global(.vditor-preview) {
    font-size: 14px;
  }
</style>
