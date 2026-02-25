<script lang="ts">
  import Icon from '@iconify/svelte';
  import { addCollection, loadIcons } from '@iconify/svelte';
  import * as Popover from '$lib/components/ui/popover';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import { t } from '@/lib/stores/i18n.svelte';
  import mdiIcons from '@iconify-json/mdi/icons.json';

  interface Props {
    value: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
  }

  let { value = $bindable(''), onValueChange, placeholder }: Props = $props();

  let open = $state(false);
  let search = $state('');
  let loading = $state(false);
  let initialized = $state(false);

  // 从 JSON 数据中直接获取所有图标名称
  const allIconNames = Object.keys(mdiIcons.icons);

  function initIcons() {
    if (initialized) return;
    
    loading = true;
    
    // 注册 MDI 图标集到 Iconify
    addCollection(mdiIcons);
    
    initialized = true;
    loading = false;
  }

  let filteredIcons = $derived(
    search.trim()
      ? allIconNames.filter(name => name.toLowerCase().includes(search.toLowerCase())).slice(0, 200)
      : allIconNames.slice(0, 200)
  );

  function selectIcon(name: string) {
    const newValue = `mdi:${name}`;
    value = newValue;
    onValueChange?.(newValue);
    open = false;
  }

  function clearValue() {
    value = '';
    onValueChange?.('');
  }

  $effect(() => {
    if (open && !initialized) {
      initIcons();
    }
  });

  // 预加载当前显示的图标
  $effect(() => {
    if (initialized && filteredIcons.length > 0) {
      const iconsToLoad = filteredIcons.map(name => `mdi:${name}`);
      loadIcons(iconsToLoad, () => {});
    }
  });
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    <Button variant="outline" class="w-full justify-start gap-2">
      {#if value}
        <Icon icon={value} class="size-5" />
        <span class="truncate text-sm">{value}</span>
      {:else}
        <Icon icon="mdi:image-outline" class="size-5 text-muted-foreground" />
        <span class="text-muted-foreground">{placeholder || t('common.fields.icon')}</span>
      {/if}
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-80 p-0" align="start">
    <div class="p-3 border-b">
      <Input
        bind:value={search}
        placeholder={t('common.tips.searchPlaceholder')}
        class="h-8"
      />
    </div>
    <ScrollArea class="h-64">
      {#if loading}
        <div class="grid grid-cols-8 gap-1 p-3">
          {#each Array(40) as _}
            <Skeleton class="size-8" />
          {/each}
        </div>
      {:else if filteredIcons.length === 0}
        <div class="flex items-center justify-center h-32 text-muted-foreground text-sm">
          {t('common.tips.noData')}
        </div>
      {:else}
        <div class="grid grid-cols-8 gap-1 p-3">
          {#each filteredIcons as name}
            {@const iconValue = `mdi:${name}`}
            <button
              class="size-8 flex items-center justify-center rounded hover:bg-accent transition-colors {value === iconValue ? 'bg-primary/10 ring-1 ring-primary' : ''}"
              title={name}
              onclick={() => selectIcon(name)}
            >
              <Icon icon={iconValue} class="size-5" />
            </button>
          {/each}
        </div>
      {/if}
    </ScrollArea>
    {#if value}
      <div class="p-2 border-t flex items-center justify-between">
        <span class="text-xs text-muted-foreground truncate">{value}</span>
        <Button
          size="sm"
          variant="ghost"
          class="h-6 px-2 text-xs"
          onclick={clearValue}
        >
          {t('common.actions.clear')}
        </Button>
      </div>
    {/if}
  </Popover.Content>
</Popover.Root>
