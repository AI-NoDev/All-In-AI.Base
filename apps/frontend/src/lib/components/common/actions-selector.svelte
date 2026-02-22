<script lang="ts">
  import Icon from '@iconify/svelte';
  import { actionsStore, type ActionInfo } from '@/lib/stores/actions.svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { Badge } from '$lib/components/ui/badge';
  import * as Sheet from '$lib/components/ui/sheet';
  import * as Tooltip from '$lib/components/ui/tooltip';
  import * as Select from '$lib/components/ui/select';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import { t } from '@/lib/stores/i18n.svelte';

  interface Props {
    open: boolean;
    selected: string[];
    onchange?: (selected: string[]) => void;
    onclose?: () => void;
  }

  let { open = $bindable(), selected = $bindable(), onchange, onclose }: Props = $props();

  let search = $state('');
  let localSelected = $state<string[]>([]);
  let activeGroup = $state('');

  // 同步外部 selected 到本地，并刷新 actions 列表
  $effect(() => {
    if (open) {
      localSelected = [...selected];
      search = '';
      // 强制刷新 actions 列表以获取最新数据
      actionsStore.load(true);
    }
  });

  let availableActions = $derived(actionsStore.actions);

  // 获取所有分组
  let allGroups = $derived(() => {
    const groups = new Set<string>();
    for (const action of availableActions) {
      groups.add(action.tags[0] || 'other');
    }
    return Array.from(groups).sort();
  });

  // 默认选中第一个分组
  $effect(() => {
    if (open && allGroups().length > 0 && !activeGroup) {
      activeGroup = allGroups()[0];
    }
  });

  // 防抖搜索
  let debouncedSearch = $state('');
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;
  
  $effect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      debouncedSearch = search;
    }, 150);
  });

  // 当前分组的 Actions
  let groupActions = $derived(() => {
    return availableActions.filter(a => (a.tags[0] || 'other') === activeGroup);
  });

  // 过滤后的 Actions
  let filteredActions = $derived(() => {
    const actions = groupActions();
    if (!debouncedSearch) return actions;
    const kw = debouncedSearch.toLowerCase();
    return actions.filter(a =>
      a.name.toLowerCase().includes(kw) ||
      a.displayName.toLowerCase().includes(kw) ||
      a.description?.toLowerCase().includes(kw)
    );
  });

  // 当前分组是否全选
  let isGroupAllSelected = $derived(() => {
    const actions = groupActions();
    return actions.length > 0 && actions.every(a => localSelected.includes(a.name));
  });

  function toggleAction(actionName: string) {
    if (localSelected.includes(actionName)) {
      localSelected = localSelected.filter(a => a !== actionName);
    } else {
      localSelected = [...localSelected, actionName];
    }
  }

  function selectAllInGroup() {
    const actions = groupActions();
    const names = actions.map(a => a.name);
    if (isGroupAllSelected()) {
      localSelected = localSelected.filter(n => !names.includes(n));
    } else {
      const newSelected = new Set([...localSelected, ...names]);
      localSelected = Array.from(newSelected);
    }
  }

  function handleConfirm() {
    selected = [...localSelected];
    onchange?.(localSelected);
    open = false;
    onclose?.();
  }

  function handleCancel() {
    open = false;
    onclose?.();
  }

  function getMethodColor(method: string): string {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'POST': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800';
    }
  }

  // 获取分组选中数量和总数
  function getGroupStats(group: string): { selected: number; total: number } {
    const groupActionNames = availableActions.filter(a => (a.tags[0] || 'other') === group);
    const selected = localSelected.filter(n => groupActionNames.map(a => a.name).includes(n)).length;
    return { selected, total: groupActionNames.length };
  }
</script>

<Sheet.Root bind:open onOpenChange={(isOpen) => { if (isOpen) return; /* 只允许通过按钮关闭 */ }}>
  <Sheet.Content side="right" class="w-full sm:max-w-2xl flex flex-col" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
    <Sheet.Header class="flex-shrink-0">
      <Sheet.Title>{t('actions.selectActions')}</Sheet.Title>
      <Sheet.Description>
        {t('actions.selectedCount').replace('${selected}', String(localSelected.length)).replace('${total}', String(availableActions.length))}
      </Sheet.Description>
    </Sheet.Header>

    <div class="flex flex-col gap-3 py-4 px-1 flex-1 min-h-0">
      <!-- 分组选择器和搜索 -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <Button variant="outline" size="sm" onclick={selectAllInGroup}>
          <Icon icon={isGroupAllSelected() ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'} class="size-4 mr-1" />
          {isGroupAllSelected() ? t('actions.deselectAllInGroup') : t('actions.selectAllInGroup')}
        </Button>

        <Select.Root type="single" bind:value={activeGroup}>
          <Select.Trigger class="w-48">
            {@const stats = getGroupStats(activeGroup)}
            <span class="capitalize">{activeGroup || t('actions.selectGroup')}</span>
            <span class="ml-2 text-xs text-muted-foreground">({stats.selected}/{stats.total})</span>
          </Select.Trigger>
          <Select.Content>
            {#each allGroups() as group}
              {@const stats = getGroupStats(group)}
              <Select.Item value={group} class="capitalize">
                <span class="flex-1">{group}</span>
                <span class="ml-2 text-xs text-muted-foreground">({stats.selected}/{stats.total})</span>
              </Select.Item>
            {/each}
          </Select.Content>
        </Select.Root>
        
        <div class="relative flex-1">
          <Icon icon="mdi:magnify" class="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input 
            class="pl-8" 
            placeholder={t('tips.searchNameDesc')} 
            bind:value={search}
          />
        </div>
      </div>

      <!-- Actions 列表 -->
      <ScrollArea class="flex-1 min-h-0 rounded-md border">
        <div class="p-2 space-y-1">
          {#each filteredActions() as action (action.name)}
            <label 
              class="flex items-start gap-2 p-2 rounded border cursor-pointer transition-colors
                     {localSelected.includes(action.name) ? 'bg-primary/10 border-primary/50' : 'hover:bg-muted/50 border-transparent'}"
            >
              <Checkbox 
                checked={localSelected.includes(action.name)}
                onCheckedChange={() => toggleAction(action.name)}
                class="mt-0.5 flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="outline" class="text-[10px] px-1 py-0 flex-shrink-0 {getMethodColor(action.method)}">{action.method}</Badge>
                  <span class="text-sm font-medium">{action.displayName}</span>
                </div>
                <div class="text-xs text-muted-foreground truncate mt-0.5 font-mono">{action.path}</div>
                {#if action.description}
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <div class="text-xs text-muted-foreground/80 mt-1 line-clamp-1">{action.description}</div>
                    </Tooltip.Trigger>
                    <Tooltip.Content side="bottom" class="max-w-sm">
                      <p class="text-xs">{action.description}</p>
                    </Tooltip.Content>
                  </Tooltip.Root>
                {/if}
              </div>
            </label>
          {:else}
            <div class="text-center py-8 text-muted-foreground">
              <Icon icon="mdi:magnify-close" class="size-8 mx-auto mb-2 opacity-50" />
              <p>{t('actions.noMatchingActions')}</p>
            </div>
          {/each}
        </div>
      </ScrollArea>
    </div>

    <Sheet.Footer class="flex-shrink-0">
      <Button variant="outline" onclick={handleCancel}>{t('actions.cancel')}</Button>
      <Button onclick={handleConfirm}>
        {t('actions.confirm')} ({localSelected.length})
      </Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
