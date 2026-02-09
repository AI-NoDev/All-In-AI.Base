<script lang="ts">
	import type { LLMNodeData, ExceptionHandling as ExceptionHandlingType } from './types.js';
	import { MOCK_MODELS } from './types.js';
	import { createRootSchema, type RootSchema } from './schema-types.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { SYSTEM_VARIABLES, DEFAULT_ENV_VARIABLES, type Variable } from '../../components/VariableSelector/index.js';
	import { FIELD_TYPE_DATA_TYPES, type InputField, type StartNodeData } from '../../nodes/StartNode/types.js';
	import { START_NODE_ID } from '$lib/components/editor/contexts/index.js';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import RunStatusBadge from '../../components/RunStatusBadge.svelte';

	// Sub-components
	import {
		ModelSelect,
		ContextVariables,
		ToggleSettings,
		OutputVariables,
		RetrySettings,
		ExceptionHandling,
		LastRunTab,
		SchemaEditorDialog,
	} from './components/index.js';

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
	let lastRun = $derived(currentData?.lastRun);

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
						type: FIELD_TYPE_DATA_TYPES[field.type] as Variable['type'],
						description: field.placeholder,
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

	function handleModelChange(value: string) {
		const [provider, model] = value.split(':');
		const found = MOCK_MODELS.find(m => m.provider === provider && m.model === model);
		if (found) {
			updateField('modelConfig', found);
		}
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
</script>

<Tooltip.Provider>
	<Tabs.Root bind:value={activeTab} class="w-full">
		<Tabs.List class="w-full grid grid-cols-2 mb-4">
			<Tabs.Trigger value="settings">设置</Tabs.Trigger>
			<Tabs.Trigger value="lastRun">
				上次运行
				{#if lastRun && lastRun.status !== 'idle'}
					<span class="ml-1.5">
						<RunStatusBadge status={lastRun.status} size="sm" />
					</span>
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

				<!-- 视觉 & 推理标签 -->
				<ToggleSettings 
					{visionEnabled}
					{reasoningTagsEnabled}
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
			<LastRunTab {lastRun} />
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
