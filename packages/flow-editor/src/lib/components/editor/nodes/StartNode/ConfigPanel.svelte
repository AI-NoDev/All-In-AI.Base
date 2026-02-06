<script lang="ts">
	import type { StartNodeData, InputField, InputFieldType, SelectOption } from './types.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import Icon from '@iconify/svelte';

	interface Props {
		nodeId: string;
		data: StartNodeData;
	}

	let { nodeId }: Props = $props();

	// 字段类型选项
	const fieldTypes: { value: InputFieldType; label: string; icon: string }[] = [
		{ value: 'text', label: '短文本', icon: 'mdi:format-text' },
		{ value: 'paragraph', label: '段落', icon: 'mdi:text-long' },
		{ value: 'number', label: '数字', icon: 'mdi:numeric' },
		{ value: 'select', label: '下拉选择', icon: 'mdi:form-dropdown' },
		{ value: 'file', label: '单文件', icon: 'mdi:file-outline' },
		{ value: 'files', label: '多文件', icon: 'mdi:file-multiple-outline' },
	];

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as StartNodeData | undefined;
	});

	let desc = $derived(currentData?.desc ?? '');
	let inputs = $derived(currentData?.inputs ?? []);

	// Modal 状态
	let isModalOpen = $state(false);
	let editingField = $state<InputField | null>(null);
	let isEditing = $derived(editingField !== null && inputs.some(f => f.id === editingField?.id));

	// 表单状态
	let formType = $state<InputFieldType>('text');
	let formLabel = $state('');
	let formVariable = $state('');
	let formPlaceholder = $state('');
	let formRequired = $state(false);
	let formMaxLength = $state<number | undefined>(undefined);
	let formOptions = $state<SelectOption[]>([]);
	let formAllowedFileTypes = $state('');
	let formMaxFiles = $state<number | undefined>(undefined);

	// 更新节点数据
	function updateDesc(e: Event) {
		const value = (e.target as HTMLTextAreaElement).value;
		workflowState.updateNode(nodeId, { desc: value });
	}

	// 生成唯一变量名
	function generateVariable(): string {
		const base = 'input';
		let index = 1;
		const existingVars = inputs.map(f => f.variable);
		while (existingVars.includes(`${base}_${index}`)) {
			index++;
		}
		return `${base}_${index}`;
	}

	// 重置表单
	function resetForm() {
		formType = 'text';
		formLabel = '';
		formVariable = generateVariable();
		formPlaceholder = '';
		formRequired = false;
		formMaxLength = undefined;
		formOptions = [];
		formAllowedFileTypes = '';
		formMaxFiles = undefined;
		editingField = null;
	}

	// 打开添加字段 Modal
	function openAddModal() {
		resetForm();
		isModalOpen = true;
	}

	// 打开编辑字段 Modal
	function openEditModal(field: InputField) {
		editingField = field;
		formType = field.type;
		formLabel = field.label;
		formVariable = field.variable;
		formPlaceholder = field.placeholder ?? '';
		formRequired = field.required;
		formMaxLength = field.maxLength;
		formOptions = field.options ? [...field.options] : [];
		formAllowedFileTypes = field.allowedFileTypes?.join(', ') ?? '';
		formMaxFiles = field.maxFiles;
		isModalOpen = true;
	}

	// 保存字段
	function saveField() {
		const field: InputField = {
			id: editingField?.id ?? crypto.randomUUID(),
			type: formType,
			label: formLabel || '未命名字段',
			variable: formVariable || generateVariable(),
			required: formRequired,
			placeholder: formPlaceholder || undefined,
			maxLength: (formType === 'text' || formType === 'paragraph') ? formMaxLength : undefined,
			options: formType === 'select' ? formOptions : undefined,
			allowedFileTypes: (formType === 'file' || formType === 'files') && formAllowedFileTypes 
				? formAllowedFileTypes.split(',').map(s => s.trim()).filter(Boolean) 
				: undefined,
			maxFiles: formType === 'files' ? formMaxFiles : undefined,
		};

		if (isEditing) {
			workflowState.updateNode(nodeId, {
				inputs: inputs.map(f => f.id === field.id ? field : f)
			});
		} else {
			workflowState.updateNode(nodeId, { inputs: [...inputs, field] });
		}

		isModalOpen = false;
		resetForm();
	}

	// 删除字段
	function removeField(fieldId: string) {
		workflowState.updateNode(nodeId, { 
			inputs: inputs.filter(f => f.id !== fieldId) 
		});
	}

	// 移动字段顺序
	function moveField(fieldId: string, direction: 'up' | 'down') {
		const index = inputs.findIndex(f => f.id === fieldId);
		if (index === -1) return;
		
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= inputs.length) return;
		
		const newInputs = [...inputs];
		[newInputs[index], newInputs[newIndex]] = [newInputs[newIndex], newInputs[index]];
		workflowState.updateNode(nodeId, { inputs: newInputs });
	}

	// 添加选项
	function addOption() {
		formOptions = [...formOptions, { value: `option_${formOptions.length + 1}`, label: `选项 ${formOptions.length + 1}` }];
	}

	// 删除选项
	function removeOption(index: number) {
		formOptions = formOptions.filter((_, i) => i !== index);
	}

	// 更新选项
	function updateOption(index: number, key: 'value' | 'label', value: string) {
		formOptions = formOptions.map((opt, i) => i === index ? { ...opt, [key]: value } : opt);
	}
</script>

<div class="space-y-4">
	<!-- 基本信息 -->
	<div class="space-y-3">
		<div class="space-y-1.5">
			<Label for="desc" class="text-xs">描述</Label>
			<Textarea 
				id="desc" 
				value={desc} 
				oninput={updateDesc}
				placeholder="输入节点描述"
				rows={2}
				class="text-sm resize-none"
			/>
		</div>
	</div>

	<!-- 输入字段 -->
	<div class="space-y-3 pt-3 border-t border-border">
		<div class="flex items-center justify-between">
			<Label class="text-xs font-medium">输入字段</Label>
			<Button variant="outline" size="sm" class="h-7 text-xs" onclick={openAddModal}>
				<Icon icon="mdi:plus" class="w-3.5 h-3.5 mr-1" />
				添加字段
			</Button>
		</div>

		{#if inputs.length === 0}
			<div class="py-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-md">
				暂无输入字段，点击上方按钮添加
			</div>
		{:else}
			<div class="space-y-1.5">
				{#each inputs as field, index (field.id)}
					<div class="flex items-center gap-2 p-2 border border-border rounded-md hover:bg-muted/30 transition-colors group">
						<Icon icon={fieldTypes.find(t => t.value === field.type)?.icon ?? 'mdi:form-textbox'} class="w-4 h-4 text-muted-foreground shrink-0" />
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-1.5">
								<span class="text-sm font-medium truncate">{field.label}</span>
								{#if field.required}
									<span class="text-xs text-destructive">*</span>
								{/if}
							</div>
							<span class="text-xs text-muted-foreground font-mono">{field.variable}</span>
						</div>
						<div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
							<Button 
								variant="ghost" 
								size="icon" 
								class="h-6 w-6" 
								disabled={index === 0}
								onclick={() => moveField(field.id, 'up')}
							>
								<Icon icon="mdi:arrow-up" class="w-3.5 h-3.5" />
							</Button>
							<Button 
								variant="ghost" 
								size="icon" 
								class="h-6 w-6" 
								disabled={index === inputs.length - 1}
								onclick={() => moveField(field.id, 'down')}
							>
								<Icon icon="mdi:arrow-down" class="w-3.5 h-3.5" />
							</Button>
							<Button variant="ghost" size="icon" class="h-6 w-6" onclick={() => openEditModal(field)}>
								<Icon icon="mdi:pencil" class="w-3.5 h-3.5" />
							</Button>
							<Button variant="ghost" size="icon" class="h-6 w-6 text-destructive hover:text-destructive" onclick={() => removeField(field.id)}>
								<Icon icon="mdi:delete-outline" class="w-3.5 h-3.5" />
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="pt-3 border-t border-border">
		<p class="text-xs text-muted-foreground">
			开始节点定义工作流的输入参数，运行时用户需要填写这些字段。
		</p>
	</div>
</div>

<!-- 添加/编辑字段 Modal -->
<Dialog.Root bind:open={isModalOpen}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title>{isEditing ? '编辑字段' : '添加字段'}</Dialog.Title>
			<Dialog.Description>
				{isEditing ? '修改输入字段的配置' : '配置新的输入字段'}
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<!-- 字段类型 -->
			<div class="space-y-1.5">
				<Label class="text-xs">字段类型</Label>
				<Select.Root 
					type="single"
					value={formType}
					onValueChange={(v) => v && (formType = v as InputFieldType)}
				>
					<Select.Trigger class="h-9">
						<div class="flex items-center gap-2">
							<Icon icon={fieldTypes.find(t => t.value === formType)?.icon ?? ''} class="w-4 h-4" />
							{fieldTypes.find(t => t.value === formType)?.label ?? '选择类型'}
						</div>
					</Select.Trigger>
					<Select.Content>
						{#each fieldTypes as ft}
							<Select.Item value={ft.value} label={ft.label}>
								<div class="flex items-center gap-2">
									<Icon icon={ft.icon} class="w-4 h-4" />
									{ft.label}
								</div>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<!-- 显示名称 -->
			<div class="space-y-1.5">
				<Label class="text-xs">显示名称</Label>
				<Input 
					bind:value={formLabel}
					placeholder="字段显示名称"
					class="h-9"
				/>
			</div>

			<!-- 变量名 -->
			<div class="space-y-1.5">
				<Label class="text-xs">变量名</Label>
				<Input 
					bind:value={formVariable}
					placeholder="变量名（英文）"
					class="h-9 font-mono"
				/>
			</div>

			<!-- 占位符 -->
			<div class="space-y-1.5">
				<Label class="text-xs">占位符</Label>
				<Input 
					bind:value={formPlaceholder}
					placeholder="输入提示文本"
					class="h-9"
				/>
			</div>

			<!-- 必填开关 -->
			<div class="flex items-center justify-between">
				<Label class="text-xs">必填</Label>
				<button
					type="button"
					aria-label="切换必填状态"
					class="w-9 h-5 rounded-full transition-colors {formRequired ? 'bg-primary' : 'bg-muted'}"
					onclick={() => formRequired = !formRequired}
				>
					<div class="w-4 h-4 rounded-full bg-white shadow transition-transform {formRequired ? 'translate-x-4' : 'translate-x-0.5'}"></div>
				</button>
			</div>

			<!-- 最大长度（text/paragraph） -->
			{#if formType === 'text' || formType === 'paragraph'}
				<div class="space-y-1.5">
					<Label class="text-xs">最大长度</Label>
					<Input 
						type="number"
						value={formMaxLength ?? ''}
						oninput={(e) => {
							const val = (e.target as HTMLInputElement).value;
							formMaxLength = val ? parseInt(val) : undefined;
						}}
						placeholder="不限制"
						class="h-9"
					/>
				</div>
			{/if}

			<!-- 选项列表（select） -->
			{#if formType === 'select'}
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<Label class="text-xs">选项列表</Label>
						<Button variant="ghost" size="sm" class="h-7 text-xs" onclick={addOption}>
							<Icon icon="mdi:plus" class="w-3 h-3 mr-1" />
							添加
						</Button>
					</div>
					{#if formOptions.length > 0}
						<div class="space-y-1.5 max-h-32 overflow-y-auto">
							{#each formOptions as option, optIndex}
								<div class="flex items-center gap-1.5">
									<Input 
										value={option.value}
										oninput={(e) => updateOption(optIndex, 'value', (e.target as HTMLInputElement).value)}
										placeholder="值"
										class="h-8 text-xs flex-1 font-mono"
									/>
									<Input 
										value={option.label}
										oninput={(e) => updateOption(optIndex, 'label', (e.target as HTMLInputElement).value)}
										placeholder="显示文本"
										class="h-8 text-xs flex-1"
									/>
									<Button variant="ghost" size="icon" class="h-8 w-8 shrink-0" onclick={() => removeOption(optIndex)}>
										<Icon icon="mdi:close" class="w-3.5 h-3.5" />
									</Button>
								</div>
							{/each}
						</div>
					{:else}
						<div class="text-xs text-muted-foreground py-3 text-center border border-dashed rounded">
							暂无选项，点击添加
						</div>
					{/if}
				</div>
			{/if}

			<!-- 文件类型限制（file/files） -->
			{#if formType === 'file' || formType === 'files'}
				<div class="space-y-1.5">
					<Label class="text-xs">允许的文件类型</Label>
					<Input 
						bind:value={formAllowedFileTypes}
						placeholder=".pdf, .docx, .txt"
						class="h-9"
					/>
				</div>
			{/if}

			<!-- 最大文件数（files） -->
			{#if formType === 'files'}
				<div class="space-y-1.5">
					<Label class="text-xs">最大文件数</Label>
					<Input 
						type="number"
						value={formMaxFiles ?? ''}
						oninput={(e) => {
							const val = (e.target as HTMLInputElement).value;
							formMaxFiles = val ? parseInt(val) : undefined;
						}}
						placeholder="不限制"
						class="h-9"
					/>
				</div>
			{/if}
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => isModalOpen = false}>取消</Button>
			<Button onclick={saveField}>{isEditing ? '保存' : '添加'}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
