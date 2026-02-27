<script lang="ts">
	import type { IfNodeData, ConditionCase, Condition, ComparisonOperator } from './types';
	import { COMPARISON_OPERATORS, NO_VALUE_OPERATORS, createDefaultCondition, createDefaultCase } from './types';
	import { workflowState } from '$lib/components/workflow/editor/contexts/index';
	import { VariableSelect } from '../../components/VariableSelector/index';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Icon from '@iconify/svelte';
	import RunStatusBadge from '../../components/RunStatusBadge.svelte';

	interface Props {
		nodeId: string;
		data: IfNodeData;
	}

	let { nodeId }: Props = $props();

	let activeTab = $state('settings');

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as IfNodeData | undefined;
	});

	// 派生数据
	let cases = $derived(currentData?.cases ?? []);
	let lastRun = $derived(currentData?.lastRun);

	function updateField<K extends keyof IfNodeData>(field: K, value: IfNodeData[K]) {
		workflowState.updateNode(nodeId, { [field]: value });
	}

	// 更新分支
	function updateCases(newCases: ConditionCase[]) {
		updateField('cases', newCases);
	}

	// 添加 ELIF 分支
	function addElifCase() {
		const newCase = createDefaultCase('elif');
		updateCases([...cases, newCase]);
	}

	// 移除分支
	function removeCase(caseId: string) {
		workflowState.edges = workflowState.edges.filter(
			e => !(e.source === nodeId && e.sourceHandle === caseId)
		);
		updateCases(cases.filter((c: ConditionCase) => c.id !== caseId));
	}

	// 添加条件到分支
	function addCondition(caseId: string) {
		const newCondition = createDefaultCondition();
		updateCases(cases.map((c: ConditionCase) => 
			c.id === caseId 
				? { ...c, conditions: [...c.conditions, newCondition] }
				: c
		));
	}

	// 移除条件
	function removeCondition(caseId: string, conditionId: string) {
		updateCases(cases.map((c: ConditionCase) => 
			c.id === caseId 
				? { ...c, conditions: c.conditions.filter((cond: Condition) => cond.id !== conditionId) }
				: c
		));
	}

	// 更新条件
	function updateCondition(caseId: string, conditionId: string, field: keyof Condition, value: string) {
		updateCases(cases.map((c: ConditionCase) => 
			c.id === caseId 
				? { 
					...c, 
					conditions: c.conditions.map((cond: Condition) => 
						cond.id === conditionId ? { ...cond, [field]: value } : cond
					)
				}
				: c
		));
	}

	// 处理变量选择变化
	function handleVariableChange(caseId: string, conditionId: string, value: string | undefined) {
		updateCondition(caseId, conditionId, 'variable', value ?? '');
	}

	// 检查操作符是否需要值
	function needsValue(operator: ComparisonOperator): boolean {
		return !NO_VALUE_OPERATORS.includes(operator);
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
				{#if lastRun && lastRun.status !== 'idle'}
					<span class="ml-1.5">
						<RunStatusBadge status={lastRun.status} size="sm" />
					</span>
				{/if}
			</Tabs.Trigger>
		</Tabs.List>

		<!-- 设置 Tab -->
		<Tabs.Content value="settings" class="mt-0">
			<div class="space-y-6">
				<!-- 条件分支列表 -->
				{#each cases as caseItem, caseIndex (caseItem.id)}
					<div class="space-y-3">
						<!-- 分支头部：左侧标签 + 右侧操作 -->
						<div class="flex items-center justify-between">
							<!-- 左侧：IF/ELIF + CASE -->
							<div class="flex flex-col">
								<span class="text-sm font-bold text-foreground">
									{caseItem.type === 'if' ? 'IF' : 'ELIF'}
								</span>
								<span class="text-xs text-muted-foreground">CASE{caseIndex + 1}</span>
							</div>

							<!-- 右侧：添加条件 + 移除 -->
							<div class="flex items-center gap-2">
								<Button 
									variant="outline" 
									size="sm"
									class="h-8 text-xs"
									onclick={() => addCondition(caseItem.id)}
								>
									<Icon icon="mdi:plus" width="14" height="14" class="mr-1" />
									添加条件
								</Button>
								
								{#if caseItem.type !== 'if'}
									<Button 
										variant="ghost" 
										size="sm"
										class="h-8 text-xs text-muted-foreground hover:text-destructive"
										onclick={() => removeCase(caseItem.id)}
									>
										<Icon icon="mdi:delete-outline" width="14" height="14" class="mr-1" />
										移除
									</Button>
								{/if}
							</div>
						</div>

						<!-- 条件列表 -->
						{#if caseItem.conditions.length > 0}
							<div class="space-y-2">
								{#each caseItem.conditions as condition, condIndex (condition.id)}
									<!-- 条件卡片：整体容器 -->
									<div class="rounded-lg border border-border bg-muted/30 overflow-hidden">
										<!-- 第一行：变量选择 + 操作符 + 删除 -->
										<div class="flex items-center gap-2 p-2">
											<!-- 变量选择 -->
											<div class="flex-1 min-w-0">
												<VariableSelect
													value={condition.variable}
													onValueChange={(v: string | undefined) => handleVariableChange(caseItem.id, condition.id, v)}
													placeholder="选择变量"
													filterTypes={['string', 'number', 'boolean']}
													currentNodeId={nodeId}
												/>
											</div>

											<!-- 操作符选择 -->
											<Select.Root 
												type="single"
												value={condition.operator}
												onValueChange={(v) => updateCondition(caseItem.id, condition.id, 'operator', v)}
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

											<!-- 删除按钮 -->
											<Button 
												variant="ghost" 
												size="icon" 
												class="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
												onclick={() => removeCondition(caseItem.id, condition.id)}
											>
												<Icon icon="mdi:delete-outline" class="w-4 h-4" />
											</Button>
										</div>

										<!-- 第二行：值输入（某些操作符不需要） -->
										{#if needsValue(condition.operator)}
											<div class="px-2 pb-2">
												<Input 
													value={condition.value}
													oninput={(e) => updateCondition(caseItem.id, condition.id, 'value', (e.target as HTMLInputElement).value)}
													placeholder="输入值"
													class="h-9 text-sm bg-background"
												/>
											</div>
										{/if}
									</div>

									<!-- AND 分隔（条件之间） -->
									{#if condIndex < caseItem.conditions.length - 1}
										<div class="flex items-center justify-center py-1">
											<span class="text-xs text-muted-foreground font-medium">AND</span>
										</div>
									{/if}
								{/each}
							</div>
						{/if}
					</div>
				{/each}

				<!-- 添加 ELIF 按钮 -->
				<Button 
					variant="outline" 
					size="default" 
					class="w-full"
					onclick={addElifCase}
				>
					<Icon icon="mdi:plus" width="16" height="16" class="mr-1" />
					ELIF
				</Button>

				<!-- ELSE 说明 -->
				<div class="pt-4 border-t border-border">
					<div class="text-sm font-bold text-foreground mb-1">ELSE</div>
					<p class="text-xs text-muted-foreground">
						用于定义当 if 条件不满足时应执行的逻辑。
					</p>
				</div>
			</div>
		</Tabs.Content>

		<!-- 上次运行 Tab -->
		<Tabs.Content value="lastRun" class="mt-0">
			{#if lastRun && lastRun.status !== 'idle'}
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<span class="text-xs font-medium">状态</span>
						<RunStatusBadge status={lastRun.status} />
					</div>

					{#if lastRun.duration !== undefined}
						<div class="flex items-center justify-between">
							<span class="text-xs font-medium">耗时</span>
							<span class="text-xs text-muted-foreground">{lastRun.duration}ms</span>
						</div>
					{/if}

					{#if lastRun.matchedCaseId !== undefined}
						<div class="flex items-center justify-between">
							<span class="text-xs font-medium">匹配分支</span>
							<span class="text-xs text-muted-foreground">
								{#if lastRun.matchedCaseId === null}
									ELSE
								{:else}
									{@const matchedCase = cases.find((c: ConditionCase) => c.id === lastRun.matchedCaseId)}
									{#if matchedCase}
										{matchedCase.type === 'if' ? 'IF' : 'ELIF'} (CASE {cases.indexOf(matchedCase) + 1})
									{:else}
										未知
									{/if}
								{/if}
							</span>
						</div>
					{/if}

					{#if lastRun.inputs}
						<div class="space-y-2">
							<span class="text-xs font-medium">输入</span>
							<div class="p-2 bg-muted/50 rounded text-xs font-mono overflow-auto max-h-32">
								<pre>{@html renderJsonWithVariables(lastRun.inputs)}</pre>
							</div>
						</div>
					{/if}

					{#if lastRun.error}
						<div class="space-y-2">
							<span class="text-xs font-medium text-destructive">错误</span>
							<div class="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
								{lastRun.error}
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-8 text-center">
					<Icon icon="mdi:play-circle-outline" class="w-12 h-12 text-muted-foreground/50 mb-2" />
					<p class="text-sm text-muted-foreground">暂无运行记录</p>
					<p class="text-xs text-muted-foreground mt-1">运行工作流后将在此显示结果</p>
				</div>
			{/if}
		</Tabs.Content>
	</Tabs.Root>
</Tooltip.Provider>
