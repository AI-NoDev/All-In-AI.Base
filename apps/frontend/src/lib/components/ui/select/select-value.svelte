<script lang="ts">
	import { Select as SelectPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		placeholder = "",
		...restProps
	}: SelectPrimitive.ValueProps & {
		placeholder?: string;
	} = $props();
</script>

<SelectPrimitive.Value
	bind:ref
	data-slot="select-value"
	class={cn("pointer-events-none", className)}
	{placeholder}
	{...restProps}
/>
