<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { NodeRunData, NodeRunStatus } from '$lib/components/workflow/types/index';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';

	interface Props {
		runData: NodeRunData | undefined;
	}

	let { runData }: Props = $props();

	// 状态配置
	interface StatusConfig {
		label: string;
		bgClass: string;
		textClass: string;
		dotClass: string;
	}

	const statusConfigs: Record<NodeRunStatus, StatusConfig> = {
		idle: { label: '未运行', bgClass: 'bg-muted', textClass: 'text-muted-foreground', dotClass: 'bg-muted-foreground' },
		waiting: { label: '等待中', bgClass: 'bg-amber-500/10', textClass: 'text-amber-600', dotClass: 'bg-amber-500' },
		running: { label: '运行中', bgClass: 'bg-blue-500/10', textClass: 'text-blue-600', dotClass: 'bg-blue-500 animate-pulse' },
		success: { label: 'SUCCESS', bgClass: 'bg-green-500/10', textClass: 'text-green-600', dotClass: 'bg-green-500' },
		error: { label: 'FAILED', bgClass: 'bg-destructive/10', textClass: 'text-destructive', dotClass: 'bg-destructive' },
	};

	let status = $derived(runData?.status ?? 'idle');
	let config = $derived(statusConfigs[status]);
	let hasRun = $derived(status !== 'idle');

	// 格式化时间
	function formatElapsed(ms: number | undefined): string {
		if (ms === undefined) return '0.000s';
		return `${(ms / 1000).toFixed(3)}s`;
	}

	// 格式化日期时间
	function formatDateTime(timestamp: number | undefined): string {
		if (!timestamp) return 'N/A';
		const date = new Date(timestamp);
		return date.toLocaleString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	}

	// 格式化 Token
	function formatTokens(tokens: NodeRunData['tokens']): string {
		if (!tokens) return '0 Tokens';
		return `${tokens.total.toLocaleString()} Tokens`;
	}

	// 复制到剪贴板
	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		toast.success('已复制到剪贴板');
	}

	// JSON 格式化并生成带行号的高亮代码
	function formatJsonWithHighlight(data: unknown): { lines: string[]; raw: string } {
		if (data === undefined || data === null) return { lines: [], raw: '' };
		const raw = JSON.stringify(data, null, 2);
		const lines = raw.split('\n');
		return { lines, raw };
	}

	// 简单的 JSON 语法高亮
	function highlightJson(line: string): string {
		return line
			// 字符串键
			.replace(/"([^"]+)":/g, '<span class="text-foreground">"$1"</span>:')
			// 字符串值
			.replace(/: "([^"]*)"/g, ': <span class="text-red-500">"$1"</span>')
			// 数字
			.replace(/: (\d+\.?\d*)/g, ': <span class="text-orange-500">$1</span>')
			// 布尔和 null
			.replace(/: (true|false|null)/g, ': <span class="text-blue-500">$1</span>')
			// 空数组
			.replace(/\[\]/g, '<span class="text-muted-foreground">[]</span>');
	}

	let inputsData = $derived(formatJsonWithHighlight(runData?.inputs));
	let outputsData = $derived(formatJsonWithHighlight(runData?.outputs));
</script>

{#if !hasRun}
	<div class="py-12 text-center">
		<Icon icon="mdi:play-circle-outline" class="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
		<p class="text-sm text-muted-foreground">暂无运行记录</p>
		<p class="text-xs text-muted-foreground mt-1">点击运行按钮开始执行</p>
	</div>
{:else}
	<div class="space-y-4">
		<!-- 状态概览条 -->
		<div class="grid grid-cols-3 py-2 px-3 rounded-lg border border-border {config.bgClass}">
			<div>
				<div class="text-[10px] text-muted-foreground mb-0.5">状态</div>
				<div class="flex items-center gap-1">
					<span class="w-1.5 h-1.5 rounded-full {config.dotClass}"></span>
					<span class="text-xs font-medium {config.textClass}">{config.label}</span>
				</div>
			</div>
			<div class="text-center">
				<div class="text-[10px] text-muted-foreground mb-0.5">运行时间</div>
				<div class="text-xs font-medium text-foreground">{formatElapsed(runData?.elapsed)}</div>
			</div>
			<div class="text-center">
				<div class="text-[10px] text-muted-foreground mb-0.5">总 TOKEN 数</div>
				<div class="text-xs font-medium text-foreground">{formatTokens(runData?.tokens)}</div>
			</div>
		</div>

		<!-- 输入 -->
		{#if inputsData.lines.length > 0}
			<div class="border border-border rounded-lg overflow-hidden">
				<div class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
					<span class="text-xs font-medium">输入</span>
					<div class="flex items-center gap-1">
						<Button 
							variant="ghost" 
							size="icon" 
							class="h-6 w-6"
							onclick={() => copyToClipboard(inputsData.raw)}
						>
							<Icon icon="mdi:content-copy" width="14" height="14" />
						</Button>
						<Button variant="ghost" size="icon" class="h-6 w-6">
							<Icon icon="mdi:arrow-expand" width="14" height="14" />
						</Button>
					</div>
				</div>
				<div class="max-h-40 overflow-auto">
					<div class="flex text-[11px] font-mono leading-5">
						<!-- 行号 -->
						<div class="flex-shrink-0 py-1.5 px-2 bg-muted/20 text-muted-foreground text-right select-none border-r border-border">
							{#each inputsData.lines as _, i}
								<div>{i + 1}</div>
							{/each}
						</div>
						<!-- 代码 -->
						<div class="flex-1 py-1.5 px-3 overflow-x-auto">
							{#each inputsData.lines as line}
								<div class="whitespace-pre">{@html highlightJson(line)}</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- 输出 -->
		{#if outputsData.lines.length > 0}
			<div class="border border-border rounded-lg overflow-hidden">
				<div class="flex items-center justify-between px-3 py-1.5 bg-muted/30 border-b border-border">
					<span class="text-xs font-medium">输出</span>
					<div class="flex items-center gap-1">
						<Button 
							variant="ghost" 
							size="icon" 
							class="h-6 w-6"
							onclick={() => copyToClipboard(outputsData.raw)}
						>
							<Icon icon="mdi:content-copy" width="14" height="14" />
						</Button>
						<Button variant="ghost" size="icon" class="h-6 w-6">
							<Icon icon="mdi:arrow-expand" width="14" height="14" />
						</Button>
					</div>
				</div>
				<div class="max-h-40 overflow-auto">
					<div class="flex text-[11px] font-mono leading-5">
						<!-- 行号 -->
						<div class="flex-shrink-0 py-1.5 px-2 bg-muted/20 text-muted-foreground text-right select-none border-r border-border">
							{#each outputsData.lines as _, i}
								<div>{i + 1}</div>
							{/each}
						</div>
						<!-- 代码 -->
						<div class="flex-1 py-1.5 px-3 overflow-x-auto">
							{#each outputsData.lines as line}
								<div class="whitespace-pre">{@html highlightJson(line)}</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- 错误信息 -->
		{#if runData?.error}
			<div class="border border-destructive/30 rounded-lg overflow-hidden">
				<div class="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 border-b border-destructive/30">
					<Icon icon="mdi:alert-circle" width="14" height="14" class="text-destructive" />
					<span class="text-xs font-medium text-destructive">错误信息</span>
				</div>
				<div class="p-3">
					<pre class="text-xs font-mono text-destructive whitespace-pre-wrap break-all">{runData.error}</pre>
				</div>
			</div>
		{/if}

		<!-- 元数据 -->
		<div class="border border-border rounded-lg overflow-hidden">
			<div class="px-3 py-1.5 bg-muted/30 border-b border-border">
				<span class="text-xs font-medium">元数据</span>
			</div>
			<div class="p-3 space-y-1.5 text-xs">
				<div class="flex">
					<span class="w-20 text-muted-foreground shrink-0">状态</span>
					<span class="text-foreground font-medium">{config.label}</span>
				</div>
				<div class="flex">
					<span class="w-20 text-muted-foreground shrink-0">执行人</span>
					<span class="text-foreground">N/A</span>
				</div>
				<div class="flex">
					<span class="w-20 text-muted-foreground shrink-0">开始时间</span>
					<span class="text-foreground">{formatDateTime(runData?.startTime)}</span>
				</div>
				<div class="flex">
					<span class="w-20 text-muted-foreground shrink-0">运行时间</span>
					<span class="text-foreground">{formatElapsed(runData?.elapsed)}</span>
				</div>
				<div class="flex">
					<span class="w-20 text-muted-foreground shrink-0">总 token 数</span>
					<span class="text-foreground">{formatTokens(runData?.tokens)}</span>
				</div>
			</div>
		</div>
	</div>
{/if}
