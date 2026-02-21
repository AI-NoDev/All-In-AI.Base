/**
 * 语义检索用户记忆
 * 
 * 使用 pgvector 进行向量相似度搜索，支持记忆衰减计算
 */

import { and, eq, inArray, gte, or, isNull, sql } from 'drizzle-orm';
import { defineAction } from '../../../core/define';
import { userMemory } from '@qiyu-allinai/db/entities/ai';
import { userMemorySemanticSearchBodySchema, userMemorySemanticSearchOutputSchema } from './schemas';
import { calculateDecayScore } from './utils';

export const userMemorySemanticSearch = defineAction({
  meta: {
    name: 'ai.userMemory.semanticSearch',
    displayName: '语义检索用户记忆',
    description: '使用向量相似度搜索用户记忆，支持记忆衰减计算',
    tags: ['ai', 'memory', 'search', 'semantic'],
    method: 'POST',
    path: '/api/ai/user-memory/semantic-search',
  },
  schemas: {
    bodySchema: userMemorySemanticSearchBodySchema,
    outputSchema: userMemorySemanticSearchOutputSchema,
  },
  execute: async (input, context) => {
    const { db } = context;
    const { 
      userId, 
      query, 
      memoryTypes, 
      topK, 
      minSimilarity, 
      includeExpired,
      considerDecay 
    } = input;

    // 生成查询向量
    if (!context.embeddingService) {
      throw new Error('error.ai.memory.embeddingServiceNotConfigured');
    }
    
    const queryEmbedding = await context.embeddingService.generateEmbedding(query);
    const embeddingStr = `[${queryEmbedding.join(',')}]`;

    // 构建基础条件
    const conditions = [
      eq(userMemory.userId, userId),
      eq(userMemory.status, '0'),
    ];

    // 记忆类型过滤
    if (memoryTypes?.length) {
      conditions.push(inArray(userMemory.memoryType, memoryTypes));
    }

    // 过期时间过滤
    if (!includeExpired) {
      const expireCondition = or(
        isNull(userMemory.expireAt),
        gte(userMemory.expireAt, new Date().toISOString())
      );
      if (expireCondition) conditions.push(expireCondition);
    }

    // 使用 pgvector 的余弦相似度搜索
    // 1 - (embedding <=> query_embedding) 将距离转换为相似度
    const similarityExpr = sql<number>`1 - (${userMemory.embedding} <=> ${embeddingStr}::vector)`;

    const results = await db.select({
      id: userMemory.id,
      userId: userMemory.userId,
      agentId: userMemory.agentId,
      sessionId: userMemory.sessionId,
      memoryType: userMemory.memoryType,
      content: userMemory.content,
      metadata: userMemory.metadata,
      importance: userMemory.importance,
      accessCount: userMemory.accessCount,
      lastAccessAt: userMemory.lastAccessAt,
      expireAt: userMemory.expireAt,
      embedding: userMemory.embedding,
      status: userMemory.status,
      createdBy: userMemory.createdBy,
      createdById: userMemory.createdById,
      updatedBy: userMemory.updatedBy,
      updatedById: userMemory.updatedById,
      createdAt: userMemory.createdAt,
      updatedAt: userMemory.updatedAt,
      similarity: similarityExpr,
    })
      .from(userMemory)
      .where(and(...conditions))
      .orderBy(sql`${userMemory.embedding} <=> ${embeddingStr}::vector`)
      .limit(topK * 2); // 多取一些，后面过滤

    // 过滤低相似度结果并计算衰减
    const filteredResults = results
      .filter(r => r.similarity >= minSimilarity)
      .map(r => {
        const decayScore = considerDecay 
          ? calculateDecayScore(r.lastAccessAt, r.importance, r.accessCount)
          : undefined;
        return {
          ...r,
          decayScore,
        };
      })
      .slice(0, topK);

    // 更新访问计数
    if (filteredResults.length > 0) {
      const ids = filteredResults.map(r => r.id);
      await db.update(userMemory)
        .set({
          accessCount: sql`${userMemory.accessCount} + 1`,
          lastAccessAt: new Date().toISOString(),
        })
        .where(inArray(userMemory.id, ids));
    }

    return {
      data: filteredResults,
      total: filteredResults.length,
    };
  },
});
