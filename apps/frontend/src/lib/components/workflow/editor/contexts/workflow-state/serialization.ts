import YAML from 'yaml';
import type { WorkflowNode, WorkflowEdge, Variable, BaseNodeData, EnvironmentVariable } from '$lib/components/workflow/types/index';
import type { WorkflowMetadata, InputVariable, TestInputData } from './types';
import { BUILTIN_INPUT_VARIABLES } from './types';
import { createStartNode } from './nodes';

interface SerializationDeps<T extends BaseNodeData> {
	getNodes: () => WorkflowNode<T>[];
	setNodes: (nodes: WorkflowNode<T>[]) => void;
	getEdges: () => WorkflowEdge[];
	setEdges: (edges: WorkflowEdge[]) => void;
	getVariables: () => Variable[];
	setVariables: (variables: Variable[]) => void;
	getInputVariables: () => InputVariable[];
	setInputVariables: (variables: InputVariable[]) => void;
	getEnvironmentVariables: () => EnvironmentVariable[];
	setEnvironmentVariables: (variables: EnvironmentVariable[]) => void;
	getMetadata: () => WorkflowMetadata;
	setMetadata: (metadata: WorkflowMetadata) => void;
	getTestInputs: () => TestInputData;
	setTestInputs: (testInputs: TestInputData) => void;
}

/** 序列化操作方法 */
export function createSerializationOperations<T extends BaseNodeData>(deps: SerializationDeps<T>) {
	const {
		getNodes, setNodes, getEdges, setEdges,
		getVariables, setVariables,
		getInputVariables, setInputVariables,
		getEnvironmentVariables, setEnvironmentVariables,
		getMetadata, setMetadata,
		getTestInputs, setTestInputs
	} = deps;

	return {
		/** 转换为 JSON */
		toJSON() {
			return { 
				metadata: getMetadata(), 
				nodes: getNodes(), 
				edges: getEdges(), 
				variables: getVariables(),
				inputVariables: getInputVariables(),
				environmentVariables: getEnvironmentVariables(),
				testInputs: getTestInputs()
			};
		},

		/** 从 JSON 加载 */
		fromJSON(json: { 
			metadata?: WorkflowMetadata; 
			nodes?: WorkflowNode<T>[]; 
			edges?: WorkflowEdge[]; 
			variables?: Variable[];
			inputVariables?: InputVariable[];
			environmentVariables?: EnvironmentVariable[];
			testInputs?: TestInputData;
		}) {
			if (json.metadata) setMetadata(json.metadata);
			if (json.nodes) setNodes(json.nodes);
			if (json.edges) setEdges(json.edges);
			if (json.variables) setVariables(json.variables);
			if (json.inputVariables) setInputVariables(json.inputVariables);
			if (json.environmentVariables) setEnvironmentVariables(json.environmentVariables);
			if (json.testInputs) setTestInputs(json.testInputs);
		},

		/** 转换为 YAML (兼容 Dify DSL 格式) */
		toYAML(viewport?: { x: number; y: number; zoom: number }) {
			const nodes = getNodes();
			const edges = getEdges();
			const environmentVariables = getEnvironmentVariables();
			const inputVariables = getInputVariables();
			const testInputs = getTestInputs();

			const getDefaultSourceHandle = (nodeId: string): string | undefined => {
				const node = nodes.find(n => n.id === nodeId);
				if (!node) return undefined;
				if (node.type === 'llm') return 'output';
				return undefined;
			};

			const data = {
				version: '1.0.0',
				workflow: {
					// 环境变量只导出 name 和 value_type，不导出 value（安全考虑）
					environment_variables: environmentVariables.map(v => ({
						id: v.id, name: v.name, value_type: v.value_type,
					})),
					input_variables: inputVariables.map(v => ({
						id: v.id, name: v.name, label: v.label, type: v.type,
						description: v.description, required: v.required,
					})),
					// 测试输入数据
					test_inputs: testInputs.values && Object.keys(testInputs.values).length > 0 ? testInputs : undefined,
					conversation_variables: [],
					graph: {
						edges: edges.map(e => {
							const sourceHandle = e.sourceHandle ?? getDefaultSourceHandle(e.source);
							return {
								id: e.id, source: e.source, target: e.target,
								...(sourceHandle && { sourceHandle }),
								...(e.targetHandle && { targetHandle: e.targetHandle }),
								type: e.type ?? 'custom', zIndex: 0,
								...(e.data && { data: e.data }),
							};
						}),
						nodes: nodes.map(n => ({
							id: n.id,
							type: n.type === 'note' ? 'custom-note' : 'custom',
							position: n.position, positionAbsolute: n.position,
							data: {
								...n.data, type: n.type,
								...(n.parentId && { isInLoop: true, loop_id: n.parentId }),
							},
							sourcePosition: 'right', targetPosition: 'left',
							...(n.width && { width: n.width }),
							...(n.height && { height: n.height }),
						})),
						viewport: viewport ?? { x: 0, y: 0, zoom: 1 },
					},
				},
			};
			return YAML.stringify(data, { indent: 2 });
		},

		/** 从 YAML 加载 */
		fromYAML(yamlStr: string) {
			try {
				const data = YAML.parse(yamlStr);
				const nodes = getNodes();
				
				setEdges([]);
				
				if (data.workflow) {
					const graph = data.workflow.graph ?? data.workflow;
					
					if (graph.nodes) {
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
						const newNodes = graph.nodes.map((n: YAMLNode) => {
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
						setNodes(newNodes);
					}
					
					if (graph.edges) {
						interface YAMLEdge {
							id: string;
							source: string;
							target: string;
							sourceHandle?: string;
							targetHandle?: string;
							type?: string;
							data?: Record<string, unknown>;
						}
						
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
							id: e.id, source: e.source, target: e.target,
							sourceHandle: getSourceHandle(e.source, e.sourceHandle),
							targetHandle: getTargetHandle(e.targetHandle),
							type: e.type, data: e.data,
						}));
						
						const loadEdges = () => {
							requestAnimationFrame(() => {
								requestAnimationFrame(() => {
									requestAnimationFrame(() => setEdges(parsedEdges));
								});
							});
						};
						setTimeout(loadEdges, 100);
					}
					
					if (data.workflow.environment_variables) {
						interface YAMLEnvVar {
							id: string;
							name: string;
							value?: string;
							value_type: 'string' | 'secret';
						}
						setEnvironmentVariables(data.workflow.environment_variables.map((v: YAMLEnvVar) => ({
							id: v.id, name: v.name, value: v.value ?? '', value_type: v.value_type ?? 'string',
						})));
					}

					if (data.workflow.input_variables) {
						interface YAMLInputVar {
							id: string;
							name: string;
							label: string;
							type: string;
							description?: string;
							required?: boolean;
						}
						// 过滤掉内置变量
						const builtinIds = new Set(BUILTIN_INPUT_VARIABLES.map(v => v.id));
						setInputVariables(data.workflow.input_variables
							.filter((v: YAMLInputVar) => !builtinIds.has(v.id))
							.map((v: YAMLInputVar) => ({
								id: v.id, name: v.name, label: v.label, type: v.type,
								description: v.description, required: v.required,
							}))
						);
					}

					// 恢复测试输入数据
					if (data.workflow.test_inputs) {
						setTestInputs(data.workflow.test_inputs);
					}
				}
				
				if (data.metadata) setMetadata(data.metadata);
				
				return true;
			} catch (e) {
				console.error('Failed to parse YAML:', e);
				return false;
			}
		},

		/** 导出为文件 */
		exportToFile(filename = 'workflow.yml', viewport?: { x: number; y: number; zoom: number }) {
			const yaml = this.toYAML(viewport);
			const blob = new Blob([yaml], { type: 'text/yaml' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			a.click();
			URL.revokeObjectURL(url);
		},

		/** 从文件导入 */
		async importFromFile(file: File): Promise<boolean> {
			try {
				const text = await file.text();
				return this.fromYAML(text);
			} catch (e) {
				console.error('Failed to import file:', e);
				return false;
			}
		},

		/** 清空（保留开始节点） */
		clear() {
			setNodes([createStartNode<T>()]);
			setEdges([]);
			setVariables([]);
			setInputVariables([]);
			setEnvironmentVariables([]);
			setTestInputs({ values: {} });
		}
	};
}
