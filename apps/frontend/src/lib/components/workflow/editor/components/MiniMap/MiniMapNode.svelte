<script lang="ts">
  import type { ClassValue } from 'svelte/elements';
  import type { Component } from 'svelte';
  import type { MiniMapNodeProps } from './types';
  import { preferencesStore, THEME_COLORS } from '$lib/stores/preferences.svelte';

  let {
    id,
    x,
    y,
    width,
    height,
    borderRadius = 5,
    color,
    shapeRendering,
    strokeColor,
    strokeWidth = 2,
    selected,
    class: className,
    nodeComponent
  }: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    borderRadius?: number;
    color?: string;
    shapeRendering: string;
    strokeColor?: string;
    strokeWidth?: number;
    selected?: boolean;
    class?: ClassValue;
    nodeComponent?: Component<MiniMapNodeProps>;
  } = $props();

  const themeColor = $derived(THEME_COLORS[preferencesStore.themeColor].preview);
</script>

{#if nodeComponent}
  {@const CustomComponent = nodeComponent}

  <CustomComponent
    {id}
    {x}
    {y}
    {width}
    {height}
    {borderRadius}
    class={className}
    {color}
    {shapeRendering}
    {strokeColor}
    {strokeWidth}
    {selected}
  />
{:else}
  <rect
    {x}
    {y}
    rx={borderRadius}
    ry={borderRadius}
    {width}
    {height}
    fill={selected ? themeColor : (color || themeColor)}
    stroke={strokeColor}
    stroke-width={strokeWidth}
    shape-rendering={shapeRendering}
  />
{/if}