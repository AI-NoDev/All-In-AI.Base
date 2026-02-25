<script lang="ts">
	import type { StartNodeData, InputField, InputFieldUIType, SelectOption } from './types';
	import { 
		BUILTIN_FIELDS, 
		UI_TYPE_CONFIG, 
		UI_TYPE_TO_VARIABLE_TYPE,
		createInputField,
		generateUniqueVariable,
		isValidVariableName,
		isVariableNameTaken
	} from './types';
	import { workflowState } from '$lib/components/workflow/editor/contexts/index';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Field from '$lib/components/ui/field';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import Icon from '@iconify/svelte';
	import NodeRunResult from '../../components/NodeRunResult.svelte';
	import SortableFieldItem from './SortableFieldItem.svelte';
	import { DndContext, type DragEndEvent } from '@dnd-kit-svelte/core';
	import { SortableContext, arrayMove } from '@dnd-kit-svelte/sortable';
	import { createSchema, type JsonSchema, JsonSchemaEditor } from '@qiyu-allinai/json-schema-editor';
	import JsonSchemaSheet from './JsonSchemaSheet.svelte';

	interface Props {
		nodeId: string;
		data: StartNodeData;
	}

	let { nodeId }: Props = $props();

	// 当前 tab
	let activeTab = $state('settings');

	// UI 类型选项列表
	const uiTypeOptions = Object.entries(UI_TYPE_CONFIG).map(([value, config]) => ({
		value: value as InputFieldUIType,
		...config
	}));

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as StartNodeData | undefined;
	});

	// 用户自定义字段
	let userInputs = $derived(currentData?.inputs ?? []);
	let allInputs = $derived([...BUILTIN_FIELDS, ...userInputs]);
	let runData = $derived(currentData?._run);

	// Modal 状态
	let isModalOpen = $state(false);
	let editingField = $state<InputField | null>(null);
	let isEditing = $derived(editingField !== null && userInputs.some(f => f.id === editingField?.id));

	// 表单状态
	let formUIType = $state<InputFieldUIType>('text');
	let formLabel = $state('');
	let formVariable = $state('');
	let formDescription = $state('');
	let formPlaceholder = $state('');
	let formRequired = $state(false);
	let formHidden = $state(false);
	let formMaxLength = $state<number | undefined>(undefined);
	let formMin = $state<number | undefined>(undefined);
	let formMax = $state<number | undefined>(undefined);
	let formStep = $state<number | undefined>(undefined);
	let formOptions = $state<SelectOption[]>([]);
	let formFileExtensions = $state('');
	let formMaxFiles = $state<number | undefined>(undefined);
	let formDefaultValue = $state<string>('');
	let formJsonSchema = $state<JsonSchema>(createSchema());
	let isJsonSchemaSheetOpen = $state(false);

	// 表单验证
	let variableError = $derived.by(() => {
		if (!formVariable) return '变量名不能为空';
		if (!isValidVariableName(formVariable)) return '变量名格式无效';
		if (isVariableNameTaken(formVariable, allInputs, editingField?.id)) return '变量名已存在';
		return null;
	});

	let isFormValid = $derived(!variableError && formLabel.trim().length > 0);

	// 重置表单
	function resetForm() {
		formUIType = 'text';
		formLabel = '';
		formVariable = generateUniqueVariable(allInputs);
		formDescription = '';
		formPlaceholder = '';
		formRequired = false;
		formHidden = false;
		formMaxLength = undefined;
		formMin = undefined;
		formMax = undefined;
		formStep = undefined;
		formOptions = [];
		formFileExtensions = '';
		formMaxFiles = undefined;
		formDefaultValue = '';
		formJsonSchema = createSchema();
		editingField = null;
	}

	function openAddModal() {
		resetForm();
		isModalOpen = true;
	}

	function openEditModal(field: InputField) {
		editingField = field;
		formUIType = field.uiType;
		formLabel = field.label;
		formVariable = field.variable;
		formDescription = field.description ?? '';
		formPlaceholder = field.placeholder ?? '';
		formRequired = field.required;
		formHidden = field.hidden ?? false;
		formMaxLength = field.maxLength;
		formMin = field.min;
		formMax = field.max;
		formStep = field.step;
		formOptions = field.options ? [...field.options] : [];
		formFileExtensions = field.fileConfig?.extensions?.join(', ') ?? '';
		formMaxFiles = field.maxFiles;
		formDefaultValue = field.defaultValue !== undefined ? String(field.defaultValue) : '';
		// Load JSON schema if available
		if (field.jsonSchema && typeof field.jsonSchema === 'object') {
			formJsonSchema = field.jsonSchema as JsonSchema;
		} else {
			formJsonSchema = createSchema();
		}
		isModalOpen = true;
	}

	function saveField() {
		if (!isFormValid) return;

		const extensions = formFileExtensions
			.split(',')
			.map(s => s.trim())
			.filter(Boolean)
			.map(s => s.startsWith('.') ? s : `.${s}`);

		let defaultValue: string | number | boolean | undefined;
		if (formDefaultValue) {
			if (formUIType === 'number') {
				defaultValue = parseFloat(formDefaultValue);
			} else if (formUIType === 'checkbox') {
				defaultValue = formDefaultValue === 'true';
			} else {
				defaultValue = formDefaultValue;
			}
		}

		// Get JSON schema if type is json and has properties
		const jsonSchema = formUIType === 'json' && formJsonSchema.properties.length > 0
			? formJsonSchema
			: undefined;

		const field = createInputField({
			id: editingField?.id,
			variable: formVariable,
			label: formLabel.trim(),
			uiType: formUIType,
			type: UI_TYPE_TO_VARIABLE_TYPE[formUIType],
			description: formDescription || undefined,
			placeholder: formPlaceholder || undefined,
			required: formHidden ? false : formRequired,
			hidden: formRequired ? false : formHidden,
			defaultValue,
			maxLength: (formUIType === 'text' || formUIType === 'textarea') ? formMaxLength : undefined,
			min: formUIType === 'number' ? formMin : undefined,
			max: formUIType === 'number' ? formMax : undefined,
			step: formUIType === 'number' ? formStep : undefined,
			options: formUIType === 'select' ? formOptions : undefined,
			fileConfig: (formUIType === 'file' || formUIType === 'files') && extensions.length > 0
				? { extensions }
				: undefined,
			maxFiles: formUIType === 'files' ? formMaxFiles : undefined,
			jsonSchema,
		});

		if (isEditing) {
			workflowState.updateNode(nodeId, {
				inputs: userInputs.map(f => f.id === field.id ? field : f)
			});
		} else {
			workflowState.updateNode(nodeId, { inputs: [...userInputs, field] });
		}

		isModalOpen = false;
		resetForm();
	}

	function removeField(fieldId: string) {
		workflowState.updateNode(nodeId, {
			inputs: userInputs.filter(f => f.id !== fieldId)
		});
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = userInputs.findIndex(f => f.id === active.id);
		const newIndex = userInputs.findIndex(f => f.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		const newInputs = arrayMove([...userInputs], oldIndex, newIndex);
		workflowState.updateNode(nodeId, { inputs: newInputs });
	}

	function addOption() {
		const index = formOptions.length + 1;
		formOptions = [...formOptions, { value: `option_${index}`, label: `选项 ${index}` }];
	}

	function removeOption(index: number) {
		formOptions = formOptions.filter((_, i) => i !== index);
	}

	function updateOption(index: number, key: 'value' | 'label', value: string) {
		formOptions = formOptions.map((opt, i) => i === index ? { ...opt, [key]: value } : opt);
	}

	function handleUITypeChange(newType: InputFieldUIType) {
		formUIType = newType;
		if (!isEditing && formVariable.startsWith('input_')) {
			formVariable = generateUniqueVariable(allInputs);
		}
	}
</script>


<Tabs.Root bind:value={activeTab} class="w-full">
	<Tabs.List class="w-full grid grid-cols-2 mb-4">
		<Tabs.Trigger value="settings">设置</Tabs.Trigger>
		<Tabs.Trigger value="lastRun">
			上次运行
			{#if runData && runData.status !== 'idle'}
				<span class="ml-1.5 w-2 h-2 rounded-full {runData.status === 'success' ? 'bg-green-500' : runData.status === 'error' ? 'bg-destructive' : 'bg-blue-500'}"></span>
			{/if}
		</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="settings" class="mt-0">
		<div class="space-y-4">
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<Field.Label class="text-xs font-medium">输入字段</Field.Label>
					<Button variant="outline" size="sm" class="h-7 text-xs" onclick={openAddModal}>
						<Icon icon="mdi:plus" class="w-3.5 h-3.5 mr-1" />
						添加字段
					</Button>
				</div>

				<div class="space-y-1.5">
					{#each BUILTIN_FIELDS as field (field.id)}
						<div class="flex items-center gap-2 p-2 border border-border rounded-md bg-muted/30 {field.hidden ? 'opacity-50' : ''}">
							<Icon icon={UI_TYPE_CONFIG[field.uiType].icon} class="w-4 h-4 text-muted-foreground shrink-0" />
							<div class="flex-1 min-w-0">
								<div class="flex items-center gap-1">
									<span class="text-sm font-medium truncate">{field.label}</span>
									<span title="系统内置字段">
										<Icon icon="mdi:lock" class="w-3 h-3 text-muted-foreground" />
									</span>
								</div>
								<span class="text-xs text-muted-foreground font-mono truncate block">{field.variable}</span>
							</div>
							<div class="flex items-center gap-1 shrink-0">
								<span class="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-muted rounded">{field.type}</span>
							</div>
						</div>
					{/each}

					{#if userInputs.length > 0}
						<DndContext onDragEnd={handleDragEnd}>
							<SortableContext items={userInputs}>
								{#each userInputs as field (field.id)}
									<SortableFieldItem
										{field}
										onEdit={openEditModal}
										onDelete={removeField}
									/>
								{/each}
							</SortableContext>
						</DndContext>
					{/if}
				</div>
			</div>

			<div class="pt-3 border-t border-border">
				<p class="text-xs text-muted-foreground">
					开始节点定义工作流的输入参数。运行时用户需要填写这些字段，字段值可在后续节点中通过变量名引用。
				</p>
			</div>
		</div>
	</Tabs.Content>

	<Tabs.Content value="lastRun" class="mt-0">
		<NodeRunResult runData={runData} />
	</Tabs.Content>
</Tabs.Root>

<Dialog.Root bind:open={isModalOpen}>
	<Dialog.Content class="max-w-2xl max-h-[85vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>{isEditing ? '编辑字段' : '添加字段'}</Dialog.Title>
			<Dialog.Description>
				{isEditing ? '修改输入字段的配置' : '配置新的输入字段'}
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<!-- 两列布局：基本信息 -->
			<div class="grid grid-cols-2 gap-4">
				<Field.Field>
					<Field.Label class="text-xs">字段类型</Field.Label>
					<Field.Content>
						<Select.Root
							type="single"
							value={formUIType}
							onValueChange={(v) => v && handleUITypeChange(v as InputFieldUIType)}
						>
							<Select.Trigger class="h-9 w-full">
								<div class="flex items-center justify-between w-full">
									<div class="flex items-center gap-2">
										<Icon icon={UI_TYPE_CONFIG[formUIType].icon} class="w-4 h-4" />
										<span>{UI_TYPE_CONFIG[formUIType].label}</span>
									</div>
									<span class="text-xs text-muted-foreground font-mono">{UI_TYPE_CONFIG[formUIType].dataType}</span>
								</div>
							</Select.Trigger>
							<Select.Content class="w-[var(--bits-floating-anchor-width)]">
								{#each uiTypeOptions as opt}
									<Select.Item value={opt.value} label={opt.label}>
										<div class="flex items-center justify-between w-full">
											<div class="flex items-center gap-2">
												<Icon icon={opt.icon} class="w-4 h-4" />
												<span>{opt.label}</span>
											</div>
											<span class="text-xs text-muted-foreground font-mono">{opt.dataType}</span>
										</div>
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</Field.Content>
				</Field.Field>

				<Field.Field>
					<Field.Label class="text-xs">显示名称 <span class="text-destructive">*</span></Field.Label>
					<Field.Content>
						<Input bind:value={formLabel} placeholder="字段显示名称" class="h-9" />
					</Field.Content>
				</Field.Field>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<Field.Field>
					<Field.Label class="text-xs">变量名 <span class="text-destructive">*</span></Field.Label>
					<Field.Content>
						<Input
							bind:value={formVariable}
							placeholder="变量名（英文）"
							class="h-9 font-mono {variableError ? 'border-destructive' : ''}"
						/>
					</Field.Content>
					{#if variableError}
						<Field.Description class="text-xs text-destructive">{variableError}</Field.Description>
					{:else}
						<Field.Description class="text-xs">引用方式：<code class="bg-muted px-1 rounded">start.{formVariable}</code></Field.Description>
					{/if}
				</Field.Field>

				<Field.Field>
					<Field.Label class="text-xs">默认值</Field.Label>
					<Field.Content>
						{#if formUIType === 'checkbox'}
							<Select.Root type="single" value={formDefaultValue} onValueChange={(v) => formDefaultValue = v ?? ''}>
								<Select.Trigger class="h-9 w-full">
									<span>{formDefaultValue === 'true' ? '是' : formDefaultValue === 'false' ? '否' : '无'}</span>
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="" label="无">无</Select.Item>
									<Select.Item value="true" label="是">是</Select.Item>
									<Select.Item value="false" label="否">否</Select.Item>
								</Select.Content>
							</Select.Root>
						{:else if formUIType === 'number'}
							<Input type="number" bind:value={formDefaultValue} placeholder="默认数值" class="h-9" />
						{:else if formUIType === 'select' && formOptions.length > 0}
							<Select.Root type="single" value={formDefaultValue} onValueChange={(v) => formDefaultValue = v ?? ''}>
								<Select.Trigger class="h-9 w-full">
									<span>{formOptions.find(o => o.value === formDefaultValue)?.label ?? '选择默认值'}</span>
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="" label="无">无</Select.Item>
									{#each formOptions as opt}
										<Select.Item value={opt.value} label={opt.label}>{opt.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{:else}
							<Input bind:value={formDefaultValue} placeholder="默认值" class="h-9" />
						{/if}
					</Field.Content>
				</Field.Field>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<Field.Field>
					<Field.Label class="text-xs">占位符</Field.Label>
					<Field.Content>
						<Input bind:value={formPlaceholder} placeholder="输入提示文本" class="h-9" />
					</Field.Content>
				</Field.Field>

				<div class="flex items-end gap-6 pb-2">
					<div class="flex items-center gap-2">
						<Checkbox
							checked={formRequired}
							id="required"
							disabled={formHidden}
							onCheckedChange={(v) => { formRequired = !!v; if (v) formHidden = false; }}
						/>
						<label for="required" class="text-xs cursor-pointer leading-none {formHidden ? 'text-muted-foreground' : ''}">必填</label>
					</div>
					<div class="flex items-center gap-2">
						<Checkbox
							checked={formHidden}
							id="hidden"
							disabled={formRequired}
							onCheckedChange={(v) => { formHidden = !!v; if (v) formRequired = false; }}
						/>
						<label for="hidden" class="text-xs cursor-pointer leading-none {formRequired ? 'text-muted-foreground' : ''}">隐藏</label>
					</div>
				</div>
			</div>

			<Field.Field>
				<Field.Label class="text-xs">描述</Field.Label>
				<Field.Content>
					<Textarea bind:value={formDescription} placeholder="字段描述（可选）" class="min-h-[60px] text-sm" />
				</Field.Content>
			</Field.Field>

			{#if formUIType === 'textarea'}
				<Field.Field>
					<Field.Label class="text-xs">默认值</Field.Label>
					<Field.Content>
						<Textarea bind:value={formDefaultValue} placeholder="默认文本" class="min-h-[60px] text-sm" />
					</Field.Content>
				</Field.Field>
			{/if}

			{#if formUIType === 'text' || formUIType === 'textarea'}
				<Field.Field>
					<Field.Label class="text-xs">最大长度</Field.Label>
					<Field.Content>
						<Input
							type="number"
							value={formMaxLength ?? ''}
							oninput={(e) => {
								const val = (e.target as HTMLInputElement).value;
								formMaxLength = val ? parseInt(val) : undefined;
							}}
							placeholder="不限制"
							class="h-9 max-w-[200px]"
						/>
					</Field.Content>
				</Field.Field>
			{/if}

			{#if formUIType === 'number'}
				<div class="grid grid-cols-3 gap-4">
					<Field.Field>
						<Field.Label class="text-xs">最小值</Field.Label>
						<Field.Content>
							<Input
								type="number"
								value={formMin ?? ''}
								oninput={(e) => {
									const val = (e.target as HTMLInputElement).value;
									formMin = val ? parseFloat(val) : undefined;
								}}
								placeholder="无"
								class="h-9"
							/>
						</Field.Content>
					</Field.Field>
					<Field.Field>
						<Field.Label class="text-xs">最大值</Field.Label>
						<Field.Content>
							<Input
								type="number"
								value={formMax ?? ''}
								oninput={(e) => {
									const val = (e.target as HTMLInputElement).value;
									formMax = val ? parseFloat(val) : undefined;
								}}
								placeholder="无"
								class="h-9"
							/>
						</Field.Content>
					</Field.Field>
					<Field.Field>
						<Field.Label class="text-xs">步进</Field.Label>
						<Field.Content>
							<Input
								type="number"
								value={formStep ?? ''}
								oninput={(e) => {
									const val = (e.target as HTMLInputElement).value;
									formStep = val ? parseFloat(val) : undefined;
								}}
								placeholder="1"
								class="h-9"
							/>
						</Field.Content>
					</Field.Field>
				</div>
			{/if}

			{#if formUIType === 'select'}
				<Field.Field>
					<Field.Group class="flex items-center justify-between">
						<Field.Label class="text-xs">选项列表</Field.Label>
						<Button variant="ghost" size="sm" class="h-7 text-xs" onclick={addOption}>
							<Icon icon="mdi:plus" class="w-3 h-3 mr-1" />
							添加
						</Button>
					</Field.Group>
					<Field.Content>
						{#if formOptions.length > 0}
							<div class="space-y-1.5 max-h-40 overflow-y-auto">
								{#each formOptions as option, optIndex}
									<div class="flex items-center gap-2">
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
					</Field.Content>
				</Field.Field>
			{/if}

			{#if formUIType === 'file' || formUIType === 'files'}
				<div class="grid grid-cols-2 gap-4">
					<Field.Field>
						<Field.Label class="text-xs">允许的文件类型</Field.Label>
						<Field.Content>
							<Input bind:value={formFileExtensions} placeholder=".pdf, .docx, .txt" class="h-9" />
						</Field.Content>
						<Field.Description class="text-xs">多个扩展名用逗号分隔，留空表示不限制</Field.Description>
					</Field.Field>

					{#if formUIType === 'files'}
						<Field.Field>
							<Field.Label class="text-xs">最大文件数</Field.Label>
							<Field.Content>
								<Input
									type="number"
									value={formMaxFiles ?? ''}
									oninput={(e) => {
										const val = (e.target as HTMLInputElement).value;
										formMaxFiles = val ? parseInt(val) : undefined;
									}}
									placeholder="不限制"
									class="h-9"
									min="1"
								/>
							</Field.Content>
						</Field.Field>
					{/if}
				</div>
			{/if}

			{#if formUIType === 'json'}
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<span class="text-xs font-medium">JSON Schema</span>
						<Button
							variant="ghost"
							size="sm"
							class="h-7 text-xs"
							onclick={() => isJsonSchemaSheetOpen = true}
						>
							<Icon icon="mdi:pencil" class="w-3.5 h-3.5 mr-1" />
							编辑
						</Button>
					</div>
					{#if formJsonSchema.properties.length > 0}
						<div class="border border-border rounded-md p-2 bg-muted/20">
							<JsonSchemaEditor 
								schema={formJsonSchema}
								locale="zh"
								readonly={true}
							/>
						</div>
					{:else}
						<button
							type="button"
							class="w-full flex flex-col items-center justify-center py-6 border border-dashed border-border rounded-md text-muted-foreground hover:border-primary hover:text-primary transition-colors"
							onclick={() => isJsonSchemaSheetOpen = true}
						>
							<Icon icon="mdi:code-json" class="w-8 h-8 opacity-50 mb-2" />
							<span class="text-sm">点击配置 JSON Schema</span>
						</button>
					{/if}
					<p class="text-xs text-muted-foreground">定义 JSON 结构的 Schema，用于验证和编辑器提示</p>
				</div>
			{/if}
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => isModalOpen = false}>取消</Button>
			<Button onclick={saveField} disabled={!isFormValid}>{isEditing ? '保存' : '添加'}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<JsonSchemaSheet
	bind:open={isJsonSchemaSheetOpen}
	schema={formJsonSchema}
	onOpenChange={(open) => isJsonSchemaSheetOpen = open}
	onSave={(schema) => formJsonSchema = schema}
/>
