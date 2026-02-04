import type { z, ZodType } from 'zod';
import type { 
  ActionMeta, 
  ActionContext,
  ActionDefinition,
  ActionSchemas,
  MergedInput,
} from './types';

/**
 * 定义 Action 的配置选项
 */
export interface DefineActionOptions<
  TQuery extends ZodType,
  TParams extends ZodType,
  TBody extends ZodType,
  TOutput extends ZodType,
> {
  meta: ActionMeta;
  schemas: ActionSchemas<TQuery, TParams, TBody, TOutput>;
  execute: (
    input: MergedInput<TQuery, TParams, TBody>,
    context: ActionContext
  ) => Promise<z.infer<TOutput>>;
}

/**
 * 定义一个 Action
 */
export function defineAction<
  TQuery extends ZodType,
  TParams extends ZodType,
  TBody extends ZodType,
  TOutput extends ZodType,
>(options: DefineActionOptions<TQuery, TParams, TBody, TOutput>): ActionDefinition<TQuery, TParams, TBody, TOutput> {
  return {
    meta: options.meta,
    schemas: options.schemas,
    execute: options.execute,
  };
}
