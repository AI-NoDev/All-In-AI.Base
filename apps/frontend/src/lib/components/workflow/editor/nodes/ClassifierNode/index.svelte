<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount, tick } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import type { OutputHandle } from '../types';
	import type { ClassifierNodeData, ClassifierOption } from './types';
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { configPanelRegistry, workflowState } from '$lib/components/workflow/editor/contexts/index';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: ClassifierNodeData;
	}

	let { id, data }: Props = $props();

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(id);
		return (node?.data as ClassifierNodeData) ?? data;
	});

	onMount(() => {
		configPanelRegistry.register('classifier', ConfigPanel);
	});

	let options = $derived<ClassifierOption[]>(currentData.options ?? []);

	// DOM 引用用于计算引脚位置
	let nodeRef: HTMLDivElement | undefined = $state();
	let optionRefs: HTMLDivElement[] = $state([]);
	let handleTops: number[] = $state([]);

	// 动态计算引脚位置
	$effect(() => {
		if (nodeRef && options.length > 0) {
			tick().then(() => {
				const nodeRect = nodeRef!.getBoundingClientRect();
				handleTops = optionRefs.map(ref => {
					if (!ref) return 0;
					const rect = ref.getBoundingClientRect();
					return rect.top - nodeRect.top + rect.height / 2;
				});
			});
		}
	});

	// 构建输出引脚配置
	let outputs = $derived<OutputHandle[]>(
		options.map((opt, i) => ({ id: opt.id, top: handleTops[i] ?? 0 }))
	);
</script>

<div bind:this={nodeRef}>
	<!-- 分类器节点：有输入引脚，无默认输出引脚（使用 outputs 配置分支引脚） -->
	<BaseNode nodeId={id} nodeData={data} showOutput={false} {outputs}>
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
						<span class="text-xs text-muted-foreground">{options.length} 个分支</span>
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
	</BaseNode>
</div>
