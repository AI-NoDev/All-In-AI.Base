<script lang="ts">
	import { 
		Composer, 
		ContentEditable, 
		RichTextPlugin, 
		ListPlugin, 
		LinkPlugin, 
		HistoryPlugin,
		AutoFocusPlugin,
		MarkdownShortcutPlugin,
		ListNode,
		ListItemNode,
		LinkNode
	} from 'svelte-lexical';
	import NoteToolbar from './NoteToolbar.svelte';
	import FormatStateTracker from './FormatStateTracker.svelte';
	import MarkdownSyncInner from './MarkdownSyncInner.svelte';
	import FloatingLinkEditor from './FloatingLinkEditor.svelte';
	import { NOTE_TRANSFORMERS } from './lexical-utils.js';
	import type { NoteColor, NoteColorConfig } from '../types.js';

	interface FormatState {
		isBold: boolean;
		isItalic: boolean;
		isStrikethrough: boolean;
		isCode: boolean;
		isList: boolean;
		isLink: boolean;
		fontSize: number | null;
	}

	interface Props {
		colorConfig: NoteColorConfig;
		currentColor: NoteColor;
		showAuthor: boolean;
		showToolbar?: boolean;
		/** 初始 Markdown 内容 */
		initialContent?: string;
		onBlur?: (e: FocusEvent) => void;
		onColorChange: (color: NoteColor) => void;
		onAuthorToggle: (show: boolean) => void;
		/** 内容变化回调，返回 Markdown 字符串 */
		onContentChange?: (markdown: string) => void;
		onCopy?: () => void;
		onDuplicate?: () => void;
		onDelete?: () => void;
	}

	let { 
		colorConfig, 
		currentColor,
		showAuthor,
		showToolbar = false,
		initialContent = '',
		onBlur,
		onColorChange,
		onAuthorToggle,
		onContentChange,
		onCopy,
		onDuplicate,
		onDelete
	}: Props = $props();

	// 格式状态
	let isBold = $state(false);
	let isItalic = $state(false);
	let isStrikethrough = $state(false);
	let isCode = $state(false);
	let isList = $state(false);
	let isLink = $state(false);
	let fontSize = $state<number | null>(null);

	// 主题配置
	const noteTheme = {
		paragraph: 'note-paragraph',
		text: {
			bold: 'note-bold',
			italic: 'note-italic',
			strikethrough: 'note-strikethrough',
			underline: 'note-underline',
			code: 'note-code'
		},
		link: 'note-link',
		list: {
			ul: 'note-ul',
			ol: 'note-ol',
			listitem: 'note-li',
			nested: {
				listitem: 'note-li-nested'
			}
		}
	};

	const initialConfig = {
		namespace: 'NoteEditor',
		theme: noteTheme,
		nodes: [ListNode, ListItemNode, LinkNode],
		onError: (error: Error) => {
			console.error('Lexical error:', error);
		}
	};

	function handleBlur(e: FocusEvent) {
		onBlur?.(e);
	}

	function handleFormatChange(state: FormatState) {
		isBold = state.isBold;
		isItalic = state.isItalic;
		isStrikethrough = state.isStrikethrough;
		isCode = state.isCode;
		isList = state.isList;
		isLink = state.isLink;
		fontSize = state.fontSize;
	}
</script>

<div class="rich-text-editor h-full flex flex-col relative">
	<Composer {initialConfig}>
		<!-- 格式状态追踪器 -->
		<FormatStateTracker onFormatChange={handleFormatChange} />
		
		<!-- Markdown 内容同步组件 -->
		<MarkdownSyncInner {initialContent} {onContentChange} />
		
		<!-- Toolbar 始终渲染，通过 CSS 控制显示 -->
		<div 
			class="absolute -top-10 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-150"
			class:opacity-0={!showToolbar}
			class:pointer-events-none={!showToolbar}
			class:opacity-100={showToolbar}
		>
			<NoteToolbar 
				{colorConfig} 
				{currentColor}
				{showAuthor}
				{isBold}
				{isItalic}
				{isStrikethrough}
				{isCode}
				{isList}
				{isLink}
				{fontSize}
				{onColorChange}
				{onAuthorToggle}
				{onCopy} 
				{onDuplicate} 
				{onDelete} 
			/>
		</div>
		
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div 
			class="editor-container flex-1 overflow-auto p-3 nowheel"
			class:nodrag={showToolbar}
			class:nopan={showToolbar}
			onfocusout={handleBlur}
		>
			<div class="outline-none min-h-full">
				<ContentEditable />
			</div>
		</div>
		
		<RichTextPlugin />
		<ListPlugin />
		<LinkPlugin />
		<HistoryPlugin />
		<MarkdownShortcutPlugin transformers={NOTE_TRANSFORMERS} />
		{#if showToolbar}
			<AutoFocusPlugin />
		{/if}
		<!-- FloatingLinkEditor 始终渲染，用于点击链接时显示编辑弹窗 -->
		<FloatingLinkEditor />
	</Composer>
</div>

<style>
	:global(.note-paragraph) {
		margin: 0;
		line-height: 1.6;
	}
	:global(.note-bold) {
		font-weight: 600 !important;
	}
	:global(.note-italic) {
		font-style: italic !important;
	}
	:global(.note-strikethrough) {
		text-decoration: line-through !important;
	}
	:global(.note-underline) {
		text-decoration: underline !important;
	}
	/* Tag/Code 使用 Markdown 行内代码样式 */
	:global(.note-code) {
		background-color: rgba(0, 0, 0, 0.06) !important;
		padding: 0.2em 0.4em !important;
		border-radius: 4px !important;
		font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace !important;
		font-size: 0.875em !important;
	}
	/* 链接样式 - 主题色文字带下划线 */
	:global(.note-link) {
		color: #2563eb !important;
		text-decoration: underline !important;
		text-underline-offset: 2px !important;
		cursor: pointer !important;
	}
	:global(.note-link:hover) {
		color: #1d4ed8 !important;
	}
	/* 列表样式 */
	:global(.note-ul) {
		margin: 0.5em 0 !important;
		padding-left: 1.5em !important;
		list-style-type: disc !important;
		display: block !important;
	}
	:global(.note-ol) {
		margin: 0.5em 0 !important;
		padding-left: 1.5em !important;
		list-style-type: decimal !important;
		display: block !important;
	}
	:global(.note-li) {
		margin: 0.25em 0 !important;
		display: list-item !important;
	}
	:global(.note-li-nested) {
		margin-left: 1em !important;
	}
</style>
