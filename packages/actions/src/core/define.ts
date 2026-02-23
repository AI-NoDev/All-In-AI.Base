import type { TSchema, Static } from '@sinclair/typebox';
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
  TQuery extends TSchema,
  TParams extends TSchema,
  TBody extends TSchema,
  TOutput extends TSchema,
> {
  meta: ActionMeta;
  schemas: ActionSchemas<TQuery, TParams, TBody, TOutput>;
  execute: (
    input: MergedInput<TQuery, TParams, TBody>,
    context: ActionContext
  ) => Promise<Static<TOutput>>;
}

/**
 * 定义一个 Action
 */
export function defineAction<
  TQuery extends TSchema,
  TParams extends TSchema,
  TBody extends TSchema,
  TOutput extends TSchema,
>(options: DefineActionOptions<TQuery, TParams, TBody, TOutput>): ActionDefinition<TQuery, TParams, TBody, TOutput> {
  return {
    meta: options.meta,
    schemas: options.schemas,
    execute: options.execute,
  };
}
