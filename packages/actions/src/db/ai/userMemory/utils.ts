/**
 * 用户记忆工具函数
 */

// 时间衰减系数（每小时衰减率）
const TIME_DECAY_COEFFICIENT = 0.005;

/**
 * 计算记忆衰减得分（模拟遗忘曲线）
 * 
 * 基于艾宾浩斯遗忘曲线：score = importance * e^(-decay * hours)
 * 
 * @param lastAccessAt 最后访问时间
 * @param importance 重要性（1-10）
 * @param accessCount 访问次数
 * @returns 衰减得分（0-1）
 */
export function calculateDecayScore(
  lastAccessAt: string | null,
  importance: number,
  accessCount: number
): number {
  const baseTime = lastAccessAt ? new Date(lastAccessAt) : new Date();
  const now = new Date();
  const hoursPassed = (now.getTime() - baseTime.getTime()) / (1000 * 60 * 60);
  
  // 重要性系数（1-10 映射到 0.1-1）
  const importanceCoeff = importance / 10;
  
  // 访问次数加成（访问越多，衰减越慢）
  const accessBonus = Math.min(accessCount * 0.02, 0.3);
  
  // 遗忘曲线公式
  const score = (importanceCoeff + accessBonus) * Math.exp(-TIME_DECAY_COEFFICIENT * hoursPassed);
  
  return Math.max(Math.min(score, 1), 0);
}

/**
 * 检查记忆是否已过期
 */
export function isMemoryExpired(expireAt: string | null): boolean {
  if (!expireAt) return false;
  return new Date(expireAt) < new Date();
}

/**
 * 计算短期记忆的默认过期时间（24小时后）
 */
export function getDefaultSTMExpireTime(): string {
  const expireAt = new Date();
  expireAt.setHours(expireAt.getHours() + 24);
  return expireAt.toISOString();
}

/**
 * 向量余弦相似度计算
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dotProduct += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
