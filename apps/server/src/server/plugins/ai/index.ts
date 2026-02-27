/**
 * AI Plugin - 简化版
 * 
 * 提供统一的 AI 对话接口，支持：
 * - 普通模式（modelId）
 * - Agent 模式（agentId）
 * - 自动加载会话历史消息（sessionId）
 * - 重写模式（rewriteFromMsgSeq）：删除指定序号及之后的消息，重新生成
 */

import { Elysia, t } from 'elysia';
import { stream, stepCountIs, type UIMessage, type ProviderType } from '@qiyu-allinai/ai';
import { agentMessage, agentSession, user } from '@qiyu-allinai/db';
import db from '@qiyu-allinai/db/connect';
import { eq, asc, gte, and, desc, sql } from 'drizzle-orm';
import type { ActionContext } from '@qiyu-allinai/actions';
import { bearerPlugin } from '../bearer';
import { jwtPlugin } from '../jwt';
import { getModelConfig, getAgentConfig, convertClientTools, normalizeMessages } from './utils';
import type { JwtContext, BearerContext, InputMessage, ClientToolDefinition } from './types';

/** 消息部分 schema */
const messagePartSchema = t.Union([
  t.Object({ type: t.Literal('text'), text: t.String() }),
  t.Object({ type: t.Literal('file'), mediaType: t.String(), url: t.String() }),
  t.Object({ type: t.String() }), // 其他类型宽松处理
]);

/** 请求体 Schema */
const chatRequestSchema = t.Object({
  /** 模型 ID（与 agentId 二选一） */
  modelId: t.Optional(t.String({ format: 'uuid' })),
  /** Agent ID（与 modelId 二选一） */
  agentId: t.Optional(t.String({ format: 'uuid' })),
  /** 会话 ID（可选，用于加载历史消息） */
  sessionId: t.Optional(t.String({ format: 'uuid' })),
  /** 重写起始序号（可选，从该序号开始删除消息并重新生成） */
  rewriteFromMsgSeq: t.Optional(t.Number()),
  /** 当前消息列表（新消息） */
  messages: t.Array(t.Object({
    id: t.String(),
    role: t.Union([t.Literal('user'), t.Literal('assistant'), t.Literal('system')]),
    content: t.Optional(t.String()),
    parts: t.Optional(t.Array(messagePartSchema)),
  })),
  /** 系统提示词 */
  system: t.Optional(t.String()),
  /** 自定义工具 */
  tools: t.Optional(t.Record(t.String(), t.Object({
    description: t.String(),
    parameters: t.Record(t.String(), t.Unknown()),
  }))),
  /** 工具选择策略 */
  toolChoice: t.Optional(t.Union([t.Literal('auto'), t.Literal('none'), t.Literal('required')])),
  /** 最大步数 */
  maxSteps: t.Optional(t.Number()),
  /** MCP 服务器 ID 列表（可选，用于加载额外的工具） */
  mcpServerIds: t.Optional(t.Array(t.String({ format: 'uuid' }))),
});

/**
 * 从数据库加载会话历史消息
 * @param sessionId 会话ID
 * @param beforeMsgSeq 可选，只加载该序号之前的消息（用于重写模式）
 */
async function loadSessionHistory(sessionId: string, beforeMsgSeq?: number): Promise<UIMessage[]> {
  const conditions = [eq(agentMessage.sessionId, sessionId)];
  
  // 如果指定了 beforeMsgSeq，只加载该序号之前的消息
  if (beforeMsgSeq !== undefined) {
    conditions.push(sql`${agentMessage.msgSeq} < ${beforeMsgSeq}`);
  }
  
  const historyMessages = await db.select()
    .from(agentMessage)
    .where(and(...conditions))
    .orderBy(asc(agentMessage.msgSeq));
  
  return historyMessages.map(msg => {
    const content = msg.content as { type: string; text?: string; reasoning?: string } | { type: string; text?: string; mediaType?: string; url?: string }[] | string;
    
    // 处理不同的 content 格式
    let parts: Array<{ type: string; text?: string; image?: string; data?: string; mimeType?: string }>;
    
    if (typeof content === 'string') {
      parts = [{ type: 'text', text: content }];
    } else if (Array.isArray(content)) {
      // content 是数组格式
      parts = content.map(p => {
        if (p.type === 'text') {
          return { type: 'text', text: p.text || '' };
        }
        if (p.type === 'file' && 'mediaType' in p && 'url' in p) {
          const mediaType = p.mediaType || '';
          const url = p.url || '';
          if (mediaType.startsWith('image/')) {
            return { type: 'image', image: url };
          }
          return { type: 'file', data: url, mimeType: mediaType };
        }
        return { type: 'text', text: '' };
      });
    } else {
      // content 是单个对象格式
      parts = [{ type: 'text', text: content.text || '' }];
    }
    
    return {
      id: msg.id,
      role: msg.role,
      content: parts,
      parts,
    } as unknown as UIMessage;
  });
}

/**
 * 删除指定序号及之后的消息
 */
async function deleteMessagesFromSeq(sessionId: string, msgSeq: number): Promise<number> {
  const deleted = await db.delete(agentMessage)
    .where(and(
      eq(agentMessage.sessionId, sessionId),
      gte(agentMessage.msgSeq, msgSeq)
    ))
    .returning();
  
  if (deleted.length > 0) {
    // 更新会话统计
    type TokenUsageType = { totalTokens?: number; inputTokens?: number; outputTokens?: number } | null;
    const deletedTokens = deleted.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsageType)?.totalTokens ?? 0), 0);
    const deletedPromptTokens = deleted.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsageType)?.inputTokens ?? 0), 0);
    const deletedCompletionTokens = deleted.reduce((sum, m) => sum + ((m.tokenUsage as TokenUsageType)?.outputTokens ?? 0), 0);
    
    // 获取最后一条消息
    const [lastMsg] = await db.select()
      .from(agentMessage)
      .where(eq(agentMessage.sessionId, sessionId))
      .orderBy(desc(agentMessage.msgSeq))
      .limit(1);
    
    await db.update(agentSession).set({ 
      messageCount: sql`GREATEST(message_count - ${deleted.length}, 0)`,
      lastMessageAt: lastMsg?.createdAt ?? null,
      tokenUsage: sql`jsonb_set(
        jsonb_set(
          jsonb_set(
            token_usage,
            '{totalTokens}',
            to_jsonb(GREATEST((token_usage->>'totalTokens')::int - ${deletedTokens}, 0))
          ),
          '{promptTokens}',
          to_jsonb(GREATEST((token_usage->>'promptTokens')::int - ${deletedPromptTokens}, 0))
        ),
        '{completionTokens}',
        to_jsonb(GREATEST((token_usage->>'completionTokens')::int - ${deletedCompletionTokens}, 0))
      )`,
      updatedAt: new Date().toISOString()
    }).where(eq(agentSession.id, sessionId));
  }
  
  return deleted.length;
}

export const aiPlugin = new Elysia({ name: 'plugin/ai' })
  .use(bearerPlugin)
  .use(jwtPlugin)
  .post('/api/ai/chat', async (ctx) => {
    const { body, bearer, jwt } = ctx as typeof ctx & JwtContext & BearerContext;
    const { modelId, agentId, sessionId, rewriteFromMsgSeq, messages, system, tools: clientTools, toolChoice, maxSteps, mcpServerIds } = body;

    // 构建 ActionContext
    const actionContext: ActionContext = {
      db,
      currentUserId: '',
      currentUserName: '',
      token: bearer || '',
    };

    if (bearer) {
      const payload = await jwt.verify(bearer);
      if (payload && typeof payload === 'object' && 'sub' in payload) {
        const userId = payload.sub as string;
        actionContext.currentUserId = userId;
        
        // 从数据库查询用户名（与 actions plugin 保持一致）
        const [userResult] = await db
          .select({ name: user.name, loginName: user.loginName })
          .from(user)
          .where(eq(user.id, userId))
          .limit(1);
        
        if (userResult) {
          actionContext.currentUserName = userResult.name || userResult.loginName;
        }
      }
    }

    // 如果是重写模式，先删除指定序号及之后的消息
    if (sessionId && rewriteFromMsgSeq !== undefined) {
      await deleteMessagesFromSeq(sessionId, rewriteFromMsgSeq);
    }

    // 加载会话历史消息（重写模式下只加载 rewriteFromMsgSeq 之前的消息）
    let historyMessages: UIMessage[] = [];
    if (sessionId) {
      historyMessages = await loadSessionHistory(sessionId, rewriteFromMsgSeq);
    }

    // 规范化当前消息
    const currentMessages = normalizeMessages(messages as InputMessage[]);
    
    // 合并历史消息和当前消息
    const allMessages = [...historyMessages, ...currentMessages];

    // Agent 模式
    if (agentId) {
      const config = await getAgentConfig(agentId, actionContext, mcpServerIds);
      const mergedTools = {
        ...config.tools,
        ...convertClientTools(clientTools as Record<string, ClientToolDefinition>),
      };
      console.log(JSON.stringify(mergedTools,null,2))

      const result = await stream({
        provider: {
          providerType: (config.provider.providerType || 'openai-compatible') as ProviderType,
          baseURL: config.provider.baseUrl,
          apiKey: config.provider.token,
        },
        model: config.model.modelId,
        messages: allMessages,
        system: system || config.agent.systemPrompt || undefined,
        toolChoice: toolChoice ?? (Object.keys(mergedTools).length > 0 ? 'auto' : 'none'),
        tools: mergedTools,
        stopWhen: stepCountIs(maxSteps ?? config.agent.maxLoops ?? 10),
      });

      return result.toUIMessageStreamResponse({
        messageMetadata: ({ part }) => {
          if (part.type === 'finish') {
            const usage = part.totalUsage;
            return {
              totalTokens: usage?.totalTokens,
              inputTokens: usage?.inputTokens,
              outputTokens: usage?.outputTokens,
              inputTokenDetails: usage?.inputTokenDetails,
              outputTokenDetails: usage?.outputTokenDetails,
            };
          }
          return undefined;
        },
      });
    }

    // 普通模式（需要 modelId）
    if (!modelId) throw new Error('error.ai.model.idRequired');
    
    const config = await getModelConfig(modelId);
    const tools = convertClientTools(clientTools as Record<string, ClientToolDefinition>);

    const result = await stream({
      provider: {
        providerType: (config.provider.providerType || 'openai-compatible') as ProviderType,
        baseURL: config.provider.baseUrl,
        apiKey: config.provider.token,
      },
      model: config.model.modelId,
      messages: allMessages,
      system,
      toolChoice,
      tools,
      stopWhen: stepCountIs(maxSteps ?? 5),
    });

    return result.toUIMessageStreamResponse({
      messageMetadata: ({ part }) => {
        if (part.type === 'finish') {
          const usage = part.totalUsage;
          return {
            totalTokens: usage?.totalTokens,
            inputTokens: usage?.inputTokens,
            outputTokens: usage?.outputTokens,
            inputTokenDetails: usage?.inputTokenDetails,
            outputTokenDetails: usage?.outputTokenDetails,
          };
        }
        return undefined;
      },
    });
  }, {
    body: chatRequestSchema,
    detail: {
      tags: ['AI'],
      summary: 'AI 对话',
      description: '统一的 AI 对话接口，支持普通模式（modelId）和 Agent 模式（agentId），可通过 sessionId 自动加载历史消息，通过 rewriteFromMsgSeq 实现消息重写',
    },
  });

// 导出类型和工具函数
export * from './types';
export * from './utils';
export * from './flow-executor';
