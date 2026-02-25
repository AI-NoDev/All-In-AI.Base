/**
 * 循环节点自动调整大小
 */
import type { WorkflowNode, BaseNodeData } from '$lib/components/workflow/types/index';
import { DEFAULT_NODE_SIZE, LOOP_NODE_PADDING, LOOP_HEADER_HEIGHT, LOOP_NODE_SIZE } from '$lib/components/workflow/constants/index';

/**
 * 计算循环节点需要的最小尺寸
 */
export function calculateLoopNodeSize<T extends BaseNodeData>(
	loopNodeId: string,
	nodes: WorkflowNode<T>[]
): { width: number; height: number } | null {
	const loopNode = nodes.find(n => n.id === loopNodeId);
	if (!loopNode || loopNode.type !== 'loop') return null;

	const childNodes = nodes.filter(n => n.parentId === loopNodeId);
	if (childNodes.length === 0) {
		return { width: LOOP_NODE_SIZE.width, height: LOOP_NODE_SIZE.height };
	}

	let maxRight = 0;
	let maxBottom = 0;

	for (const child of childNodes) {
		const right = child.position.x + DEFAULT_NODE_SIZE.width;
		const bottom = child.position.y + DEFAULT_NODE_SIZE.height;
		if (right > maxRight) maxRight = right;
		if (bottom > maxBottom) maxBottom = bottom;
	}

	const minWidth = Math.max(LOOP_NODE_SIZE.width, maxRight + LOOP_NODE_PADDING);
	const minHeight = Math.max(LOOP_NODE_SIZE.height, maxBottom + LOOP_NODE_PADDING + LOOP_HEADER_HEIGHT);

	return { width: minWidth, height: minHeight };
}

/**
 * 自动调整循环节点大小
 */
export function autoResizeLoopNode<T extends BaseNodeData>(
	loopNodeId: string,
	nodes: WorkflowNode<T>[],
	setNodes: (nodes: WorkflowNode<T>[]) => void
): void {
	const size = calculateLoopNodeSize(loopNodeId, nodes);
	if (!size) return;

	const loopNode = nodes.find(n => n.id === loopNodeId);
	if (!loopNode) return;

	const currentWidth = loopNode.width ?? LOOP_NODE_SIZE.width;
	const currentHeight = loopNode.height ?? LOOP_NODE_SIZE.height;

	if (size.width > currentWidth || size.height > currentHeight) {
		const newWidth = Math.max(currentWidth, size.width);
		const newHeight = Math.max(currentHeight, size.height);
		
		setNodes(nodes.map(n =>
			n.id === loopNodeId
				? {
					...n,
					width: newWidth,
					height: newHeight,
					measured: { width: newWidth, height: newHeight },
					style: `width: ${newWidth}px; height: ${newHeight}px;`
				}
				: n
		));
	}
}
