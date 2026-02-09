<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import type { AgentNodeData } from './types.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { configPanelRegistry, workflowState } from '$lib/components/editor/contexts/index.js';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: AgentNodeData;
	}

	let { id, data }: Props = $props();

	// Agent 颜色
	let agentColor = $derived(data.agentColor ?? '#14b8a6');

	onMount(() => {
		configPanelRegistry.register('agent', ConfigPanel);
	});

	const menuItems = [
		{ label: '编辑', icon: 'mdi:pencil', action: () => configPanelRegistry.selectNode(id) },
		{ label: '复制', icon: 'mdi:content-copy', action: () => console.log('copy', id) },
		{ label: '删除', icon: 'mdi:delete', action: () => workflowState.removeNode(id), variant: 'destructive' as const },
	];
</script>

<BaseNode nodeId={id} nodeData={data} {menuItems} outputId="source">
	{#snippet content(nodeData)}
		<div class="flex items-center gap-3">
			<Avatar.Root class="rounded-lg text-white h-8 w-8" style="background-color: {agentColor}">
				<div class="flex items-center justify-center w-full h-full">
					<Icon icon="mdi:robot-outline" width="18" height="18" />
				</div>
			</Avatar.Root>
			<div class="flex flex-col">
				<span class="text-sm font-semibold text-foreground tracking-tight">{nodeData.title || 'Agent'}</span>
				{#if nodeData.agentName}
					<span class="text-xs text-muted-foreground">{nodeData.agentName}</span>
				{:else}
					<span class="text-xs text-amber-500">未选择智能体</span>
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
