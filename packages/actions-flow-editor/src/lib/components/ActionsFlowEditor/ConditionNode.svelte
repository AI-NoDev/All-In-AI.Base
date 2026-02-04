<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  import IconDelete from '@iconify-svelte/tdesign/delete';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import type { ConditionNodeData } from '../../types.js';
  import { getHandleColor } from '../../edgeTypeRule.js';

  interface Props {
    id: string;
    data: ConditionNodeData;
    isConnectable?: boolean;
  }

  let { id, data, isConnectable = true }: Props = $props();

  function handleDelete() {
    if (confirm('确定要删除条件节点吗？')) {
      data.onDelete?.(id);
    }
  }

  const HEADER_HEIGHT = 40;
  const ROW_HEIGHT = 28;
  const PINS_PADDING_Y = 8;

  function getHandleTop(index: number): number {
    return HEADER_HEIGHT + PINS_PADDING_Y + index * ROW_HEIGHT + ROW_HEIGHT / 2;
  }
</script>

<div class="min-w-[180px] bg-card border-2 border-chart-4 rounded-lg shadow-md text-xs relative group">
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
      <p>删除节点</p>
    </Tooltip.Content>
  </Tooltip.Root>

  <!-- 节点头部 -->
  <div 
    class="flex items-center gap-2 px-3 border-b border-chart-4/30 rounded-t-lg bg-chart-4"
    style="height: {HEADER_HEIGHT}px;"
  >
    <span class="text-primary-foreground text-lg">◇</span>
    <span class="font-semibold text-primary-foreground text-sm">条件判断</span>
  </div>

  <!-- 引脚区域 -->
  <div style="padding: {PINS_PADDING_Y}px 0;">
    <!-- 输入: condition (boolean) -->
    <div class="flex items-center justify-between px-3 gap-4" style="height: {ROW_HEIGHT}px;">
      <span class="text-[11px] text-foreground flex items-center gap-1">
        <span class="text-destructive">*</span>
        <span>condition</span>
        <span class="text-muted-foreground">:</span>
        <span class="text-chart-5">boolean</span>
      </span>
      <span></span>
    </div>

    <!-- 输出: true -->
    <div class="flex items-center justify-between px-3 gap-4" style="height: {ROW_HEIGHT}px;">
      <span></span>
      <span class="text-[11px] text-foreground flex items-center gap-1">
        <span class="text-chart-2 font-medium">✓ true</span>
        <span class="text-muted-foreground">→</span>
      </span>
    </div>

    <!-- 输出: false -->
    <div class="flex items-center justify-between px-3 gap-4" style="height: {ROW_HEIGHT}px;">
      <span></span>
      <span class="text-[11px] text-foreground flex items-center gap-1">
        <span class="text-destructive font-medium">✗ false</span>
        <span class="text-muted-foreground">→</span>
      </span>
    </div>
  </div>

  <!-- 输入 Handle: condition -->
  <Handle
    id="input-condition"
    type="target"
    position={Position.Left}
    style="top: {getHandleTop(0)}px; left: 0px; width: 10px; height: 10px; background: {getHandleColor('boolean')}; border: none;"
    {isConnectable}
  />

  <!-- 输出 Handle: true -->
  <Handle
    id="output-true"
    type="source"
    position={Position.Right}
    style="top: {getHandleTop(1)}px; right: 0px; width: 10px; height: 10px; background: hsl(var(--chart-2)); border: none;"
    {isConnectable}
  />

  <!-- 输出 Handle: false -->
  <Handle
    id="output-false"
    type="source"
    position={Position.Right}
    style="top: {getHandleTop(2)}px; right: 0px; width: 10px; height: 10px; background: hsl(var(--destructive)); border: none;"
    {isConnectable}
  />
</div>
