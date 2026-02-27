<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Dialog from '$lib/components/ui/dialog';
	import Icon from '@iconify/svelte';
	import { AIGeneratorModal } from '$lib/components/ai-generator';
	import { VariableTagEditor } from '../../../components/VariableTagEditor';
	import { toast } from 'svelte-sonner';
	import type { PromptMessage, PromptRole } from '../types';

	interface Props {
		messages: PromptMessage[];
		onMessagesChange: (messages: PromptMessage[]) => void;
		/** 当前节点 ID（用于获取前置节点的输出变量） */
		nodeId?: string;
	}

	let { messages, onMessagesChange, nodeId }: Props = $props();

	// AI 生成器状态
	let aiGeneratorOpen = $state(false);
	let editingMessageId = $state<string | null>(null);
	
	// 放大编辑 Dialog 状态
	let expandDialogOpen = $state(false);
	let expandingMessageId = $state<string | null>(null);
	let expandedContent = $state('');

	function generateId(): string {
		return crypto.randomUUID();
	}

	function getRoleLabel(role: PromptRole): string {
		switch (role) {
			case 'system': return 'SYSTEM';
			case 'user': return 'USER';
			case 'assistant': return 'ASSISTANT';
		}
	}

	function getRoleColor(role: PromptRole): string {
		switch (role) {
			case 'system': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
			case 'user': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
			case 'assistant': return 'bg-green-500/10 text-green-600 border-green-500/20';
		}
	}

	function getNextRole(): PromptRole {
		if (messages.length === 0) return 'system';
		const lastMessage = messages[messages.length - 1];
		// system 后面是 user，user 后面是 assistant，assistant 后面是 user
		if (lastMessage.role === 'system' || lastMessage.role === 'assistant') return 'user';
		return 'assistant';
	}

	function addMessage() {
		const newMessage: PromptMessage = {
			id: generateId(),
			role: getNextRole(),
			content: ''
		};
		onMessagesChange([...messages, newMessage]);
	}

	function updateMessage(id: string, content: string) {
		const updated = messages.map(m => 
			m.id === id ? { ...m, content } : m
		);
		onMessagesChange(updated);
	}

	function removeMessage(id: string) {
		// 不能删除第一个 system 消息
		const index = messages.findIndex(m => m.id === id);
		if (index === 0) return;
		onMessagesChange(messages.filter(m => m.id !== id));
	}

	function copyMessage(id: string) {
		const message = messages.find(m => m.id === id);
		if (message?.content) {
			navigator.clipboard.writeText(message.content);
			toast.success('已复制到剪贴板');
		}
	}

	function openAIGenerator(messageId: string) {
		editingMessageId = messageId;
		aiGeneratorOpen = true;
	}

	function openExpandDialog(messageId: string) {
		const message = messages.find(m => m.id === messageId);
		if (message) {
			expandingMessageId = messageId;
			expandedContent = message.content;
			expandDialogOpen = true;
		}
	}

	function handleExpandDialogSave() {
		if (expandingMessageId) {
			updateMessage(expandingMessageId, expandedContent);
		}
		expandDialogOpen = false;
		expandingMessageId = null;
	}

	function handleAIGeneratorApply(result: string) {
		if (editingMessageId) {
			updateMessage(editingMessageId, result);
		}
		editingMessageId = null;
	}

	// 获取当前编辑消息的角色
	let currentEditingRole = $derived.by(() => {
		if (!editingMessageId) return 'system';
		const message = messages.find(m => m.id === editingMessageId);
		return message?.role ?? 'system';
	});

	// 获取当前编辑消息的内容作为理想输出参考
	let currentEditingContent = $derived.by(() => {
		if (!editingMessageId) return '';
		const message = messages.find(m => m.id === editingMessageId);
		return message?.content ?? '';
	});

	// 获取放大编辑的消息角色
	let expandingRole = $derived.by(() => {
		if (!expandingMessageId) return 'system';
		const message = messages.find(m => m.id === expandingMessageId);
		return message?.role ?? 'system';
	});

	// 根据角色获取默认指令
	function getDefaultInstruction(role: PromptRole): string {
		switch (role) {
			case 'system': return '生成一份关于 xxx 的 AI system 提示词';
			case 'user': return '生成一份关于 xxx 的用户消息模板';
			case 'assistant': return '生成一份关于 xxx 的助手回复模板';
		}
	}
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between">
		<span class="text-xs font-medium">提示词</span>
		<Button variant="ghost" size="sm" class="h-6 px-2 text-xs" onclick={addMessage}>
			<Icon icon="mdi:plus" class="w-3.5 h-3.5 mr-1" />
			添加消息
		</Button>
	</div>

	<div class="space-y-2">
		{#each messages as message, index (message.id)}
			<div class="border border-border rounded-md overflow-hidden">
				<div class="flex items-center justify-between px-2 py-1.5 bg-muted/50 border-b border-border">
					<span class="text-xs font-medium px-2 py-0.5 rounded border {getRoleColor(message.role)}">
						{getRoleLabel(message.role)}
					</span>
					<div class="flex items-center gap-0.5">
						<!-- AI 生成按钮 -->
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button 
									variant="ghost" 
									size="sm" 
									class="h-5 w-5 p-0 text-muted-foreground hover:text-primary"
									onclick={() => openAIGenerator(message.id)}
								>
									<Icon icon="mdi:sparkles" class="w-3.5 h-3.5" />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>AI 生成</p>
							</Tooltip.Content>
						</Tooltip.Root>
						<!-- 复制按钮 -->
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button 
									variant="ghost" 
									size="sm" 
									class="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
									onclick={() => copyMessage(message.id)}
								>
									<Icon icon="mdi:content-copy" class="w-3.5 h-3.5" />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>复制</p>
							</Tooltip.Content>
						</Tooltip.Root>
						<!-- 放大编辑按钮 -->
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button 
									variant="ghost" 
									size="sm" 
									class="h-5 w-5 p-0 text-muted-foreground hover:text-foreground"
									onclick={() => openExpandDialog(message.id)}
								>
									<Icon icon="mdi:arrow-expand" class="w-3.5 h-3.5" />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>放大编辑</p>
							</Tooltip.Content>
						</Tooltip.Root>
						<!-- 删除按钮 -->
						{#if index > 0}
							<Tooltip.Root>
								<Tooltip.Trigger>
									<Button 
										variant="ghost" 
										size="sm" 
										class="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
										onclick={() => removeMessage(message.id)}
									>
										<Icon icon="mdi:delete-outline" class="w-3.5 h-3.5" />
									</Button>
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>删除</p>
								</Tooltip.Content>
							</Tooltip.Root>
						{/if}
					</div>
				</div>
				<!-- 消息内容 -->
				<div class="p-2">
					<VariableTagEditor
						value={message.content}
						onValueChange={(v) => updateMessage(message.id, v)}
						placeholder={message.role === 'system' ? '输入系统提示词，输入 { 或 / 插入变量...' : message.role === 'user' ? '输入用户消息，输入 { 或 / 插入变量...' : '输入助手回复，输入 { 或 / 插入变量...'}
						rows={4}
						maxHeight="150px"
						class="min-h-[80px]"
						currentNodeId={nodeId}
					/>
				</div>
			</div>
		{/each}

		{#if messages.length === 0}
			<div class="text-center py-4 text-sm text-muted-foreground border border-dashed border-border rounded-md">
				<p>暂无提示词消息</p>
				<Button variant="link" size="sm" class="mt-1" onclick={addMessage}>
					添加第一条消息
				</Button>
			</div>
		{/if}
	</div>
</div>

<!-- AI 提示词生成器 -->
<AIGeneratorModal 
	bind:open={aiGeneratorOpen}
	type="text"
	title="提示词生成器"
	description="使用 AI 来优化或生成提示词，以获得更高质量的输出。"
	prompt={getDefaultInstruction(currentEditingRole)}
	idealOutput={currentEditingContent}
	idealOutputPlaceholder="描述您理想的提示词效果、风格和要求..."
	onOpenChange={(v) => aiGeneratorOpen = v}
	onApply={handleAIGeneratorApply}
/>

<!-- 放大编辑 Dialog -->
<Dialog.Root bind:open={expandDialogOpen}>
	<Dialog.Content class="sm:max-w-5xl p-0 gap-0 h-[80vh] flex flex-col">
		<Dialog.Header class="p-4 pb-3 border-b border-border shrink-0">
			<Dialog.Title class="flex items-center gap-2">
				<span class="text-xs font-medium px-2 py-0.5 rounded border {getRoleColor(expandingRole)}">
					{getRoleLabel(expandingRole)}
				</span>
				<span>编辑提示词</span>
			</Dialog.Title>
			<Dialog.Description>
				在更大的编辑区域中编辑提示词内容，输入 {'{'} 或 / 插入变量
			</Dialog.Description>
		</Dialog.Header>
		<div class="p-4 flex-1 min-h-0">
			<VariableTagEditor
				value={expandedContent}
				onValueChange={(v) => expandedContent = v}
				placeholder={expandingRole === 'system' ? '输入系统提示词，输入 { 或 / 插入变量...' : expandingRole === 'user' ? '输入用户消息，输入 { 或 / 插入变量...' : '输入助手回复，输入 { 或 / 插入变量...'}
				rows={20}
				maxHeight="100%"
				class="h-full"
				inDialog={true}
				currentNodeId={nodeId}
			/>
		</div>
		<Dialog.Footer class="p-4 pt-0 shrink-0">
			<Button variant="outline" onclick={() => expandDialogOpen = false}>
				取消
			</Button>
			<Button onclick={handleExpandDialogSave}>
				保存
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
