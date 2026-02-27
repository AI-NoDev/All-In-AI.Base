<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Alert from '$lib/components/ui/alert';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import { workflowState } from '../../contexts/index';
	import type { EnvironmentVariable } from '$lib/components/workflow/types/index';

	interface Props {
		addTrigger?: number;
	}

	let { addTrigger = 0 }: Props = $props();

	type ValueType = 'string' | 'secret';

	const valueTypes: { value: ValueType; label: string }[] = [
		{ value: 'string', label: '字符串' },
		{ value: 'secret', label: '密钥' },
	];

	// 直接从 workflowState 获取，确保响应性
	let envVars = $derived.by(() => workflowState.environmentVariables);
	
	// 获取值为空的环境变量列表
	let emptyEnvVars = $derived.by(() => 
		workflowState.environmentVariables.filter(v => !v.value || v.value.trim() === '')
	);
	
	let dialogOpen = $state(false);
	let editingEnvVar = $state<EnvironmentVariable | null>(null);
	let formData = $state<Partial<EnvironmentVariable>>({
		name: '',
		value: '',
		value_type: 'string'
	});

	$effect(() => {
		if (addTrigger > 0) {
			editingEnvVar = null;
			formData = { name: '', value: '', value_type: 'string' };
			dialogOpen = true;
		}
	});

	function openEditDialog(envVar: EnvironmentVariable) {
		editingEnvVar = envVar;
		formData = { ...envVar };
		dialogOpen = true;
	}

	function handleSave() {
		if (!formData.name?.trim()) return;
		
		if (editingEnvVar) {
			workflowState.environmentVariables = workflowState.environmentVariables.map(v => 
				v.id === editingEnvVar!.id 
					? { ...v, name: formData.name!.trim(), value: formData.value ?? '', value_type: formData.value_type ?? 'string' }
					: v
			);
		} else {
			const newEnvVar: EnvironmentVariable = {
				id: crypto.randomUUID(),
				name: formData.name.trim(),
				value: formData.value ?? '',
				value_type: formData.value_type ?? 'string'
			};
			workflowState.environmentVariables = [...workflowState.environmentVariables, newEnvVar];
		}
		dialogOpen = false;
	}

	function handleRemove(id: string) {
		workflowState.environmentVariables = workflowState.environmentVariables.filter(v => v.id !== id);
	}

	function getTypeLabel(type: ValueType): string {
		return valueTypes.find(t => t.value === type)?.label ?? type;
	}

	function copyToClipboard(name: string) {
		navigator.clipboard.writeText(`{{env.${name}}}`);
		toast.success('已复制到剪贴板');
	}
</script>

{#if emptyEnvVars.length > 0}
	<Alert.Root class="mb-3 border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400">
		<Icon icon="mdi:alert" class="h-4 w-4" />
		<Alert.Title class="text-amber-700 dark:text-amber-400">未设置值的环境变量</Alert.Title>
		<Alert.Description class="text-amber-600 dark:text-amber-500">
			{emptyEnvVars.map(v => v.name).join(', ')}
		</Alert.Description>
	</Alert.Root>
{/if}

{#if envVars.length === 0}
	<div class="text-center py-12 text-muted-foreground">
		<Icon icon="mdi:variable" class="w-12 h-12 mx-auto mb-3 opacity-30" />
		<p class="text-sm">暂无环境变量</p>
		<p class="text-xs mt-1">点击上方按钮添加</p>
	</div>
{:else}
	<div class="space-y-2">
		{#each envVars as envVar (envVar.id)}
			<div class="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group">
				<div class="flex items-center justify-between gap-2">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2">
							<span class="font-mono text-sm font-medium truncate">{envVar.name}</span>
							{#if envVar.value_type === 'secret'}
								<Icon icon="mdi:lock" class="w-3.5 h-3.5 text-muted-foreground shrink-0" />
							{/if}
						</div>
						<div class="flex items-center gap-2 mt-1">
							<span class="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
								{getTypeLabel(envVar.value_type)}
							</span>
							<span class="text-xs text-muted-foreground truncate font-mono">
								{envVar.value_type === 'secret' ? '••••••••' : (envVar.value || '(空)')}
							</span>
						</div>
					</div>
					<div class="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
						<Button size="icon" variant="ghost" class="h-6 w-6" onclick={() => copyToClipboard(envVar.name)} title="复制引用">
							<Icon icon="mdi:content-copy" class="w-3.5 h-3.5" />
						</Button>
						<Button size="icon" variant="ghost" class="h-6 w-6" onclick={() => openEditDialog(envVar)} title="编辑">
							<Icon icon="mdi:pencil-outline" class="w-3.5 h-3.5" />
						</Button>
						<Button size="icon" variant="ghost" class="h-6 w-6 text-destructive hover:text-destructive" onclick={() => handleRemove(envVar.id)} title="删除">
							<Icon icon="mdi:delete-outline" class="w-3.5 h-3.5" />
						</Button>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>{editingEnvVar ? '编辑环境变量' : '添加环境变量'}</Dialog.Title>
			<Dialog.Description>
				使用 <code class="px-1 py-0.5 bg-muted rounded text-xs">{`{{name}}`}</code> 引用
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label for="env-name">变量名</Label>
				<Input id="env-name" bind:value={formData.name} placeholder="ENV_NAME" />
			</div>
			<div class="space-y-2">
				<Label for="env-type">类型</Label>
				<Select.Root type="single" value={formData.value_type} onValueChange={(v) => formData.value_type = v as ValueType}>
					<Select.Trigger id="env-type">{getTypeLabel(formData.value_type ?? 'string')}</Select.Trigger>
					<Select.Content>
						{#each valueTypes as type}
							<Select.Item value={type.value}>{type.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="env-value">值</Label>
				<Input id="env-value" bind:value={formData.value} placeholder="变量值" type={formData.value_type === 'secret' ? 'password' : 'text'} />
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => dialogOpen = false}>取消</Button>
			<Button onclick={handleSave} disabled={!formData.name?.trim()}>{editingEnvVar ? '保存' : '添加'}</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
