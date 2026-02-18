/**
 * AI Provider 工厂
 * 根据 providerType 创建对应的 AI SDK provider 实例
 */

import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createAzure } from '@ai-sdk/azure';
import { createXai } from '@ai-sdk/xai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createGateway } from 'ai';
import type { ProviderType } from './types';
import { createVolcengine } from './volcengine';

/** Provider 配置 */
export interface ProviderConfig {
  /** Provider 类型 */
  providerType: ProviderType;
  /** API Key */
  apiKey: string;
  /** Base URL（可选，部分 provider 需要） */
  baseURL?: string;
}

/** 创建 AI SDK Provider 实例 */
export function createProvider(config: ProviderConfig) {
  const { providerType, apiKey, baseURL } = config;

  switch (providerType) {
    case 'openai':
      return createOpenAI({
        apiKey,
        baseURL: baseURL || undefined,
      });

    case 'anthropic':
      return createAnthropic({
        apiKey,
        baseURL: baseURL || undefined,
      });

    case 'google':
      return createGoogleGenerativeAI({
        apiKey,
        baseURL: baseURL || undefined,
      });

    case 'azure':
      // Azure 需要 resourceName 和 apiKey
      // baseURL 格式: https://{resourceName}.openai.azure.com
      return createAzure({
        apiKey,
        baseURL: baseURL || undefined,
      });

    case 'deepseek':
      // DeepSeek 使用 OpenAI 兼容模式（@ai-sdk/deepseek 尚未支持 AI SDK 5 v2 规范）
      return createOpenAICompatible({
        name: 'deepseek',
        baseURL: baseURL || 'https://api.deepseek.com/v1',
        apiKey,
        includeUsage: true,
      });

    case 'xai':
      return createXai({
        apiKey,
        baseURL: baseURL || undefined,
      });

    case 'gateway':
      // AI Gateway 统一网关
      return createGateway({
        apiKey,
        baseURL: baseURL || undefined,
      });

    case 'alibaba':
      // 阿里云使用 OpenAI 兼容模式
      return createOpenAICompatible({
        name: 'alibaba',
        baseURL: baseURL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        apiKey,
        includeUsage: true,
      });

    case 'volcengine':
      // 火山引擎使用自定义 provider（支持视频、音频多模态）
      return createVolcengine({
        apiKey,
        baseURL: baseURL || undefined,
      });

    case 'openai-compatible':
    default:
      // 通用 OpenAI 兼容模式
      return createOpenAICompatible({
        name: 'openai-compatible',
        baseURL: baseURL || '',
        apiKey,
        includeUsage: true,
      });
  }
}

/** 获取模型实例 */
export function getModel(config: ProviderConfig, modelId: string) {
  const provider = createProvider(config);
  return provider(modelId);
}
