/**
 * 工作流验证核心逻辑
 */
import type { ValidationIssue, ValidationContext, NodeValidator } from './types';
import type { WorkflowNode, WorkflowEdge, EnvironmentVariable } from '$lib/components/workflow/types/index';
import type { InputVariable } from '../contexts/workflow-state/types';

// 从各节点目录导入验证器
import { validate as validateStart } from '../nodes/StartNode/validate';
import { validate as validateLLM } from '../nodes/LLMNode/validate';
import { validate as validateOutput } from '../nodes/OutputNode/validate';
import { validate as validateIf } from '../nodes/IfNode/validate';
import { validate as validateClassifier } from '../nodes/ClassifierNode/validate';
import { validate as validateAgent } from '../nodes/AgentNode/validate';
import { validate as validateKnowledge } from '../nodes/KnowledgeNode/validate';
import { validate as validateLoop } from '../nodes/LoopNode/validate';
import { validate as validateLoopBreak } from '../nodes/LoopBreakNode/validate';
import { validate as validateNote } from '../nodes/NoteNode/validate';

/** 节点类型到验证器的映射 */
const validators: Record<string, NodeValidator> = {
	start: validateStart,
	llm: validateLLM,
	output: validateOutput,
	if: validateIf,
	classifier: validateClassifier,
	agent: validateAgent as NodeValidator,
	knowledge: validateKnowledge as NodeValidator,
	loop: validateLoop as NodeValidator,
	'loop-break': validateLoopBreak as NodeValidator,
	note: validateNote,
};

/**
 * 验证整个工作流
 */
export function validateWorkflow(
	nodes: WorkflowNode[],
	edges: WorkflowEdge[],
	environmentVariables: EnvironmentVariable[],
	inputVariables: InputVariable[]
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];

	// 构建验证上下文
	const context: ValidationContext = {
		nodeIds: nodes.map(n => n.id),
		edges: edges.map(e => ({ source: e.source, target: e.target })),
		envVarNames: environmentVariables.map(v => v.name),
		inputVarNames: inputVariables.map(v => v.name),
	};

	// 验证每个节点
	for (const node of nodes) {
		const nodeData = node.data;
		const nodeTitle = (nodeData as { title?: string }).title || node.id;
		const nodeType = node.type || 'unknown';

		// 获取对应的验证器
		const validator = validators[nodeType];
		if (validator) {
			issues.push(...validator(node.id, nodeTitle, nodeType, nodeData, context));
		}
		// note 节点不需要验证，其他未知节点也跳过
	}

	// 检查环境变量是否有空值
	environmentVariables.forEach(v => {
		if (!v.value || v.value.trim() === '') {
			issues.push({
				id: `env-${v.id}-empty`,
				severity: 'warning',
				message: `环境变量 "${v.name}" 未设置值`,
				nodeId: '',
				nodeTitle: '环境变量',
				nodeType: 'environment',
			});
		}
	});

	return issues;
}
