<script lang="ts">
  import * as Popover from '$lib/components/ui/popover/index.js';
  import { UTIL_DEFINITIONS, type UtilType } from '../../types.js';

  interface Props {
    onAddUtil: (utilType: UtilType) => void;
  }

  let { onAddUtil }: Props = $props();

  // 工具分类
  const categories = [
    {
      name: '类型转换',
      icon: '🔄',
      color: 'purple',
      utils: ['toString', 'toNumber', 'toBoolean'] as UtilType[],
    },
    {
      name: '类型检查',
      icon: '❓',
      color: 'blue',
      utils: ['isType'] as UtilType[],
    },
    {
      name: '算术运算',
      icon: '➕',
      color: 'green',
      utils: ['add', 'subtract', 'multiply', 'divide', 'modulo'] as UtilType[],
    },
    {
      name: '比较运算',
      icon: '⚖️',
      color: 'orange',
      utils: ['equal', 'notEqual', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual'] as UtilType[],
    },
    {
      name: '逻辑运算',
      icon: '🔀',
      color: 'red',
      utils: ['and', 'or', 'not'] as UtilType[],
    },
    {
      name: '字符串',
      icon: '📝',
      color: 'teal',
      utils: ['concat', 'substring', 'stringLength', 'toUpperCase', 'toLowerCase', 'trim', 'split', 'replace', 'includes'] as UtilType[],
    },
    {
      name: '数组',
      icon: '📋',
      color: 'indigo',
      utils: ['arrayCount', 'arrayGet', 'arrayFirst', 'arrayLast', 'arrayJoin'] as UtilType[],
    },
  ];

  let open = $state(false);

  function handleSelect(utilType: UtilType) {
    onAddUtil(utilType);
    open = false;
  }

  function getColorClasses(color: string) {
    const colors: Record<string, { bg: string; text: string; hover: string; border: string }> = {
      purple: { bg: 'bg-chart-5/10 dark:bg-chart-5/20', text: 'text-chart-5', hover: 'hover:bg-chart-5/20 dark:hover:bg-chart-5/30', border: 'border-chart-5/30' },
      blue: { bg: 'bg-primary/10 dark:bg-primary/20', text: 'text-primary', hover: 'hover:bg-primary/20 dark:hover:bg-primary/30', border: 'border-primary/30' },
      green: { bg: 'bg-chart-2/10 dark:bg-chart-2/20', text: 'text-chart-2', hover: 'hover:bg-chart-2/20 dark:hover:bg-chart-2/30', border: 'border-chart-2/30' },
      orange: { bg: 'bg-chart-4/10 dark:bg-chart-4/20', text: 'text-chart-4', hover: 'hover:bg-chart-4/20 dark:hover:bg-chart-4/30', border: 'border-chart-4/30' },
      red: { bg: 'bg-destructive/10 dark:bg-destructive/20', text: 'text-destructive', hover: 'hover:bg-destructive/20 dark:hover:bg-destructive/30', border: 'border-destructive/30' },
      teal: { bg: 'bg-chart-3/10 dark:bg-chart-3/20', text: 'text-chart-3', hover: 'hover:bg-chart-3/20 dark:hover:bg-chart-3/30', border: 'border-chart-3/30' },
      indigo: { bg: 'bg-chart-1/10 dark:bg-chart-1/20', text: 'text-chart-1', hover: 'hover:bg-chart-1/20 dark:hover:bg-chart-1/30', border: 'border-chart-1/30' },
    };
    return colors[color] ?? colors.purple;
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <button
        {...props}
        class="px-4 py-2 bg-card border border-chart-5/30 rounded-md text-[13px] text-chart-5 cursor-pointer transition-all hover:bg-chart-5/10 hover:border-chart-5/50"
      >
        🧰 工具节点
      </button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[400px] p-0" align="start">
    <div class="p-3 border-b">
      <h3 class="font-medium text-sm">工具节点</h3>
      <p class="text-xs text-muted-foreground mt-1">选择要添加的工具节点类型</p>
    </div>
    <div class="p-2 max-h-[400px] overflow-y-auto">
      {#each categories as category}
        {@const colors = getColorClasses(category.color)}
        <div class="mb-3">
          <div class="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground">
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </div>
          <div class="grid grid-cols-2 gap-1 mt-1">
            {#each category.utils as utilType}
              {@const def = UTIL_DEFINITIONS[utilType]}
              <button
                class="flex flex-col items-start p-2 rounded-md text-left transition-colors {colors.bg} {colors.text} {colors.hover} border {colors.border}"
                onclick={() => handleSelect(utilType)}
              >
                <span class="text-xs font-medium">{def.displayName}</span>
                <span class="text-[10px] opacity-70 line-clamp-1">{def.description}</span>
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </Popover.Content>
</Popover.Root>
