<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Position } from '@xyflow/svelte';
	import { onMount, tick } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import NodeHandler from '../../handler/NodeHandler.svelte';
	import type { LLMNodeData, ExceptionHandling } from './types.js';
	import { EXCEPTION_HANDLING_OPTIONS } from './types.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { configPanelRegistry, workflowState } from '$lib/components/editor/contexts/index.js';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: LLMNodeData;
	}

	let { id, data }: Props = $props();

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(id);
		return node?.data as LLMNodeData | undefined;
	});

	// 异常处理方式
	let exceptionHandling = $derived(currentData?.exceptionHandling ?? 'none');

	// 获取异常处理显示文本
	function getExceptionLabel(value: ExceptionHandling): string {
		return EXCEPTION_HANDLING_OPTIONS.find(o => o.value === value)?.label ?? '无';
	}

	// 检查 handle 是否已连接
	let sourceConnected = $derived(workflowState.edges.some(e => e.source === id && e.sourceHandle === 'output'));
	let targetConnected = $derived(workflowState.edges.some(e => e.target === id));
	let exceptionConnected = $derived(workflowState.edges.some(e => e.source === id && e.sourceHandle === 'exception'));

	// 是否显示异常分支 handle
	let showExceptionHandle = $derived(exceptionHandling === 'fail_branch');

	// DOM 引用和位置计算
	let nodeRef: HTMLDivElement | undefined = $state();
	let exceptionRowRef: HTMLDivElement | undefined = $state();
	let exceptionHandleTop = $state(76);

	// 动态计算异常分支 handle 位置
	$effect(() => {
		if (nodeRef && exceptionRowRef && exceptionHandling === 'fail_branch') {
			tick().then(() => {
				const nodeRect = nodeRef!.getBoundingClientRect();
				const rowRect = exceptionRowRef!.getBoundingClientRect();
				exceptionHandleTop = rowRect.top - nodeRect.top + rowRect.height / 2;
			});
		}
	});

	onMount(() => {
		configPanelRegistry.register('llm', ConfigPanel);
	});

	const menuItems = [
		{ label: '编辑', icon: 'mdi:pencil', action: () => configPanelRegistry.selectNode(id) },
		{ label: '复制', icon: 'mdi:content-copy', action: () => console.log('copy', id) },
		{ label: '删除', icon: 'mdi:delete', action: () => console.log('delete', id), variant: 'destructive' as const },
	];
</script>

<div bind:this={nodeRef}>
	<BaseNode nodeId={id} nodeData={data} {menuItems}>
		{#snippet content(nodeData)}
			<div class="flex items-center gap-3">
				<Avatar.Root class="rounded-lg bg-blue-500 text-white h-8 w-8">
					<div class="flex items-center justify-center w-full h-full">
						<Icon icon="mdi:robot" width="18" height="18" />
					</div>
				</Avatar.Root>
				<div class="flex flex-col">
					<span class="text-sm font-semibold text-foreground tracking-tight">{nodeData.title || 'LLM'}</span>
					{#if nodeData.model}
						<span class="text-xs text-muted-foreground">{nodeData.model}</span>
					{/if}
				</div>
			</div>

			<!-- 异常处理行 -->
			<div 
				bind:this={exceptionRowRef}
				class="mt-3 pt-3 border-t border-border flex items-center justify-between"
			>
				<div class="flex items-center gap-2">
					<Icon icon="mdi:alert-circle-outline" class="w-4 h-4 text-muted-foreground" />
					<span class="text-xs text-muted-foreground">异常处理</span>
				</div>
				<span class="text-xs font-medium {exceptionHandling === 'fail_branch' ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}">
					{getExceptionLabel(exceptionHandling)}
				</span>
			</div>
		{/snippet}

		{#snippet quickActions()}
			<Button variant="outline" size="icon" class="h-7 w-7 bg-background">
				<Icon icon="mdi:pencil" width="14" height="14" />
			</Button>
		{/snippet}
	</BaseNode>
</div>

<!-- 引脚对齐 header 中心：padding(12) + avatar高度(32)/2 = 28px -->
<NodeHandler type="target" position={Position.Left} connected={targetConnected} top={28} />
<NodeHandler type="source" position={Position.Right} connected={sourceConnected} top={28} id="output" />

<!-- 异常分支输出引脚（始终存在，通过 style 控制显示/隐藏） -->
<NodeHandler 
	type="source" 
	position={Position.Right} 
	connected={exceptionConnected} 
	top={exceptionHandleTop}
	id="exception"
	style={showExceptionHandle ? '' : 'opacity: 0; pointer-events: none;'}
/>
