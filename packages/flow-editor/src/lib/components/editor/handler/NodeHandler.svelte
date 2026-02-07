<script lang="ts">
	import { Handle, Position, type HandleProps } from '@xyflow/svelte';
	import Icon from '@iconify/svelte';

	interface Props extends HandleProps {
		/** 是否已连接 */
		connected?: boolean;
		/** 自定义 top 位置（像素值，用于对齐 header 或特定行） */
		top?: number;
	}

	let { type = 'source', position = Position.Right, connected = false, top, class: className, style, id, ...rest }: Props = $props();

	// 构建 style 字符串
	let computedStyle = $derived.by(() => {
		const styles: string[] = [];
		if (top !== undefined) {
			styles.push(`top: ${top}px`);
		}
		if (style) {
			styles.push(style);
		}
		return styles.length > 0 ? styles.join('; ') : undefined;
	});
</script>

<Handle {type} {position} {id} class="node-handle {connected ? 'connected' : ''} {className ?? ''}" style={computedStyle} {...rest}>
	<!-- 默认扁平引脚 -->
	<div class="handle-flat"></div>
	<!-- hover/选中/连接时的圆形按钮 -->
	<div class="handle-inner">
		<Icon icon="material-symbols:add" width="12" height="12" />
	</div>
</Handle>

<style>
	:global(.node-handle) {
		/* Handle 尺寸设为扁平引脚的实际尺寸，连接线会从这里出来 */
		width: 2px !important;
		height: 8px !important;
		background: transparent !important;
		border: none !important;
		z-index: 1000 !important;
	}

	/* 扩大点击区域 */
	:global(.node-handle)::before {
		content: '';
		position: absolute;
		width: 20px;
		height: 20px;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	/* 隐藏的 handle - 使用 visibility 而不是 display:none，保持位置计算 */
	:global(.node-handle.hidden) {
		visibility: hidden !important;
		pointer-events: none !important;
	}

	/* 扁平引脚 - 默认显示，相对于 handle 居中 */
	.handle-flat {
		position: absolute;
		width: 2px;
		height: 8px;
		background: var(--border);
		border-radius: 1px;
		transition: opacity 0.15s ease, background 0.15s ease;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	/* 已连接时扁平引脚高亮 */
	:global(.node-handle.connected) .handle-flat {
		background: var(--primary);
	}

	/* 圆形按钮 - 默认隐藏，相对于 handle 居中 */
	.handle-inner {
		position: absolute;
		width: 20px;
		height: 20px;
		background: var(--primary);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--primary-foreground);
		box-shadow: 0 2px 4px oklch(from var(--primary) l c h / 0.3);
		transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
		opacity: 0;
		z-index: 10;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	/* hover 时显示圆形，隐藏扁平 */
	:global(.svelte-flow__node:hover) .handle-flat,
	:global(.svelte-flow__node.selected) .handle-flat {
		opacity: 0;
	}

	:global(.svelte-flow__node:hover) .handle-inner,
	:global(.svelte-flow__node.selected) .handle-inner {
		opacity: 1;
	}

	/* 连接中 - 全局状态 */
	:global(.svelte-flow.connecting) .handle-flat {
		opacity: 0;
	}

	:global(.svelte-flow.connecting) .handle-inner {
		opacity: 1;
	}

	/* 连接中 - handle 自身状态 */
	:global(.node-handle.connecting) .handle-flat,
	:global(.node-handle.connectingto) .handle-flat,
	:global(.node-handle.connectingfrom) .handle-flat,
	:global(.node-handle.valid) .handle-flat {
		opacity: 0;
	}

	:global(.node-handle.connecting) .handle-inner,
	:global(.node-handle.connectingto) .handle-inner,
	:global(.node-handle.connectingfrom) .handle-inner,
	:global(.node-handle.valid) .handle-inner {
		opacity: 1;
	}

	:global(.node-handle:hover) .handle-inner {
		transform: translate(-50%, -50%) scale(1.1);
		box-shadow: 0 3px 8px oklch(from var(--primary) l c h / 0.4);
	}
</style>
