/**
 * AI Provider 类型定义
 */

/** 支持的 Provider 类型 */
export type ProviderType = 
  | 'openai'
  | 'anthropic'
  | 'google'
  | 'azure'
  | 'deepseek'
  | 'alibaba'
  | 'volcengine'
  | 'xai'
  | 'gateway'
  | 'openai-compatible';

/** Provider 配置信息（不包含模型列表，模型从对应 SDK 包获取） */
export interface ProviderInfo {
  /** 类型标识 */
  type: ProviderType;
  /** 显示名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 官网 URL */
  website: string;
  /** 默认 Base URL */
  defaultBaseUrl: string;
  /** 是否需要自定义 Base URL */
  requiresBaseUrl: boolean;
  /** Logo icon 名称 */
  icon: string;
}
