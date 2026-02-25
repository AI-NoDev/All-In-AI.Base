<script lang="ts" module>
  import type { Snapshot } from './$types';

  interface AIProvider {
    id: string;
    name: string;
  }

  interface AIModel {
    id: string;
    name: string;
    modelId: string;
    providerId: string;
  }

  interface PageSnapshot {
    providers: AIProvider[];
    models: AIModel[];
    modelsLoaded: boolean;
  }

  let pageState: PageSnapshot = {
    providers: [],
    models: [],
    modelsLoaded: false
  };
  let restoreCallback: ((value: PageSnapshot) => void) | null = null;

  export const snapshot: Snapshot<PageSnapshot> = {
    capture: () => pageState,
    restore: (value) => {
      pageState = value;
      if (restoreCallback) restoreCallback(value);
    }
  };
</script>

<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '$lib/components/ui/button';
  import { Label } from '$lib/components/ui/label';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import * as Select from '$lib/components/ui/select';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as Card from '$lib/components/ui/card';
  import { setMode, mode } from 'mode-watcher';
  import { 
    preferencesStore, 
    THEME_COLORS, 
    RADIUS_OPTIONS,
    FONT_SIZE_OPTIONS,
    type ThemeMode,
    type ThemeColor,
    type Language
  } from '@/lib/stores/preferences.svelte';
  import { i18n, t } from '@/lib/stores/i18n.svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { onMount } from 'svelte';

  // AI 模型数据
  let providers = $state<AIProvider[]>(pageState.providers);
  let models = $state<AIModel[]>(pageState.models);
  let loadingModels = $state(!pageState.modelsLoaded);
  let snapshotRestored = $state(pageState.modelsLoaded);

  restoreCallback = (value) => {
    providers = value.providers;
    models = value.models;
    snapshotRestored = value.modelsLoaded;
    loadingModels = !value.modelsLoaded;
  };

  $effect(() => {
    pageState = { providers, models, modelsLoaded: !loadingModels };
  });

  // 模型选择 Dialog 状态
  let modelDialogOpen = $state(false);
  let modelDialogType = $state<'text' | 'image' | 'object'>('text');
  let selectedProviderIdInDialog = $state<string | null>(null);

  // 当前 Provider 下的模型
  let modelsInProvider = $derived(
    selectedProviderIdInDialog 
      ? models.filter(m => m.providerId === selectedProviderIdInDialog)
      : []
  );

  // 获取模型名称
  function getModelName(modelId: string | null): string {
    if (!modelId) return t('page.preferences.notConfigured');
    const model = models.find(m => m.id === modelId);
    return model?.name || t('page.preferences.notConfigured');
  }

  // 加载 Provider 和 Model 数据
  async function loadProvidersAndModels() {
    loadingModels = true;
    try {
      const api = authStore.createApi(true);
      const providerRes = await api.ai.postApiAiProviderQuery({
        filter: { status: '0' },
        limit: 100,
        offset: 0,
      });
      if (providerRes.data?.data) {
        providers = providerRes.data.data.map((p: { id: string; name: string }) => ({
          id: p.id,
          name: p.name,
        }));
      }
      const modelRes = await api.ai.postApiAiModelQuery({
        filter: { status: '0' },
        limit: 100,
        offset: 0,
      });
      if (modelRes.data?.data) {
        models = modelRes.data.data.map((m: { id: string; name: string; modelId: string; providerId: string }) => ({
          id: m.id,
          name: m.name,
          modelId: m.modelId,
          providerId: m.providerId,
        }));
      }
    } catch (e) {
      console.error('Failed to load providers and models:', e);
    } finally {
      loadingModels = false;
    }
  }

  function openModelDialog(type: 'text' | 'image' | 'object') {
    modelDialogType = type;
    modelDialogOpen = true;
    let currentModelId: string | null = null;
    if (type === 'text') currentModelId = preferencesStore.defaultTextModelId;
    else if (type === 'image') currentModelId = preferencesStore.defaultImageModelId;
    else currentModelId = preferencesStore.defaultObjectModelId;
    if (currentModelId) {
      const model = models.find(m => m.id === currentModelId);
      if (model) {
        selectedProviderIdInDialog = model.providerId;
        return;
      }
    }
    if (providers.length > 0) {
      selectedProviderIdInDialog = providers[0].id;
    }
  }

  function selectModel(modelId: string) {
    if (modelDialogType === 'text') preferencesStore.setDefaultTextModelId(modelId);
    else if (modelDialogType === 'image') preferencesStore.setDefaultImageModelId(modelId);
    else preferencesStore.setDefaultObjectModelId(modelId);
    modelDialogOpen = false;
  }

  function clearModel(type: 'text' | 'image' | 'object') {
    if (type === 'text') preferencesStore.setDefaultTextModelId(null);
    else if (type === 'image') preferencesStore.setDefaultImageModelId(null);
    else preferencesStore.setDefaultObjectModelId(null);
  }

  let currentSelectedModelId = $derived(() => {
    if (modelDialogType === 'text') return preferencesStore.defaultTextModelId;
    if (modelDialogType === 'image') return preferencesStore.defaultImageModelId;
    return preferencesStore.defaultObjectModelId;
  });

  onMount(() => {
    if (!snapshotRestored) {
      loadProvidersAndModels();
    }
  });

  let _ = $derived(i18n.version);

  let colorLabels = $derived({
    slate: t('page.preferences.color_slate'),
    zinc: t('page.preferences.color_zinc'),
    neutral: t('page.preferences.color_neutral'),
    stone: t('page.preferences.color_stone'),
    blue: t('page.preferences.color_blue'),
    green: t('page.preferences.color_green'),
    violet: t('page.preferences.color_violet'),
    orange: t('page.preferences.color_orange'),
    rose: t('page.preferences.color_rose'),
  } as Record<ThemeColor, string>);

  let radiusLabels = $derived({
    0: t('page.preferences.radius_none'),
    0.3: t('page.preferences.radius_small'),
    0.5: t('page.preferences.radius_medium'),
    0.75: t('page.preferences.radius_large'),
    1: t('page.preferences.radius_xlarge'),
  } as Record<number, string>);

  let fontSizeLabels = $derived({
    12: t('page.preferences.fontSize_small'),
    14: t('page.preferences.fontSize_standard'),
    16: t('page.preferences.fontSize_large'),
    18: t('page.preferences.fontSize_xlarge'),
  } as Record<number, string>);

  let themeOptions = $derived([
    { value: 'light' as ThemeMode, label: t('page.preferences.themeLight'), icon: 'tdesign:sunny' },
    { value: 'dark' as ThemeMode, label: t('page.preferences.themeDark'), icon: 'tdesign:moon' },
  ]);

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'zh-CN', label: '简体中文' },
    { value: 'en', label: 'English' },
  ];

  function handleThemeChange(theme: ThemeMode) {
    preferencesStore.setTheme(theme);
    setMode(theme);
  }

  function handleColorChange(color: ThemeColor) {
    preferencesStore.setThemeColor(color);
  }

  function handleLanguageChange(language: Language) {
    preferencesStore.setLanguage(language);
    i18n.setLocale(language === 'zh-CN' ? 'zh-Hans' : 'en');
  }

  function handleRadiusChange(value: number) {
    preferencesStore.setRadius(value);
  }

  function handleFontSizeChange(value: number) {
    preferencesStore.setFontSize(value);
  }

  function handleReset() {
    preferencesStore.reset();
    setMode('light');
    i18n.setLocale('zh-Hans');
  }

  let currentMode = $derived(mode.current);
</script>

<ScrollArea class="flex-1 h-full">
{#key _}
<div class="p-6">
  <!-- 页面标题 -->
  <div class="mb-6">
    <h1 class="text-2xl font-semibold">{t('page.preferences.title')}</h1>
  </div>

  <!-- 两列布局 -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- 左列 -->
    <div class="flex flex-col gap-6">
      <!-- 外观设置卡片 -->
      <Card.Root>
        <Card.Header class="pb-4">
          <Card.Title class="flex items-center gap-2 text-base">
            <Icon icon="tdesign:palette" class="size-5" />
            {t('page.preferences.themeMode')}
          </Card.Title>
          <Card.Description>{t('page.preferences.themeModeDesc')}</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-4">
          <!-- 主题模式 -->
          <div class="flex gap-2">
            {#each themeOptions as option}
              <button
                class="flex-1 flex items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-colors hover:bg-muted {currentMode === option.value ? 'border-primary bg-primary/5' : ''}"
                onclick={() => handleThemeChange(option.value)}
              >
                <Icon icon={option.icon} class="size-5" />
                <span class="text-sm font-medium">{option.label}</span>
              </button>
            {/each}
          </div>
        </Card.Content>
      </Card.Root>

      <!-- 主题色卡片 -->
      <Card.Root>
        <Card.Header class="pb-4">
          <Card.Title class="flex items-center gap-2 text-base">
            <Icon icon="tdesign:color" class="size-5" />
            {t('page.preferences.themeColor')}
          </Card.Title>
          <Card.Description>{t('page.preferences.themeColorCurrent')}: {colorLabels[preferencesStore.themeColor]}</Card.Description>
        </Card.Header>
        <Card.Content>
          <div class="flex flex-wrap gap-3">
            {#each Object.entries(THEME_COLORS) as [key, config]}
              <button
                class="group relative size-9 rounded-full border-2 transition-all hover:scale-110 {preferencesStore.themeColor === key ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}"
                style="background-color: {config.preview}"
                title={colorLabels[key as ThemeColor]}
                onclick={() => handleColorChange(key as ThemeColor)}
              >
                {#if preferencesStore.themeColor === key}
                  <Icon icon="tdesign:check" class="absolute inset-0 m-auto size-4 text-white" />
                {/if}
              </button>
            {/each}
          </div>
        </Card.Content>
      </Card.Root>

      <!-- 圆角和字体卡片 -->
      <Card.Root class="flex-1">
        <Card.Header class="pb-4">
          <Card.Title class="flex items-center gap-2 text-base">
            <Icon icon="tdesign:adjustment" class="size-5" />
            {t('page.preferences.radius')} & {t('page.preferences.fontSize')}
          </Card.Title>
        </Card.Header>
        <Card.Content class="space-y-5">
          <!-- 圆角大小 -->
          <div class="space-y-2">
            <Label class="text-sm text-muted-foreground">{t('page.preferences.radius')}</Label>
            <div class="flex flex-wrap gap-2">
              {#each RADIUS_OPTIONS as opt}
                <button
                  class="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-muted {preferencesStore.radius === opt.value ? 'border-primary bg-primary/5' : ''}"
                  onclick={() => handleRadiusChange(opt.value)}
                >
                  <div class="size-3 bg-primary" style="border-radius: {opt.value * 0.5}rem"></div>
                  <span>{radiusLabels[opt.value]}</span>
                </button>
              {/each}
            </div>
          </div>
          <!-- 字体大小 -->
          <div class="space-y-2">
            <Label class="text-sm text-muted-foreground">{t('page.preferences.fontSize')}</Label>
            <div class="flex flex-wrap gap-2">
              {#each FONT_SIZE_OPTIONS as opt}
                <button
                  class="flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors hover:bg-muted {preferencesStore.fontSize === opt.value ? 'border-primary bg-primary/5' : ''}"
                  onclick={() => handleFontSizeChange(opt.value)}
                >
                  <span style="font-size: {opt.value}px" class="w-6 text-center shrink-0 leading-none">Aa</span>
                  <span class="text-sm whitespace-nowrap">{fontSizeLabels[opt.value]}</span>
                </button>
              {/each}
            </div>
            <p class="text-muted-foreground pt-1" style="font-size: {preferencesStore.fontSize}px">
              {t('page.preferences.fontSizePreview')}
            </p>
          </div>
        </Card.Content>
      </Card.Root>
    </div>

    <!-- 右列 -->
    <div class="flex flex-col gap-6">
      <!-- 语言设置卡片 -->
      <Card.Root>
        <Card.Header class="pb-4">
          <Card.Title class="flex items-center gap-2 text-base">
            <Icon icon="tdesign:translate" class="size-5" />
            {t('page.preferences.languageTitle')}
          </Card.Title>
          <Card.Description>{t('page.preferences.languageDesc')}</Card.Description>
        </Card.Header>
        <Card.Content>
          <Select.Root type="single" value={preferencesStore.language} onValueChange={(v) => handleLanguageChange(v as Language)}>
            <Select.Trigger class="w-full">
              {languageOptions.find(o => o.value === preferencesStore.language)?.label || t('page.preferences.selectLanguage')}
            </Select.Trigger>
            <Select.Content>
              {#each languageOptions as option}
                <Select.Item value={option.value}>{option.label}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </Card.Content>
      </Card.Root>

      <!-- AI 模型配置卡片 -->
      <Card.Root class="flex-1">
        <Card.Header class="pb-4">
          <Card.Title class="flex items-center gap-2 text-base">
            <Icon icon="tdesign:cpu" class="size-5" />
            {t('page.preferences.aiModels')}
          </Card.Title>
          <Card.Description>{t('page.preferences.aiModelsDesc')}</Card.Description>
        </Card.Header>
        <Card.Content class="space-y-3">
          <!-- 默认文本模型 -->
          <div class="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Icon icon="mdi:text" class="size-5 text-blue-500" />
              </div>
              <div>
                <div class="text-sm font-medium">{t('page.preferences.defaultTextModel')}</div>
                <div class="text-xs text-muted-foreground">{t('page.preferences.defaultTextModelDesc')}</div>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="sm" onclick={() => openModelDialog('text')} disabled={loadingModels} class="h-8">
                <span class="max-w-[100px] truncate text-xs">{getModelName(preferencesStore.defaultTextModelId)}</span>
                <Icon icon="mdi:chevron-right" class="size-4 ml-1" />
              </Button>
              {#if preferencesStore.defaultTextModelId}
                <Button variant="ghost" size="icon" class="size-8" onclick={() => clearModel('text')}>
                  <Icon icon="mdi:close" class="size-4" />
                </Button>
              {/if}
            </div>
          </div>

          <!-- 默认图像模型 -->
          <div class="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Icon icon="mdi:image" class="size-5 text-purple-500" />
              </div>
              <div>
                <div class="text-sm font-medium">{t('page.preferences.defaultImageModel')}</div>
                <div class="text-xs text-muted-foreground">{t('page.preferences.defaultImageModelDesc')}</div>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="sm" onclick={() => openModelDialog('image')} disabled={loadingModels} class="h-8">
                <span class="max-w-[100px] truncate text-xs">{getModelName(preferencesStore.defaultImageModelId)}</span>
                <Icon icon="mdi:chevron-right" class="size-4 ml-1" />
              </Button>
              {#if preferencesStore.defaultImageModelId}
                <Button variant="ghost" size="icon" class="size-8" onclick={() => clearModel('image')}>
                  <Icon icon="mdi:close" class="size-4" />
                </Button>
              {/if}
            </div>
          </div>

          <!-- 默认对象模型 -->
          <div class="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div class="flex items-center gap-3">
              <div class="size-9 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Icon icon="mdi:code-json" class="size-5 text-green-500" />
              </div>
              <div>
                <div class="text-sm font-medium">{t('page.preferences.defaultObjectModel')}</div>
                <div class="text-xs text-muted-foreground">{t('page.preferences.defaultObjectModelDesc')}</div>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <Button variant="ghost" size="sm" onclick={() => openModelDialog('object')} disabled={loadingModels} class="h-8">
                <span class="max-w-[100px] truncate text-xs">{getModelName(preferencesStore.defaultObjectModelId)}</span>
                <Icon icon="mdi:chevron-right" class="size-4 ml-1" />
              </Button>
              {#if preferencesStore.defaultObjectModelId}
                <Button variant="ghost" size="icon" class="size-8" onclick={() => clearModel('object')}>
                  <Icon icon="mdi:close" class="size-4" />
                </Button>
              {/if}
            </div>
          </div>
        </Card.Content>
      </Card.Root>

      <!-- 恢复默认卡片 -->
      <Card.Root>
        <Card.Header class="pb-4">
          <Card.Title class="flex items-center gap-2 text-base">
            <Icon icon="tdesign:refresh" class="size-5" />
            {t('page.preferences.resetDefault')}
          </Card.Title>
          <Card.Description>{t('page.preferences.resetDefaultDesc')}</Card.Description>
        </Card.Header>
        <Card.Content>
          <Button variant="outline" onclick={handleReset} class="w-full">
            <Icon icon="tdesign:refresh" class="mr-2 size-4" />
            {t('page.preferences.resetButton')}
          </Button>
        </Card.Content>
      </Card.Root>
    </div>
  </div>
</div>
{/key}
</ScrollArea>

<!-- 模型选择 Dialog -->
<Dialog.Root bind:open={modelDialogOpen}>
  <Dialog.Content class="sm:max-w-2xl" interactOutsideBehavior="ignore">
    <Dialog.Header>
      <Dialog.Title>{t('page.preferences.selectModel')}</Dialog.Title>
    </Dialog.Header>
    
    <div class="flex gap-4 h-[400px]">
      <!-- 左侧：Provider 列表 -->
      <div class="w-40 shrink-0 border-r pr-4">
        <div class="text-xs text-muted-foreground mb-2">Provider</div>
        <ScrollArea class="h-[360px]">
          <div class="space-y-1">
            {#each providers as provider}
              <button
                class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors {selectedProviderIdInDialog === provider.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}"
                onclick={() => selectedProviderIdInDialog = provider.id}
              >
                {provider.name}
              </button>
            {/each}
          </div>
        </ScrollArea>
      </div>

      <!-- 右侧：Model 列表 -->
      <div class="flex-1 min-w-0">
        <div class="text-xs text-muted-foreground mb-2">Model</div>
        <ScrollArea class="h-[360px]">
          <div class="space-y-1 p-1">
            {#if modelsInProvider.length === 0}
              <div class="flex items-center justify-center h-32 text-muted-foreground text-sm">
                暂无模型
              </div>
            {:else}
              {#each modelsInProvider as model}
                <button
                  class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between {currentSelectedModelId() === model.id ? 'bg-muted ring-1 ring-primary' : 'hover:bg-muted'}"
                  onclick={() => selectModel(model.id)}
                >
                  <span class="truncate">{model.name}</span>
                  {#if currentSelectedModelId() === model.id}
                    <Icon icon="mdi:check" class="size-4 text-primary shrink-0" />
                  {/if}
                </button>
              {/each}
            {/if}
          </div>
        </ScrollArea>
      </div>
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => modelDialogOpen = false}>{t('common.cancel')}</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
