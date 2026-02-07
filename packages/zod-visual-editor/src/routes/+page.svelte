<script lang="ts">
  import { ZodVisualEditor, type RootSchema } from '$lib/index.js';
  import { examples } from '$lib/examples.js';
  import { createI18n, addResources, defaultResources, changeLanguage } from '@qiyu-allinai/i18n';
  import Icon from '@iconify/svelte';

  type ExampleKey = keyof typeof examples;
  type Language = 'zh-CN' | 'en';

  const exampleKeys: ExampleKey[] = ['apiResponse', 'eventSystem', 'organization', 'config'];
  const exampleLabels: Record<ExampleKey, string> = {
    apiResponse: 'API 响应 (Array<User{ Orders{ Products } }>)',
    eventSystem: '事件系统 (Union Payload)',
    organization: '组织架构 (Dept→Team→Member→Skill)',
    config: '插件配置 (Union Config)',
  };

  const languageLabels: Record<Language, string> = {
    'zh-CN': '中文',
    'en': 'English',
  };

  // 创建 i18n 实例
  const i18n = createI18n({ lng: 'zh-CN', defaultNS: 'schemaEditor', ns: ['common', 'schemaEditor'] });
  addResources(i18n, defaultResources);

  let schema = $state<RootSchema>(examples.apiResponse);
  let currentExample = $state<ExampleKey>('apiResponse');
  let currentLang = $state<Language>('zh-CN');

  // 翻译函数 - 将 schemaEditor.xxx.yyy 转换为 schemaEditor:xxx.yyy 格式
  function t(key: string, fallback?: string): string {
    // 将 namespace.key 格式转换为 namespace:key (i18next namespace 格式)
    // 例如: schemaEditor.types.string -> schemaEditor:types.string
    const nsKey = key.replace(/^(schemaEditor|common|error|validation|db)\./, '$1:');
    return i18n.t(nsKey, { defaultValue: fallback ?? key });
  }

  // 强制更新翻译的 key
  let langKey = $state(0);

  function handleSchemaChange(newSchema: RootSchema) {
    schema = newSchema;
    console.log('Schema changed:', JSON.stringify(schema, null, 2));
  }

  function loadExample(key: ExampleKey) {
    currentExample = key;
    schema = examples[key];
  }

  async function switchLanguage(lang: Language) {
    await changeLanguage(i18n, lang);
    currentLang = lang;
    langKey++; // 触发重新渲染
  }
</script>

<div class="min-h-screen bg-background p-8">
  <div class="max-w-4xl mx-auto">
    <div class="mb-6">
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-3xl font-bold">Zod Visual Editor</h1>
        <div class="flex items-center gap-2">
          <Icon icon="mdi:translate" class="size-5 text-muted-foreground" />
          {#each (['zh-CN', 'en'] as Language[]) as lang}
            <button
              class="px-3 py-1 text-sm rounded-md transition-colors {currentLang === lang ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}"
              onclick={() => switchLanguage(lang)}
            >
              {languageLabels[lang]}
            </button>
          {/each}
        </div>
      </div>
      <p class="text-muted-foreground mb-4">
        可视化 Schema 编辑器，支持 String/Number/Boolean/Literal/Enum/Array/Union/Object 类型
      </p>
      <div class="flex flex-wrap gap-2">
        {#each exampleKeys as key}
          <button
            class="px-3 py-1.5 text-sm rounded-md transition-colors {currentExample === key ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}"
            onclick={() => loadExample(key)}
          >
            {exampleLabels[key]}
          </button>
        {/each}
      </div>
    </div>

    {#key langKey}
      <ZodVisualEditor
        bind:schema
        onSchemaChange={handleSchemaChange}
        height="500px"
        {t}
      />
    {/key}

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-2">Schema JSON</h2>
      <pre class="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-64">{JSON.stringify(schema, null, 2)}</pre>
    </div>
  </div>
</div>
