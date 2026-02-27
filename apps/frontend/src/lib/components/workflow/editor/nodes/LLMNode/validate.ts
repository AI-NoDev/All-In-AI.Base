/**
 * LLMNode 验证器
 */
import type { ValidationIssue, ValidationContext } from '../../validation/types';
import type { LLMNodeData } from './types';

export function validate(
	nodeId: string,
	nodeTitle: string,
	nodeType: string,
	data: unknown,
	context: ValidationContext
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];
	const nodeData = data as LLMNodeData;

	// 检查模型配置
	if (!nodeData.modelConfig?.provider || !nodeData.modelConfig?.model) {
		issues.push({
			id: `${nodeId}-no-model`,
			severity: 'error',
			message: '未配置模型',
			nodeId,
			nodeTitle,
			nodeType,
			field: 'modelConfig',
		});
	}

	// 检查提示词消息
	const hasPromptMessages = nodeData.promptMessages && nodeData.promptMessages.length > 0;
	const hasLegacyPrompt = nodeData.userPromptTemplate?.trim();
	
	if (hasPromptMessages) {
		// 检查是否有非空的用户消息
		const hasUserMessage = nodeData.promptMessages.some(
			m => m.role === 'user' && m.content.trim()
		);
		if (!hasUserMessage) {
			issues.push({
				id: `${nodeId}-no-user-prompt`,
				severity: 'error',
				message: '至少需要一条用户消息',
				nodeId,
				nodeTitle,
				nodeType,
				field: 'promptMessages',
			});
		}
	} else if (!hasLegacyPrompt) {
		// 兼容旧数据
		issues.push({
			id: `${nodeId}-no-prompt`,
			severity: 'error',
			message: '用户提示词不能为空',
			nodeId,
			nodeTitle,
			nodeType,
			field: 'userPromptTemplate',
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
