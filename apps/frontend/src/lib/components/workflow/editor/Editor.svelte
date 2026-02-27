<script lang="ts">
	import { SvelteFlow, SvelteFlowProvider, Controls, BackgroundVariant, Background, SelectionMode } from '@xyflow/svelte';
	import type { Node, Edge, Connection, ColorMode } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { onMount } from 'svelte';
	import { mode } from 'mode-watcher';
	import { workflowState, configPanelRegistry, runningState, START_NODE_ID, LOOP_HEADER_HEIGHT } from '$lib/components/workflow/editor/contexts/index';
	import { screenToFlowCoords } from '$lib/components/workflow/utils/flow-coords';
	import { StartNode, LLMNode, KnowledgeNode, OutputNode, AgentNode, ClassifierNode, NoteNode, IfNode, LoopNode, LoopBreakNode } from './nodes/index';
	import ConnectionLine from './connections/ConnectionLine.svelte';
	import { CustomEdge } from './connections/index';
	import ThemeEditorControls from './components/ThemeEditorControls.svelte';
	import ContextMenu from './components/ContextMenu.svelte';
	import RightPanel from './components/RightPanel.svelte';
	import GlobalActions from './components/GlobalActions.svelte';
	import ControlBar from './components/ControlBar.svelte';
	import NodePicker from './components/NodePicker.svelte';
	import TestRunDialog from './components/TestRunDialog.svelte';
	import RunResultPanel from './components/RunResultPanel.svelte';
	import type { NodeTemplate } from './components/NodePicker.svelte';
	import type { WorkflowNode, WorkflowEdge, BaseNodeData } from '$lib/components/workflow/types/index';
	import type { InputField, StartNodeData } from './nodes/StartNode/types';
	import type { WorkflowGraph } from '$lib/components/workflow/types/workflow-graph';
	import { WorkflowEngine } from '$lib/components/workflow/engine/workflow-engine';
	import { createDefaultExecutors } from '$lib/components/workflow/engine/executors/registry';
	import type { ExecutorOptions } from '$lib/components/workflow/engine/executors/registry';
	import type { ExecutionResult, ExecutionEvent, ExecutionContext } from '$lib/components/workflow/engine/types';
	import type { AgentCallFunction, KnowledgeRetrievalFunction } from '$lib/components/workflow/engine/executors/registry';
	import { VariableResolver } from '$lib/components/workflow/engine/variable-resolver';
	import { authStore } from '$lib/stores/auth.svelte';

	interface Props {
		/** 初始图数据 */
		initialGraph?: WorkflowGraph | null;
		/** Agent 调用函数 */
		agentCall?: AgentCallFunction;
		/** 知识库检索函数 */
		knowledgeRetrieval?: KnowledgeRetrievalFunction;
		/** 发布回调 */
		onPublish?: (workflow: { nodes: Node[]; edges: Edge[] }) => Promise<void>;
		/** 保存草稿回调 */
		onSaveDraft?: (workflow: { nodes: Node[]; edges: Edge[] }) => Promise<void>;
		/** 查看版本历史回调 */
		onVersionHistory?: () => void;
		/** 保存回调 */
		onSave?: (graph: WorkflowGraph) => Promise<void>;
		/** 图变化回调 - 用于脏状态检测 */
		onGraphChange?: (isDirty: boolean) => void;
	}

	let { 
		initialGraph,
		agentCall, 
		knowledgeRetrieval,
		onPublish,
		onSaveDraft,
		onVersionHistory,
		onSave,
		onGraphChange,
	}: Props = $props();
	
	// 初始快照 - 用于脏状态检测
	let initialSnapshot = $state<string>('');
	
	// 计算当前状态快照 - 包含所有可配置内容
	function getCurrentSnapshot(): string {
		return JSON.stringify({
			nodes: workflowState.nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data, parentId: n.parentId })),
			edges: workflowState.edges.map(e => ({ id: e.id, source: e.source, target: e.target, sourceHandle: e.sourceHandle, targetHandle: e.targetHandle })),
			variables: workflowState.variables,
			inputVariables: workflowState.inputVariables,
			environmentVariables: workflowState.environmentVariables,
			metadata: workflowState.metadata,
		});
	}
	
	// 脏状态检测
	const isDirty = $derived(initialSnapshot !== '' && getCurrentSnapshot() !== initialSnapshot);
	
	// 当脏状态变化时通知父组件
	$effect(() => {
		onGraphChange?.(isDirty);
	});
	
	// 加载初始图数据
	function loadInitialGraph() {
		if (!initialGraph) return;
		
		// 清空当前状态
		workflowState.clear();
		
		// 加载节点
		if (initialGraph.nodes && initialGraph.nodes.length > 0) {
			workflowState.nodes = initialGraph.nodes as WorkflowNode[];
		}
		
		// 延迟加载边，确保节点已渲染
		if (initialGraph.edges && initialGraph.edges.length > 0) {
			setTimeout(() => {
				workflowState.edges = initialGraph.edges as WorkflowEdge[];
				// 保存初始快照（在边加载后）
				setTimeout(() => {
					initialSnapshot = getCurrentSnapshot();
				}, 50);
			}, 100);
		} else {
			// 没有边时直接保存快照
			setTimeout(() => {
				initialSnapshot = getCurrentSnapshot();
			}, 50);
		}
		
		// 加载变量
		if (initialGraph.variables) {
			workflowState.variables = initialGraph.variables;
		}
		
		// 加载输入变量
		if (initialGraph.input_variables) {
			workflowState.inputVariables = initialGraph.input_variables;
		}
		
		// 加载环境变量
		if (initialGraph.environment_variables) {
			workflowState.environmentVariables = initialGraph.environment_variables;
		}
		
		// 加载元数据
		if (initialGraph.metadata) {
			workflowState.metadata = initialGraph.metadata;
		}
		
		// 加载测试输入数据
		if (initialGraph.test_inputs) {
			workflowState.testInputs = initialGraph.test_inputs;
		}
	}
	
	// 获取当前图数据（用于保存）- 返回简单对象格式
	export function getCurrentGraph() {
		return {
			nodes: workflowState.nodes,
			edges: workflowState.edges,
			variables: workflowState.variables,
			input_variables: workflowState.inputVariables,
			environment_variables: workflowState.environmentVariables,
			metadata: workflowState.metadata,
			test_inputs: workflowState.testInputs,
			conversation_variables: [],
			features: {},
		};
	}
	
	// 标记为已保存（重置脏状态）
	export function markAsSaved() {
		initialSnapshot = getCurrentSnapshot();
	}
	
	// 组件挂载时加载初始数据
	onMount(() => {
		loadInitialGraph();
		
		// 设置单节点运行回调
		runningState.onNodeRunning = async (params) => {
			const { nodeType, input, isTest } = params;
			
			// 获取节点 ID（从 runningState.currentNodeId）
			const nodeId = runningState.currentNodeId;
			if (!nodeId) {
				throw new Error('No node is currently running');
			}
			
			// 获取节点
			const node = workflowState.getNode(nodeId);
			if (!node) {
				throw new Error(`Node ${nodeId} not found`);
			}
			
			// 创建执行器
			const executorOptions: ExecutorOptions = {
				agentCall,
				knowledgeRetrieval,
			};
			const executors = createDefaultExecutors(executorOptions);
			
			// 获取对应的执行器
			const executor = executors.get(nodeType);
			if (!executor) {
				throw new Error(`No executor found for node type: ${nodeType}`);
			}
			
			// 构建执行上下文
			// 收集前置节点的输出作为输入
			const nodeInputs = collectNodeInputs(nodeId);
			
			// 合并用户输入（如果有）
			const mergedInputs = { ...nodeInputs };
			if (input && typeof input === 'object') {
				Object.assign(mergedInputs, input);
			}
			
			// 从 workflowState.testInputs 获取用户输入（测试表单中填写的值）
			const userInputs: Record<string, unknown> = { ...workflowState.testInputs.values };
			
			// 构建系统变量
			const systemVariables: Record<string, unknown> = {
				user_id: authStore.user?.id ?? 'test-user',
				workflow_id: workflowState.metadata?.id ?? 'test-workflow',
				timestamp: new Date().toISOString(),
			};
			
			// 执行节点 - 使用完整的 ExecutionContext
			const context: ExecutionContext = {
				workflowId: workflowState.metadata?.id ?? 'test-workflow',
				executionId: crypto.randomUUID(),
				isTest,
				variables: new Map<string, Record<string, unknown>>(),
				userInputs,
				userFiles: [],
				environmentVariables: Object.fromEntries(
					workflowState.environmentVariables.map(v => [v.name, v.value])
				),
				systemVariables,
			};
			
			// 解析节点输入变量（包括模板字符串）
			const resolvedInputs = resolveNodeInputsForSingleRun(node, mergedInputs, context);
			
			// 更新节点运行数据中的 inputs，以便 ConfigPanel 显示解析后的值
			runningState.updateNodeRunInputs(nodeId, resolvedInputs);
			
			const result = await executor.execute(node, resolvedInputs, context);
			return result;
		};
		
		return () => {
			// 清理回调
			runningState.onNodeRunning = undefined;
		};
	});
	
	// 收集节点的输入（从前置节点的输出）
	function collectNodeInputs(nodeId: string): Record<string, unknown> {
		const inputs: Record<string, unknown> = {};
		
		// 获取所有指向当前节点的边
		const incomingEdges = workflowState.edges.filter(e => e.target === nodeId);
		
		for (const edge of incomingEdges) {
			const sourceNode = workflowState.getNode(edge.source);
			if (!sourceNode) continue;
			
			// 获取源节点的运行输出
			const sourceRunData = sourceNode.data._run;
			if (sourceRunData?.outputs) {
				// 将源节点的输出合并到输入中
				// 使用 {nodeId}.{outputKey} 格式
				for (const [key, value] of Object.entries(sourceRunData.outputs)) {
					inputs[`${edge.source}.${key}`] = value;
				}
			}
		}
		
		// 同时获取开始节点的输入（如果有）
		const startNode = workflowState.getNode(START_NODE_ID);
		if (startNode?.data._run?.outputs) {
			for (const [key, value] of Object.entries(startNode.data._run.outputs)) {
				inputs[`input.${key}`] = value;
			}
		}
		
		return inputs;
	}
	
	/**
	 * 解析单节点执行时的输入变量
	 * 类似于 WorkflowEngine.resolveNodeInputs，但用于单节点执行场景
	 */
	function resolveNodeInputsForSingleRun(
		node: WorkflowNode,
		mergedInputs: Record<string, unknown>,
		context: ExecutionContext
	): Record<string, unknown> {
		const resolver = new VariableResolver(context);
		const data = node.data as Record<string, unknown>;
		const inputs = { ...mergedInputs };
		
		// 1. 添加流程输入变量（来自开始节点的用户输入）
		if (context.userInputs) {
			for (const [key, value] of Object.entries(context.userInputs)) {
				inputs[`input.${key}`] = value;
			}
		}
		
		// 2. 处理上下文变量引用（节点配置的显式引用）
		if (data.context && Array.isArray(data.context)) {
			for (const ctx of data.context as Array<{ path: string }>) {
				const value = resolver.resolve(ctx.path);
				inputs[ctx.path] = value;
			}
		}
		
		// 3. 处理模板字符串（已解析的提示词）
		if (data.systemPrompt && typeof data.systemPrompt === 'string') {
			inputs._resolvedSystemPrompt = resolver.resolveTemplate(data.systemPrompt);
		}
		if (data.userPromptTemplate && typeof data.userPromptTemplate === 'string') {
			inputs._resolvedUserPrompt = resolver.resolveTemplate(data.userPromptTemplate);
		}
		// Agent 节点的指令提示词
		if (data.instructionPrompt && typeof data.instructionPrompt === 'string') {
			inputs._resolvedInstructionPrompt = resolver.resolveTemplate(data.instructionPrompt);
		}
		
		// 4. 处理输入变量引用（单个变量引用）
		if (data.inputVariable && typeof data.inputVariable === 'string') {
			inputs._resolvedInput = resolver.resolve(data.inputVariable);
		}
		
		return inputs;
	}

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

	const edgeTypes = {
		default: CustomEdge
	};

	/** 
	 * 验证连接是否有效
	 * 主要用于防止循环节点内外的节点相互连接
	 */
	function isValidConnection(connection: Edge | Connection): boolean {
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
	
	// 测试运行对话框状态
	let testRunDialogOpen = $state(false);
	let testRunDialogMode = $state<'run' | 'inputs'>('run');
	let executionResult = $state<ExecutionResult | null>(null);
	
	// 当前工作流引擎实例（用于中断）
	let currentEngine = $state<WorkflowEngine | null>(null);
	
	// 获取开始节点的输入字段
	function getStartNodeInputFields(): InputField[] {
		const startNode = workflowState.getNode(START_NODE_ID);
		if (!startNode) return [];
		const data = startNode.data as StartNodeData;
		return data.inputs ?? [];
	}
	
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

	// 处理节点右键菜单
	function handleNodeContextMenu({ event, node }: { event: MouseEvent; node: Node }) {
		// 如果正在放置节点，右键取消
		if (isPlacing) {
			workflowState.cancelPendingNode();
			event.preventDefault();
			return;
		}
		// 注释节点不显示右键菜单
		if (node.type === 'note') {
			return;
		}
		contextMenu.showForNode(event, node);
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
		// Cmd/Ctrl + R 触发测试运行
		if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
			event.preventDefault();
			handleTestRun();
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

	// 处理执行事件 - 更新节点运行状态
	function handleExecutionEvent(event: ExecutionEvent) {
		switch (event.type) {
			case 'node:start':
				if (event.nodeId) {
					const startData = event.data as { inputs?: Record<string, unknown> } | undefined;
					runningState.setNodeRunning(event.nodeId, startData?.inputs);
				}
				break;
			case 'node:complete':
				if (event.nodeId && event.data) {
					const result = event.data as { outputs?: Record<string, unknown>; tokens?: { prompt: number; completion: number; total: number } };
					runningState.setNodeSuccess(event.nodeId, result.outputs, result.tokens);
				}
				break;
			case 'node:error':
				if (event.nodeId && event.data) {
					const errorData = event.data as { error: string };
					runningState.setNodeError(event.nodeId, errorData.error);
				}
				break;
		}
	}

	// 全局操作回调
	function handleTestRun() {
		// 打开测试运行对话框（运行模式）
		testRunDialogMode = 'run';
		testRunDialogOpen = true;
	}
	
	// 设置输入参数（仅设置参数，不运行）
	function handleSetInputs() {
		testRunDialogMode = 'inputs';
		testRunDialogOpen = true;
	}
	
	// 终止运行
	function handleStopRun() {
		if (currentEngine) {
			currentEngine.cancel();
			currentEngine = null;
		}
		runningState.abort();
	}
	
	// 执行测试运行
	async function executeTestRun(userInputs: Record<string, unknown>, files: File[]) {
		console.log('[executeTestRun] called with userInputs:', userInputs);
		
		testRunDialogOpen = false;
		executionResult = null;
		
		// 清除之前的运行状态
		runningState.clearAllRunStatus();
		runningState.startRun(true);
		
		try {
			// 创建执行器
			const executorOptions: ExecutorOptions = {
				agentCall,
				knowledgeRetrieval,
			};
			const executors = createDefaultExecutors(executorOptions);
			
			// 创建引擎并执行
			const engine = new WorkflowEngine(
				workflowState.nodes,
				workflowState.edges,
				executors
			);
			
			// 保存引擎实例用于中断
			currentEngine = engine;
			
			// 构建系统变量
			const systemVariables: Record<string, unknown> = {
				user_id: authStore.user?.id ?? 'test-user',
				workflow_id: workflowState.metadata?.id ?? 'test-workflow',
				timestamp: new Date().toISOString(),
			};
			
			console.log('[executeTestRun] executing with:', { userInputs, systemVariables });
			
			const result = await engine.execute({
				isTest: true,
				userInputs,
				userFiles: files,
				environmentVariables: Object.fromEntries(
					workflowState.environmentVariables.map(v => [v.name, v.value])
				),
				systemVariables,
				onEvent: handleExecutionEvent,
			});
			
			executionResult = result;
		} catch (error) {
			console.error('Test run failed:', error);
			const errorMessage = error instanceof Error ? error.message : String(error);
			executionResult = {
				executionId: crypto.randomUUID(),
				status: 'error',
				startTime: Date.now(),
				endTime: Date.now(),
				elapsed: 0,
				nodeResults: [],
				error: errorMessage,
			};
		} finally {
			currentEngine = null;
			runningState.endRun();
		}
	}

	function handleViewHistory() {
		console.log('View run history');
	}

	function handleViewIssues() {
		console.log('View issues');
	}

	async function handlePublish() {
		if (onPublish) {
			await onPublish({
				nodes: workflowState.nodes,
				edges: workflowState.edges,
			});
		}
	}

	async function handlePublishDraft() {
		if (onSaveDraft) {
			await onSaveDraft({
				nodes: workflowState.nodes,
				edges: workflowState.edges,
			});
		}
	}

	function handleVersionHistoryClick() {
		onVersionHistory?.();
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

	// 处理节点拖拽 - 限制循环内子节点不能移入 header 区域
	function handleNodeDrag({ targetNode }: { targetNode: Node | null }) {
		// 只处理循环内的子节点
		if (!targetNode || !targetNode.parentId) return;
		
		// 限制 Y 坐标不能小于 header 高度
		if (targetNode.position.y < LOOP_HEADER_HEIGHT) {
			// 直接修改节点位置
			const nodeIndex = workflowState.nodes.findIndex(n => n.id === targetNode.id);
			if (nodeIndex !== -1) {
				workflowState.nodes[nodeIndex] = {
					...workflowState.nodes[nodeIndex],
					position: { x: targetNode.position.x, y: LOOP_HEADER_HEIGHT }
				};
			}
		}
	}

	// 获取 xyflow 的 colorMode
	const colorMode = $derived<ColorMode>(mode.current === 'dark' ? 'dark' : 'light');
	
	// 背景颜色 - 根据主题切换
	const bgColor = $derived(mode.current === 'dark' ? 'hsl(240 10% 3.9%)' : 'hsl(0 0% 100%)');
	const patternColor = $derived(mode.current === 'dark' ? 'hsl(240 5% 45%)' : 'hsl(240 5% 75%)');
</script>

<svelte:window onkeydown={handleKeydown} onmousemove={handleGlobalMouseMove} onclick={handleNodePickerClickOutside} />

<SvelteFlowProvider>
	<div class="relative h-full w-full">
		<SvelteFlow
			bind:nodes={workflowState.nodes}
			bind:edges={workflowState.edges}
			{nodeTypes}
			{edgeTypes}
			defaultEdgeOptions={{ type: 'default' }}
			connectionLineComponent={ConnectionLine}
			{isValidConnection}
			onpanecontextmenu={handlePaneContextMenu}
			onnodecontextmenu={handleNodeContextMenu}
			onbeforedelete={handleBeforeDelete}
			onnodeclick={handleNodeClick}
			onpaneclick={handlePaneClick}
			onmousemove={handleMouseMove}
			onnodedrag={handleNodeDrag}
			minZoom={0.5}
			maxZoom={2}
			panOnDrag={panOnDrag}
			panOnScroll={false}
			selectionOnDrag={selectionOnDrag}
			selectionMode={SelectionMode.Partial}
			colorMode={colorMode}
			class={isPlacing ? 'placing-node' : ''}
		>
			<Background variant={BackgroundVariant.Dots} {bgColor} {patternColor} gap={20} size={1} />
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
			onStopRun={handleStopRun}
			onSetInputs={handleSetInputs}
			onViewHistory={handleViewHistory}
			onViewIssues={handleViewIssues}
			onPublish={handlePublish}
			onPublishDraft={handlePublishDraft}
			onVersionHistory={handleVersionHistoryClick}
		/>
		
		<!-- 右侧配置面板 -->
		<RightPanel />
		
		<!-- 输入参数设置对话框 -->
		<TestRunDialog
			open={testRunDialogOpen}
			inputFields={getStartNodeInputFields()}
			onClose={() => testRunDialogOpen = false}
			onRun={executeTestRun}
			mode={testRunDialogMode}
		/>
		
		<!-- 运行结果面板 -->
		<RunResultPanel
			result={executionResult}
			onClose={() => executionResult = null}
		/>
		
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
	/* xyflow 深色主题适配 */
	:global(.svelte-flow) {
		/* 默认 workflow 主题色 - 可被 ThemeEditorControls 覆盖 */
		--workflow-primary: hsl(var(--primary));
		
		--xy-background-color: hsl(var(--background));
		--xy-node-background-color: hsl(var(--card));
		--xy-node-border-color: hsl(var(--border));
		--xy-edge-stroke: hsl(220 10% 55%);
		--xy-edge-stroke-selected: var(--workflow-primary);
		--xy-connectionline-stroke: var(--workflow-primary);
		--xy-handle-background-color: hsl(var(--background));
		--xy-handle-border-color: hsl(var(--border));
		--xy-selection-background-color: hsl(var(--primary) / 0.1);
		--xy-selection-border-color: var(--workflow-primary);
		--xy-controls-button-background-color: hsl(var(--card));
		--xy-controls-button-background-color-hover: hsl(var(--muted));
		--xy-controls-button-color: hsl(var(--foreground));
		--xy-controls-button-color-hover: hsl(var(--foreground));
		--xy-controls-button-border-color: hsl(var(--border));
		--xy-minimap-background-color: hsl(var(--card));
		--xy-minimap-mask-background-color: hsl(var(--background) / 0.8);
		--xy-minimap-node-background-color: hsl(var(--muted));
		--xy-background-pattern-color: hsl(var(--muted-foreground) / 0.3);
	}
	
	/* 暗色模式下使用更亮的连接线颜色 */
	:global(.dark .svelte-flow) {
		--xy-edge-stroke: hsl(220 10% 60%);
	}

	/* 背景点颜色 */
	:global(.svelte-flow__background pattern circle) {
		fill: hsl(var(--muted-foreground) / 0.3);
	}

	/* 控制按钮样式 */
	:global(.svelte-flow__controls) {
		background: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		border-radius: 0.5rem;
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
	}

	:global(.svelte-flow__controls-button) {
		background: hsl(var(--card)) !important;
		border: none !important;
		border-bottom: 1px solid hsl(var(--border)) !important;
		color: hsl(var(--foreground)) !important;
		fill: hsl(var(--foreground)) !important;
	}

	:global(.svelte-flow__controls-button:hover) {
		background: hsl(var(--muted)) !important;
	}

	:global(.svelte-flow__controls-button:last-child) {
		border-bottom: none !important;
	}

	:global(.svelte-flow__controls-button svg) {
		fill: hsl(var(--foreground)) !important;
	}

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

	/* Attribution 隐藏或样式调整 */
	:global(.svelte-flow__attribution) {
		background: hsl(var(--card) / 0.8) !important;
		color: hsl(var(--muted-foreground)) !important;
	}

	:global(.svelte-flow__attribution a) {
		color: hsl(var(--muted-foreground)) !important;
	}
</style>
