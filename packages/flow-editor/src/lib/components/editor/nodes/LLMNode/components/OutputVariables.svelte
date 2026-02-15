<script lang="ts">
	import { BUILTIN_OUTPUT_VARIABLES } from '../types.js';
	import type { RootSchema, Field } from '../schema-types.js';
	import type { UnionSchema, LiteralSchema, ObjectSchema, ArraySchema } from '@qiyu-allinai/zod-visual-editor';
	import { Button } from '@qiyu-allinai/ui/components/button';
	import { Switch } from '@qiyu-allinai/ui/components/switch';
	import * as Tooltip from '@qiyu-allinai/ui/components/tooltip';
	import Icon from '@iconify/svelte';

	interface Props {
		structuredOutput: boolean;
		outputSchema: RootSchema;
		onStructuredOutputChange: (value: boolean) => void;
		onOpenSchemaEditor: () => void;
	}

	let { structuredOutput, outputSchema, onStructuredOutputChange, onOpenSchemaEditor }: Props = $props();

	let hasStructuredOutputConfig = $derived(outputSchema.fields.length > 0);

	function formatSchemaType(field: Field): string {
		if (field.type === 'union') {
			const unionField = field as UnionSchema & { name: string };
			if (unionField.options && unionField.options.length > 0) {
				const optionTypes = unionField.options.map((opt: UnionSchema['options'][number]) => {
					if (opt.type === 'literal') {
						return JSON.stringify((opt as LiteralSchema).value);
					}
					if (opt.type === 'array') {
						return `${(opt as ArraySchema).item.type}[]`;
					}
					return opt.type;
				});
				return optionTypes.join(' | ');
			}
		}
		if (field.type === 'array') {
			return `${(field as ArraySchema & { name: string }).item.type}[]`;
		}
		return field.type;
	}

	function getSchemaTypeColor(type: string): string {
		switch (type) {
			case 'string': return 'text-emerald-600 dark:text-emerald-400';
			case 'number': return 'text-blue-600 dark:text-blue-400';
			case 'boolean': return 'text-amber-600 dark:text-amber-400';
			case 'object': return 'text-rose-600 dark:text-rose-400';
			case 'union': return 'text-purple-600 dark:text-purple-400';
			case 'literal': return 'text-cyan-600 dark:text-cyan-400';
			default: return 'text-muted-foreground';
		}
	}
</script>

{#snippet schemaFieldItem(field: Field, depth: number)}
	<div class="flex flex-col" style="padding-left: {depth * 12}px">
		<div class="flex items-center gap-1.5">
			<span class="font-mono text-foreground">{field.name}{field.optional ? '?' : ''}</span>
			<span class="{getSchemaTypeColor(field.type)}">{formatSchemaType(field)}</span>
			{#if !field.optional}
				<span class="text-destructive">*</span>
			{/if}
			{#if field.description}
				<span class="text-muted-foreground truncate max-w-[120px]" title={field.description}>{field.description}</span>
			{/if}
		</div>
		{#if field.type === 'object'}
			{@const objField = field as ObjectSchema & { name: string }}
			{#if objField.fields && objField.fields.length > 0}
				<div class="mt-1 space-y-1 border-l border-border/50 ml-1">
					{#each objField.fields as child (child.id)}
						{@render schemaFieldItem(child, depth + 1)}
					{/each}
				</div>
			{/if}
		{/if}
	</div>
{/snippet}

<div class="space-y-3">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-1">
			<span class="text-xs font-medium">输出变量</span>
			<span class="text-destructive text-xs">*</span>
		</div>
		<div class="flex items-center gap-1.5">
			{#if structuredOutput && !hasStructuredOutputConfig}
				<Icon icon="mdi:alert" class="w-3.5 h-3.5 text-amber-500" />
			{/if}
			<span class="text-xs text-muted-foreground">结构化输出</span>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<button {...props} class="text-muted-foreground hover:text-foreground">
							<Icon icon="mdi:help-circle-outline" class="w-3.5 h-3.5" />
						</button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>启用后输出将按照 JSON Schema 格式化</Tooltip.Content>
			</Tooltip.Root>
			<Switch 
				checked={structuredOutput}
				onCheckedChange={onStructuredOutputChange}
			/>
		</div>
	</div>

	<!-- 内置输出变量列表 -->
	<div class="space-y-2">
		{#each BUILTIN_OUTPUT_VARIABLES as variable}
			<div class="space-y-0.5">
				<div class="flex items-center gap-2">
					<span class="text-xs font-medium font-mono">{variable.name}</span>
					<span class="text-xs text-muted-foreground">{variable.type}</span>
				</div>
				<p class="text-xs text-muted-foreground">{variable.description}</p>
			</div>
		{/each}
	</div>

	<!-- 结构化输出配置 -->
	{#if structuredOutput}
		<div class="pt-2 border-t border-border">
			<div class="flex items-center justify-between mb-2">
				<div class="flex items-center gap-2">
					<span class="text-xs font-medium font-mono">structured_output</span>
					<span class="text-xs text-muted-foreground">object</span>
				</div>
				<Button 
					variant="outline" 
					size="sm" 
					class="h-7 text-xs"
					onclick={onOpenSchemaEditor}
				>
					<Icon icon="mdi:pencil" class="w-3.5 h-3.5 mr-1" />
					配置
				</Button>
			</div>
			{#if hasStructuredOutputConfig}
				<div class="p-2 bg-muted/30 rounded text-xs space-y-1.5">
					{#each outputSchema.fields as field (field.id)}
						{@render schemaFieldItem(field, 0)}
					{/each}
				</div>
			{:else}
				<div class="text-xs text-muted-foreground text-center py-3 border border-dashed rounded">
					结构化输出尚未配置
				</div>
			{/if}
		</div>
	{/if}
</div>
