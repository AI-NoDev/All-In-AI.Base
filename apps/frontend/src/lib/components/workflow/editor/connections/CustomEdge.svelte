<script lang="ts">
	import { getBezierPath, type EdgeProps } from '@xyflow/svelte';
	import { mode } from 'mode-watcher';

	let {
		id,
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		markerEnd,
		selected
	}: EdgeProps = $props();

	const [edgePath] = $derived(
		getBezierPath({
			sourceX,
			sourceY,
			sourcePosition,
			targetX,
			targetY,
			targetPosition
		})
	);

	// 根据主题和选中状态计算边的颜色
	// 暗色模式使用更亮的颜色以确保可见性
	const edgeColor = $derived(
		selected
			? 'var(--workflow-primary, hsl(var(--primary)))'
			: mode.current === 'dark'
				? 'hsl(220 10% 60%)' // 暗色模式 - 亮灰蓝色
				: 'hsl(220 10% 50%)' // 亮色模式 - 中灰蓝色
	);
	
	const hoverColor = $derived(
		mode.current === 'dark'
			? 'hsl(220 10% 75%)' // 暗色模式悬停 - 更亮
			: 'hsl(220 10% 35%)' // 亮色模式悬停 - 更暗
	);
</script>

<g class="custom-edge" style="--edge-color: {edgeColor}; --edge-hover-color: {hoverColor};">
	<path
		{id}
		class="edge-path"
		class:selected
		d={edgePath}
		fill="none"
		marker-end={markerEnd}
	/>
	<!-- 透明的宽路径用于更容易的悬停检测 -->
	<path
		class="edge-interaction"
		d={edgePath}
		fill="none"
		stroke="transparent"
		stroke-width="20"
	/>
</g>

<style>
	.custom-edge .edge-path {
		stroke: var(--edge-color);
		stroke-width: 2px;
		transition: stroke 0.15s ease;
	}
	
	.custom-edge:hover .edge-path {
		stroke: var(--edge-hover-color);
	}
	
	.custom-edge .edge-path.selected {
		stroke: var(--workflow-primary, hsl(var(--primary)));
	}
</style>
