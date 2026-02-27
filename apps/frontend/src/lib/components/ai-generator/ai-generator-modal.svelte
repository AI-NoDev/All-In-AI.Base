<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import Icon from '@iconify/svelte';
	import { ModelSelector } from '$lib/components/workflow/editor/components/selectors';
	import ModelParamsPanel from './model-params.svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import { preferencesStore } from '$lib/stores/preferences.svelte';
	import { toast } from 'svelte-sonner';
	import { Chat, DefaultChatTransport } from '@qiyu-allinai/ai/client';
	import { 
		TYPE_CONFIGS, 
		DEFAULT_MODEL_PARAMS,
		type GeneratorType, 
		type ModelConfig, 
		type ModelParams,
		type GenerateResult 
	} from './types';

	const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030';

	interface AIModel {
		id: string;
		name: string;
		modelId: string;
		providerId: string;
	}

	interface Props {
		/** 是否打开 */
		open: boolean;
		/** 生成器类型 */
		type?: GeneratorType;
		/** 自定义标题 */
		title?: string;
		/** 自定义描述 */
		description?: string;
		/** 默认提示词/指令 */
		prompt?: string;
		/** 默认理想输出 */
		idealOutput?: string;
		/** 理想输出占位符 */
		idealOutputPlaceholder?: string;
		/** 关闭回调 */
		onOpenChange: (open: boolean) => void;
		/** 应用结果回调 */
		onApply?: (result: string) => void;
		mcpIds?:  string[]
	}

	let { 
		open = $bindable(false),
		type = 'text',
		title,
		description,
		prompt = '',
		idealOutput: defaultIdealOutput = '',
		idealOutputPlaceholder,
		onOpenChange,
		onApply,
			mcpIds
	}: Props = $props();

	// 获取类型配置
	let typeConfig = $derived(TYPE_CONFIGS[type]);
	let displayTitle = $derived(title ?? typeConfig.title);
	let displayDescription = $derived(description ?? typeConfig.description);
	let displayIdealPlaceholder = $derived(idealOutputPlaceholder ?? typeConfig.idealOutputPlaceholder);

	// 状态
	let modelConfig = $state<ModelConfig | undefined>(undefined);
	let modelParams = $state<ModelParams>({ ...DEFAULT_MODEL_PARAMS });
	let instruction = $state(prompt);
	let idealOutput = $state('');
	let configPopoverOpen = $state(false);
	let generating = $state(false);
	let results = $state<GenerateResult[]>([]);
	let currentVersion = $derived(results.length);
	
	// 流式内容状态
	let streamingContent = $state('');
	let currentChat = $state<Chat | null>(null);
	let wasAborted = $state(false);
	let pollIntervalId = $state<ReturnType<typeof setInterval> | null>(null);
	
	// 默认模型加载状态
	let defaultModelLoaded = $state(false);

	// 使用 $effect 实现流式更新
	$effect(() => {
		if (!generating || !currentChat) {
			if (pollIntervalId) {
				clearInterval(pollIntervalId);
				pollIntervalId = null;
			}
			return;
		}
		
		// 轮询更新流式内容
		const interval = setInterval(() => {
			if (!currentChat || wasAborted) {
				clearInterval(interval);
				return;
			}
			
			const chat = currentChat;
			if (chat.messages.length > 0) {
				const assistantMsg = chat.messages.find(m => m.role === 'assistant');
				if (assistantMsg) {
					const textParts = assistantMsg.parts?.filter(p => p.type === 'text') || [];
					const text = textParts
						.map(p => (p as { type: 'text'; text: string }).text)
						.join('') || assistantMsg.content || '';
					streamingContent = text;
				}
			}
		}, 50);
		
		pollIntervalId = interval;
		
		return () => {
			clearInterval(interval);
		};
	});

	// 根据类型获取默认模型 ID
	function getDefaultModelId(): string | null {
		switch (type) {
			case 'text': return preferencesStore.defaultTextModelId;
			case 'object': return preferencesStore.defaultObjectModelId;
			case 'file': return preferencesStore.defaultImageModelId;
			default: return preferencesStore.defaultTextModelId;
		}
	}

	// 加载默认模型配置
	async function loadDefaultModel() {
		const defaultModelId = getDefaultModelId();
		if (!defaultModelId || defaultModelLoaded) return;
		
		try {
			const api = authStore.createApi(true);
			const res = await api.ai.getApiAiModelById({ id: defaultModelId });
			
			if (res.data?.data) {
				const model = res.data.data as AIModel;
				modelConfig = {
					id: model.id,
					provider: model.providerId,
					model: model.modelId,
					displayName: model.name
				};
			}
		} catch (err) {
			console.error('Failed to load default model:', err);
		}
		
		defaultModelLoaded = true;
	}

	// 当 prompt prop 变化时更新 instruction
	$effect(() => {
		if (prompt) {
			instruction = prompt;
		}
	});

	// 当打开时重置状态并加载默认模型
	$effect(() => {
		if (open) {
			instruction = prompt;
			idealOutput = defaultIdealOutput;
			results = [];
			streamingContent = '';
			defaultModelLoaded = false;
			modelConfig = undefined;
			// 加载默认模型
			loadDefaultModel();
		}
	});

	// 构建生成消息
	function buildGenerateMessage(): string {
		let message = instruction;
		if (idealOutput.trim()) {
			message += `\n\n参考输出格式或风格：\n${idealOutput}`;
		}
		return message;
	}

	async function handleGenerate() {
		if (!modelConfig || !instruction.trim()) return;
		
		generating = true;
		streamingContent = '';
		wasAborted = false;
		
		try {
			const message = buildGenerateMessage();
			
			// 使用 Chat API 进行生成（无 sessionId，不保存历史）
			const chat = new Chat({
				id: crypto.randomUUID(),
				initialMessages: [],
				transport: new DefaultChatTransport({
					api: `${API_BASE}/api/ai/chat`,
					headers: {
						'Authorization': `Bearer ${authStore.accessToken}`,
					},
					body: {
						modelId: modelConfig.id,
						mcpServerIds:mcpIds
					},
				}),
			});
			
			currentChat = chat;
			
			// 发送消息（不等待完成，让 $effect 处理流式更新）
			chat.sendMessage({ text: message });
			
			// 等待响应完成
			await new Promise<void>((resolve) => {
				const checkReady = setInterval(() => {
					if (wasAborted || chat.status === 'ready' || chat.status === 'error') {
						clearInterval(checkReady);
						resolve();
					}
				}, 100);
				// 超时保护 60 秒
				setTimeout(() => {
					clearInterval(checkReady);
					resolve();
				}, 60000);
			});
			
			// 如果被中断，不保存结果（handleAbort 已处理）
			if (wasAborted) {
				return;
			}
			
			// 获取最终结果
			if (streamingContent.trim()) {
				results = [...results, {
					content: streamingContent,
					version: results.length + 1
				}];
				streamingContent = '';
			} else {
				toast.error('生成结果为空');
			}
		} catch (err) {
			if (!wasAborted) {
				console.error('Generate failed:', err);
				toast.error('生成失败，请检查模型配置');
			}
		} finally {
			if (!wasAborted) {
				generating = false;
				currentChat = null;
			}
		}
	}

	function handleApply() {
		const content = generating ? streamingContent : (results.length > 0 ? results[results.length - 1].content : '');
		if (content && onApply) {
			onApply(content);
			onOpenChange(false);
		}
	}

	function handleCopy() {
		const content = generating ? streamingContent : (results.length > 0 ? results[results.length - 1].content : '');
		if (content) {
			navigator.clipboard.writeText(content);
			toast.success('已复制到剪贴板');
		}
	}

	function handleClose() {
		handleAbort();
		onOpenChange(false);
	}
	
	// 当前显示的内容
	let displayContent = $derived(generating ? streamingContent : (results.length > 0 ? results[results.length - 1].content : ''));
	let hasContent = $derived(displayContent.length > 0 || generating);

	// 中断生成
	function handleAbort() {
		if (currentChat && generating) {
			wasAborted = true;
			currentChat.abort();
			generating = false;
			// 如果有部分内容，保存为结果
			if (streamingContent.trim()) {
				results = [...results, {
					content: streamingContent,
					version: results.length + 1
				}];
			}
			streamingContent = '';
			currentChat = null;
			toast.info('已取消生成');
		}
	}

	// 关闭时自动中断
	function handleCloseWithAbort() {
		handleAbort();
		onOpenChange(false);
	}
</script>

<Dialog.Root bind:open onOpenChange={(v) => { if (!v) handleAbort(); onOpenChange(v); }}>
	<Dialog.Content class="sm:max-w-5xl p-0 gap-0 overflow-hidden" showCloseButton={false}>
		<div class="flex h-[600px]">
			<!-- 左侧面板 -->
			<div class="flex-1 flex flex-col border-r border-border">
				<!-- 头部 -->
				<div class="p-4 pb-3">
					<h2 class="text-lg font-semibold text-primary">{displayTitle}</h2>
					<p class="text-sm text-muted-foreground mt-1">{displayDescription}</p>
				</div>

				<!-- 模型选择器 -->
				<div class="px-4 pb-3">
					<div class="flex items-center gap-2">
						<div class="flex-1">
							<ModelSelector 
								value={modelConfig}
								onValueChange={(v) => modelConfig = v}
								label=""
								required
							/>
						</div>
						<Popover.Root bind:open={configPopoverOpen}>
							<Popover.Trigger>
								{#snippet child({ props })}
									<Button 
										{...props}
										variant="ghost" 
										size="icon"
										class="h-9 w-9 shrink-0"
									>
										<Icon icon="mdi:tune-variant" class="w-4 h-4" />
									</Button>
								{/snippet}
							</Popover.Trigger>
							<Popover.Content class="w-96 p-0" align="end">
								<ScrollArea class="max-h-[400px]">
									<div class="p-4 space-y-4">
										<!-- 模型选择 -->
										<div>
											<div class="text-sm font-medium mb-2">模型</div>
											<ModelSelector 
												value={modelConfig}
												onValueChange={(v) => modelConfig = v}
												label=""
											/>
										</div>
										
										<!-- 参数配置 -->
										<ModelParamsPanel 
											params={modelParams}
											onParamsChange={(p) => modelParams = p}
										/>
									</div>
								</ScrollArea>
							</Popover.Content>
						</Popover.Root>
					</div>
				</div>

				<!-- 指令输入 -->
				<div class="flex-1 flex flex-col px-4 py-3 min-h-0">
					<div class="text-sm font-medium mb-2">指令</div>
					<Textarea
						bind:value={instruction}
						placeholder="输入您的指令..."
						class="flex-1 min-h-[120px] resize-none"
					/>
					<div class="text-xs text-muted-foreground mt-1">
						输入 / 来插入上下文
					</div>
				</div>

				<!-- 理想输出 -->
				<div class="px-4 pb-4">
					<div class="flex items-center gap-1 mb-2">
						<span class="text-sm font-medium">理想输出</span>
						<span class="text-xs text-muted-foreground">(可选)</span>
					</div>
					<div class="h-[80px]">
						<Textarea
							bind:value={idealOutput}
							placeholder={displayIdealPlaceholder}
							class="h-full resize-none overflow-y-auto"
						/>
					</div>
				</div>

				<!-- 底部按钮 -->
				<div class="px-4 pb-4 flex justify-end gap-2">
					<Button variant="outline" onclick={handleClose}>
						取消
					</Button>
					{#if generating}
						<Button variant="destructive" onclick={handleAbort}>
							<Icon icon="mdi:stop" class="w-4 h-4 mr-1.5" />
							停止
						</Button>
					{:else}
						<Button 
							onclick={handleGenerate}
							disabled={!modelConfig || !instruction.trim()}
						>
							<Icon icon="mdi:sparkles" class="w-4 h-4 mr-1.5" />
							生成
						</Button>
					{/if}
				</div>
			</div>

			<!-- 右侧结果面板 -->
			<div class="w-[400px] flex flex-col bg-muted/30 min-h-0">
				{#if hasContent}
					<!-- 结果头部 -->
					<div class="p-4 flex items-center justify-between border-b border-border shrink-0">
						<div>
							<h3 class="font-medium">生成的提示词</h3>
							<p class="text-xs text-muted-foreground">
								{#if generating}
									<span class="flex items-center gap-1">
										<Icon icon="mdi:loading" class="w-3 h-3 animate-spin" />
										生成中...
									</span>
								{:else}
									版本 {currentVersion} · 最新
								{/if}
							</p>
						</div>
						<div class="flex items-center gap-1">
							<Button variant="ghost" size="icon" class="h-8 w-8" onclick={handleCopy} disabled={!displayContent}>
								<Icon icon="mdi:content-copy" class="w-4 h-4" />
							</Button>
							<Button size="sm" onclick={handleApply} disabled={!displayContent}>
								应用
							</Button>
						</div>
					</div>

					<!-- 结果内容 -->
					<div class="flex-1 min-h-0 overflow-y-auto">
						<div class="p-4">
							<pre class="text-sm whitespace-pre-wrap font-mono break-words">{displayContent}{#if generating}<span class="animate-pulse">▌</span>{/if}</pre>
						</div>
					</div>
				{:else}
					<!-- 空状态 -->
					<div class="flex-1 flex flex-col items-center justify-center text-muted-foreground">
						<Icon icon="mdi:sparkles" class="w-10 h-10 mb-3 opacity-50" />
						<p class="text-sm">在左侧描述您的用例，点击生成查看结果。</p>
					</div>
				{/if}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
