<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import type { OutputNodeData } from './types.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { configPanelRegistry, workflowState } from '$lib/components/editor/contexts/index.js';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: OutputNodeData;
	}

	let { id, data }: Props = $props();

	// 获取变量数量
	let variableCount = $derived(data.variables?.length ?? 0);

	onMount(() => {
		configPanelRegistry.register('output', ConfigPanel);
	});

	const menuItems = [
		{ label: '编辑', icon: 'mdi:pencil', action: () => configPanelRegistry.selectNode(id) },
		{ label: '复制', icon: 'mdi:content-copy', action: () => console.log('copy', id) },
		{ label: '删除', icon: 'mdi:delete', action: () => workflowState.removeNode(id), variant: 'destructive' as const },
	];
</script>

<!-- 输出节点：有输入引脚，无输出引脚 -->
<BaseNode nodeId={id} nodeData={data} {menuItems} showOutput={false}>
	{#snippet content(nodeData)}
		<div class="flex items-center gap-3">
			<Avatar.Root class="rounded-lg bg-orange-500 text-white h-8 w-8">
				<div class="flex items-center justify-center w-full h-full">
					<Icon icon="mdi:export" width="18" height="18" />
				</div>
			</Avatar.Root>
			<div class="flex flex-col">
				<span class="text-sm font-semibold text-foreground tracking-tight">{nodeData.title || '输出'}</span>
				{#if variableCount > 0}
					<span class="text-xs text-muted-foreground">{variableCount} 个输出变量</span>
				{:else}
					<span class="text-xs text-muted-foreground">未配置输出变量</span>
				{/if}
			</div>
		</div>
	{/snippet}

	{#snippet quickActions()}
		<Button variant="outline" size="icon" class="h-7 w-7 bg-background">
			<Icon icon="mdi:pencil" width="14" height="14" />
		</Button>
	{/snippet}
</BaseNode>
