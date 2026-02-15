/**
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
  .get('/list', createActionHandler(conversationHiddenGetList));

const api = treaty(app);

describe('ConversationHidden Actions', () => {
  describe.skipIf(!process.env.DATABASE_URL)('需要数据库', () => {
    it('conversationHiddenGetList', async () => {
      const { data } = await api.list.get();
      expect(data).toHaveProperty('status', 200);
      expect(Array.isArray(data?.data)).toBe(true);
    });
  });
});
