# @qiyu-allinai/actions

语义化函数 Actions 定义库，用于定义可被 AI 调用的工具函数。

## 安装

```bash
bun add @qiyu-allinai/actions
```

## 使用

### 定义 Action

```typescript
import { defineAction, success, failure } from '@qiyu-allinai/actions';
import { z } from 'zod';

const getUserAction = defineAction({
  meta: {
    name: 'getUser',
    displayName: '获取用户',
    description: '根据ID获取用户信息',
    tags: ['user', 'query'],
    requireAuth: true,
  },
  inputSchema: z.object({
    id: z.uuid(),
  }),
  outputSchema: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
  execute: async (input, ctx) => {
    const user = await db.query.user.findFirst({ 
      where: eq(user.id, input.id) 
    });
    
    if (!user) {
      return failure('User not found', 'USER_NOT_FOUND');
    }
    
    return success(user);
  },
});
```

### 注册 Actions

```typescript
import { 
  createActionRegistry, 
  registerAction, 
  getAction 
} from '@qiyu-allinai/actions';

const registry = createActionRegistry();
registerAction(registry, getUserAction);

// 获取 Action
const action = getAction(registry, 'getUser');
```

### 转换为 AI Tool 格式

```typescript
import { 
  toOpenAITools, 
  toMCPTools, 
  toAnthropicTools 
} from '@qiyu-allinai/actions';

// OpenAI Function Calling 格式
const openaiTools = toOpenAITools([getUserAction]);

// MCP Tool 格式
const mcpTools = toMCPTools([getUserAction]);

// Anthropic Tool 格式
const anthropicTools = toAnthropicTools([getUserAction]);
```

## 类型

```typescript
// Action 定义
interface ActionDefinition<TInput, TOutput> {
  meta: ActionMeta;
  inputSchema: ZodType<TInput>;
  outputSchema: ZodType<TOutput>;
  execute: (input: TInput, context?: ActionContext) => Promise<ActionResult<TOutput>>;
}

// Action 元数据
interface ActionMeta {
  name: string;
  displayName: string;
  description: string;
  tags?: string[];
  requireAuth?: boolean;
  permissions?: string[];
}

// 执行上下文
interface ActionContext {
  token: string;
}

// 执行结果
interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}
```

## 类型推断

```typescript
import type { InferActionInput, InferActionOutput } from '@qiyu-allinai/actions';

type GetUserInput = InferActionInput<typeof getUserAction>;
// { id: string }

type GetUserOutput = InferActionOutput<typeof getUserAction>;
// { id: string; name: string; email: string }
```
