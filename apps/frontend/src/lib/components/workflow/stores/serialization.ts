/**
 * 工作流序列化 - YAML/JSON 导入导出
 */
import YAML from 'yaml';
import type { WorkflowNode, WorkflowEdge, Variable, EnvironmentVariable, BaseNodeData } from '$lib/components/workflow/types/index';

interface WorkflowData<T extends BaseNodeData = BaseNodeData> {
	metadata: { name: string; description: string; version: string };
	nodes: WorkflowNode<T>[];
	edges: WorkflowEdge[];
	variables: Variable[];
	environmentVariables: EnvironmentVariable[];
}

interface YAMLNodeData extends Record<string, unknown> {
	type?: string;
	isInLoop?: boolean;
	loop_id?: string;
}

interface YAMLNode {
	id: string;
	type?: string;
	position: { x: number; y: number };
	data?: YAMLNodeData;
	width?: number;
	height?: number;
}

interface YAMLEdge {
	id: string;
	source: string;
	target: string;
	sourceHandle?: string;
	targetHandle?: string;
	type?: string;
	data?: Record<string, unknown>;
}

interface YAMLEnvVar {
	id: string;
	name: string;
	value: string;
	value_type: 'string' | 'secret';
}

/**
 * 导出为 YAML 格式
 */
export function toYAML<T extends BaseNodeData>(
	data: WorkflowData<T>,
	viewport?: { x: number; y: number; zoom: number }
): string {
	const getDefaultSourceHandle = (nodeId: string): string | undefined => {
		const node = data.nodes.find(n => n.id === nodeId);
		if (!node) return undefined;
		if (node.type === 'llm') return 'output';
		return undefined;
	};

	const yamlData = {
		version: '1.0.0',
		workflow: {
			environment_variables: data.environmentVariables.map(v => ({
				id: v.id,
				name: v.name,
				value: v.value,
				value_type: v.value_type,
			})),
			conversation_variables: [],
			graph: {
				edges: data.edges.map(e => {
					const sourceHandle = e.sourceHandle ?? getDefaultSourceHandle(e.source);
					return {
						id: e.id,
						source: e.source,
						target: e.target,
						...(sourceHandle && { sourceHandle }),
						...(e.targetHandle && { targetHandle: e.targetHandle }),
						type: e.type ?? 'custom',
						zIndex: 0,
						...(e.data && { data: e.data }),
					};
				}),
				nodes: data.nodes.map(n => ({
					id: n.id,
					type: n.type === 'note' ? 'custom-note' : 'custom',
					position: n.position,
					positionAbsolute: n.position,
					data: {
						...n.data,
						type: n.type,
						...(n.parentId && { isInLoop: true, loop_id: n.parentId }),
					},
					sourcePosition: 'right',
					targetPosition: 'left',
					...(n.width && { width: n.width }),
					...(n.height && { height: n.height }),
				})),
				viewport: viewport ?? { x: 0, y: 0, zoom: 1 },
			},
		},
	};
	return YAML.stringify(yamlData, { indent: 2 });
}

/**
 * 从 YAML 解析
 */
export function fromYAML<T extends BaseNodeData>(
	yamlStr: string,
	onEdgesReady: (edges: WorkflowEdge[]) => void
): { success: boolean; data?: Partial<WorkflowData<T>> } {
	try {
		const parsed = YAML.parse(yamlStr);
		const result: Partial<WorkflowData<T>> = {};

		if (parsed.workflow) {
			const graph = parsed.workflow.graph ?? parsed.workflow;

			if (graph.nodes) {
				result.nodes = graph.nodes.map((n: YAMLNode) => {
					const isInLoop = n.data?.isInLoop === true;
					const loopId = n.data?.loop_id;
					const cleanData = { ...n.data };
					delete cleanData.isInLoop;
					delete cleanData.loop_id;

					return {
						id: n.id,
						type: n.data?.type ?? n.type ?? 'custom',
						position: n.position,
						data: cleanData as T,
						...(n.width && { width: n.width }),
						...(n.height && { height: n.height }),
						...(isInLoop && loopId && { parentId: loopId, extent: 'parent' as const }),
					};
				});
			}

			if (graph.edges && result.nodes) {
				const nodes = result.nodes;
				const getSourceHandle = (sourceId: string, yamlSourceHandle?: string): string | undefined => {
					if (yamlSourceHandle && yamlSourceHandle !== 'source') return yamlSourceHandle;
					const sourceNode = nodes.find(n => n.id === sourceId);
					if (!sourceNode) return undefined;
					if (sourceNode.type === 'llm') return 'output';
					return undefined;
				};

				const getTargetHandle = (yamlTargetHandle?: string): string | undefined => {
					if (yamlTargetHandle === 'target') return undefined;
					return yamlTargetHandle;
				};

				const parsedEdges = graph.edges.map((e: YAMLEdge) => ({
					id: e.id,
					source: e.source,
					target: e.target,
					sourceHandle: getSourceHandle(e.source, e.sourceHandle),
					targetHandle: getTargetHandle(e.targetHandle),
					type: e.type,
					data: e.data,
				}));

				// 延迟加载 edges
				setTimeout(() => {
					requestAnimationFrame(() => {
						requestAnimationFrame(() => {
							requestAnimationFrame(() => {
								onEdgesReady(parsedEdges);
							});
						});
					});
				}, 100);
			}

			if (parsed.workflow.environment_variables) {
				result.environmentVariables = parsed.workflow.environment_variables.map((v: YAMLEnvVar) => ({
					id: v.id,
					name: v.name,
					value: v.value,
					value_type: v.value_type ?? 'string',
				}));
			}
		}

		if (parsed.metadata) {
			result.metadata = parsed.metadata;
		}

		return { success: true, data: result };
	} catch (e) {
		console.error('Failed to parse YAML:', e);
		return { success: false };
	}
}

/**
 * 导出为文件
 */
export function exportToFile(
	yaml: string,
	filename = 'workflow.yml'
): void {
	const blob = new Blob([yaml], { type: 'text/yaml' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

/**
 * 从文件导入
 */
export async function importFromFile(file: File): Promise<string> {
	return await file.text();
}
