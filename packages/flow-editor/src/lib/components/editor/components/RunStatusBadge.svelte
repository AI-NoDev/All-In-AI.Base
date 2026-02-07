<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { RunStatus } from '../nodes/StartNode/types.js';

	interface Props {
		status: RunStatus;
		/** 显示大小 */
		size?: 'sm' | 'md';
	}

	let { status, size = 'sm' }: Props = $props();

	interface StatusConfig {
		icon: string;
		label: string;
		bgClass: string;
		textClass: string;
		iconClass: string;
	}

	const statusConfigs: Record<RunStatus, StatusConfig> = {
		idle: {
			icon: 'mdi:circle-outline',
			label: '未运行',
			bgClass: 'bg-muted',
			textClass: 'text-muted-foreground',
			iconClass: 'text-muted-foreground',
		},
		running: {
			icon: 'mdi:loading',
			label: '运行中',
			bgClass: 'bg-blue-500/10',
			textClass: 'text-blue-600',
			iconClass: 'text-blue-500 animate-spin',
		},
		success: {
			icon: 'mdi:check-circle',
			label: '成功',
			bgClass: 'bg-green-500/10',
			textClass: 'text-green-600',
			iconClass: 'text-green-500',
		},
		failed: {
			icon: 'mdi:close-circle',
			label: '失败',
			bgClass: 'bg-destructive/10',
			textClass: 'text-destructive',
			iconClass: 'text-destructive',
		},
	};

	let config = $derived(statusConfigs[status]);
	let sizeClasses = $derived(size === 'sm' 
		? 'h-5 px-1.5 text-[10px] gap-1' 
		: 'h-6 px-2 text-xs gap-1.5'
	);
	let iconSize = $derived(size === 'sm' ? 12 : 14);
</script>

<div class="inline-flex items-center rounded-full {config.bgClass} {config.textClass} {sizeClasses}">
	<Icon icon={config.icon} width={iconSize} height={iconSize} class={config.iconClass} />
	<span class="font-medium">{config.label}</span>
</div>
