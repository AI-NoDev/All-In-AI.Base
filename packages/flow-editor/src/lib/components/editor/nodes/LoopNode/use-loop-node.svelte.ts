import { workflowState } from '$lib/components/editor/contexts/index.js';
import type { LoopNodeData } from './types.js';
import {
	DEFAULT_MIN_WIDTH,
	DEFAULT_MIN_HEIGHT,
	CHILD_NODE_WIDTH,
	CHILD_NODE_HEIGHT,
	PADDING,
	HEADER_HEIGHT
} from './constants.js';

interface UseLoopNodeOptions {
	id: string;
	data: LoopNodeData;
}

/** 更新节点尺寸的辅助函数 */
function updateNodeSize(nodeId: string, newWidth: number, newHeight: number) {
	const nodeIndex = workflowState.nodes.findIndex(n => n.id === nodeId);
	if (nodeIndex !== -1) {
		const node = workflowState.nodes[nodeIndex];
		if (node.width !== newWidth || node.height !== newHeight) {
			workflowState.nodes[nodeIndex] = {
				...node,
				width: newWidth,
				height: newHeight,
				measured: { width: newWidth, height: newHeight },
				style: `width: ${newWidth}px; height: ${newHeight}px;`
			};
		}
	}
}

/** 循环节点逻辑 hook */
export function useLoopNode(options: UseLoopNodeOptions) {
	const { id, data } = options;

	// 响应式获取当前节点数据
	const currentData = $derived.by(() => {
		const node = workflowState.getNode(id);
		return (node?.data as LoopNodeData) ?? data;
	});

	// 计算子节点的最小包围盒
	const minSize = $derived.by(() => {
		const childNodes = workflowState.nodes.filter(n => n.parentId === id);
		if (childNodes.length === 0) {
			return { width: DEFAULT_MIN_WIDTH, height: DEFAULT_MIN_HEIGHT };
		}

		let maxRight = 0;
		let maxBottom = 0;

		for (const child of childNodes) {
			const right = child.position.x + CHILD_NODE_WIDTH;
			const bottom = child.position.y + CHILD_NODE_HEIGHT;
			if (right > maxRight) maxRight = right;
			if (bottom > maxBottom) maxBottom = bottom;
		}

		return {
			width: Math.max(DEFAULT_MIN_WIDTH, maxRight + PADDING),
			height: Math.max(DEFAULT_MIN_HEIGHT, maxBottom + PADDING + HEADER_HEIGHT)
		};
	});

	// 获取循环节点的尺寸
	const width = $derived.by(() => {
		const node = workflowState.getNode(id);
		return node?.width ?? DEFAULT_MIN_WIDTH;
	});

	const height = $derived.by(() => {
		const node = workflowState.getNode(id);
		return node?.height ?? DEFAULT_MIN_HEIGHT;
	});

	// 当 minSize 超过当前节点尺寸时，自动扩展节点
	$effect(() => {
		const currentWidth = width;
		const currentHeight = height;

		// 只有当 minSize 超过当前尺寸时才更新
		if (minSize.width > currentWidth || minSize.height > currentHeight) {
			const newWidth = Math.max(currentWidth, minSize.width);
			const newHeight = Math.max(currentHeight, minSize.height);
			updateNodeSize(id, newWidth, newHeight);
		}
	});

	// 检查循环入口 handle 是否已连接
	const loopEntryConnected = $derived(
		workflowState.edges.some(e => e.source === id && e.sourceHandle === 'loop-entry')
	);

	// 获取循环内的子节点数量
	const childNodeCount = $derived(
		workflowState.nodes.filter(n => n.parentId === id).length
	);

	// 派生数据
	const maxIterations = $derived(currentData.maxIterations ?? 10);
	const breakConditions = $derived(currentData.breakConditions ?? []);
	const title = $derived(currentData.title || '循环');

	/** 处理 resize 事件 */
	function handleResize(event: CustomEvent<{ width: number; height: number }>) {
		const { width: newWidth, height: newHeight } = event.detail;
		updateNodeSize(id, newWidth, newHeight);
	}

	/** 将 flow 坐标转换为屏幕坐标 */
	function flowToScreenCoords(flowX: number, flowY: number): { x: number; y: number } | null {
		const flowElement = document.querySelector('.svelte-flow') as HTMLElement;
		if (!flowElement) return null;

		const rect = flowElement.getBoundingClientRect();
		const viewportElement = flowElement.querySelector('.svelte-flow__viewport') as HTMLElement;
		if (!viewportElement) return null;

		const transform = viewportElement.style.transform;
		const match = transform.match(/translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)\s*scale\(([\d.]+)\)/);
		if (!match) return null;

		const viewportX = parseFloat(match[1]);
		const viewportY = parseFloat(match[2]);
		const zoom = parseFloat(match[3]);

		const screenX = rect.left + viewportX + flowX * zoom;
		const screenY = rect.top + viewportY + flowY * zoom;

		return { x: screenX, y: screenY };
	}

	/** 点击循环入口引脚，弹出节点选择器 */
	function handleLoopEntryClick(e: MouseEvent, handleLeft: number, handleTop: number) {
		e.stopPropagation();

		const node = workflowState.getNode(id);
		if (!node) return;

		const handleFlowX = node.position.x + handleLeft;
		const handleFlowY = node.position.y + handleTop;

		const screenPos = flowToScreenCoords(handleFlowX, handleFlowY);
		if (!screenPos) return;

		workflowState.showNodePicker(
			{ x: screenPos.x + 10, y: screenPos.y - 50 },
			id,
			'loop-entry',
			id,
			handleTop
		);
	}

	return {
		// 数据
		currentData,
		width,
		height,
		minSize,
		loopEntryConnected,
		childNodeCount,
		maxIterations,
		breakConditions,
		title,
		// 方法
		handleResize,
		handleLoopEntryClick,
		flowToScreenCoords
	};
}
