<script lang="ts">
	import { onMount } from 'svelte';
	import { 
		getEditor,
		convertToMarkdownString,
		convertFromMarkdownString
	} from 'svelte-lexical';
	import { NOTE_TRANSFORMERS } from './lexical-utils.js';

	interface Props {
		initialContent?: string;
		onContentChange?: (markdown: string) => void;
	}

	let { initialContent = '', onContentChange }: Props = $props();

	const editor = getEditor();
	let isInitialized = false;

	onMount(() => {
		// 加载初始内容
		if (initialContent) {
			editor.update(() => {
				convertFromMarkdownString(initialContent, NOTE_TRANSFORMERS);
			});
		}
		isInitialized = true;

		// 监听内容变化
		const removeListener = editor.registerUpdateListener(({ editorState }) => {
			if (!isInitialized) return;
			
			editor.read(() => {
				const markdown = convertToMarkdownString(NOTE_TRANSFORMERS);
				onContentChange?.(markdown);
			});
		});

		return () => {
			removeListener();
		};
	});
</script>
