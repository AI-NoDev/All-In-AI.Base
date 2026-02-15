/**
 * CasbinRule Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  casbinRuleGetRolePermissions,
  casbinRuleSetRolePermissions,
  casbinRuleGetUserRoles,
  casbinRuleSetUserRoles
} from './index';

const app = new Elysia()
  .get('/role/:roleKey/permissions', createActionHandler(casbinRuleGetRolePermissions))
  .put('/role/:roleKey/permissions', createActionHandler(casbinRuleSetRolePermissions))
  .get('/user/:userId/roles', createActionHandler(casbinRuleGetUserRoles))
  .put('/user/:userId/roles', createActionHandler(casbinRuleSetUserRoles));

const api = treaty(app);

describe('CasbinRule Actions', () => {
  describe.skipIf(!process.env.DATABASE_URL)('需要数据库', () => {
    it('casbinRuleGetRolePermissions', async () => {
      const { data } = await api.role({ roleKey: 'admin' }).permissions.get();
      expect(data).toHaveProperty('status', 200);
    });

    it('casbinRuleGetUserRoles', async () => {
      const { data } = await api.user({ userId: '00000000-0000-0000-0000-000000000000' }).roles.get();
      expect(data).toHaveProperty('status', 200);
    });
  });
});
