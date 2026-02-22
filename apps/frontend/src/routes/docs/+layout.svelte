<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { docsTree } from 'virtual:svelte-docs';
  import * as Select from '$lib/components/ui/select';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import Icon from '@iconify/svelte';

  interface DocsTreeNode {
    name: string;
    path: string;
    route: string;
    meta?: {
      title?: string;
      description?: string;
      order?: number;
    };
    children?: DocsTreeNode[];
    isFile?: boolean;
  }

  let { children } = $props();

  // 支持的文档语言
  const SUPPORTED_LOCALES = ['zh-CN', 'en'] as const;
  type DocLocale = (typeof SUPPORTED_LOCALES)[number];

  // 文档语言显示名称
  const localeOptions: { value: DocLocale; label: string }[] = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'en', label: 'English' },
  ];

  // 从 URL 路径提取当前文档语言
  function getDocLocale(pathname: string): DocLocale {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && parts[0] === 'docs') {
      const locale = parts[1];
      if (SUPPORTED_LOCALES.includes(locale as DocLocale)) {
        return locale as DocLocale;
      }
    }
    return 'zh-CN';
  }

  // 当前文档语言（从 URL 派生）
  let docLocale = $derived(getDocLocale($page.url.pathname));

  // 文档内置翻译（不依赖全局 i18n）
  const docTranslations: Record<DocLocale, Record<string, string>> = {
    'zh-CN': {
      'docs.title.documentation': '开发文档',
      'docs.title.home': '首页',
      'docs.title.guide': '指南',
      'docs.title.backend': '后端',
      'docs.title.frontend': '前端',
      'docs.title.gettingStarted': '快速开始',
      'docs.title.projectStructure': '项目结构',
      'docs.title.actions': 'Actions',
      'docs.title.components': '组件',
      'docs.group.guide': '指南',
      'docs.group.backend': '后端',
      'docs.group.frontend': '前端',
      'docs.language': '语言',
    },
    'en': {
      'docs.title.documentation': 'Documentation',
      'docs.title.home': 'Home',
      'docs.title.guide': 'Guide',
      'docs.title.backend': 'Backend',
      'docs.title.frontend': 'Frontend',
      'docs.title.gettingStarted': 'Getting Started',
      'docs.title.projectStructure': 'Project Structure',
      'docs.title.actions': 'Actions',
      'docs.title.components': 'Components',
      'docs.group.guide': 'Guide',
      'docs.group.backend': 'Backend',
      'docs.group.frontend': 'Frontend',
      'docs.language': 'Language',
    },
  };

  // 文档专用翻译函数
  function tDoc(key: string, fallback?: string): string {
    const translations = docTranslations[docLocale];
    return translations[key] ?? fallback ?? key;
  }

  // 翻译标题
  function translateTitle(title: string | undefined, fallback: string): string {
    if (!title) return fallback;
    if (title.includes('.')) {
      const translated = tDoc(title, fallback);
      return translated === title ? fallback : translated;
    }
    return title;
  }

  // 获取当前语言的文档节点
  let localeNode = $derived.by(() => {
    return (docsTree as DocsTreeNode[]).find((node) => node.name === docLocale);
  });
  
  // 过滤 docsTree，只显示当前语言的文档
  let filteredDocsTree = $derived.by(() => {
    return localeNode?.children ?? [];
  });

  function isActive(route: string): boolean {
    const pathname = $page.url.pathname;
    return pathname === route || pathname === route.slice(0, -1);
  }

  // 切换文档语言
  function handleLocaleChange(newLocale: string) {
    if (newLocale === docLocale) return;
    const currentPath = $page.url.pathname;
    const newPath = currentPath.replace(`/docs/${docLocale}`, `/docs/${newLocale}`);
    goto(newPath);
  }
</script>

<div class="flex h-screen w-full">
  <!-- Sidebar - 固定宽度，始终展开 -->
  <aside class="w-64 flex-shrink-0 border-r border-border bg-background flex flex-col">
    <!-- Header -->
    <div class="border-b px-4 py-3">
      <a href="/docs/{docLocale}/" class="flex items-center gap-2 font-semibold hover:text-primary transition-colors">
        <Icon icon="mdi:book-open-page-variant" class="size-5" />
        <span>{tDoc('docs.title.documentation')}</span>
      </a>
    </div>

    <!-- Navigation -->
    <ScrollArea class="flex-1">
      <nav class="p-4 space-y-4">
        <!-- 首页链接（如果当前语言节点有 index.md） -->
        {#if localeNode?.isFile}
          <a
            href={localeNode.route}
            class="flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors {isActive(localeNode.route) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}"
          >
            <Icon icon="mdi:home-outline" class="size-4" />
            <span>{translateTitle(localeNode.meta?.title, tDoc('docs.title.home'))}</span>
          </a>
        {/if}
        
        <!-- 文档分组 -->
        {#each filteredDocsTree as group}
          <div class="space-y-1">
            <!-- 分组标题 -->
            <div class="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {translateTitle(group.meta?.title, group.name)}
            </div>
            
            <!-- 分组内容 -->
            <div class="space-y-0.5">
              {#if group.children}
                {#each group.children as item}
                  {#if item.isFile}
                    <a
                      href={item.route}
                      class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors {isActive(item.route) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}"
                    >
                      <span>{translateTitle(item.meta?.title, item.name)}</span>
                    </a>
                  {:else if item.children}
                    <!-- 子分组（如 frontend/components） -->
                    {#each item.children as subItem}
                      {#if subItem.isFile}
                        <a
                          href={subItem.route}
                          class="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors {isActive(subItem.route) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}"
                        >
                          <span>{translateTitle(subItem.meta?.title, subItem.name)}</span>
                        </a>
                      {/if}
                    {/each}
                  {/if}
                {/each}
              {/if}
            </div>
          </div>
        {/each}
      </nav>
    </ScrollArea>

    <!-- Footer - 语言选择器 -->
    <div class="border-t p-4">
      <div class="flex items-center gap-2">
        <Icon icon="mdi:translate" class="size-4 text-muted-foreground" />
        <Select.Root type="single" value={docLocale} onValueChange={handleLocaleChange}>
          <Select.Trigger class="h-8 flex-1">
            {localeOptions.find(o => o.value === docLocale)?.label || tDoc('docs.language')}
          </Select.Trigger>
          <Select.Content>
            {#each localeOptions as option}
              <Select.Item value={option.value}>{option.label}</Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  </aside>

  <!-- Content -->
  <main class="flex-1 overflow-hidden">
    <ScrollArea class="h-full">
      <div class="max-w-4xl mx-auto p-8 prose prose-slate dark:prose-invert prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent">
        {@render children()}
      </div>
    </ScrollArea>
  </main>
</div>
