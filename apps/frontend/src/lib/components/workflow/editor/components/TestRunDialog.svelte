<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import Icon from '@iconify/svelte';
	import type { Variable } from '$lib/components/workflow/types/index';

	interface Props {
		open: boolean;
		variables: Variable[];
		onClose: () => void;
		onRun: (inputs: Record<string, unknown>) => void;
	}

	let { open, variables, onClose, onRun }: Props = $props();

	// 输入值状态
	let inputValues = $state<Record<string, string>>({});

	// 初始化输入值
	$effect(() => {
		if (open) {
			const initial: Record<string, string> = {};
			for (const v of variables) {
				initial[v.name] = String(v.default ?? '');
			}
			inputValues = initial;
		}
	});

	function handleRun() {
		// 转换输入值类型
		const inputs: Record<string, unknown> = {};
		for (const v of variables) {
			const value = inputValues[v.name] ?? '';
			switch (v.type) {
				case 'number':
					inputs[v.name] = Number(value) || 0;
					break;
				case 'boolean':
					inputs[v.name] = value === 'true' || value === '1';
					break;
				case 'array-string':
					inputs[v.name] = value.split('\n').filter(Boolean);
					break;
				case 'array-number':
					inputs[v.name] = value.split('\n').map(Number).filter(n => !isNaN(n));
					break;
				default:
					inputs[v.name] = value;
			}
		}
		onRun(inputs);
	}

	function getInputType(varType: string): string {
		switch (varType) {
			case 'number':
				return 'number';
			default:
				return 'text';
		}
	}

	function isTextarea(varType: string): boolean {
		return varType.startsWith('array-') || varType === 'object';
	}
</script>

<Dialog.Root bind:open onOpenChange={(v) => !v && onClose()}>
	<Dialog.Content class="max-w-lg">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<Icon icon="mdi:play-circle" class="w-5 h-5 text-primary" />
				测试运行
			</Dialog.Title>
			<Dialog.Description>
				请输入工作流的输入变量值
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
			{#if variables.length === 0}
				<div class="text-center text-muted-foreground py-8">
					<Icon icon="mdi:information-outline" class="w-8 h-8 mx-auto mb-2 opacity-50" />
					<p>此工作流没有定义输入变量</p>
					<p class="text-xs mt-1">将直接运行工作流</p>
				</div>
			{:else}
				{#each variables as variable (variable.id)}
					<div class="space-y-2">
						<Label for={variable.id} class="flex items-center gap-2">
							<span>{variable.name}</span>
							{#if variable.required}
								<span class="text-destructive">*</span>
							{/if}
							<span class="text-xs text-muted-foreground">({variable.type})</span>
						</Label>
						{#if variable.description}
							<p class="text-xs text-muted-foreground">{variable.description}</p>
						{/if}
						{#if isTextarea(variable.type)}
							<Textarea
								id={variable.id}
								bind:value={inputValues[variable.name]}
								placeholder={variable.type.startsWith('array-') ? '每行一个值' : '输入 JSON 对象'}
								rows={4}
							/>
						{:else}
							<Input
								id={variable.id}
								type={getInputType(variable.type)}
								bind:value={inputValues[variable.name]}
								placeholder={`输入 ${variable.name}`}
							/>
						{/if}
					</div>
				{/each}
			{/if}
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={onClose}>
				取消
			</Button>
			<Button onclick={handleRun}>
				<Icon icon="mdi:play" class="w-4 h-4 mr-1" />
				运行
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
