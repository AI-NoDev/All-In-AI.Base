<script lang="ts">
  import { Handle, Position, NodeResizer } from '@xyflow/svelte';
  import IconDelete from '@iconify-svelte/tdesign/delete';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import type { LoopBodyNodeData } from '../../types.js';
  import { getTypeColor } from '../../edgeTypeRule.js';

  interface Props {
    id: string;
    data: LoopBodyNodeData;
    selected?: boolean;
    isConnectable?: boolean;
  }

  let { id, data, selected = false, isConnectable = true }: Props = $props();

  function handleDelete() {
    if (confirm('确定要删除循环体吗？这将删除其中所有节点。')) {
      data.onDelete?.(id);
    }
  }

  const HEADER_HEIGHT = 32;
</script>

<NodeResizer 
  minWidth={300} 
  minHeight={200} 
  isVisible={selected}
  lineStyle="border: 1px dashed hsl(var(--primary));"
  handleStyle="width: 8px; height: 8px; background: hsl(var(--primary)); border-radius: 2px;"
/>

<div class="w-full h-full bg-primary/5 border-2 border-dashed border-primary/50 rounded-lg relative group">
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
      <p>删除循环体</p>
    </Tooltip.Content>
  </Tooltip.Root>

  <!-- 头部标签 -->
  <div 
    class="absolute top-0 left-0 right-0 flex items-center gap-2 px-3 bg-primary/10 border-b border-primary/20 rounded-t-lg"
    style="height: {HEADER_HEIGHT}px;"
  >
    <span class="text-primary text-sm">↻</span>
    <span class="font-medium text-primary text-xs">循环体</span>
    <span class="text-[10px] text-primary/70">
      (项类型: <span class="{getTypeColor(data.itemType)}">{data.itemType}</span>)
    </span>
  </div>

  <!-- 输入 Handle (从循环节点连接) -->
  <Handle
    id="input-loop"
    type="target"
    position={Position.Left}
    style="top: {HEADER_HEIGHT / 2}px; left: 0px; width: 10px; height: 10px; background: hsl(var(--primary)); border: none;"
    {isConnectable}
  />
</div>
