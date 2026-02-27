<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import Icon from '@iconify/svelte';
	import { workflowState } from '../../contexts/index';
	import { validateWorkflow, type ValidationIssue } from '../../validation/index';

	interface Props {
		onSelectNode?: (nodeId: string) => void;
	}

	let { onSelectNode }: Props = $props();

	// 验证问题列表（响应式计算）
	let issues = $derived.by(() => validateWorkflow(
		workflowState.nodes,
		workflowState.edges,
		workflowState.environmentVariables,
		workflowState.inputVariables
	));

	let errors = $derived(issues.filter(i => i.severity === 'error'));
	let warnings = $derived(issues.filter(i => i.severity === 'warning'));

	function handleIssueClick(issue: ValidationIssue) {
		if (issue.nodeId && onSelectNode) {
			onSelectNode(issue.nodeId);
		}
	}

	function getNodeTypeIcon(nodeType: string): string {
		switch (nodeType) {
			case 'start': return 'mdi:play-circle';
			case 'llm': return 'mdi:robot';
			case 'output': return 'mdi:export';
			case 'if': return 'mdi:source-branch';
			case 'classifier': return 'mdi:tag-multiple';
			case 'agent': return 'mdi:robot-outline';
			case 'knowledge': return 'mdi:database-search';
			case 'loop': return 'mdi:infinity';
			case 'loop-break': return 'mdi:debug-step-out';
			case 'note': return 'mdi:note-text';
			case 'environment': return 'mdi:variable';
			default: return 'mdi:cube-outline';
		}
	}
</script>

{#if issues.length === 0}
	<div class="text-center py-12 text-muted-foreground">
		<Icon icon="mdi:check-circle" class="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
		<p class="text-sm">没有发现问题</p>
		<p class="text-xs mt-1">工作流配置正常</p>
	</div>
{:else}
	<div class="space-y-4">
		<!-- 错误列表 -->
		{#if errors.length > 0}
			<div class="space-y-2">
				<div class="flex items-center gap-2 text-sm font-medium text-destructive">
					<Icon icon="mdi:close-circle" class="w-4 h-4" />
					<span>错误 ({errors.length})</span>
				</div>
				<div class="space-y-1.5">
					{#each errors as issue (issue.id)}
						<button
							type="button"
							class="w-full text-left p-2.5 rounded-lg border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors cursor-pointer"
							onclick={() => handleIssueClick(issue)}
							disabled={!issue.nodeId}
						>
							<div class="flex items-start gap-2">
								<Icon icon={getNodeTypeIcon(issue.nodeType)} class="w-4 h-4 mt-0.5 text-destructive shrink-0" />
								<div class="flex-1 min-w-0">
									<div class="text-xs font-medium text-destructive truncate">{issue.nodeTitle}</div>
									<div class="text-xs text-muted-foreground mt-0.5">{issue.message}</div>
								</div>
								{#if issue.nodeId}
									<Icon icon="mdi:chevron-right" class="w-4 h-4 text-muted-foreground shrink-0" />
								{/if}
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- 警告列表 -->
		{#if warnings.length > 0}
			<div class="space-y-2">
				<div class="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-500">
					<Icon icon="mdi:alert" class="w-4 h-4" />
					<span>警告 ({warnings.length})</span>
				</div>
				<div class="space-y-1.5">
					{#each warnings as issue (issue.id)}
						<button
							type="button"
							class="w-full text-left p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-pointer"
							onclick={() => handleIssueClick(issue)}
							disabled={!issue.nodeId}
						>
							<div class="flex items-start gap-2">
								<Icon icon={getNodeTypeIcon(issue.nodeType)} class="w-4 h-4 mt-0.5 text-amber-600 dark:text-amber-500 shrink-0" />
								<div class="flex-1 min-w-0">
									<div class="text-xs font-medium text-amber-700 dark:text-amber-400 truncate">{issue.nodeTitle}</div>
									<div class="text-xs text-muted-foreground mt-0.5">{issue.message}</div>
								</div>
								{#if issue.nodeId}
									<Icon icon="mdi:chevron-right" class="w-4 h-4 text-muted-foreground shrink-0" />
								{/if}
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
