<script lang="ts" generics="T extends BaseNodeData">
	import type { Snippet } from 'svelte';
	import type { BaseNodeData, NodeRunStatus } from '$lib/components/workflow/types/index';
	import type { OutputHandle } from './types';
	import { Position } from '@xyflow/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Icon from '@iconify/svelte';
	import { configPanelRegistry, workflowState, runningState } from '$lib/components/workflow/editor/contexts/index';
	import NodeHandler from '../handler/NodeHandler.svelte';

	interface Props {
		nodeId: string;
		nodeData: T;
		content?: Snippet<[T]>;
		/** 快捷操作按钮 (显示在三点菜单左侧) */
		quickActions?: Snippet;
		/** 固定宽度 (默认 min-w-[240px]) */
		width?: number | (() => number);
		/** 固定高度 (可选，用于循环节点等需要动态高度的场景) */
		height?: number | (() => number);
		/** 是否可运行（默认 true，开始节点等设为 false）*/
		runnable?: boolean;
		
		// === 引脚配置 ===
		/** 是否显示输入引脚（默认 true，开始节点设为 false）*/
		showInput?: boolean;
		/** 输入引脚 ID（默认 'target'，循环节点用 'input'）*/
		inputId?: string;
		/** 是否显示默认输出引脚（默认 true，输出节点/分支节点设为 false）*/
		showOutput?: boolean;
		/** 默认输出引脚 ID（默认 'output'，开始节点用 'source'）*/
		outputId?: string;
		
		/** 额外输出引脚列表（用于分支节点、异常分支等）*/
		outputs?: OutputHandle[];
	}

	let { 
		nodeId, 
		nodeData, 
		content, 
		quickActions, 
		width,
		height,
		runnable = true,
		showInput = true,
		inputId = 'target',
		showOutput = true,
		outputId = 'output',
		outputs = []
	}: Props = $props();

	// 计算宽度
	let computedWidth = $derived(typeof width === 'function' ? width() : width);
	// 计算高度
	let computedHeight = $derived(typeof height === 'function' ? height() : height);

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

	// === 运行状态 ===
	let runStatus = $derived<NodeRunStatus>(nodeData._run?.status ?? 'idle');
	let runElapsed = $derived(nodeData._run?.elapsed);

	// 边框样式：选中状态优先 > 运行状态 > 默认
	let borderClass = $derived.by(() => {
		// 选中状态优先
		if (isHighlighted) {
			return 'border-primary';
		}
		// 运行状态次之
		switch (runStatus) {
			case 'waiting': return 'border-amber-400 dark:border-amber-500';
			case 'running': return 'border-green-500 dark:border-green-400';
			case 'success': return 'border-green-500 dark:border-green-400';
			case 'error': return 'border-red-500 dark:border-red-400';
			default: return 'border-border';
		}
	});

	// 格式化运行时间
	function formatElapsed(ms: number | undefined): string {
		if (ms === undefined) return '';
		if (ms < 1000) return `${ms}ms`;
		return `${(ms / 1000).toFixed(2)}s`;
	}

	// 是否正在运行
	let isNodeRunning = $derived(runStatus === 'running');

	/** 运行此节点 */
	async function handleRunNode() {
		if (!runnable || isNodeRunning) return;
		const node = workflowState.getNode(nodeId);
		if (!node) return;
		
		try {
			runningState.startRun(true);
			await runningState.runNode(nodeId, node.type ?? 'unknown', node.data);
		} catch (error) {
			console.error('Node run failed:', error);
		} finally {
			runningState.endRun();
		}
	}

	/** 删除节点 */
	function handleDeleteNode() {
		workflowState.removeNode(nodeId);
	}

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
	class="group relative rounded-lg border bg-card text-xs shadow-sm transition-colors {borderClass}
		{isHighlighted ? 'outline outline-1 outline-primary outline-offset-1 shadow-primary/15 shadow-lg' : ''}
		{isPlacing ? 'opacity-70 pointer-events-none ring-2 ring-primary ring-offset-2 animate-pulse' : ''}
		{runStatus === 'running' ? 'animate-pulse' : ''}"
	style:width={computedWidth ? `${computedWidth}px` : undefined}
	style:height={computedHeight ? `${computedHeight}px` : undefined}
	style:min-width={computedWidth ? undefined : '240px'}
>
	<!-- 运行状态指示器 -->
	{#if runStatus !== 'idle'}
		<div class="absolute -top-2 -right-2 z-10">
			{#if runStatus === 'waiting'}
				<div class="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white">
					<Icon icon="mdi:clock-outline" width="12" height="12" />
				</div>
			{:else if runStatus === 'running'}
				<div class="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white animate-spin">
					<Icon icon="mdi:loading" width="12" height="12" />
				</div>
			{:else if runStatus === 'success'}
				<div class="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white">
					<Icon icon="mdi:check" width="12" height="12" />
				</div>
			{:else if runStatus === 'error'}
				<div class="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white">
					<Icon icon="mdi:close" width="12" height="12" />
				</div>
			{/if}
		</div>
	{/if}

	<!-- 运行耗时显示 -->
	{#if runElapsed !== undefined && (runStatus === 'success' || runStatus === 'error')}
		<div class="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground whitespace-nowrap">
			{formatElapsed(runElapsed)}
		</div>
	{/if}

	<!-- Toolbar: 运行按钮 + 三点菜单 -->
	<div class="absolute -top-9 right-0 flex items-center gap-1 opacity-0 transition-opacity
		{isHighlighted ? 'opacity-100' : 'group-hover:opacity-100'}">
		
		<!-- 快捷操作按钮 -->
		{#if quickActions}
			{@render quickActions()}
		{/if}

		<!-- 运行按钮 -->
		{#if runnable}
			<Button 
				variant="outline" 
				size="icon" 
				class="h-7 w-7 bg-background"
				onclick={handleRunNode}
				disabled={isNodeRunning}
			>
				{#if isNodeRunning}
					<Icon icon="mdi:loading" width="14" height="14" class="animate-spin" />
				{:else}
					<Icon icon="mdi:play" width="14" height="14" />
				{/if}
			</Button>
		{/if}

		<!-- 三点菜单 -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" size="icon" class="h-7 w-7 bg-background">
						<Icon icon="mdi:dots-horizontal" width="16" height="16" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="min-w-[140px]">
				{#if runnable}
					<DropdownMenu.Item onclick={handleRunNode} disabled={isNodeRunning}>
						<Icon icon="mdi:play" width="14" height="14" class="mr-2" />
						运行此步
					</DropdownMenu.Item>
					<DropdownMenu.Separator />
				{/if}
				<DropdownMenu.Item onclick={handleDeleteNode} class="text-destructive focus:text-destructive">
					<Icon icon="mdi:delete" width="14" height="14" class="mr-2" />
					删除
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<!-- 节点内容 -->
	{#if content}
		<div class="p-3 text-muted-foreground" class:h-full={!!computedHeight} class:flex={!!computedHeight} class:flex-col={!!computedHeight}>
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

<!-- 输入引脚（除开始节点外都有）-->
{#if showInput}
	<NodeHandler 
		type="target" 
		position={Position.Left} 
		connected={inputConnected} 
		top={HEADER_HANDLE_TOP} 
		id={inputId} 
	/>
{/if}

<!-- 默认输出引脚（在 header 右侧）-->
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
