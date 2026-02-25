<script lang="ts">
	import type { KnowledgeNodeData, KnowledgeBaseRef, MetadataFilterMode } from './types';
	import { BUILTIN_OUTPUT_VARIABLES, METADATA_FILTER_OPTIONS } from './types';
	import { workflowState } from '$lib/components/workflow/editor/contexts/index';
	import { VariableSelect } from '../../components/VariableSelector/index';
	import { KnowledgeSelector } from '../../components/selectors/index';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Icon from '@iconify/svelte';
	import RunStatusBadge from '../../components/RunStatusBadge.svelte';

	interface KnowledgeBase {
		id: string;
		name: string;
		description?: string | null;
		icon?: string | null;
	}

	interface Props {
		nodeId: string;
		data: KnowledgeNodeData;
	}

	let { nodeId }: Props = $props();

	let activeTab = $state('settings');
	let recallSettingsOpen = $state<Record<string, boolean>>({});

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as KnowledgeNodeData | undefined;
	});

	// 派生数据
	let queryVariable = $derived(currentData?.queryVariable ?? '');
	let knowledgeBases = $derived(currentData?.knowledgeBases ?? []);
	let topK = $derived(currentData?.topK ?? 3);
	let scoreThreshold = $derived(currentData?.scoreThreshold ?? 0.5);
	let metadataFilterMode = $derived(currentData?.metadataFilterMode ?? 'disabled');
	let lastRun = $derived(currentData?.lastRun);

	// 输出变量展开状态
	let outputExpanded = $state(true);

	function updateField<K extends keyof KnowledgeNodeData>(field: K, value: KnowledgeNodeData[K]) {
		workflowState.updateNode(nodeId, { [field]: value });
	}

	// 添加知识库
	function addKnowledgeBase(kb: KnowledgeBase) {
		// 检查是否已添加
		if (knowledgeBases.some(k => k.id === kb.id)) return;
		
		const newKb: KnowledgeBaseRef = {
			id: kb.id,
			name: kb.name,
			topK: topK,
			scoreThreshold: scoreThreshold,
		};
		updateField('knowledgeBases', [...knowledgeBases, newKb]);
	}

	// 已选择的知识库 ID 列表
	let selectedKbIds = $derived(knowledgeBases.map(kb => kb.id));

	// 移除知识库
	function removeKnowledgeBase(kbId: string) {
		updateField('knowledgeBases', knowledgeBases.filter(k => k.id !== kbId));
	}

	// 更新知识库召回设置
	function updateKnowledgeBase(kbId: string, field: keyof KnowledgeBaseRef, value: unknown) {
		const updated = knowledgeBases.map(kb => 
			kb.id === kbId ? { ...kb, [field]: value } : kb
		);
		updateField('knowledgeBases', updated);
	}

	// 切换召回设置展开
	function toggleRecallSettings(kbId: string) {
		recallSettingsOpen = { ...recallSettingsOpen, [kbId]: !recallSettingsOpen[kbId] };
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
		if (type.startsWith('Array')) return 'text-purple-600 dark:text-purple-400';
		switch (type) {
			case 'string': return 'text-emerald-600 dark:text-emerald-400';
			case 'number': return 'text-blue-600 dark:text-blue-400';
			case 'boolean': return 'text-amber-600 dark:text-amber-400';
			case 'object': return 'text-rose-600 dark:text-rose-400';
			default: return 'text-muted-foreground';
		}
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
				<!-- 查询文本 -->
				<div class="space-y-2">
					<div class="flex items-center gap-1">
						<span class="text-xs font-medium">查询文本</span>
						<span class="text-destructive text-xs">*</span>
					</div>
					<VariableSelect 
						value={queryVariable}
						onValueChange={(v: string | undefined) => updateField('queryVariable', v ?? '')}
						placeholder="设置变量值"
					/>
				</div>

				<!-- 知识库 -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-1">
							<span class="text-xs font-medium">知识库</span>
							<span class="text-destructive text-xs">*</span>
						</div>
						<div class="flex items-center gap-2">
							<Button variant="ghost" size="sm" class="h-7 text-xs gap-1 text-muted-foreground">
								<Icon icon="mdi:cog" class="w-3.5 h-3.5" />
								召回设置
							</Button>
							
							<!-- 添加知识库 -->
							<KnowledgeSelector
								selectedIds={selectedKbIds}
								onSelect={addKnowledgeBase}
							/>
						</div>
					</div>

					<!-- 已添加的知识库列表 -->
					{#if knowledgeBases.length > 0}
						<div class="space-y-2">
							{#each knowledgeBases as kb (kb.id)}
								<div class="border border-border rounded-lg">
									<div class="flex items-center justify-between px-3 py-2">
										<div class="flex items-center gap-2">
											<Icon icon="mdi:database" class="w-4 h-4 text-purple-500" />
											<span class="text-xs font-medium">{kb.name}</span>
										</div>
										<div class="flex items-center gap-1">
											<Button 
												variant="ghost" 
												size="icon" 
												class="h-6 w-6"
												onclick={() => toggleRecallSettings(kb.id)}
											>
												<Icon icon="mdi:chevron-{recallSettingsOpen[kb.id] ? 'up' : 'down'}" class="w-4 h-4" />
											</Button>
											<Button 
												variant="ghost" 
												size="icon" 
												class="h-6 w-6 text-muted-foreground hover:text-destructive"
												onclick={() => removeKnowledgeBase(kb.id)}
											>
												<Icon icon="mdi:close" class="w-4 h-4" />
											</Button>
										</div>
									</div>
									
									<!-- 召回设置 -->
									{#if recallSettingsOpen[kb.id]}
										<div class="px-3 pb-3 pt-1 border-t border-border space-y-3">
											<div class="flex items-center gap-3">
												<span class="text-xs text-muted-foreground w-16 shrink-0">召回数量</span>
												<div class="flex-1">
													<Slider 
														type="single"
														value={kb.topK ?? topK}
														min={1}
														max={20}
														step={1}
														onValueChange={(v) => updateKnowledgeBase(kb.id, 'topK', v)}
													/>
												</div>
												<Input 
													type="number"
													value={kb.topK ?? topK}
													oninput={(e) => updateKnowledgeBase(kb.id, 'topK', parseInt((e.target as HTMLInputElement).value) || 3)}
													class="h-7 w-14 text-xs text-center px-1"
												/>
											</div>
											<div class="flex items-center gap-3">
												<span class="text-xs text-muted-foreground w-16 shrink-0">相似度</span>
												<div class="flex-1">
													<Slider 
														type="single"
														value={kb.scoreThreshold ?? scoreThreshold}
														min={0}
														max={1}
														step={0.05}
														onValueChange={(v) => updateKnowledgeBase(kb.id, 'scoreThreshold', v)}
													/>
												</div>
												<Input 
													type="number"
													value={kb.scoreThreshold ?? scoreThreshold}
													oninput={(e) => updateKnowledgeBase(kb.id, 'scoreThreshold', parseFloat((e.target as HTMLInputElement).value) || 0.5)}
													class="h-7 w-14 text-xs text-center px-1"
													step="0.05"
												/>
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<div class="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-lg">
							点击"+"按钮添加知识库
						</div>
					{/if}
				</div>

				<!-- 元数据过滤 -->
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-1">
							<span class="text-xs font-medium">元数据过滤</span>
							<Tooltip.Root>
								<Tooltip.Trigger>
									{#snippet child({ props })}
										<button {...props} class="text-muted-foreground hover:text-foreground">
											<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
										</button>
									{/snippet}
								</Tooltip.Trigger>
								<Tooltip.Content>根据元数据字段过滤检索结果</Tooltip.Content>
							</Tooltip.Root>
						</div>
						<Select.Root 
							type="single"
							value={metadataFilterMode}
							onValueChange={(v) => v && updateField('metadataFilterMode', v as MetadataFilterMode)}
						>
							<Select.Trigger class="h-7 w-20 text-xs">
								{METADATA_FILTER_OPTIONS.find(o => o.value === metadataFilterMode)?.label ?? '禁用'}
							</Select.Trigger>
							<Select.Content class="w-64">
								{#each METADATA_FILTER_OPTIONS as option}
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

					{#if metadataFilterMode === 'manual'}
						<div class="text-xs text-muted-foreground text-center py-3 border border-dashed rounded">
							手动过滤条件配置（待实现）
						</div>
					{/if}
				</div>

				<!-- 输出变量 -->
				<div class="space-y-2">
					<button 
						class="flex items-center gap-1 text-xs font-medium w-full text-left"
						onclick={() => outputExpanded = !outputExpanded}
					>
						<Icon icon="mdi:chevron-{outputExpanded ? 'down' : 'right'}" class="w-4 h-4" />
						输出变量
					</button>
					{#if outputExpanded}
						<div class="space-y-3">
							{#each BUILTIN_OUTPUT_VARIABLES as variable}
								<div class="space-y-1">
									<div class="flex items-center gap-2">
										<span class="text-xs font-medium font-mono">{variable.name}</span>
										<span class="text-xs {getTypeColor(variable.type)}">{variable.type}</span>
									</div>
									<p class="text-xs text-muted-foreground">{variable.description}</p>
									
									<!-- 子字段 -->
									{#if variable.children && variable.children.length > 0}
										<div class="ml-3 pl-3 border-l border-border/50 space-y-2 mt-2">
											{#each variable.children as child}
												<div class="space-y-0.5">
													<div class="flex items-center gap-2">
														<span class="text-xs font-mono">{child.name}</span>
														<span class="text-xs {getTypeColor(child.type)}">{child.type}</span>
													</div>
													<p class="text-xs text-muted-foreground">{child.description}</p>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- 下一步提示 -->
				<div class="pt-3 border-t border-border">
					<p class="text-xs text-muted-foreground">
						知识检索节点用于从知识库中检索相关内容，支持多知识库检索和元数据过滤。
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
					{#if lastRun.duration !== undefined || lastRun.resultCount !== undefined}
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
							{#if lastRun.resultCount !== undefined}
								<div class="p-3 border border-border rounded-lg">
									<div class="flex items-center gap-2 text-muted-foreground mb-1">
										<Icon icon="mdi:file-document-multiple" class="w-4 h-4" />
										<span class="text-xs">召回数量</span>
									</div>
									<span class="text-sm font-semibold">{lastRun.resultCount}</span>
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
