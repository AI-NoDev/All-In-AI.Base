<script lang="ts">
	import type { LoopNodeData, LoopVariable, LoopBreakCondition } from './types.js';
	import { VARIABLE_TYPES, createDefaultLoopVariable, createDefaultBreakCondition } from './types.js';
	import { COMPARISON_OPERATORS, NO_VALUE_OPERATORS, type ComparisonOperator } from '../IfNode/types.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { VariableSelect } from '../../components/VariableSelector/index.js';
	import { Input } from '@qiyu-allinai/ui/components/input';
	import { Button } from '@qiyu-allinai/ui/components/button';
	import { Slider } from '@qiyu-allinai/ui/components/slider';
	import * as Select from '@qiyu-allinai/ui/components/select';
	import * as Tabs from '@qiyu-allinai/ui/components/tabs';
	import * as Tooltip from '@qiyu-allinai/ui/components/tooltip';
	import Icon from '@iconify/svelte';
	import RunStatusBadge from '../../components/RunStatusBadge.svelte';
	import NodeRunResult from '../../components/NodeRunResult.svelte';
	import type { NodeRunData, NodeRunStatus } from '$lib/types/index.js';

	interface Props {
		nodeId: string;
		data: LoopNodeData;
	}

	let { nodeId }: Props = $props();

	let activeTab = $state('settings');

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as LoopNodeData | undefined;
	});

	// 派生数据
	let variables = $derived(currentData?.variables ?? []);
	let breakConditions = $derived(currentData?.breakConditions ?? []);
	let maxIterations = $derived(currentData?.maxIterations ?? 10);

	// 将 LoopRunResult 转换为 NodeRunData 格式
	let runData = $derived.by((): NodeRunData | undefined => {
		const lastRun = currentData?.lastRun;
		if (!lastRun) return undefined;

		// 状态映射
		const statusMap: Record<string, NodeRunStatus> = {
			idle: 'idle',
			running: 'running',
			success: 'success',
			failed: 'error'
		};

		return {
			status: statusMap[lastRun.status] ?? 'idle',
			startTime: lastRun.startedAt ? new Date(lastRun.startedAt).getTime() : undefined,
			endTime: lastRun.endedAt ? new Date(lastRun.endedAt).getTime() : undefined,
			elapsed: lastRun.duration,
			inputs: lastRun.inputs,
			outputs: {
				...lastRun.outputs,
				iterations: lastRun.iterations,
				breakReason: lastRun.breakReason
			},
			error: lastRun.error
		};
	});

	function updateField<K extends keyof LoopNodeData>(field: K, value: LoopNodeData[K]) {
		workflowState.updateNode(nodeId, { [field]: value });
	}

	// 循环变量操作
	function addVariable() {
		const newVar = createDefaultLoopVariable();
		updateField('variables', [...variables, newVar]);
	}

	function removeVariable(varId: string) {
		updateField('variables', variables.filter((v: LoopVariable) => v.id !== varId));
	}

	function updateVariable(varId: string, field: keyof LoopVariable, value: string) {
		updateField('variables', variables.map((v: LoopVariable) => 
			v.id === varId ? { ...v, [field]: value } : v
		));
	}

	// 终止条件操作
	function addBreakCondition() {
		const newCond = createDefaultBreakCondition();
		updateField('breakConditions', [...breakConditions, newCond]);
	}

	function removeBreakCondition(condId: string) {
		updateField('breakConditions', breakConditions.filter((c: LoopBreakCondition) => c.id !== condId));
	}

	function updateBreakCondition(condId: string, field: keyof LoopBreakCondition, value: string) {
		updateField('breakConditions', breakConditions.map((c: LoopBreakCondition) => 
			c.id === condId ? { ...c, [field]: value } : c
		));
	}

	// 检查操作符是否需要值
	function needsValue(operator: ComparisonOperator): boolean {
		return !NO_VALUE_OPERATORS.includes(operator);
	}

	// 最大循环次数
	function handleMaxIterationsChange(values: number[]) {
		if (values.length > 0) {
			updateField('maxIterations', values[0]);
		}
	}

	function handleMaxIterationsInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const value = parseInt(input.value, 10);
		if (!isNaN(value) && value >= 1 && value <= 100) {
			updateField('maxIterations', value);
		}
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
			<div class="space-y-6">
				<!-- 循环变量 -->
				<div class="space-y-3">
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium">循环变量</span>
						<Button 
							variant="outline" 
							size="sm"
							class="h-7 text-xs"
							onclick={addVariable}
						>
							<Icon icon="mdi:plus" width="14" height="14" class="mr-1" />
							添加变量
						</Button>
					</div>

					{#if variables.length === 0}
						<div class="text-center py-6 text-sm text-muted-foreground bg-muted/30 rounded-lg">
							在循环范围内设置变量
						</div>
					{:else}
						<div class="space-y-2">
							{#each variables as variable (variable.id)}
								<div class="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
									<div class="flex items-center gap-2">
										<Input 
											value={variable.name}
											oninput={(e) => updateVariable(variable.id, 'name', (e.target as HTMLInputElement).value)}
											placeholder="变量名"
											class="h-8 text-sm flex-1"
										/>
										<Select.Root 
											type="single"
											value={variable.type}
											onValueChange={(v) => updateVariable(variable.id, 'type', v)}
										>
											<Select.Trigger class="h-8 w-24 text-xs">
												{VARIABLE_TYPES.find(t => t.value === variable.type)?.label ?? '类型'}
											</Select.Trigger>
											<Select.Content>
												{#each VARIABLE_TYPES as vt}
													<Select.Item value={vt.value} label={vt.label}>{vt.label}</Select.Item>
												{/each}
											</Select.Content>
										</Select.Root>
										<Button 
											variant="ghost" 
											size="icon" 
											class="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
											onclick={() => removeVariable(variable.id)}
										>
											<Icon icon="mdi:delete-outline" class="w-4 h-4" />
										</Button>
									</div>
									<Input 
										value={variable.initialValue}
										oninput={(e) => updateVariable(variable.id, 'initialValue', (e.target as HTMLInputElement).value)}
										placeholder="初始值"
										class="h-8 text-sm"
									/>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- 循环终止条件 -->
				<div class="space-y-3">
					<div class="flex items-center gap-2">
						<span class="text-sm font-medium">循环终止条件</span>
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Icon icon="mdi:help-circle-outline" class="w-4 h-4 text-muted-foreground" />
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p class="text-xs max-w-[200px]">当满足任一条件时，循环将提前终止</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</div>

					<Button 
						variant="outline" 
						size="sm"
						class="h-8 text-xs"
						onclick={addBreakCondition}
					>
						<Icon icon="mdi:plus" width="14" height="14" class="mr-1" />
						添加条件
					</Button>

					{#if breakConditions.length > 0}
						<div class="space-y-2">
							{#each breakConditions as condition (condition.id)}
								<div class="rounded-lg border border-border bg-muted/30 overflow-hidden">
									<div class="flex items-center gap-2 p-2">
										<div class="flex-1 min-w-0">
											<VariableSelect
												value={condition.variable}
												onValueChange={(v) => updateBreakCondition(condition.id, 'variable', v ?? '')}
												placeholder="选择变量"
											/>
										</div>
										<Select.Root 
											type="single"
											value={condition.operator}
											onValueChange={(v) => updateBreakCondition(condition.id, 'operator', v)}
										>
											<Select.Trigger class="h-9 w-20 text-xs shrink-0">
												{COMPARISON_OPERATORS.find(op => op.value === condition.operator)?.label ?? '选择'}
											</Select.Trigger>
											<Select.Content>
												{#each COMPARISON_OPERATORS as op}
													<Select.Item value={op.value} label={op.label}>{op.label}</Select.Item>
												{/each}
											</Select.Content>
										</Select.Root>
										<Button 
											variant="ghost" 
											size="icon" 
											class="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
											onclick={() => removeBreakCondition(condition.id)}
										>
											<Icon icon="mdi:delete-outline" class="w-4 h-4" />
										</Button>
									</div>
									{#if needsValue(condition.operator)}
										<div class="px-2 pb-2">
											<Input 
												value={condition.value}
												oninput={(e) => updateBreakCondition(condition.id, 'value', (e.target as HTMLInputElement).value)}
												placeholder="输入值"
												class="h-9 text-sm bg-background"
											/>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- 最大循环次数 -->
				<div class="space-y-3">
					<span class="text-sm font-medium">最大循环次数</span>
					<div class="flex items-center gap-4">
						<Input 
							type="number"
							value={maxIterations}
							oninput={handleMaxIterationsInput}
							min="1"
							max="100"
							class="h-9 w-20 text-sm"
						/>
						<Slider 
							value={[maxIterations]}
							onValueChange={handleMaxIterationsChange}
							min={1}
							max={100}
							step={1}
							class="flex-1"
						/>
					</div>
				</div>
			</div>
		</Tabs.Content>

		<!-- 上次运行 Tab -->
		<Tabs.Content value="lastRun" class="mt-0">
			<NodeRunResult {runData} />
		</Tabs.Content>
	</Tabs.Root>
</Tooltip.Provider>
