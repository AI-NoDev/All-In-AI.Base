<script lang="ts">
	import Icon from '@iconify/svelte';
	import { LOOP_COLOR } from './constants';

	interface Props {
		/** 绑定 DOM 引用 */
		ref?: HTMLDivElement;
	}

	let { ref = $bindable() }: Props = $props();
</script>

<div 
	bind:this={ref}
	class="loop-start-indicator" 
	title="循环开始"
>
	<Icon icon="mdi:location-enter" class="w-4 h-4 text-white" />
</div>

<style>
	.loop-start-indicator {
		position: absolute;
		left: 16px;
		top: 20px;
		width: 40px;
		height: 40px;
		border-radius: 10px;
		background: var(--loop-color, hsl(188 94% 43%));
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 8px hsl(188 94% 43% / 0.3);
		cursor: default;
	}
</style>
