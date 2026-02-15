<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount, tick } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import type { LLMNodeData, ExceptionHandling } from './types.js';
	import { EXCEPTION_HANDLING_OPTIONS } from './types.js';
	import * as Avatar from "@qiyu-allinai/ui/components/avatar/index.js";
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

	// 额外输出引脚配置
	let outputs = $derived(showExceptionHandle ? [{ id: 'exception', top: exceptionHandleTop }] : []);

	onMount(() => {
		configPanelRegistry.register('llm', ConfigPanel);
	});
</script>

<div bind:this={nodeRef}>
	<BaseNode nodeId={id} nodeData={data} {outputs}>
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
			<div class="mt-3 pt-3 border-t border-border">
				<div 
					bind:this={exceptionRowRef}
					class="flex items-center justify-between"
				>
					<div class="flex items-center gap-2">
						<Icon icon="mdi:alert-circle-outline" class="w-4 h-4 text-muted-foreground" />
						<span class="text-xs text-muted-foreground">异常处理</span>
					</div>
					<span class="text-xs font-medium {exceptionHandling === 'fail_branch' ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}">
						{getExceptionLabel(exceptionHandling)}
					</span>
				</div>
			</div>
		{/snippet}
	</BaseNode>
</div>
