<script lang="ts">
	import { onMount } from 'svelte';
	import { VariableSelectorList } from '../VariableSelector/index.js';
	import type { Variable } from '../VariableSelector/types.js';
	import { parseContent, createVariableTag } from './types.js';

	interface Props {
		/** Text value with variable tags */
		value?: string;
		/** Change callback */
		onValueChange?: (value: string) => void;
		/** Placeholder text */
		placeholder?: string;
		/** Minimum rows */
		rows?: number;
		/** Whether disabled */
		disabled?: boolean;
		/** Filter variable types */
		filterTypes?: string[];
		/** Custom class */
		class?: string;
	}

	let {
		value = '',
		onValueChange,
		placeholder = '输入内容，输入 { 或 / 插入变量',
		rows = 2,
		disabled = false,
		filterTypes,
		class: className = ''
	}: Props = $props();

	let editorRef = $state<HTMLDivElement | null>(null);
	let popoverOpen = $state(false);
	let popoverPosition = $state({ top: 0, left: 0 });
	let popoverRef = $state<HTMLDivElement | null>(null);
	let triggerInfo = $state<{ node: Text; startOffset: number; endOffset: number } | null>(null);
	let isInternalUpdate = false;

	// Portal action - move element to body
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}

	// Get text content from editor (converting tags to {{#path#}} format)
	function getEditorContent(): string {
		if (!editorRef) return '';
		
		let text = '';
		const childNodes = editorRef.childNodes;
		
		for (const node of childNodes) {
			if (node.nodeType === Node.TEXT_NODE) {
				text += node.textContent || '';
			} else if (node instanceof HTMLElement) {
				if (node.classList.contains('variable-tag')) {
					const path = node.dataset.path;
					if (path) {
						text += createVariableTag(path);
					}
				} else if (node.tagName === 'BR') {
					text += '\n';
				}
			}
		}
		
		return text;
	}

	// Render value to editor HTML
	function renderToEditor() {
		if (!editorRef || isInternalUpdate) return;
		
		const segments = parseContent(value);
		editorRef.innerHTML = '';
		
		for (const segment of segments) {
			if (segment.type === 'variable' && segment.path) {
				const tag = createVariableTagElement(segment.path);
				editorRef.appendChild(tag);
			} else {
				// Handle newlines
				const lines = segment.content.split('\n');
				lines.forEach((line, i) => {
					if (line) {
						editorRef.appendChild(document.createTextNode(line));
					}
					if (i < lines.length - 1) {
						editorRef.appendChild(document.createElement('br'));
					}
				});
			}
		}
	}

	// Create variable tag element
	function createVariableTagElement(path: string): HTMLSpanElement {
		const span = document.createElement('span');
		span.className = 'variable-tag inline-flex items-center gap-0.5 px-1.5 py-0.5 mx-0.5 rounded bg-primary/10 text-primary text-xs font-mono whitespace-nowrap';
		span.contentEditable = 'false';
		span.dataset.path = path;
		
		// Icon
		const icon = document.createElement('span');
		icon.className = 'w-3 h-3 flex-shrink-0';
		icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3"><path d="M7 4V2H17V4H20.0066C20.5552 4 21 4.44495 21 4.9934V21.0066C21 21.5552 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5551 3 21.0066V4.9934C3 4.44476 3.44495 4 3.9934 4H7ZM7 6H5V20H19V6H17V8H7V6ZM9 4V6H15V4H9Z"/></svg>';
		span.appendChild(icon);
		
		// Path text
		const text = document.createElement('span');
		text.textContent = path;
		span.appendChild(text);
		
		return span;
	}

	// Sync editor content to value
	function syncToValue() {
		const content = getEditorContent();
		if (content !== value) {
			isInternalUpdate = true;
			onValueChange?.(content);
			// Reset flag after a tick
			setTimeout(() => { isInternalUpdate = false; }, 0);
		}
	}

	// Handle input events
	function handleInput() {
		syncToValue();
		checkTrigger();
	}

	// Check for trigger characters
	function checkTrigger() {
		const selection = window.getSelection();
		if (!selection || !selection.rangeCount) return;
		
		const range = selection.getRangeAt(0);
		if (!range.collapsed) return;
		
		const node = range.startContainer;
		if (node.nodeType !== Node.TEXT_NODE) return;
		
		const textNode = node as Text;
		const text = textNode.textContent || '';
		const offset = range.startOffset;
		
		// Check for { or /
		if (offset >= 1 && text.charAt(offset - 1) === '{') {
			triggerInfo = { node: textNode, startOffset: offset - 1, endOffset: offset };
			showPopover(range);
		} else if (offset >= 1 && text.charAt(offset - 1) === '/') {
			triggerInfo = { node: textNode, startOffset: offset - 1, endOffset: offset };
			showPopover(range);
		}
	}

	// Show variable selector popover
	function showPopover(range: Range) {
		const rect = range.getBoundingClientRect();
		
		popoverPosition = {
			top: rect.bottom + 4,
			left: rect.left
		};
		
		popoverOpen = true;
	}

	// Handle variable selection
	function handleVariableSelect(variable: Variable) {
		if (!editorRef || !triggerInfo) return;
		
		const { node, startOffset, endOffset } = triggerInfo;
		
		// Check if node is still in editor
		if (!editorRef.contains(node)) {
			popoverOpen = false;
			triggerInfo = null;
			return;
		}
		
		const text = node.textContent || '';
		const before = text.slice(0, startOffset);
		const after = text.slice(endOffset);
		
		// Create variable tag
		const tag = createVariableTagElement(variable.path);
		
		// Get parent and position
		const parent = node.parentNode;
		if (!parent) return;
		
		// Replace: before text + tag + after text
		if (before) {
			const beforeNode = document.createTextNode(before);
			parent.insertBefore(beforeNode, node);
		}
		
		parent.insertBefore(tag, node);
		
		if (after) {
			const afterNode = document.createTextNode(after);
			parent.insertBefore(afterNode, node);
		}
		
		// Remove original text node
		parent.removeChild(node);
		
		// Move cursor after the tag
		const selection = window.getSelection();
		if (selection) {
			const newRange = document.createRange();
			newRange.setStartAfter(tag);
			newRange.collapse(true);
			selection.removeAllRanges();
			selection.addRange(newRange);
		}
		
		// Close popover and sync
		popoverOpen = false;
		triggerInfo = null;
		syncToValue();
		editorRef.focus();
	}

	// Handle keydown
	function handleKeydown(e: KeyboardEvent) {
		if (popoverOpen && e.key === 'Escape') {
			e.preventDefault();
			popoverOpen = false;
			triggerInfo = null;
		}
	}

	// Handle paste - strip formatting
	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const text = e.clipboardData?.getData('text/plain') || '';
		document.execCommand('insertText', false, text);
	}

	// Handle blur
	function handleBlur(e: FocusEvent) {
		const relatedTarget = e.relatedTarget as HTMLElement | null;
		if (relatedTarget && popoverRef?.contains(relatedTarget)) {
			return;
		}
		
		setTimeout(() => {
			if (!popoverOpen) {
				syncToValue();
			}
		}, 150);
	}

	// Close popover when clicking outside
	function handleDocumentClick(e: MouseEvent) {
		if (!popoverOpen) return;
		
		const target = e.target as HTMLElement;
		if (popoverRef?.contains(target) || editorRef?.contains(target)) {
			return;
		}
		
		popoverOpen = false;
		triggerInfo = null;
	}

	// Initial render on mount
	onMount(() => {
		renderToEditor();
	});

	// Re-render when value changes externally
	$effect(() => {
		if (!isInternalUpdate && editorRef) {
			// Only re-render if value actually changed from external source
			const currentContent = getEditorContent();
			if (value !== currentContent) {
				renderToEditor();
			}
		}
	});

	// Document click listener
	$effect(() => {
		if (popoverOpen) {
			document.addEventListener('click', handleDocumentClick, true);
			return () => {
				document.removeEventListener('click', handleDocumentClick, true);
			};
		}
	});
</script>

<div class="variable-tag-editor {className}">
	<!-- Editor - textarea style -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		bind:this={editorRef}
		class="editor w-full p-2 text-sm border border-input rounded-md bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 overflow-auto whitespace-pre-wrap break-words"
		style="min-height: {rows * 1.5 + 1}rem;"
		class:opacity-50={disabled}
		class:pointer-events-none={disabled}
		contenteditable={!disabled}
		role="textbox"
		tabindex="0"
		data-placeholder={placeholder}
		oninput={handleInput}
		onkeydown={handleKeydown}
		onpaste={handlePaste}
		onfocusout={handleBlur}
	></div>

	<!-- Variable Selector Popover - Portal to body -->
	{#if popoverOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			use:portal
			bind:this={popoverRef}
			class="fixed bg-popover border border-border rounded-lg shadow-lg w-72"
			style="top: {popoverPosition.top}px; left: {popoverPosition.left}px; z-index: 9999;"
			onclick={(e) => e.stopPropagation()}
			onmousedown={(e) => e.preventDefault()}
		>
			<VariableSelectorList
				onSelect={handleVariableSelect}
				{filterTypes}
			/>
		</div>
	{/if}
</div>

<style>
	.editor:empty::before {
		content: attr(data-placeholder);
		color: hsl(var(--muted-foreground));
		pointer-events: none;
	}
	
	.editor:focus:empty::before {
		content: attr(data-placeholder);
	}
	
	/* Variable tag styles */
	:global(.variable-tag) {
		user-select: none;
		cursor: default;
	}
	
	:global(.variable-tag:hover) {
		background-color: hsl(var(--primary) / 0.15);
	}
</style>
