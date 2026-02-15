/**
 * Config Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  configGetSchema, 
  configGetByPagination, 
  configGetByPk,
  configCreate,
  configUpdate,
  configDeleteByPk 
} from './index';

const app = new Elysia()
  .get('/schema', createActionHandler(configGetSchema))
  .post('/query', createActionHandler(configGetByPagination))
  .get('/:id', createActionHandler(configGetByPk))
  .post('/', createActionHandler(configCreate))
  .put('/:id', createActionHandler(configUpdate))
  .delete('/:id', createActionHandler(configDeleteByPk));

const api = treaty(app);

describe('Config Actions', () => {
  describe('configGetSchema', () => {
    it('should return JSON schema', async () => {
      const { data } = await api.schema.get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('type', 'object');
    });
  });

  describe.skipIf(!process.env.DATABASE_URL)('需要数据库', () => {
    it('configGetByPagination', async () => {
      const { data } = await api.query.post({ limit: 10, offset: 0 });
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('data');
      expect(data?.data).toHaveProperty('total');
    });

    it('configGetByPk - not found', async () => {
      const { data } = await api({ id: '00000000-0000-0000-0000-000000000000' }).get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toBeNull();
    });
  });
});
