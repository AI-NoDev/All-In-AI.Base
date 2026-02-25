<script lang="ts">
	import { getBezierPath, useConnection } from '@xyflow/svelte';

	const connection = useConnection();

	const path = $derived.by(() => {
		if (!connection.current.inProgress) return '';
		
		const [d] = getBezierPath({
			sourceX: connection.current.from.x,
			sourceY: connection.current.from.y,
			sourcePosition: connection.current.fromPosition,
			targetX: connection.current.to.x,
			targetY: connection.current.to.y,
			targetPosition: connection.current.toPosition
		});
		return d;
	});
</script>

{#if connection.current.inProgress}
	<g class="connection-line">
		<path
			d={path}
			fill="none"
			class="animated"
		/>
	</g>
{/if}

<style>
	.connection-line {
		pointer-events: none;
	}

	.connection-line path {
		stroke: var(--workflow-primary, hsl(var(--primary)));
		stroke-width: 2px;
	}

	.animated {
		stroke-dasharray: 5;
		animation: dashdraw 0.5s linear infinite;
	}

	@keyframes dashdraw {
		from {
			stroke-dashoffset: 10;
		}
	}
</style>
