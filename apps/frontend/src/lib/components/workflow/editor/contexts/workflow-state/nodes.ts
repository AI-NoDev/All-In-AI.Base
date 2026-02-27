import type { WorkflowNode, WorkflowEdge, BaseNodeData } from '$lib/components/workflow/types/index';
import type { PendingNodeTemplate, NodePickerState } from './types';
import { 
	START_NODE_ID, 
	LOOP_HEADER_HEIGHT, 
	LOOP_NODE_SIZE, 
	NODE_SPACING, 
	TARGET_HANDLE_OFFSET,
	DEFAULT_NODE_SIZE,
	LOOP_NODE_PADDING
} from '$lib/components/workflow/constants/index';
import { generateNodeId, generateEdgeId } from '$lib/components/workflow/utils/uuid';

/** 创建默认开始节点 */
export function createStartNode<T extends BaseNodeData>(): WorkflowNode<T> {
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

/** 节点操作方法 */
export function createNodeOperations<T extends BaseNodeData>(
	getNodes: () => WorkflowNode<T>[],
	setNodes: (nodes: WorkflowNode<T>[]) => void,
	getEdges: () => WorkflowEdge[],
	setEdges: (edges: WorkflowEdge[]) => void,
	getPlacingNodeId: () => string | null,
	setPlacingNodeId: (id: string | null) => void,
	setPlacingNodeTemplate: (template: PendingNodeTemplate | null) => void,
	getNodePickerState: () => NodePickerState,
	setNodePickerState: (state: NodePickerState) => void
) {
	return {
		/** 开始放置节点 */
		startPendingNode(template: PendingNodeTemplate, initialPosition?: { x: number; y: number }) {
			const nodes = getNodes();
			const existingIds = nodes.map(n => n.id);
			const id = generateNodeId(template.type, existingIds);
			const pos = initialPosition ?? { x: 0, y: 0 };
			
			let nodeData: Record<string, unknown>;
			
			if (template.type === 'note') {
				nodeData = { title: template.label, type: template.type, content: '', color: 'yellow' };
			} else if (template.type === 'if') {
				nodeData = {
					title: template.label, type: template.type, desc: '',
					cases: [{ id: crypto.randomUUID(), type: 'if', conditions: [], logicalOperator: 'and' }]
				};
			} else if (template.type === 'loop') {
				nodeData = {
					title: template.label, type: template.type, desc: '',
					variables: [], breakConditions: [], maxIterations: 10
				};
				setNodes([...nodes, {
					id, type: template.type, position: pos, data: nodeData as T,
					style: `width: ${LOOP_NODE_SIZE.width}px; height: ${LOOP_NODE_SIZE.height}px;`,
					width: LOOP_NODE_SIZE.width, height: LOOP_NODE_SIZE.height,
					measured: { width: LOOP_NODE_SIZE.width, height: LOOP_NODE_SIZE.height }
				}]);
				setPlacingNodeId(id);
				setPlacingNodeTemplate(template);
				return;
			} else {
				nodeData = { title: template.label, type: template.type, desc: '' };
			}
			
			setNodes([...nodes, { id, type: template.type, position: pos, data: nodeData as T }]);
			setPlacingNodeId(id);
			setPlacingNodeTemplate(template);
		},
		
		/** 更新正在放置的节点位置 */
		updatePlacingNodePosition(pos: { x: number; y: number }) {
			const placingNodeId = getPlacingNodeId();
			if (!placingNodeId) return;
			setNodes(getNodes().map(n => n.id === placingNodeId ? { ...n, position: pos } : n));
		},
		
		/** 确认放置节点 */
		confirmPendingNode() {
			setPlacingNodeId(null);
			setPlacingNodeTemplate(null);
		},
		
		/** 取消放置节点 */
		cancelPendingNode() {
			const placingNodeId = getPlacingNodeId();
			if (placingNodeId) {
				setNodes(getNodes().filter(n => n.id !== placingNodeId));
			}
			setPlacingNodeId(null);
			setPlacingNodeTemplate(null);
		},

		/** 添加节点 */
		addNode(node: WorkflowNode<T>) {
			setNodes([...getNodes(), node]);
		},
		
		/** 获取节点 */
		getNode(id: string) {
			return getNodes().find(n => n.id === id);
		},
		
		/** 更新节点 */
		updateNode(id: string, data: Partial<T>) {
			setNodes(getNodes().map(n => n.id === id ? { ...n, data: { ...n.data, ...data } as T } : n));
		},
		
		/** 删除节点 */
		removeNode(id: string) {
			if (id === START_NODE_ID) return;
			const nodes = getNodes();
			const edges = getEdges();
			const node = nodes.find(n => n.id === id);
			
			if (node?.type === 'loop') {
				const childIds = nodes.filter(n => n.parentId === id).map(n => n.id);
				setNodes(nodes.filter(n => n.id !== id && n.parentId !== id));
				setEdges(edges.filter(e => 
					e.source !== id && e.target !== id && 
					!childIds.includes(e.source) && !childIds.includes(e.target)
				));
			} else {
				setNodes(nodes.filter(n => n.id !== id));
				setEdges(edges.filter(e => e.source !== id && e.target !== id));
			}
		},
		
		/** 获取循环节点的子节点 */
		getChildNodes(parentId: string) {
			return getNodes().filter(n => n.parentId === parentId);
		},
		
		/** 添加子节点到循环内 */
		addChildNode(parentId: string, template: PendingNodeTemplate, relativePosition: { x: number; y: number }) {
			const nodes = getNodes();
			const parentNode = nodes.find(n => n.id === parentId);
			if (!parentNode || parentNode.type !== 'loop') return null;
			
			const existingIds = nodes.map(n => n.id);
			const id = generateNodeId(template.type, existingIds);
			const nodeData: Record<string, unknown> = { title: template.label, type: template.type, desc: '' };
			
			const childNode: WorkflowNode<T> = {
				id, type: template.type, position: relativePosition,
				data: nodeData as T, parentId, extent: 'parent'
			};
			
			setNodes([...nodes, childNode]);
			this.autoResizeLoopNode(parentId);
			return id;
		},
		
		/** 显示节点选择器 */
		showNodePicker(position: { x: number; y: number }, sourceNodeId: string, sourceHandleId: string, parentLoopId?: string, handleOffsetY?: number) {
			setNodePickerState({ visible: true, position, sourceNodeId, sourceHandleId, parentLoopId, handleOffsetY });
		},
		
		/** 隐藏节点选择器 */
		hideNodePicker() {
			setNodePickerState({ visible: false, position: { x: 0, y: 0 }, sourceNodeId: '', sourceHandleId: '' });
		},
		
		/** 从节点选择器创建节点并连接 */
		createNodeFromPicker(template: PendingNodeTemplate) {
			const { sourceNodeId, sourceHandleId, parentLoopId, handleOffsetY } = getNodePickerState();
			if (!sourceNodeId) return;
			
			const nodes = getNodes();
			const edges = getEdges();
			const sourceNode = nodes.find(n => n.id === sourceNodeId);
			if (!sourceNode) return;
			
			const existingIds = nodes.map(n => n.id);
			const id = generateNodeId(template.type, existingIds);
			let nodeData: Record<string, unknown> = { title: template.label, type: template.type, desc: '' };
			
			if (template.type === 'loop-break') {
				nodeData = { title: template.label, type: template.type, reason: '' };
			} else if (template.type === 'if') {
				nodeData = {
					title: template.label, type: template.type, desc: '',
					cases: [{ id: crypto.randomUUID(), type: 'if', conditions: [], logicalOperator: 'and' }]
				};
			}
			
			let newPosition: { x: number; y: number };
			
			if (parentLoopId) {
				const parentNode = nodes.find(n => n.id === parentLoopId);
				if (!parentNode) return;
				
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
				
				const childNode: WorkflowNode<T> = {
					id, type: template.type, position: newPosition,
					data: nodeData as T, parentId: parentLoopId, extent: 'parent'
				};
				setNodes([...nodes, childNode]);
				this.autoResizeLoopNode(parentLoopId);
			} else {
				const sourceHandleY = handleOffsetY ?? TARGET_HANDLE_OFFSET;
				newPosition = {
					x: sourceNode.position.x + NODE_SPACING.horizontal + 20,
					y: sourceNode.position.y + sourceHandleY - TARGET_HANDLE_OFFSET
				};
				setNodes([...nodes, { id, type: template.type, position: newPosition, data: nodeData as T }]);
			}
			
			const edgeId = generateEdgeId(sourceNodeId, id);
			const targetHandleId = (template.type === 'loop' || template.type === 'loop-break') ? 'input' : 'target';
			setEdges([...edges, { id: edgeId, source: sourceNodeId, sourceHandle: sourceHandleId, target: id, targetHandle: targetHandleId }]);
			
			this.hideNodePicker();
		},
		
		/** 自动调整循环节点大小 */
		autoResizeLoopNode(loopNodeId: string) {
			const nodes = getNodes();
			const loopNode = nodes.find(n => n.id === loopNodeId);
			if (!loopNode || loopNode.type !== 'loop') return;
			
			const childNodes = nodes.filter(n => n.parentId === loopNodeId);
			if (childNodes.length === 0) return;
			
			let maxRight = 0, maxBottom = 0;
			for (const child of childNodes) {
				const right = child.position.x + DEFAULT_NODE_SIZE.width;
				const bottom = child.position.y + DEFAULT_NODE_SIZE.height;
				if (right > maxRight) maxRight = right;
				if (bottom > maxBottom) maxBottom = bottom;
			}
			
			const minWidth = Math.max(LOOP_NODE_SIZE.width, maxRight + LOOP_NODE_PADDING);
			const minHeight = Math.max(LOOP_NODE_SIZE.height, maxBottom + LOOP_NODE_PADDING + LOOP_HEADER_HEIGHT);
			
			const currentWidth = loopNode.width ?? LOOP_NODE_SIZE.width;
			const currentHeight = loopNode.height ?? LOOP_NODE_SIZE.height;
			
			if (minWidth > currentWidth || minHeight > currentHeight) {
				const newWidth = Math.max(currentWidth, minWidth);
				const newHeight = Math.max(currentHeight, minHeight);
				setNodes(nodes.map(n => 
					n.id === loopNodeId 
						? { ...n, width: newWidth, height: newHeight, measured: { width: newWidth, height: newHeight }, style: `width: ${newWidth}px; height: ${newHeight}px;` } 
						: n
				));
			}
		}
	};
}
