/**
 * AI Provider 注册表
 * 包含所有支持的 AI 服务商配置信息
 * 注意：模型列表从对应的 @ai-sdk/* 包获取，不在此处硬编码
 */

import type { ProviderInfo, ProviderType } from './types';

/** Provider 注册表 */
export const providerRegistry: Record<ProviderType, ProviderInfo> = {
  openai: {
    type: 'openai',
    name: 'OpenAI',
    description: 'OpenAI GPT 系列模型',
    website: 'https://openai.com',
    defaultBaseUrl: 'https://api.openai.com/v1',
    requiresBaseUrl: false,
    icon: 'simple-icons:openai',
  },
  anthropic: {
    type: 'anthropic',
    name: 'Anthropic',
    description: 'Anthropic Claude 系列模型',
    website: 'https://anthropic.com',
    defaultBaseUrl: 'https://api.anthropic.com',
    requiresBaseUrl: false,
    icon: 'simple-icons:anthropic',
  },
  google: {
    type: 'google',
    name: 'Google',
    description: 'Google Gemini 系列模型',
    website: 'https://ai.google.dev',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    requiresBaseUrl: false,
    icon: 'simple-icons:google',
  },
  azure: {
    type: 'azure',
    name: 'Azure OpenAI',
    description: 'Microsoft Azure OpenAI 服务',
    website: 'https://azure.microsoft.com/products/ai-services/openai-service',
    defaultBaseUrl: '',
    requiresBaseUrl: true,
    icon: 'simple-icons:microsoftazure',
  },
  deepseek: {
    type: 'deepseek',
    name: 'DeepSeek',
    description: 'DeepSeek AI 模型',
    website: 'https://deepseek.com',
    defaultBaseUrl: 'https://api.deepseek.com',
    requiresBaseUrl: false,
    icon: 'mdi:brain',
  },
  alibaba: {
    type: 'alibaba',
    name: '阿里云百炼',
    description: '阿里云通义千问系列模型',
    website: 'https://bailian.console.aliyun.com',
    defaultBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    requiresBaseUrl: false,
    icon: 'simple-icons:alibabadotcom',
  },
  volcengine: {
    type: 'volcengine',
    name: '火山引擎',
    description: '字节跳动火山引擎豆包大模型',
    website: 'https://www.volcengine.com/product/doubao',
    defaultBaseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
    requiresBaseUrl: false,
    icon: 'mdi:fire',
  },
  xai: {
    type: 'xai',
    name: 'xAI',
    description: 'xAI Grok 系列模型',
    website: 'https://x.ai',
    defaultBaseUrl: 'https://api.x.ai/v1',
    requiresBaseUrl: false,
    icon: 'simple-icons:x',
  },
  gateway: {
    type: 'gateway',
    name: 'AI Gateway',
    description: 'AI Gateway 统一网关',
    website: '',
    defaultBaseUrl: '',
    requiresBaseUrl: true,
    icon: 'mdi:gate',
  },
  'openai-compatible': {
    type: 'openai-compatible',
    name: 'OpenAI 兼容',
    description: '兼容 OpenAI API 的第三方服务',
    website: '',
    defaultBaseUrl: '',
    requiresBaseUrl: true,
    icon: 'mdi:api',
  },
};

/** 获取所有 Provider 类型列表 */
export function getProviderTypes(): ProviderType[] {
  return Object.keys(providerRegistry) as ProviderType[];
}

/** 获取 Provider 信息 */
export function getProviderInfo(type: ProviderType): ProviderInfo | undefined {
  return providerRegistry[type];
}

/** 获取所有 Provider 信息列表 */
export function getAllProviders(): ProviderInfo[] {
  return Object.values(providerRegistry);
}
