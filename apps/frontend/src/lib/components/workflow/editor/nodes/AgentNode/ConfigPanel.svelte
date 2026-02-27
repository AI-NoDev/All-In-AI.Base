<script lang="ts">
	import { onMount } from 'svelte';
	import type { AgentNodeData, AgentInfo, ToolCallStep } from './types';
	import { BUILTIN_OUTPUT_VARIABLES } from './types';
	import { workflowState, START_NODE_ID } from '$lib/components/workflow/editor/contexts/index';
	import type { NodeRunData } from '$lib/components/workflow/types/index';
	import type { InputField, StartNodeData } from '../StartNode/types';
	import { AgentSelector, McpMultiSelector } from '../../components/selectors/index';
	import { VariableTagEditor } from '../../components/VariableTagEditor';
	import { SYSTEM_VARIABLES, DEFAULT_ENV_VARIABLES } from '../../components/VariableSelector/index';
	import { AIGeneratorModal } from '$lib/components/ai-generator';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Icon from '@iconify/svelte';
	import RunStatusBadge from '../../components/RunStatusBadge.svelte';
	import { authStore } from '$lib/stores/auth.svelte';

	interface McpServer {
		id: string;
		name: string;
		description?: string | null;
	}

	interface Props {
		nodeId: string;
		data: AgentNodeData;
	}

	let { nodeId }: Props = $props();

	let activeTab = $state('settings');
	let inputSchemaExpanded = $state(false);
	let outputSchemaExpanded = $state(false);
	let aiGeneratorOpen = $state(false);
	let allMcpServers = $state<McpServer[]>([]);
	let expandedToolCalls = $state<Record<string, boolean>>({});

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as AgentNodeData | undefined;
	});

	// 派生数据
	let agentId = $derived(currentData?.agentId ?? '');
	let agentName = $derived(currentData?.agentName ?? '');
	let agentColor = $derived(currentData?.agentColor);
	let agentInputSchema = $derived(currentData?.agentInputSchema);
	let agentOutputSchema = $derived(currentData?.agentOutputSchema);
	let mcpServerIds = $derived(currentData?.mcpServerIds ?? []);
	let instructionPrompt = $derived(currentData?.instructionPrompt ?? '');
	let maxSteps = $derived(currentData?.maxSteps ?? 10);
	
	// 使用 _run 数据（由 workflow engine 更新）
	let runData = $derived<NodeRunData | undefined>(currentData?._run as NodeRunData | undefined);

	// 获取工具调用列表
	let toolCalls = $derived<ToolCallStep[]>((runData?.outputs?.toolCalls as ToolCallStep[]) ?? []);

	// AI Payload 数据（用于上次运行显示）
	// 只使用已解析的提示词，不回退到原始配置
	let resolvedInstructionPrompt = $derived<string | undefined>(
		(runData?.inputs as Record<string, unknown> | undefined)?._resolvedInstructionPrompt as string | undefined
	);

	// 获取选中的 MCP 服务器信息
	let selectedMcpServers = $derived(
		allMcpServers.filter(s => mcpServerIds.includes(s.id))
	);

	// 获取所有可用变量（用于 AI 生成提示词）
	let availableVariables = $derived.by(() => {
		const variables: string[] = [];
		
		// 从开始节点获取用户输入变量
		const startNode = workflowState.getNode(START_NODE_ID);
		if (startNode) {
			const data = startNode.data as StartNodeData;
			const inputs = data.inputs ?? [];
			inputs
				.filter((field: InputField) => !field.hidden)
				.forEach((field: InputField) => {
					variables.push(`{{#start.${field.variable}#}} - ${field.label}`);
				});
		}
		
		// 添加环境变量
		DEFAULT_ENV_VARIABLES.forEach(v => {
			variables.push(`{{#${v.path}#}} - ${v.label}`);
		});
		
		// 添加系统变量
		SYSTEM_VARIABLES.forEach(v => {
			variables.push(`{{#${v.path}#}} - ${v.label}`);
		});
		
		return variables;
	});

	// AI 生成器的默认指令
	let aiGeneratorPrompt = $derived.by(() => {
		let prompt = `生成一份 Agent 指令提示词，用于指导 AI Agent 完成任务。

## 当前 Agent 节点配置`;

		// 添加 Agent 信息
		if (agentName) {
			prompt += `\n\n### 选择的 Agent
- 名称：${agentName}`;
			if (agentInputSchema) {
				const inputProps = getSchemaProperties(agentInputSchema);
				if (inputProps.length > 0) {
					prompt += `\n- 输入参数：${inputProps.map(p => `${p.name}(${p.type})`).join(', ')}`;
				}
			}
			if (agentOutputSchema) {
				const outputProps = getSchemaProperties(agentOutputSchema);
				if (outputProps.length > 0) {
					prompt += `\n- 输出参数：${outputProps.map(p => `${p.name}(${p.type})`).join(', ')}`;
				}
			}
		} else {
			prompt += `\n\n### 选择的 Agent
- 未选择 Agent`;
		}

		// 添加 MCP 服务器信息
		if (selectedMcpServers.length > 0) {
			prompt += `\n\n### 可用的 MCP 服务器（工具）
${selectedMcpServers.map(s => `- ${s.name}${s.description ? `：${s.description}` : ''}`).join('\n')}`;
		}

		// 添加可用变量
		if (availableVariables.length > 0) {
			prompt += `\n\n### 可用的变量（可以在提示词中引用）
${availableVariables.join('\n')}`;
		}

		prompt += `\n\n## 要求
请根据以上配置生成指令提示词：
1. 明确任务目标
2. 提供必要的上下文信息
3. 指定输出格式要求
4. 可以使用上述变量来引用动态数据
5. 如果有 MCP 工具，说明如何使用这些工具`;

		return prompt;
	});

	function handleAIGeneratorApply(result: string) {
		updateField('instructionPrompt', result);
	}

	function updateField<K extends keyof AgentNodeData>(field: K, value: AgentNodeData[K]) {
		workflowState.updateNode(nodeId, { [field]: value });
	}

	// 选择 Agent
	function handleAgentChange(agent: AgentInfo | undefined) {
		if (!agent) {
			workflowState.updateNode(nodeId, {
				agentId: '',
				agentName: '',
				agentAvatar: undefined,
				agentColor: undefined,
				agentInputSchema: undefined,
				agentOutputSchema: undefined,
			});
			return;
		}

		workflowState.updateNode(nodeId, {
			agentId: agent.id,
			agentName: agent.name,
			agentAvatar: agent.avatar ?? undefined,
			agentColor: agent.color ?? undefined,
			agentInputSchema: agent.inputSchema ?? undefined,
			agentOutputSchema: agent.outputSchema ?? undefined,
		});
	}

	// 格式化时间
	function formatDuration(ms: number): string {
		if (ms < 1000) return `${ms}ms`;
		if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
		return `${(ms / 60000).toFixed(2)}min`;
	}

	function formatDateTime(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleString('zh-CN', {
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	}

	// 获取类型颜色
	function getTypeColor(type: string): string {
		switch (type) {
			case 'string': return 'text-emerald-600 dark:text-emerald-400';
			case 'number': return 'text-blue-600 dark:text-blue-400';
			case 'boolean': return 'text-amber-600 dark:text-amber-400';
			case 'object': return 'text-rose-600 dark:text-rose-400';
			case 'array': return 'text-purple-600 dark:text-purple-400';
			default: return 'text-muted-foreground';
		}
	}

	// 渲染 Schema 属性
	interface SchemaProperty {
		type?: string;
		description?: string;
	}

	interface JsonSchema {
		type?: string;
		properties?: Record<string, SchemaProperty>;
		required?: string[];
	}

	function getSchemaProperties(schema: Record<string, unknown> | undefined): Array<{ name: string; type: string; description: string; required: boolean }> {
		if (!schema) return [];
		const jsonSchema = schema as JsonSchema;
		const properties = jsonSchema.properties ?? {};
		const required = jsonSchema.required ?? [];
		
		return Object.entries(properties).map(([name, prop]) => ({
			name,
			type: prop.type ?? 'unknown',
			description: prop.description ?? '',
			required: required.includes(name),
		}));
	}

	// 加载 MCP 服务器列表
	async function loadMcpServers() {
		try {
			const api = authStore.createApi(true);
			const res = await api.ai.postApiAiMcpServerQuery({ 
				filter: { status: '0' }, 
				limit: 100, 
				offset: 0 
			});
			if (res.data?.data) {
				allMcpServers = res.data.data as McpServer[];
			}
		} catch (err) {
			console.error('Failed to load MCP servers:', err);
		}
	}

	// 获取工具调用状态图标和颜色
	function getToolCallStatusConfig(status: ToolCallStep['status']): { icon: string; color: string; bgColor: string } {
		switch (status) {
			case 'pending':
				return { icon: 'mdi:clock-outline', color: 'text-muted-foreground', bgColor: 'bg-muted/50' };
			case 'running':
				return { icon: 'mdi:loading', color: 'text-blue-500', bgColor: 'bg-blue-500/10' };
			case 'success':
				return { icon: 'mdi:check-circle', color: 'text-green-500', bgColor: 'bg-green-500/10' };
			case 'error':
				return { icon: 'mdi:alert-circle', color: 'text-destructive', bgColor: 'bg-destructive/10' };
			default:
				return { icon: 'mdi:help-circle', color: 'text-muted-foreground', bgColor: 'bg-muted/50' };
		}
	}

	// 切换工具调用展开状态
	function toggleToolCallExpanded(id: string) {
		expandedToolCalls = { ...expandedToolCalls, [id]: !expandedToolCalls[id] };
	}

	onMount(() => {
		loadMcpServers();
	});
</script>

<Tooltip.Provider>
	<Tabs.Root bind:value={activeTab} class="w-full">
		<Tabs.List class="w-full grid grid-cols-2 mb-4">
			<Tabs.Trigger value="settings">设置</Tabs.Trigger>
			<Tabs.Trigger value="lastRun">
				上次运行
				{#if runData && runData.status !== 'idle'}
					<span class="ml-1.5">
						<RunStatusBadge status={runData.status} size="sm" />
					</span>
				{/if}
			</Tabs.Trigger>
		</Tabs.List>

		<!-- 设置 Tab -->
		<Tabs.Content value="settings" class="mt-0">
			<div class="space-y-4">
				<!-- Agent 选择 -->
				<AgentSelector
					value={agentId || undefined}
					onValueChange={handleAgentChange}
					required
				/>

				<!-- Agent 描述 -->
				{#if agentName && currentData?.agentAvatar}
					<div class="p-2 bg-muted/30 rounded text-xs text-muted-foreground">
						{currentData.agentAvatar}
					</div>
				{/if}

				<!-- MCP 服务器选择 -->
				<McpMultiSelector
					value={mcpServerIds}
					onValueChange={(ids) => updateField('mcpServerIds', ids)}
				/>

				<!-- 指令提示词 -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-1">
							<span class="text-xs font-medium">指令提示词</span>
							<Tooltip.Root>
								<Tooltip.Trigger>
									{#snippet child({ props })}
										<button {...props} class="text-muted-foreground hover:text-foreground">
											<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
										</button>
									{/snippet}
								</Tooltip.Trigger>
								<Tooltip.Content>给 Agent 的额外指令，会追加到系统提示词后</Tooltip.Content>
							</Tooltip.Root>
						</div>
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<Button 
										{...props}
										variant="ghost" 
										size="sm" 
										class="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
										onclick={() => aiGeneratorOpen = true}
									>
										<Icon icon="mdi:sparkles" class="w-3.5 h-3.5" />
									</Button>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>AI 生成</Tooltip.Content>
						</Tooltip.Root>
					</div>
					<VariableTagEditor
						value={instructionPrompt}
						onValueChange={(v) => updateField('instructionPrompt', v)}
						placeholder="输入额外的指令提示词，输入 {'{'} 或 / 插入变量..."
						rows={3}
						maxHeight="120px"
						class="min-h-[80px]"
						currentNodeId={nodeId}
					/>
				</div>

				<!-- 最大步骤数 -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-1">
							<span class="text-xs font-medium">最大步骤数</span>
							<Tooltip.Root>
								<Tooltip.Trigger>
									{#snippet child({ props })}
										<button {...props} class="text-muted-foreground hover:text-foreground">
											<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
										</button>
									{/snippet}
								</Tooltip.Trigger>
								<Tooltip.Content>Agent 单次执行的最大工具调用步骤数</Tooltip.Content>
							</Tooltip.Root>
						</div>
						<span class="text-xs text-muted-foreground">{maxSteps}</span>
					</div>
					<div class="flex items-center gap-3">
						<div class="flex-1">
							<Slider 
								type="single"
								value={maxSteps}
								min={1}
								max={50}
								step={1}
								onValueChange={(v: number) => updateField('maxSteps', v)}
							/>
						</div>
						<Input 
							type="number"
							value={maxSteps}
							oninput={(e) => updateField('maxSteps', parseInt((e.target as HTMLInputElement).value) || 10)}
							class="h-7 w-14 text-xs text-center px-1"
						/>
					</div>
				</div>

				<!-- 输入参数 Schema -->
				{#if agentInputSchema}
					<div class="space-y-2">
						<button 
							class="flex items-center gap-1 text-xs font-medium w-full text-left"
							onclick={() => inputSchemaExpanded = !inputSchemaExpanded}
						>
							<Icon icon="mdi:chevron-{inputSchemaExpanded ? 'down' : 'right'}" class="w-4 h-4" />
							输入参数
							<span class="text-muted-foreground ml-1">({getSchemaProperties(agentInputSchema).length})</span>
						</button>
						{#if inputSchemaExpanded}
							<div class="space-y-2 pl-5">
								{#each getSchemaProperties(agentInputSchema) as prop (prop.name)}
									<div class="space-y-0.5">
										<div class="flex items-center gap-2">
											<span class="text-xs font-mono">{prop.name}</span>
											<span class="text-xs {getTypeColor(prop.type)}">{prop.type}</span>
											{#if prop.required}
												<span class="text-destructive text-xs">*</span>
											{/if}
										</div>
										{#if prop.description}
											<p class="text-xs text-muted-foreground">{prop.description}</p>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/if}

				<!-- 输出参数 Schema -->
				<div class="space-y-2">
					<button 
						class="flex items-center gap-1 text-xs font-medium w-full text-left"
						onclick={() => outputSchemaExpanded = !outputSchemaExpanded}
					>
						<Icon icon="mdi:chevron-{outputSchemaExpanded ? 'down' : 'right'}" class="w-4 h-4" />
						输出变量
					</button>
					{#if outputSchemaExpanded}
						<div class="space-y-3 pl-5">
							<!-- 内置输出变量 -->
							{#each BUILTIN_OUTPUT_VARIABLES as variable}
								<div class="space-y-0.5">
									<div class="flex items-center gap-2">
										<span class="text-xs font-medium font-mono">{variable.name}</span>
										<span class="text-xs {getTypeColor(variable.type)}">{variable.type}</span>
									</div>
									<p class="text-xs text-muted-foreground">{variable.description}</p>
								</div>
							{/each}

							<!-- Agent 定义的输出 Schema -->
							{#if agentOutputSchema}
								<div class="pt-2 border-t border-border/50">
									<p class="text-xs text-muted-foreground mb-2">structured_output 字段：</p>
									{#each getSchemaProperties(agentOutputSchema) as prop (prop.name)}
										<div class="space-y-0.5 ml-3">
											<div class="flex items-center gap-2">
												<span class="text-xs font-mono">{prop.name}</span>
												<span class="text-xs {getTypeColor(prop.type)}">{prop.type}</span>
											</div>
											{#if prop.description}
												<p class="text-xs text-muted-foreground">{prop.description}</p>
											{/if}
										</div>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
				</div>

				<!-- 下一步提示 -->
				<div class="pt-3 border-t border-border">
					<p class="text-xs text-muted-foreground">
						Agent 节点可以调用已配置的智能体来处理复杂任务，支持多轮对话和工具调用。
					</p>
				</div>
			</div>
		</Tabs.Content>

		<!-- 上次运行 Tab -->
		<Tabs.Content value="lastRun" class="mt-0">
			{#if !runData || runData.status === 'idle'}
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
							<RunStatusBadge status={runData.status} size="md" />
							{#if runData.startTime}
								<span class="text-xs text-muted-foreground">
									{formatDateTime(runData.startTime)}
								</span>
							{/if}
						</div>
					</div>

					<!-- 运行统计 -->
					{#if runData.elapsed !== undefined || runData.tokens !== undefined || toolCalls.length > 0}
						<div class="grid grid-cols-3 gap-2">
							{#if runData.elapsed !== undefined}
								<div class="p-2 border border-border rounded-lg">
									<div class="flex items-center gap-1.5 text-muted-foreground mb-0.5">
										<Icon icon="mdi:timer-outline" class="w-3.5 h-3.5" />
										<span class="text-[10px]">运行时间</span>
									</div>
									<span class="text-xs font-semibold">{formatDuration(runData.elapsed)}</span>
								</div>
							{/if}
							{#if runData.tokens !== undefined}
								<div class="p-2 border border-border rounded-lg">
									<div class="flex items-center gap-1.5 text-muted-foreground mb-0.5">
										<Icon icon="mdi:chip" class="w-3.5 h-3.5" />
										<span class="text-[10px]">Token</span>
									</div>
									<span class="text-xs font-semibold">{runData.tokens.total.toLocaleString()}</span>
								</div>
							{/if}
							{#if toolCalls.length > 0}
								<div class="p-2 border border-border rounded-lg">
									<div class="flex items-center gap-1.5 text-muted-foreground mb-0.5">
										<Icon icon="mdi:tools" class="w-3.5 h-3.5" />
										<span class="text-[10px]">工具调用</span>
									</div>
									<span class="text-xs font-semibold">{toolCalls.length} 次</span>
								</div>
							{/if}
						</div>
					{/if}

					<!-- 输入（AI Payload） -->
					<div class="space-y-2">
						<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<Icon icon="mdi:import" class="w-4 h-4" />
							输入（AI Payload）
						</div>
						<div class="space-y-2">
							<!-- Agent 信息 -->
							<div class="p-2 bg-muted/30 rounded space-y-1.5">
								<div class="flex items-center gap-2">
									<span class="text-[10px] text-muted-foreground w-16">Agent:</span>
									<span class="text-xs font-medium">{currentData?.agentName || '未选择'}</span>
								</div>
								{#if currentData?.mcpServerIds && currentData.mcpServerIds.length > 0}
									<div class="flex items-start gap-2">
										<span class="text-[10px] text-muted-foreground w-16">MCP:</span>
										<span class="text-xs">{selectedMcpServers.map(s => s.name).join(', ') || currentData.mcpServerIds.length + ' 个服务器'}</span>
									</div>
								{/if}
								<div class="flex items-center gap-2">
									<span class="text-[10px] text-muted-foreground w-16">最大步骤:</span>
									<span class="text-xs">{currentData?.maxSteps ?? 10}</span>
								</div>
							</div>
							<!-- 指令提示词（已解析变量） -->
							{#if resolvedInstructionPrompt}
								<div class="space-y-1">
									<span class="text-[10px] text-muted-foreground">指令提示词（已解析变量）:</span>
									<div class="p-2 bg-muted/30 rounded max-h-48 overflow-auto">
										<pre class="text-xs text-foreground whitespace-pre-wrap break-all">{resolvedInstructionPrompt}</pre>
									</div>
								</div>
							{:else if currentData?.instructionPrompt}
								<div class="space-y-1">
									<span class="text-[10px] text-muted-foreground">指令提示词（原始配置，变量未解析）:</span>
									<div class="p-2 bg-amber-500/10 border border-amber-500/20 rounded max-h-48 overflow-auto">
										<pre class="text-xs text-foreground whitespace-pre-wrap break-all">{currentData.instructionPrompt}</pre>
									</div>
									<p class="text-[10px] text-amber-600">提示：变量未解析可能是因为开始节点未定义对应的输入字段</p>
								</div>
							{/if}
						</div>
					</div>

					<!-- MCP 工具调用过程 -->
					{#if toolCalls.length > 0}
						<div class="space-y-2">
							<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
								<Icon icon="mdi:tools" class="w-4 h-4" />
								工具调用过程
							</div>
							<div class="space-y-2">
								{#each toolCalls as call, index (call.id)}
									{@const statusConfig = getToolCallStatusConfig(call.status)}
									{@const isExpanded = expandedToolCalls[call.id] ?? false}
									<div class="border border-border rounded-lg overflow-hidden">
										<!-- 工具调用头部 -->
										<button
											class="w-full flex items-center gap-2 px-3 py-2 {statusConfig.bgColor} hover:bg-muted/50 transition-colors"
											onclick={() => toggleToolCallExpanded(call.id)}
										>
											<span class="text-xs text-muted-foreground font-mono">#{index + 1}</span>
											<Icon 
												icon={statusConfig.icon} 
												class="w-4 h-4 {statusConfig.color} {call.status === 'running' ? 'animate-spin' : ''}" 
											/>
											<span class="text-xs font-medium flex-1 text-left truncate">{call.name}</span>
											{#if call.startTime && call.endTime}
												<span class="text-[10px] text-muted-foreground">
													{formatDuration(call.endTime - call.startTime)}
												</span>
											{/if}
											<Icon 
												icon="mdi:chevron-down" 
												class="w-4 h-4 text-muted-foreground transition-transform {isExpanded ? 'rotate-180' : ''}" 
											/>
										</button>
										
										<!-- 工具调用详情 -->
										{#if isExpanded}
											<div class="px-3 py-2 space-y-2 border-t border-border">
												<!-- 参数 -->
												{#if call.args && Object.keys(call.args).length > 0}
													<div class="space-y-1">
														<span class="text-[10px] text-muted-foreground font-medium">参数</span>
														<div class="p-2 bg-muted/30 rounded">
															<pre class="text-[10px] text-foreground whitespace-pre-wrap break-all">{JSON.stringify(call.args, null, 2)}</pre>
														</div>
													</div>
												{/if}
												
												<!-- 结果 -->
												{#if call.status === 'success' && call.result !== undefined}
													<div class="space-y-1">
														<span class="text-[10px] text-muted-foreground font-medium">结果</span>
														<div class="p-2 bg-green-500/5 border border-green-500/20 rounded max-h-32 overflow-auto">
															<pre class="text-[10px] text-foreground whitespace-pre-wrap break-all">{JSON.stringify(call.result, null, 2)}</pre>
														</div>
													</div>
												{/if}
												
												<!-- 错误 -->
												{#if call.status === 'error' && call.error}
													<div class="space-y-1">
														<span class="text-[10px] text-destructive font-medium">错误</span>
														<div class="p-2 bg-destructive/10 border border-destructive/20 rounded">
															<pre class="text-[10px] text-destructive whitespace-pre-wrap break-all">{call.error}</pre>
														</div>
													</div>
												{/if}
											</div>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- 输出结果 -->
					{#if runData.outputs && Object.keys(runData.outputs).length > 0}
						{@const outputsWithoutToolCalls = Object.fromEntries(
							Object.entries(runData.outputs).filter(([key]) => key !== 'toolCalls')
						)}
						{#if Object.keys(outputsWithoutToolCalls).length > 0}
							<div class="space-y-2">
								<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
									<Icon icon="mdi:export" class="w-4 h-4" />
									输出结果
								</div>
								<div class="p-2 bg-muted/30 rounded max-h-64 overflow-auto">
									<pre class="text-xs text-foreground whitespace-pre-wrap break-all">{JSON.stringify(outputsWithoutToolCalls, null, 2)}</pre>
								</div>
							</div>
						{/if}
					{/if}

					<!-- 错误信息 -->
					{#if runData.error}
						<div class="space-y-2">
							<div class="flex items-center gap-2 text-xs font-medium text-destructive">
								<Icon icon="mdi:alert-circle" class="w-4 h-4" />
								错误信息
							</div>
							<div class="p-2 bg-destructive/10 border border-destructive/20 rounded">
								<pre class="text-xs text-destructive whitespace-pre-wrap break-all">{runData.error}</pre>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</Tabs.Content>
	</Tabs.Root>
</Tooltip.Provider>

<!-- AI 提示词生成器 -->
<AIGeneratorModal 
	bind:open={aiGeneratorOpen}
	type="text"
	title="指令提示词生成器"
	description="使用 AI 来生成或优化 Agent 指令提示词"
	prompt={aiGeneratorPrompt}
	idealOutput={instructionPrompt}
	idealOutputPlaceholder="描述您理想的指令提示词效果..."
	onOpenChange={(v) => aiGeneratorOpen = v}
	onApply={handleAIGeneratorApply}
	mcpIds={currentData.mcpServerIds}
/>
