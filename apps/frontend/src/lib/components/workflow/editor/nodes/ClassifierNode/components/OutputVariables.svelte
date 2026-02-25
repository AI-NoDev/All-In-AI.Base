<script lang="ts">
	import { BUILTIN_OUTPUT_VARIABLES } from '../types';
	import Icon from '@iconify/svelte';

	let isExpanded = $state(true);

	function getTypeColor(type: string): string {
		switch (type) {
			case 'string': return 'text-emerald-600 dark:text-emerald-400';
			case 'number': return 'text-blue-600 dark:text-blue-400';
			case 'boolean': return 'text-amber-600 dark:text-amber-400';
			case 'object': return 'text-rose-600 dark:text-rose-400';
			default: return 'text-muted-foreground';
		}
	}
</script>

<div class="space-y-2">
	<button 
		class="flex items-center gap-1 text-xs font-medium hover:text-foreground transition-colors w-full"
		onclick={() => isExpanded = !isExpanded}
	>
		<Icon icon={isExpanded ? "mdi:chevron-down" : "mdi:chevron-right"} class="w-4 h-4" />
		<span>输出变量</span>
	</button>

	{#if isExpanded}
		<div class="space-y-2 pl-5">
			{#each BUILTIN_OUTPUT_VARIABLES as variable}
				<div class="flex flex-col gap-0.5">
					<div class="flex items-center gap-2">
						<span class="font-mono text-sm font-medium">{variable.name}</span>
						<span class="{getTypeColor(variable.type)} text-xs">{variable.type}</span>
					</div>
					<span class="text-xs text-muted-foreground">{variable.description}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
