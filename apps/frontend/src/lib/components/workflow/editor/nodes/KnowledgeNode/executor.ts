/**
 * 知识检索节点执行器
 */
import type { WorkflowNode } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '$lib/components/workflow/engine/types';
import { VariableResolver } from '$lib/components/workflow/engine/variable-resolver';
import type { KnowledgeNodeData, KnowledgeBaseRef, MetadataFilter } from './types';

/** 检索结果项 */
export interface RetrievalResult {
	content: string;
	title?: string;
	url?: string;
	icon?: string;
	score?: number;
	metadata?: Record<string, unknown>;
}

/** 知识库检索参数 */
export interface KnowledgeRetrievalParams {
	knowledgeBaseIds: string[];
	query: string;
	topK: number;
	scoreThreshold?: number;
	metadataFilters?: MetadataFilter[];
}

/** 知识库检索结果 */
export interface KnowledgeRetrievalResult {
	results: RetrievalResult[];
	files?: Array<{ id: string; name: string; url: string }>;
}

/** 知识库检索函数类型 */
export type KnowledgeRetrievalFunction = (params: KnowledgeRetrievalParams) => Promise<KnowledgeRetrievalResult>;

export class KnowledgeNodeExecutor implements NodeExecutor {
	private retrievalFn?: KnowledgeRetrievalFunction;

	constructor(retrievalFn?: KnowledgeRetrievalFunction) {
		this.retrievalFn = retrievalFn;
	}

	async execute(
		node: WorkflowNode<KnowledgeNodeData>,
		_inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data;
		const queryVariable = data.queryVariable;
		const knowledgeBases = data.knowledgeBases;
		const topK = data.topK ?? 5;
		const scoreThreshold = data.scoreThreshold;
		const metadataFilterMode = data.metadataFilterMode;
		const metadataFilters = data.metadataFilters;

		const resolver = new VariableResolver(context);
		let query = '';
		if (queryVariable) {
			query = String(resolver.resolve(queryVariable) ?? '');
		}

		if (!query) {
			throw new Error('知识检索节点查询文本为空');
		}

		if (!knowledgeBases || knowledgeBases.length === 0) {
			throw new Error('知识检索节点未配置知识库');
		}

		if (!this.retrievalFn) {
			return this.getMockResults(query, knowledgeBases, topK);
		}

		const filters = metadataFilterMode === 'manual' ? metadataFilters : undefined;
		const result = await this.retrievalFn({
			knowledgeBaseIds: knowledgeBases.map(kb => kb.id),
			query,
			topK,
			scoreThreshold,
			metadataFilters: filters,
		});

		return {
			result: result.results,
			files: result.files ?? [],
			count: result.results.length,
		};
	}

	private getMockResults(
		query: string,
		knowledgeBases: KnowledgeBaseRef[],
		topK: number
	): Record<string, unknown> {
		const mockResults: RetrievalResult[] = [];
		const kbNames = knowledgeBases.map(kb => kb.name).join(', ');

		for (let i = 0; i < Math.min(topK, 3); i++) {
			mockResults.push({
				content: `[模拟结果 ${i + 1}] 这是从知识库 "${kbNames}" 中检索到的与 "${query}" 相关的内容片段。`,
				title: `相关文档 ${i + 1}`,
				score: 0.9 - i * 0.1,
				metadata: { source: knowledgeBases[0]?.name, page: i + 1 },
			});
		}

		return { result: mockResults, files: [], count: mockResults.length };
	}
}
