<script lang="ts">
  import { useSvelteFlow } from '@xyflow/svelte';

  const { getViewport, getNodes, getEdges } = useSvelteFlow();

  // 定期更新 viewport 信息
  let viewport = $state({ x: 0, y: 0, zoom: 1 });
  let nodeCount = $state(0);
  let edgeCount = $state(0);

  $effect(() => {
    const interval = setInterval(() => {
      const v = getViewport();
      viewport = { x: v.x, y: v.y, zoom: v.zoom };
      nodeCount = getNodes().length;
      edgeCount = getEdges().length;
    }, 100);

    return () => clearInterval(interval);
  });
</script>

<div class="absolute bottom-3 right-3 z-10 bg-card border border-border rounded-lg p-3 text-xs shadow-md min-w-[120px]">
  <div class="flex justify-between items-center py-0.5">
    <span class="text-muted-foreground font-medium">Zoom:</span>
    <span class="text-card-foreground font-mono">{(viewport.zoom * 100).toFixed(0)}%</span>
  </div>
  <div class="flex justify-between items-center py-0.5">
    <span class="text-muted-foreground font-medium">X:</span>
    <span class="text-card-foreground font-mono">{viewport.x.toFixed(0)}</span>
  </div>
  <div class="flex justify-between items-center py-0.5">
    <span class="text-muted-foreground font-medium">Y:</span>
    <span class="text-card-foreground font-mono">{viewport.y.toFixed(0)}</span>
  </div>
  <div class="h-px bg-border my-2"></div>
  <div class="flex justify-between items-center py-0.5">
    <span class="text-muted-foreground font-medium">Nodes:</span>
    <span class="text-card-foreground font-mono">{nodeCount}</span>
  </div>
  <div class="flex justify-between items-center py-0.5">
    <span class="text-muted-foreground font-medium">Edges:</span>
    <span class="text-card-foreground font-mono">{edgeCount}</span>
  </div>
</div>
