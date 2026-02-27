/**
 * KnowledgeNode 验证器
 */
import type { ValidationIssue, ValidationContext } from '../../validation/types';
import type { KnowledgeNodeData } from './types';

export function validate(
	nodeId: string,
	nodeTitle: string,
	nodeType: string,
	data: unknown,
	context: ValidationContext
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const nodeData = data as KnowledgeNodeData;

	// 检查是否选择了知识库
	if (!nodeData.knowledgeBases || nodeData.knowledgeBases.length === 0) {
		issues.push({
			id: `${nodeId}-no-knowledge-base`,
			severity: 'error',
			message: '未选择知识库',
			nodeId,
			nodeTitle,
			nodeType,
			field: 'knowledgeBases',
		});
	}

	// 检查查询变量
	if (!nodeData.queryVariable?.trim()) {
		issues.push({
			id: `${nodeId}-no-query`,
			severity: 'error',
			message: '未配置查询变量',
			nodeId,
			nodeTitle,
			nodeType,
			field: 'queryVariable',
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
