<script lang="ts">
  import { mode } from 'mode-watcher';
  import { Carta, Markdown } from 'carta-md';
  import DOMPurify from 'isomorphic-dompurify';
  import 'carta-md/default.css';

  interface Props {
    value: string;
    class?: string;
  }

  let { value, class: className = '' }: Props = $props();

  let isDark = $derived(mode.current === 'dark');
  let theme = $derived(isDark ? 'dark' : 'light');

  const carta = new Carta({
    sanitizer: DOMPurify.sanitize,
  });
</script>

{#key value}
  <div class="markdown-preview {className}">
    <Markdown {carta} {value} {theme} />
  </div>
{/key}

<style>
  .markdown-preview {
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .markdown-preview :global(.carta-font-code) {
    font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
    font-size: 0.8125rem;
  }

  .markdown-preview :global(pre) {
    background: hsl(var(--muted));
    border-radius: var(--radius);
    padding: 0.75rem;
    overflow-x: auto;
  }

  .markdown-preview :global(code:not(pre code)) {
    background: hsl(var(--muted));
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.8125rem;
  }

  .markdown-preview :global(blockquote) {
    border-left: 3px solid hsl(var(--border));
    padding-left: 1rem;
    margin-left: 0;
    color: hsl(var(--muted-foreground));
  }

  .markdown-preview :global(table) {
    width: 100%;
    border-collapse: collapse;
  }

  .markdown-preview :global(th),
  .markdown-preview :global(td) {
    border: 1px solid hsl(var(--border));
    padding: 0.5rem;
    text-align: left;
  }

  .markdown-preview :global(th) {
    background: hsl(var(--muted));
  }

  .markdown-preview :global(a) {
    color: hsl(var(--primary));
    text-decoration: underline;
  }

  .markdown-preview :global(ul),
  .markdown-preview :global(ol) {
    padding-left: 1.5rem;
  }

  .markdown-preview :global(h1),
  .markdown-preview :global(h2),
  .markdown-preview :global(h3),
  .markdown-preview :global(h4),
  .markdown-preview :global(h5),
  .markdown-preview :global(h6) {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .markdown-preview :global(p) {
    margin-bottom: 0.5rem;
  }
</style>
