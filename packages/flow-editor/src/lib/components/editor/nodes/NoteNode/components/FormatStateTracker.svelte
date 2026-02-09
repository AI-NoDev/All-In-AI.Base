<script lang="ts">
	import { getEditor, ListNode, ListItemNode, LinkNode } from 'svelte-lexical';
	import { onMount } from 'svelte';
	import type { LexicalNode } from './lexical-utils.js';

	interface FormatState {
		isBold: boolean;
		isItalic: boolean;
		isStrikethrough: boolean;
		isCode: boolean;
		isList: boolean;
		isLink: boolean;
		fontSize: number | null;
	}

	interface SelectionWithFormat {
		hasFormat: (format: string) => boolean;
		anchor: { getNode: () => LexicalNode };
		getNodes: () => Array<LexicalNode & { getStyle?: () => string }>;
	}

	interface Props {
		onFormatChange: (state: FormatState) => void;
	}

	let { onFormatChange }: Props = $props();

	const editor = getEditor();

	onMount(() => {
		const unregisterUpdate = editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				updateFormatState();
			});
		});

		editor.getEditorState().read(() => {
			updateFormatState();
		});

		return unregisterUpdate;
	});

	function updateFormatState() {
		const editorState = editor.getEditorState();
		const selection = editorState._selection;
		
		const state: FormatState = {
			isBold: false,
			isItalic: false,
			isStrikethrough: false,
			isCode: false,
			isList: false,
			isLink: false,
			fontSize: null
		};

		if (!selection || !('hasFormat' in selection) || !('anchor' in selection) || !('getNodes' in selection)) {
			onFormatChange(state);
			return;
		}

		const sel = selection as SelectionWithFormat;

		state.isBold = sel.hasFormat('bold');
		state.isItalic = sel.hasFormat('italic');
		state.isStrikethrough = sel.hasFormat('strikethrough');
		state.isCode = sel.hasFormat('code');

		// Check if in list
		try {
			let parent: unknown = sel.anchor.getNode();
			while (parent) {
				if (parent instanceof ListNode || parent instanceof ListItemNode) {
					state.isList = true;
					break;
				}
				parent = (parent as LexicalNode).getParent?.() ?? null;
			}
		} catch {
			// Ignore errors
		}

		// Check if is link
		try {
			for (const node of sel.getNodes()) {
				if (node instanceof LinkNode || node.getParent?.() instanceof LinkNode) {
					state.isLink = true;
					break;
				}
			}
		} catch {
			// Ignore errors
		}

		// Get font size
		try {
			const nodes = sel.getNodes();
			if (nodes.length > 0 && nodes[0].getStyle) {
				const match = nodes[0].getStyle()?.match(/font-size:\s*(\d+)px/);
				if (match) {
					state.fontSize = parseInt(match[1], 10);
				}
			}
		} catch {
			// Ignore errors
		}

		onFormatChange(state);
	}
</script>
