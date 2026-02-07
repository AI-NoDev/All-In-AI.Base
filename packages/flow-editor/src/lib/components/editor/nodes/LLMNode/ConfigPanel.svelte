<script lang="ts">
	import type { LLMNodeData, ExceptionHandling } from './types.js';
	import { MOCK_MODELS, EXCEPTION_HANDLING_OPTIONS, BUILTIN_OUTPUT_VARIABLES } from './types.js';
	import { createRootSchema, type RootSchema, type SchemaItem } from './schema-types.js';
	import { ZodVisualEditor, type EditorLabels } from '@qiyu-allinai/zod-visual-editor';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { VariableSelect, SYSTEM_VARIABLES, DEFAULT_ENV_VARIABLES, type Variable } from '../../components/VariableSelector/index.js';
	import { FIELD_TYPE_DATA_TYPES, type InputField, type StartNodeData } from '../../nodes/StartNode/types.js';
	import { START_NODE_ID } from '$lib/components/editor/contexts/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import { Slider } from '$lib/components/ui/slider';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Drawer from '$lib/components/ui/drawer';
	import Icon from '@iconify/svelte';
	import RunStatusBadge from '../../components/RunStatusBadge.svelte';

	interface Props {
		nodeId: string;
		data: LLMNodeData;
	}

	let { nodeId }: Props = $props();

	let activeTab = $state('settings');
	let schemaEditorOpen = $state(false);

	// ZodVisualEditor 中文标签
	const schemaEditorLabels: EditorLabels = {
		string: '字符串',
		number: '数字',
		boolean: '布尔',
		literal: '字面量',
		object: '对象',
		union: '联合',
		required: '必填',
		array: '数组',
		reference: '引用',
		description: '描述',
		descriptionPlaceholder: '字段描述（帮助 AI 理解）',
		literalValue: '字面量值',
		literalValuePlaceholder: '输入字面量值',
		selectReference: '选择引用',
		fieldName: '字段名',
		addField: '添加字段',
		showCode: '显示代码',
		hideCode: '隐藏代码',
		schemaEditor: 'Schema 编辑器',
		noFieldsTitle: '暂无字段定义',
		noFieldsDescription: '点击"添加字段"开始构建 Schema',
		objectEmptyHint: '无字段，点击 + 添加',
		unionEmptyHint: '无选项，点击 + 添加（至少2个）',
	};

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

	// 当前选中的模型显示
	let selectedModelDisplay = $derived.by(() => {
		if (!modelConfig) return null;
		const found = MOCK_MODELS.find(m => m.provider === modelConfig.provider && m.model === modelConfig.model);
		return found?.displayName ?? modelConfig.model;
	});

	// 结构化输出是否已配置
	let hasStructuredOutputConfig = $derived(outputSchema.fields.length > 0);

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

	// 上下文变量路径列表
	let contextPaths = $derived(context.map(c => c.path));

	// 获取所有可用变量（用于显示 tag 信息）
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

	// 根据路径获取变量信息
	function getVariableByPath(path: string): Variable | undefined {
		return allVariables.find(v => v.path === path);
	}

	// 获取类型颜色
	function getTypeColor(type: string): string {
		switch (type) {
			case 'String': return 'text-emerald-600 dark:text-emerald-400';
			case 'Number': return 'text-blue-600 dark:text-blue-400';
			case 'Boolean': return 'text-amber-600 dark:text-amber-400';
			case 'Object': return 'text-rose-600 dark:text-rose-400';
			case 'File': return 'text-purple-600 dark:text-purple-400';
			case 'Array<File>': return 'text-purple-600 dark:text-purple-400';
			default: return 'text-muted-foreground';
		}
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

	function openSchemaEditor() {
		schemaEditorOpen = true;
	}

	// 格式化时间
	function formatDuration(ms: number): string {
		if (ms < 1000) return `${ms}ms`;
		if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
		return `${(ms / 60000).toFixed(2)}min`;
	}

	function formatDateTime(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleString('zh-CN', {
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	}

	// 格式化 Schema 类型显示（包括 union 的 | 格式）
	function formatSchemaType(field: SchemaItem): string {
		if (field.type === 'union' && field.options && field.options.length > 0) {
			// union 显示为 type1 | type2 | ...
			const optionTypes = field.options.map((opt: SchemaItem) => {
				if (opt.type === 'literal' && opt.literalValue !== undefined) {
					return JSON.stringify(opt.literalValue);
				}
				return opt.type + (opt.isArray ? '[]' : '');
			});
			return optionTypes.join(' | ') + (field.isArray ? '[]' : '');
		}
		let typeStr = field.type;
		if (field.isArray) {
			typeStr += '[]';
		}
		return typeStr;
	}

	// 获取 Schema 类型颜色
	function getSchemaTypeColor(type: string): string {
		switch (type) {
			case 'string': return 'text-emerald-600 dark:text-emerald-400';
			case 'number': return 'text-blue-600 dark:text-blue-400';
			case 'boolean': return 'text-amber-600 dark:text-amber-400';
			case 'object': return 'text-rose-600 dark:text-rose-400';
			case 'union': return 'text-purple-600 dark:text-purple-400';
			case 'literal': return 'text-cyan-600 dark:text-cyan-400';
			default: return 'text-muted-foreground';
		}
	}
</script>

{#snippet schemaFieldItem(field: SchemaItem, depth: number)}
	<div class="flex flex-col" style="padding-left: {depth * 12}px">
		<div class="flex items-center gap-1.5">
			<span class="font-mono text-foreground">{field.name}</span>
			<span class="{getSchemaTypeColor(field.type)}">{formatSchemaType(field)}</span>
			{#if field.required}
				<span class="text-destructive">*</span>
			{/if}
			{#if field.description}
				<span class="text-muted-foreground truncate max-w-[120px]" title={field.description}>{field.description}</span>
			{/if}
		</div>
		<!-- object 子字段递归显示 -->
		{#if field.type === 'object' && field.fields && field.fields.length > 0}
			<div class="mt-1 space-y-1 border-l border-border/50 ml-1">
				{#each field.fields as child (child.id)}
					{@render schemaFieldItem(child, depth + 1)}
				{/each}
			</div>
		{/if}
	</div>
{/snippet}

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
				<div class="space-y-2">
					<div class="flex items-center gap-1">
						<span class="text-xs font-medium">模型</span>
						<span class="text-destructive text-xs">*</span>
					</div>
					<Select.Root 
						type="single"
						value={modelConfig ? `${modelConfig.provider}:${modelConfig.model}` : undefined}
						onValueChange={handleModelChange}
					>
						<Select.Trigger class="h-9 w-full">
							{#if modelConfig}
								<div class="flex items-center gap-2">
									<Icon icon="mdi:robot" class="w-4 h-4 text-muted-foreground" />
									<span>{selectedModelDisplay}</span>
								</div>
							{:else}
								<div class="flex items-center gap-2 text-muted-foreground">
									<Icon icon="mdi:alert" class="w-4 h-4 text-amber-500" />
									<span>选择模型</span>
								</div>
							{/if}
						</Select.Trigger>
						<Select.Content class="w-[var(--bits-floating-anchor-width)]">
							{#each MOCK_MODELS as model}
								<Select.Item value={`${model.provider}:${model.model}`} label={model.displayName ?? model.model}>
									<div class="flex items-center gap-2">
										<Icon icon="mdi:robot" class="w-4 h-4" />
										<span>{model.displayName ?? model.model}</span>
										<span class="text-xs text-muted-foreground ml-auto">{model.provider}</span>
									</div>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>

				<!-- 上下文 -->
				<div class="space-y-2">
					<div class="flex items-center gap-1">
						<span class="text-xs font-medium">上下文</span>
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<button {...props} class="text-muted-foreground hover:text-foreground">
										<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
									</button>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>引用其他节点的输出变量作为上下文</Tooltip.Content>
						</Tooltip.Root>
					</div>
					
					<!-- 已选变量 Tags -->
					{#if context.length > 0}
						<div class="flex flex-wrap gap-1.5">
							{#each context as ctx (ctx.path)}
								{@const variable = getVariableByPath(ctx.path)}
								<div class="inline-flex items-center gap-1.5 px-2 py-1 bg-muted/50 border border-border rounded-md text-xs group">
									<Icon icon="mdi:variable" class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
									<span class="font-mono">{ctx.path}</span>
									<span class="{getTypeColor(variable?.type ?? 'String')}">{variable?.type ?? 'Unknown'}</span>
									<button 
										class="ml-0.5 opacity-60 hover:opacity-100 hover:text-destructive transition-opacity"
										onclick={() => removeContextVariable(ctx.path)}
									>
										<Icon icon="mdi:close" class="w-3.5 h-3.5" />
									</button>
								</div>
							{/each}
						</div>
					{/if}

					<VariableSelect 
						multiple
						value={contextPaths}
						onValueChange={handleContextChange}
						placeholder="选择上下文变量"
					/>
				</div>

				<!-- 视觉 -->
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-1">
						<span class="text-xs font-medium">视觉</span>
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<button {...props} class="text-muted-foreground hover:text-foreground">
										<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
									</button>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>启用后可处理图像输入</Tooltip.Content>
						</Tooltip.Root>
					</div>
					<Switch 
						checked={visionEnabled}
						onCheckedChange={(v) => updateField('visionEnabled', v)}
					/>
				</div>

				<!-- 启用推理标签分离 -->
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-1">
						<span class="text-xs font-medium">启用推理标签分离</span>
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<button {...props} class="text-muted-foreground hover:text-foreground">
										<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
									</button>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>分离模型的思考过程和最终输出</Tooltip.Content>
						</Tooltip.Root>
					</div>
					<Switch 
						checked={reasoningTagsEnabled}
						onCheckedChange={(v) => updateField('reasoningTagsEnabled', v)}
					/>
				</div>

				<!-- 输出变量 -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-1">
							<span class="text-xs font-medium">输出变量</span>
							<span class="text-destructive text-xs">*</span>
						</div>
						<div class="flex items-center gap-1.5">
							{#if structuredOutput && !hasStructuredOutputConfig}
								<Icon icon="mdi:alert" class="w-3.5 h-3.5 text-amber-500" />
							{/if}
							<span class="text-xs text-muted-foreground">结构化输出</span>
							<Tooltip.Root>
								<Tooltip.Trigger>
									{#snippet child({ props })}
										<button {...props} class="text-muted-foreground hover:text-foreground">
											<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
										</button>
									{/snippet}
								</Tooltip.Trigger>
								<Tooltip.Content>启用后输出将按照 JSON Schema 格式化</Tooltip.Content>
							</Tooltip.Root>
							<Switch 
								checked={structuredOutput}
								onCheckedChange={(v) => updateField('structuredOutput', v)}
							/>
						</div>
					</div>

					<!-- 内置输出变量列表 -->
					<div class="space-y-2">
						{#each BUILTIN_OUTPUT_VARIABLES as variable}
							<div class="space-y-0.5">
								<div class="flex items-center gap-2">
									<span class="text-xs font-medium font-mono">{variable.name}</span>
									<span class="text-xs text-muted-foreground">{variable.type}</span>
								</div>
								<p class="text-xs text-muted-foreground">{variable.description}</p>
							</div>
						{/each}
					</div>

					<!-- 结构化输出配置 -->
					{#if structuredOutput}
						<div class="pt-2 border-t border-border">
							<div class="flex items-center justify-between mb-2">
								<div class="flex items-center gap-2">
									<span class="text-xs font-medium font-mono">structured_output</span>
									<span class="text-xs text-muted-foreground">object</span>
								</div>
								<Button 
									variant="outline" 
									size="sm" 
									class="h-7 text-xs"
									onclick={openSchemaEditor}
								>
									<Icon icon="mdi:pencil" class="w-3.5 h-3.5 mr-1" />
									配置
								</Button>
							</div>
							{#if hasStructuredOutputConfig}
								<div class="p-2 bg-muted/30 rounded text-xs space-y-1.5">
									{#each outputSchema.fields as field (field.id)}
										{@render schemaFieldItem(field, 0)}
									{/each}
								</div>
							{:else}
								<div class="text-xs text-muted-foreground text-center py-3 border border-dashed rounded">
									结构化输出尚未配置
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<!-- 失败时重试 -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-xs font-medium">失败时重试</span>
						<Switch 
							checked={retryOnFailure}
							onCheckedChange={(v) => updateField('retryOnFailure', v)}
						/>
					</div>

					{#if retryOnFailure}
						<!-- 最大重试次数 -->
						<div class="flex items-center gap-3">
							<span class="text-xs text-muted-foreground w-20 shrink-0">最大重试次数</span>
							<div class="flex-1">
								<Slider 
									type="single"
									value={retryCount}
									min={1}
									max={10}
									step={1}
									onValueChange={(v) => updateField('retryCount', v)}
								/>
							</div>
							<div class="flex items-center gap-1 w-16 shrink-0">
								<Input 
									type="number"
									value={retryCount}
									oninput={(e) => updateField('retryCount', parseInt((e.target as HTMLInputElement).value) || 3)}
									class="h-7 text-xs text-center px-1"
								/>
								<span class="text-xs text-muted-foreground">次</span>
							</div>
						</div>

						<!-- 重试间隔 -->
						<div class="flex items-center gap-3">
							<span class="text-xs text-muted-foreground w-20 shrink-0">重试间隔</span>
							<div class="flex-1">
								<Slider 
									type="single"
									value={retryInterval}
									min={100}
									max={10000}
									step={100}
									onValueChange={(v) => updateField('retryInterval', v)}
								/>
							</div>
							<div class="flex items-center gap-1 w-20 shrink-0">
								<Input 
									type="number"
									value={retryInterval}
									oninput={(e) => updateField('retryInterval', parseInt((e.target as HTMLInputElement).value) || 1000)}
									class="h-7 text-xs text-center px-1"
								/>
								<span class="text-xs text-muted-foreground">毫秒</span>
							</div>
						</div>
					{/if}
				</div>

				<!-- 异常处理 -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-1">
							<span class="text-xs font-medium">异常处理</span>
							<Tooltip.Root>
								<Tooltip.Trigger>
									{#snippet child({ props })}
										<button {...props} class="text-muted-foreground hover:text-foreground">
											<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
										</button>
									{/snippet}
								</Tooltip.Trigger>
								<Tooltip.Content>节点执行失败时的处理方式</Tooltip.Content>
							</Tooltip.Root>
						</div>
						<Select.Root 
							type="single"
							value={exceptionHandling}
							onValueChange={(v) => v && updateField('exceptionHandling', v as ExceptionHandling)}
						>
							<Select.Trigger class="h-8 w-24 text-xs">
								{EXCEPTION_HANDLING_OPTIONS.find(o => o.value === exceptionHandling)?.label ?? '无'}
							</Select.Trigger>
							<Select.Content class="w-72">
								{#each EXCEPTION_HANDLING_OPTIONS as option}
									<Select.Item value={option.value} label={option.label}>
										<div class="space-y-0.5">
											<div class="font-medium">{option.label}</div>
											<div class="text-xs text-muted-foreground">{option.description}</div>
										</div>
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					{#if exceptionHandling === 'default_value'}
						<Input 
							value={defaultValue}
							oninput={(e) => updateField('defaultValue', (e.target as HTMLInputElement).value)}
							placeholder="输入默认值"
							class="h-8 text-xs"
						/>
					{/if}
				</div>

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
			{#if !lastRun || lastRun.status === 'idle'}
				<div class="py-12 text-center">
					<Icon icon="mdi:play-circle-outline" class="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
					<p class="text-sm text-muted-foreground">暂无运行记录</p>
					<p class="text-xs text-muted-foreground mt-1">点击运行按钮开始执行</p>
				</div>
			{:else}
				<div class="space-y-4">
					<!-- 运行状态概览 -->
					<div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
						<div class="flex items-center gap-3">
							<RunStatusBadge status={lastRun.status} size="md" />
							{#if lastRun.startedAt}
								<span class="text-xs text-muted-foreground">
									{formatDateTime(lastRun.startedAt)}
								</span>
							{/if}
						</div>
					</div>

					<!-- 运行统计 -->
					{#if lastRun.duration !== undefined || lastRun.tokenUsage !== undefined}
						<div class="grid grid-cols-2 gap-3">
							{#if lastRun.duration !== undefined}
								<div class="p-3 border border-border rounded-lg">
									<div class="flex items-center gap-2 text-muted-foreground mb-1">
										<Icon icon="mdi:timer-outline" class="w-4 h-4" />
										<span class="text-xs">运行时间</span>
									</div>
									<span class="text-sm font-semibold">{formatDuration(lastRun.duration)}</span>
								</div>
							{/if}
							{#if lastRun.tokenUsage !== undefined}
								<div class="p-3 border border-border rounded-lg">
									<div class="flex items-center gap-2 text-muted-foreground mb-1">
										<Icon icon="mdi:chip" class="w-4 h-4" />
										<span class="text-xs">Token 消耗</span>
									</div>
									<span class="text-sm font-semibold">{lastRun.tokenUsage.total.toLocaleString()}</span>
								</div>
							{/if}
						</div>
					{/if}

					<!-- Token 详情 -->
					{#if lastRun.tokenUsage}
						<div class="space-y-2">
							<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
								<Icon icon="mdi:chart-bar" class="w-4 h-4" />
								Token 详情
							</div>
							<div class="grid grid-cols-3 gap-2 text-xs">
								<div class="p-2 bg-muted/30 rounded text-center">
									<div class="text-muted-foreground">Prompt</div>
									<div class="font-semibold">{lastRun.tokenUsage.prompt.toLocaleString()}</div>
								</div>
								<div class="p-2 bg-muted/30 rounded text-center">
									<div class="text-muted-foreground">Completion</div>
									<div class="font-semibold">{lastRun.tokenUsage.completion.toLocaleString()}</div>
								</div>
								<div class="p-2 bg-muted/30 rounded text-center">
									<div class="text-muted-foreground">Total</div>
									<div class="font-semibold">{lastRun.tokenUsage.total.toLocaleString()}</div>
								</div>
							</div>
						</div>
					{/if}

					<!-- 输入 -->
					{#if lastRun.inputs && Object.keys(lastRun.inputs).length > 0}
						<div class="space-y-2">
							<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
								<Icon icon="mdi:import" class="w-4 h-4" />
								输入
							</div>
							<div class="p-2 bg-muted/30 rounded">
								<pre class="text-xs text-foreground whitespace-pre-wrap break-all">{JSON.stringify(lastRun.inputs, null, 2)}</pre>
							</div>
						</div>
					{/if}

					<!-- 输出结果 -->
					{#if lastRun.outputs && Object.keys(lastRun.outputs).length > 0}
						<div class="space-y-2">
							<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
								<Icon icon="mdi:export" class="w-4 h-4" />
								输出结果
							</div>
							<div class="p-2 bg-muted/30 rounded">
								<pre class="text-xs text-foreground whitespace-pre-wrap break-all">{JSON.stringify(lastRun.outputs, null, 2)}</pre>
							</div>
						</div>
					{/if}

					<!-- 错误信息 -->
					{#if lastRun.error}
						<div class="space-y-2">
							<div class="flex items-center gap-2 text-xs font-medium text-destructive">
								<Icon icon="mdi:alert-circle" class="w-4 h-4" />
								错误信息
							</div>
							<div class="p-2 bg-destructive/10 border border-destructive/20 rounded">
								<pre class="text-xs text-destructive whitespace-pre-wrap break-all">{lastRun.error}</pre>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</Tabs.Content>
	</Tabs.Root>
</Tooltip.Provider>

<!-- 结构化输出 Schema 编辑器 Drawer -->
<Drawer.Root bind:open={schemaEditorOpen} direction="right">
	<Drawer.Content class="h-full !w-[1000px] !max-w-[90vw] flex flex-col">
		<Drawer.Header>
			<Drawer.Title>配置结构化输出</Drawer.Title>
			<Drawer.Description>
				定义 LLM 输出的 JSON Schema 结构
			</Drawer.Description>
		</Drawer.Header>
		<div class="flex-1 overflow-hidden px-4 pb-4">
			<ZodVisualEditor 
				schema={outputSchema}
				labels={schemaEditorLabels}
				onSchemaChange={handleSchemaChange}
				height="100%"
			/>
		</div>
		<Drawer.Footer>
			<Button variant="outline" onclick={() => schemaEditorOpen = false}>关闭</Button>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
