/** AI 生成器类型 */
export type GeneratorType = 'text' | 'object' | 'file';

/** 模型配置 */
export interface ModelConfig {
	id: string;          // 模型 UUID
	provider: string;    // 提供商 UUID
	model: string;       // 模型标识 (如 deepseek-chat)
	displayName?: string; // 显示名称
}

/** 模型参数 */
export interface ModelParams {
	temperature: number;
	maxTokens: number;
	topP: number;
}

/** 生成结果 */
export interface GenerateResult {
	content: string;
	version: number;
}

/** AI 生成器 Props */
export interface AIGeneratorProps {
	/** 是否打开 */
	open: boolean;
	/** 生成器类型 */
	type: GeneratorType;
	/** 标题 */
	title?: string;
	/** 描述 */
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
}

/** 类型配置 */
export interface TypeConfig {
	title: string;
	description: string;
	idealOutputPlaceholder: string;
}

/** 类型配置映射 */
export const TYPE_CONFIGS: Record<GeneratorType, TypeConfig> = {
	text: {
		title: '文本生成器',
		description: '使用配置的模型来生成文本内容，以获得更高的质量和更好的结构。',
		idealOutputPlaceholder: '描述您理想的回复格式、长度、语气和内容要求......',
	},
	object: {
		title: '对象生成器',
		description: '使用配置的模型来生成结构化对象数据，如 JSON 格式的数据。',
		idealOutputPlaceholder: '描述您期望的对象结构、字段和数据格式......',
	},
	file: {
		title: '文件生成器',
		description: '使用配置的模型来生成文件内容，如图片、视频等。',
		idealOutputPlaceholder: '描述您期望的文件类型、尺寸、风格等要求......',
	},
};

/** 默认模型参数 */
export const DEFAULT_MODEL_PARAMS: ModelParams = {
	temperature: 1,
	maxTokens: 4096,
	topP: 1,
};
