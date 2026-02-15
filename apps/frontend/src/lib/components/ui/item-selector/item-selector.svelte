<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Input } from '../input/index.js';
  import { Checkbox } from '../checkbox/index.js';
  import { ScrollArea } from '../scroll-area/index.js';
  import { Button } from '../button/index.js';
  import { Badge } from '../badge/index.js';

  interface Item {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    disabled?: boolean;
    badge?: string;
    badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
    [key: string]: unknown;
  }

  interface Props {
    items: Item[];
    selected: string | string[];
    mode?: 'single' | 'multiple';
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    showSelectAll?: boolean;
    maxHeight?: string;
    onSelect?: (selected: string | string[]) => void;
  }

  let {
    items,
    selected = $bindable(),
    mode = 'multiple',
    placeholder = '请选择',
    searchPlaceholder = '搜索...',
    emptyText = '暂无数据',
    showSelectAll = true,
    maxHeight = '300px',
    onSelect,
  }: Props = $props();

  let searchQuery = $state('');

  // 转换 selected 为 Set 便于操作
  let selectedSet = $derived.by(() => {
    if (mode === 'single') {
      return new Set(selected ? [selected as string] : []);
    }
    return new Set(Array.isArray(selected) ? selected : []);
  });

  // 过滤后的项目
  let filteredItems = $derived.by(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.label.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  });

  // 可选择的项目（排除 disabled）
  let selectableItems = $derived(filteredItems.filter(item => !item.disabled));

  // 是否全选
  let allSelected = $derived(
    selectableItems.length > 0 && selectableItems.every(item => selectedSet.has(item.id))
  );
  let someSelected = $derived(
    selectableItems.some(item => selectedSet.has(item.id)) && !allSelected
  );

  function toggleItem(id: string) {
    const item = items.find(i => i.id === id);
    if (item?.disabled) return;

    if (mode === 'single') {
      selected = id;
      onSelect?.(id);
    } else {
      const newSet = new Set(selectedSet);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      const newSelected = Array.from(newSet);
      selected = newSelected;
      onSelect?.(newSelected);
    }
  }

  function selectAll() {
    if (mode === 'single') return;
    const newSelected = selectableItems.map(item => item.id);
    selected = newSelected;
    onSelect?.(newSelected);
  }

  function deselectAll() {
    if (mode === 'single') {
      selected = '';
      onSelect?.('');
    } else {
      selected = [];
      onSelect?.([]);
    }
  }

  function isSelected(id: string): boolean {
    return selectedSet.has(id);
  }
</script>

<div class="flex flex-col gap-3">
  <!-- 搜索框 -->
  <div class="relative">
    <Icon icon="tdesign:search" class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
    <Input 
      bind:value={searchQuery}
      placeholder={searchPlaceholder}
      class="pl-9"
    />
    {#if searchQuery}
      <button 
        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onclick={() => searchQuery = ''}
      >
        <Icon icon="tdesign:close" class="size-4" />
      </button>
    {/if}
  </div>

  <!-- 操作栏 -->
  {#if mode === 'multiple' && showSelectAll}
    <div class="flex items-center justify-between">
      <div class="flex gap-2">
        <Button size="sm" variant="outline" onclick={selectAll} disabled={selectableItems.length === 0}>
          全选
        </Button>
        <Button size="sm" variant="outline" onclick={deselectAll} disabled={selectedSet.size === 0}>
          取消全选
        </Button>
      </div>
      <span class="text-sm text-muted-foreground">
        已选 {selectedSet.size} / {items.length}
      </span>
    </div>
  {/if}

  <!-- 列表 -->
  <ScrollArea class="border rounded-md" style="height: {maxHeight}">
    <div class="p-1">
      {#each filteredItems as item (item.id)}
        <button
          type="button"
          class="w-full flex items-center gap-3 p-2.5 rounded-md text-left transition-colors
            {isSelected(item.id) ? 'bg-primary/10' : 'hover:bg-muted/50'}
            {item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
          onclick={() => toggleItem(item.id)}
          disabled={item.disabled}
        >
          {#if mode === 'multiple'}
            <Checkbox 
              checked={isSelected(item.id)}
              disabled={item.disabled}
              class="pointer-events-none"
            />
          {:else}
            <div class="size-4 rounded-full border-2 flex items-center justify-center
              {isSelected(item.id) ? 'border-primary bg-primary' : 'border-muted-foreground'}">
              {#if isSelected(item.id)}
                <div class="size-2 rounded-full bg-white"></div>
              {/if}
            </div>
          {/if}

          {#if item.icon}
            <Icon icon={item.icon} class="size-4 text-muted-foreground flex-shrink-0" />
          {/if}

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium truncate">{item.label}</span>
              {#if item.badge}
                <Badge variant={item.badgeVariant || 'secondary'} class="text-xs">
                  {item.badge}
                </Badge>
              {/if}
            </div>
            {#if item.description}
              <div class="text-xs text-muted-foreground truncate">{item.description}</div>
            {/if}
          </div>

          {#if isSelected(item.id)}
            <Icon icon="tdesign:check" class="size-4 text-primary flex-shrink-0" />
          {/if}
        </button>
      {:else}
        <div class="py-8 text-center text-muted-foreground">
          {#if searchQuery}
            <Icon icon="tdesign:search-error" class="size-8 mx-auto mb-2 opacity-50" />
            <p>未找到匹配 "{searchQuery}" 的结果</p>
          {:else}
            <Icon icon="tdesign:inbox" class="size-8 mx-auto mb-2 opacity-50" />
            <p>{emptyText}</p>
          {/if}
        </div>
      {/each}
    </div>
  </ScrollArea>
</div>
