<script lang="ts">
  import { browser } from '$app/environment';
  import { mode } from 'mode-watcher';
  import Icon from '@iconify/svelte';
  import * as Sheet from '$lib/components/ui/sheet';
  import { Button } from '$lib/components/ui/button';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import MarkdownEditor from '$lib/components/common/markdown-editor.svelte';

  interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    currentDescription: string | null;
    readOnly?: boolean;
    onSave?: (description: string | null) => void;
  }

  let { 
    open = $bindable(false), 
    onOpenChange, 
    title, 
    currentDescription, 
    readOnly = false,
    onSave 
  }: Props = $props();

  let previewRef: HTMLDivElement | undefined = $state();
  let editor: MarkdownEditor | undefined = $state();
  let saving = $state(false);
  let editorReady = $state(false);

  let isDark = $derived(mode.current === 'dark');

  async function renderPreview() {
    if (!browser || !previewRef) return;
    
    const Vditor = (await import('vditor')).default;
    await import('vditor/dist/index.css');
    
    const content = currentDescription || '';
    if (content) {
      Vditor.preview(previewRef, content, {
        mode: isDark ? 'dark' : 'light',
        theme: {
          current: isDark ? 'dark' : 'light',
        },
      });
    }
  }

  $effect(() => {
    if (open && readOnly) {
      setTimeout(() => renderPreview(), 100);
    }
  });

  function handleEditorReady() {
    editorReady = true;
    if (currentDescription && editor) {
      editor.setValue(currentDescription);
    }
  }

  async function handleSave() {
    if (onSave && editor) {
      saving = true;
      try {
        const value = editor.getValue().trim();
        await onSave(value || null);
        handleClose();
      } finally {
        saving = false;
      }
    }
  }

  function handleClose() {
    if (editor) {
      editor.cleanup();
    }
    editorReady = false;
    open = false;
    onOpenChange(false);
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      handleClose();
    } else {
      open = newOpen;
      onOpenChange(newOpen);
    }
  }
</script>

<Sheet.Root bind:open onOpenChange={handleOpenChange}>
  <Sheet.Content side="right" class="w-full sm:max-w-2xl flex flex-col">
    <Sheet.Header>
      <Sheet.Title class="flex items-center gap-2">
        <Icon icon="tdesign:file-setting" class="size-5" />
        {readOnly ? '查看描述' : '编辑描述'}
      </Sheet.Title>
      <Sheet.Description class="flex items-center gap-1">
        <span class="truncate max-w-[300px]">{title}</span>
        {#if !readOnly}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <Icon icon="tdesign:help-circle" class="size-4 text-muted-foreground" />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>描述有助于 AI 理解文件内容</p>
            </Tooltip.Content>
          </Tooltip.Root>
        {/if}
      </Sheet.Description>
    </Sheet.Header>

    <div class="flex-1 flex flex-col min-h-0 py-4">
      {#if readOnly}
        {#if currentDescription}
          <div bind:this={previewRef} class="vditor-preview flex-1 overflow-auto border rounded-lg p-4"></div>
        {:else}
          <div class="flex-1 flex items-center justify-center text-muted-foreground">
            暂无描述
          </div>
        {/if}
      {:else if open}
        <MarkdownEditor
          bind:this={editor}
          value={currentDescription || ''}
          placeholder="使用 Markdown 格式编写描述..."
          height={350}
          onReady={handleEditorReady}
        />
        {#if editorReady}
          <p class="text-xs text-muted-foreground mt-2">
            支持 Markdown 格式，描述有助于 AI 理解文件内容
          </p>
        {/if}
      {/if}
    </div>

    <Sheet.Footer>
      {#if readOnly}
        <Button onclick={handleClose}>关闭</Button>
      {:else}
        <Button variant="outline" onclick={handleClose} disabled={saving}>取消</Button>
        <Button onclick={handleSave} disabled={saving || !editorReady}>
          {#if saving}
            <Icon icon="tdesign:loading" class="size-4 mr-2 animate-spin" />
          {/if}
          保存
        </Button>
      {/if}
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>

<style>
  :global(.vditor-preview) {
    font-size: 14px;
  }
</style>
