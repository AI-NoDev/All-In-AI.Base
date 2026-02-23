import { createOpenAICompatible, type OpenAICompatibleProviderSettings } from '@ai-sdk/openai-compatible';
import { generateText, streamText, Output, convertToModelMessages, jsonSchema, type ModelMessage, type StopCondition, type ToolSet, type StepResult, type UIMessage } from 'ai';
import { type LanguageModelV3 } from '@ai-sdk/provider';
import { type TObject, type TProperties, type Static } from '@sinclair/typebox';
import type { JSONSchema7 } from 'json-schema';
import { createProvider } from '../providers/factory';
import type { ProviderType } from '../providers/types';

interface PrepareStepResult<TOOLS extends ToolSet> {
  toolChoice?: 'auto' | 'none' | 'required';
  tools?: TOOLS;
}

/** 旧版 provider 配置（兼容 OpenAI Compatible） */
interface LegacyProviderConfig extends OpenAICompatibleProviderSettings {}

/** 新版 provider 配置（使用 providerType） */
interface TypedProviderConfig {
  providerType: ProviderType;
  apiKey: string;
  baseURL?: string;
}

interface BaseRequestOptions<TOOLS extends ToolSet> {
  /** Provider 配置 - 支持旧版（OpenAI Compatible）和新版（typed provider） */
  provider: LegacyProviderConfig | TypedProviderConfig;
  model: string;
  toolChoice?: 'auto' | 'none' | 'required';
  tools?: TOOLS;
  messages: UIMessage[];
  system?: string;
  stopWhen?: StopCondition<NoInfer<TOOLS>> | Array<StopCondition<NoInfer<TOOLS>>>;
  prepareStep?: (data: { steps: Array<StepResult<TOOLS>>; stepNumber: number }) => Promise<PrepareStepResult<TOOLS> | undefined>;
  onStepFinish?: (data: StepResult<TOOLS>) => Promise<void>;
  onFinish?: (event: { steps: Array<StepResult<TOOLS>>; text: string }) => Promise<void>;
}

interface TextRequestOptions<TOOLS extends ToolSet> extends BaseRequestOptions<TOOLS> {
  output?: 'text';
}

interface ObjectRequestOptions<TOOLS extends ToolSet, O extends TProperties> extends BaseRequestOptions<TOOLS> {
  output: 'object';
  schema: TObject<O>;
}

type RequestOptions<TOOLS extends ToolSet, O extends TProperties = TProperties> = 
  | TextRequestOptions<TOOLS> 
  | ObjectRequestOptions<TOOLS, O>;

interface StreamCallbacks {
  onChunk?: (chunk: { type: string; value: string }) => void;
  onError?: (error: Error) => void;
}

type StreamRequestOptions<TOOLS extends ToolSet, O extends TProperties = TProperties> = 
  RequestOptions<TOOLS, O> & StreamCallbacks;

/** 判断是否为新版 typed provider 配置 */
function isTypedProviderConfig(config: LegacyProviderConfig | TypedProviderConfig): config is TypedProviderConfig {
  return 'providerType' in config;
}

/** 根据配置创建 provider 实例 */
function getProviderInstance(config: LegacyProviderConfig | TypedProviderConfig, modelId: string) {
  if (isTypedProviderConfig(config)) {
    // 新版：使用 typed provider factory
    const provider = createProvider({
      providerType: config.providerType,
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });
    return provider(modelId);
  } else {
    // 旧版：使用 OpenAI Compatible
    const provider = createOpenAICompatible(config);
    return provider(modelId);
  }
}

export const generate = async <TOOLS extends ToolSet, O extends TProperties = TProperties>(
  options: RequestOptions<TOOLS, O>
) => {
  const model = getProviderInstance(options.provider, options.model);
  const modelMessages = await convertToModelMessages(options.messages);

  const outputConfig = options.output === 'object' && 'schema' in options
    ? Output.object({ schema: jsonSchema<Static<TObject<O>>>(options.schema as unknown as JSONSchema7) })
    : Output.text();

  return await generateText({
    model: model as LanguageModelV3,
    tools: options.tools ?? {} as TOOLS,
    toolChoice: options.toolChoice ?? 'auto',
    messages: modelMessages,
    system: options.system,
    stopWhen: options.stopWhen ?? [],
    output: outputConfig,
    prepareStep: options.prepareStep,
    onStepFinish: options.onStepFinish,
    onFinish: options.onFinish,
  });
};

export const stream = async <TOOLS extends ToolSet, O extends TProperties = TProperties>(
  options: StreamRequestOptions<TOOLS, O>
) => {
  const model = getProviderInstance(options.provider, options.model);
  const modelMessages = await convertToModelMessages(options.messages);

  const outputConfig = options.output === 'object' && 'schema' in options
    ? Output.object({ schema: jsonSchema<Static<TObject<O>>>(options.schema as unknown as JSONSchema7) })
    : Output.text();

  return streamText({
    model: model as LanguageModelV3,
    tools: options.tools ?? {} as TOOLS,
    toolChoice: options.toolChoice ?? 'auto',
    messages: modelMessages,
    system: options.system,
    stopWhen: options.stopWhen ?? [],
    output: outputConfig,
    prepareStep: options.prepareStep,
    onStepFinish: options.onStepFinish,
    onFinish: options.onFinish,
    onChunk: options.onChunk ? ({ chunk }) => {
      if ('type' in chunk && chunk.type === 'text-delta' && 'text' in chunk) {
        options.onChunk?.({ type: chunk.type, value: chunk.text });
      }
    } : undefined,
    onError: options.onError ? ({ error }) => {
      options.onError?.(error instanceof Error ? error : new Error(String(error)));
    } : undefined,
  });
};

// Re-export types
export type {
  ModelMessage,
  StopCondition,
  ToolSet,
  StepResult,
  RequestOptions,
  StreamRequestOptions,
  PrepareStepResult,
  UIMessage,
  TypedProviderConfig,
  LegacyProviderConfig,
};

export { tool, stepCountIs, convertToModelMessages, streamText, generateText, jsonSchema } from 'ai';
export { createOpenAICompatible } from '@ai-sdk/openai-compatible';
export type { OpenAICompatibleProviderSettings } from '@ai-sdk/openai-compatible';

// Re-export provider types and factory
export { createProvider, getModel } from '../providers/factory';
export type { ProviderConfig } from '../providers/factory';
export type { ProviderType, ProviderInfo } from '../providers/types';
export { providerRegistry, getProviderTypes, getProviderInfo, getAllProviders } from '../providers/registry';
