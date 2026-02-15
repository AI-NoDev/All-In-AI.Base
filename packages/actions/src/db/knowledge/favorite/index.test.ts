/**
 * Favorite Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  favoriteAdd,
  favoriteRemove,
  favoriteList,
  favoriteCheck
} from './index';

const app = new Elysia()
  .post('/add', createActionHandler(favoriteAdd))
  .post('/remove', createActionHandler(favoriteRemove))
  .post('/list', createActionHandler(favoriteList))
  .post('/check', createActionHandler(favoriteCheck));

const api = treaty(app);

describe('Favorite Actions', () => {
  describe.skipIf(!process.env.DATABASE_URL)('需要数据库', () => {
    it('favoriteList', async () => {
      const { data } = await api.list.post({ limit: 10, offset: 0 });
      expect(data).toHaveProperty('status', 200);
    });

    it('favoriteCheck', async () => {
      const { data } = await api.check.post({ resourceId: '00000000-0000-0000-0000-000000000000', resourceType: 'file' });
      expect(data).toHaveProperty('status', 200);
    });
  });
});
