<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Input } from '../input/index.js';
  import { Checkbox } from '../checkbox/index.js';
  import { ScrollArea } from '../scroll-area/index.js';
  import { Button } from '../button/index.js';
  import { Badge } from '../badge/index.js';

  interface TreeItem {
    id: string;
    label: string;
    parentId?: string | null;
    description?: string;
    icon?: string;
    disabled?: boolean;
    badge?: string;
    badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  }

  interface TreeNode extends TreeItem {
    children: TreeNode[];
    expanded: boolean;
    level: number;
  }

  interface Props {
    items: TreeItem[];
    selected: string | string[];
    mode?: 'single' | 'multiple';
    searchPlaceholder?: string;
    emptyText?: string;
    showSelectAll?: boolean;
    maxHeight?: string;
    defaultExpanded?: boolean;
    onSelect?: (selected: string | string[]) => void;
  }

  let {
    items,
    selected = $bindable(),
    mode = 'multiple',
    searchPlaceholder = '搜索...',
    emptyText = '暂无数据',
    showSelectAll = true,
    maxHeight = '400px',
    defaultExpanded = true,
    onSelect,
  }: Props = $props();

  let searchQuery = $state('');
  let expandedIds = $state<Set<string>>(new Set());
  let initialized = $state(false);

  // 构建树形结构（纯函数，不修改状态）
  function buildTree(flatItems: TreeItem[]): TreeNode[] {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];
    
    flatItems.forEach(item => {
      map.set(item.id, { ...item, children: [], expanded: true, level: 0 });
    });
    
    flatItems.forEach(item => {
      const node = map.get(item.id)!;
      if (item.parentId && map.has(item.parentId)) {
        const parent = map.get(item.parentId)!;
        node.level = parent.level + 1;
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });
    
    return roots;
  }

  // 扁平化树（用于显示）
  function flattenTree(nodes: TreeNode[], expandedSet: Set<string>): TreeNode[] {
    const result: TreeNode[] = [];
    const traverse = (items: TreeNode[]) => {
      for (const node of items) {
        result.push(node);
        if (expandedSet.has(node.id) && node.children.length > 0) {
          traverse(node.children);
        }
      }
    };
    traverse(nodes);
    return result;
  }

  // 获取所有节点ID（用于初始化展开状态）
  function getAllNodeIds(nodes: TreeNode[]): string[] {
    const ids: string[] = [];
    const traverse = (items: TreeNode[]) => {
      for (const item of items) {
        ids.push(item.id);
        if (item.children.length > 0) {
          traverse(item.children);
        }
      }
    };
    traverse(nodes);
    return ids;
  }

  // 获取所有可选节点ID
  function getSelectableIds(flatItems: TreeItem[]): string[] {
    return flatItems.filter(i => !i.disabled).map(i => i.id);
  }

  // 树形数据（派生）
  let treeData = $derived(buildTree(items));

  // 初始化展开状态
  $effect(() => {
    if (items.length > 0 && !initialized) {
      if (defaultExpanded) {
        expandedIds = new Set(getAllNodeIds(treeData));
      }
      initialized = true;
    }
  });

  // 当 items 变化时重置
  let prevItemsLength = $state(0);
  $effect(() => {
    if (items.length !== prevItemsLength) {
      prevItemsLength = items.length;
      if (items.length > 0 && defaultExpanded) {
        expandedIds = new Set(getAllNodeIds(buildTree(items)));
      }
    }
  });

  // 扁平化列表（派生）
  let flatList = $derived(flattenTree(treeData, expandedIds));

  // 转换 selected 为 Set
  let selectedSet = $derived.by(() => {
    if (mode === 'single') {
      return new Set(selected ? [selected as string] : []);
    }
    return new Set(Array.isArray(selected) ? selected : []);
  });

  // 搜索过滤
  let filteredFlatList = $derived.by(() => {
    if (!searchQuery.trim()) return flatList;
    const query = searchQuery.toLowerCase();
    
    // 搜索时显示所有匹配项及其父节点
    const matchedIds = new Set<string>();
    const addParents = (item: TreeItem) => {
      matchedIds.add(item.id);
      if (item.parentId) {
        const parent = items.find(i => i.id === item.parentId);
        if (parent) addParents(parent);
      }
    };
    
    items.forEach(item => {
      if (item.label.toLowerCase().includes(query) || 
          item.description?.toLowerCase().includes(query)) {
        addParents(item);
      }
    });
    
    return flatList.filter(item => matchedIds.has(item.id));
  });

  // 统计
  let selectableCount = $derived(items.filter(i => !i.disabled).length);
  let allSelected = $derived(
    selectableCount > 0 && items.filter(i => !i.disabled).every(i => selectedSet.has(i.id))
  );

  function toggleExpand(id: string) {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    expandedIds = newSet;
  }

  function expandAll() {
    expandedIds = new Set(getAllNodeIds(treeData));
  }

  function collapseAll() {
    expandedIds = new Set();
  }

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
    const allIds = getSelectableIds(items);
    selected = allIds;
    onSelect?.(allIds);
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

  function isExpanded(id: string): boolean {
    return expandedIds.has(id);
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
  <div class="flex items-center justify-between flex-wrap gap-2">
    <div class="flex gap-2">
      {#if mode === 'multiple' && showSelectAll}
        <Button size="sm" variant="outline" onclick={selectAll} disabled={selectableCount === 0}>
          全选
        </Button>
        <Button size="sm" variant="outline" onclick={deselectAll} disabled={selectedSet.size === 0}>
          取消
        </Button>
      {/if}
      <Button size="sm" variant="ghost" onclick={expandAll}>
        <Icon icon="tdesign:chevron-down-double" class="size-4 mr-1" />展开
      </Button>
      <Button size="sm" variant="ghost" onclick={collapseAll}>
        <Icon icon="tdesign:chevron-up-double" class="size-4 mr-1" />收起
      </Button>
    </div>
    {#if mode === 'multiple'}
      <span class="text-sm text-muted-foreground">
        已选 {selectedSet.size} / {selectableCount}
      </span>
    {/if}
  </div>

  <!-- 树形列表 -->
  <ScrollArea class="border rounded-md" style="height: {maxHeight}">
    <div class="p-1">
      {#each filteredFlatList as item (item.id)}
        <div
          class="flex items-center py-1.5 rounded-md transition-colors
            {isSelected(item.id) ? 'bg-primary/10' : 'hover:bg-muted/50'}
            {item.disabled ? 'opacity-50' : ''}"
          style="padding-left: {item.level * 20 + 8}px"
        >
          <!-- 展开/收起按钮 -->
          {#if item.children.length > 0}
            <button 
              class="mr-1 p-0.5 hover:bg-muted rounded flex-shrink-0"
              onclick={() => toggleExpand(item.id)}
            >
              <Icon 
                icon={isExpanded(item.id) ? 'tdesign:chevron-down' : 'tdesign:chevron-right'} 
                class="size-4" 
              />
            </button>
          {:else}
            <span class="w-5 mr-1 flex-shrink-0"></span>
          {/if}

          <!-- 选择按钮 -->
          <button
            type="button"
            class="flex-1 flex items-center gap-2 min-w-0
              {item.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}"
            onclick={() => toggleItem(item.id)}
            disabled={item.disabled}
          >
            {#if mode === 'multiple'}
              <Checkbox 
                checked={isSelected(item.id)}
                disabled={item.disabled}
                class="pointer-events-none flex-shrink-0"
              />
            {:else}
              <div class="size-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                {isSelected(item.id) ? 'border-primary bg-primary' : 'border-muted-foreground'}">
                {#if isSelected(item.id)}
                  <div class="size-2 rounded-full bg-white"></div>
                {/if}
              </div>
            {/if}

            {#if item.icon}
              <Icon icon={item.icon} class="size-4 text-muted-foreground flex-shrink-0" />
            {/if}

            <span class="text-sm truncate">{item.label}</span>

            {#if item.description}
              <span class="text-xs text-muted-foreground truncate">({item.description})</span>
            {/if}

            {#if item.badge}
              <Badge variant={item.badgeVariant || 'secondary'} class="text-xs flex-shrink-0">
                {item.badge}
              </Badge>
            {/if}
          </button>
        </div>
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
