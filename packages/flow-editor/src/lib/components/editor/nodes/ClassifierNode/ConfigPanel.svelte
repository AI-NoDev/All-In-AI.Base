<script lang="ts">
	import type { ClassifierNodeData, ClassifierOption } from './types.js';
	import { workflowState } from '$lib/components/editor/contexts/index.js';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';

	interface Props {
		nodeId: string;
		data: ClassifierNodeData;
	}

	let { nodeId }: Props = $props();

	let currentData = $derived.by(() => {
		const node = workflowState.getNode(nodeId);
		return node?.data as ClassifierNodeData | undefined;
	});

	let title = $derived(currentData?.title ?? '问题分类器');
	let desc = $derived(currentData?.desc ?? '');
	let model = $derived(currentData?.model ?? '');
	let options = $derived(currentData?.options ?? []);

	function updateField(field: string, value: unknown) {
		workflowState.updateNode(nodeId, { [field]: value });
	}

	function addOption() {
		const newOption: ClassifierOption = {
			id: crypto.randomUUID(),
			label: `分类 ${options.length + 1}`,
			description: ''
		};
		updateField('options', [...options, newOption]);
	}

	function removeOption(id: string) {
		updateField('options', options.filter((o: ClassifierOption) => o.id !== id));
	}

	function updateOption(id: string, field: keyof ClassifierOption, value: string) {
		updateField('options', options.map((o: ClassifierOption) => 
			o.id === id ? { ...o, [field]: value } : o
		));
	}
</script>

<div class="space-y-4">
	<div class="space-y-2">
		<Label for="title">节点名称</Label>
		<Input 
			id="title" 
			value={title} 
			oninput={(e) => updateField('title', (e.target as HTMLInputElement).value)}
			placeholder="输入节点名称"
		/>
	</div>

	<div class="space-y-2">
		<Label for="model">模型</Label>
		<Input 
			id="model" 
			value={model} 
			oninput={(e) => updateField('model', (e.target as HTMLInputElement).value)}
			placeholder="选择分类模型"
		/>
	</div>

	<div class="space-y-2">
		<div class="flex items-center justify-between">
			<Label>分类选项</Label>
			<Button variant="outline" size="sm" onclick={addOption}>
				<Icon icon="mdi:plus" width="14" height="14" class="mr-1" />
				添加
			</Button>
		</div>
		
		<div class="space-y-2">
			{#each options as option (option.id)}
				<div class="flex items-center gap-2 p-2 border rounded-md">
					<Input 
						value={option.label}
						oninput={(e) => updateOption(option.id, 'label', (e.target as HTMLInputElement).value)}
						placeholder="分类名称"
						class="flex-1"
					/>
					<Button 
						variant="ghost" 
						size="icon" 
						class="h-8 w-8 text-destructive"
						onclick={() => removeOption(option.id)}
					>
						<Icon icon="mdi:delete" width="16" height="16" />
					</Button>
				</div>
			{/each}
		</div>
	</div>

	<div class="space-y-2">
		<Label for="desc">描述</Label>
		<Textarea 
			id="desc" 
			value={desc} 
			oninput={(e) => updateField('desc', (e.target as HTMLTextAreaElement).value)}
			placeholder="输入节点描述"
			rows={2}
		/>
	</div>

	<div class="pt-4 border-t border-border">
		<p class="text-xs text-muted-foreground">
			问题分类器根据用户输入自动分类到不同的处理分支。
		</p>
	</div>
</div>
