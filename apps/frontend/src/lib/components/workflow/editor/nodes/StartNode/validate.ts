/**
 * StartNode 验证器
 */
import type { ValidationIssue, ValidationContext } from '../../validation/types';
import type { StartNodeData } from './types';

export function validate(
	nodeId: string,
	nodeTitle: string,
	nodeType: string,
	data: unknown,
	context: ValidationContext
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const nodeData = data as StartNodeData;

	// 检查是否有输出连接
	const hasOutgoingEdge = context.edges.some(e => e.source === nodeId);
	if (!hasOutgoingEdge) {
		issues.push({
			id: `${nodeId}-no-output`,
			severity: 'warning',
			message: '开始节点没有连接到任何节点',
			nodeId,
			nodeTitle,
			nodeType,
		});
	}

	return issues;
}
