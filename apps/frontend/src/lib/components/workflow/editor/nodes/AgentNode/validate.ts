/**
 * AgentNode 验证器
 */
import type { ValidationIssue, ValidationContext } from '../../validation/types';
import type { AgentNodeData } from './types';

export function validate(
	nodeId: string,
	nodeTitle: string,
	nodeType: string,
	data: unknown,
	context: ValidationContext
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const nodeData = data as AgentNodeData;

	// 检查是否选择了 Agent
	if (!nodeData.agentId) {
		issues.push({
			id: `${nodeId}-no-agent`,
			severity: 'error',
			message: '未选择 Agent',
			nodeId,
			nodeTitle,
			nodeType,
			field: 'agentId',
		});
	}

	// 检查是否有输入连接
	const hasIncomingEdge = context.edges.some(e => e.target === nodeId);
	if (!hasIncomingEdge) {
		issues.push({
			id: `${nodeId}-no-input`,
			severity: 'warning',
			message: '节点没有输入连接',
			nodeId,
			nodeTitle,
			nodeType,
		});
	}

	// 检查是否有输出连接
	const hasOutgoingEdge = context.edges.some(e => e.source === nodeId);
	if (!hasOutgoingEdge) {
		issues.push({
			id: `${nodeId}-no-output`,
			severity: 'warning',
			message: '节点没有输出连接',
			nodeId,
			nodeTitle,
			nodeType,
		});
	}

	return issues;
}
