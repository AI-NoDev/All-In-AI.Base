<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import BaseNode from '../BaseNode.svelte';
	import type { KnowledgeNodeData } from './types.js';
	import * as Avatar from "@qiyu-allinai/ui/components/avatar/index.js";
	import { configPanelRegistry } from '$lib/components/editor/contexts/index.js';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: KnowledgeNodeData;
	}

	let { id, data }: Props = $props();

	onMount(() => {
		configPanelRegistry.register('knowledge', ConfigPanel);
	});
</script>

<BaseNode nodeId={id} nodeData={data} outputId="source">
	{#snippet content(nodeData)}
		<div class="flex items-center gap-3">
			<Avatar.Root class="rounded-lg bg-purple-500 text-white h-8 w-8">
				<div class="flex items-center justify-center w-full h-full">
					<Icon icon="mdi:database-search" width="18" height="18" />
				</div>
			</Avatar.Root>
			<div class="flex flex-col">
				<span class="text-sm font-semibold text-foreground tracking-tight">{nodeData.title || '知识检索'}</span>
				<span class="text-xs text-muted-foreground">Top {nodeData.topK ?? 3}</span>
			</div>
		</div>
	{/snippet}
</BaseNode>
