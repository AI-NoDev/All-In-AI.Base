/**
 * 知识检索节点执行器
 * 
 * 从知识库中检索相关内容
 */
import type { WorkflowNode, BaseNodeData } from '$lib/components/workflow/types/index';
import type { NodeExecutor, ExecutionContext } from '../types';
import { VariableResolver } from '../variable-resolver';

/** 知识库引用 */
interface KnowledgeBaseRef {
	id: string;
	name: string;
	topK?: number;
	scoreThreshold?: number;
}

/** 元数据过滤条件 */
interface MetadataFilter {
	field: string;
	operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'in';
	value: string | number | boolean | string[];
}

/** 检索结果项 */
interface RetrievalResult {
	content: string;
	title?: string;
	url?: string;
	icon?: string;
	score?: number;
	metadata?: Record<string, unknown>;
}

/** 知识库检索函数类型 */
export type KnowledgeRetrievalFunction = (params: {
	knowledgeBaseIds: string[];
	query: string;
	topK: number;
	scoreThreshold?: number;
	metadataFilters?: MetadataFilter[];
}) => Promise<{
	results: RetrievalResult[];
	files?: Array<{ id: string; name: string; url: string }>;
}>;

export class KnowledgeNodeExecutor implements NodeExecutor {
	private retrievalFn?: KnowledgeRetrievalFunction;

	constructor(retrievalFn?: KnowledgeRetrievalFunction) {
		this.retrievalFn = retrievalFn;
	}

	async execute(
		node: WorkflowNode<BaseNodeData>,
		inputs: Record<string, unknown>,
		context: ExecutionContext
	): Promise<Record<string, unknown>> {
		const data = node.data as Record<string, unknown>;
		const queryVariable = data.queryVariable as string | undefined;
		const knowledgeBases = data.knowledgeBases as KnowledgeBaseRef[] | undefined;
		const topK = (data.topK as number) ?? 5;
		const scoreThreshold = data.scoreThreshold as number | undefined;
		const metadataFilterMode = data.metadataFilterMode as string | undefined;
		const metadataFilters = data.metadataFilters as MetadataFilter[] | undefined;

		// 获取查询文本
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

		// 如果没有提供检索函数，返回模拟数据
		if (!this.retrievalFn) {
			return this.getMockResults(query, knowledgeBases, topK);
		}

		// 调用检索函数
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

	/** 返回模拟检索结果（用于测试） */
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
				metadata: {
					source: knowledgeBases[0]?.name,
					page: i + 1,
				},
			});
		}

		return {
			result: mockResults,
			files: [],
			count: mockResults.length,
		};
	}
}
