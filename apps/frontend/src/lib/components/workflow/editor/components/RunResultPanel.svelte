<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import Icon from '@iconify/svelte';
	import type { ExecutionResult, NodeExecutionResult } from '$lib/components/workflow/engine/types';

	interface Props {
		result: ExecutionResult | null;
		onClose: () => void;
	}

	let { result, onClose }: Props = $props();

	function formatDuration(ms: number): string {
		if (ms < 1000) return `${ms}ms`;
		return `${(ms / 1000).toFixed(2)}s`;
	}

	function formatTime(timestamp: number): string {
		return new Date(timestamp).toLocaleTimeString();
	}

	function getStatusIcon(status: string): string {
		switch (status) {
			case 'success':
				return 'mdi:check-circle';
			case 'error':
				return 'mdi:alert-circle';
			case 'running':
				return 'mdi:loading';
			default:
				return 'mdi:circle-outline';
		}
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'success':
				return 'text-green-500';
			case 'error':
				return 'text-red-500';
			case 'running':
				return 'text-blue-500 animate-spin';
			default:
				return 'text-muted-foreground';
		}
	}

	function formatJson(value: unknown): string {
		try {
			return JSON.stringify(value, null, 2);
		} catch {
			return String(value);
		}
	}

	// 展开状态
	let expandedNodes = $state<Set<string>>(new Set());

	function toggleNode(nodeId: string) {
		const newSet = new Set(expandedNodes);
		if (newSet.has(nodeId)) {
			newSet.delete(nodeId);
		} else {
			newSet.add(nodeId);
		}
		expandedNodes = newSet;
	}
</script>

{#if result}
	<div class="absolute bottom-4 right-4 z-20 w-96 bg-background border border-border rounded-lg shadow-lg max-h-[60vh] flex flex-col">
		<!-- Header -->
		<div class="flex items-center justify-between p-3 border-b">
			<div class="flex items-center gap-2">
				<Icon 
					icon={getStatusIcon(result.status)} 
					class="w-5 h-5 {getStatusColor(result.status)}" 
				/>
				<span class="font-medium">
					{result.status === 'success' ? '运行成功' : result.status === 'error' ? '运行失败' : '运行中'}
				</span>
			</div>
			<Button variant="ghost" size="icon" class="h-7 w-7" onclick={onClose}>
				<Icon icon="mdi:close" class="w-4 h-4" />
			</Button>
		</div>

		<!-- Summary -->
		<div class="p-3 border-b bg-muted/30">
			<div class="grid grid-cols-2 gap-2 text-xs">
				<div>
					<span class="text-muted-foreground">开始时间：</span>
					<span>{formatTime(result.startTime)}</span>
				</div>
				<div>
					<span class="text-muted-foreground">总耗时：</span>
					<span>{formatDuration(result.elapsed)}</span>
				</div>
				{#if result.totalTokens}
					<div>
						<span class="text-muted-foreground">Tokens：</span>
						<span>{result.totalTokens.total}</span>
					</div>
					<div>
						<span class="text-muted-foreground">节点数：</span>
						<span>{result.nodeResults.length}</span>
					</div>
				{/if}
			</div>
			{#if result.error}
				<div class="mt-2 p-2 bg-destructive/10 text-destructive text-xs rounded">
					{result.error}
				</div>
			{/if}
		</div>

		<!-- Node Results -->
		<div class="flex-1 overflow-y-auto p-2 space-y-1">
			{#each result.nodeResults as nodeResult (nodeResult.nodeId)}
				<Collapsible.Root open={expandedNodes.has(nodeResult.nodeId)}>
					<Collapsible.Trigger 
						class="w-full flex items-center gap-2 p-2 hover:bg-muted/50 rounded text-sm"
						onclick={() => toggleNode(nodeResult.nodeId)}
					>
						<Icon 
							icon={getStatusIcon(nodeResult.status)} 
							class="w-4 h-4 {getStatusColor(nodeResult.status)}" 
						/>
						<span class="flex-1 text-left truncate">{nodeResult.nodeId}</span>
						<span class="text-xs text-muted-foreground">{formatDuration(nodeResult.elapsed)}</span>
						<Icon 
							icon={expandedNodes.has(nodeResult.nodeId) ? 'mdi:chevron-up' : 'mdi:chevron-down'} 
							class="w-4 h-4" 
						/>
					</Collapsible.Trigger>
					<Collapsible.Content>
						<div class="ml-6 p-2 space-y-2 text-xs">
							{#if nodeResult.inputs && Object.keys(nodeResult.inputs).length > 0}
								<div>
									<div class="text-muted-foreground mb-1">输入：</div>
									<pre class="p-2 bg-muted/50 rounded overflow-x-auto max-h-32">{formatJson(nodeResult.inputs)}</pre>
								</div>
							{/if}
							{#if nodeResult.outputs && Object.keys(nodeResult.outputs).length > 0}
								<div>
									<div class="text-muted-foreground mb-1">输出：</div>
									<pre class="p-2 bg-muted/50 rounded overflow-x-auto max-h-32">{formatJson(nodeResult.outputs)}</pre>
								</div>
							{/if}
							{#if nodeResult.error}
								<div class="p-2 bg-destructive/10 text-destructive rounded">
									{nodeResult.error}
								</div>
							{/if}
							{#if nodeResult.tokens}
								<div class="flex gap-4 text-muted-foreground">
									<span>Prompt: {nodeResult.tokens.prompt}</span>
									<span>Completion: {nodeResult.tokens.completion}</span>
								</div>
							{/if}
						</div>
					</Collapsible.Content>
				</Collapsible.Root>
			{/each}
		</div>

		<!-- Output -->
		{#if result.outputs && Object.keys(result.outputs).length > 0}
			<div class="border-t p-3">
				<div class="text-xs text-muted-foreground mb-2">最终输出：</div>
				<pre class="p-2 bg-muted/50 rounded text-xs overflow-x-auto max-h-32">{formatJson(result.outputs)}</pre>
			</div>
		{/if}
	</div>
{/if}
