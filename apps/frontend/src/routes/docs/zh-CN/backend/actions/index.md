# Action 开发

Action 是业务逻辑的封装单元，定义 API 接口的输入、输出和执行逻辑。

## 文件位置

Action 文件位于 `packages/actions/src/db/{module}/{entity}/` 目录：

```
packages/actions/src/db/
├── system/
│   ├── user/
│   │   ├── index.ts           # 导出所有 Actions
│   │   ├── schemas.ts         # 共享 Schema
│   │   ├── utils.ts           # 工具函数
│   │   ├── getByPagination.ts # 分页查询
│   │   ├── getByPk.ts         # 根据 ID 查询
│   │   ├── create.ts          # 创建
│   │   ├── update.ts          # 更新
│   │   └── deleteByPk.ts      # 删除
│   └── role/
├── ai/
├── im/
└── knowledge/
```

## 定义 Action

使用 `defineAction` 函数定义 Action：

```typescript
// packages/actions/src/db/system/post/create.ts
import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { post, postZodSchemas } from '@qiyu-allinai/db/entities/system';

export const postCreate = defineAction({
  meta: {
    name: 'system.post.create',        // 唯一标识
    displayName: '创建岗位',            // 显示名称
    description: '创建单个岗位',        // 描述
    tags: ['system', 'post'],          // 标签（用于分组）
    method: 'POST',                    // HTTP 方法
    path: '/api/system/post',          // API 路径
  },
  schemas: {
    bodySchema: z.object({
      data: postZodSchemas.insert,     // 请求体 Schema
    }),
    outputSchema: postZodSchemas.select, // 响应 Schema
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [result] = await db.insert(post)
      .values(input.data)
      .returning();
    
    if (!result) {
      throw ActionError.badRequest('error.business.createFailed');
    }
    
    return result;
  },
});
```

## Action Meta 配置

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 唯一标识，格式：`module.entity.action` |
| displayName | string | 显示名称，用于日志和文档 |
| description | string | 描述信息 |
| tags | string[] | 标签，用于 OpenAPI 分组 |
| method | string | HTTP 方法：GET, POST, PUT, DELETE |
| path | string | API 路径，支持参数如 `/api/system/post/:id` |

## Schemas 配置

| 字段 | 说明 |
|------|------|
| querySchema | URL 查询参数 Schema |
| paramsSchema | 路径参数 Schema（如 `:id`） |
| bodySchema | 请求体 Schema |
| outputSchema | 响应 Schema |

## ActionContext

`execute` 函数的第二个参数是 `context`，包含：

```typescript
interface ActionContext {
  db: DrizzleInstance;        // 数据库实例
  token: string;              // JWT Token
  currentUserId: string;      // 当前用户 ID
  currentUserName: string;    // 当前用户名
  currentUserDeptId: string;  // 当前用户部门 ID
  currentUserType: string;    // 当前用户类型
}
```

## 标准 CRUD Actions

每个实体通常包含以下 Actions：

### 分页查询

```typescript
// getByPagination.ts
export const postGetByPagination = defineAction({
  meta: {
    name: 'system.post.getByPagination',
    displayName: '分页查询岗位',
    method: 'POST',
    path: '/api/system/post/query',
  },
  schemas: {
    bodySchema: z.object({
      filter: z.object({
        name: z.string().optional(),
        status: z.string().optional(),
      }).optional(),
      sort: z.object({
        field: z.string(),
        order: z.enum(['asc', 'desc']),
      }).optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }),
    outputSchema: z.object({
      data: z.array(postZodSchemas.select),
      total: z.number(),
    }),
  },
  execute: async (input, context) => {
    const { db } = context;
    const { filter, sort, limit, offset } = input;
    
    // 构建查询条件
    const conditions = [];
    if (filter?.name) {
      conditions.push(like(post.name, `%${filter.name}%`));
    }
    if (filter?.status) {
      conditions.push(eq(post.status, filter.status));
    }
    // 软删除过滤
    conditions.push(isNull(post.deletedAt));
    
    // 查询数据
    const data = await db.select()
      .from(post)
      .where(and(...conditions))
      .orderBy(sort?.order === 'desc' ? desc(post[sort.field]) : asc(post[sort.field]))
      .limit(limit)
      .offset(offset);
    
    // 查询总数
    const [{ count }] = await db.select({ count: sql`count(*)` })
      .from(post)
      .where(and(...conditions));
    
    return { data, total: Number(count) };
  },
});
```

### 根据 ID 查询

```typescript
// getByPk.ts
export const postGetByPk = defineAction({
  meta: {
    name: 'system.post.getByPk',
    displayName: '查询岗位详情',
    method: 'GET',
    path: '/api/system/post/:id',
  },
  schemas: {
    paramsSchema: z.object({
      id: z.string().uuid(),
    }),
    outputSchema: postZodSchemas.select.nullable(),
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [result] = await db.select()
      .from(post)
      .where(and(
        eq(post.id, input.id),
        isNull(post.deletedAt)
      ))
      .limit(1);
    
    return result || null;
  },
});
```

### 更新

```typescript
// update.ts
export const postUpdate = defineAction({
  meta: {
    name: 'system.post.update',
    displayName: '更新岗位',
    method: 'PUT',
    path: '/api/system/post/:id',
  },
  schemas: {
    paramsSchema: z.object({
      id: z.string().uuid(),
    }),
    bodySchema: z.object({
      data: postZodSchemas.update,
    }),
    outputSchema: postZodSchemas.select,
  },
  execute: async (input, context) => {
    const { db } = context;
    
    const [result] = await db.update(post)
      .set(input.data)
      .where(eq(post.id, input.id))
      .returning();
    
    if (!result) {
      throw ActionError.notFound('error.business.dataNotFound');
    }
    
    return result;
  },
});
```

### 删除（软删除）

```typescript
// deleteByPk.ts
export const postDeleteByPk = defineAction({
  meta: {
    name: 'system.post.deleteByPk',
    displayName: '删除岗位',
    method: 'DELETE',
    path: '/api/system/post/:id',
  },
  schemas: {
    paramsSchema: z.object({
      id: z.string().uuid(),
    }),
    outputSchema: z.object({
      success: z.boolean(),
    }),
  },
  execute: async (input, context) => {
    const { db, currentUserId } = context;
    
    await db.update(post)
      .set({
        deletedAt: new Date(),
        deletedBy: currentUserId,
      })
      .where(eq(post.id, input.id));
    
    return { success: true };
  },
});
```

## 导出 Actions

在 `index.ts` 中导出所有 Actions：

```typescript
// packages/actions/src/db/system/post/index.ts
export { postGetByPagination } from './getByPagination';
export { postGetByPk } from './getByPk';
export { postCreate } from './create';
export { postUpdate } from './update';
export { postDeleteByPk } from './deleteByPk';

// 导入用于注册
import { postGetByPagination } from './getByPagination';
import { postGetByPk } from './getByPk';
import { postCreate } from './create';
import { postUpdate } from './update';
import { postDeleteByPk } from './deleteByPk';

export const postActions = [
  postGetByPagination,
  postGetByPk,
  postCreate,
  postUpdate,
  postDeleteByPk,
];
```

## 注册 Actions

在模块的 `index.ts` 中汇总：

```typescript
// packages/actions/src/db/system/index.ts
import { userActions } from './user';
import { roleActions } from './role';
import { postActions } from './post';

export const systemActions = [
  ...userActions,
  ...roleActions,
  ...postActions,
];
```

最终在 `packages/actions/src/index.ts` 导出：

```typescript
import { systemActions } from './db/system';
import { aiActions } from './db/ai';

export const dbActions = [
  ...systemActions,
  ...aiActions,
];
```

## 错误处理

使用 `ActionError` 抛出业务错误：

```typescript
import { ActionError } from '../../../core/errors';

// 400 Bad Request
throw ActionError.badRequest('error.business.invalidData');

// 401 Unauthorized
throw ActionError.unauthorized('error.auth.unauthorized');

// 403 Forbidden
throw ActionError.forbidden('error.auth.forbidden');

// 404 Not Found
throw ActionError.notFound('error.business.dataNotFound');

// 500 Internal Server Error
throw ActionError.internal('error.system.internal');
```

## 权限检查

```typescript
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';

execute: async (input, context) => {
  const { db } = context;
  
  // 检查写入权限
  await checkWritePermission(db, context, BUSINESS_MODULE.POST, input.data.deptId);
  
  // ... 业务逻辑
},
```

## 下一步

- [前端组件](/docs/zh-CN/frontend/components) - 学习如何调用 API
- [实体开发](/docs/zh-CN/backend/entities) - 学习如何定义数据库实体
