<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { FileIcon } from '@qiyu-allinai/file-icons';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { mode } from 'mode-watcher';
  import hljs from 'highlight.js/lib/core';
  // 注册常用语言
  import typescript from 'highlight.js/lib/languages/typescript';
  import javascript from 'highlight.js/lib/languages/javascript';
  import json from 'highlight.js/lib/languages/json';
  import css from 'highlight.js/lib/languages/css';
  import scss from 'highlight.js/lib/languages/scss';
  import xml from 'highlight.js/lib/languages/xml';
  import markdown from 'highlight.js/lib/languages/markdown';
  import yaml from 'highlight.js/lib/languages/yaml';
  import sql from 'highlight.js/lib/languages/sql';
  import shell from 'highlight.js/lib/languages/shell';
  import python from 'highlight.js/lib/languages/python';
  import go from 'highlight.js/lib/languages/go';
  import rust from 'highlight.js/lib/languages/rust';
  import java from 'highlight.js/lib/languages/java';

  // 注册语言
  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('scss', scss);
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('html', xml);
  hljs.registerLanguage('markdown', markdown);
  hljs.registerLanguage('yaml', yaml);
  hljs.registerLanguage('sql', sql);
  hljs.registerLanguage('shell', shell);
  hljs.registerLanguage('python', python);
  hljs.registerLanguage('go', go);
  hljs.registerLanguage('rust', rust);
  hljs.registerLanguage('java', java);
  // Svelte 使用 xml 高亮
  hljs.registerLanguage('svelte', xml);
  hljs.registerLanguage('vue', xml);

  interface FileItem {
    name: string;
    path: string;
    type: 'file' | 'directory';
    size?: number;
    extension?: string;
    children?: FileItem[];
    loaded?: boolean;
  }

  interface SelectedFile {
    content: string;
    path: string;
    name: string;
    extension: string;
    size: number;
    language: string;
  }

  let projectName = $state('');
  let rootItems = $state<FileItem[]>([]);
  let expandedPaths = $state<Set<string>>(new Set());
  let selectedFile = $state<SelectedFile | null>(null);
  let loading = $state(false);
  let fileLoading = $state(false);
  let highlightedCode = $state('');

  const api = authStore.createApi(true);

  // 加载项目根目录
  async function loadRoot() {
    loading = true;
    try {
      const rootRes = await api.dev.getApiDevProjectCodeRoot();
      projectName = rootRes.data.name;
      
      const dirRes = await api.dev.postApiDevProjectCodeDirectory({ relativePath: '' });
      rootItems = dirRes.data.items.map(item => ({
        ...item,
        children: item.type === 'directory' ? [] : undefined,
        loaded: item.type !== 'directory',
      }));
    } catch (err) {
      console.error('Failed to load project root:', err);
    } finally {
      loading = false;
    }
  }

  // 加载目录内容
  async function loadDirectory(node: FileItem) {
    if (node.loaded) return;
    
    try {
      const res = await api.dev.postApiDevProjectCodeDirectory({ relativePath: node.path });
      node.children = res.data.items.map(item => ({
        ...item,
        children: item.type === 'directory' ? [] : undefined,
        loaded: item.type !== 'directory',
      }));
      node.loaded = true;
    } catch (err) {
      console.error('Failed to load directory:', err);
    }
  }

  // 切换目录展开/折叠
  async function toggleDirectory(node: FileItem) {
    const path = node.path;
    if (expandedPaths.has(path)) {
      expandedPaths.delete(path);
      expandedPaths = new Set(expandedPaths);
    } else {
      await loadDirectory(node);
      expandedPaths.add(path);
      expandedPaths = new Set(expandedPaths);
    }
  }

  // 选择文件
  async function selectFile(node: FileItem) {
    if (node.type !== 'file') return;
    
    fileLoading = true;
    try {
      const res = await api.dev.postApiDevProjectCodeFile({ relativePath: node.path });
      selectedFile = res.data;
      // 高亮代码
      highlightCode(res.data.content, res.data.language);
    } catch (err) {
      console.error('Failed to load file:', err);
    } finally {
      fileLoading = false;
    }
  }

  // 高亮代码
  function highlightCode(code: string, language: string) {
    try {
      if (hljs.getLanguage(language)) {
        highlightedCode = hljs.highlight(code, { language }).value;
      } else {
        highlightedCode = hljs.highlightAuto(code).value;
      }
    } catch {
      highlightedCode = escapeHtml(code);
    }
  }

  function escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // 格式化文件大小
  function formatSize(bytes?: number): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // 获取行号数组
  function getLineNumbers(code: string): number[] {
    return Array.from({ length: code.split('\n').length }, (_, i) => i + 1);
  }

  // 根据主题获取样式 URL
  let isDark = $derived(mode.current === 'dark');
  let themeStyleUrl = $derived(
    isDark 
      ? 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css'
      : 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css'
  );

  onMount(() => {
    loadRoot();
  });
</script>

<svelte:head>
  <link rel="stylesheet" href={themeStyleUrl} />
</svelte:head>

<div class="flex h-full">
  <!-- 左侧文件树 -->
  <div class="w-72 border-r flex flex-col bg-muted/30">
    <div class="p-3 border-b font-medium flex items-center gap-2">
      <FileIcon type="src" isFolder size={18} />
      <span class="truncate">{projectName || '项目代码'}</span>
    </div>
    
    <div class="flex-1 min-h-0">
      <ScrollArea class="h-full">
        <div class="p-2">
          {#if loading}
            <div class="flex items-center justify-center py-8 text-muted-foreground">
              加载中...
            </div>
          {:else}
            {#each rootItems as node}
              {@render treeNode(node, 0)}
            {/each}
          {/if}
        </div>
      </ScrollArea>
    </div>
  </div>

  <!-- 右侧代码显示 -->
  <div class="flex-1 flex flex-col min-w-0">
    {#if selectedFile}
      <!-- 文件信息栏 -->
      <div class="px-4 py-2 border-b flex items-center gap-3 bg-muted/30">
        <FileIcon type={selectedFile.name} size={18} />
        <span class="font-medium">{selectedFile.name}</span>
        <span class="text-muted-foreground text-sm">{selectedFile.path}</span>
        <span class="text-muted-foreground text-sm ml-auto">{formatSize(selectedFile.size)}</span>
      </div>
      
      <!-- 代码区域 -->
      <div class="flex-1 min-h-0">
        <ScrollArea class="h-full" orientation="both">
          {#if fileLoading}
            <div class="flex items-center justify-center py-8 text-muted-foreground">
              加载中...
            </div>
          {:else}
            <div class="code-container flex text-sm">
              <!-- 行号 -->
              <div class="line-numbers select-none text-right pr-4 py-4 text-muted-foreground border-r border-border {isDark ? 'bg-[#0d1117]' : 'bg-[#f6f8fa]'}">
                {#each getLineNumbers(selectedFile.content) as lineNum}
                  <div class="px-2 leading-6">{lineNum}</div>
                {/each}
              </div>
              <!-- 代码 -->
              <pre class="flex-1 p-4 m-0 overflow-x-auto {isDark ? 'bg-[#0d1117]' : 'bg-[#f6f8fa]'}"><code class="hljs leading-6">{@html highlightedCode}</code></pre>
            </div>
          {/if}
        </ScrollArea>
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center text-muted-foreground">
        选择一个文件查看代码
      </div>
    {/if}
  </div>
</div>

{#snippet treeNode(node: FileItem, depth: number)}
  <div>
    {#if node.type === 'directory'}
      <button
        type="button"
        class="w-full flex items-center gap-1 py-1 px-2 rounded cursor-pointer hover:bg-muted/50 transition-colors text-left"
        style="padding-left: {depth * 16 + 8}px"
        onclick={() => toggleDirectory(node)}
      >
        <FileIcon type={node.name} isFolder isOpen={expandedPaths.has(node.path)} size={16} />
        <span class="truncate">{node.name}</span>
      </button>
      {#if expandedPaths.has(node.path) && node.children}
        {#each node.children as child}
          {@render treeNode(child, depth + 1)}
        {/each}
      {/if}
    {:else}
      <button
        type="button"
        class="w-full flex items-center gap-1 py-1 px-2 rounded cursor-pointer hover:bg-muted/50 transition-colors text-left {selectedFile?.path === node.path ? 'bg-primary/10' : ''}"
        style="padding-left: {depth * 16 + 8}px"
        onclick={() => selectFile(node)}
      >
        <FileIcon type={node.name} size={16} />
        <span class="truncate">{node.name}</span>
      </button>
    {/if}
  </div>
{/snippet}

<style>
  .code-container {
    font-family: 'Fira Code', 'JetBrains Mono', Consolas, Monaco, 'Courier New', monospace;
  }
  
  .line-numbers {
    min-width: 3rem;
    font-family: inherit;
  }
  
  :global(.hljs) {
    background: transparent !important;
    padding: 0 !important;
  }
</style>
