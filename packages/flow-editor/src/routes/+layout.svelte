<script lang="ts">
	import './layout.css';
	import { TooltipProvider } from '$lib/components/ui/tooltip';

	const { children } = $props();
</script>

<TooltipProvider>
	{@render children()}
</TooltipProvider>
