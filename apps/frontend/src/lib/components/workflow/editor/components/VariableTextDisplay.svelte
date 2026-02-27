<script lang="ts">
	import Icon from '@iconify/svelte';
	import { parseContent } from './VariableTagEditor/types';

	interface Props {
		/** Text content with variable tags {{#xxx.xxx#}} */
		value: string;
		/** Custom class */
		class?: string;
	}

	let { value, class: className = '' }: Props = $props();

	// Parse content into segments
	let segments = $derived(parseContent(value));
</script>

<span class="variable-text-display {className}">
	{#each segments as segment}
		{#if segment.type === 'variable' && segment.path}
			<span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded bg-primary/10 text-primary text-xs font-mono whitespace-nowrap">
				<Icon icon="mdi:variable" class="w-3 h-3 flex-shrink-0" />
				<span>{segment.path}</span>
			</span>
		{:else}
			<span class="whitespace-pre-wrap">{segment.content}</span>
		{/if}
	{/each}
</span>
