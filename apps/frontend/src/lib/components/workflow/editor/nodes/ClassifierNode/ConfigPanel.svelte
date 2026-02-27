<script lang="ts">
	import type { ClassifierNodeData, ClassifierOption, ModelConfig } from './types';
	import { BUILTIN_OUTPUT_VARIABLES } from './types';
	import { workflowState } from '$lib/components/workflow/editor/contexts/index';
	import type { NodeRunData } from '$lib/components/workflow/types/index';
	import { VariableSelect } from '../../components/VariableSelector/index';
	import { VariableTagEditor } from '../../components/VariableTagEditor/index';
	import { ModelSelector } from '../../components/selectors/index';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import { Switch } from '$lib/components/ui/switch';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Icon from '@iconify/svelte';
	import RunStatusBadge from '../../components/RunStatusBadge.svelte';

	interface Props {
		nodeId: string;
		data: ClassifierNodeData;
	}

	let { nodeId }: Props = $props();

	let activeTab = $state('settings');
	let advancedOpen = $state(false);
	let outputOpen = $state(true);

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as ClassifierNodeData | undefined;
	});

	// 派生数据
	let modelConfig = $derived(currentData?.modelConfig);
	let inputVariable = $derived(currentData?.inputVariable ?? '');
	let visionEnabled = $derived(currentData?.visionEnabled ?? false);
	let options = $derived(currentData?.options ?? []);
	let instruction = $derived(currentData?.instruction ?? '');
	
	// 使用 _run 数据（由 workflow engine 更新）
	let runData = $derived<NodeRunData | undefined>(currentData?._run as NodeRunData | undefined);

	// 计算指令字符数
	let instructionLength = $derived(instruction.length);

	function updateField<K extends keyof ClassifierNodeData>(field: K, value: ClassifierNodeData[K]) {
		workflowState.updateNode(nodeId, { [field]: value });
	}

	function handleModelChange(config: ModelConfig | undefined) {
		updateField('modelConfig', config);
	}

	function handleInputVariableChange(value: string | undefined) {
		updateField('inputVariable', value ?? '');
	}

	function handleVisionChange(value: boolean) {
		updateField('visionEnabled', value);
	}

	function addOption() {
		const newOption: ClassifierOption = {
			id: crypto.randomUUID(),
			label: `分类 ${options.length + 1}`,
			description: ''
		};
		updateField('options', [...options, newOption]);
	}

	function removeOption(id: string) {
		// 同时删除关联的边
		workflowState.edges = workflowState.edges.filter(
			e => !(e.source === nodeId && e.sourceHandle === id)
		);
		updateField('options', options.filter((o: ClassifierOption) => o.id !== id));
	}

	function updateOption(id: string, field: keyof ClassifierOption, value: string) {
		updateField('options', options.map((o: ClassifierOption) => 
			o.id === id ? { ...o, [field]: value } : o
		));
	}

	function duplicateOption(id: string) {
		const original = options.find((o: ClassifierOption) => o.id === id);
		if (!original) return;
		const newOption: ClassifierOption = {
			id: crypto.randomUUID(),
			label: `${original.label} (副本)`,
			description: original.description
		};
		const index = options.findIndex((o: ClassifierOption) => o.id === id);
		const newOptions = [...options];
		newOptions.splice(index + 1, 0, newOption);
		updateField('options', newOptions);
	}

	function handleInstructionChange(value: string) {
		updateField('instruction', value);
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

	// 渲染带变量标签的 JSON（用于输入/输出显示）
	function renderJsonWithVariables(data: unknown): string {
		const json = JSON.stringify(data, null, 2);
		// 渲染变量标签 {{#xxx.xxx#}}
		return json.replace(/\{\{#([^#]+)#\}\}/g, '<span class="inline-flex items-center gap-0.5 px-1 py-0 mx-0.5 rounded bg-primary/15 text-primary text-[10px] font-mono whitespace-nowrap align-middle"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-2.5 h-2.5 inline-block"><path d="M7 4V2H17V4H20.0066C20.5552 4 21 4.44495 21 4.9934V21.0066C21 21.5552 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5551 3 21.0066V4.9934C3 4.44476 3.44495 4 3.9934 4H7ZM7 6H5V20H19V6H17V8H7V6ZM9 4V6H15V4H9Z"/></svg>$1</span>');
	}
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
				<!-- 模型选择 -->
				<ModelSelector
					value={modelConfig}
					onValueChange={handleModelChange}
					required
				/>

				<!-- 输入变量 -->
				<div class="space-y-2">
					<div class="flex items-center gap-1">
						<span class="text-xs font-medium">输入变量</span>
						<span class="text-destructive text-xs">*</span>
					</div>
					<VariableSelect
						value={inputVariable}
						onValueChange={handleInputVariableChange}
						placeholder="选择要分类的变量"
						filterTypes={['string']}
						currentNodeId={nodeId}
					/>
				</div>

				<!-- 视觉开关 -->
				<div class="flex items-center justify-between py-2">
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
							<Tooltip.Content>启用后可以处理图像输入</Tooltip.Content>
						</Tooltip.Root>
					</div>
					<Switch 
						checked={visionEnabled}
						onCheckedChange={handleVisionChange}
					/>
				</div>

				<!-- 分类选项 -->
				<div class="space-y-2">
					<div class="flex items-center gap-1">
						<span class="text-xs font-medium">分类</span>
						<span class="text-destructive text-xs">*</span>
						<Icon icon="mdi:chevron-down" class="w-3.5 h-3.5 text-muted-foreground" />
					</div>
					
					<div class="space-y-2">
						{#each options as option (option.id)}
							<div class="border border-border rounded-lg overflow-hidden">
								<!-- 选项头部 -->
								<div class="flex items-center gap-2 px-3 py-2 bg-muted/30">
									<Input 
										value={option.label}
										oninput={(e) => updateOption(option.id, 'label', (e.target as HTMLInputElement).value)}
										placeholder="分类名称"
										class="flex-1 h-7 text-sm font-medium bg-transparent border-0 p-0 focus-visible:ring-0"
									/>
									<span class="text-xs text-muted-foreground">{option.description?.length ?? 0}</span>
									<div class="flex items-center gap-0.5">
										<Tooltip.Root>
											<Tooltip.Trigger>
												{#snippet child({ props })}
													<Button 
														{...props}
														variant="ghost" 
														size="icon" 
														class="h-6 w-6 text-destructive hover:text-destructive"
														onclick={() => removeOption(option.id)}
													>
														<Icon icon="mdi:delete-outline" class="w-3.5 h-3.5" />
													</Button>
												{/snippet}
											</Tooltip.Trigger>
											<Tooltip.Content>删除分类</Tooltip.Content>
										</Tooltip.Root>
										<Tooltip.Root>
											<Tooltip.Trigger>
												{#snippet child({ props })}
													<Button 
														{...props}
														variant="ghost" 
														size="icon" 
														class="h-6 w-6"
														onclick={() => duplicateOption(option.id)}
													>
														<Icon icon="mdi:content-copy" class="w-3.5 h-3.5" />
													</Button>
												{/snippet}
											</Tooltip.Trigger>
											<Tooltip.Content>复制分类</Tooltip.Content>
										</Tooltip.Root>
									</div>
								</div>
								<!-- 选项描述 - 使用 VariableTagEditor -->
								<div class="px-3 py-2">
									<VariableTagEditor
										value={option.description ?? ''}
										onValueChange={(v) => updateOption(option.id, 'description', v)}
										placeholder={'输入分类描述，输入 { 或 / 插入变量'}
										rows={2}
										filterTypes={['string', 'number']}
									/>
								</div>
							</div>
						{/each}
					</div>

					<Button 
						variant="outline" 
						size="sm" 
						class="w-full"
						onclick={addOption}
					>
						<Icon icon="mdi:plus" width="14" height="14" class="mr-1" />
						添加分类
					</Button>
				</div>

				<!-- 高级设置 -->
				<div class="space-y-2">
					<button 
						class="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground w-full"
						onclick={() => advancedOpen = !advancedOpen}
					>
						<span>高级设置</span>
						<Icon 
							icon="mdi:chevron-down" 
							class="w-4 h-4 transition-transform {advancedOpen ? 'rotate-180' : ''}" 
						/>
					</button>
					{#if advancedOpen}
						<div class="pt-2">
							<div class="border border-border rounded-lg overflow-hidden">
								<div class="flex items-center gap-2 px-3 py-2 bg-muted/30">
									<span class="text-xs font-medium">指令</span>
									<Tooltip.Root>
										<Tooltip.Trigger>
											{#snippet child({ props })}
												<button {...props} class="text-muted-foreground hover:text-foreground">
													<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
												</button>
											{/snippet}
										</Tooltip.Trigger>
										<Tooltip.Content>自定义分类指令</Tooltip.Content>
									</Tooltip.Root>
									<div class="flex-1"></div>
									<span class="text-xs text-muted-foreground">{instructionLength}</span>
									<Button variant="ghost" size="icon" class="h-6 w-6">
										<Icon icon="mdi:code-braces" class="w-3.5 h-3.5" />
									</Button>
									<Button variant="ghost" size="icon" class="h-6 w-6">
										<Icon icon="mdi:content-copy" class="w-3.5 h-3.5" />
									</Button>
									<Button variant="ghost" size="icon" class="h-6 w-6">
										<Icon icon="mdi:arrow-expand" class="w-3.5 h-3.5" />
									</Button>
								</div>
								<div class="px-3 py-2">
									<Textarea 
										value={instruction}
										oninput={(e) => handleInstructionChange((e.target as HTMLTextAreaElement).value)}
										placeholder="在这里写你的提示词"
										rows={3}
										class="text-sm resize-none border-0 p-0 focus-visible:ring-0 bg-transparent"
									/>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- 输出变量 -->
				<div class="space-y-2">
					<button 
						class="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground w-full"
						onclick={() => outputOpen = !outputOpen}
					>
						<span>输出变量</span>
						<Icon 
							icon="mdi:chevron-down" 
							class="w-4 h-4 transition-transform {outputOpen ? 'rotate-180' : ''}" 
						/>
					</button>
					{#if outputOpen}
						<div class="pt-2 space-y-2">
							{#each BUILTIN_OUTPUT_VARIABLES as variable}
								<div class="flex items-start gap-2">
									<div class="flex-1">
										<div class="flex items-center gap-2">
											<span class="font-mono text-sm font-medium">{variable.name}</span>
											<span class="text-xs text-muted-foreground">{variable.type}</span>
										</div>
										<p class="text-xs text-muted-foreground mt-0.5">{variable.description}</p>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</Tabs.Content>

		<!-- 上次运行 Tab -->
		<Tabs.Content value="lastRun" class="mt-0">
			{#if !runData || runData.status === 'idle'}
				<div class="py-12 text-center">
					<Icon icon="mdi:play-circle-outline" class="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
					<p class="text-sm text-muted-foreground">暂无运行记录</p>
					<p class="text-xs text-muted-foreground mt-1">运行工作流后将在此显示结果</p>
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
					{#if runData.elapsed !== undefined || runData.tokens !== undefined}
						<div class="grid grid-cols-2 gap-3">
							{#if runData.elapsed !== undefined}
								<div class="p-3 border border-border rounded-lg">
									<div class="flex items-center gap-2 text-muted-foreground mb-1">
										<Icon icon="mdi:timer-outline" class="w-4 h-4" />
										<span class="text-xs">运行时间</span>
									</div>
									<span class="text-sm font-semibold">{formatDuration(runData.elapsed)}</span>
								</div>
							{/if}
							{#if runData.tokens !== undefined}
								<div class="p-3 border border-border rounded-lg">
									<div class="flex items-center gap-2 text-muted-foreground mb-1">
										<Icon icon="mdi:chip" class="w-4 h-4" />
										<span class="text-xs">Token 消耗</span>
									</div>
									<span class="text-sm font-semibold">{runData.tokens.total.toLocaleString()}</span>
								</div>
							{/if}
						</div>
					{/if}

					<!-- 输入 -->
					{#if runData.inputs && Object.keys(runData.inputs).length > 0}
						<div class="space-y-2">
							<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
								<Icon icon="mdi:import" class="w-4 h-4" />
								输入
							</div>
							<div class="p-2 bg-muted/30 rounded">
								<pre class="text-xs text-foreground whitespace-pre-wrap break-all">{@html renderJsonWithVariables(runData.inputs)}</pre>
							</div>
						</div>
					{/if}

					<!-- 输出结果 -->
					{#if runData.outputs && Object.keys(runData.outputs).length > 0}
						<div class="space-y-2">
							<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
								<Icon icon="mdi:export" class="w-4 h-4" />
								输出结果
							</div>
							<div class="p-2 bg-muted/30 rounded max-h-64 overflow-auto">
								<pre class="text-xs text-foreground whitespace-pre-wrap break-all">{@html renderJsonWithVariables(runData.outputs)}</pre>
							</div>
						</div>
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
