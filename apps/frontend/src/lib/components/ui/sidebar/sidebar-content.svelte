<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";
	import { ScrollArea } from "$lib/components/ui/scroll-area";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="sidebar-content"
	data-sidebar="content"
	class={cn(
		"flex min-h-0 flex-1 flex-col overflow-hidden group-data-[collapsible=icon]:overflow-hidden",
		className
	)}
	{...restProps}
>
	<ScrollArea class="h-full">
		<div class="flex flex-col gap-2">
			{@render children?.()}
		</div>
	</ScrollArea>
</div>
