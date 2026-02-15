<script lang="ts">
	import './layout.css';
	import { TooltipProvider } from '@qiyu-allinai/ui/components/tooltip';

	const { children } = $props();
</script>

<TooltipProvider>
	{@render children()}
</TooltipProvider>
