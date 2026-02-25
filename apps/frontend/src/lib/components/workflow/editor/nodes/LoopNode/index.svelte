<script lang="ts">
	import { Position, NodeResizer } from '@xyflow/svelte';
	import { onMount, tick } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import NodeHandler from '../../handler/NodeHandler.svelte';
	import LoopHeader from './LoopHeader.svelte';
	import LoopBody from './LoopBody.svelte';
	import ConfigPanel from './ConfigPanel.svelte';
	import { useLoopNode } from './use-loop-node.svelte';
	import type { LoopNodeData } from './types';
	import { configPanelRegistry } from '$lib/components/workflow/editor/contexts/index';

	interface Props {
		id: string;
		data: LoopNodeData;
		selected?: boolean;
	}

	let { id, data, selected = false }: Props = $props();

	// 使用 hook 获取逻辑
	const loopNode = useLoopNode({ id, data });

	// DOM 引用
	let nodeRef: HTMLDivElement | undefined = $state();
	let indicatorRef: HTMLDivElement | undefined = $state();
	let loopEntryHandleTop = $state(100);
	let loopEntryHandleLeft = $state(68);

	// 动态计算循环入口 handle 位置
	$effect(() => {
		if (nodeRef && indicatorRef) {
			tick().then(() => {
				const nodeRect = nodeRef!.getBoundingClientRect();
				const indicatorRect = indicatorRef!.getBoundingClientRect();
				loopEntryHandleTop = indicatorRect.top - nodeRect.top + indicatorRect.height / 2;
				loopEntryHandleLeft = indicatorRect.left - nodeRect.left + indicatorRect.width;
			});
		}
	});

	onMount(() => {
		configPanelRegistry.register('loop', ConfigPanel);
	});

	/** 点击循环入口引脚 */
	function handleLoopEntryClick(e: MouseEvent) {
		loopNode.handleLoopEntryClick(e, loopEntryHandleLeft, loopEntryHandleTop);
	}

	// 确保宽高是数字
	let nodeWidth = $derived(loopNode.width);
	let nodeHeight = $derived(loopNode.height);
</script>

<!-- NodeResizer：只显示右下角手柄 -->
<NodeResizer 
	minWidth={loopNode.minSize.width}
	minHeight={loopNode.minSize.height}
	isVisible={selected}
	onResize={loopNode.handleResize}
/>

<div 
	bind:this={nodeRef}
	style:width="{nodeWidth}px"
	style:height="{nodeHeight}px"
>
	<BaseNode nodeId={id} nodeData={data} width={nodeWidth} height={nodeHeight} inputId="input">
		{#snippet content()}
			<LoopHeader 
				title={loopNode.title}
				maxIterations={loopNode.maxIterations}
				breakConditionsCount={loopNode.breakConditions.length}
			/>
			<LoopBody 
				childNodeCount={loopNode.childNodeCount}
				bind:indicatorRef
			/>
		{/snippet}
	</BaseNode>
</div>

<!-- 循环入口引脚 -->
<NodeHandler 
	type="source" 
	position={Position.Right} 
	connected={loopNode.loopEntryConnected} 
	top={loopEntryHandleTop}
	id="loop-entry"
	onclick={handleLoopEntryClick}
	style="left: {loopEntryHandleLeft}px;"
/>

<style>
	/* 隐藏 resize 线条，只保留角落手柄 */
	:global(.svelte-flow__resize-control.line) {
		opacity: 0 !important;
		pointer-events: none !important;
	}

	/* 隐藏除右下角外的手柄 */
	:global(.svelte-flow__resize-control.handle.top-left),
	:global(.svelte-flow__resize-control.handle.top-right),
	:global(.svelte-flow__resize-control.handle.bottom-left) {
		opacity: 0 !important;
		pointer-events: none !important;
	}

	/* 右下角手柄样式 */
	:global(.svelte-flow__resize-control.handle.bottom-right) {
		width: 12px !important;
		height: 12px !important;
		right: 2px !important;
		bottom: 2px !important;
		background: hsl(var(--muted-foreground) / 0.4) !important;
		border: none !important;
		border-radius: 2px !important;
	}

	:global(.svelte-flow__resize-control.handle.bottom-right:hover) {
		background: hsl(var(--primary)) !important;
	}
</style>
