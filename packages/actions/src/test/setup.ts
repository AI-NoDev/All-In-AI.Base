/**
 * Test Setup - 创建用于测试的 Elysia 实例
 * 
 * 使用 Elysia Eden Treaty 进行单元测试
 * 参考: https://elysiajs.com/eden/treaty/unit-test.html
 * 
 * 使用 PGlite 作为内存数据库进行测试
 * 参考: https://orm.drizzle.team/docs/get-started/pglite-new
 */
import { Elysia } from 'elysia';
import { PGlite } from '@electric-sql/pglite';
import { drizzle } from 'drizzle-orm/pglite';
import type { ActionDefinition, DrizzleDB } from '../core/types';

// 创建 PGlite 内存数据库实例
let pgliteInstance: PGlite | null = null;
let testDbInstance: DrizzleDB | null = null;

/**
 * 获取测试用的 PGlite 数据库实例
 */
export async function getTestDb(): Promise<DrizzleDB> {
  if (!testDbInstance) {
    pgliteInstance = new PGlite();
    testDbInstance = drizzle({ client: pgliteInstance });
  }
  return testDbInstance;
}

/**
 * 关闭测试数据库连接
 */
export async function closeTestDb(): Promise<void> {
  if (pgliteInstance) {
    await pgliteInstance.close();
    pgliteInstance = null;
    testDbInstance = null;
  }
}

// Mock 用户上下文
export const mockContext = {
  currentUserId: 'test-user-id-00000000-0000-0000-0000-000000000001',
  currentUserName: 'TestUser',
  token: 'mock-jwt-token',
};

/** API 响应类型 */
interface ApiResponse<T = unknown> {
  data: T | null;
  status: number;
  message: string;
}

/**
 * 创建 action 的测试 handler
 */
export function createActionHandler<T>(action: ActionDefinition, db?: DrizzleDB) {
  return async (ctx: { query: Record<string, string>; body: unknown; params: Record<string, string> }): Promise<ApiResponse<T>> => {
    const { query, body, params } = ctx;
    
    try {
      const input = {
        ...(query ?? {}),
        ...(params ?? {}),
        ...((body as Record<string, unknown>) ?? {}),
      };
      
      const dbInstance = db ?? await getTestDb();
      
      const result = await (action.execute as (input: unknown, context: unknown) => Promise<T>)(
        input,
        {
          ...mockContext,
          db: dbInstance,
        }
      );
      
      return { data: result, status: 200, message: 'ok' };
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      return { data: null, status: 500, message: errorMsg };
    }
  };
}

/**
 * 创建测试用的 Elysia 实例（无类型推断版本）
 * 
 * 注意：此函数返回的 app 没有完整的类型推断
 * 如果需要类型推断，请在测试文件中直接使用 Elysia 链式调用
 * 
 * @example
 * ```ts
 * // 无类型推断（简单场景）
 * const app = createTestApp([roleGetSchema]);
 * const api = treaty(app);
 * 
 * // 有类型推断（需要类型安全时）
 * const app = new Elysia()
 *   .get('/api/system/role/schema', createActionHandler(roleGetSchema));
 * const api = treaty(app);
 * ```
 */
export function createTestApp(actions: ActionDefinition[], db?: DrizzleDB) {
  let app = new Elysia();

  for (const action of actions) {
    const handler = createActionHandler(action, db);
    
    switch (action.meta.method) {
      case 'GET':
        app = app.get(action.meta.path, handler) as typeof app;
        break;
      case 'POST':
        app = app.post(action.meta.path, handler) as typeof app;
        break;
      case 'PUT':
        app = app.put(action.meta.path, handler) as typeof app;
        break;
      case 'DELETE':
        app = app.delete(action.meta.path, handler) as typeof app;
        break;
    }
  }

  return app;
}

/**
 * 生成测试数据的辅助函数
 */
export const testData = {
  uuid: () => crypto.randomUUID(),
  string: (prefix = 'test') => `${prefix}_${Date.now()}`,
  email: () => `test_${Date.now()}@example.com`,
  phone: () => `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
  status: () => Math.random() > 0.5 ? '0' : '1',
  timestamp: () => new Date().toISOString(),
};
