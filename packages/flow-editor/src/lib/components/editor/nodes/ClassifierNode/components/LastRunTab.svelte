<script lang="ts">
	import type { ClassifierRunResult } from '../types.js';
	import Icon from '@iconify/svelte';

	interface Props {
		lastRun: ClassifierRunResult | undefined;
	}

	let { lastRun }: Props = $props();

	function formatDuration(ms: number): string {
		if (ms < 1000) return `${ms}ms`;
		return `${(ms / 1000).toFixed(2)}s`;
	}

	function formatTime(isoString: string): string {
		return new Date(isoString).toLocaleString('zh-CN');
	}
</script>

{#if !lastRun || lastRun.status === 'idle'}
	<div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
		<Icon icon="mdi:play-circle-outline" class="w-12 h-12 mb-3 opacity-50" />
		<p class="text-sm">尚未运行</p>
		<p class="text-xs mt-1">运行工作流后可在此查看执行结果</p>
	</div>
{:else}
	<div class="space-y-4">
		<!-- 状态概览 -->
		<div class="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
			{#if lastRun.status === 'running'}
				<Icon icon="mdi:loading" class="w-5 h-5 text-blue-500 animate-spin" />
				<span class="text-sm font-medium">运行中...</span>
			{:else if lastRun.status === 'success'}
				<Icon icon="mdi:check-circle" class="w-5 h-5 text-green-500" />
				<span class="text-sm font-medium text-green-600 dark:text-green-400">运行成功</span>
			{:else if lastRun.status === 'failed'}
				<Icon icon="mdi:alert-circle" class="w-5 h-5 text-red-500" />
				<span class="text-sm font-medium text-red-600 dark:text-red-400">运行失败</span>
			{/if}
			
			{#if lastRun.duration}
				<span class="text-xs text-muted-foreground ml-auto">
					耗时: {formatDuration(lastRun.duration)}
				</span>
			{/if}
		</div>

		<!-- 时间信息 -->
		{#if lastRun.startedAt}
			<div class="text-xs text-muted-foreground">
				<span>开始时间: {formatTime(lastRun.startedAt)}</span>
			</div>
		{/if}

		<!-- Token 用量 -->
		{#if lastRun.tokenUsage}
			<div class="space-y-2">
				<span class="text-xs font-medium">Token 用量</span>
				<div class="grid grid-cols-3 gap-2 text-xs">
					<div class="p-2 rounded bg-muted/50">
						<div class="text-muted-foreground">输入</div>
						<div class="font-mono font-medium">{lastRun.tokenUsage.prompt}</div>
					</div>
					<div class="p-2 rounded bg-muted/50">
						<div class="text-muted-foreground">输出</div>
						<div class="font-mono font-medium">{lastRun.tokenUsage.completion}</div>
					</div>
					<div class="p-2 rounded bg-muted/50">
						<div class="text-muted-foreground">总计</div>
						<div class="font-mono font-medium">{lastRun.tokenUsage.total}</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- 输入 -->
		{#if lastRun.inputs}
			<div class="space-y-2">
				<span class="text-xs font-medium">输入</span>
				<pre class="p-2 rounded bg-muted/50 text-xs overflow-auto max-h-32">{JSON.stringify(lastRun.inputs, null, 2)}</pre>
			</div>
		{/if}

		<!-- 输出 -->
		{#if lastRun.outputs}
			<div class="space-y-2">
				<span class="text-xs font-medium">输出</span>
				<pre class="p-2 rounded bg-muted/50 text-xs overflow-auto max-h-32">{JSON.stringify(lastRun.outputs, null, 2)}</pre>
			</div>
		{/if}

		<!-- 错误信息 -->
		{#if lastRun.error}
			<div class="space-y-2">
				<span class="text-xs font-medium text-red-600 dark:text-red-400">错误信息</span>
				<pre class="p-2 rounded bg-red-50 dark:bg-red-950/30 text-xs text-red-600 dark:text-red-400 overflow-auto max-h-32">{lastRun.error}</pre>
			</div>
		{/if}
	</div>
{/if}
