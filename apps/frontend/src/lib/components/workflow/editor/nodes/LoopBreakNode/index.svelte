<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import type { LoopBreakNodeData } from './types';
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { configPanelRegistry, workflowState } from '$lib/components/workflow/editor/contexts/index';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: LoopBreakNodeData;
		selected?: boolean;
	}

	let { id, data, selected = false }: Props = $props();

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(id);
		return (node?.data as LoopBreakNodeData) ?? data;
	});

	onMount(() => {
		configPanelRegistry.register('loop-break', ConfigPanel);
	});
</script>

<!-- LoopBreakNode: 只有输入引脚（使用 'input' ID），没有输出引脚 -->
<BaseNode nodeId={id} nodeData={data} inputId="input" showOutput={false}>
	{#snippet content(nodeData)}
		<div class="flex items-center gap-3">
			<Avatar.Root class="rounded-lg bg-red-500 text-white h-8 w-8">
				<div class="flex items-center justify-center w-full h-full">
					<Icon icon="mdi:exit-run" width="18" height="18" />
				</div>
			</Avatar.Root>
			<div class="flex flex-col">
				<span class="text-sm font-semibold text-foreground tracking-tight">{currentData.title || '退出循环'}</span>
				{#if currentData.reason}
					<span class="text-xs text-muted-foreground">{currentData.reason}</span>
				{:else}
					<span class="text-xs text-muted-foreground">提前退出当前循环</span>
				{/if}
			</div>
		</div>
	{/snippet}
</BaseNode>
