<script lang="ts">
  import SvelteMarkdown from 'svelte-markdown';
  import CodeBlock from '../docs/components/CodeBlock.svelte';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Button } from '$lib/components/ui/button';
  import Icon from '@iconify/svelte';
  import readmeEn from '../../../../../README.md?raw';
  import readmeZh from '../../../../../README-zh.md?raw';
  import logoImage from '$lib/assets/logo.png';

  let currentLang = $state<'en' | 'zh'>('en');

  // 处理内容中的图片路径
  function processContent(content: string): string {
    return content.replace(
      /src="apps\/frontend\/src\/lib\/assets\/logo\.png"/g,
      `src="${logoImage}"`
    );
  }

  let processedContent = $derived(processContent(currentLang === 'en' ? readmeEn : readmeZh));

  function toggleLang() {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
  }
</script>

<div class="relative h-[calc(100vh-4rem)]">
  <!-- 语言切换按钮 - 绝对定位 -->
  <Button variant="outline" size="sm" class="absolute top-4 right-8 z-10" onclick={toggleLang}>
    <Icon icon="mdi:translate" class="size-4 mr-2" />
    {currentLang === 'en' ? '中文' : 'English'}
  </Button>
  
  <ScrollArea class="h-full">
    <div class="max-w-4xl mx-auto p-8 prose prose-slate dark:prose-invert prose-code:before:content-none prose-code:after:content-none prose-pre:p-0 prose-pre:bg-transparent">
      <SvelteMarkdown source={processedContent} renderers={{ code: CodeBlock }} />
    </div>
  </ScrollArea>
</div>
