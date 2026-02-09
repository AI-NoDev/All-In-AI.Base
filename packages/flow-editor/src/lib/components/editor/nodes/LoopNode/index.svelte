<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Position, NodeResizer } from '@xyflow/svelte';
	import { onMount, tick } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import NodeHandler from '../../handler/NodeHandler.svelte';
	import type { LoopNodeData } from './types.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { configPanelRegistry, workflowState } from '$lib/components/editor/contexts/index.js';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: LoopNodeData;
		selected?: boolean;
	}

	let { id, data, selected = false }: Props = $props();

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(id);
		return (node?.data as LoopNodeData) ?? data;
	});

	// 获取循环节点的尺寸
	let loopWidth = $derived(() => {
		const node = workflowState.getNode(id);
		return node?.width ?? 500;
	});
	
	let loopHeight = $derived(() => {
		const node = workflowState.getNode(id);
		return node?.height ?? 350;
	});

	// 计算子节点的最小包围盒，作为 resizer 的最小尺寸
	const NODE_WIDTH = 240;
	const NODE_HEIGHT = 100;
	const PADDING = 40;
	const HEADER_HEIGHT = 120; // header + padding
	const DEFAULT_MIN_WIDTH = 500;
	const DEFAULT_MIN_HEIGHT = 350;

	let minSize = $derived.by(() => {
		const childNodes = workflowState.nodes.filter(n => n.parentId === id);
		if (childNodes.length === 0) {
			return { width: DEFAULT_MIN_WIDTH, height: DEFAULT_MIN_HEIGHT };
		}
		
		let maxRight = 0;
		let maxBottom = 0;
		
		for (const child of childNodes) {
			const right = child.position.x + NODE_WIDTH;
			const bottom = child.position.y + NODE_HEIGHT;
			if (right > maxRight) maxRight = right;
			if (bottom > maxBottom) maxBottom = bottom;
		}
		
		return {
			width: Math.max(DEFAULT_MIN_WIDTH, maxRight + PADDING),
			height: Math.max(DEFAULT_MIN_HEIGHT, maxBottom + PADDING + HEADER_HEIGHT)
		};
	});

	// 检查循环入口 handle 是否已连接（内部连接）
	let loopEntryConnected = $derived(workflowState.edges.some(e => e.source === id && e.sourceHandle === 'loop-entry'));

	onMount(() => {
		configPanelRegistry.register('loop', ConfigPanel);
	});

	let maxIterations = $derived(currentData.maxIterations ?? 10);
	let breakConditions = $derived(currentData.breakConditions ?? []);

	// 获取循环内的子节点数量
	let childNodeCount = $derived(
		workflowState.nodes.filter(n => n.parentId === id).length
	);

	const menuItems = [
		{ label: '编辑', icon: 'mdi:pencil', action: () => configPanelRegistry.selectNode(id) },
		{ label: '复制', icon: 'mdi:content-copy', action: () => console.log('copy', id) },
		{ label: '删除', icon: 'mdi:delete', action: () => workflowState.removeNode(id), variant: 'destructive' as const },
	];

	/** 点击循环入口引脚，弹出节点选择器 */
	function handleLoopEntryHandleClick(e: MouseEvent) {
		e.stopPropagation();
		
		const node = workflowState.getNode(id);
		if (!node) return;
		
		// 计算引脚在 flow 坐标系中的位置
		// 循环入口引脚在节点内部，使用 loopEntryHandleLeft 作为 X 偏移
		const handleFlowX = node.position.x + loopEntryHandleLeft;
		const handleFlowY = node.position.y + loopEntryHandleTop;
		
		// 将 flow 坐标转换为屏幕坐标
		const screenPos = flowToScreenCoords(handleFlowX, handleFlowY);
		if (!screenPos) return;
		
		// 显示节点选择器（传入 parentLoopId 表示在循环内）
		workflowState.showNodePicker(
			{ x: screenPos.x + 10, y: screenPos.y - 50 },
			id,
			'loop-entry',
			id,
			loopEntryHandleTop
		);
	}
	
	/** 将 flow 坐标转换为屏幕坐标 */
	function flowToScreenCoords(flowX: number, flowY: number): { x: number; y: number } | null {
		const flowElement = document.querySelector('.svelte-flow') as HTMLElement;
		if (!flowElement) return null;
		
		const rect = flowElement.getBoundingClientRect();
		const viewportElement = flowElement.querySelector('.svelte-flow__viewport') as HTMLElement;
		if (!viewportElement) return null;
		
		// 解析 transform 获取 viewport 状态
		const transform = viewportElement.style.transform;
		const match = transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)\s*scale\(([\d.]+)\)/);
		if (!match) return null;
		
		const viewportX = parseFloat(match[1]);
		const viewportY = parseFloat(match[2]);
		const zoom = parseFloat(match[3]);
		
		// flow 坐标 -> 屏幕坐标
		const screenX = rect.left + viewportX + flowX * zoom;
		const screenY = rect.top + viewportY + flowY * zoom;
		
		return { x: screenX, y: screenY };
	}

	// DOM 引用用于动态计算 handle 位置
	let nodeRef: HTMLDivElement | undefined = $state();
	let indicatorRef: HTMLDivElement | undefined = $state();
	let loopEntryHandleTop = $state(100);
	let loopEntryHandleLeft = $state(68);

	// 动态计算循环入口 handle 位置，与 indicator 对齐
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

	/** 处理 resize 事件，更新节点尺寸 */
	function handleResize(event: CustomEvent<{ width: number; height: number }>) {
		const { width, height } = event.detail;
		workflowState.nodes = workflowState.nodes.map(n => 
			n.id === id 
				? { 
					...n, 
					width,
					height,
					style: `width: ${width}px; height: ${height}px;`
				} 
				: n
		);
	}
</script>

<!-- NodeResizer：只在选中时显示，限制最小尺寸为子节点包围盒 -->
<NodeResizer 
	minWidth={minSize.width}
	minHeight={minSize.height}
	isVisible={selected}
	onresize={handleResize}
/>

<div bind:this={nodeRef}>
	<!-- 循环节点：使用 'input' 作为输入引脚 ID，有默认输出引脚 -->
	<BaseNode nodeId={id} nodeData={data} {menuItems} width={loopWidth()} inputId="input">
		{#snippet content(nodeData)}
			<!-- Header -->
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<Avatar.Root class="rounded-lg bg-cyan-500 text-white h-8 w-8">
						<div class="flex items-center justify-center w-full h-full">
							<Icon icon="mdi:infinity" width="18" height="18" />
						</div>
					</Avatar.Root>
					<div class="flex flex-col">
						<span class="text-sm font-semibold text-foreground tracking-tight">{currentData.title || '循环'}</span>
						<span class="text-xs text-muted-foreground">
							最多 {maxIterations} 次
							{#if breakConditions.length > 0}
								· {breakConditions.length} 个终止条件
							{/if}
						</span>
					</div>
				</div>
			</div>

			<!-- 循环体区域 -->
			<div class="loop-body" style="height: {loopHeight() - 120}px;">
				<!-- 循环开始标识（不是节点，只是视觉标识） -->
				<div bind:this={indicatorRef} class="loop-start-indicator" title="循环开始">
					<Icon icon="mdi:location-enter" class="w-4 h-4 text-white" />
				</div>

				<!-- 空状态提示 -->
				{#if childNodeCount === 0}
					<div class="empty-hint">
						<p class="text-sm text-muted-foreground/50">点击引脚添加节点</p>
					</div>
				{/if}
			</div>
		{/snippet}

		{#snippet quickActions()}
			<Button variant="outline" size="icon" class="h-7 w-7 bg-background">
				<Icon icon="mdi:pencil" width="14" height="14" />
			</Button>
		{/snippet}
	</BaseNode>
</div>

<!-- 循环入口引脚（内部，与循环开始标识动态对齐） -->
<NodeHandler 
	type="source" 
	position={Position.Right} 
	connected={loopEntryConnected} 
	top={loopEntryHandleTop}
	id="loop-entry"
	onclick={handleLoopEntryHandleClick}
	style="left: {loopEntryHandleLeft}px;"
/>

<style>
	.loop-body {
		position: relative;
		min-height: 200px;
		margin-top: 12px;
		border: 1px dashed hsl(var(--border));
		border-radius: 6px;
		background: hsl(var(--muted) / 0.3);
	}

	.loop-start-indicator {
		position: absolute;
		left: 16px;
		top: 20px;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: hsl(188 94% 43%);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px hsl(188 94% 43% / 0.3);
		cursor: default;
	}

	.empty-hint {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		pointer-events: none;
	}

	/* NodeResizer 样式 */
	:global(.svelte-flow__resize-control) {
		background: hsl(var(--primary));
		border: 2px solid hsl(var(--background));
		border-radius: 2px;
	}

	:global(.svelte-flow__resize-control:hover) {
		background: hsl(var(--primary) / 0.8);
	}

	:global(.svelte-flow__resize-control.line) {
		border: none;
		background: transparent;
	}

	:global(.svelte-flow__resize-control.line:hover) {
		background: hsl(var(--primary) / 0.3);
	}
</style>
