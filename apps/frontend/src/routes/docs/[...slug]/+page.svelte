<script lang="ts">
  import { page } from '$app/stores';
  import { docsList } from 'virtual:svelte-docs';
  import SvelteMarkdown from 'svelte-markdown';
  import CodeBlock from '../components/CodeBlock.svelte';

  interface DocPage {
    path: string;
    route: string;
    content: string;
    meta: {
      title?: string;
      description?: string;
      order?: number;
    };
  }

  // 支持的文档语言
  const SUPPORTED_LOCALES = ['zh-CN', 'en'] as const;
  type DocLocale = (typeof SUPPORTED_LOCALES)[number];

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

  // 文档内置翻译
  const docTranslations: Record<DocLocale, Record<string, string>> = {
    'zh-CN': {
      'docs.pageNotFound': '页面未找到',
      'docs.selectFromNav': '请从左侧导航选择文档页面',
      'docs.currentPath': '当前路径',
      'docs.defaultTitle': '开发文档',
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
    },
    'en': {
      'docs.pageNotFound': 'Page Not Found',
      'docs.selectFromNav': 'Please select a document from the navigation',
      'docs.currentPath': 'Current path',
      'docs.defaultTitle': 'Documentation',
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
    },
  };

  // 当前文档语言
  let docLocale = $derived(getDocLocale($page.url.pathname));

  function tDoc(key: string, fallback?: string): string {
    const translations = docTranslations[docLocale];
    return translations[key] ?? fallback ?? key;
  }

  // 翻译标题（处理 i18n key）
  function translateTitle(title: string | undefined, fallback: string): string {
    if (!title) return fallback;
    if (title.includes('.')) {
      const translated = tDoc(title, fallback);
      return translated === title ? fallback : translated;
    }
    return title;
  }

  function findDoc(pathname: string): DocPage | undefined {
    const path = pathname.endsWith('/') ? pathname : pathname + '/';
    const pathWithoutSlash = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    return (docsList as DocPage[]).find(d => 
      d.route === path || d.route === pathWithoutSlash || d.route === pathWithoutSlash + '/'
    );
  }

  // 获取页面标题（翻译后）
  let pageTitle = $derived.by(() => {
    const doc = findDoc($page.url.pathname);
    if (doc?.meta?.title) {
      return translateTitle(doc.meta.title, tDoc('docs.defaultTitle'));
    }
    return tDoc('docs.defaultTitle');
  });

  // 自定义渲染器
  const renderers = {
    code: CodeBlock
  };
</script>

<svelte:head>
  <title>{pageTitle} - AI Drive System</title>
</svelte:head>

{#key $page.url.pathname}
  {@const doc = findDoc($page.url.pathname)}
  {#if doc}
    <SvelteMarkdown source={doc.content} {renderers} />
  {:else}
    <h1>{tDoc('docs.pageNotFound')}</h1>
    <p>{tDoc('docs.selectFromNav')}，{tDoc('docs.currentPath')}: {$page.url.pathname}</p>
  {/if}
{/key}
