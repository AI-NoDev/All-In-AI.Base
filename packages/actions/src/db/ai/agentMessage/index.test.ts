/**
 * AgentMessage Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  agentMessageGetSchema, 
  agentMessageGetByPagination, 
  agentMessageGetByPk,
  agentMessageCreate,
  agentMessageGetHistory
} from './index';

const app = new Elysia()
  .get('/schema', createActionHandler(agentMessageGetSchema))
  .post('/query', createActionHandler(agentMessageGetByPagination))
  .get('/history/:sessionId', createActionHandler(agentMessageGetHistory))
  .get('/:id', createActionHandler(agentMessageGetByPk))
  .post('/', createActionHandler(agentMessageCreate));

const api = treaty(app);

describe('AgentMessage Actions', () => {
  describe('agentMessageGetSchema', () => {
    it('should return JSON schema', async () => {
      const { data } = await api.schema.get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('type', 'object');
    });
  });

  describe.skipIf(!process.env.DATABASE_URL)('需要数据库', () => {
    it('agentMessageGetByPagination', async () => {
      const { data } = await api.query.post({ limit: 10, offset: 0 });
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('data');
      expect(data?.data).toHaveProperty('total');
    });

    it('agentMessageGetByPk - not found', async () => {
      const { data } = await api({ id: '00000000-0000-0000-0000-000000000000' }).get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toBeNull();
    });
  });
});
