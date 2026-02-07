<script lang="ts">
	import { SvelteFlow, SvelteFlowProvider, Controls, BackgroundVariant, Background } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { workflowState, configPanelRegistry } from '$lib/components/editor/contexts/index.js';
	import { StartNode, LLMNode, KnowledgeNode, OutputNode, AgentNode, ClassifierNode } from './nodes/index.js';
	import ConnectionLine from './connections/ConnectionLine.svelte';
	import ThemeEditorControls from './components/ThemeEditorControls.svelte';
	import ContextMenu from './components/ContextMenu.svelte';
	import RightPanel from './components/RightPanel.svelte';
	import GlobalActions from './components/GlobalActions.svelte';

	const nodeTypes = {
		start: StartNode,
		llm: LLMNode,
		knowledge: KnowledgeNode,
		output: OutputNode,
		agent: AgentNode,
		classifier: ClassifierNode
	};

	let contextMenu: ContextMenu;

	function handlePaneContextMenu({ event }: { event: MouseEvent }) {
		contextMenu.show(event);
	}

	// 同步节点选中状态到 configPanelRegistry
	$effect(() => {
		const selectedNodes = workflowState.nodes.filter(n => n.selected);
		if (selectedNodes.length === 1) {
			// 选中了一个节点，更新 panel
			configPanelRegistry.selectNode(selectedNodes[0].id);
		}
		// 如果没有选中节点，不做任何操作（保持 panel 状态）
	});

	// 全局操作回调
	function handleTestRun() {
		console.log('Test run');
	}

	function handleViewHistory() {
		console.log('View run history');
	}

	function handleViewIssues() {
		console.log('View issues');
	}

	function handlePublish() {
		console.log('Publish to production');
	}

	function handlePublishDraft() {
		console.log('Save as draft');
	}

	function handleVersionHistory() {
		console.log('Version history');
	}
</script>

<SvelteFlowProvider>
	<div class="relative h-full w-full">
		<SvelteFlow
			bind:nodes={workflowState.nodes}
			bind:edges={workflowState.edges}
			{nodeTypes}
			connectionLineComponent={ConnectionLine}
			onpanecontextmenu={handlePaneContextMenu}
			minZoom={0.5}
			maxZoom={2}
		>
			<Background variant={BackgroundVariant.Dots} />
			<Controls position="bottom-left">
				<ThemeEditorControls />
			</Controls>
		</SvelteFlow>
		<ContextMenu bind:this={contextMenu} />
		
		<!-- 全局操作栏 -->
		<GlobalActions
			onTestRun={handleTestRun}
			onViewHistory={handleViewHistory}
			onViewIssues={handleViewIssues}
			onPublish={handlePublish}
			onPublishDraft={handlePublishDraft}
			onVersionHistory={handleVersionHistory}
		/>
		
		<!-- 右侧配置面板 -->
		<RightPanel />
	</div>
</SvelteFlowProvider>

<style>
	/* 移除 xyflow 默认的节点边框和选中状态 */
	:global(.svelte-flow__node) {
		background: transparent !important;
		border: none !important;
		border-radius: 0 !important;
		padding: 0 !important;
		box-shadow: none !important;
	}

	:global(.svelte-flow__node.selected) {
		box-shadow: none !important;
		outline: none !important;
	}

	:global(.svelte-flow__node:focus) {
		outline: none !important;
		box-shadow: none !important;
	}

	:global(.svelte-flow__node:focus-visible) {
		outline: none !important;
		box-shadow: none !important;
	}
</style>
