<script lang="ts">
  import { Chat, DefaultChatTransport } from '@qiyu-allinai/ai/client';
  import type { UIMessage } from 'ai';
  import { aiChatStore } from '@/lib/stores/ai-chat.svelte';
  import { authStore } from '@/lib/stores/auth.svelte';
  import { toast } from 'svelte-sonner';
  import ChatToolbar from './chat-toolbar.svelte';
  import ChatMessages from './chat-messages.svelte';
  import ChatInput from './chat-input.svelte';

  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3030';

  // Chat 实例缓存（只基于 sessionId）
  const chatCache = new Map<string, Chat>();
  
  // 当前 Chat 实例
  let currentChat: Chat | null = null;
  let currentSessionId = '';

  // Token 元数据类型
  interface TokenUsage {
    totalTokens?: number;
    inputTokens?: number;
    outputTokens?: number;
    inputTokenDetails?: {
      noCacheTokens?: number;
      cacheReadTokens?: number;
      cacheWriteTokens?: number;
    };
    outputTokenDetails?: {
      textTokens?: number;
      reasoningTokens?: number;
    };
  }

  // 扩展 UIMessage 类型
  interface ExtendedUIMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    parts: Array<{ type: string; text?: string; [key: string]: unknown }>;
    createdAt: Date;
    tokenUsage?: TokenUsage;
    latencyMs?: number;
  }

  // 响应式消息和状态
  let messages = $state<ExtendedUIMessage[]>([]);
  let status = $state<string>('ready');

  // 消息内容部分类型
  interface ContentPart {
    type: string;
    text?: string;
    reasoning?: string;
    mediaType?: string;
    url?: string;
  }

  // 从数据库消息转换为 ExtendedUIMessage
  // forContext: 是否用于上下文（如果是，则不包含 reasoning，避免非思考模型处理问题）
  function dbMessageToUIMessage(msg: { id: string; role: string; content: ContentPart | ContentPart[] | string; createdAt: string; tokenUsage?: TokenUsage; latencyMs?: number }, forContext = false): ExtendedUIMessage {
    let text = '';
    let reasoning = '';
    const fileParts: Array<{ type: string; mediaType?: string; url?: string }> = [];
    
    // 解析 content
    if (typeof msg.content === 'string') {
      text = msg.content;
    } else if (Array.isArray(msg.content)) {
      // 数组格式
      for (const part of msg.content) {
        if (part.type === 'text') {
          text += part.text || '';
          if (part.reasoning) {
            reasoning += part.reasoning;
          }
        } else if (part.type === 'file') {
          fileParts.push({
            type: 'file',
            mediaType: part.mediaType,
            url: part.url,
          });
        }
      }
    } else {
      // 单个对象格式
      text = msg.content.text || '';
      reasoning = msg.content.reasoning || '';
    }
    
    // 构建 parts 数组
    const parts: Array<{ type: string; text?: string; mediaType?: string; url?: string; [key: string]: unknown }> = [];
    
    // 添加文件附件
    for (const filePart of fileParts) {
      parts.push(filePart);
    }
    
    // 如果有 reasoning 且不是用于上下文，添加到 parts（用于显示）
    if (reasoning && !forContext) {
      parts.push({ type: 'reasoning', text: reasoning });
    }
    
    // 添加文本内容
    if (text) {
      parts.push({ type: 'text', text });
    }
    
    return {
      id: msg.id,
      role: msg.role as 'user' | 'assistant' | 'system',
      content: text,
      parts,
      createdAt: new Date(msg.createdAt),
      tokenUsage: msg.tokenUsage,
      latencyMs: msg.latencyMs,
    };
  }

  // 创建 Chat 实例（使用当前选中的 agent/model）
  // 注意：当使用 sessionId 时，后端会自动加载历史消息，所以 initialMessages 应该为空
  function createChat(sessionId: string, options?: { rewriteFromMsgSeq?: number }): Chat {
    const agentId = aiChatStore.selectedAgentId;
    const modelId = aiChatStore.selectedModelId;
    
    // 新的简化 API：使用 sessionId 让后端加载历史，agentId/modelId 二选一
    // 如果有 rewriteFromMsgSeq，后端会删除该序号及之后的消息
    const body = agentId 
      ? { agentId, sessionId, maxSteps: 10, rewriteFromMsgSeq: options?.rewriteFromMsgSeq }
      : { modelId, sessionId, rewriteFromMsgSeq: options?.rewriteFromMsgSeq };

    return new Chat({
      id: sessionId,
      initialMessages: [], // 后端会加载历史，前端不传
      transport: new DefaultChatTransport({
        api: `${API_BASE}/api/ai/chat`,
        headers: {
          'Authorization': `Bearer ${authStore.accessToken}`,
        },
        body,
      }),
    });
  }

  // 初始化 store
  $effect(() => {
    aiChatStore.init();
  });

  // 当会话变化时，更新 Chat 实例（只基于 sessionId，不受模型/Agent 切换影响）
  $effect(() => {
    const sessionId = aiChatStore.currentSessionId;
    const agentId = aiChatStore.selectedAgentId;
    const modelId = aiChatStore.selectedModelId;
    
    if (sessionId && (agentId || modelId)) {
      // 只有 sessionId 变化时才重建 Chat 实例
      if (sessionId !== currentSessionId) {
        // 清除旧的缓存
        if (currentSessionId) {
          chatCache.delete(currentSessionId);
        }
        // 创建新的 Chat 实例（后端会加载历史）
        const newChat = createChat(sessionId);
        chatCache.set(sessionId, newChat);
        currentChat = newChat;
        currentSessionId = sessionId;
        // 立即同步消息（保留 reasoning 用于显示）
        messages = aiChatStore.currentMessages.map(m => dbMessageToUIMessage(m, false));
        status = 'ready';
      }
    } else {
      currentChat = null;
      currentSessionId = '';
      messages = [];
      status = 'ready';
    }
  });

  // 监听数据库消息变化（仅在非流式状态时同步）
  $effect(() => {
    const dbMessages = aiChatStore.currentMessages;
    const isStreaming = status === 'streaming' || status === 'submitted';
    
    // 只有在非流式状态且有数据库消息时才同步（保留 reasoning 用于显示）
    if (dbMessages.length > 0 && !isStreaming) {
      messages = dbMessages.map(m => dbMessageToUIMessage(m, false));
    }
  });

  // 流式消息同步 - 使用轮询实时更新
  $effect(() => {
    if (!currentChat) {
      return;
    }

    // 轮询更新流式消息
    const interval = setInterval(() => {
      if (currentChat) {
        const chatStatus = currentChat.status;
        const chatMessages = currentChat.messages;
        
        // 更新状态
        status = chatStatus;
        aiChatStore.isSending = chatStatus === 'streaming' || chatStatus === 'submitted';
        
        // 流式状态下实时更新消息
        if (chatStatus === 'streaming' || chatStatus === 'submitted') {
          // 直接使用 Chat 实例的消息，保留完整的 parts（包括 reasoning）
          messages = chatMessages.map(m => {
            const metadata = (m as UIMessage & { metadata?: TokenUsage }).metadata;
            return {
              id: m.id,
              role: m.role as 'user' | 'assistant' | 'system',
              content: m.content || '',
              parts: m.parts || [{ type: 'text', text: m.content || '' }],
              createdAt: m.createdAt || new Date(),
              tokenUsage: metadata,
            };
          });
        }
      }
    }, 50);

    return () => clearInterval(interval);
  });

  // 防止重复保存的标记
  let isSavingMessages = false;
  // 已保存消息 ID 集合（本地追踪，避免重复）
  const savedMessageIds = new Set<string>();
  // 是否被中断
  let wasAborted = $state(false);

  // 中断当前请求
  async function handleAbort() {
    if (!currentChat) return;
    
    const chatStatus = currentChat.status;
    if (chatStatus !== 'streaming' && chatStatus !== 'submitted') return;
    
    // 调用 Chat 的 abort 方法
    currentChat.abort();
    wasAborted = true;
    
    // 等待状态变为 ready
    await new Promise<void>(resolve => {
      const checkReady = setInterval(() => {
        if (currentChat?.status === 'ready') {
          clearInterval(checkReady);
          resolve();
        }
      }, 50);
      // 超时保护
      setTimeout(() => {
        clearInterval(checkReady);
        resolve();
      }, 2000);
    });
    
    // 获取当前消息状态
    const chatMsgs = currentChat.messages;
    if (chatMsgs.length === 0) {
      wasAborted = false;
      return;
    }
    
    const lastMsg = chatMsgs[chatMsgs.length - 1];
    
    // 检查最后一条消息是否是 assistant 且有文本内容
    if (lastMsg.role === 'assistant') {
      const textParts = lastMsg.parts?.filter(p => p.type === 'text') || [];
      const text = textParts
        .map(p => (p as { type: 'text'; text: string }).text)
        .join('') || lastMsg.content || '';
      
      // 如果有文本内容（不只是 reasoning），保存消息
      if (text.trim()) {
        // 保存用户消息和 AI 回复
        if (!isSavingMessages) {
          isSavingMessages = true;
          try {
            for (const msg of chatMsgs) {
              if (savedMessageIds.has(msg.id)) continue;
              savedMessageIds.add(msg.id);
              
              const msgTextParts = msg.parts?.filter(p => p.type === 'text') || [];
              const msgText = msgTextParts
                .map(p => (p as { type: 'text'; text: string }).text)
                .join('') || msg.content || '';
              
              // 获取 token 使用量（仅 assistant 消息）
              const metadata = (msg as UIMessage & { metadata?: TokenUsage }).metadata;
              const tokenUsage = msg.role === 'assistant' ? metadata : undefined;
              
              // 只保存有内容的消息
              if (msgText.trim()) {
                await aiChatStore.saveMessage({ 
                  role: msg.role as 'user' | 'assistant', 
                  content: msgText,
                  tokenUsage,
                });
              }
            }
            toast.success('已中断，回复已保存');
          } catch (e) {
            console.error('Failed to save aborted messages:', e);
            toast.error('保存失败');
          } finally {
            isSavingMessages = false;
          }
        }
      } else {
        // 只有 reasoning，没有正文内容，丢弃
        toast.info('已中断，思考内容已丢弃');
      }
    }
    
    wasAborted = false;
    aiChatStore.isSending = false;
    status = 'ready';
  }

  // 处理消息编辑（删除后续消息并重新发送）
  async function handleEditMessage(messageId: string, newContent: string, messageIndex: number) {
    if (!aiChatStore.currentSessionId) return;
    
    // 找到要编辑的消息在数据库消息中的位置
    const dbMessages = aiChatStore.currentMessages;
    const dbMsgIndex = dbMessages.findIndex(m => m.id === messageId);
    
    // 获取编辑消息之前的消息作为上下文（用于本地显示）
    const contextMessages = messages.slice(0, messageIndex);
    
    if (dbMsgIndex === -1) {
      // 消息还没保存到数据库，直接在本地处理
      const sessionId = aiChatStore.currentSessionId;
      
      if (currentSessionId) {
        chatCache.delete(currentSessionId);
      }
      
      const newChat = createChat(sessionId);
      chatCache.set(sessionId, newChat);
      currentChat = newChat;
      currentSessionId = sessionId;
      messages = contextMessages;
      
      // 发送编辑后的消息
      await handleSend(newContent);
      return;
    }
    
    // 获取要删除的消息的 msgSeq
    const messageToEdit = dbMessages[dbMsgIndex];
    const msgSeq = messageToEdit.msgSeq;
    
    const sessionId = aiChatStore.currentSessionId;
    
    if (currentSessionId) {
      chatCache.delete(currentSessionId);
    }
    
    // 构建新的消息列表（上下文 + 新用户消息）用于本地显示
    const newUserMessage: ExtendedUIMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: newContent,
      parts: [{ type: 'text', text: newContent }],
      createdAt: new Date(),
    };
    
    const messagesForDisplay = [...contextMessages, newUserMessage];
    
    // 创建新的 Chat 实例，传递 rewriteFromMsgSeq 让后端删除数据库中的消息
    const newChat = createChat(sessionId, { rewriteFromMsgSeq: msgSeq });
    chatCache.set(sessionId, newChat);
    currentChat = newChat;
    currentSessionId = sessionId;
    
    // 更新本地消息显示（删除该消息及之后的消息）
    messages = messagesForDisplay;
    
    // 清除已保存消息 ID 缓存（被删除的消息）
    const messagesToDelete = dbMessages.slice(dbMsgIndex);
    messagesToDelete.forEach(m => savedMessageIds.delete(m.id));
    
    // 初始化已保存消息 ID（只保留上下文消息）
    savedMessageIds.clear();
    dbMessages.slice(0, dbMsgIndex).forEach(m => savedMessageIds.add(m.id));
    
    // 发送新消息到后端
    await currentChat.sendMessage({ text: newContent });
    
    // 等待响应完成后保存消息并刷新
    const checkAndSave = setInterval(async () => {
      if (currentChat && currentChat.status === 'ready') {
        clearInterval(checkAndSave);
        
        if (isSavingMessages) return;
        isSavingMessages = true;
        
        try {
          const chatMsgs = currentChat.messages;
          
          for (const msg of chatMsgs) {
            if (savedMessageIds.has(msg.id)) continue;
            savedMessageIds.add(msg.id);
            
            const textParts = msg.parts?.filter(p => p.type === 'text') || [];
            const text = textParts
              .map(p => (p as { type: 'text'; text: string }).text)
              .join('') || msg.content || '';
            
            const reasoningParts = msg.parts?.filter(p => p.type === 'reasoning') || [];
            const reasoning = reasoningParts
              .map(p => (p as { type: 'reasoning'; text: string }).text)
              .join('');
            
            // 提取文件附件
            const fileParts = msg.parts?.filter(p => p.type === 'file') || [];
            const fileAttachments = fileParts.map(p => ({
              type: 'file' as const,
              mediaType: (p as { type: 'file'; mediaType: string; url: string }).mediaType,
              url: (p as { type: 'file'; mediaType: string; url: string }).url,
            }));
            
            // 获取 token 使用量（仅 assistant 消息）
            const metadata = (msg as UIMessage & { metadata?: TokenUsage }).metadata;
            const tokenUsage = msg.role === 'assistant' ? metadata : undefined;
            
            await aiChatStore.saveMessage({ 
              role: msg.role as 'user' | 'assistant', 
              content: text,
              reasoning: reasoning || undefined,
              attachments: fileAttachments.length > 0 ? fileAttachments : undefined,
              tokenUsage,
            });
          }
          
          // 刷新会话消息
          await aiChatStore.loadSessionMessages(sessionId);
        } catch (e) {
          console.error('Failed to save messages:', e);
        } finally {
          isSavingMessages = false;
        }
      }
    }, 200);

    setTimeout(() => clearInterval(checkAndSave), 60000);
  }

  // 消息部分类型（用于附件）
  interface MessagePart {
    type: 'text' | 'file';
    text?: string;
    mediaType?: string;
    url?: string;
  }

  // 发送消息（每次发送时使用当前选中的模型/Agent 创建新的 Chat 实例）
  async function handleSend(content: string, attachments?: MessagePart[]) {
    // 检查是否可以发送消息
    if (!aiChatStore.canSendMessage) {
      alert('请先选择一个模型或智能体');
      return;
    }

    // 如果没有当前会话，创建一个
    if (!aiChatStore.currentSessionId) {
      try {
        await aiChatStore.createSession();
      } catch (e) {
        console.error('Failed to create session:', e);
        alert('创建会话失败');
        return;
      }
    } else {
      // 检查当前会话的模型/智能体是否与选中的匹配
      // 如果不匹配且会话有消息，创建新会话
      await aiChatStore.ensureSessionForCurrentSelection();
    }

    const sessionId = aiChatStore.currentSessionId!;
    
    // 每次发送消息时，使用当前选中的模型/Agent 创建新的 Chat 实例
    // 这样切换模型后发送消息会使用新模型，但保留历史上下文
    if (currentSessionId) {
      chatCache.delete(currentSessionId);
    }
    
    // 创建新的 Chat 实例（后端会从数据库加载历史消息）
    const newChat = createChat(sessionId);
    chatCache.set(sessionId, newChat);
    currentChat = newChat;
    currentSessionId = sessionId;
    
    // 同步本地消息显示（保留 reasoning 用于显示）
    messages = aiChatStore.currentMessages.map(m => dbMessageToUIMessage(m, false));

    // 更新会话标题（第一条消息）
    if (aiChatStore.currentMessages.length === 0) {
      const title = content.slice(0, 30) + (content.length > 30 ? '...' : '');
      aiChatStore.updateSessionTitle(title);
    }

    // 初始化已保存消息 ID（从数据库消息）
    aiChatStore.currentMessages.forEach(m => savedMessageIds.add(m.id));

    // 构建消息 parts
    const messageParts: Array<{ type: 'text'; text: string } | { type: 'file'; mediaType: string; url: string }> = [];
    
    // 添加附件
    if (attachments && attachments.length > 0) {
      for (const attachment of attachments) {
        if (attachment.type === 'file' && attachment.mediaType && attachment.url) {
          messageParts.push({
            type: 'file',
            mediaType: attachment.mediaType,
            url: attachment.url,
          });
        }
      }
    }
    
    // 添加文本
    if (content) {
      messageParts.push({ type: 'text', text: content });
    }

    // 发送消息到 AI（使用 parts 格式）
    if (messageParts.length > 0) {
      await currentChat.sendMessage({ 
        role: 'user',
        parts: messageParts,
      });
    }

    // 等待响应完成后保存所有消息到数据库
    const checkAndSave = setInterval(async () => {
      if (currentChat && currentChat.status === 'ready') {
        clearInterval(checkAndSave);
        
        // 防止并发保存
        if (isSavingMessages) return;
        isSavingMessages = true;
        
        try {
          // 获取 Chat 中的消息
          const chatMsgs = currentChat.messages;
          
          // 按顺序保存新消息
          for (const msg of chatMsgs) {
            // 跳过已保存的消息
            if (savedMessageIds.has(msg.id)) continue;
            
            // 标记为已保存（先标记，防止重复）
            savedMessageIds.add(msg.id);
            
            // 提取文本内容
            const textParts = msg.parts?.filter(p => p.type === 'text') || [];
            const text = textParts
              .map(p => (p as { type: 'text'; text: string }).text)
              .join('') || msg.content || '';
            
            // 提取 reasoning 内容
            const reasoningParts = msg.parts?.filter(p => p.type === 'reasoning') || [];
            const reasoning = reasoningParts
              .map(p => (p as { type: 'reasoning'; text: string }).text)
              .join('');
            
            // 提取文件附件
            const fileParts = msg.parts?.filter(p => p.type === 'file') || [];
            const fileAttachments = fileParts.map(p => ({
              type: 'file' as const,
              mediaType: (p as { type: 'file'; mediaType: string; url: string }).mediaType,
              url: (p as { type: 'file'; mediaType: string; url: string }).url,
            }));
            
            // 获取 token 使用量（仅 assistant 消息）
            const metadata = (msg as UIMessage & { metadata?: TokenUsage }).metadata;
            const tokenUsage = msg.role === 'assistant' ? metadata : undefined;
            
            // 保存消息（包含 reasoning、附件和 token 使用量）
            await aiChatStore.saveMessage({ 
              role: msg.role as 'user' | 'assistant', 
              content: text,
              reasoning: reasoning || undefined,
              attachments: fileAttachments.length > 0 ? fileAttachments : undefined,
              tokenUsage,
            });
          }
        } catch (e) {
          console.error('Failed to save messages:', e);
        } finally {
          isSavingMessages = false;
        }
      }
    }, 200);

    // 超时清理
    setTimeout(() => clearInterval(checkAndSave), 60000);
  }
</script>

<div class="flex flex-col h-full bg-background border-l">
  <!-- 顶部工具栏 -->
  <ChatToolbar />
  
  <!-- 消息列表 -->
  <ChatMessages {messages} {status} onEditMessage={handleEditMessage} />
  
  <!-- 输入区域 -->
  <ChatInput onSend={handleSend} onAbort={handleAbort} />
</div>
