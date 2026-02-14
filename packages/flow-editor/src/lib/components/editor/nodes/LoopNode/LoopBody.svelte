<script lang="ts">
	import LoopStartIndicator from './LoopStartIndicator.svelte';

	interface Props {
		/** 子节点数量 */
		childNodeCount: number;
		/** 绑定 indicator DOM 引用 */
		indicatorRef?: HTMLDivElement;
	}

	let { childNodeCount, indicatorRef = $bindable() }: Props = $props();
</script>

<div class="loop-body flex-1">
	<!-- 循环开始标识 -->
	<LoopStartIndicator bind:ref={indicatorRef} />

	<!-- 空状态提示 -->
	{#if childNodeCount === 0}
		<div class="empty-hint">
			<p class="text-sm text-muted-foreground/50">点击引脚添加节点</p>
		</div>
	{/if}
</div>

<style>
	.loop-body {
		position: relative;
		margin-top: 12px;
		border: 1px dashed hsl(var(--border));
		border-radius: 6px;
		background: hsl(var(--muted) / 0.3);
	}

	.empty-hint {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		pointer-events: none;
	}
</style>
