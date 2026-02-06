<script lang="ts">
	import { workflowState, configPanelRegistry } from '$lib/components/editor/contexts/index.js';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Icon from '@iconify/svelte';
	import MiniMapPanel from './MiniMap/MiniMapPanel.svelte';

	// 获取选中节点的数据
	let selectedNode = $derived.by(() => {
		const nodeId = configPanelRegistry.selectedNodeId;
		if (!nodeId) return null;
		return workflowState.nodes.find(n => n.id === nodeId) ?? null;
	});

	// 获取对应的配置面板组件
	let PanelComponent = $derived.by(() => {
		if (!selectedNode) return null;
		return configPanelRegistry.getPanel(selectedNode.type ?? '');
	});

	// 面板是否展开：有选中节点 + 有对应的配置组件
	let isExpanded = $derived(!!selectedNode && !!PanelComponent);

	function handleClose() {
		configPanelRegistry.closePanel();
	}
</script>

<!-- 容器：始终存在，用于定位 MiniMap -->
<div class="absolute top-0 right-0 bottom-0 pointer-events-none" style:width={isExpanded ? '416px' : '0px'}>
	<!-- MiniMap 始终可见，在左下角外部 -->
	<div class="absolute bottom-4 pointer-events-auto" style:left="-{133 + 16}px">
		<MiniMapPanel />
	</div>

	<!-- 配置面板：悬空 Card 样式 -->
	{#if isExpanded && PanelComponent && selectedNode}
		<Card.Root class="absolute top-4 right-4 bottom-4 w-[400px] flex flex-col pointer-events-auto shadow-lg">
			<!-- 关闭按钮在右上角外部 -->
			<Button 
				variant="secondary" 
				size="icon" 
				class="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-10" 
				onclick={handleClose}
			>
				<Icon icon="mdi:close" width="14" height="14" />
			</Button>
			<Card.Header class="pb-2">
				<Card.Title class="text-sm font-medium">节点配置</Card.Title>
			</Card.Header>
			<Card.Content class="flex-1 overflow-auto">
				<PanelComponent nodeId={selectedNode.id} data={selectedNode.data} />
			</Card.Content>
		</Card.Root>
	{/if}
</div>
