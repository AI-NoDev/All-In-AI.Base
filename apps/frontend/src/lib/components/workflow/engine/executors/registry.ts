/**
 * 节点执行器注册表
 */
import type { NodeExecutorRegistry } from '../types';
import { StartNodeExecutor } from './start-executor';
import { LLMNodeExecutor, type LLMCallFunction } from './llm-executor';
import { IfNodeExecutor } from './if-executor';
import { OutputNodeExecutor } from './output-executor';
import { LoopNodeExecutor } from './loop-executor';
import { LoopBreakNodeExecutor } from './loop-break-executor';
import { AgentNodeExecutor, type AgentCallFunction } from './agent-executor';
import { KnowledgeNodeExecutor, type KnowledgeRetrievalFunction } from './knowledge-executor';
import { ClassifierNodeExecutor } from './classifier-executor';

/** 执行器配置选项 */
export interface ExecutorOptions {
	/** LLM 调用函数 */
	llmCall?: LLMCallFunction;
	/** Agent 调用函数 */
	agentCall?: AgentCallFunction;
	/** 知识库检索函数 */
	knowledgeRetrieval?: KnowledgeRetrievalFunction;
}

/**
 * 创建默认执行器注册表
 * @param options 执行器配置选项
 */
export function createDefaultExecutors(options: ExecutorOptions = {}): NodeExecutorRegistry {
	const { llmCall, agentCall, knowledgeRetrieval } = options;
	const registry: NodeExecutorRegistry = new Map();

	// 注册内置执行器（不需要外部依赖）
	registry.set('start', new StartNodeExecutor());
	registry.set('if', new IfNodeExecutor());
	registry.set('output', new OutputNodeExecutor());
	registry.set('loop', new LoopNodeExecutor());
	registry.set('loop-break', new LoopBreakNodeExecutor());

	// LLM 相关执行器
	if (llmCall) {
		registry.set('llm', new LLMNodeExecutor(llmCall));
		registry.set('classifier', new ClassifierNodeExecutor(llmCall));
	}

	// Agent 执行器
	registry.set('agent', new AgentNodeExecutor(agentCall));

	// 知识库检索执行器
	registry.set('knowledge', new KnowledgeNodeExecutor(knowledgeRetrieval));

	return registry;
}
