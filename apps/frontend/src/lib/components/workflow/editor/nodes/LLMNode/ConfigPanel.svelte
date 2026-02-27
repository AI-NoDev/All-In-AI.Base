<script lang="ts">
	import type { LLMNodeData, ExceptionHandling as ExceptionHandlingType, ModelConfig, PromptMessage, NodeOutputVariable } from './types';
	import { LLM_DEFAULT_OUTPUTS, LLM_ERROR_OUTPUTS } from './types';
	import { createRootSchema, type RootSchema, type Field } from './schema-types';
	import { workflowState } from '$lib/components/workflow/editor/contexts/index';
	import type { VariableType } from '$lib/components/workflow/types/workflow';
	import { SYSTEM_VARIABLES, DEFAULT_ENV_VARIABLES, type Variable } from '../../components/VariableSelector/index';
	import { type InputField, type StartNodeData } from '../../nodes/StartNode/types';
	import { START_NODE_ID } from '$lib/components/workflow/editor/contexts/index';
	import type { NodeRunData } from '$lib/components/workflow/types/index';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import NodeRunResult from '../../components/NodeRunResult.svelte';

	// Sub-components
	import {
		ModelSelect,
		ContextVariables,
		ToggleSettings,
		OutputVariables,
		RetrySettings,
		ExceptionHandling,
		SchemaEditorDialog,
		PromptMessages,
	} from './components/index';

	interface Props {
		nodeId: string;
		data: LLMNodeData;
	}

	let { nodeId }: Props = $props();

	let activeTab = $state('settings');
	let schemaEditorOpen = $state(false);

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as LLMNodeData | undefined;
	});

	// 派生数据
	let modelConfig = $derived(currentData?.modelConfig);
	let context = $derived(currentData?.context ?? []);
	let visionEnabled = $derived(currentData?.visionEnabled ?? false);
	let reasoningTagsEnabled = $derived(currentData?.reasoningTagsEnabled ?? false);
	let structuredOutput = $derived(currentData?.structuredOutput ?? false);
	let outputSchema = $derived(currentData?.outputSchema ?? createRootSchema());
	let retryOnFailure = $derived(currentData?.retryOnFailure ?? false);
	let retryCount = $derived(currentData?.retryCount ?? 3);
	let retryInterval = $derived(currentData?.retryInterval ?? 1000);
	let exceptionHandling = $derived(currentData?.exceptionHandling ?? 'none');
	let defaultValue = $derived(currentData?.defaultValue ?? '');
	let runData = $derived<NodeRunData | undefined>(currentData?._run as NodeRunData | undefined);
	
	// 模型是否支持视觉（图片/视频输入）
	let supportsVision = $derived(modelConfig?.supportImageInput || modelConfig?.supportVideoInput || false);
	
	// 提示词消息（兼容旧数据）
	let promptMessages = $derived.by((): PromptMessage[] => {
		if (currentData?.promptMessages && currentData.promptMessages.length > 0) {
			return currentData.promptMessages;
		}
		// 兼容旧数据：从 systemPrompt 和 userPromptTemplate 迁移
		const messages: PromptMessage[] = [];
		if (currentData?.systemPrompt || currentData?.userPromptTemplate) {
			messages.push({
				id: crypto.randomUUID(),
				role: 'system',
				content: currentData?.systemPrompt ?? ''
			});
			if (currentData?.userPromptTemplate) {
				messages.push({
					id: crypto.randomUUID(),
					role: 'user',
					content: currentData.userPromptTemplate
				});
			}
		} else {
			// 默认添加一个空的 system 消息
			messages.push({
				id: crypto.randomUUID(),
				role: 'system',
				content: ''
			});
		}
		return messages;
	});

	// 上下文变量路径列表
	let contextPaths = $derived(context.map(c => c.path));

	// 获取所有可用变量
	let allVariables = $derived.by((): Variable[] => {
		const startNode = workflowState.getNode(START_NODE_ID);
		const userInputVariables: Variable[] = [];
		
		if (startNode) {
			const data = startNode.data as StartNodeData;
			const inputs = data.inputs ?? [];
			inputs
				.filter((field: InputField) => !field.hidden)
				.forEach((field: InputField) => {
					userInputVariables.push({
						path: `start.${field.variable}`,
						label: field.label,
						type: field.type,
						description: field.description ?? field.placeholder,
					});
				});
		}
		
		return [...userInputVariables, ...DEFAULT_ENV_VARIABLES, ...SYSTEM_VARIABLES];
	});

	function updateField<K extends keyof LLMNodeData>(field: K, value: LLMNodeData[K]) {
		// 如果异常处理从 fail_branch 改为其他值，删除已连接的 exception edge
		if (field === 'exceptionHandling' && value !== 'fail_branch') {
			const exceptionEdges = workflowState.edges.filter(
				e => e.source === nodeId && e.sourceHandle === 'exception'
			);
			if (exceptionEdges.length > 0) {
				workflowState.edges = workflowState.edges.filter(
					e => !(e.source === nodeId && e.sourceHandle === 'exception')
				);
			}
		}
		workflowState.updateNode(nodeId, { [field]: value });
	}

	function handleModelChange(config: ModelConfig | undefined) {
		updateField('modelConfig', config);
	}

	function getVariableByPath(path: string): Variable | undefined {
		return allVariables.find(v => v.path === path);
	}

	function handleContextChange(paths: string[]) {
		const newContext = paths.map(path => {
			const existing = context.find(c => c.path === path);
			if (existing) return existing;
			const variable = getVariableByPath(path);
			return { path, displayName: variable?.label ?? path };
		});
		updateField('context', newContext);
	}

	function removeContextVariable(path: string) {
		const newContext = context.filter(c => c.path !== path);
		updateField('context', newContext);
	}

	function handleSchemaChange(schema: RootSchema) {
		updateField('outputSchema', schema);
	}

	function handlePromptMessagesChange(messages: PromptMessage[]) {
		updateField('promptMessages', messages);
		// 清除旧字段
		if (currentData?.systemPrompt !== undefined) {
			workflowState.updateNode(nodeId, { systemPrompt: undefined });
		}
		if (currentData?.userPromptTemplate !== undefined) {
			workflowState.updateNode(nodeId, { userPromptTemplate: undefined });
		}
	}

	// 将 schema field type 转换为 VariableType
	function schemaTypeToVariableType(type: string): VariableType {
		switch (type) {
			case 'string': return 'string';
			case 'number': return 'number';
			case 'boolean': return 'boolean';
			case 'object': return 'object';
			case 'array': return 'array-object';
			default: return 'string';
		}
	}

	// 从 outputSchema 生成结构化输出变量
	function getStructuredOutputVariables(schema: RootSchema): NodeOutputVariable[] {
		if (!schema.fields || schema.fields.length === 0) return [];
		
		return schema.fields.map((field: Field) => ({
			path: `structured_output.${field.name}`,
			label: field.name,
			type: schemaTypeToVariableType(field.type),
			description: field.description || `结构化输出字段: ${field.name}`,
		}));
	}

	// 计算当前应该有的输出变量
	let computedOutputs = $derived.by((): NodeOutputVariable[] => {
		const outputs = [...LLM_DEFAULT_OUTPUTS];
		
		// 如果启用了结构化输出，添加结构化输出变量
		if (structuredOutput && outputSchema.fields.length > 0) {
			outputs.push(...getStructuredOutputVariables(outputSchema));
		}
		
		return outputs;
	});

	// 当输出变量变化时，更新节点数据
	$effect(() => {
		const currentOutputs = currentData?.outputs;
		const newOutputs = computedOutputs;
		
		// 比较是否需要更新
		const currentPaths = currentOutputs?.map(o => o.path).sort().join(',') ?? '';
		const newPaths = newOutputs.map(o => o.path).sort().join(',');
		
		if (currentPaths !== newPaths) {
			workflowState.updateNode(nodeId, { outputs: newOutputs });
		}
	});

	// 当异常处理方式变化时，更新错误输出变量
	$effect(() => {
		const currentErrorOutputs = currentData?.errorOutputs;
		const shouldHaveErrorOutputs = exceptionHandling === 'fail_branch';
		
		if (shouldHaveErrorOutputs && (!currentErrorOutputs || currentErrorOutputs.length === 0)) {
			workflowState.updateNode(nodeId, { errorOutputs: LLM_ERROR_OUTPUTS });
		} else if (!shouldHaveErrorOutputs && currentErrorOutputs && currentErrorOutputs.length > 0) {
			workflowState.updateNode(nodeId, { errorOutputs: [] });
		}
	});
</script>

<Tooltip.Provider>
	<Tabs.Root bind:value={activeTab} class="w-full">
		<Tabs.List class="w-full grid grid-cols-2 mb-4">
			<Tabs.Trigger value="settings">设置</Tabs.Trigger>
			<Tabs.Trigger value="lastRun">
				上次运行
				{#if runData && runData.status !== 'idle'}
					<span class="ml-1.5 w-2 h-2 rounded-full {runData.status === 'success' ? 'bg-green-500' : runData.status === 'error' ? 'bg-destructive' : 'bg-blue-500'}"></span>
				{/if}
			</Tabs.Trigger>
		</Tabs.List>

		<!-- 设置 Tab -->
		<Tabs.Content value="settings" class="mt-0">
			<div class="space-y-4">
				<!-- 模型选择 -->
				<ModelSelect 
					{modelConfig}
					onModelChange={handleModelChange}
				/>

				<!-- 上下文 -->
				<ContextVariables 
					{context}
					{contextPaths}
					{allVariables}
					onContextChange={handleContextChange}
					onRemoveVariable={removeContextVariable}
				/>

				<!-- 提示词消息 -->
				<PromptMessages 
					messages={promptMessages}
					onMessagesChange={handlePromptMessagesChange}
					{nodeId}
				/>

				<!-- 视觉 & 推理标签 -->
				<ToggleSettings 
					{visionEnabled}
					{reasoningTagsEnabled}
					{supportsVision}
					onVisionChange={(v) => updateField('visionEnabled', v)}
					onReasoningTagsChange={(v) => updateField('reasoningTagsEnabled', v)}
				/>

				<!-- 输出变量 -->
				<OutputVariables 
					{structuredOutput}
					{outputSchema}
					onStructuredOutputChange={(v) => updateField('structuredOutput', v)}
					onOpenSchemaEditor={() => schemaEditorOpen = true}
				/>

				<!-- 失败时重试 -->
				<RetrySettings 
					{retryOnFailure}
					{retryCount}
					{retryInterval}
					onRetryOnFailureChange={(v) => updateField('retryOnFailure', v)}
					onRetryCountChange={(v) => updateField('retryCount', v)}
					onRetryIntervalChange={(v) => updateField('retryInterval', v)}
				/>

				<!-- 异常处理 -->
				<ExceptionHandling 
					{exceptionHandling}
					{defaultValue}
					onExceptionHandlingChange={(v) => updateField('exceptionHandling', v as ExceptionHandlingType)}
					onDefaultValueChange={(v) => updateField('defaultValue', v)}
				/>

				<!-- 下一步提示 -->
				<div class="pt-3 border-t border-border">
					<p class="text-xs text-muted-foreground">
						LLM 节点用于调用大语言模型处理文本，支持上下文引用和结构化输出。
					</p>
				</div>
			</div>
		</Tabs.Content>

		<!-- 上次运行 Tab -->
		<Tabs.Content value="lastRun" class="mt-0">
			<NodeRunResult runData={runData} />
		</Tabs.Content>
	</Tabs.Root>
</Tooltip.Provider>

<!-- 结构化输出 Schema 编辑器 Dialog -->
<SchemaEditorDialog 
	bind:open={schemaEditorOpen}
	schema={outputSchema}
	onOpenChange={(v) => schemaEditorOpen = v}
	onSchemaChange={handleSchemaChange}
/>
