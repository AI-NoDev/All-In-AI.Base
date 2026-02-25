/**
 * 编辑器 UI 状态 - 选择、交互模式、节点放置
 */
import type { BaseNodeData, WorkflowNode } from '$lib/components/workflow/types/index';
import { LOOP_HEADER_HEIGHT, LOOP_NODE_SIZE, NODE_SPACING, TARGET_HANDLE_OFFSET } from '$lib/components/workflow/constants/index';

/** 待放置节点模板 */
export interface PendingNodeTemplate {
	type: string;
	label: string;
	icon: string;
	color: string;
}

/** 节点选择器状态 */
export interface NodePickerState {
	visible: boolean;
	position: { x: number; y: number };
	sourceNodeId: string;
	sourceHandleId: string;
	parentLoopId?: string;
	handleOffsetY?: number;
}

/**
 * 创建编辑器 UI 状态
 */
export function createEditorUIState<T extends BaseNodeData = BaseNodeData>(
	getNodes: () => WorkflowNode<T>[],
	setNodes: (nodes: WorkflowNode<T>[]) => void,
	getEdges: () => { id: string; source: string; sourceHandle?: string; target: string; targetHandle?: string }[],
	setEdges: (edges: { id: string; source: string; sourceHandle?: string; target: string; targetHandle?: string }[]) => void
) {
	// 选择状态
	let selectedNodeIds = $state<string[]>([]);
	let selectedEdgeIds = $state<string[]>([]);
	
	// 编辑器状态
	let readonly = $state(false);
	let interactionMode = $state<'hand' | 'pointer'>('hand');
	
	// 节点放置状态
	let placingNodeId = $state<string | null>(null);
	let placingNodeTemplate = $state<PendingNodeTemplate | null>(null);
	
	// 节点选择器状态
	let nodePickerState = $state<NodePickerState>({
		visible: false,
		position: { x: 0, y: 0 },
		sourceNodeId: '',
		sourceHandleId: ''
	});

	return {
		// Getters
		get selectedNodeIds() { return selectedNodeIds; },
		get selectedEdgeIds() { return selectedEdgeIds; },
		get readonly() { return readonly; },
		get interactionMode() { return interactionMode; },
		get placingNodeId() { return placingNodeId; },
		get placingNodeTemplate() { return placingNodeTemplate; },
		get nodePickerState() { return nodePickerState; },

		// Setters
		set selectedNodeIds(v: string[]) { selectedNodeIds = v; },
		set selectedEdgeIds(v: string[]) { selectedEdgeIds = v; },
		set readonly(v: boolean) { readonly = v; },
		set interactionMode(v: 'hand' | 'pointer') { interactionMode = v; },

		// 节点放置操作
		startPendingNode(template: PendingNodeTemplate, initialPosition?: { x: number; y: number }) {
			const id = crypto.randomUUID();
			const pos = initialPosition ?? { x: 0, y: 0 };
			const nodes = getNodes();
			
			let nodeData: Record<string, unknown>;
			
			if (template.type === 'note') {
				nodeData = { title: template.label, type: template.type, content: '', color: 'yellow' };
			} else if (template.type === 'if') {
				nodeData = {
					title: template.label,
					type: template.type,
					desc: '',
					cases: [{ id: crypto.randomUUID(), type: 'if', conditions: [], logicalOperator: 'and' }]
				};
			} else if (template.type === 'loop') {
				nodeData = {
					title: template.label,
					type: template.type,
					desc: '',
					variables: [],
					breakConditions: [],
					maxIterations: 10
				};
				setNodes([...nodes, {
					id,
					type: template.type,
					position: pos,
					data: nodeData as T,
					style: `width: ${LOOP_NODE_SIZE.width}px; height: ${LOOP_NODE_SIZE.height}px;`,
					width: LOOP_NODE_SIZE.width,
					height: LOOP_NODE_SIZE.height,
					measured: { width: LOOP_NODE_SIZE.width, height: LOOP_NODE_SIZE.height }
				}]);
				placingNodeId = id;
				placingNodeTemplate = template;
				return;
			} else {
				nodeData = { title: template.label, type: template.type, desc: '' };
			}
			
			setNodes([...nodes, { id, type: template.type, position: pos, data: nodeData as T }]);
			placingNodeId = id;
			placingNodeTemplate = template;
		},

		updatePlacingNodePosition(pos: { x: number; y: number }) {
			if (!placingNodeId) return;
			const nodes = getNodes();
			setNodes(nodes.map(n => n.id === placingNodeId ? { ...n, position: pos } : n));
		},

		confirmPendingNode() {
			placingNodeId = null;
			placingNodeTemplate = null;
		},

		cancelPendingNode() {
			if (placingNodeId) {
				const nodes = getNodes();
				setNodes(nodes.filter(n => n.id !== placingNodeId));
			}
			placingNodeId = null;
			placingNodeTemplate = null;
		},

		// 节点选择器操作
		showNodePicker(position: { x: number; y: number }, sourceNodeId: string, sourceHandleId: string, parentLoopId?: string, handleOffsetY?: number) {
			nodePickerState = { visible: true, position, sourceNodeId, sourceHandleId, parentLoopId, handleOffsetY };
		},

		hideNodePicker() {
			nodePickerState = { visible: false, position: { x: 0, y: 0 }, sourceNodeId: '', sourceHandleId: '' };
		},

		createNodeFromPicker(template: PendingNodeTemplate) {
			const { sourceNodeId, sourceHandleId, parentLoopId, handleOffsetY } = nodePickerState;
			if (!sourceNodeId) return;

			const nodes = getNodes();
			const edges = getEdges();
			const sourceNode = nodes.find(n => n.id === sourceNodeId);
			if (!sourceNode) return;

			const id = crypto.randomUUID();
			let nodeData: Record<string, unknown> = { title: template.label, type: template.type, desc: '' };

			if (template.type === 'loop-break') {
				nodeData = { title: template.label, type: template.type, reason: '' };
			} else if (template.type === 'if') {
				nodeData = {
					title: template.label,
					type: template.type,
					desc: '',
					cases: [{ id: crypto.randomUUID(), type: 'if', conditions: [], logicalOperator: 'and' }]
				};
			}

			let newPosition: { x: number; y: number };

			if (parentLoopId) {
				const childNodes = nodes.filter(n => n.parentId === parentLoopId);
				if (childNodes.length === 0) {
					const yOffset = handleOffsetY !== undefined 
						? Math.max(handleOffsetY - TARGET_HANDLE_OFFSET, LOOP_HEADER_HEIGHT) 
						: LOOP_HEADER_HEIGHT;
					newPosition = { x: 100, y: yOffset };
				} else {
					const rightmostNode = childNodes.reduce((max, n) => n.position.x > max.position.x ? n : max, childNodes[0]);
					newPosition = { x: rightmostNode.position.x + NODE_SPACING.horizontal, y: Math.max(rightmostNode.position.y, LOOP_HEADER_HEIGHT) };
				}

				setNodes([...nodes, {
					id,
					type: template.type,
					position: newPosition,
					data: nodeData as T,
					parentId: parentLoopId,
					extent: 'parent'
				}]);
			} else {
				const sourceHandleY = handleOffsetY ?? TARGET_HANDLE_OFFSET;
				newPosition = {
					x: sourceNode.position.x + NODE_SPACING.horizontal + 20,
					y: sourceNode.position.y + sourceHandleY - TARGET_HANDLE_OFFSET
				};
				setNodes([...nodes, { id, type: template.type, position: newPosition, data: nodeData as T }]);
			}

			const targetHandleId = (template.type === 'loop' || template.type === 'loop-break') ? 'input' : 'target';
			setEdges([...edges, {
				id: crypto.randomUUID(),
				source: sourceNodeId,
				sourceHandle: sourceHandleId,
				target: id,
				targetHandle: targetHandleId
			}]);

			this.hideNodePicker();
		},

		// 添加子节点到循环内
		addChildNode(parentId: string, template: PendingNodeTemplate, relativePosition: { x: number; y: number }) {
			const nodes = getNodes();
			const parentNode = nodes.find(n => n.id === parentId);
			if (!parentNode || parentNode.type !== 'loop') return null;

			const id = crypto.randomUUID();
			const nodeData: Record<string, unknown> = { title: template.label, type: template.type, desc: '' };

			setNodes([...nodes, {
				id,
				type: template.type,
				position: relativePosition,
				data: nodeData as T,
				parentId: parentId,
				extent: 'parent'
			}]);

			return id;
		}
	};
}
