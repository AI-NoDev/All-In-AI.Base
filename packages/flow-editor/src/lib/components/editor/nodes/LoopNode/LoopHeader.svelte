<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Avatar from "@qiyu-allinai/ui/components/avatar/index.js";
	import { LOOP_ICON } from './constants.js';

	interface Props {
		title: string;
		maxIterations: number;
		breakConditionsCount: number;
	}

	let { title, maxIterations, breakConditionsCount }: Props = $props();
</script>

<div class="flex items-center justify-between">
	<div class="flex items-center gap-3">
		<Avatar.Root class="rounded-lg bg-cyan-500 text-white h-8 w-8">
			<div class="flex items-center justify-center w-full h-full">
				<Icon icon={LOOP_ICON} width="18" height="18" />
			</div>
		</Avatar.Root>
		<div class="flex flex-col">
			<span class="text-sm font-semibold text-foreground tracking-tight">{title}</span>
			<span class="text-xs text-muted-foreground">
				最多 {maxIterations} 次
				{#if breakConditionsCount > 0}
					· {breakConditionsCount} 个终止条件
				{/if}
			</span>
		</div>
	</div>
</div>
