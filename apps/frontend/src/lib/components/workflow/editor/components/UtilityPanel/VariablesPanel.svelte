<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { workflowState, BUILTIN_INPUT_VARIABLES } from '../../contexts/index';
	import type { InputVariable } from '../../contexts/index';
	import type { VariableType } from '$lib/components/workflow/types/index';

	interface Props {
		addTrigger?: number;
	}

	let { addTrigger = 0 }: Props = $props();

	interface VariableTypeOption {
		value: VariableType;
		label: string;
		icon: string;
	}

	const variableTypes: VariableTypeOption[] = [
		{ value: 'string', label: '字符串', icon: 'mdi:format-text' },
		{ value: 'number', label: '数字', icon: 'mdi:numeric' },
		{ value: 'boolean', label: '布尔值', icon: 'mdi:checkbox-marked-outline' },
		{ value: 'object', label: '对象', icon: 'mdi:code-json' },
		{ value: 'array-string', label: '字符串数组', icon: 'mdi:code-array' },
		{ value: 'array-number', label: '数字数组', icon: 'mdi:code-array' },
		{ value: 'array-object', label: '对象数组', icon: 'mdi:code-array' },
		{ value: 'file', label: '文件', icon: 'mdi:file-outline' },
		{ value: 'file-list', label: '文件列表', icon: 'mdi:file-multiple-outline' },
	];

	// 用户自定义输入变量
	let userInputVariables = $derived(workflowState.inputVariables);
	// 所有输入变量（包括内置）
	let allInputVariables = $derived([...BUILTIN_INPUT_VARIABLES, ...userInputVariables]);

	// Modal 状态
	let dialogOpen = $state(false);
	let editingVariable = $state<InputVariable | null>(null);
	let formData = $state<Partial<InputVariable>>({
		name: '',
		label: '',
		type: 'string',
		description: '',
		required: false
	});

	// 表单验证
	let nameError = $derived.by(() => {
		if (!formData.name) return '变量名不能为空';
		if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.name)) return '变量名格式无效';
		if (workflowState.isInputVariableNameTaken(formData.name, editingVariable?.id)) return '变量名已存在';
		return null;
	});

	let isFormValid = $derived(!nameError && (formData.label?.trim().length ?? 0) > 0);

	// 监听 addTrigger 变化，打开添加对话框
	$effect(() => {
		if (addTrigger > 0) {
			openAddDialog();
		}
	});

	function generateUniqueName(): string {
		let index = 1;
		while (workflowState.isInputVariableNameTaken(`input_${index}`)) {
			index++;
		}
		return `input_${index}`;
	}

	function openAddDialog() {
		editingVariable = null;
		formData = { 
			name: generateUniqueName(),
			label: '',
			type: 'string', 
			description: '', 
			required: false 
		};
		dialogOpen = true;
	}

	function openEditDialog(variable: InputVariable) {
		editingVariable = variable;
		formData = { 
			name: variable.name,
			label: variable.label,
			type: variable.type as VariableType, 
			description: variable.description ?? '',
			required: variable.required ?? false
		};
		dialogOpen = true;
	}

	function handleSave() {
		if (!isFormValid || !formData.name || !formData.label) return;
		
		const variable: InputVariable = {
			id: editingVariable?.id ?? crypto.randomUUID(),
			name: formData.name.trim(),
			label: formData.label.trim(),
			type: formData.type ?? 'string',
			description: formData.description || undefined,
			required: formData.required ?? false
		};
		
		if (editingVariable) {
			workflowState.updateInputVariable(editingVariable.id, variable);
		} else {
			workflowState.addInputVariable(variable);
		}
		
		dialogOpen = false;
	}

	function handleRemove(id: string) {
		workflowState.removeInputVariable(id);
	}

	function getTypeOption(type: string): VariableTypeOption | undefined {
		return variableTypes.find(t => t.value === type);
	}

	function copyToClipboard(name: string) {
		navigator.clipboard.writeText(`{{input.${name}}}`);
		toast.success('已复制到剪贴板');
	}
</script>

<!-- 变量列表 -->
{#if allInputVariables.length === 0}
	<div class="text-center py-12 text-muted-foreground">
		<Icon icon="mdi:variable-box" class="w-12 h-12 mx-auto mb-3 opacity-30" />
		<p class="text-sm">暂无输入变量</p>
		<p class="text-xs mt-1">点击上方按钮添加</p>
	</div>
{:else}
	<div class="space-y-2">
		{#each allInputVariables as variable (variable.id)}
			{@const typeOption = getTypeOption(variable.type)}
			<div class="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
				<div class="flex items-center justify-between gap-2">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<Icon icon={typeOption?.icon ?? 'mdi:variable'} class="w-4 h-4 text-muted-foreground shrink-0" />
							<span class="font-medium text-sm truncate">{variable.label}</span>
							{#if variable.builtin}
								<Icon icon="mdi:lock" class="w-3 h-3 text-muted-foreground shrink-0" title="系统内置" />
							{/if}
							{#if variable.required}
								<span class="text-[10px] px-1.5 py-0.5 rounded bg-destructive/10 text-destructive shrink-0">必填</span>
							{/if}
						</div>
						<div class="flex items-center gap-2 mt-1">
							<span class="text-xs font-mono text-muted-foreground">input.{variable.name}</span>
							{#if variable.description}
								<span class="text-xs text-muted-foreground truncate">· {variable.description}</span>
							{/if}
						</div>
					</div>
					<div class="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
						<Button size="icon" variant="ghost" class="h-6 w-6" onclick={() => copyToClipboard(variable.name)} title="复制引用">
							<Icon icon="mdi:content-copy" class="w-3.5 h-3.5" />
						</Button>
						{#if !variable.builtin}
							<Button size="icon" variant="ghost" class="h-6 w-6" onclick={() => openEditDialog(variable)} title="编辑">
								<Icon icon="mdi:pencil-outline" class="w-3.5 h-3.5" />
							</Button>
							<Button size="icon" variant="ghost" class="h-6 w-6 text-destructive hover:text-destructive" onclick={() => handleRemove(variable.id)} title="删除">
								<Icon icon="mdi:delete-outline" class="w-3.5 h-3.5" />
							</Button>
						{/if}
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<!-- 添加/编辑 Modal -->
<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>{editingVariable ? '编辑输入变量' : '添加输入变量'}</Dialog.Title>
			<Dialog.Description>
				使用 <code class="px-1 py-0.5 bg-muted rounded text-xs">{`{{input.name}}`}</code> 引用
			</Dialog.Description>
		</Dialog.Header>
		
		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label for="var-label">显示名称 <span class="text-destructive">*</span></Label>
				<Input 
					id="var-label"
					bind:value={formData.label} 
					placeholder="字段显示名称"
				/>
			</div>

			<div class="space-y-2">
				<Label for="var-name">变量名 <span class="text-destructive">*</span></Label>
				<Input 
					id="var-name"
					bind:value={formData.name} 
					placeholder="variable_name"
					class="font-mono {nameError ? 'border-destructive' : ''}"
				/>
				{#if nameError}
					<p class="text-xs text-destructive">{nameError}</p>
				{:else}
					<p class="text-xs text-muted-foreground">引用方式：<code class="bg-muted px-1 rounded">input.{formData.name}</code></p>
				{/if}
			</div>
			
			<div class="space-y-2">
				<Label for="var-type">变量类型</Label>
				<Select.Root type="single" value={formData.type} onValueChange={(v) => formData.type = v as VariableType}>
					<Select.Trigger id="var-type">
						{@const opt = getTypeOption(formData.type ?? 'string')}
						<div class="flex items-center gap-2">
							<Icon icon={opt?.icon ?? 'mdi:variable'} class="w-4 h-4" />
							<span>{opt?.label ?? formData.type}</span>
						</div>
					</Select.Trigger>
					<Select.Content>
						{#each variableTypes as type}
							<Select.Item value={type.value}>
								<div class="flex items-center gap-2">
									<Icon icon={type.icon} class="w-4 h-4" />
									<span>{type.label}</span>
								</div>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			
			<div class="space-y-2">
				<Label for="var-desc">描述（可选）</Label>
				<Input 
					id="var-desc"
					bind:value={formData.description} 
					placeholder="变量描述"
				/>
			</div>

			<div class="flex items-center gap-2">
				<Checkbox 
					id="var-required"
					checked={formData.required}
					onCheckedChange={(v) => formData.required = v === true}
				/>
				<Label for="var-required" class="text-sm cursor-pointer">必填</Label>
			</div>
		</div>
		
		<Dialog.Footer>
			<Button variant="outline" onclick={() => dialogOpen = false}>取消</Button>
			<Button onclick={handleSave} disabled={!isFormValid}>
				{editingVariable ? '保存' : '添加'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
