/**
 * ToolGroup Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  toolGroupGetSchema, 
  toolGroupGetByPagination, 
  toolGroupGetByPk,
  toolGroupCreate,
  toolGroupUpdate,
  toolGroupDeleteByPk 
} from './index';

const app = new Elysia()
  .get('/schema', createActionHandler(toolGroupGetSchema))
  .post('/query', createActionHandler(toolGroupGetByPagination))
  .get('/:id', createActionHandler(toolGroupGetByPk))
  .post('/', createActionHandler(toolGroupCreate))
  .put('/:id', createActionHandler(toolGroupUpdate))
  .delete('/:id', createActionHandler(toolGroupDeleteByPk));

const api = treaty(app);

describe('ToolGroup Actions', () => {
  describe('toolGroupGetSchema', () => {
    it('should return JSON schema', async () => {
      const { data } = await api.schema.get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('type', 'object');
    });
  });

  describe.skipIf(!process.env.DATABASE_URL)('需要数据库', () => {
    it('toolGroupGetByPagination', async () => {
      const { data } = await api.query.post({ limit: 10, offset: 0 });
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('data');
      expect(data?.data).toHaveProperty('total');
    });

    it('toolGroupGetByPk - not found', async () => {
      const { data } = await api({ id: '00000000-0000-0000-0000-000000000000' }).get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toBeNull();
    });
  });
});
