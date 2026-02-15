/**
 * 生成测试文件脚本
 * 运行: bun packages/actions/scripts/generate-tests.ts
 */
import { readdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(import.meta.dir, '../src/db');

// 标准 CRUD actions 的测试模板
function generateStandardTest(module: string, entity: string, entityPascal: string): string {
  return `/**
 * ${entityPascal} Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  ${entity}GetSchema, 
  ${entity}GetByPagination, 
  ${entity}GetByPk
} from './index';

const app = new Elysia()
  .get('/schema', createActionHandler(${entity}GetSchema))
  .post('/query', createActionHandler(${entity}GetByPagination))
  .get('/:id', createActionHandler(${entity}GetByPk));

const api = treaty(app);

describe('${entityPascal} Actions', () => {
  describe('${entity}GetSchema', () => {
    it('should return JSON schema', async () => {
      const { data } = await api.schema.get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('type', 'object');
    });
  });

  describe('数据库操作', () => {
    it('${entity}GetByPagination', async () => {
      const { data } = await api.query.post({ limit: 10, offset: 0 });
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('data');
      expect(data?.data).toHaveProperty('total');
    });

    it('${entity}GetByPk - not found', async () => {
      const { data } = await api({ id: '00000000-0000-0000-0000-000000000000' }).get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toBeNull();
    });
  });
});
`;
}

// 特殊模块的测试模板
const specialTemplates: Record<string, (module: string, entity: string, entityPascal: string) => string> = {
  'im/conversationHidden': () => `/**
 * ConversationHidden Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  conversationHiddenHide, 
  conversationHiddenUnhide, 
  conversationHiddenGetList 
} from './index';

const app = new Elysia()
  .post('/hide', createActionHandler(conversationHiddenHide))
  .post('/unhide', createActionHandler(conversationHiddenUnhide))
  .get('/list', createActionHandler(conv