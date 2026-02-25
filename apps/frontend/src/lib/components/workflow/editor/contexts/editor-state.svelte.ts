import YAML from 'yaml';
import type { WorkflowNode, WorkflowEdge, Variable, BaseNodeData, EnvironmentVariable } from '$lib/components/workflow/types/index';
import { 
	START_NODE_ID, 
	LOOP_HEADER_HEIGHT, 
	LOOP_NODE_SIZE, 
	NODE_SPACING, 
	TARGET_HANDLE_OFFSET,
	DEFAULT_NODE_SIZE,
	LOOP_NODE_PADDING
} from '$lib/components/workflow/constants/index';

/** 待放置节点模板 */
export interface PendingNodeTemplate {
	type: string;
	label: string;
	icon: string;
	color: string;
}

/** 创建默认开始节点 */
function createStartNode<T extends BaseNodeData>(): WorkflowNode<T> {
	return {
		id: START_NODE_ID,
		type: 'start',
		position: { x: 100, y: 200 },
		data: {
			title: '开始',
			type: 'start',
			desc: '工作流的起点'
		} as T
	};
}

/**
 * 响应式工作流状态 - 基于 WorkflowGraph 结构
 */
function createWorkflowState<T extends BaseNodeData = BaseNodeData>() {
	// 核心数据 - 默认包含开始节点
	// 注意：@xyflow/svelte 建议使用 $state.raw 但这会导致 bind: 失效
	// 所以我们使用普通 $state，性能警告可以忽略
	let nodes = $state<WorkflowNode<T>[]>([createStartNode<T>()]);
	let edges = $state<WorkflowEdge[]>([]);
	let variables = $state<Variable[]>([]);
	let environmentVariables = $state<EnvironmentVariable[]>([]);

	// 元数据
	let metadata = $state({
		name: 'Untitled Workflow',
		description: '',
		version: '1.0.0'
	});

	// 编辑器状态
	let selectedNodeIds = $state<string[]>([]);
	let selectedEdgeIds = $state<string[]>([]);
	let readonly = $state(false);
	
	// 交互模式: 'hand' = 拖拽画布, 'pointer' = 框选多选
	let interactionMode = $state<'hand' | 'pointer'>('hand');
	
	// 待放置的节点 ID（用于拖拽放置模式，节点已添加到 nodes 中，只是还在跟随鼠标）
	let placingNodeId = $state<string | null>(null);
	
	// 待放置节点的模板信息（用于显示 ghost 预览）
	let placingNodeTemplate = $state<PendingNodeTemplate | null>(null);
	
	// 节点选择器弹出状态（用于点击引脚弹出选择器）
	interface NodePickerState {
		visible: boolean;
		position: { x: number; y: number };
		sourceNodeId: string;
		sourceHandleId: string;
		parentLoopId?: string; // 如果在循环内，记录父循环 ID
		handleOffsetY?: number; // 引脚相对于节点顶部的 Y 偏移量
	}
	let nodePickerState = $state<NodePickerState>({
		visible: false,
		position: { x: 0, y: 0 },
		sourceNodeId: '',
		sourceHandleId: ''
	});

	return {
		// Getters
		get nodes() { return nodes; },
		get edges() { return edges; },
		get variables() { return variables; },
		get environmentVariables() { return environmentVariables; },
		get metadata() { return metadata; },
		get selectedNodeIds() { return selectedNodeIds; },
		get selectedEdgeIds() { return selectedEdgeIds; },
		get readonly() { return readonly; },
		get interactionMode() { return interactionMode; },
		get placingNodeId() { return placingNodeId; },
		get placingNodeTemplate() { return placingNodeTemplate; },
		get nodePickerState() { return nodePickerState; },

		// Setters
		set nodes(v: WorkflowNode<T>[]) { nodes = v; },
		set edges(v: WorkflowEdge[]) { edges = v; },
		set variables(v: Variable[]) { variables = v; },
		set environmentVariables(v: EnvironmentVariable[]) { environmentVariables = v; },
		set metadata(v: typeof metadata) { metadata = v; },
		set selectedNodeIds(v: string[]) { selectedNodeIds = v; },
		set selectedEdgeIds(v: string[]) { selectedEdgeIds = v; },
		set readonly(v: boolean) { readonly = v; },
		set interactionMode(v: 'hand' | 'pointer') { interactionMode = v; },

		// 待放置节点操作
		/** 开始放置节点：创建真实节点并进入放置模式 */
		startPendingNode(template: PendingNodeTemplate, initialPosition?: { x: number; y: number }) {
			const id = crypto.randomUUID();
			const pos = initialPosition ?? { x: 0, y: 0 };
			
			// 根据节点类型创建不同的 data 结构
			let nodeData: Record<string, unknown>;
			
			if (template.type === 'note') {
				// 注释节点
				nodeData = {
					title: template.label,
					type: template.type,
					content: '',
					color: 'yellow'
				};
			} else if (template.type === 'if') {
				// IF 条件分支节点 - 默认只有一个 IF 分支
				nodeData = {
					title: template.label,
					type: template.type,
					desc: '',
					cases: [
						{
							id: crypto.randomUUID(),
							type: 'if',
							conditions: [],
							logicalOperator: 'and'
						}
					]
				};
			} else if (template.type === 'loop') {
				// 循环节点 - 作为 subflow 父节点，需要固定尺寸
				nodeData = {
					title: template.label,
					type: template.type,
					desc: '',
					variables: [],
					breakConditions: [],
					maxIterations: 10
				};
				// 添加真实节点到 nodes 数组（循环节点需要固定尺寸）
				nodes = [...nodes, {
					id,
					type: template.type,
					position: pos,
					data: nodeData as T,
					style: `width: ${LOOP_NODE_SIZE.width}px; height: ${LOOP_NODE_SIZE.height}px;`,
					width: LOOP_NODE_SIZE.width,
					height: LOOP_NODE_SIZE.height,
					measured: { width: LOOP_NODE_SIZE.width, height: LOOP_NODE_SIZE.height }
				}];
				
				// 设置放置状态
				placingNodeId = id;
				placingNodeTemplate = template;
				return; // 提前返回，避免重复添加节点
			} else {
				// 其他节点
				nodeData = {
					title: template.label,
					type: template.type,
					desc: ''
				};
			}
			
			// 添加真实节点到 nodes 数组
			nodes = [...nodes, {
				id,
				type: template.type,
				position: pos,
				data: nodeData as T
			}];
			
			// 设置放置状态
			placingNodeId = id;
			placingNodeTemplate = template;
		},
		
		/** 更新正在放置的节点位置 */
		updatePlacingNodePosition(pos: { x: number; y: number }) {
			if (!placingNodeId) return;
			nodes = nodes.map(n => 
				n.id === placingNodeId ? { ...n, position: pos } : n
			);
		},
		
		/** 确认放置节点：清除放置状态，节点保留在 nodes 中 */
		confirmPendingNode() {
			placingNodeId = null;
			placingNodeTemplate = null;
		},
		
		/** 取消放置节点：从 nodes 中移除节点并清除放置状态 */
		cancelPendingNode() {
			if (placingNodeId) {
				nodes = nodes.filter(n => n.id !== placingNodeId);
			}
			placingNodeId = null;
			placingNodeTemplate = null;
		},

		// 节点操作
		addNode(node: WorkflowNode<T>) {
			nodes = [...nodes, node];
		},
		getNode(id: string) {
			return nodes.find((n) => n.id === id);
		},
		updateNode(id: string, data: Partial<T>) {
			nodes = nodes.map((n) =>
				n.id === id ? { ...n, data: { ...n.data, ...data } as T } : n
			);
		},
		removeNode(id: string) {
			// 开始节点不能删除
			if (id === START_NODE_ID) return;
			// 如果是循环节点，同时删除其子节点
			const node = nodes.find(n => n.id === id);
			if (node?.type === 'loop') {
				const childIds = nodes.filter(n => n.parentId === id).map(n => n.id);
				nodes = nodes.filter((n) => n.id !== id && n.parentId !== id);
				edges = edges.filter((e) => 
					e.source !== id && 
					e.target !== id && 
					!childIds.includes(e.source) && 
					!childIds.includes(e.target)
				);
			} else {
				nodes = nodes.filter((n) => n.id !== id);
				edges = edges.filter((e) => e.source !== id && e.target !== id);
			}
		},
		
		/** 获取循环节点的子节点 */
		getChildNodes(parentId: string) {
			return nodes.filter(n => n.parentId === parentId);
		},
		
		/** 添加子节点到循环内 */
		addChildNode(parentId: string, template: PendingNodeTemplate, relativePosition: { x: number; y: number }) {
			const parentNode = nodes.find(n => n.id === parentId);
			if (!parentNode || parentNode.type !== 'loop') return null;
			
			const id = crypto.randomUUID();
			
			// 根据节点类型创建不同的 data 结构
			let nodeData: Record<string, unknown> = {
				title: template.label,
				type: template.type,
				desc: ''
			};
			
			// 添加子节点，设置 parentId 和 extent
			const childNode: WorkflowNode<T> = {
				id,
				type: template.type,
				position: relativePosition,
				data: nodeData as T,
				parentId: parentId,
				extent: 'parent'
			};
			
			nodes = [...nodes, childNode];
			
			// 自动调整父循环节点大小
			this.autoResizeLoopNode(parentId);
			
			return id;
		},
		
		/** 显示节点选择器 */
		showNodePicker(position: { x: number; y: number }, sourceNodeId: string, sourceHandleId: string, parentLoopId?: string, handleOffsetY?: number) {
			nodePickerState = {
				visible: true,
				position,
				sourceNodeId,
				sourceHandleId,
				parentLoopId,
				handleOffsetY
			};
		},
		
		/** 隐藏节点选择器 */
		hideNodePicker() {
			nodePickerState = {
				visible: false,
				position: { x: 0, y: 0 },
				sourceNodeId: '',
				sourceHandleId: ''
			};
		},
		
		/** 从节点选择器创建节点并连接 */
		createNodeFromPicker(template: PendingNodeTemplate) {
			const { sourceNodeId, sourceHandleId, parentLoopId, handleOffsetY } = nodePickerState;
			if (!sourceNodeId) return;
			
			const sourceNode = nodes.find(n => n.id === sourceNodeId);
			if (!sourceNode) return;
			
			const id = crypto.randomUUID();
			
			// 根据节点类型创建不同的 data 结构
			let nodeData: Record<string, unknown> = {
				title: template.label,
				type: template.type,
				desc: ''
			};
			
			// loop-break 节点特殊处理
			if (template.type === 'loop-break') {
				nodeData = {
					title: template.label,
					type: template.type,
					reason: ''
				};
			} else if (template.type === 'if') {
				// IF 条件分支节点 - 默认只有一个 IF 分支
				nodeData = {
					title: template.label,
					type: template.type,
					desc: '',
					cases: [
						{
							id: crypto.randomUUID(),
							type: 'if',
							conditions: [],
							logicalOperator: 'and'
						}
					]
				};
			}
			
			// 计算新节点位置
			let newPosition: { x: number; y: number };
			
			if (parentLoopId) {
				// 在循环内创建子节点
				const parentNode = nodes.find(n => n.id === parentLoopId);
				if (!parentNode) return;
				
				// 获取循环内已有子节点
				const childNodes = nodes.filter(n => n.parentId === parentLoopId);
				
				if (childNodes.length === 0) {
					// 第一个子节点，放在入口节点右边
					// 如果有 handleOffsetY，使用它来对齐，但确保不小于 header 高度
					const yOffset = handleOffsetY !== undefined 
						? Math.max(handleOffsetY - TARGET_HANDLE_OFFSET, LOOP_HEADER_HEIGHT) 
						: LOOP_HEADER_HEIGHT;
					newPosition = { x: 100, y: yOffset };
				} else {
					// 找到最右边的子节点，放在其右边
					const rightmostNode = childNodes.reduce((max, n) => 
						n.position.x > max.position.x ? n : max
					, childNodes[0]);
					newPosition = { 
						x: rightmostNode.position.x + NODE_SPACING.horizontal, 
						y: Math.max(rightmostNode.position.y, LOOP_HEADER_HEIGHT)
					};
				}
				
				// 添加子节点
				const childNode: WorkflowNode<T> = {
					id,
					type: template.type,
					position: newPosition,
					data: nodeData as T,
					parentId: parentLoopId,
					extent: 'parent'
				};
				
				nodes = [...nodes, childNode];
				
				// 自动调整父循环节点大小
				this.autoResizeLoopNode(parentLoopId);
			} else {
				// 在主流程中创建节点
				// 新节点的 Y 位置：源节点 Y + 引脚偏移 - 目标引脚偏移（使两个引脚平行）
				const sourceHandleY = handleOffsetY ?? TARGET_HANDLE_OFFSET;
				newPosition = {
					x: sourceNode.position.x + NODE_SPACING.horizontal + 20,
					y: sourceNode.position.y + sourceHandleY - TARGET_HANDLE_OFFSET
				};
				
				nodes = [...nodes, {
					id,
					type: template.type,
					position: newPosition,
					data: nodeData as T
				}];
			}
			
			// 创建连接边
			const edgeId = crypto.randomUUID();
			// 大多数节点的 target handle ID 是 'target'，但 loop 和 loop-break 使用 'input'
			const targetHandleId = (template.type === 'loop' || template.type === 'loop-break') ? 'input' : 'target';
			edges = [...edges, {
				id: edgeId,
				source: sourceNodeId,
				sourceHandle: sourceHandleId,
				target: id,
				targetHandle: targetHandleId
			}];
			
			// 隐藏选择器
			this.hideNodePicker();
		},
		
		/** 自动调整循环节点大小以包含所有子节点 */
		autoResizeLoopNode(loopNodeId: string) {
			const loopNode = nodes.find(n => n.id === loopNodeId);
			if (!loopNode || loopNode.type !== 'loop') return;
			
			const childNodes = nodes.filter(n => n.parentId === loopNodeId);
			if (childNodes.length === 0) return;
			
			let maxRight = 0;
			let maxBottom = 0;
			
			for (const child of childNodes) {
				const right = child.position.x + DEFAULT_NODE_SIZE.width;
				const bottom = child.position.y + DEFAULT_NODE_SIZE.height;
				if (right > maxRight) maxRight = right;
				if (bottom > maxBottom) maxBottom = bottom;
			}
			
			// 计算需要的最小尺寸
			const minWidth = Math.max(LOOP_NODE_SIZE.width, maxRight + LOOP_NODE_PADDING);
			const minHeight = Math.max(LOOP_NODE_SIZE.height, maxBottom + LOOP_NODE_PADDING + LOOP_HEADER_HEIGHT);
			
			// 更新循环节点尺寸
			const currentWidth = loopNode.width ?? LOOP_NODE_SIZE.width;
			const currentHeight = loopNode.height ?? LOOP_NODE_SIZE.height;
			
			if (minWidth > currentWidth || minHeight > currentHeight) {
				const newWidth = Math.max(currentWidth, minWidth);
				const newHeight = Math.max(currentHeight, minHeight);
				nodes = nodes.map(n => 
					n.id === loopNodeId 
						? { 
							...n, 
							width: newWidth,
							height: newHeight,
							measured: { width: newWidth, height: newHeight },
							style: `width: ${newWidth}px; height: ${newHeight}px;`
						} 
						: n
				);
			}
		},

		// 边操作
		addEdge(edge: WorkflowEdge) {
			edges = [...edges, edge];
		},
		getEdge(id: string) {
			return edges.find((e) => e.id === id);
		},
		removeEdge(id: string) {
			edges = edges.filter((e) => e.id !== id);
		},
		getIncomingEdges(nodeId: string) {
			return edges.filter((e) => e.target === nodeId);
		},
		getOutgoingEdges(nodeId: string) {
			return edges.filter((e) => e.source === nodeId);
		},

		// 变量操作
		addVariable(variable: Variable) {
			variables = [...variables, variable];
		},
		getVariable(id: string) {
			return variables.find((v) => v.id === id);
		},
		removeVariable(id: string) {
			variables = variables.filter((v) => v.id !== id);
		},

		// 序列化
		toJSON() {
			return { metadata, nodes, edges, variables };
		},
		fromJSON(json: { metadata?: typeof metadata; nodes?: WorkflowNode<T>[]; edges?: WorkflowEdge[]; variables?: Variable[] }) {
			if (json.metadata) metadata = json.metadata;
			if (json.nodes) nodes = json.nodes;
			if (json.edges) edges = json.edges;
			if (json.variables) variables = json.variables;
		},

		// YAML 序列化 (兼容 Dify DSL 格式)
		toYAML(viewport?: { x: number; y: number; zoom: number }) {
			// 根据节点类型获取默认的 sourceHandle ID
			const getDefaultSourceHandle = (nodeId: string): string | undefined => {
				const node = nodes.find(n => n.id === nodeId);
				if (!node) return undefined;
				// LLM 节点的默认输出 handle 是 'output'
				if (node.type === 'llm') return 'output';
				// 其他节点没有指定 id，返回 undefined
				return undefined;
			};

			const data = {
				version: '1.0.0',
				workflow: {
					environment_variables: environmentVariables.map(v => ({
						id: v.id,
						name: v.name,
						value: v.value,
						value_type: v.value_type,
					})),
					conversation_variables: [],
					graph: {
						edges: edges.map(e => {
							const sourceHandle = e.sourceHandle ?? getDefaultSourceHandle(e.source);
							return {
								id: e.id,
								source: e.source,
								target: e.target,
								// 只有当 handle ID 存在时才导出
								...(sourceHandle && { sourceHandle }),
								// targetHandle 通常是 undefined（默认 handle）
								...(e.targetHandle && { targetHandle: e.targetHandle }),
								type: e.type ?? 'custom',
								zIndex: 0,
								...(e.data && { data: e.data }),
							};
						}),
						nodes: nodes.map(n => ({
							id: n.id,
							type: n.type === 'note' ? 'custom-note' : 'custom',
							position: n.position,
							positionAbsolute: n.position,
							data: {
								...n.data,
								type: n.type,
								// 如果节点在循环内，添加 isInLoop 和 loop_id 字段
								...(n.parentId && { isInLoop: true, loop_id: n.parentId }),
							},
							sourcePosition: 'right',
							targetPosition: 'left',
							...(n.width && { width: n.width }),
							...(n.height && { height: n.height }),
						})),
						viewport: viewport ?? { x: 0, y: 0, zoom: 1 },
					},
				},
			};
			return YAML.stringify(data, { indent: 2 });
		},
		fromYAML(yamlStr: string) {
			try {
				const data = YAML.parse(yamlStr);
				
				// 先清空 edges，避免引用不存在的节点
				edges = [];
				
				// 支持新格式 (workflow.graph.nodes) 和旧格式 (workflow.nodes)
				if (data.workflow) {
					const graph = data.workflow.graph ?? data.workflow;
					
					// 先加载 nodes
					if (graph.nodes) {
						interface YAMLNodeData extends Record<string, unknown> {
							type?: string;
							isInLoop?: boolean;
							loop_id?: string;
						}
						interface YAMLNode {
							id: string;
							type?: string;
							position: { x: number; y: number };
							data?: YAMLNodeData;
							width?: number;
							height?: number;
						}
						nodes = graph.nodes.map((n: YAMLNode) => {
							// 检查是否是循环内的子节点
							const isInLoop = n.data?.isInLoop === true;
							const loopId = n.data?.loop_id;
							
							// 从 data 中移除 isInLoop 和 loop_id，避免污染节点数据
							const cleanData = { ...n.data };
							delete cleanData.isInLoop;
							delete cleanData.loop_id;
							
							return {
								id: n.id,
								type: n.data?.type ?? n.type ?? 'custom',
								position: n.position,
								data: cleanData as T,
								...(n.width && { width: n.width }),
								...(n.height && { height: n.height }),
								// 如果是循环内节点，设置 parentId 和 extent
								...(isInLoop && loopId && { parentId: loopId, extent: 'parent' as const }),
							};
						});
					}
					
					// 延迟加载 edges，等待节点渲染完成
					if (graph.edges) {
						interface YAMLEdge {
							id: string;
							source: string;
							target: string;
							sourceHandle?: string;
							targetHandle?: string;
							type?: string;
							data?: Record<string, unknown>;
						}
						
						// 根据节点类型获取正确的 sourceHandle
						const getSourceHandle = (sourceId: string, yamlSourceHandle?: string): string | undefined => {
							// 如果 YAML 中有指定且不是旧格式的 'source'，使用它
							if (yamlSourceHandle && yamlSourceHandle !== 'source') {
								return yamlSourceHandle;
							}
							// 查找源节点类型
							const sourceNode = nodes.find(n => n.id === sourceId);
							if (!sourceNode) return undefined;
							// LLM 节点的默认输出 handle 是 'output'
							if (sourceNode.type === 'llm') return 'output';
							// 其他节点使用 undefined（默认 handle）
							return undefined;
						};
						
						// 获取正确的 targetHandle
						const getTargetHandle = (yamlTargetHandle?: string): string | undefined => {
							// 旧格式的 'target' 应该转为 undefined
							if (yamlTargetHandle === 'target') return undefined;
							return yamlTargetHandle;
						};
						
						const parsedEdges = graph.edges.map((e: YAMLEdge) => ({
							id: e.id,
							source: e.source,
							target: e.target,
							sourceHandle: getSourceHandle(e.source, e.sourceHandle),
							targetHandle: getTargetHandle(e.targetHandle),
							type: e.type,
							data: e.data,
						}));
						
						// 多次 requestAnimationFrame 确保 DOM 完全更新
						const loadEdges = () => {
							requestAnimationFrame(() => {
								requestAnimationFrame(() => {
									requestAnimationFrame(() => {
										edges = parsedEdges;
									});
								});
							});
						};
						// 额外延迟确保节点组件完全挂载
						setTimeout(loadEdges, 100);
					}
					
					// environment_variables
					if (data.workflow.environment_variables) {
						interface YAMLEnvVar {
							id: string;
							name: string;
							value: string;
							value_type: 'string' | 'secret';
						}
						environmentVariables = data.workflow.environment_variables.map((v: YAMLEnvVar) => ({
							id: v.id,
							name: v.name,
							value: v.value,
							value_type: v.value_type ?? 'string',
						}));
					}
				}
				
				// 兼容旧格式的 metadata
				if (data.metadata) {
					metadata = data.metadata;
				}
				
				return true;
			} catch (e) {
				console.error('Failed to parse YAML:', e);
				return false;
			}
		},

		// 导出为文件
		exportToFile(filename = 'workflow.yml', viewport?: { x: number; y: number; zoom: number }) {
			const yaml = this.toYAML(viewport);
			const blob = new Blob([yaml], { type: 'text/yaml' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			a.click();
			URL.revokeObjectURL(url);
		},

		// 从文件导入
		async importFromFile(file: File): Promise<boolean> {
			try {
				const text = await file.text();
				return this.fromYAML(text);
			} catch (e) {
				console.error('Failed to import file:', e);
				return false;
			}
		},

		// 清空（保留开始节点）
		clear() {
			nodes = [createStartNode<T>()];
			edges = [];
			variables = [];
			environmentVariables = [];
			selectedNodeIds = [];
			selectedEdgeIds = [];
		}
	};
}

// 全局单例
export const workflowState = createWorkflowState();
