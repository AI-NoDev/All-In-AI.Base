<script lang="ts">
  import hljs from 'highlight.js/lib/core';
  import typescript from 'highlight.js/lib/languages/typescript';
  import javascript from 'highlight.js/lib/languages/javascript';
  import xml from 'highlight.js/lib/languages/xml';
  import css from 'highlight.js/lib/languages/css';
  import json from 'highlight.js/lib/languages/json';
  import bash from 'highlight.js/lib/languages/bash';
  import sql from 'highlight.js/lib/languages/sql';
  import yaml from 'highlight.js/lib/languages/yaml';
  import { page } from '$app/stores';
  // 导入 GitHub 官方主题
  import 'highlight.js/styles/github.css';
  import 'highlight.js/styles/github-dark.css';

  // 从 URL 路径提取当前文档语言
  function getDocLocale(): string {
    const parts = $page.url.pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'docs') {
      return parts[1];
    }
    return 'zh-CN';
  }

  // 文档内置翻译
  const translations: Record<string, Record<string, string>> = {
    'zh-CN': { 'common.copy': '复制', 'common.copied': '已复制' },
    'en': { 'common.copy': 'Copy', 'common.copied': 'Copied' },
  };

  function tDoc(key: string): string {
    const locale = getDocLocale();
    return translations[locale]?.[key] ?? translations['zh-CN'][key] ?? key;
  }

  // 注册语言
  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('ts', typescript);
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('js', javascript);
  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('svelte', xml);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('bash', bash);
  hljs.registerLanguage('sh', bash);
  hljs.registerLanguage('shell', bash);
  hljs.registerLanguage('sql', sql);
  hljs.registerLanguage('yaml', yaml);
  hljs.registerLanguage('yml', yaml);

  interface Props {
    text: string;
    lang?: string;
  }

  let { text, lang }: Props = $props();

  let copied = $state(false);

  function getHighlightedCode(): string {
    if (!lang || lang === 'plaintext' || lang === 'text') {
      return escapeHtml(text);
    }
    try {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      if (language === 'plaintext') {
        return escapeHtml(text);
      }
      return hljs.highlight(text, { language }).value;
    } catch {
      return escapeHtml(text);
    }
  }

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async function copyCode() {
    await navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<div class="code-block not-prose">
  <div class="code-header">
    {#if lang && lang !== 'plaintext' && lang !== 'text'}
      <span class="code-lang">{lang}</span>
    {/if}
    <button class="copy-btn" onclick={copyCode} title={tDoc('common.copy')}>
      {#if copied}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41L9 16.17z"/></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
      {/if}
    </button>
  </div>
  <pre class="hljs"><code>{@html getHighlightedCode()}</code></pre>
</div>

<style>
  /* GitHub 风格代码块容器 */
  .code-block {
    margin: 1rem 0;
    border-radius: 6px;
    overflow: hidden;
    background-color: #f6f8fa;
    border: 1px solid #d0d7de;
  }

  :global(.dark) .code-block {
    background-color: #0d1117;
    border-color: #30363d;
  }

  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    background-color: #f6f8fa;
    border-bottom: 1px solid #d0d7de;
    min-height: 40px;
  }

  :global(.dark) .code-header {
    background-color: #161b22;
    border-bottom-color: #30363d;
  }

  .code-lang {
    font-size: 12px;
    font-weight: 500;
    color: #57606a;
    text-transform: lowercase;
  }

  :global(.dark) .code-lang {
    color: #8b949e;
  }

  .copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 6px;
    background: transparent;
    border: 1px solid #d0d7de;
    color: #57606a;
    cursor: pointer;
    transition: all 0.2s;
    margin-left: auto;
  }

  .copy-btn:hover {
    background-color: #f3f4f6;
    color: #24292f;
  }

  :global(.dark) .copy-btn {
    border-color: #30363d;
    color: #8b949e;
  }

  :global(.dark) .copy-btn:hover {
    background-color: #30363d;
    color: #c9d1d9;
  }

  pre.hljs {
    margin: 0;
    padding: 16px;
    overflow-x: auto;
    font-size: 13px;
    line-height: 1.45;
    background: #f6f8fa !important;
  }

  :global(.dark) pre.hljs {
    background: #0d1117 !important;
  }

  code {
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace;
    background: transparent !important;
  }

  /* 覆盖 highlight.js 默认背景 */
  :global(.hljs) {
    background: transparent !important;
  }

  /* 暗色模式使用 github-dark 主题 */
  :global(.dark .hljs) {
    color: #c9d1d9;
  }
  :global(.dark .hljs-doctag),
  :global(.dark .hljs-keyword),
  :global(.dark .hljs-meta .hljs-keyword),
  :global(.dark .hljs-template-tag),
  :global(.dark .hljs-template-variable),
  :global(.dark .hljs-type),
  :global(.dark .hljs-variable.language_) {
    color: #ff7b72;
  }
  :global(.dark .hljs-title),
  :global(.dark .hljs-title.class_),
  :global(.dark .hljs-title.class_.inherited__),
  :global(.dark .hljs-title.function_) {
    color: #d2a8ff;
  }
  :global(.dark .hljs-attr),
  :global(.dark .hljs-attribute),
  :global(.dark .hljs-literal),
  :global(.dark .hljs-meta),
  :global(.dark .hljs-number),
  :global(.dark .hljs-operator),
  :global(.dark .hljs-selector-attr),
  :global(.dark .hljs-selector-class),
  :global(.dark .hljs-selector-id),
  :global(.dark .hljs-variable) {
    color: #79c0ff;
  }
  :global(.dark .hljs-meta .hljs-string),
  :global(.dark .hljs-regexp),
  :global(.dark .hljs-string) {
    color: #a5d6ff;
  }
  :global(.dark .hljs-built_in),
  :global(.dark .hljs-symbol) {
    color: #ffa657;
  }
  :global(.dark .hljs-code),
  :global(.dark .hljs-comment),
  :global(.dark .hljs-formula) {
    color: #8b949e;
  }
  :global(.dark .hljs-name),
  :global(.dark .hljs-quote),
  :global(.dark .hljs-selector-pseudo),
  :global(.dark .hljs-selector-tag) {
    color: #7ee787;
  }
  :global(.dark .hljs-subst) {
    color: #c9d1d9;
  }
  :global(.dark .hljs-section) {
    color: #1f6feb;
    font-weight: 700;
  }
  :global(.dark .hljs-bullet) {
    color: #f2cc60;
  }
  :global(.dark .hljs-emphasis) {
    color: #c9d1d9;
    font-style: italic;
  }
  :global(.dark .hljs-strong) {
    color: #c9d1d9;
    font-weight: 700;
  }
  :global(.dark .hljs-addition) {
    color: #aff5b4;
    background-color: #033a16;
  }
  :global(.dark .hljs-deletion) {
    color: #ffdcd7;
    background-color: #67060c;
  }
</style>
