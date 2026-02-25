<script lang="ts">
	import { cn } from "$lib/utils.js";

	interface Props {
		ref?: HTMLSpanElement | null;
		class?: string;
		placeholder?: string;
		children?: import('svelte').Snippet;
	}

	let {
		ref = $bindable(null),
		class: className,
		placeholder = "",
		children,
	}: Props = $props();
</script>

<span
	bind:this={ref}
	data-slot="select-value"
	class={cn("pointer-events-none", className)}
>
	{#if children}
		{@render children()}
	{:else}
		{placeholder}
	{/if}
</span>
