<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Button } from '@/lib/components/ui/button';
  import { Label } from '@/lib/components/ui/label';
  import { Separator } from '@/lib/components/ui/separator';
  import { ScrollArea } from '@/lib/components/ui/scroll-area';
  import * as Select from '@/lib/components/ui/select';
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
  import { i18n } from '@/lib/stores/i18n.svelte';

  const themeOptions: { value: ThemeMode; label: string; icon: string }[] = [
    { value: 'light', label: '浅色模式', icon: 'tdesign:sunny' },
    { value: 'dark', label: '深色模式', icon: 'tdesign:moon' },
  ];

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
    i18n.setLocale(language);
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
    i18n.setLocale('zh-CN');
  }

  let currentMode = $derived(mode.current);
</script>

<ScrollArea class="flex-1 h-full">
<div class="max-w-2xl px-4 lg:px-6 py-4 space-y-6">
  <!-- 主题模式 -->
  <div class="space-y-3">
    <div>
      <Label class="text-base">主题模式</Label>
      <p class="text-sm text-muted-foreground">选择浅色或深色主题</p>
    </div>
    <div class="flex gap-2">
      {#each themeOptions as option}
        <button
          class="flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors hover:bg-muted {currentMode === option.value ? 'border-primary bg-primary/5' : ''}"
          onclick={() => handleThemeChange(option.value)}
        >
          <Icon icon={option.icon} class="size-5" />
          <span class="text-sm">{option.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <Separator />

  <!-- 主题色 -->
  <div class="space-y-3">
    <div>
      <Label class="text-base">主题色</Label>
      <p class="text-sm text-muted-foreground">当前: {THEME_COLORS[preferencesStore.themeColor].label}</p>
    </div>
    <div class="flex flex-wrap gap-3">
      {#each Object.entries(THEME_COLORS) as [key, config]}
        <button
          class="group relative size-10 rounded-full border-2 transition-all hover:scale-110 {preferencesStore.themeColor === key ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}"
          style="background-color: {config.preview}"
          title={config.label}
          onclick={() => handleColorChange(key as ThemeColor)}
        >
          {#if preferencesStore.themeColor === key}
            <Icon icon="tdesign:check" class="absolute inset-0 m-auto size-5 text-white" />
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <Separator />

  <!-- 圆角大小 -->
  <div class="space-y-3">
    <div>
      <Label class="text-base">圆角大小</Label>
      <p class="text-sm text-muted-foreground">调整界面元素的圆角</p>
    </div>
    <div class="flex flex-wrap gap-2">
      {#each RADIUS_OPTIONS as opt}
        <button
          class="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted {preferencesStore.radius === opt.value ? 'border-primary bg-primary/5' : ''}"
          onclick={() => handleRadiusChange(opt.value)}
        >
          <div 
            class="size-4 bg-primary" 
            style="border-radius: {opt.value * 0.5}rem"
          ></div>
          <span>{opt.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <Separator />

  <!-- 字体大小 -->
  <div class="space-y-3">
    <div>
      <Label class="text-base">字体大小</Label>
      <p class="text-sm text-muted-foreground">调整界面文字大小</p>
    </div>
    <div class="flex flex-wrap gap-2">
      {#each FONT_SIZE_OPTIONS as opt}
        <button
          class="flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors hover:bg-muted {preferencesStore.fontSize === opt.value ? 'border-primary bg-primary/5' : ''}"
          onclick={() => handleFontSizeChange(opt.value)}
        >
          <span style="font-size: {opt.value}px">Aa</span>
          <span class="text-sm">{opt.label}</span>
        </button>
      {/each}
    </div>
    <p class="text-muted-foreground" style="font-size: {preferencesStore.fontSize}px">
      预览文字效果：这是一段示例文字。
    </p>
  </div>

  <Separator />

  <!-- 语言设置 -->
  <div class="space-y-3">
    <div>
      <Label class="text-base">界面语言</Label>
      <p class="text-sm text-muted-foreground">选择界面显示语言</p>
    </div>
    <Select.Root type="single" value={preferencesStore.language} onValueChange={(v) => handleLanguageChange(v as Language)}>
      <Select.Trigger class="w-48">
        {languageOptions.find(o => o.value === preferencesStore.language)?.label || '选择语言'}
      </Select.Trigger>
      <Select.Content>
        {#each languageOptions as option}
          <Select.Item value={option.value}>{option.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
  </div>

  <Separator />

  <!-- 恢复默认 -->
  <div class="space-y-3">
    <div>
      <Label class="text-base">恢复默认</Label>
      <p class="text-sm text-muted-foreground">重置所有个性化配置</p>
    </div>
    <Button variant="outline" onclick={handleReset}>
      <Icon icon="tdesign:refresh" class="mr-2 size-4" />
      恢复默认设置
    </Button>
  </div>
</div>
</ScrollArea>
