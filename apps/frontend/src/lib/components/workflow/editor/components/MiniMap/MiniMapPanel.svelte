<script lang="ts" module>
  declare const window: Window | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAttrFunction = (func: any): GetMiniMapNodeAttribute =>
    func instanceof Function ? func : () => func;
</script>

<script lang="ts">
  import {
    getBoundsOfRects,
    getInternalNodesBounds,
    getNodeDimensions,
    nodeHasDimensions
  } from '@xyflow/system';
  import { mode } from 'mode-watcher';

  import MinimapNode from './MiniMapNode.svelte';
  import interactive from './interactive';
  import type { GetMiniMapNodeAttribute, MiniMapProps } from './types';
  import { useStore, useSvelteFlow } from '@xyflow/svelte';
  import { Button } from "$lib/components/ui/button";
  import * as ButtonGroup from "$lib/components/ui/button-group";
  import Icon from "@iconify/svelte";
  import { preferencesStore, THEME_COLORS } from '$lib/stores/preferences.svelte';

  let {
    position = 'bottom-right',
    ariaLabel,
    nodeStrokeColor = 'transparent',
    nodeClass = '',
    nodeBorderRadius = 5,
    nodeStrokeWidth = 2,
    nodeComponent,
    bgColor,
    maskColor,
    maskStrokeColor,
    maskStrokeWidth,
    width = 133,
    height = 67,
    pannable = true,
    zoomable = true,
    inversePan,
    zoomStep,
    class: className
  }: MiniMapProps = $props();

  let store = $derived(useStore());
  const flow = useSvelteFlow();
  let ariaLabelConfig = $derived(store.ariaLabelConfig);
  let zoomLevel = $derived(store.viewport.zoom);

  function handleZoomIn() {
    flow.zoomIn();
  }

  function handleZoomOut() {
    flow.zoomOut();
  }

  let nodeColorFunc = $derived(getAttrFunction(minimapNodeColor));
  let nodeStrokeColorFunc = $derived(getAttrFunction(nodeStrokeColor));
  let nodeClassFunc = $derived(getAttrFunction(nodeClass));
  const shapeRendering =
    // @ts-expect-error - TS doesn't know about chrome
    typeof window === 'undefined' || !!window.chrome ? 'crispEdges' : 'geometricPrecision';

  let labelledBy = $derived(`svelte-flow__minimap-desc-${store.flowId}`);

  let viewBB = $derived({
    x: -store.viewport.x / store.viewport.zoom,
    y: -store.viewport.y / store.viewport.zoom,
    width: store.width / store.viewport.zoom,
    height: store.height / store.viewport.zoom
  });

  let boundingRect = $derived(
    getBoundsOfRects(getInternalNodesBounds(store.nodeLookup, { filter: (n) => !n.hidden }), viewBB)
  );

  let scaledWidth = $derived(boundingRect.width / width);
  let scaledHeight = $derived(boundingRect.height / height);
  let viewScale = $derived(Math.max(scaledWidth, scaledHeight));
  let viewWidth = $derived(viewScale * width);
  let viewHeight = $derived(viewScale * height);
  let offset = $derived(5 * viewScale);
  let x = $derived(boundingRect.x - (viewWidth - boundingRect.width) / 2 - offset);
  let y = $derived(boundingRect.y - (viewHeight - boundingRect.height) / 2 - offset);
  let viewboxWidth = $derived(viewWidth + offset * 2);
  let viewboxHeight = $derived(viewHeight + offset * 2);

  const getViewScale = () => viewScale;

  // 主题相关颜色 - 从 store 获取主题色
  const minimapBgColor = $derived(mode.current === 'dark' ? '#1e293b' : '#f8fafc');
  const minimapMaskColor = $derived(mode.current === 'dark' ? 'rgba(15, 23, 42, 0.7)' : 'rgba(226, 232, 240, 0.6)');
  const minimapNodeColor = $derived(THEME_COLORS[preferencesStore.themeColor].preview);


</script>


  {#if store.panZoom}
    <svg
      {width}
      {height}
      viewBox="{x} {y} {viewboxWidth} {viewboxHeight}"
      class="svelte-flow__minimap-svg rounded-md overflow-hidden"
      role="img"
      aria-labelledby={labelledBy}
      style:--xy-minimap-mask-background-color-props={maskColor || minimapMaskColor}
      style:--xy-minimap-mask-stroke-color-props={maskStrokeColor}
      style:--xy-minimap-mask-stroke-width-props={maskStrokeWidth
        ? maskStrokeWidth * viewScale
        : undefined}
      use:interactive={{
        store,
        panZoom: store.panZoom,
        getViewScale,
        translateExtent: store.translateExtent,
        width: store.width,
        height: store.height,
        inversePan,
        zoomStep,
        pannable,
        zoomable
      }}
    >
      {#if ariaLabel ?? ariaLabelConfig['minimap.ariaLabel']}
        <title id={labelledBy}>{ariaLabel ?? ariaLabelConfig['minimap.ariaLabel']}</title>
      {/if}

      <!-- 背景矩形 -->
      <rect
        x={x - offset}
        y={y - offset}
        width={viewboxWidth + offset * 2}
        height={viewboxHeight + offset * 2}
        rx={nodeBorderRadius}
        ry={nodeBorderRadius}
        fill={minimapBgColor}
      />

      {#each store.nodes as userNode (userNode.id)}
        {@const node = store.nodeLookup.get(userNode.id)}
        {#if node && nodeHasDimensions(node) && !node.hidden}
          {@const nodeDimesions = getNodeDimensions(node)}
          <MinimapNode
            id={node.id}
            x={node.internals.positionAbsolute.x}
            y={node.internals.positionAbsolute.y}
            {...nodeDimesions}
            selected={node.selected}
            {nodeComponent}
            color={nodeColorFunc(node)}
            borderRadius={nodeBorderRadius}
            strokeColor={nodeStrokeColorFunc(node)}
            strokeWidth={nodeStrokeWidth}
            {shapeRendering}
            class={nodeClassFunc(node)}
          />
        {/if}
      {/each}
      <path
        class="svelte-flow__minimap-mask"
        d="M{x - offset},{y - offset}h{viewboxWidth + offset * 2}v{viewboxHeight +
          offset * 2}h{-viewboxWidth - offset * 2}z
      M{viewBB.x},{viewBB.y}h{viewBB.width}v{viewBB.height}h{-viewBB.width}z"
        fill-rule="evenodd"
        pointer-events="none"
      />
    </svg>

    <!-- Zoom Controls -->
    <ButtonGroup.Root class="w-full mt-1">
      <Button onclick={handleZoomOut} aria-label="Zoom out" size="icon" variant="outline">
        <Icon icon="ic:outline-zoom-out" width="20" height="20" />
      </Button>
      <div class="flex flex-1 items-center justify-center bg-background text-sm">
        {(zoomLevel * 100).toFixed(0)}%
      </div>
      <Button onclick={handleZoomIn} aria-label="Zoom in" size="icon" variant="outline">
        <Icon icon="ic:outline-zoom-in" width="20" height="20" />
      </Button>
    </ButtonGroup.Root>
  {/if}