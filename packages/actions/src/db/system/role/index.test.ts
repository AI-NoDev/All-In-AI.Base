/**
 * Role Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  roleGetSchema, 
  roleGetByPagination, 
  roleGetByPk,
  roleCreate,
  roleUpdate,
  roleDeleteByPk 
} from './index';

const app = new Elysia()
  .get('/schema', createActionHandler(roleGetSchema))
  .post('/query', createActionHandler(roleGetByPagination))
  .get('/:id', createActionHandler(roleGetByPk))
  .post('/', createActionHandler(roleCreate))
  .put('/:id', createActionHandler(roleUpdate))
  .delete('/:id', createActionHandler(roleDeleteByPk));

const api = treaty(app);

describe('Role Actions', () => {
  describe('roleGetSchema', () => {
    it('should return JSON schema', async () => {
      const { data } = await api.schema.get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('type', 'object');
    });
  });

  describe.skipIf(!process.env.DATABASE_URL)('需要数据库', () => {
    it('roleGetByPagination', async () => {
      const { data } = await api.query.post({ limit: 10, offset: 0 });
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('data');
      expect(data?.data).toHaveProperty('total');
    });

    it('roleGetByPk - not found', async () => {
      const { data } = await api({ id: '00000000-0000-0000-0000-000000000000' }).get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toBeNull();
    });
  });
});
