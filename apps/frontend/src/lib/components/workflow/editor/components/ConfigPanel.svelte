<script lang="ts">
	import { workflowState, configPanelRegistry } from '$lib/components/workflow/editor/contexts/index';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';

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

	function handleClose() {
		configPanelRegistry.closePanel();
	}
</script>

{#if selectedNode && PanelComponent}
	<div class="w-[280px] max-h-[400px] rounded-lg border border-border bg-background shadow-lg flex flex-col overflow-hidden">
		<!-- Header -->
		<div class="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
			<div class="flex flex-col">
				<h3 class="text-xs font-medium">节点配置</h3>
				<span class="text-[10px] text-muted-foreground font-mono">{selectedNode.id}</span>
			</div>
			<Button variant="ghost" size="icon" class="h-6 w-6" onclick={handleClose}>
				<Icon icon="mdi:close" width="14" height="14" />
			</Button>
		</div>
		
		<!-- Panel Content -->
		<div class="flex-1 overflow-auto p-3">
			<PanelComponent nodeId={selectedNode.id} data={selectedNode.data} />
		</div>
	</div>
{/if}
