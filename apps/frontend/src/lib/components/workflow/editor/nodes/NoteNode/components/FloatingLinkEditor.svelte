<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Icon from '@iconify/svelte';
	import { getEditor, LinkNode, sanitizeUrl } from 'svelte-lexical';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	interface LinkInfo {
		url: string;
		text: string;
		linkNode: InstanceType<typeof LinkNode>;
		linkElement: HTMLElement;
	}

	const editor = getEditor();

	let linkInfo = $state<LinkInfo | null>(null);
	let isEditing = $state(false);
	let editUrl = $state('');
	let inputRef = $state<HTMLInputElement | null>(null);
	let position = $state({ top: 0, left: 0 });
	let tooltipElement: HTMLDivElement | null = null;

	// Portal action - 将元素移动到 body 以避免 xyflow transform 影响定位
	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}

	// 绑定 tooltip 元素引用
	function bindTooltip(node: HTMLDivElement) {
		tooltipElement = node;
		tick().then(() => requestAnimationFrame(updatePosition));
		return {
			destroy() {
				tooltipElement = null;
			}
		};
	}

	// 计算 tooltip 位置（显示在链接上方居中）
	function updatePosition() {
		if (!linkInfo?.linkElement || !tooltipElement) return;

		const linkRect = linkInfo.linkElement.getBoundingClientRect();
		const tooltipRect = tooltipElement.getBoundingClientRect();
		const padding = 8;

		let left = linkRect.left + linkRect.width / 2 - tooltipRect.width / 2;
		let top = linkRect.top - tooltipRect.height - 8;

		// 边界检查
		left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));
		if (top < padding) {
			top = linkRect.bottom + 8;
		}

		position = { top, left };
	}

	// 在编辑器状态中查找匹配的 LinkNode
	function findLinkInfo(url: string, text: string, linkElement: HTMLElement): LinkInfo | null {
		let result: LinkInfo | null = null;

		editor.read(() => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const nodeMap = (editor.getEditorState() as any)._nodeMap as Map<string, unknown>;
			nodeMap.forEach((node) => {
				if (node instanceof LinkNode) {
					const nodeUrl = node.getURL();
					const nodeText = node.getTextContent();
					// 优先匹配 URL
					if (nodeUrl === url || (!result && nodeText === text)) {
						result = { url: nodeUrl, text: nodeText, linkNode: node, linkElement };
					}
				}
			});
		});

		return result;
	}

	// 关闭 tooltip
	function closeTooltip() {
		linkInfo = null;
		isEditing = false;
	}

	// 监听点击事件
	onMount(() => {
		function handleClick(e: MouseEvent) {
			const target = e.target as HTMLElement;
			const linkElement = target.closest('a.note-link') as HTMLElement | null;

			if (linkElement) {
				e.preventDefault();
				e.stopPropagation();

				const url = linkElement.getAttribute('href') || '';
				const text = linkElement.textContent || '';
				const info = findLinkInfo(url, text, linkElement);

				if (info) {
					linkInfo = info;
					isEditing = false;
					tick().then(() => requestAnimationFrame(updatePosition));
				}
			} else if (!target.closest('.floating-link-editor')) {
				closeTooltip();
			}
		}

		function handleViewportChange() {
			if (linkInfo) updatePosition();
		}

		document.addEventListener('click', handleClick, true);
		window.addEventListener('scroll', handleViewportChange, true);
		window.addEventListener('resize', handleViewportChange);

		return () => {
			document.removeEventListener('click', handleClick, true);
			window.removeEventListener('scroll', handleViewportChange, true);
			window.removeEventListener('resize', handleViewportChange);
		};
	});

	// 编辑模式切换时更新位置和焦点
	$effect(() => {
		if (linkInfo && isEditing) {
			tick().then(() => {
				requestAnimationFrame(updatePosition);
				inputRef?.focus();
			});
		}
	});

	function handleOpenLink() {
		if (linkInfo?.url) {
			window.open(linkInfo.url, '_blank', 'noopener,noreferrer');
		}
		closeTooltip();
	}

	function handleEditLink() {
		if (linkInfo) {
			editUrl = linkInfo.url;
			isEditing = true;
		}
	}

	function handleSaveLink() {
		if (!linkInfo || !editUrl) return;

		const currentLinkInfo = linkInfo; // Capture for use in callback
		editor.update(() => {
			currentLinkInfo.linkNode.setURL(sanitizeUrl(editUrl));
		});

		linkInfo = { ...linkInfo, url: editUrl };
		isEditing = false;
	}

	function handleRemoveLink() {
		if (!linkInfo) return;

		const currentLinkInfo = linkInfo; // Capture for use in callback
		editor.update(() => {
			const children = currentLinkInfo.linkNode.getChildren();
			for (const child of children) {
				currentLinkInfo.linkNode.insertBefore(child);
			}
			currentLinkInfo.linkNode.remove();
		});

		closeTooltip();
	}

	function handleKeydown(e: KeyboardEvent) {
		e.stopPropagation();
		if (e.isComposing) return;

		if (e.key === 'Enter') {
			e.preventDefault();
			handleSaveLink();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			isEditing ? (isEditing = false) : closeTooltip();
		}
	}

	function stopPropagation(e: Event) {
		e.stopPropagation();
	}
</script>

{#if linkInfo}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		use:portal
		use:bindTooltip
		class="floating-link-editor fixed bg-popover border border-border rounded-lg shadow-lg p-2"
		style="top: {position.top}px; left: {position.left}px; z-index: 9999;"
		onmousedown={stopPropagation}
		onclick={stopPropagation}
		onkeydown={stopPropagation}
		onkeyup={stopPropagation}
		onkeypress={stopPropagation}
		oninput={stopPropagation}
	>
		{#if isEditing}
			<div class="flex items-center gap-2">
				<Input
					bind:ref={inputRef}
					type="url"
					placeholder="https://example.com"
					bind:value={editUrl}
					onkeydown={handleKeydown}
					class="h-8 w-56 text-sm"
				/>
				<Button variant="ghost" size="icon" class="h-8 w-8" onclick={handleSaveLink}>
					<Icon icon="mdi:check" width="16" height="16" />
				</Button>
				<Button variant="ghost" size="icon" class="h-8 w-8" onclick={() => (isEditing = false)}>
					<Icon icon="mdi:close" width="16" height="16" />
				</Button>
			</div>
		{:else}
			<div class="flex items-center gap-1">
				<a
					href={linkInfo.url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-muted-foreground hover:text-foreground truncate max-w-48 px-2"
					onclick={(e) => e.stopPropagation()}
				>
					{linkInfo.url}
				</a>

				<div class="w-px h-4 bg-border mx-1"></div>

				<Button variant="ghost" size="icon" class="h-7 w-7" onclick={handleOpenLink} title="打开链接">
					<Icon icon="mdi:open-in-new" width="14" height="14" />
				</Button>

				<Button variant="ghost" size="icon" class="h-7 w-7" onclick={handleEditLink} title="编辑链接">
					<Icon icon="mdi:pencil" width="14" height="14" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					class="h-7 w-7 text-destructive hover:text-destructive"
					onclick={handleRemoveLink}
					title="取消链接"
				>
					<Icon icon="mdi:link-variant-off" width="14" height="14" />
				</Button>
			</div>
		{/if}
	</div>
{/if}
