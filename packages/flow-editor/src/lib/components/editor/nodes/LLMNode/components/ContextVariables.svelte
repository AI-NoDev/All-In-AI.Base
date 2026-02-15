<script lang="ts">
	import { VariableSelect, type Variable } from '../../../components/VariableSelector/index.js';
	import * as Tooltip from '@qiyu-allinai/ui/components/tooltip';
	import Icon from '@iconify/svelte';

	interface ContextItem {
		path: string;
		displayName?: string;
	}

	interface Props {
		context: ContextItem[];
		contextPaths: string[];
		allVariables: Variable[];
		onContextChange: (paths: string[]) => void;
		onRemoveVariable: (path: string) => void;
	}

	let { context, contextPaths, allVariables, onContextChange, onRemoveVariable }: Props = $props();

	function getVariableByPath(path: string): Variable | undefined {
		return allVariables.find(v => v.path === path);
	}

	function getTypeColor(type: string): string {
		switch (type) {
			case 'String': return 'text-emerald-600 dark:text-emerald-400';
			case 'Number': return 'text-blue-600 dark:text-blue-400';
			case 'Boolean': return 'text-amber-600 dark:text-amber-400';
			case 'Object': return 'text-rose-600 dark:text-rose-400';
			case 'File': return 'text-purple-600 dark:text-purple-400';
			case 'Array<File>': return 'text-purple-600 dark:text-purple-400';
			default: return 'text-muted-foreground';
		}
	}
</script>

<div class="space-y-2">
	<div class="flex items-center gap-1">
		<span class="text-xs font-medium">上下文</span>
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<button {...props} class="text-muted-foreground hover:text-foreground">
						<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
					</button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>引用其他节点的输出变量作为上下文</Tooltip.Content>
		</Tooltip.Root>
	</div>
	
	{#if context.length > 0}
		<div class="flex flex-wrap gap-1.5">
			{#each context as ctx (ctx.path)}
				{@const variable = getVariableByPath(ctx.path)}
				<div class="inline-flex items-center gap-1.5 px-2 py-1 bg-muted/50 border border-border rounded-md text-xs group">
					<Icon icon="mdi:variable" class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
					<span class="font-mono">{ctx.path}</span>
					<span class="{getTypeColor(variable?.type ?? 'String')}">{variable?.type ?? 'Unknown'}</span>
					<button 
						class="ml-0.5 opacity-60 hover:opacity-100 hover:text-destructive transition-opacity"
						onclick={() => onRemoveVariable(ctx.path)}
					>
						<Icon icon="mdi:close" class="w-3.5 h-3.5" />
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<VariableSelect 
		multiple
		value={contextPaths}
		onValueChange={onContextChange}
		placeholder="选择上下文变量"
	/>
</div>
