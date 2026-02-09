<script lang="ts">
	import { SvelteFlow, SvelteFlowProvider, Controls, BackgroundVariant, Background, SelectionMode } from '@xyflow/svelte';
	import type { Node, Edge, Connection } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { workflowState, configPanelRegistry } from '$lib/components/editor/contexts/index.js';
	import { START_NODE_ID } from '$lib/components/editor/contexts/editor-state.svelte.js';
	import { StartNode, LLMNode, KnowledgeNode, OutputNode, AgentNode, ClassifierNode, NoteNode, IfNode, LoopNode, LoopBreakNode } from './nodes/index.js';
	import ConnectionLine from './connections/ConnectionLine.svelte';
	import ThemeEditorControls from './components/ThemeEditorControls.svelte';
	import ContextMenu from './components/ContextMenu.svelte';
	import RightPanel from './components/RightPanel.svelte';
	import GlobalActions from './components/GlobalActions.svelte';
	import ControlBar from './components/ControlBar.svelte';
	import NodePicker from './components/NodePicker.svelte';
	import type { NodeTemplate } from './components/NodePicker.svelte';

	const nodeTypes = {
		start: StartNode,
		llm: LLMNode,
		knowledge: KnowledgeNode,
		output: OutputNode,
		agent: AgentNode,
		classifier: ClassifierNode,
		note: NoteNode,
		if: IfNode,
		loop: LoopNode,
		'loop-break': LoopBreakNode
	};

	/** 
	 * 验证连接是否有效
	 * 主要用于防止循环节点内外的节点相互连接
	 */
	function isValidConnection(connection: Connection): boolean {
		const { source, target, sourceHandle, targetHandle } = connection;
		if (!source || !target) return false;

		const sourceNode = workflowState.nodes.find(n => n.id === source);
		const targetNode = workflowState.nodes.find(n => n.id === target);
		if (!sourceNode || !targetNode) return false;

		// 获取节点的父节点 ID（如果在循环内）
		const sourceParentId = sourceNode.parentId;
		const targetParentId = targetNode.parentId;

		// 检查是否是循环节点的内部 handle
		const isLoopInternalSourceHandle = sourceNode.type === 'loop' && sourceHandle === 'loop-entry';
		const isLoopInternalTargetHandle = targetNode.type === 'loop' && targetHandle === 'loop-exit';

		// 规则 1: 循环节点的内部 handle 只能连接到循环内的子节点
		if (isLoopInternalSourceHandle) {
			// loop-entry 只能连接到该循环内的子节点
			return targetParentId === source;
		}

		if (isLoopInternalTargetHandle) {
			// loop-exit 只能接收该循环内子节点的连接
			return sourceParentId === target;
		}

		// 规则 2: 循环内的子节点只能连接到同一循环内的其他子节点或循环的内部 handle
		if (sourceParentId && targetParentId) {
			// 两个节点都在循环内，必须在同一个循环内
			return sourceParentId === targetParentId;
		}

		// 规则 3: 循环内的子节点不能连接到循环外的节点（除了循环的内部 handle）
		if (sourceParentId && !targetParentId) {
			// 源节点在循环内，目标节点在循环外
			// 只允许连接到父循环的 loop-exit handle
			return targetNode.type === 'loop' && targetHandle === 'loop-exit' && target === sourceParentId;
		}

		if (!sourceParentId && targetParentId) {
			// 源节点在循环外，目标节点在循环内
			// 只允许从父循环的 loop-entry handle 连接
			return sourceNode.type === 'loop' && sourceHandle === 'loop-entry' && source === targetParentId;
		}

		// 规则 4: 两个都在循环外的节点可以自由连接
		return true;
	}

	let contextMenu: ContextMenu;
	
	// 是否正在放置节点
	const isPlacing = $derived(workflowState.placingNodeId !== null);
	
	// 跟踪最后的鼠标位置（用于初始放置）
	let lastMousePosition: { clientX: number; clientY: number } | null = null;
	
	// 上一次的 placingNodeId，用于检测变化
	let prevPlacingNodeId: string | null = null;
	
	// 使用 requestAnimationFrame 检测 placingNodeId 变化并立即更新位置
	function checkPlacingNodeChange() {
		const currentPlacingId = workflowState.placingNodeId;
		
		// 检测是否刚开始放置节点（placingNodeId 从 null 变为有值）
		if (currentPlacingId && !prevPlacingNodeId && lastMousePosition) {
			// 立即更新到当前鼠标位置
			const pos = screenToFlowCoords(lastMousePosition.clientX, lastMousePosition.clientY);
			if (pos) {
				workflowState.updatePlacingNodePosition(pos);
			}
		}
		prevPlacingNodeId = currentPlacingId;
		
		// 继续轮询
		requestAnimationFrame(checkPlacingNodeChange);
	}
	
	// 启动轮询
	if (typeof window !== 'undefined') {
		requestAnimationFrame(checkPlacingNodeChange);
	}

	function handlePaneContextMenu({ event }: { event: MouseEvent }) {
		// 如果正在放置节点，右键取消
		if (isPlacing) {
			workflowState.cancelPendingNode();
			event.preventDefault();
			return;
		}
		contextMenu.show(event);
	}

	// 根据交互模式计算 SvelteFlow 配置
	// hand 模式: 拖拽画布平移
	// pointer 模式: 框选多选节点
	const isHandMode = $derived(workflowState.interactionMode === 'hand');
	
	// panOnDrag: hand 模式下左键和中键拖拽平移画布
	// 在 pointer 模式下，只允许中键平移
	// 注意：不包含右键(2)，保留右键用于 context menu
	// 放置节点时禁用拖拽平移
	const panOnDrag = $derived(isPlacing ? false : (isHandMode ? [0, 1] : [1]));
	
	// selectionOnDrag: pointer 模式下启用框选，放置节点时禁用
	const selectionOnDrag = $derived(isPlacing ? false : !isHandMode);

	// 阻止删除开始节点
	async function handleBeforeDelete({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) {
		// 过滤掉开始节点，只允许删除其他节点
		const filteredNodes = nodes.filter(n => n.id !== START_NODE_ID);
		return { nodes: filteredNodes, edges };
	}

	// 处理节点点击 - 只有点击节点才显示配置面板
	function handleNodeClick({ node }: { node: Node }) {
		// 如果正在放置节点，点击确认放置
		if (isPlacing) {
			workflowState.confirmPendingNode();
			return;
		}
		
		// 注释节点不显示配置面板
		if (node.type === 'note') {
			return;
		}
		configPanelRegistry.selectNode(node.id);
	}

	// 点击画布空白处
	function handlePaneClick() {
		// 如果正在放置节点，左键确认放置
		if (isPlacing) {
			workflowState.confirmPendingNode();
			return;
		}
		configPanelRegistry.closePanel();
	}
	
	// 将屏幕坐标转换为 flow 坐标
	function screenToFlowCoords(clientX: number, clientY: number): { x: number; y: number } | null {
		const flowElement = document.querySelector('.svelte-flow') as HTMLElement;
		if (!flowElement) return null;
		
		const rect = flowElement.getBoundingClientRect();
		
		// 获取当前 viewport 信息
		const viewportElement = flowElement.querySelector('.svelte-flow__viewport') as HTMLElement;
		if (!viewportElement) return null;
		
		// 解析 transform 获取 viewport 状态
		const transform = viewportElement.style.transform;
		const match = transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)\s*scale\(([\d.]+)\)/);
		if (!match) return null;
		
		const viewportX = parseFloat(match[1]);
		const viewportY = parseFloat(match[2]);
		const zoom = parseFloat(match[3]);
		
		// 计算 flow 坐标
		const x = (clientX - rect.left - viewportX) / zoom;
		const y = (clientY - rect.top - viewportY) / zoom;
		
		return { x, y };
	}
	
	// 处理鼠标移动 - 更新正在放置的节点位置
	function handleMouseMove(event: MouseEvent) {
		if (!isPlacing) return;
		
		const pos = screenToFlowCoords(event.clientX, event.clientY);
		if (pos) {
			workflowState.updatePlacingNodePosition(pos);
		}
	}
	
	// 处理键盘事件 - ESC 取消放置或关闭选择器
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			if (nodePickerVisible) {
				workflowState.hideNodePicker();
				event.preventDefault();
				return;
			}
			if (isPlacing) {
				workflowState.cancelPendingNode();
				event.preventDefault();
			}
		}
	}
	
	// 全局鼠标移动处理 - 更新放置中的节点位置
	function handleGlobalMouseMove(event: MouseEvent) {
		// 始终更新最后的鼠标位置（非响应式，避免触发重渲染）
		lastMousePosition = { clientX: event.clientX, clientY: event.clientY };
		
		// 只有在放置模式下才更新节点位置
		if (!workflowState.placingNodeId) return;
		
		const pos = screenToFlowCoords(event.clientX, event.clientY);
		if (pos) {
			workflowState.updatePlacingNodePosition(pos);
		}
	}

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
	
	// 节点选择器状态
	const nodePickerVisible = $derived(workflowState.nodePickerState.visible);
	const nodePickerPosition = $derived(workflowState.nodePickerState.position);
	
	// 处理节点选择器选择
	function handleNodePickerSelect(template: NodeTemplate) {
		workflowState.createNodeFromPicker({
			type: template.type,
			label: template.label,
			icon: template.icon,
			color: template.color
		});
	}
	
	// 点击外部关闭节点选择器
	function handleNodePickerClickOutside(e: MouseEvent) {
		if (nodePickerVisible) {
			const target = e.target as HTMLElement;
			if (!target.closest('.node-picker-popup')) {
				workflowState.hideNodePicker();
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} onmousemove={handleGlobalMouseMove} onclick={handleNodePickerClickOutside} />

<SvelteFlowProvider>
	<div class="relative h-full w-full">
		<SvelteFlow
			bind:nodes={workflowState.nodes}
			bind:edges={workflowState.edges}
			{nodeTypes}
			connectionLineComponent={ConnectionLine}
			{isValidConnection}
			onpanecontextmenu={handlePaneContextMenu}
			onbeforedelete={handleBeforeDelete}
			onnodeclick={handleNodeClick}
			onpaneclick={handlePaneClick}
			onmousemove={handleMouseMove}
			minZoom={0.5}
			maxZoom={2}
			panOnDrag={panOnDrag}
			panOnScroll={false}
			selectionOnDrag={selectionOnDrag}
			selectionMode={SelectionMode.Partial}
			class={isPlacing ? 'placing-node' : ''}
		>
			<Background variant={BackgroundVariant.Dots} />
			<Controls position="bottom-left">
				<ThemeEditorControls />
			</Controls>
		</SvelteFlow>
		<ContextMenu bind:this={contextMenu} />
		
		<!-- 左侧控制栏 -->
		<ControlBar />
		
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
		
		<!-- 节点选择器弹出层 -->
		{#if nodePickerVisible}
			<div 
				class="node-picker-popup fixed z-50 bg-popover border border-border rounded-lg shadow-lg w-72"
				style="left: {nodePickerPosition.x}px; top: {nodePickerPosition.y}px;"
			>
				<NodePicker 
					onSelect={handleNodePickerSelect}
					showTabs={false}
					excludeTypes={workflowState.nodePickerState.parentLoopId ? ['loop', 'output'] : []}
					inLoop={!!workflowState.nodePickerState.parentLoopId}
				/>
			</div>
		{/if}
	</div>
</SvelteFlowProvider>

<style>
	/* 移除 xyflow 默认的节点边框和选中状态 */
	:global(.svelte-flow__node) {
		border: none !important;
		border-radius: 0 !important;
		padding: 0 !important;
		box-shadow: none !important;
		background: transparent !important;
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
	
	/* 放置节点时的光标样式 */
	:global(.svelte-flow.placing-node) {
		cursor: crosshair !important;
	}
	
	:global(.svelte-flow.placing-node .svelte-flow__pane) {
		cursor: crosshair !important;
	}
</style>
