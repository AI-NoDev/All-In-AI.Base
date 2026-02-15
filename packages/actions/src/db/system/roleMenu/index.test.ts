/**
 * RoleMenu Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  roleMenuGetSchema, 
  roleMenuGetByPagination, 
  roleMenuGetByPk,
  roleMenuCreate,
  roleMenuDeleteByPk 
} from './index';

const app = new Elysia()
  .get('/schema', createActionHandler(roleMenuGetSchema))
  .post('/query', createActionHandler(roleMenuGetByPagination))
  .get('/:id', createActionHandler(roleMenuGetByPk))
  .post('/', createActionHandler(roleMenuCreate))
  .delete('/:id', createActionHandler(roleMenuDeleteByPk));

const api = treaty(app);

describe('RoleMenu Actions', () => {
  describe('roleMenuGetSchema', () => {
    it('should return JSON schema', async () => {
      const { data } = await api.schema.get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('type', 'object');
    });
  });

  describe.skipIf(!process.env.DATABASE_URL)('需要数据库', () => {
    it('roleMenuGetByPagination', async () => {
      const { data } = await api.query.post({ limit: 10, offset: 0 });
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('data');
      expect(data?.data).toHaveProperty('total');
    });

    it('roleMenuGetByPk - not found', async () => {
      const { data } = await api({ id: '00000000-0000-0000-0000-000000000000' }).get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toBeNull();
    });
  });
});
