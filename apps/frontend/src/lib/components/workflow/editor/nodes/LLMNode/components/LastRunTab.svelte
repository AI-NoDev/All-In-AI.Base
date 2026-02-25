<script lang="ts">
	import type { LLMRunResult } from '../types';
	import RunStatusBadge from '../../../components/RunStatusBadge.svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		lastRun: LLMRunResult | undefined;
	}

	let { lastRun }: Props = $props();

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
</script>

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

		<!-- Token 详情 -->
		{#if lastRun.tokenUsage}
			<div class="space-y-2">
				<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
					<Icon icon="mdi:chart-bar" class="w-4 h-4" />
					Token 详情
				</div>
				<div class="grid grid-cols-3 gap-2 text-xs">
					<div class="p-2 bg-muted/30 rounded text-center">
						<div class="text-muted-foreground">Prompt</div>
						<div class="font-semibold">{lastRun.tokenUsage.prompt.toLocaleString()}</div>
					</div>
					<div class="p-2 bg-muted/30 rounded text-center">
						<div class="text-muted-foreground">Completion</div>
						<div class="font-semibold">{lastRun.tokenUsage.completion.toLocaleString()}</div>
					</div>
					<div class="p-2 bg-muted/30 rounded text-center">
						<div class="text-muted-foreground">Total</div>
						<div class="font-semibold">{lastRun.tokenUsage.total.toLocaleString()}</div>
					</div>
				</div>
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
				<div class="p-2 bg-muted/30 rounded">
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
