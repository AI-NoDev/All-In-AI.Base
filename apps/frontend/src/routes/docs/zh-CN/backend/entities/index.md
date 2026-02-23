# 实体开发

实体（Entity）是数据库表的 TypeScript 定义，使用 Drizzle ORM 和 TypeBox（通过 drizzle-typebox）进行类型安全的数据库操作。

## 文件位置

实体文件位于 `packages/db/src/entities/{module}/` 目录：

```
packages/db/src/entities/
├── base/              # 基础 Schema
│   ├── pkSchema.ts    # 主键（UUID）
│   ├── auditSchema.ts # 审计字段
│   └── deletedSchema.ts # 软删除
├── system/            # 系统模块
│   ├── user.ts
│   ├── role.ts
│   └── exportSchemas.ts
├── ai/                # AI 模块
├── im/                # 即时通讯
└── knowledge/         # 知识库
```

## 创建新实体

### 1. 定义字段

```typescript
// packages/db/src/entities/system/post.ts
import { pgTable, uuid, varchar, integer } from 'drizzle-orm/pg-core';
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createTypeboxSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

// 从 i18n 包导入翻译函数
import {
  db_system_post_meta_displayName,
  db_system_post_name,
  db_system_post_code,
  db_system_post_sort,
  db_system_post_status,
} from '@qiyu-allinai/i18n';

// 定义实体自有字段
const postOwnFields = {
  name: {
    field: varchar('name', { length: 50 }).notNull(),
    comment: db_system_post_name,
    config: { 
      canExport: true, 
      canImport: true,
      exportExcelColumnName: db_system_post_name,
      importExcelColumnName: db_system_post_name,
      cellType: "STRING" as const 
    }
  },
  code: {
    field: varchar('code', { length: 64 }).notNull().unique(),
    comment: db_system_post_code,
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
  sort: {
    field: integer('sort').default(0),
    comment: db_system_post_sort,
    config: { canExport: true, canImport: true, cellType: "NUMERIC" as const }
  },
  status: {
    field: varchar('status', { length: 1 }).default('0'),
    comment: db_system_post_status,
    config: { canExport: true, canImport: true, cellType: "STRING" as const }
  },
} satisfies FieldMap;

// 合并基础字段
export const postFields = mergeFields(pkSchema, auditSchema, deletedSchema, postOwnFields);
```

### 2. 定义元数据

```typescript
export const postMeta: EntityMeta = {
  name: 'system_post',                    // 表名（格式：module_entity）
  displayName: db_system_post_meta_displayName,  // 显示名称
  verboseName: db_system_post_meta_displayName,  // 单数名称
  verboseNamePlural: db_system_post_meta_displayName, // 复数名称
  permissions: createPermissions('system_post'), // 自动生成权限名
};
```

### 3. 创建表和 Schema

```typescript
// 创建 pgTable
export const post = pgTable(postMeta.name, getTableFields(postFields));

// 获取字段配置（用于导入导出）
export const postConfig = getFieldConfigs(postFields);

// 创建 TypeBox Schemas（使用 drizzle-typebox）
export const postSchemas = createTypeboxSchemas(post, postFields);
```

### 4. 导出 Schema

在模块的 `exportSchemas.ts` 中导出：

```typescript
// packages/db/src/entities/system/exportSchemas.ts
export * from './user';
export * from './role';
export * from './post';  // 添加新实体
```

## 基础 Schema 说明

### pkSchema - 主键

```typescript
export const pkSchema = {
  id: {
    field: uuid('id').primaryKey().defaultRandom(),
    comment: db_base_id,
    config: { canExport: true, canImport: false }
  },
} satisfies FieldMap;
```

### auditSchema - 审计字段

```typescript
export const auditSchema = {
  createdBy: {
    field: varchar('created_by', { length: 64 }),
    comment: db_base_createdBy,
    config: { canExport: true, canImport: false }
  },
  updatedBy: {
    field: varchar('updated_by', { length: 64 }),
    comment: db_base_updatedBy,
    config: { canExport: true, canImport: false }
  },
  createdAt: {
    field: timestamp('created_at').defaultNow(),
    comment: db_base_createdAt,
    config: { canExport: true, canImport: false }
  },
  updatedAt: {
    field: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
    comment: db_base_updatedAt,
    config: { canExport: true, canImport: false }
  },
} satisfies FieldMap;
```

### deletedSchema - 软删除

```typescript
export const deletedSchema = {
  deletedAt: {
    field: timestamp('deleted_at'),
    comment: db_base_deletedAt,
    config: { canExport: false, canImport: false }
  },
  deletedBy: {
    field: varchar('deleted_by', { length: 64 }),
    comment: db_base_deletedBy,
    config: { canExport: false, canImport: false }
  },
} satisfies FieldMap;
```

## 字段配置说明

| 配置项 | 类型 | 说明 |
|--------|------|------|
| canExport | boolean | 是否可导出到 Excel |
| canImport | boolean | 是否可从 Excel 导入 |
| exportExcelColumnName | TranslateFn | 导出列名（翻译函数） |
| importExcelColumnName | TranslateFn | 导入列名（翻译函数） |
| cellType | string | 单元格类型：STRING, NUMERIC, IMAGE, TEXT |

## 生成的 TypeBox Schemas

`createTypeboxSchemas` 使用 drizzle-typebox 自动生成三个 Schema：

```typescript
import { t } from 'elysia';
import type { Static } from '@sinclair/typebox';

export const postSchemas = {
  // 查询返回类型
  select: t.Object({
    id: t.String({ format: 'uuid' }),
    name: t.String(),
    code: t.String(),
    // ... 所有字段
  }),
  
  // 创建类型
  insert: t.Object({
    id: t.Optional(t.String({ format: 'uuid' })),
    name: t.String(),
    code: t.String(),
    // ... 必填字段
  }),
  
  // 更新类型
  update: t.Partial(t.Object({
    name: t.String(),
    code: t.String(),
    // ... 所有字段可选
  })),
};

// 类型推导
type PostSelect = Static<typeof postSchemas.select>;
type PostInsert = Static<typeof postSchemas.insert>;
```

## 数据库迁移

### 开发环境

```bash
cd packages/db

# 直接推送 Schema 到数据库（会丢失数据）
bun run db:push
```

### 生产环境

```bash
cd packages/db

# 1. 生成迁移文件
bun run db:generate

# 2. 检查生成的迁移文件
# drizzle/xxxx_migration.sql

# 3. 执行迁移
bun run db:migrate
```

### 查看数据库

```bash
# 打开 Drizzle Studio
bun run db:studio
```

## 添加翻译

在 `packages/i18n` 中添加字段翻译：

```typescript
// packages/i18n/src/messages/zh-CN.json
{
  "db_system_post_meta_displayName": "岗位",
  "db_system_post_name": "岗位名称",
  "db_system_post_code": "岗位编码",
  "db_system_post_sort": "排序",
  "db_system_post_status": "状态"
}

// packages/i18n/src/messages/en.json
{
  "db_system_post_meta_displayName": "Post",
  "db_system_post_name": "Post Name",
  "db_system_post_code": "Post Code",
  "db_system_post_sort": "Sort",
  "db_system_post_status": "Status"
}
```

## 下一步

- [Action 开发](/docs/zh-CN/backend/actions) - 为实体创建 API 接口
- [数据库迁移](/docs/zh-CN/backend/migrations) - 详细的迁移指南
