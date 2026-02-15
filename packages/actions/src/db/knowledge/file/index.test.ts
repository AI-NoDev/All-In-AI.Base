/**
 * File Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  fileGetSchema, 
  fileGetByPagination, 
  fileGetByPk,
  fileCreate,
  fileUpdate,
  fileDeleteByPk 
} from './index';

const app = new Elysia()
  .get('/schema', createActionHandler(fileGetSchema))
  .post('/query', createActionHandler(fileGetByPagination))
  .get('/:id', createActionHandler(fileGetByPk))
  .post('/', createActionHandler(fileCreate))
  .put('/:id', createActionHandler(fileUpdate))
  .delete('/:id', createActionHandler(fileDeleteByPk));

const api = treaty(app);

describe('File Actions', () => {
  describe('fileGetSchema', () => {
    it('should return JSON schema', async () => {
      const { data } = await api.schema.get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('type', 'object');
    });
  });

  describe.skipIf(!process.env.DATABASE_URL)('需要数据库', () => {
    it('fileGetByPagination', async () => {
      const { data } = await api.query.post({ limit: 10, offset: 0 });
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('data');
      expect(data?.data).toHaveProperty('total');
    });

    it('fileGetByPk - not found', async () => {
      const { data } = await api({ id: '00000000-0000-0000-0000-000000000000' }).get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toBeNull();
    });
  });
});
