/**
 * GroupMember Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  groupMemberGetSchema, 
  groupMemberGetByPagination, 
  groupMemberGetByPk,
  groupMemberAdd,
  groupMemberUpdate,
  groupMemberRemove
} from './index';

const app = new Elysia()
  .get('/schema', createActionHandler(groupMemberGetSchema))
  .post('/query', createActionHandler(groupMemberGetByPagination))
  .get('/:conversationId/:userId', createActionHandler(groupMemberGetByPk))
  .post('/', createActionHandler(groupMemberAdd))
  .put('/:conversationId/:userId', createActionHandler(groupMemberUpdate))
  .delete('/:conversationId/:userId', createActionHandler(groupMemberRemove));

const api = treaty(app);

describe('GroupMember Actions', () => {
  describe('groupMemberGetSchema', () => {
    it('should return JSON schema', async () => {
      const { data } = await api.schema.get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('type', 'object');
    });
  });

  describe.skipIf(!process.env.DATABASE_URL)('需要数据库', () => {
    it('groupMemberGetByPagination', async () => {
      const { data } = await api.query.post({ limit: 10, offset: 0 });
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('data');
      expect(data?.data).toHaveProperty('total');
    });
  });
});
