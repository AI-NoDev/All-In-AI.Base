<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import type { AgentNodeData } from './types.js';
	import * as Avatar from "@qiyu-allinai/ui/components/avatar/index.js";
	import { configPanelRegistry } from '$lib/components/editor/contexts/index.js';
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
</script>

<BaseNode nodeId={id} nodeData={data} outputId="source">
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
</BaseNode>
