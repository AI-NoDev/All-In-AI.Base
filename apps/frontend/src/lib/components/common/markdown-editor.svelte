<script lang="ts">
  import { browser } from '$app/environment';
  import Icon from '@iconify/svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import { t } from '@/lib/stores/i18n.svelte';

  interface Props {
    value?: string;
    placeholder?: string;
    height?: number;
    disableToolbar?: boolean;
    onInput?: (value: string) => void;
    onReady?: () => void;
  }

  let {
    value = $bindable(''),
    placeholder,
    height = 350,
    disableToolbar = false,
    onInput,
    onReady,
  }: Props = $props();

  let ready = $state(false);
  let textarea: HTMLTextAreaElement;

  // Use $derived for toolbar items to react to language changes
  const toolbarItems = $derived([
    { icon: 'mdi:format-header-1', action: 'h1', title: t('common.editor_h1') },
    { icon: 'mdi:format-header-2', action: 'h2', title: t('common.editor_h2') },
    { icon: 'mdi:format-header-3', action: 'h3', title: t('common.editor_h3') },
    { type: 'divider' },
    { icon: 'mdi:format-bold', action: 'bold', title: t('common.editor_bold') },
    { icon: 'mdi:format-italic', action: 'italic', title: t('common.editor_italic') },
    { icon: 'mdi:format-strikethrough', action: 'strike', title: t('common.editor_strike') },
    { icon: 'mdi:code-tags', action: 'code', title: t('common.editor_code') },
    { type: 'divider' },
    { icon: 'mdi:format-list-bulleted', action: 'ul', title: t('common.editor_ul') },
    { icon: 'mdi:format-list-numbered', action: 'ol', title: t('common.editor_ol') },
    { icon: 'mdi:format-list-checks', action: 'task', title: t('common.editor_task') },
    { type: 'divider' },
    { icon: 'mdi:format-quote-close', action: 'quote', title: t('common.editor_quote') },
    { icon: 'mdi:code-braces-box', action: 'codeblock', title: t('common.editor_codeblock') },
    { icon: 'mdi:link-variant', action: 'link', title: t('common.editor_link') },
    { icon: 'mdi:table', action: 'table', title: t('common.editor_table') },
    { icon: 'mdi:minus', action: 'hr', title: t('common.editor_hr') },
  ]);

  // Computed placeholder with i18n fallback
  const computedPlaceholder = $derived(placeholder ?? t('common.editor_placeholder'));

  $effect(() => {
    if (browser && !ready) {
      ready = true;
      onReady?.();
    }
  });

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    value = target.value;
    onInput?.(value);
  }

  function insertText(before: string, after: string = '', defaultText: string = '') {
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;
    const newText = value.substring(0, start) + before + selected + after + value.substring(end);
    
    value = newText;
    onInput?.(value);
    
    // 恢复焦点和选区
    setTimeout(() => {
      textarea.focus();
      const newStart = start + before.length;
      const newEnd = newStart + selected.length;
      textarea.setSelectionRange(newStart, newEnd);
    }, 0);
  }

  function insertLine(prefix: string) {
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    
    value = newText;
    onInput?.(value);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  }

  function handleToolbar(action: string) {
    switch (action) {
      case 'h1': insertLine('# '); break;
      case 'h2': insertLine('## '); break;
      case 'h3': insertLine('### '); break;
      case 'bold': insertText('**', '**', t('common.editor_boldText')); break;
      case 'italic': insertText('*', '*', t('common.editor_italicText')); break;
      case 'strike': insertText('~~', '~~', t('common.editor_strikeText')); break;
      case 'code': insertText('`', '`', 'code'); break;
      case 'ul': insertLine('- '); break;
      case 'ol': insertLine('1. '); break;
      case 'task': insertLine('- [ ] '); break;
      case 'quote': insertLine('> '); break;
      case 'codeblock': insertText('```\n', '\n```', 'code'); break;
      case 'link': insertText('[', '](url)', t('common.editor_linkText')); break;
      case 'table': insertText(`\n| ${t('common.editor_col1')} | ${t('common.editor_col2')} | ${t('common.editor_col3')} |\n| --- | --- | --- |\n| `, ' |  |  |\n', t('common.editor_tableContent')); break;
      case 'hr': insertText('\n---\n', ''); break;
    }
  }

  export function getValue(): string {
    return value;
  }

  export function setValue(val: string) {
    value = val;
  }

  export function isReady(): boolean {
    return ready;
  }

  export function cleanup() {
    value = '';
    ready = false;
  }

  export function initialize() {
    ready = true;
  }
</script>

<div class="editor-wrapper" style="--editor-height: {height}px;">
  {#if !disableToolbar}
    <div class="editor-toolbar">
      {#each toolbarItems as item}
        {#if item.type === 'divider'}
          <div class="toolbar-divider"></div>
        {:else}
          <Tooltip.Root>
            <Tooltip.Trigger>
              <button
                type="button"
                class="toolbar-btn"
                onclick={() => handleToolbar(item.action!)}
              >
                <Icon icon={item.icon!} class="size-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>{item.title}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        {/if}
      {/each}
    </div>
  {/if}
  <textarea
    bind:this={textarea}
    class="editor-textarea"
    class:no-toolbar={disableToolbar}
    placeholder={computedPlaceholder}
    value={value}
    oninput={handleInput}
  ></textarea>
</div>

<style>
  .editor-wrapper {
    height: var(--editor-height, 350px);
    display: flex;
    flex-direction: column;
    border-radius: var(--radius);
    border: 1px solid hsl(var(--border));
    overflow: hidden;
  }

  .editor-toolbar {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 0.375rem 0.5rem;
    background: hsl(var(--muted));
    border-bottom: 1px solid hsl(var(--border));
    flex-wrap: wrap;
  }

  .toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: calc(var(--radius) - 2px);
    color: hsl(var(--muted-foreground));
    transition: all 0.15s;
  }

  .toolbar-btn:hover {
    background: hsl(var(--accent));
    color: hsl(var(--foreground));
  }

  .toolbar-divider {
    width: 1px;
    height: 1rem;
    background: hsl(var(--border));
    margin: 0 0.25rem;
  }

  .editor-textarea {
    flex: 1;
    width: 100%;
    padding: 0.75rem;
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    resize: none;
    outline: none;
    border: none;
  }

  .editor-textarea.no-toolbar {
    border-radius: var(--radius);
  }

  .editor-textarea:focus {
    outline: none;
  }

  .editor-textarea::placeholder {
    color: hsl(var(--muted-foreground));
  }
</style>
