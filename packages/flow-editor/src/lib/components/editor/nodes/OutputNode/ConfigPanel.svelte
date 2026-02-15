<script lang="ts">
	import type { OutputNodeData, OutputVariable } from './types.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { Input } from '@qiyu-allinai/ui/components/input';
	import { Button } from '@qiyu-allinai/ui/components/button';
	import VariableSelect from '$lib/components/editor/components/VariableSelector/VariableSelect.svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		nodeId: string;
		data: OutputNodeData;
	}

	let { nodeId }: Props = $props();

	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as OutputNodeData | undefined;
	});

	let variables = $derived(currentData?.variables ?? []);

	function updateField(field: string, value: unknown) {
		workflowState.updateNode(nodeId, { [field]: value });
	}

	function generateId(): string {
		return `var_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
	}

	function addVariable() {
		const newVariable: OutputVariable = {
			id: generateId(),
			name: '',
			value: '',
		};
		updateField('variables', [...variables, newVariable]);
	}

	function removeVariable(id: string) {
		updateField('variables', variables.filter((v) => v.id !== id));
	}

	function updateVariable(id: string, field: keyof OutputVariable, value: string) {
		updateField(
			'variables',
			variables.map((v) => (v.id === id ? { ...v, [field]: value } : v))
		);
	}
</script>

<div class="space-y-2">
	<div class="flex items-center justify-between">
		<span class="text-sm font-medium">
			输出变量 <span class="text-destructive">*</span>
		</span>
		<Button variant="ghost" size="icon" class="h-7 w-7" onclick={addVariable}>
			<Icon icon="mdi:plus" class="w-4 h-4" />
		</Button>
	</div>

	<div class="space-y-2">
		{#each variables as variable (variable.id)}
			<div class="flex items-center gap-2">
				<Input
					value={variable.name}
					oninput={(e) => updateVariable(variable.id, 'name', (e.target as HTMLInputElement).value)}
					placeholder="变量名"
					class="flex-1"
				/>
				<div class="flex-1">
					<VariableSelect
						value={variable.value}
						onValueChange={(v: string | undefined) => updateVariable(variable.id, 'value', v ?? '')}
						placeholder="设置变量值"
					/>
				</div>
				<Button
					variant="ghost"
					size="icon"
					class="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
					onclick={() => removeVariable(variable.id)}
				>
					<Icon icon="mdi:delete-outline" class="w-4 h-4" />
				</Button>
			</div>
		{:else}
			<div class="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md">
				暂无输出变量，点击 + 添加
			</div>
		{/each}
	</div>
</div>
