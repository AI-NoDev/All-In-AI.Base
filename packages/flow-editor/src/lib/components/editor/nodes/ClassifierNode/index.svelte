<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Position } from '@xyflow/svelte';
	import { onMount, tick } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import NodeHandler from '../../handler/NodeHandler.svelte';
	import type { ClassifierNodeData } from './types.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { configPanelRegistry, workflowState } from '$lib/components/editor/contexts/index.js';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: ClassifierNodeData;
	}

	let { id, data }: Props = $props();

	// 检查 target handle 是否已连接
	let targetConnected = $derived(workflowState.edges.some(e => e.target === id));

	// 检查每个分类选项的 source handle 是否已连接
	function isOptionConnected(optionId: string): boolean {
		return workflowState.edges.some(e => e.source === id && e.sourceHandle === optionId);
	}

	onMount(() => {
		configPanelRegistry.register('classifier', ConfigPanel);
	});

	const menuItems = [
		{ label: '编辑', icon: 'mdi:pencil', action: () => configPanelRegistry.selectNode(id) },
		{ label: '复制', icon: 'mdi:content-copy', action: () => console.log('copy', id) },
		{ label: '删除', icon: 'mdi:delete', action: () => console.log('delete', id), variant: 'destructive' as const },
	];

	let options = $derived(data.options ?? []);

	// 存储每个选项行的 DOM 引用
	let optionRefs: HTMLDivElement[] = [];
	let nodeRef: HTMLDivElement | undefined = $state();
	let handleTops: number[] = $state([]);

	// 当选项或 DOM 变化时，重新计算位置
	$effect(() => {
		if (nodeRef && options.length > 0) {
			tick().then(() => {
				const nodeRect = nodeRef!.getBoundingClientRect();
				handleTops = optionRefs.map(ref => {
					if (!ref) return 0;
					const rect = ref.getBoundingClientRect();
					// 计算选项行中心相对于节点顶部的位置
					return rect.top - nodeRect.top + rect.height / 2;
				});
			});
		}
	});
</script>

<div bind:this={nodeRef}>
	<BaseNode nodeId={id} nodeData={data} {menuItems}>
		{#snippet content(nodeData)}
			<!-- Header -->
			<div class="flex items-center gap-3">
				<Avatar.Root class="rounded-lg bg-amber-500 text-white h-8 w-8">
					<div class="flex items-center justify-center w-full h-full">
						<Icon icon="mdi:source-branch" width="18" height="18" />
					</div>
				</Avatar.Root>
				<div class="flex flex-col">
					<span class="text-sm font-semibold text-foreground tracking-tight">{nodeData.title || '问题分类器'}</span>
					{#if options.length > 0}
						<span class="text-xs text-muted-foreground">{options.length} 个分类</span>
					{/if}
				</div>
			</div>

			<!-- 分类选项列表 -->
			{#if options.length > 0}
				<div class="mt-3 border-t border-border -mx-3 px-3 pt-2">
					{#each options as option, index (option.id)}
						<div 
							bind:this={optionRefs[index]}
							class="flex items-center gap-2 py-2 text-xs {index > 0 ? 'border-t border-border/50' : ''}"
						>
							<div class="w-5 h-5 rounded bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 font-medium">
								{index + 1}
							</div>
							<span class="flex-1 text-foreground truncate">{option.label}</span>
						</div>
					{/each}
				</div>
			{/if}
		{/snippet}

		{#snippet quickActions()}
			<Button variant="outline" size="icon" class="h-7 w-7 bg-background">
				<Icon icon="mdi:pencil" width="14" height="14" />
			</Button>
		{/snippet}
	</BaseNode>
</div>

<!-- 输入引脚对齐 header 中心：padding(12) + avatar高度(32)/2 = 28px -->
<NodeHandler type="target" position={Position.Left} connected={targetConnected} top={28} />

<!-- 每个分类选项对应一个输出引脚，位置动态计算 -->
{#each options as option, index (option.id)}
	<NodeHandler 
		type="source" 
		position={Position.Right} 
		id={option.id}
		connected={isOptionConnected(option.id)} 
		top={handleTops[index] ?? 0} 
	/>
{/each}
