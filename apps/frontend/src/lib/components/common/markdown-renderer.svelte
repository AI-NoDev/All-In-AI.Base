<script lang="ts">
  import { browser } from '$app/environment';
  import { marked } from 'marked';
  import hljs from 'highlight.js';

  interface Props {
    content: string;
    class?: string;
  }

  let { content, class: className = '' }: Props = $props();

  let containerRef = $state<HTMLElement | null>(null);
  let renderedHtml = $state('');

  // 自定义渲染器
  const renderer = new marked.Renderer();
  
  // 代码块渲染
  renderer.code = ({ text, lang }) => {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
    const highlighted = hljs.highlight(text, { language }).value;
    return `<pre class="hljs rounded-md overflow-x-auto"><code class="language-${language}">${highlighted}</code></pre>`;
  };

  // 行内代码
  renderer.codespan = ({ text }) => {
    return `<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">${text}</code>`;
  };

  // 链接
  renderer.link = ({ href, title, text }) => {
    const titleAttr = title ? ` title="${title}"` : '';
    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer" class="text-primary underline hover:no-underline">${text}</a>`;
  };

  // 配置 marked
  marked.use({ 
    renderer,
    gfm: true,
    breaks: true,
  });

  // 解析 markdown（处理异步）
  $effect(() => {
    if (!content) {
      renderedHtml = '';
      return;
    }
    
    const result = marked.parse(content);
    if (result instanceof Promise) {
      result.then(html => {
        renderedHtml = html;
      });
    } else {
      renderedHtml = result;
    }
  });

  // 高亮代码块
  $effect(() => {
    if (browser && containerRef && renderedHtml) {
      setTimeout(() => {
        containerRef?.querySelectorAll('pre code:not(.hljs)').forEach((block) => {
          hljs.highlightElement(block as HTMLElement);
        });
      }, 0);
    }
  });
</script>

<div 
  bind:this={containerRef}
  class="markdown-content prose prose-sm dark:prose-invert max-w-none {className}"
>
  {@html renderedHtml}
</div>

<style>
  .markdown-content :global(pre) {
    margin: 0.5rem 0;
    padding: 0.75rem;
    background: var(--muted);
    border-radius: 0.375rem;
    overflow-x: auto;
  }
  .markdown-content :global(pre code) {
    font-size: 0.8125rem;
    line-height: 1.5;
  }
  .markdown-content :global(p) {
    margin: 0.25rem 0;
  }
  .markdown-content :global(ul),
  .markdown-content :global(ol) {
    margin: 0.25rem 0;
    padding-left: 1.25rem;
  }
  .markdown-content :global(li) {
    margin: 0.125rem 0;
  }
  .markdown-content :global(blockquote) {
    margin: 0.5rem 0;
    padding-left: 0.75rem;
    border-left: 3px solid var(--border);
    color: var(--muted-foreground);
  }
  .markdown-content :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0;
  }
  .markdown-content :global(th),
  .markdown-content :global(td) {
    border: 1px solid var(--border);
    padding: 0.375rem 0.5rem;
    text-align: left;
  }
  .markdown-content :global(th) {
    background: var(--muted);
  }
  .markdown-content :global(img) {
    max-width: 100%;
    border-radius: 0.375rem;
  }
  .markdown-content :global(hr) {
    margin: 0.75rem 0;
    border: none;
    border-top: 1px solid var(--border);
  }
</style>
