<script lang="ts">
  import { Handle, Position, NodeResizer } from '@xyflow/svelte';
  import IconDelete from '@iconify-svelte/tdesign/delete';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import type { ConditionBranchNodeData } from '../../types.js';

  interface Props {
    id: string;
    data: ConditionBranchNodeData;
    selected?: boolean;
    isConnectable?: boolean;
  }

  let { id, data, selected = false, isConnectable = true }: Props = $props();

  function handleDelete() {
    if (confirm('确定要删除条件分支吗？这将删除其中所有节点。')) {
      data.onDelete?.(id);
    }
  }

  let isTrue = $derived(data.branchType === 'true');
  
  // Use CSS variables for theme-aware colors
  let borderColorClass = $derived(isTrue ? 'border-chart-2' : 'border-destructive');
  let bgClass = $derived(isTrue ? 'bg-chart-2/5' : 'bg-destructive/5');
  let headerBgClass = $derived(isTrue ? 'bg-chart-2/20' : 'bg-destructive/20');
  let headerBorderClass = $derived(isTrue ? 'border-chart-2/30' : 'border-destructive/30');
  let textColorClass = $derived(isTrue ? 'text-chart-2' : 'text-destructive');

  const HEADER_HEIGHT = 32;
</script>

<NodeResizer 
  minWidth={280} 
  minHeight={180} 
  isVisible={selected}
  lineStyle="border: 1px dashed {isTrue ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))'};"
  handleStyle="width: 8px; height: 8px; background: {isTrue ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))'}; border-radius: 2px;"
/>

<div 
  class="w-full h-full border-2 border-dashed rounded-lg relative group {bgClass} {borderColorClass}"
>
  <!-- 删除按钮 -->
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <button
          {...props}
          class="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90 z-10"
          onclick={handleDelete}
        >
          <IconDelete class="w-3 h-3" />
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content>
      <p>删除分支</p>
    </Tooltip.Content>
  </Tooltip.Root>

  <!-- 头部标签 -->
  <div 
    class="absolute top-0 left-0 right-0 flex items-center gap-2 px-3 border-b rounded-t-lg {headerBgClass} {headerBorderClass}"
    style="height: {HEADER_HEIGHT}px;"
  >
    {#if isTrue}
      <span class={textColorClass}>✓</span>
      <span class="font-medium text-xs {textColorClass}">True 分支</span>
    {:else}
      <span class={textColorClass}>✗</span>
      <span class="font-medium text-xs {textColorClass}">False 分支</span>
    {/if}
  </div>

  <!-- 输入 Handle (从条件节点连接) -->
  <Handle
    id="input-branch"
    type="target"
    position={Position.Left}
    style="top: {HEADER_HEIGHT / 2}px; left: 0px; width: 10px; height: 10px; background: {isTrue ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))'}; border: none;"
    {isConnectable}
  />
</div>
