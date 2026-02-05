/**
 * @qiyu-allinai/ai/client
 * 
 * 客户端 AI SDK 封装，基于 @ai-sdk/svelte
 * 
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { Chat } from '@qiyu-allinai/ai/client';
 *   
 *   const chat = new Chat({ api: '/api/chat' });
 *   let input = $state('');
 *   
 *   async function handleSubmit() {
 *     await chat.sendMessage({ text: input });
 *     input = '';
 *   }
 * </script>
 * 
 * <div>
 *   {#each chat.messages as message}
 *     <div class={message.role}>
 *       {#each message.parts as part}
 *         {#if part.type === 'text'}
 *           {part.text}
 *         {/if}
 *       {/each}
 *     </div>
 *   {/each}
 *   
 *   <input bind:value={input} />
 *   <button onclick={handleSubmit} disabled={chat.status !== 'ready'}>发送</button>
 * </div>
 * ```
 */

// Re-export Chat and Completion classes from @ai-sdk/svelte
export { Chat, Completion } from '@ai-sdk/svelte';

// Re-export DefaultChatTransport from ai
export { DefaultChatTransport } from 'ai';

// Re-export types from ai
export type { 
  UIMessage,
  ChatStatus,
  ChatInit,
  ChatRequestOptions,
} from 'ai';

// Types
export type {
  MessageRole,
  MessageStatus,
  FileAttachment,
  ToolCall,
  ToolResult,
  ChatMessage,
  ChatOptions,
  CompletionOptions,
} from './types.js';
