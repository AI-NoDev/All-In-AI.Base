<script lang="ts">
  import { BaseEdge, getBezierPath, type EdgeProps } from '@xyflow/svelte';
  import { getContext } from 'svelte';
  import { EDGE_DELETE_CONTEXT_KEY, type EdgeDeleter } from '../../types.js';

  let {
    id,
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    markerEnd,
    style,
  }: EdgeProps = $props();

  // 从 context 获取删除函数
  const deleteEdge = getContext<EdgeDeleter>(EDGE_DELETE_CONTEXT_KEY);

  // 计算贝塞尔曲线路径和中点位置
  let pathData = $derived(
    getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    })
  );

  let edgePath = $derived(pathData[0]);
  let labelX = $derived(pathData[1]);
  let labelY = $derived(pathData[2]);

  // hover 状态
  let isHovered = $state(false);

  function handleDelete(e: MouseEvent) {
    e.stopPropagation();
    deleteEdge?.(id);
  }
</script>

<BaseEdge 
  path={edgePath} 
  {markerEnd} 
  {style}
/>

<!-- 透明的宽路径用于更容易触发 hover -->
<path
  d={edgePath}
  fill="none"
  stroke="transparent"
  stroke-width="20"
  class="cursor-pointer"
  role="button"
  tabindex="-1"
  onmouseenter={() => isHovered = true}
  onmouseleave={() => isHovered = false}
/>

<!-- 删除按钮 -->
{#if isHovered}
  <foreignObject
    x={labelX - 10}
    y={labelY - 10}
    width="20"
    height="20"
    class="overflow-visible"
    role="button"
    tabindex="-1"
    onmouseenter={() => isHovered = true}
    onmouseleave={() => isHovered = false}
  >
    <button
      class="w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-sm"
      onclick={handleDelete}
      aria-label="删除连接"
    >
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  </foreignObject>
{/if}
