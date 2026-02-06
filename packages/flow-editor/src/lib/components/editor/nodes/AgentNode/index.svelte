<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Position } from '@xyflow/svelte';
	import { onMount } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import NodeHandler from '../../handler/NodeHandler.svelte';
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

	// 检查 handle 是否已连接
	let sourceConnected = $derived(workflowState.edges.some(e => e.source === id));
	let targetConnected = $derived(workflowState.edges.some(e => e.target === id));

	onMount(() => {
		configPanelRegistry.register('agent', ConfigPanel);
	});

	const menuItems = [
		{ label: '编辑', icon: 'mdi:pencil', action: () => configPanelRegistry.selectNode(id) },
		{ label: '复制', icon: 'mdi:content-copy', action: () => console.log('copy', id) },
		{ label: '删除', icon: 'mdi:delete', action: () => console.log('delete', id), variant: 'destructive' as const },
	];
</script>

<BaseNode nodeId={id} nodeData={data} {menuItems}>
	{#snippet content(nodeData)}
		<div class="flex items-center gap-3">
			<Avatar.Root class="rounded-lg bg-teal-500 text-white h-8 w-8">
				<div class="flex items-center justify-center w-full h-full">
					<Icon icon="mdi:robot-outline" width="18" height="18" />
				</div>
			</Avatar.Root>
			<div class="flex flex-col">
				<span class="text-sm font-semibold text-foreground tracking-tight">{nodeData.title || 'Agent'}</span>
				{#if nodeData.agentName}
					<span class="text-xs text-muted-foreground">{nodeData.agentName}</span>
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

<!-- 输入/输出引脚对齐 header 中心：padding(12) + avatar高度(32)/2 = 28px -->
<NodeHandler type="target" position={Position.Left} connected={targetConnected} top={28} />
<NodeHandler type="source" position={Position.Right} connected={sourceConnected} top={28} />
