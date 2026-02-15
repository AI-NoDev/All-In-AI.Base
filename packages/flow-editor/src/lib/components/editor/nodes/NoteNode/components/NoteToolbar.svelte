<script lang="ts">
	import Icon from '@iconify/svelte';
	import { 
		getEditor, 
		toggleBold, 
		toggleItalic, 
		toggleStrikethrough,
		formatBulletList,
		updateFontSize,
		sanitizeUrl,
		LinkNode,
		$createLinkNode as createLinkNode,
		$createTextNode as createTextNode,
		$getSelection as getSelection
	} from 'svelte-lexical';
	import { Button } from '@qiyu-allinai/ui/components/button/index.js';
	import { Input } from '@qiyu-allinai/ui/components/input/index.js';
	import * as DropdownMenu from '@qiyu-allinai/ui/components/dropdown-menu';
	import * as Popover from '@qiyu-allinai/ui/components/popover';
	import { Switch } from '@qiyu-allinai/ui/components/switch';
	import { Label } from '@qiyu-allinai/ui/components/label';
	import type { NoteColor, NoteColorConfig } from '../types.js';
	import { NOTE_COLORS } from '../types.js';
	import { isRangeSelection, type LexicalNode, type AppendableNode } from './lexical-utils.js';

	// 字体大小配置 - 使用像素值
	const FONT_SIZES = [
		{ value: 12, label: '小', class: 'text-xs' },
		{ value: 14, label: '中', class: 'text-sm' },
		{ value: 18, label: '大', class: 'text-lg' }
	];

	interface Props {
		colorConfig: NoteColorConfig;
		currentColor: NoteColor;
		showAuthor: boolean;
		isBold?: boolean;
		isItalic?: boolean;
		isStrikethrough?: boolean;
		isCode?: boolean;
		isList?: boolean;
		isLink?: boolean;
		fontSize?: number | null;
		onColorChange: (color: NoteColor) => void;
		onAuthorToggle: (show: boolean) => void;
		onCopy?: () => void;
		onDuplicate?: () => void;
		onDelete?: () => void;
	}

	let { 
		colorConfig, 
		currentColor,
		showAuthor,
		isBold = false,
		isItalic = false,
		isStrikethrough = false,
		isCode = false,
		isList = false,
		isLink = false,
		fontSize = null,
		onColorChange, 
		onAuthorToggle,
		onCopy, 
		onDuplicate, 
		onDelete 
	}: Props = $props();

	const editor = getEditor();

	let colorPopoverOpen = $state(false);
	let fontSizeOpen = $state(false);
	let linkPopoverOpen = $state(false);
	let linkUrl = $state('https://');
	let selectedText = $state('');

	// 根据当前字体大小找到对应的配置
	let currentFontSizeConfig = $derived(() => {
		if (fontSize) {
			const found = FONT_SIZES.find(s => s.value === fontSize);
			if (found) return found;
		}
		return FONT_SIZES[1]; // 默认中
	});

	function handleBold() {
		editor.focus();
		toggleBold(editor);
	}

	function handleItalic() {
		editor.focus();
		toggleItalic(editor);
	}

	function handleStrikethrough() {
		editor.focus();
		toggleStrikethrough(editor);
	}

	function handleBulletList() {
		editor.focus();
		// formatBulletList: 如果 blockType === 'bullet' 则转为段落，否则创建列表
		formatBulletList(editor, isList ? 'bullet' : 'paragraph');
	}

	function handleLinkClick() {
		if (isLink) {
			// 如果已经是链接，直接移除
			removeLink();
		} else {
			// 打开链接配置弹窗
			editor.getEditorState().read(() => {
				const selection = getSelection();
				if (isRangeSelection(selection)) {
					selectedText = selection.getTextContent();
				}
			});
			linkUrl = 'https://';
			linkPopoverOpen = true;
		}
	}

	function removeLink() {
		editor.focus();
		editor.update(() => {
			const selection = getSelection();
			if (!isRangeSelection(selection)) return;
			
			const nodes = selection.getNodes();
			for (const node of nodes) {
				const parent = node.getParent();
				if (parent instanceof LinkNode && parent.getChildren) {
					const children = parent.getChildren();
					for (const child of children) {
						parent.insertBefore(child);
					}
					parent.remove();
				}
			}
		});
	}

	function handleInsertLink() {
		if (!linkUrl || linkUrl === 'https://') return;
		
		linkPopoverOpen = false;
		editor.focus();
		editor.update(() => {
			const selection = getSelection();
			if (!isRangeSelection(selection)) return;
			
			const text = selection.getTextContent() || linkUrl;
			const url = sanitizeUrl(linkUrl);
			const linkNode = createLinkNode(url) as unknown as AppendableNode;
			const textNode = createTextNode(text) as unknown as LexicalNode;
			linkNode.append(textNode);
			selection.insertNodes([linkNode]);
		});
		linkUrl = 'https://';
	}

	function handleLinkKeydown(e: KeyboardEvent) {
		// 阻止所有键盘事件冒泡到 Lexical 编辑器
		e.stopPropagation();
		
		// 如果正在进行 IME 组合输入（如中文拼音），不处理回车
		if (e.isComposing) {
			return;
		}
		
		if (e.key === 'Enter') {
			e.preventDefault();
			handleInsertLink();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			linkPopoverOpen = false;
		}
	}

	// 阻止事件冒泡到 Lexical 编辑器
	function stopKeyboardPropagation(e: Event) {
		e.stopPropagation();
	}

	function handleCode() {
		editor.focus();
		editor.update(() => {
			const selection = getSelection();
			if (!isRangeSelection(selection)) return;
			// 使用 selection.formatText 来切换 code 格式
			selection.formatText('code');
		});
	}

	function handleFontSize(size: { value: number; label: string }) {
		fontSizeOpen = false;
		editor.focus();
		updateFontSize(editor, size.value);
	}

	// 阻止事件冒泡，防止失去焦点
	function preventBlur(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
	class="note-toolbar flex items-center gap-0.5 px-2 py-1 bg-popover border border-border rounded-lg shadow-lg"
	onmousedown={preventBlur}
>
	<!-- 背景色选择器 -->
	<Popover.Root bind:open={colorPopoverOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button 
					{...props}
					variant="ghost" 
					size="icon" 
					class="h-7 w-7 p-0"
					onmousedown={preventBlur}
				>
					<div 
						class="w-5 h-5 rounded border border-border/50"
						style:background-color={colorConfig.dot}
					></div>
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-2" side="top">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="flex gap-1.5" onmousedown={preventBlur}>
				{#each NOTE_COLORS as colorOption (colorOption.value)}
					<button
						type="button"
						class="w-6 h-6 rounded-full transition-transform hover:scale-110 {currentColor === colorOption.value ? 'ring-2 ring-offset-1 ring-foreground/50' : ''}"
						style:background-color={colorOption.dot}
						onmousedown={preventBlur}
						onclick={() => { onColorChange(colorOption.value); colorPopoverOpen = false; }}
						title={colorOption.label}
					></button>
				{/each}
			</div>
		</Popover.Content>
	</Popover.Root>

	<div class="w-px h-4 bg-border mx-1"></div>

	<!-- 字体大小 -->
	<DropdownMenu.Root bind:open={fontSizeOpen}>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="sm" class="h-7 px-2 text-xs gap-0.5" onmousedown={preventBlur}>
					<span>{currentFontSizeConfig().label}</span>
					<Icon icon="mdi:chevron-down" width="12" height="12" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="min-w-[60px]">
			{#each FONT_SIZES as size (size.value)}
				<DropdownMenu.Item 
					class={fontSize === size.value ? 'bg-accent' : ''}
					onmousedown={preventBlur}
					onclick={() => handleFontSize(size)}
				>
					<span class={size.class}>{size.label}</span>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<div class="w-px h-4 bg-border mx-1"></div>

	<!-- 粗体 -->
	<Button 
		variant="ghost" 
		size="icon" 
		class="h-7 w-7 {isBold ? 'bg-accent text-accent-foreground' : ''}" 
		onclick={handleBold} 
		onmousedown={preventBlur}
	>
		<Icon icon="mdi:format-bold" width="16" height="16" />
	</Button>

	<!-- 斜体 -->
	<Button 
		variant="ghost" 
		size="icon" 
		class="h-7 w-7 {isItalic ? 'bg-accent text-accent-foreground' : ''}" 
		onclick={handleItalic} 
		onmousedown={preventBlur}
	>
		<Icon icon="mdi:format-italic" width="16" height="16" />
	</Button>

	<!-- 删除线 -->
	<Button 
		variant="ghost" 
		size="icon" 
		class="h-7 w-7 {isStrikethrough ? 'bg-accent text-accent-foreground' : ''}" 
		onclick={handleStrikethrough} 
		onmousedown={preventBlur}
	>
		<Icon icon="mdi:format-strikethrough" width="16" height="16" />
	</Button>

	<!-- 链接 -->
	<Popover.Root bind:open={linkPopoverOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button 
					{...props}
					variant="ghost" 
					size="icon" 
					class="h-7 w-7 {isLink ? 'bg-accent text-accent-foreground' : ''}" 
					onclick={handleLinkClick}
					onmousedown={preventBlur}
				>
					<Icon icon="mdi:link-variant" width="16" height="16" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content 
			class="w-72 p-3" 
			side="top" 
			onmousedown={preventBlur}
			onkeydown={stopKeyboardPropagation}
			onkeyup={stopKeyboardPropagation}
			onkeypress={stopKeyboardPropagation}
			oninput={stopKeyboardPropagation}
		>
			<div class="space-y-3">
				<div class="space-y-1.5">
					<Label class="text-xs text-muted-foreground">链接地址</Label>
					<Input 
						type="url"
						placeholder="https://example.com"
						bind:value={linkUrl}
						onkeydown={handleLinkKeydown}
						class="h-8 text-sm"
					/>
				</div>
				{#if selectedText}
					<p class="text-xs text-muted-foreground">
						选中文本: <span class="font-medium text-foreground">{selectedText}</span>
					</p>
				{/if}
				<div class="flex justify-end gap-2">
					<Button 
						variant="ghost" 
						size="sm" 
						class="h-7"
						onclick={() => { linkPopoverOpen = false; }}
					>
						取消
					</Button>
					<Button 
						size="sm" 
						class="h-7"
						onclick={handleInsertLink}
						disabled={!linkUrl || linkUrl === 'https://'}
					>
						确定
					</Button>
				</div>
			</div>
		</Popover.Content>
	</Popover.Root>

	<!-- 列表 -->
	<Button 
		variant="ghost" 
		size="icon" 
		class="h-7 w-7 {isList ? 'bg-accent text-accent-foreground' : ''}" 
		onclick={handleBulletList} 
		onmousedown={preventBlur}
	>
		<Icon icon="mdi:format-list-bulleted" width="16" height="16" />
	</Button>

	<!-- Tag (行内代码) -->
	<Button 
		variant="ghost" 
		size="icon" 
		class="h-7 w-7 {isCode ? 'bg-accent text-accent-foreground' : ''}" 
		onclick={handleCode}
		onmousedown={preventBlur}
	>
		<Icon icon="mdi:code-tags" width="16" height="16" />
	</Button>

	<div class="w-px h-4 bg-border mx-1"></div>

	<!-- 更多菜单 -->
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon" class="h-7 w-7" onmousedown={preventBlur}>
					<Icon icon="mdi:dots-horizontal" width="16" height="16" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="min-w-[160px]">
			<DropdownMenu.Item onclick={onCopy}>
				<Icon icon="mdi:content-copy" width="14" height="14" class="mr-2" />
				拷贝
				<DropdownMenu.Shortcut>⌘C</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={onDuplicate}>
				<Icon icon="mdi:content-duplicate" width="14" height="14" class="mr-2" />
				复制
				<DropdownMenu.Shortcut>⌘D</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<div class="flex items-center justify-between px-2 py-1.5">
				<Label for="show-author" class="text-sm font-normal cursor-pointer">显示作者</Label>
				<Switch 
					id="show-author"
					checked={showAuthor}
					onCheckedChange={onAuthorToggle}
				/>
			</div>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={onDelete} class="text-destructive focus:text-destructive">
				<Icon icon="mdi:delete" width="14" height="14" class="mr-2" />
				删除
				<DropdownMenu.Shortcut>Del</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
</div>
