<script lang="ts">
  import { browser } from '$app/environment';
  import { mode } from 'mode-watcher';
  import { preferencesStore } from '@/lib/stores/preferences.svelte';
  import { onMount, onDestroy } from 'svelte';

  type ToolbarItem = string | { name: string; toolbar: string[] };

  interface Props {
    value?: string;
    placeholder?: string;
    height?: number;
    mode?: 'wysiwyg' | 'ir' | 'sv';
    toolbar?: ToolbarItem[];
    autoInit?: boolean;
    onInput?: (value: string) => void;
    onReady?: () => void;
  }

  const defaultToolbar: ToolbarItem[] = [
    'headings',
    'bold',
    'italic',
    'strike',
    'link',
    '|',
    'list',
    'ordered-list',
    'check',
    '|',
    'quote',
    'code',
    'inline-code',
    '|',
    'table',
    '|',
    'undo',
    'redo',
    '|',
    'edit-mode',
    'fullscreen',
  ];

  let {
    value = '',
    placeholder = '请输入内容...',
    height = 350,
    mode: editorMode = 'ir',
    toolbar = defaultToolbar,
    autoInit = true,
    onInput,
    onReady,
  }: Props = $props();

  let editorRef: HTMLDivElement | undefined = $state();
  let vditor: InstanceType<typeof import('vditor').default> | null = null;
  let ready = $state(false);
  let mounted = $state(false);

  let isDark = $derived(mode.current === 'dark');
  let fontSize = $derived(preferencesStore.fontSize);
  let radius = $derived(preferencesStore.radius);

  async function init() {
    if (!browser || !editorRef || vditor) return;

    const Vditor = (await import('vditor')).default;
    await import('vditor/dist/index.css');

    const currentTheme = isDark ? 'dark' : 'classic';

    vditor = new Vditor(editorRef, {
      height,
      mode: editorMode,
      placeholder,
      value,
      cache: { enable: false },
      theme: currentTheme,
      toolbar,
      preview: {
        theme: {
          current: isDark ? 'dark' : 'light',
        },
      },
      input: (val: string) => {
        onInput?.(val);
      },
      after: () => {
        ready = true;
        if (value && vditor) {
          vditor.setValue(value);
        }
        onReady?.();
      },
    });
  }

  function destroy() {
    if (vditor) {
      vditor.destroy();
      vditor = null;
    }
    ready = false;
  }

  onMount(() => {
    mounted = true;
    if (autoInit) {
      init();
    }
  });

  onDestroy(() => {
    destroy();
  });

  export function getValue(): string {
    return vditor?.getValue() || '';
  }

  export function setValue(val: string) {
    if (vditor && ready) {
      vditor.setValue(val);
    }
  }

  export function isReady(): boolean {
    return ready;
  }

  export function initialize() {
    if (mounted && !vditor) {
      init();
    }
  }

  export function cleanup() {
    destroy();
  }
</script>

<div 
  bind:this={editorRef} 
  class="vditor-wrapper"
  style="--vditor-font-size: {fontSize}px; --vditor-radius: {radius}rem;"
></div>

<style>
  .vditor-wrapper {
    border-radius: var(--vditor-radius, var(--radius));
  }
  :global(.vditor-wrapper .vditor) {
    border-radius: var(--vditor-radius, var(--radius));
    font-size: var(--vditor-font-size, 14px);
  }
  :global(.vditor-wrapper .vditor-toolbar) {
    border-radius: var(--vditor-radius, var(--radius)) var(--vditor-radius, var(--radius)) 0 0;
    padding: 0 5px;
  }
  :global(.vditor-wrapper .vditor-content) {
    border-radius: 0 0 var(--vditor-radius, var(--radius)) var(--vditor-radius, var(--radius));
  }
  :global(.vditor-wrapper .vditor-ir) {
    font-size: var(--vditor-font-size, 14px);
  }
  :global(.vditor-wrapper .vditor-ir pre.vditor-reset) {
    font-size: var(--vditor-font-size, 14px);
  }
  :global(.vditor-wrapper .vditor-wysiwyg) {
    font-size: var(--vditor-font-size, 14px);
  }
  :global(.vditor-wrapper .vditor-sv) {
    font-size: var(--vditor-font-size, 14px);
  }
</style>
