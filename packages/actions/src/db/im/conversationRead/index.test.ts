/**
 * ConversationRead Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  conversationReadGetSchema, 
  conversationReadGetByPagination, 
  conversationReadGetByPk,
  conversationReadMarkRead
} from './index';

const app = new Elysia()
  .get('/schema', createActionHandler(conversationReadGetSchema))
  .post('/query', createActionHandler(conversationReadGetByPagination))
  .get('/:conversationId/:userId', createActionHandler(conversationReadGetByPk))
  .put('/mark', createActionHandler(conversationReadMarkRead));

const api = treaty(app);

describe('ConversationRead Actions', () => {
  describe('conversationReadGetSchema', () => {
    it('should return JSON schema', async () => {
      const { data } = await api.schema.get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('type', 'object');
    });
  });

  describe.skipIf(!process.env.DATABASE_URL)('需要数据库', () => {
    it('conversationReadGetByPagination', async () => {
      const { data } = await api.query.post({ limit: 10, offset: 0 });
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('data');
      expect(data?.data).toHaveProperty('total');
    });
  });
});
