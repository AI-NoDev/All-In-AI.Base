/**
 * 生成测试文件脚本
 * 运行: bun packages/actions/scripts/generate-tests.ts
 */
import { readdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = join(import.meta.dir, '../src/db');

// 标准 CRUD actions 的测试模板
function generateStandardTest(module: string, entity: string, entityPascal: string): string {
  return `/**
 * ${entityPascal} Actions 测试
 */
import { describe, it, expect } from 'bun:test';
import { Elysia } from 'elysia';
import { treaty } from '@elysiajs/eden';
import { createActionHandler } from '../../../test/setup';
import { 
  ${entity}GetSchema, 
  ${entity}GetByPagination, 
  ${entity}GetByPk
} from './index';

const app = new Elysia()
  .get('/schema', createActionHandler(${entity}GetSchema))
  .post('/query', createActionHandler(${entity}GetByPagination))
  .get('/:id', createActionHandler(${entity}GetByPk));

const api = treaty(app);

describe('${entityPascal} Actions', () => {
  describe('${entity}GetSchema', () => {
    it('should return JSON schema', async () => {
      const { data } = await api.schema.get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('type', 'object');
    });
  });

  describe('数据库操作', () => {
    it('${entity}GetByPagination', async () => {
      const { data } = await api.query.post({ limit: 10, offset: 0 });
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toHaveProperty('data');
      expect(data?.data).toHaveProperty('total');
    });

    it('${entity}GetByPk - not found', async () => {
      const { data } = await api({ id: '00000000-0000-0000-0000-000000000000' }).get();
      expect(data).toHaveProperty('status', 200);
      expect(data?.data).toBeNull();
    });
  });
});
`;
}

// 主函数
function main() {
  const modules = readdirSync(DB_PATH, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  console.log('Found modules:', modules);

  for (const module of modules) {
    const modulePath = join(DB_PATH, module);
    const entities = readdirSync(modulePath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const entity of entities) {
      const entityPath = join(modulePath, entity);
      const testPath = join(entityPath, `${entity}.test.ts`);

      // 跳过已存在的测试文件
      if (existsSync(testPath)) {
        console.log(`Skipping ${module}/${entity} - test already exists`);
        continue;
      }

      // 检查是否有 index.ts
      const indexPath = join(entityPath, 'index.ts');
      if (!existsSync(indexPath)) {
        console.log(`Skipping ${module}/${entity} - no index.ts`);
        continue;
      }

      const entityPascal = entity.charAt(0).toUpperCase() + entity.slice(1);
      const testContent = generateStandardTest(module, entity, entityPascal);

      writeFileSync(testPath, testContent);
      console.log(`Generated: ${module}/${entity}/${entity}.test.ts`);
    }
  }
}

main();
