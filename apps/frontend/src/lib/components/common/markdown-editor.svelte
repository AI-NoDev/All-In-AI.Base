<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  interface Props {
    value?: string;
    placeholder?: string;
    height?: number;
    mode?: 'wysiwyg' | 'ir' | 'sv';
    onInput?: (value: string) => void;
  }

  let {
    value = '',
    placeholder = '请输入内容...',
    height = 500,
    mode = 'wysiwyg',
    onInput,
  }: Props = $props();

  let editorRef: HTMLDivElement;
  let vditor: InstanceType<typeof import('vditor').default> | null = null;

  onMount(async () => {
    if (!browser) return;

    const Vditor = (await import('vditor')).default;
    await import('vditor/dist/index.css');

    vditor = new Vditor(editorRef, {
      height,
      mode,
      placeholder,
      value,
      cache: { enable: false },
      toolbar: [
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        'link',
        '|',
        'list',
        'ordered-list',
        'check',
        'outdent',
        'indent',
        '|',
        'quote',
        'line',
        'code',
        'inline-code',
        'insert-before',
        'insert-after',
        '|',
        'table',
        '|',
        'undo',
        'redo',
        '|',
        'fullscreen',
        'edit-mode',
        {
          name: 'more',
          toolbar: [
            'both',
            'code-theme',
            'content-theme',
            'export',
            'outline',
            'preview',
          ],
        },
      ],
      input: (val: string) => {
        onInput?.(val);
      },
      after: () => {
        if (value && vditor) {
          vditor.setValue(value);
        }
      },
    });
  });

  onDestroy(() => {
    vditor?.destroy();
    vditor = null;
  });

  export function getValue(): string {
    return vditor?.getValue() || '';
  }

  export function setValue(val: string) {
    vditor?.setValue(val);
  }
</script>

<div bind:this={editorRef} class="vditor-container"></div>

