# @qiyu-allinai/ai

AI SDK 封装包，提供服务端和客户端两个模块。

## 安装

```bash
bun add @qiyu-allinai/ai
```

## 模块结构

```
@qiyu-allinai/ai
├── server  # 服务端模块 - 用于后端 API
└── client  # 客户端模块 - 用于 Svelte 前端
```

## 服务端使用 (Server)

```typescript
import { generate, stream, tool, stepCountIs, convertToModelMessages } from '@qiyu-allinai/ai/server';
import type { UIMessage } from '@qiyu-allinai/ai/server';
import { t } from 'elysia';

// 在 SvelteKit API 路由中使用
export async function POST({ request }) {
  const { messages }: { messages: UIMessage[] } = await request.json();
  
  const result = stream({
    provider: { baseURL: 'https://api.openai.com/v1', apiKey: 'xxx' },
    model: 'gpt-4',
    messages: await convertToModelMessages(messages),
    system: 'You are a helpful assistant.',
    toolChoice: 'auto',
    tools: {
      weather: tool({
        description: 'Get weather',
        inputSchema: t.Object({ location: t.String() }),
        execute: async ({ location }) => ({ temp: 20, location }),
      }),
    },
    stopWhen: stepCountIs(5),
  });
  
  return result.toUIMessageStreamResponse();
}
```

### 非流式生成

```typescript
import { generate } from '@qiyu-allinai/ai/server';

const result = await generate({
  provider: { baseURL: 'https://api.openai.com/v1', apiKey: 'xxx' },
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }],
  system: 'You are a helpful assistant.',
  toolChoice: 'auto',
  tools: {},
  stopWhen: stepCountIs(1),
});

console.log(result.text);
```

## 客户端使用 (Client)

基于 `@ai-sdk/svelte`，提供 `Chat` 和 `Completion` 类。

### Chat 聊天

```svelte
<script lang="ts">
  import { Chat } from '@qiyu-allinai/ai/client';
  
  const chat = new Chat({ api: '/api/chat' });
  let input = $state('');
  
  async function handleSubmit() {
    if (!input.trim()) return;
    await chat.sendMessage({ text: input });
    input = '';
  }
</script>

<div class="chat-container">
  <!-- 消息列表 -->
  {#each chat.messages as message}
    <div class="message {message.role}">
      {#each message.parts as part}
        {#if part.type === 'text'}
          <p>{part.text}</p>
        {:else if part.type === 'tool-invocation'}
          <div class="tool-call">
            工具调用: {part.toolInvocation.toolName}
          </div>
        {/if}
      {/each}
    </div>
  {/each}
  
  <!-- 输入框 -->
  <form onsubmit={handleSubmit}>
    <input 
      bind:value={input} 
      placeholder="输入消息..." 
      disabled={chat.status !== 'ready'}
    />
    <button type="submit" disabled={chat.status !== 'ready'}>
      {chat.status === 'streaming' ? '生成中...' : '发送'}
    </button>
  </form>
  
  <!-- 错误提示 -->
  {#if chat.error}
    <div class="error">
      {chat.error.message}
      <button onclick={() => chat.clearError()}>清除</button>
    </div>
  {/if}
</div>
```

### Chat API

```typescript
const chat = new Chat({
  api: '/api/chat',           // API 端点
  id: 'chat-1',               // 聊天 ID（可选）
  initialMessages: [],        // 初始消息
  headers: {},                // 请求头
  body: {},                   // 额外请求体
  onFinish: ({ message }) => {},  // 完成回调
  onError: ({ error }) => {},     // 错误回调
  onToolCall: async ({ toolCall }) => {}, // 工具调用回调
});

// 属性
chat.id;        // 聊天 ID
chat.messages;  // 消息列表 UIMessage[]
chat.status;    // 状态: 'submitted' | 'streaming' | 'ready' | 'error'
chat.error;     // 错误对象

// 方法
await chat.sendMessage({ text: 'Hello' });  // 发送消息
await chat.regenerate();                     // 重新生成
chat.stop();                                 // 停止生成
chat.clearError();                           // 清除错误
chat.messages = [];                          // 设置消息
```

### Completion 补全

```svelte
<script lang="ts">
  import { Completion } from '@qiyu-allinai/ai/client';
  
  const completion = new Completion({ api: '/api/completion' });
  let prompt = $state('');
</script>

<div>
  <textarea bind:value={prompt} placeholder="输入提示..." />
  <button onclick={() => completion.complete(prompt)} disabled={completion.loading}>
    {completion.loading ? '生成中...' : '生成'}
  </button>
  
  {#if completion.completion}
    <div class="result">{completion.completion}</div>
  {/if}
</div>
```

## 类型导出

```typescript
// Server types
import type { 
  ModelMessage, 
  StopCondition, 
  ToolSet, 
  StepResult,
  UIMessage,
} from '@qiyu-allinai/ai/server';

// Client types
import type {
  UIMessage,
  ChatStatus,
  ChatInit,
  ChatRequestOptions,
  ChatOptions,
  CompletionOptions,
  ToolCall,
  ToolResult,
} from '@qiyu-allinai/ai/client';
```

## 注意事项

### Svelte 5 响应式

在 Svelte 5 中，`Chat` 类的属性是响应式的，可以直接在模板中使用：

```svelte
<script lang="ts">
  import { Chat } from '@qiyu-allinai/ai/client';
  const chat = new Chat({ api: '/api/chat' });
</script>

<!-- 直接使用 chat.messages，会自动响应更新 -->
{#each chat.messages as message}
  ...
{/each}
```

### 不要解构类属性

```typescript
// ❌ 错误 - 解构会断开响应式
const { messages, status } = chat;

// ✅ 正确 - 直接使用
chat.messages
chat.status
```

### 多实例同步

如果需要在多个组件间共享同一个聊天实例，使用 Svelte context：

```svelte
<!-- +layout.svelte -->
<script lang="ts">
  import { setContext } from 'svelte';
  import { Chat } from '@qiyu-allinai/ai/client';
  
  const chat = new Chat({ api: '/api/chat' });
  setContext('chat', chat);
</script>

<!-- 子组件 -->
<script lang="ts">
  import { getContext } from 'svelte';
  import type { Chat } from '@qiyu-allinai/ai/client';
  
  const chat = getContext<Chat>('chat');
</script>
```
