/**
 * 生成 UUID v4
 */
export function uuid(): string {
	return crypto.randomUUID();
}

/**
 * 生成短 ID（用于显示）
 */
export function shortId(length = 8): string {
	return crypto.randomUUID().replace(/-/g, '').slice(0, length);
}

/**
 * 生成节点 ID
 * 格式: {nodeType}_{序号}，如 llm_1, agent_2, classifier_1
 * 
 * @param nodeType 节点类型
 * @param existingIds 已存在的节点 ID 列表
 */
export function generateNodeId(nodeType: string, existingIds: string[]): string {
	// 特殊节点使用固定 ID
	if (nodeType === 'start') return 'start';
	if (nodeType === 'output') return 'output';
	
	const prefix = `${nodeType}_`;
	let index = 1;
	
	// 循环查找可用的 ID
	while (existingIds.includes(`${prefix}${index}`)) {
		index++;
	}
	
	return `${prefix}${index}`;
}

/**
 * 生成边 ID
 * 格式: {sourceId}-{targetId}
 */
export function generateEdgeId(sourceId: string, targetId: string): string {
	return `${sourceId}-${targetId}`;
}
