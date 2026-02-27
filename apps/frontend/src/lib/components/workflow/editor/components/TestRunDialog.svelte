<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Select from '$lib/components/ui/select';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import type { InputField } from '../nodes/StartNode/types';
	import { workflowState } from '../contexts/index';
	import { AIGeneratorModal } from '$lib/components/ai-generator';

	/** 上传的文件信息 */
	interface UploadedFile {
		id: string;
		name: string;
		size: number;
		type: string;
		file: File;
	}

	interface Props {
		open: boolean;
		inputFields: InputField[];
		onClose: () => void;
		onRun: (inputs: Record<string, unknown>, files: File[]) => void;
		/** 对话框模式：run=运行模式，inputs=仅设置参数 */
		mode?: 'run' | 'inputs';
	}

	let { open, inputFields, onClose, onRun, mode = 'run' }: Props = $props();
	
	// 对话框标题和按钮文字
	let dialogTitle = $derived(mode === 'inputs' ? '设置输入参数' : '测试运行');
	let dialogDesc = $derived(mode === 'inputs' ? '设置工作流输入参数，可用于手动逐步执行' : '填写工作流输入参数并运行测试');
	let submitButtonText = $derived(mode === 'inputs' ? '保存' : '运行');
	let submitButtonIcon = $derived(mode === 'inputs' ? 'mdi:content-save' : 'mdi:play');

	let formValues = $state<Record<string, string | number | boolean>>({});
	let uploadedFiles = $state<UploadedFile[]>([]);
	let activeTab = $state('fields');
	let fileInputRef = $state<HTMLInputElement | null>(null);

	let customFields = $derived(inputFields.filter(f => !f.hidden && f.uiType !== 'file' && f.uiType !== 'files'));
	let fileFields = $derived(inputFields.filter(f => !f.hidden && (f.uiType === 'file' || f.uiType === 'files')));
	// 是否有文件字段
	let hasFileFields = $derived(fileFields.length > 0);

	// AI 生成器状态
	let aiGeneratorOpen = $state(false);

	// AI 生成器的 prompt，包含字段定义信息
	let aiGeneratorPrompt = $derived.by(() => {
		if (customFields.length === 0) return '';
		
		const fieldsInfo = customFields.map(field => {
			let info = `- ${field.variable} (${field.label})`;
			info += `\n  类型: ${field.uiType || 'text'}`;
			if (field.description) info += `\n  描述: ${field.description}`;
			if (field.required) info += `\n  必填: 是`;
			if (field.uiType === 'number') {
				if (field.min !== undefined) info += `\n  最小值: ${field.min}`;
				if (field.max !== undefined) info += `\n  最大值: ${field.max}`;
			}
			if (field.uiType === 'select' && field.options) {
				info += `\n  可选值: ${field.options.map(o => o.value).join(', ')}`;
			}
			if (field.placeholder) info += `\n  示例: ${field.placeholder}`;
			return info;
		}).join('\n\n');

		return `请为以下工作流输入字段生成测试数据。

## 字段定义

${fieldsInfo}

## 要求

1. 生成符合各字段类型和约束的测试数据
2. 数据应该真实合理，便于测试
3. 返回 JSON 对象格式，key 为字段的 variable 名称`;
	});

	// AI 生成器的理想输出示例
	let aiGeneratorIdealOutput = $derived.by(() => {
		if (customFields.length === 0) return '';
		
		const example: Record<string, unknown> = {};
		for (const field of customFields) {
			switch (field.uiType) {
				case 'number':
					example[field.variable] = field.min ?? 0;
					break;
				case 'checkbox':
					example[field.variable] = false;
					break;
				case 'select':
					example[field.variable] = field.options?.[0]?.value ?? '';
					break;
				case 'json':
					example[field.variable] = {};
					break;
				default:
					example[field.variable] = '';
			}
		}
		return JSON.stringify(example, null, 2);
	});

	// 处理 AI 生成结果
	function handleAIGeneratorApply(result: string) {
		try {
			// 尝试解析 JSON
			let jsonStr = result.trim();
			// 处理可能的 markdown 代码块
			const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
			if (jsonMatch) {
				jsonStr = jsonMatch[1].trim();
			}
			
			const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
			
			// 更新表单值
			for (const field of customFields) {
				if (parsed[field.variable] !== undefined) {
					const value = parsed[field.variable];
					if (field.uiType === 'json' && typeof value === 'object') {
						formValues[field.variable] = JSON.stringify(value, null, 2);
					} else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
						formValues[field.variable] = value;
					}
				}
			}
			
			saveFormValues();
			toast.success('已应用 AI 生成的测试数据');
		} catch (err) {
			console.error('Failed to parse AI result:', err);
			toast.error('解析 AI 生成结果失败，请检查格式');
		}
	}

	// 用于跟踪是否已初始化，避免循环
	let initialized = $state(false);

	// 初始化表单值（从 workflowState.testInputs 恢复或使用默认值）
	$effect(() => {
		if (open && !initialized) {
			// 读取保存的值（只在初始化时读取一次）
			const savedValues = { ...workflowState.testInputs.values };
			const initial: Record<string, string | number | boolean> = {};
			
			for (const field of inputFields) {
				if (field.uiType === 'file' || field.uiType === 'files') continue;
				
				// 优先使用保存的值
				if (savedValues[field.variable] !== undefined) {
					initial[field.variable] = savedValues[field.variable];
				} else if (field.defaultValue !== undefined) {
					if (typeof field.defaultValue === 'object') {
						initial[field.variable] = JSON.stringify(field.defaultValue, null, 2);
					} else {
						initial[field.variable] = field.defaultValue as string | number | boolean;
					}
				} else {
					// 根据类型设置默认值
					switch (field.uiType) {
						case 'number':
							initial[field.variable] = field.min ?? 0;
							break;
						case 'checkbox':
							initial[field.variable] = false;
							break;
						case 'select':
							initial[field.variable] = field.options?.[0]?.value ?? '';
							break;
						default:
							initial[field.variable] = '';
					}
				}
			}
			formValues = initial;
			uploadedFiles = [];
			activeTab = 'fields';
			initialized = true;
		}
		
		// 对话框关闭时重置初始化标志
		if (!open) {
			initialized = false;
		}
	});

	// 保存表单值到 workflowState 的函数（手动调用，不用 effect）
	function saveFormValues() {
		if (Object.keys(formValues).length > 0) {
			workflowState.testInputs = {
				values: { ...formValues },
				updatedAt: new Date().toISOString()
			};
		}
	}

	// 更新表单值并保存
	function updateFormValue(key: string, value: string | number | boolean) {
		formValues[key] = value;
		saveFormValues();
	}

	// 验证必填字段
	let validationErrors = $derived.by(() => {
		const errors: Record<string, string> = {};
		for (const field of customFields) {
			if (field.required) {
				const value = formValues[field.variable];
				if (value === undefined || value === '' || value === null) {
					errors[field.variable] = '此字段为必填项';
				}
			}
		}
		// 验证文件字段
		for (const field of fileFields) {
			if (field.required) {
				const fieldFiles = uploadedFiles.filter(f => f.id.startsWith(`${field.variable}_`));
				if (fieldFiles.length === 0) {
					errors[field.variable] = '请上传文件';
				}
			}
		}
		return errors;
	});

	let isValid = $derived(Object.keys(validationErrors).length === 0);

	function handleRun() {
		// 仅设置参数模式：保存并关闭
		if (mode === 'inputs') {
			saveFormValues();
			onClose();
			return;
		}
		
		// 运行模式：验证后执行
		if (!isValid) return;

		// 转换表单值
		const inputs: Record<string, unknown> = {};
		for (const field of inputFields) {
			if (field.uiType === 'file' || field.uiType === 'files') {
				// 文件字段单独处理
				const fieldFiles = uploadedFiles.filter(f => f.id.startsWith(`${field.variable}_`));
				if (field.uiType === 'file') {
					inputs[field.variable] = fieldFiles[0]?.file ?? null;
				} else {
					inputs[field.variable] = fieldFiles.map(f => f.file);
				}
				continue;
			}

			const value = formValues[field.variable];
			switch (field.uiType) {
				case 'number':
					inputs[field.variable] = Number(value) || 0;
					break;
				case 'checkbox':
					inputs[field.variable] = Boolean(value);
					break;
				case 'json':
					try {
						inputs[field.variable] = JSON.parse(String(value));
					} catch {
						inputs[field.variable] = {};
					}
					break;
				default:
					inputs[field.variable] = value;
			}
		}

		// 收集所有文件
		const files = uploadedFiles.map(f => f.file);
		onRun(inputs, files);
	}

	function handleFileSelect(event: Event, field: InputField) {
		const input = event.target as HTMLInputElement;
		const files = input.files;
		if (!files) return;

		const maxFiles = field.uiType === 'file' ? 1 : (field.maxFiles ?? 10);
		const currentCount = uploadedFiles.filter(f => f.id.startsWith(`${field.variable}_`)).length;
		const remainingSlots = maxFiles - currentCount;

		const newFiles: UploadedFile[] = [];
		for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
			const file = files[i];
			newFiles.push({
				id: `${field.variable}_${crypto.randomUUID()}`,
				name: file.name,
				size: file.size,
				type: file.type,
				file,
			});
		}

		if (field.uiType === 'file') {
			// 单文件模式，替换现有文件
			uploadedFiles = [
				...uploadedFiles.filter(f => !f.id.startsWith(`${field.variable}_`)),
				...newFiles,
			];
		} else {
			// 多文件模式，追加
			uploadedFiles = [...uploadedFiles, ...newFiles];
		}

		// 清空 input 以允许重复选择同一文件
		input.value = '';
	}

	function removeFile(fileId: string) {
		uploadedFiles = uploadedFiles.filter(f => f.id !== fileId);
	}

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function getAcceptString(field: InputField): string {
		const parts: string[] = [];
		if (field.fileConfig?.mimeTypes) {
			parts.push(...field.fileConfig.mimeTypes);
		}
		if (field.fileConfig?.extensions) {
			parts.push(...field.fileConfig.extensions);
		}
		return parts.join(',') || '*/*';
	}

	function getFieldFilesCount(field: InputField): number {
		return uploadedFiles.filter(f => f.id.startsWith(`${field.variable}_`)).length;
	}
</script>

<Dialog.Root bind:open onOpenChange={(v) => { if (!v) { saveFormValues(); onClose(); } }}>
	<Dialog.Content class="max-w-2xl">
		<Dialog.Header>
			<div class="flex items-center justify-between">
				<Dialog.Title class="flex items-center gap-2">
					<Icon icon={mode === 'inputs' ? 'mdi:form-textbox' : 'mdi:play-circle'} class="w-5 h-5 text-primary" />
					{dialogTitle}
				</Dialog.Title>
				{#if customFields.length > 0}
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger>
								{#snippet child({ props })}
									<Button 
										{...props}
										variant="ghost" 
										size="sm" 
										class="h-7 px-2 text-muted-foreground hover:text-primary"
										onclick={() => aiGeneratorOpen = true}
									>
										<Icon icon="mdi:sparkles" class="w-4 h-4 mr-1" />
										AI 生成
									</Button>
								{/snippet}
							</Tooltip.Trigger>
							<Tooltip.Content>使用 AI 生成测试数据</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				{/if}
			</div>
			<Dialog.Description>
				{dialogDesc}
			</Dialog.Description>
		</Dialog.Header>

		{#if inputFields.length === 0 || (customFields.length === 0 && fileFields.length === 0)}
			<!-- 无输入字段 -->
			<div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
				<Icon icon="mdi:information-outline" class="w-12 h-12 mb-3 opacity-50" />
				<p class="text-sm">此工作流没有定义输入变量</p>
				<p class="text-xs mt-1">将直接运行工作流</p>
			</div>
		{:else if hasFileFields}
			<!-- 有文件字段时使用 Tabs -->
			<Tabs.Root bind:value={activeTab}>
				<Tabs.List class="w-full grid grid-cols-2">
					<Tabs.Trigger value="fields" class="gap-2">
						<Icon icon="mdi:form-textbox" class="w-4 h-4" />
						自定义字段
						{#if customFields.length > 0}
							<span class="text-xs text-muted-foreground">({customFields.length})</span>
						{/if}
					</Tabs.Trigger>
					<Tabs.Trigger value="files" class="gap-2">
						<Icon icon="mdi:file-upload" class="w-4 h-4" />
						文件上传
						{#if uploadedFiles.length > 0}
							<span class="text-xs bg-primary text-primary-foreground px-1.5 rounded-full">{uploadedFiles.length}</span>
						{/if}
					</Tabs.Trigger>
				</Tabs.List>

				<!-- 自定义字段 Tab -->
				<Tabs.Content value="fields" class="mt-4">
					<div class="h-[calc(60vh-200px)]">
						<ScrollArea class="h-full">
							<div class="space-y-4 pr-4">
								{#if customFields.length === 0}
									<div class="text-center text-muted-foreground py-8">
										<Icon icon="mdi:form-textbox" class="w-8 h-8 mx-auto mb-2 opacity-50" />
										<p class="text-sm">没有自定义输入字段</p>
									</div>
								{:else}
									{#each customFields as field (field.id)}
										{@render fieldInput(field)}
									{/each}
								{/if}
							</div>
						</ScrollArea>
					</div>
				</Tabs.Content>

				<!-- 文件上传 Tab -->
				<Tabs.Content value="files" class="mt-4">
					<div class="h-[calc(60vh-200px)]">
						<ScrollArea class="h-full">
							<div class="space-y-4 pr-4">
								{#each fileFields as field (field.id)}
									{@render fileInput(field)}
								{/each}
							</div>
						</ScrollArea>
					</div>
				</Tabs.Content>
			</Tabs.Root>
		{:else}
			<!-- 只有自定义字段 -->
			<div class="h-[calc(60vh-180px)]">
				<ScrollArea class="h-full">
					<div class="space-y-4 pr-4">
						{#each customFields as field (field.id)}
							{@render fieldInput(field)}
						{/each}
					</div>
				</ScrollArea>
			</div>
		{/if}

		<Dialog.Footer>
			<Button variant="outline" onclick={onClose}>
				取消
			</Button>
			<Button onclick={handleRun} disabled={mode === 'run' && !isValid}>
				<Icon icon={submitButtonIcon} class="w-4 h-4 mr-1" />
				{submitButtonText}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- 字段输入渲染 -->
{#snippet fieldInput(field: InputField)}
	<div class="space-y-2">
		<Label for={field.id} class="flex items-center gap-2">
			<span>{field.label}</span>
			{#if field.required}
				<span class="text-destructive">*</span>
			{/if}
			<span class="text-xs text-muted-foreground font-mono">({field.variable})</span>
		</Label>
		{#if field.description}
			<p class="text-xs text-muted-foreground">{field.description}</p>
		{/if}

		{#if field.uiType === 'textarea'}
			<Textarea
				id={field.id}
				value={String(formValues[field.variable] ?? '')}
				oninput={(e) => updateFormValue(field.variable, e.currentTarget.value)}
				placeholder={field.placeholder ?? `输入 ${field.label}`}
				rows={4}
				maxlength={field.maxLength}
			/>
		{:else if field.uiType === 'number'}
			<Input
				id={field.id}
				type="number"
				value={String(formValues[field.variable] ?? '')}
				oninput={(e) => updateFormValue(field.variable, Number(e.currentTarget.value))}
				placeholder={field.placeholder ?? `输入 ${field.label}`}
				min={field.min}
				max={field.max}
				step={field.step}
			/>
		{:else if field.uiType === 'checkbox'}
			<div class="flex items-center gap-2">
				<Checkbox
					id={field.id}
					checked={Boolean(formValues[field.variable])}
					onCheckedChange={(v) => updateFormValue(field.variable, Boolean(v))}
				/>
				<Label for={field.id} class="text-sm font-normal cursor-pointer">
					{field.placeholder ?? '启用'}
				</Label>
			</div>
		{:else if field.uiType === 'select'}
			<Select.Root 
				type="single"
				value={String(formValues[field.variable] ?? '')}
				onValueChange={(v) => updateFormValue(field.variable, v)}
			>
				<Select.Trigger class="w-full">
					{#snippet child({ open })}
						<span>{field.options?.find(o => o.value === formValues[field.variable])?.label ?? '请选择'}</span>
					{/snippet}
				</Select.Trigger>
				<Select.Content>
					{#each field.options ?? [] as option (option.value)}
						<Select.Item value={option.value}>{option.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		{:else if field.uiType === 'json'}
			<Textarea
				id={field.id}
				value={String(formValues[field.variable] ?? '{}')}
				oninput={(e) => updateFormValue(field.variable, e.currentTarget.value)}
				placeholder={field.placeholder ?? '输入 JSON 对象'}
				rows={6}
				class="font-mono text-sm"
			/>
		{:else}
			<!-- text 默认 -->
			<Input
				id={field.id}
				type="text"
				value={String(formValues[field.variable] ?? '')}
				oninput={(e) => updateFormValue(field.variable, e.currentTarget.value)}
				placeholder={field.placeholder ?? `输入 ${field.label}`}
				maxlength={field.maxLength}
			/>
		{/if}

		{#if validationErrors[field.variable]}
			<p class="text-xs text-destructive">{validationErrors[field.variable]}</p>
		{/if}
	</div>
{/snippet}

<!-- 文件上传渲染 -->
{#snippet fileInput(field: InputField)}
	{@const fieldFiles = uploadedFiles.filter(f => f.id.startsWith(`${field.variable}_`))}
	{@const maxFiles = field.uiType === 'file' ? 1 : (field.maxFiles ?? 10)}
	{@const canAddMore = fieldFiles.length < maxFiles}

	<div class="space-y-3">
		<div class="flex items-center justify-between">
			<Label class="flex items-center gap-2">
				<Icon icon={field.uiType === 'file' ? 'mdi:file-outline' : 'mdi:file-multiple-outline'} class="w-4 h-4" />
				<span>{field.label}</span>
				{#if field.required}
					<span class="text-destructive">*</span>
				{/if}
			</Label>
			{#if field.uiType === 'files'}
				<span class="text-xs text-muted-foreground">{fieldFiles.length} / {maxFiles}</span>
			{/if}
		</div>
		{#if field.description}
			<p class="text-xs text-muted-foreground">{field.description}</p>
		{/if}

		<!-- 已上传文件列表 -->
		{#if fieldFiles.length > 0}
			<div class="space-y-2">
				{#each fieldFiles as file (file.id)}
					<div class="flex items-center gap-3 p-2 bg-muted/50 rounded-md">
						<Icon icon="mdi:file-document-outline" class="w-5 h-5 text-muted-foreground shrink-0" />
						<div class="flex-1 min-w-0">
							<p class="text-sm truncate">{file.name}</p>
							<p class="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
						</div>
						<Button
							variant="ghost"
							size="sm"
							class="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
							onclick={() => removeFile(file.id)}
						>
							<Icon icon="mdi:close" class="w-4 h-4" />
						</Button>
					</div>
				{/each}
			</div>
		{/if}

		<!-- 上传按钮 -->
		{#if canAddMore}
			<label class="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
				<Icon icon="mdi:cloud-upload-outline" class="w-8 h-8 text-muted-foreground" />
				<span class="text-sm text-muted-foreground">
					{field.uiType === 'file' ? '点击选择文件' : '点击选择文件（可多选）'}
				</span>
				{#if field.fileConfig?.extensions}
					<span class="text-xs text-muted-foreground">
						支持: {field.fileConfig.extensions.join(', ')}
					</span>
				{/if}
				<input
					type="file"
					class="hidden"
					accept={getAcceptString(field)}
					multiple={field.uiType === 'files'}
					onchange={(e) => handleFileSelect(e, field)}
				/>
			</label>
		{/if}

		{#if validationErrors[field.variable]}
			<p class="text-xs text-destructive">{validationErrors[field.variable]}</p>
		{/if}
	</div>
{/snippet}

<!-- AI 测试数据生成器 -->
<AIGeneratorModal 
	bind:open={aiGeneratorOpen}
	type="object"
	title="AI 生成测试数据"
	description="使用 AI 根据字段定义生成测试输入数据"
	prompt={aiGeneratorPrompt}
	idealOutput={aiGeneratorIdealOutput}
	idealOutputPlaceholder="描述您期望的测试数据格式和内容..."
	onOpenChange={(v) => aiGeneratorOpen = v}
	onApply={handleAIGeneratorApply}
/>