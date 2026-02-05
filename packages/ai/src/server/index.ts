import { createOpenAICompatible, type OpenAICompatibleProviderSettings } from '@ai-sdk/openai-compatible';
import { generateText, streamText, Output, convertToModelMessages, type ModelMessage, type StopCondition, type ToolSet, type StepResult, type UIMessage } from 'ai';
import { type LanguageModelV3 } from '@ai-sdk/provider';
import z from 'zod/v4';

type ZodObjectShape = Record<string, z.ZodType>;

interface PrepareStepResult<TOOLS extends ToolSet> {
  toolChoice?: 'auto' | 'none' | 'required';
  tools?: TOOLS;
}

interface BaseRequestOptions<TOOLS extends ToolSet> {
  provider: OpenAICompatibleProviderSettings;
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

interface ObjectRequestOptions<TOOLS extends ToolSet, O extends ZodObjectShape> extends BaseRequestOptions<TOOLS> {
  output: 'object';
  schema: z.ZodObject<O>;
}

type RequestOptions<TOOLS extends ToolSet, O extends ZodObjectShape = ZodObjectShape> = 
  | TextRequestOptions<TOOLS> 
  | ObjectRequestOptions<TOOLS, O>;

interface StreamCallbacks {
  onChunk?: (chunk: { type: string; value: string }) => void;
  onError?: (error: Error) => void;
}

type StreamRequestOptions<TOOLS extends ToolSet, O extends ZodObjectShape = ZodObjectShape> = 
  RequestOptions<TOOLS, O> & StreamCallbacks;

export const generate = async <TOOLS extends ToolSet, O extends ZodObjectShape = ZodObjectShape>(
  options: RequestOptions<TOOLS, O>
) => {
  const provider = createOpenAICompatible(options.provider);
  const modelMessages = await convertToModelMessages(options.messages);

  const outputConfig = options.output === 'object' && 'schema' in options
    ? Output.object({ schema: options.schema })
    : Output.text();

  return await generateText({
    model: provider(options.model) as LanguageModelV3,
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

export const stream = async <TOOLS extends ToolSet, O extends ZodObjectShape = ZodObjectShape>(
  options: StreamRequestOptions<TOOLS, O>
) => {
  const provider = createOpenAICompatible(options.provider);
  const modelMessages = await convertToModelMessages(options.messages);

  const outputConfig = options.output === 'object' && 'schema' in options
    ? Output.object({ schema: options.schema })
    : Output.text();

  return streamText({
    model: provider(options.model) as LanguageModelV3,
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
};

export { tool, stepCountIs, convertToModelMessages, streamText, generateText, jsonSchema } from 'ai';
export { createOpenAICompatible } from '@ai-sdk/openai-compatible';
export type { OpenAICompatibleProviderSettings } from '@ai-sdk/openai-compatible';
