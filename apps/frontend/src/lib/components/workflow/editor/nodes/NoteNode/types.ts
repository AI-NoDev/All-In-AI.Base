import type { Node } from '@xyflow/svelte';

/** 注释节点数据 */
export interface NoteNodeData extends Record<string, unknown> {
	title: string;
	type: 'note';
	/** 注释内容 (Markdown) */
	content?: string;
	/** 背景颜色 */
	color?: NoteColor;
	/** 宽度 */
	width?: number;
	/** 高度 */
	height?: number;
	/** 作者 */
	author?: string;
}

/** 注释颜色选项 */
export type NoteColor = 'primary' | 'blue' | 'cyan' | 'green' | 'orange' | 'pink' | 'purple';

/** 颜色配置 */
export interface NoteColorConfig {
	value: NoteColor;
	label: string;
	/** 圆点颜色 */
	dot: string;
	/** 背景色 */
	bg: string;
	/** 边框色 */
	border: string;
	/** 文字色 */
	text: string;
}

/** 预设颜色列表 - 参考 Dify */
export const NOTE_COLORS: NoteColorConfig[] = [
	{ 
		value: 'primary', 
		label: '主题色', 
		dot: 'hsl(var(--primary))',
		bg: 'bg-primary/20 dark:bg-primary/30', 
		border: 'border-primary/50', 
		text: 'text-primary-foreground dark:text-primary-foreground' 
	},
	{ 
		value: 'blue', 
		label: '蓝色', 
		dot: '#3b82f6',
		bg: 'bg-blue-500/20 dark:bg-blue-500/30', 
		border: 'border-blue-500/50', 
		text: 'text-blue-900 dark:text-blue-100' 
	},
	{ 
		value: 'cyan', 
		label: '青色', 
		dot: '#06b6d4',
		bg: 'bg-cyan-500/20 dark:bg-cyan-500/30', 
		border: 'border-cyan-500/50', 
		text: 'text-cyan-900 dark:text-cyan-100' 
	},
	{ 
		value: 'green', 
		label: '绿色', 
		dot: '#22c55e',
		bg: 'bg-green-500/20 dark:bg-green-500/30', 
		border: 'border-green-500/50', 
		text: 'text-green-900 dark:text-green-100' 
	},
	{ 
		value: 'orange', 
		label: '橙色', 
		dot: '#f97316',
		bg: 'bg-orange-500/20 dark:bg-orange-500/30', 
		border: 'border-orange-500/50', 
		text: 'text-orange-900 dark:text-orange-100' 
	},
	{ 
		value: 'pink', 
		label: '粉色', 
		dot: '#ec4899',
		bg: 'bg-pink-500/20 dark:bg-pink-500/30', 
		border: 'border-pink-500/50', 
		text: 'text-pink-900 dark:text-pink-100' 
	},
	{ 
		value: 'purple', 
		label: '紫色', 
		dot: '#a855f7',
		bg: 'bg-purple-500/20 dark:bg-purple-500/30', 
		border: 'border-purple-500/50', 
		text: 'text-purple-900 dark:text-purple-100' 
	},
];

/** 获取颜色配置 */
export function getNoteColorConfig(color: NoteColor = 'primary'): NoteColorConfig {
	return NOTE_COLORS.find(c => c.value === color) ?? NOTE_COLORS[0]; // 默认主题色
}

/** 注释节点类型 */
export type NoteNode = Node<NoteNodeData, 'note'>;
