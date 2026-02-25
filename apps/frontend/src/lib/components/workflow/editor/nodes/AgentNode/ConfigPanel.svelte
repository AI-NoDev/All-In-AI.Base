<script lang="ts">
	import type { AgentNodeData, AgentInfo } from './types';
	import { BUILTIN_OUTPUT_VARIABLES } from './types';
	import { workflowState } from '$lib/components/workflow/editor/contexts/index';
	import { AgentSelector } from '../../components/selectors/index';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Icon from '@iconify/svelte';
	import RunStatusBadge from '../../components/RunStatusBadge.svelte';

	interface Props {
		nodeId: string;
		data: AgentNodeData;
	}

	let { nodeId }: Props = $props();

	let activeTab = $state('settings');
	let inputSchemaExpanded = $state(false);
	let outputSchemaExpanded = $state(false);

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
	let maxIterations = $derived(currentData?.maxIterations ?? 10);
	let lastRun = $derived(currentData?.lastRun);

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

				<!-- 最大迭代次数 -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-1">
							<span class="text-xs font-medium">最大迭代次数</span>
							<Tooltip.Root>
								<Tooltip.Trigger>
									{#snippet child({ props })}
										<button {...props} class="text-muted-foreground hover:text-foreground">
											<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
										</button>
									{/snippet}
								</Tooltip.Trigger>
								<Tooltip.Content>Agent 执行的最大循环次数</Tooltip.Content>
							</Tooltip.Root>
						</div>
						<span class="text-xs text-muted-foreground">{maxIterations}</span>
					</div>
					<div class="flex items-center gap-3">
						<div class="flex-1">
							<Slider 
								type="single"
								value={maxIterations}
								min={1}
								max={50}
								step={1}
								onValueChange={(v: number) => updateField('maxIterations', v)}
							/>
						</div>
						<Input 
							type="number"
							value={maxIterations}
							oninput={(e) => updateField('maxIterations', parseInt((e.target as HTMLInputElement).value) || 10)}
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
							<div class="p-2 bg-muted/30 rounded max-h-64 overflow-auto">
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
