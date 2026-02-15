<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount, tick } from 'svelte';
	import BaseNode, { type OutputHandle } from '../BaseNode.svelte';
	import type { IfNodeData, ConditionCase, ComparisonOperator } from './types.js';
	import { COMPARISON_OPERATORS, NO_VALUE_OPERATORS } from './types.js';
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { configPanelRegistry, workflowState } from '$lib/components/editor/contexts/index.js';
	import ConfigPanel from './ConfigPanel.svelte';

	interface Props {
		id: string;
		data: IfNodeData;
	}

	let { id, data }: Props = $props();

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(id);
		return (node?.data as IfNodeData) ?? data;
	});

	onMount(() => {
		configPanelRegistry.register('if', ConfigPanel);
	});

	let cases = $derived<ConditionCase[]>(currentData.cases ?? []);

	// 获取分支显示标签
	function getCaseLabel(caseItem: ConditionCase): string {
		if (caseItem.type === 'if') return 'IF';
		return 'ELIF';
	}

	// 获取操作符标签
	function getOperatorLabel(operator: ComparisonOperator): string {
		return COMPARISON_OPERATORS.find(op => op.value === operator)?.label ?? operator;
	}

	// 格式化变量显示
	function formatVariable(variable: string): string {
		if (!variable) return '未设置';
		return variable;
	}

	// 检查操作符是否需要值
	function needsValue(operator: ComparisonOperator): boolean {
		return !NO_VALUE_OPERATORS.includes(operator);
	}

	// DOM 引用用于计算引脚位置
	let nodeRef: HTMLDivElement | undefined = $state();
	let caseRefs: HTMLDivElement[] = $state([]);
	let elseRef: HTMLDivElement | undefined = $state();
	let handleTops: number[] = $state([]);
	let elseHandleTop = $state(0);

	// 动态计算引脚位置
	$effect(() => {
		if (nodeRef && (cases.length > 0 || elseRef)) {
			tick().then(() => {
				const nodeRect = nodeRef!.getBoundingClientRect();
				
				// 计算每个 case 的 handle 位置
				handleTops = caseRefs.map(ref => {
					if (!ref) return 0;
					const rect = ref.getBoundingClientRect();
					return rect.top - nodeRect.top + rect.height / 2;
				});
				
				// 计算 ELSE 的 handle 位置
				if (elseRef) {
					const elseRect = elseRef.getBoundingClientRect();
					elseHandleTop = elseRect.top - nodeRect.top + elseRect.height / 2;
				}
			});
		}
	});

	// 构建输出引脚配置
	let outputs = $derived<OutputHandle[]>([
		// 各分支引脚
		...cases.map((c, i) => ({ id: c.id, top: handleTops[i] ?? 0 })),
		// ELSE 引脚
		{ id: 'else', top: elseHandleTop }
	]);
</script>

<div bind:this={nodeRef}>
	<!-- 分支节点：有输入引脚，无默认输出引脚（使用 outputs 配置分支引脚） -->
	<BaseNode nodeId={id} nodeData={data} showOutput={false} {outputs}>
		{#snippet content(nodeData)}
			<!-- Header -->
			<div class="flex items-center gap-3">
				<Avatar.Root class="rounded-lg bg-cyan-500 text-white h-8 w-8">
					<div class="flex items-center justify-center w-full h-full">
						<Icon icon="mdi:source-branch" width="18" height="18" />
					</div>
				</Avatar.Root>
				<div class="flex flex-col">
					<span class="text-sm font-semibold text-foreground tracking-tight">{nodeData.title || '条件分支'}</span>
					{#if cases.length > 0}
						<span class="text-xs text-muted-foreground">{cases.length} 个分支</span>
					{/if}
				</div>
			</div>

			<!-- 分支列表 -->
			<div class="mt-3 border-t border-border -mx-3 px-3 pt-2 space-y-1">
				{#each cases as caseItem, index (caseItem.id)}
					<div 
						bind:this={caseRefs[index]}
						class="flex items-center gap-2 py-2 text-xs"
					>
						<!-- 条件详情 -->
						<div class="flex-1 min-w-0">
							{#if caseItem.conditions.length === 0}
								<div class="px-2 py-1 bg-muted/50 rounded text-muted-foreground text-xs">
									条件未设置
								</div>
							{:else}
								{#each caseItem.conditions as condition, condIndex (condition.id)}
									<div class="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded text-xs {condIndex > 0 ? 'mt-1' : ''}">
										<!-- 变量 -->
										<span class="text-orange-500 font-mono truncate max-w-[100px]" title={condition.variable}>
											{formatVariable(condition.variable)}
										</span>
										<!-- 操作符 -->
										<span class="text-foreground shrink-0">{getOperatorLabel(condition.operator)}</span>
										<!-- 值（如果需要） -->
										{#if needsValue(condition.operator) && condition.value}
											<span class="text-foreground truncate max-w-[60px]" title={condition.value}>{condition.value}</span>
										{/if}
									</div>
									{#if condIndex < caseItem.conditions.length - 1}
										<div class="text-[10px] text-muted-foreground text-center py-0.5">AND</div>
									{/if}
								{/each}
							{/if}
						</div>
						<!-- IF/ELIF 标签 -->
						<span class="text-cyan-500 font-semibold uppercase shrink-0">{getCaseLabel(caseItem)}</span>
					</div>
				{/each}
				
				<!-- ELSE 分支 -->
				<div 
					bind:this={elseRef}
					class="flex items-center gap-2 py-2 text-xs border-t border-border/50"
				>
					<div class="flex-1"></div>
					<span class="text-muted-foreground font-semibold uppercase">ELSE</span>
				</div>
			</div>
		{/snippet}
	</BaseNode>
</div>
