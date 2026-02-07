<script lang="ts">
	import type { StartNodeData, InputField, InputFieldType, SelectOption } from './types.js';
	import { BUILTIN_USER_FILES_FIELD, FIELD_TYPE_DATA_TYPES } from './types.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Field from '$lib/components/ui/field';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import Icon from '@iconify/svelte';
	import RunStatusBadge from '../../components/RunStatusBadge.svelte';
	import SortableFieldItem from './SortableFieldItem.svelte';
	import { DndContext, type DragEndEvent } from '@dnd-kit-svelte/core';
	import { SortableContext, arrayMove } from '@dnd-kit-svelte/sortable';

	interface Props {
		nodeId: string;
		data: StartNodeData;
	}

	let { nodeId }: Props = $props();

	// 当前 tab
	let activeTab = $state('settings');

	// 字段类型选项
	const fieldTypes: { value: InputFieldType; label: string; icon: string }[] = [
		{ value: 'text', label: '文本', icon: 'mdi:format-text' },
		{ value: 'paragraph', label: '段落', icon: 'mdi:text-long' },
		{ value: 'select', label: '下拉选项', icon: 'mdi:form-dropdown' },
		{ value: 'number', label: '数字', icon: 'mdi:numeric' },
		{ value: 'checkbox', label: '复选框', icon: 'mdi:checkbox-marked-outline' },
		{ value: 'file', label: '单文件', icon: 'mdi:file-outline' },
		{ value: 'files', label: '文件列表', icon: 'mdi:file-multiple-outline' },
		{ value: 'json', label: 'JSON', icon: 'mdi:code-json' },
	];

	// 响应式获取当前节点数据
	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as StartNodeData | undefined;
	});

	// 用户自定义字段
	let inputs = $derived(currentData?.inputs ?? []);
	let lastRun = $derived(currentData?.lastRun);

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
	let formHidden = $state(false);
	let formMaxLength = $state<number | undefined>(undefined);
	let formOptions = $state<SelectOption[]>([]);
	let formAllowedFileTypes = $state('');
	let formMaxFiles = $state<number | undefined>(undefined);

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
		formHidden = false;
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
		formHidden = field.hidden ?? false;
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
			required: formHidden ? false : formRequired,
			hidden: formRequired ? false : formHidden,
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

	// 拖拽结束处理
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = inputs.findIndex(f => f.id === active.id);
		const newIndex = inputs.findIndex(f => f.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		const newInputs = arrayMove([...inputs], oldIndex, newIndex);
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

	// 格式化时间
	function formatDuration(ms: number): string {
		if (ms < 1000) return `${ms}ms`;
		if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
		return `${(ms / 60000).toFixed(2)}min`;
	}

	// 格式化日期时间
	function formatDateTime(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleString('zh-CN', {
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	}
</script>

<Tabs.Root bind:value={activeTab} class="w-full">
	<Tabs.List class="w-full grid grid-cols-2 mb-4">
		<Tabs.Trigger value="settings">设置</Tabs.Trigger>
		<Tabs.Trigger value="lastRun">
			上次运行
			{#if lastRun && lastRun.status !== 'idle'}
				<span class="ml-1.5">
					<RunStatusBadge status={lastRun.status} size="sm" />
				</span>
			{/if}
		</Tabs.Trigger>
	</Tabs.List>

	<!-- 设置 Tab -->
	<Tabs.Content value="settings" class="mt-0">
		<div class="space-y-4">
			<!-- 输入字段 -->
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<Field.Label class="text-xs font-medium">输入字段</Field.Label>
					<Button variant="outline" size="sm" class="h-7 text-xs" onclick={openAddModal}>
						<Icon icon="mdi:plus" class="w-3.5 h-3.5 mr-1" />
						添加字段
					</Button>
				</div>

				<div class="space-y-1.5">
					<!-- 内置字段（不可排序） -->
					<div class="flex items-center gap-2 p-2 border border-border rounded-md bg-muted/30 {BUILTIN_USER_FILES_FIELD.hidden ? 'opacity-50' : ''}">
						<Icon icon={fieldTypes.find(t => t.value === BUILTIN_USER_FILES_FIELD.type)?.icon ?? 'mdi:form-textbox'} class="w-4 h-4 text-muted-foreground shrink-0" />
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-1">
								<span class="text-sm font-medium truncate">{BUILTIN_USER_FILES_FIELD.label}</span>
								<Icon icon="mdi:lock" class="w-3 h-3 text-muted-foreground" />
							</div>
							<span class="text-xs text-muted-foreground font-mono truncate block">{BUILTIN_USER_FILES_FIELD.variable}</span>
						</div>
						<div class="w-px h-8 bg-border shrink-0"></div>
						<div class="flex items-center gap-1 shrink-0 min-w-[72px] justify-end">
							<span class="text-[10px] text-muted-foreground px-1.5 py-0.5 bg-muted rounded">多文件</span>
						</div>
					</div>

					<!-- 可排序的用户自定义字段 -->
					{#if inputs.length > 0}
						<DndContext onDragEnd={handleDragEnd}>
							<SortableContext items={inputs}>
								{#each inputs as field (field.id)}
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
					开始节点定义工作流的输入参数，运行时用户需要填写这些字段。
				</p>
			</div>
		</div>
	</Tabs.Content>

	<!-- 上次运行 Tab -->
	<Tabs.Content value="lastRun" class="mt-0">
		{#if !lastRun || lastRun.status === 'idle'}
			<div class="py-12 text-center">
				<Icon icon="mdi:play-circle-outline" class="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
				<p class="text-sm text-muted-foreground">暂无运行记录</p>
				<p class="text-xs text-muted-foreground mt-1">点击运行按钮开始执行工作流</p>
			</div>
		{:else}
			<div class="space-y-4">
				<!-- 运行状态概览 -->
				<div class="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
					<div class="flex items-center gap-3">
						<RunStatusBadge status={lastRun.status} size="md" />
						{#if lastRun.startedAt}
							<span class="text-xs text-muted-foreground">
								{formatDateTime(lastRun.startedAt)}
							</span>
						{/if}
					</div>
				</div>

				<!-- 运行统计 -->
				{#if lastRun.duration !== undefined || lastRun.tokenUsage !== undefined}
					<div class="grid grid-cols-2 gap-3">
						{#if lastRun.duration !== undefined}
							<div class="p-3 border border-border rounded-lg">
								<div class="flex items-center gap-2 text-muted-foreground mb-1">
									<Icon icon="mdi:timer-outline" class="w-4 h-4" />
									<span class="text-xs">运行时间</span>
								</div>
								<span class="text-sm font-semibold">{formatDuration(lastRun.duration)}</span>
							</div>
						{/if}
						{#if lastRun.tokenUsage !== undefined}
							<div class="p-3 border border-border rounded-lg">
								<div class="flex items-center gap-2 text-muted-foreground mb-1">
									<Icon icon="mdi:chip" class="w-4 h-4" />
									<span class="text-xs">Token 消耗</span>
								</div>
								<span class="text-sm font-semibold">{lastRun.tokenUsage.toLocaleString()}</span>
							</div>
						{/if}
					</div>
				{/if}

				<!-- 输入参数 -->
				{#if lastRun.inputs && lastRun.inputs.length > 0}
					<div class="space-y-2">
						<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<Icon icon="mdi:import" class="w-4 h-4" />
							输入参数
						</div>
						<div class="space-y-1.5">
							{#each lastRun.inputs as input}
								<div class="p-2 bg-muted/30 rounded text-xs">
									<span class="font-mono text-muted-foreground">{input.variable}</span>
									<div class="mt-1 text-foreground break-all">
										{typeof input.value === 'object' ? JSON.stringify(input.value) : String(input.value)}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- 输出结果 -->
				{#if lastRun.outputs && Object.keys(lastRun.outputs).length > 0}
					<div class="space-y-2">
						<div class="flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<Icon icon="mdi:export" class="w-4 h-4" />
							输出结果
						</div>
						<div class="p-2 bg-muted/30 rounded">
							<pre class="text-xs text-foreground whitespace-pre-wrap break-all">{JSON.stringify(lastRun.outputs, null, 2)}</pre>
						</div>
					</div>
				{/if}

				<!-- 错误信息 -->
				{#if lastRun.error}
					<div class="space-y-2">
						<div class="flex items-center gap-2 text-xs font-medium text-destructive">
							<Icon icon="mdi:alert-circle" class="w-4 h-4" />
							错误信息
						</div>
						<div class="p-2 bg-destructive/10 border border-destructive/20 rounded">
							<pre class="text-xs text-destructive whitespace-pre-wrap break-all">{lastRun.error}</pre>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</Tabs.Content>
</Tabs.Root>

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
			<Field.Field>
				<Field.Label class="text-xs">字段类型</Field.Label>
				<Field.Content>
					<Select.Root 
						type="single"
						value={formType}
						onValueChange={(v) => v && (formType = v as InputFieldType)}
					>
						<Select.Trigger class="h-9 w-full">
							<div class="flex items-center justify-between w-full">
								<div class="flex items-center gap-2">
									<Icon icon={fieldTypes.find(t => t.value === formType)?.icon ?? ''} class="w-4 h-4" />
									<span>{fieldTypes.find(t => t.value === formType)?.label ?? '选择类型'}</span>
								</div>
								<span class="text-xs text-muted-foreground font-mono">{FIELD_TYPE_DATA_TYPES[formType]}</span>
							</div>
						</Select.Trigger>
						<Select.Content class="w-[var(--bits-floating-anchor-width)]">
							{#each fieldTypes as ft}
								<Select.Item value={ft.value} label={ft.label}>
									<div class="flex items-center justify-between w-full">
										<div class="flex items-center gap-2">
											<Icon icon={ft.icon} class="w-4 h-4" />
											<span>{ft.label}</span>
										</div>
										<span class="text-xs text-muted-foreground font-mono">{FIELD_TYPE_DATA_TYPES[ft.value]}</span>
									</div>
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</Field.Content>
			</Field.Field>

			<!-- 显示名称 -->
			<Field.Field>
				<Field.Label class="text-xs">显示名称</Field.Label>
				<Field.Content>
					<Input 
						bind:value={formLabel}
						placeholder="字段显示名称"
						class="h-9"
					/>
				</Field.Content>
			</Field.Field>

			<!-- 变量名 -->
			<Field.Field>
				<Field.Label class="text-xs">变量名</Field.Label>
				<Field.Content>
					<Input 
						bind:value={formVariable}
						placeholder="变量名（英文）"
						class="h-9 font-mono"
					/>
				</Field.Content>
				<Field.Description class="text-xs">用于在工作流中引用此字段的值</Field.Description>
			</Field.Field>

			<!-- 占位符 -->
			<Field.Field>
				<Field.Label class="text-xs">占位符</Field.Label>
				<Field.Content>
					<Input 
						bind:value={formPlaceholder}
						placeholder="输入提示文本"
						class="h-9"
					/>
				</Field.Content>
			</Field.Field>

			<!-- 必填和隐藏（互斥） -->
			<div class="flex items-center gap-6">
				<div class="flex items-center gap-2">
					<Checkbox 
						bind:checked={formRequired} 
						id="required" 
						disabled={formHidden}
						onchange={() => { if (formRequired) formHidden = false; }}
					/>
					<label for="required" class="text-xs cursor-pointer leading-none {formHidden ? 'text-muted-foreground' : ''}">必填</label>
				</div>
				<div class="flex items-center gap-2">
					<Checkbox 
						bind:checked={formHidden} 
						id="hidden"
						disabled={formRequired}
						onchange={() => { if (formHidden) formRequired = false; }}
					/>
					<label for="hidden" class="text-xs cursor-pointer leading-none {formRequired ? 'text-muted-foreground' : ''}">隐藏</label>
				</div>
			</div>

			<!-- 最大长度（text/paragraph） -->
			{#if formType === 'text' || formType === 'paragraph'}
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
							class="h-9"
						/>
					</Field.Content>
				</Field.Field>
			{/if}

			<!-- 选项列表（select） -->
			{#if formType === 'select'}
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
					</Field.Content>
				</Field.Field>
			{/if}

			<!-- 文件类型限制（file/files） -->
			{#if formType === 'file' || formType === 'files'}
				<Field.Field>
					<Field.Label class="text-xs">允许的文件类型</Field.Label>
					<Field.Content>
						<Input 
							bind:value={formAllowedFileTypes}
							placeholder=".pdf, .docx, .txt"
							class="h-9"
						/>
					</Field.Content>
					<Field.Description class="text-xs">多个类型用逗号分隔</Field.Description>
				</Field.Field>
			{/if}

			<!-- 最大文件数（files） -->
			{#if formType === 'files'}
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
						/>
					</Field.Content>
				</Field.Field>
			{/if}
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={() => isModalOpen = false}>取消</Button>
			<Button onclick={saveField}>{isEditing ? '保存' : '添加'}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
