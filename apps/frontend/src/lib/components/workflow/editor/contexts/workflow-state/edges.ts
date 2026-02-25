import type { WorkflowEdge } from '$lib/components/workflow/types/index';

/** 边操作方法 */
export function createEdgeOperations(
	getEdges: () => WorkflowEdge[],
	setEdges: (edges: WorkflowEdge[]) => void
) {
	return {
		/** 添加边 */
		addEdge(edge: WorkflowEdge) {
			setEdges([...getEdges(), edge]);
		},
		
		/** 获取边 */
		getEdge(id: string) {
			return getEdges().find(e => e.id === id);
		},
		
		/** 删除边 */
		removeEdge(id: string) {
			setEdges(getEdges().filter(e => e.id !== id));
		},
		
		/** 获取入边 */
		getIncomingEdges(nodeId: string) {
			return getEdges().filter(e => e.target === nodeId);
		},
		
		/** 获取出边 */
		getOutgoingEdges(nodeId: string) {
			return getEdges().filter(e => e.source === nodeId);
		}
	};
}
