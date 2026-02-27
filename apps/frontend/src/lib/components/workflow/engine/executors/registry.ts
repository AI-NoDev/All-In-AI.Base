/**
 * 节点执行器注册表
 */
import type { NodeExecutorRegistry } from '../types';

// 从各节点模块导入执行器
import { StartNodeExecutor } from '../../editor/nodes/StartNode/executor';
import { LLMNodeExecutor } from '../../editor/nodes/LLMNode/executor';
import { IfNodeExecutor } from '../../editor/nodes/IfNode/executor';
import { OutputNodeExecutor } from '../../editor/nodes/OutputNode/executor';
import { LoopNodeExecutor } from '../../editor/nodes/LoopNode/executor';
import { LoopBreakNodeExecutor } from '../../editor/nodes/LoopBreakNode/executor';
import { AgentNodeExecutor, type AgentCallFunction } from '../../editor/nodes/AgentNode/executor';
import { KnowledgeNodeExecutor, type KnowledgeRetrievalFunction } from '../../editor/nodes/KnowledgeNode/executor';
import { ClassifierNodeExecutor } from '../../editor/nodes/ClassifierNode/executor';

/** 执行器配置选项 */
export interface ExecutorOptions {
	/** Agent 调用函数 */
	agentCall?: AgentCallFunction;
	/** 知识库检索函数 */
	knowledgeRetrieval?: KnowledgeRetrievalFunction;
}

// 重新导出类型供外部使用
export type { AgentCallFunction } from '../../editor/nodes/AgentNode/executor';
export type { KnowledgeRetrievalFunction } from '../../editor/nodes/KnowledgeNode/executor';

/**
 * 创建默认执行器注册表
 */
export function createDefaultExecutors(options: ExecutorOptions = {}): NodeExecutorRegistry {
	const { agentCall, knowledgeRetrieval } = options;
	const registry: NodeExecutorRegistry = new Map();

	// 注册内置执行器
	registry.set('start', new StartNodeExecutor());
	registry.set('if', new IfNodeExecutor());
	registry.set('output', new OutputNodeExecutor());
	registry.set('loop', new LoopNodeExecutor());
	registry.set('loop-break', new LoopBreakNodeExecutor());

	// LLM 执行器（使用 Chat API，不需要外部函数）
	registry.set('llm', new LLMNodeExecutor());
	registry.set('classifier', new ClassifierNodeExecutor());

	// Agent 执行器
	registry.set('agent', new AgentNodeExecutor(agentCall));

	// 知识库检索执行器
	registry.set('knowledge', new KnowledgeNodeExecutor(knowledgeRetrieval));

	return registry;
}
