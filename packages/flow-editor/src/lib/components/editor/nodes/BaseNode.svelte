<script lang="ts" generics="T extends BaseNodeData">
	import type { Snippet } from 'svelte';
	import type { BaseNodeData } from '$lib/types/index.js';
	import { Position } from '@xyflow/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Icon from '@iconify/svelte';
	import { configPanelRegistry, workflowState } from '$lib/components/editor/contexts/index.js';
	import NodeHandler from '../handler/NodeHandler.svelte';

	/** 输出引脚配置 */
	export interface OutputHandle {
		/** 引脚 ID */
		id: string;
		/** 引脚位置（相对于节点顶部的 px 值） */
		top: number;
		/** 是否显示（默认 true） */
		visible?: boolean;
	}

	interface MenuItem {
		label: string;
		icon?: string;
		action: () => void;
		variant?: 'default' | 'destructive';
	}

	interface Props {
		nodeId: string;
		nodeData: T;
		content?: Snippet<[T]>;
		/** 快捷操作按钮 (显示在三点菜单左边) */
		quickActions?: Snippet;
		/** 下拉菜单项 */
		menuItems?: MenuItem[];
		/** 固定宽度 (默认 min-w-[240px]) */
		width?: number | (() => number);
		
		// === 引脚配置 ===
		/** 是否显示输入引脚（默认 true，开始节点设为 false） */
		showInput?: boolean;
		/** 输入引脚 ID（默认 'target'，循环节点用 'input'） */
		inputId?: string;
		/** 是否显示默认输出引脚（默认 true，输出节点/分支节点设为 false） */
		showOutput?: boolean;
		/** 默认输出引脚 ID（默认 'output'，开始节点用 'source'） */
		outputId?: string;
		
		/** 额外输出引脚列表（用于分支节点、异常分支等） */
		outputs?: OutputHandle[];
	}

	let { 
		nodeId, 
		nodeData, 
		content, 
		quickActions, 
		menuItems = [], 
		width,
		showInput = true,
		inputId = 'target',
		showOutput = true,
		outputId = 'output',
		outputs = []
	}: Props = $props();

	// 计算宽度
	let computedWidth = $derived(typeof width === 'function' ? width() : width);

	// 是否有描述
	let hasDesc = $derived(!!nodeData.desc);

	// 根据 configPanelRegistry 判断是否高亮
	let isHighlighted = $derived(configPanelRegistry.selectedNodeId === nodeId);
	
	// 是否正在放置此节点
	let isPlacing = $derived(workflowState.placingNodeId === nodeId);

	// 检查当前节点是否在循环内
	let parentLoopId = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.parentId;
	});

	// === 引脚连接状态 ===
	let inputConnected = $derived(workflowState.edges.some(e => e.target === nodeId && e.targetHandle === inputId));
	let outputConnected = $derived(workflowState.edges.some(e => e.source === nodeId && e.sourceHandle === outputId));

	function isOutputConnected(handleId: string): boolean {
		return workflowState.edges.some(e => e.source === nodeId && e.sourceHandle === handleId);
	}

	// Header 引脚固定位置：padding(12) + avatar高度(32)/2 = 28px
	const HEADER_HANDLE_TOP = 28;

	// === 引脚点击处理 ===
	/** 
	 * 基于节点宽度计算 NodePicker 位置
	 * 将 flow 坐标转换为屏幕坐标
	 */
	function handleOutputClick(handleId: string, handleTop: number) {
		return (_e: MouseEvent) => {
			const node = workflowState.getNode(nodeId);
			if (!node) return;
			
			// 获取节点的实际宽度（动态节点如循环节点会有 width 属性）
			const nodeWidth = node.width ?? computedWidth ?? 240;
			
			// 计算引脚在 flow 坐标系中的位置
			const handleFlowX = node.position.x + nodeWidth;
			const handleFlowY = node.position.y + handleTop;
			
			// 将 flow 坐标转换为屏幕坐标
			const screenPos = flowToScreenCoords(handleFlowX, handleFlowY);
			if (!screenPos) return;
			
			// NodePicker 显示在引脚右侧，稍微向上偏移
			workflowState.showNodePicker(
				{ x: screenPos.x + 10, y: screenPos.y - 50 },
				nodeId,
				handleId,
				parentLoopId,
				handleTop
			);
		};
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
</script>

<div
	class="group relative rounded-lg border border-border bg-card text-xs shadow-sm transition-all
		{isHighlighted ? 'outline outline-1 outline-primary outline-offset-1 shadow-primary/15 shadow-lg' : ''}
		{isPlacing ? 'opacity-70 pointer-events-none ring-2 ring-primary ring-offset-2 animate-pulse' : ''}"
	style:width={computedWidth ? `${computedWidth}px` : undefined}
	style:min-width={computedWidth ? undefined : '240px'}
>
	<!-- Toolbar: 快捷按钮 + 三点菜单 -->
	<div class="absolute -top-9 right-0 flex items-center gap-1 opacity-0 transition-opacity
		{isHighlighted ? 'opacity-100' : 'group-hover:opacity-100'}">
		
		<!-- 快捷操作按钮 -->
		{#if quickActions}
			{@render quickActions()}
		{/if}

		<!-- 三点菜单 -->
		{#if menuItems.length > 0}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" size="icon" class="h-7 w-7 bg-background">
							<Icon icon="mdi:dots-horizontal" width="16" height="16" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="min-w-[140px]">
					{#each menuItems as item}
						<DropdownMenu.Item 
							onclick={item.action}
							class={item.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
						>
							{#if item.icon}
								<Icon icon={item.icon} width="14" height="14" class="mr-2" />
							{/if}
							{item.label}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</div>

	<!-- 节点内容 -->
	{#if content}
		<div class="p-3 text-muted-foreground">
			{@render content(nodeData)}
		</div>
	{/if}

	<!-- 描述 Footer -->
	{#if hasDesc}
		<div class="border-t border-border px-3 py-2 text-xs text-muted-foreground break-words">
			{nodeData.desc}
		</div>
	{/if}
</div>

<!-- === 引脚渲染 === -->

<!-- 输入引脚（除开始节点外都有） -->
{#if showInput}
	<NodeHandler 
		type="target" 
		position={Position.Left} 
		connected={inputConnected} 
		top={HEADER_HANDLE_TOP} 
		id={inputId} 
	/>
{/if}

<!-- 默认输出引脚（在 header 右侧） -->
{#if showOutput}
	<NodeHandler 
		type="source" 
		position={Position.Right} 
		connected={outputConnected} 
		top={HEADER_HANDLE_TOP} 
		id={outputId}
		onclick={handleOutputClick(outputId, HEADER_HANDLE_TOP)}
	/>
{/if}

<!-- 额外输出引脚 -->
{#each outputs as output (output.id)}
	{#if output.visible !== false}
		<NodeHandler 
			type="source" 
			position={Position.Right} 
			connected={isOutputConnected(output.id)} 
			top={output.top}
			id={output.id}
			onclick={handleOutputClick(output.id, output.top)}
		/>
	{/if}
{/each}
