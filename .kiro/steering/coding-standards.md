---
inclusion: always
---

# 编码规范与最佳实践

## TypeScript 类型规范

### 避免使用 `any`

❌ 错误示例：
```typescript
const data: any = response.data;
await api.system.postApiSystemUser({ data: form as any });
```

✅ 正确示例：
```typescript
// 定义明确的接口
interface UserFormData {
  name: string;
  email: string | null;
  status: string;
}

const data: UserFormData = response.data;

// 如果必须使用类型断言，使用具体类型
import type { Static } from '@sinclair/typebox';
type UserInsertData = Static<typeof userSchemas.insert>;
await api.system.postApiSystemUser({ data: form as UserInsertData });
```

### 避免复杂类型推理

❌ 错误示例：
```typescript
// 过于复杂的泛型嵌套
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;
type ComplexType<T, K extends keyof T, V extends T[K]> = Omit<T, K> & { [P in K]: V };
```

✅ 正确示例：
```typescript
// 使用简单明确的类型定义
interface UserSelect {
  id: string;
  name: string;
  email: string | null;
  status: string;
}

interface UserInsert extends Omit<UserSelect, 'id'> {
  id?: string;
}

// 从 TypeBox Schema 推导类型
import type { Static } from '@sinclair/typebox';
type UserSelect = Static<typeof userSchemas.select>;
type UserInsert = Static<typeof userSchemas.insert>;
```

### 类型定义位置

1. **实体类型** - 在 `packages/db/src/entities/` 中定义
2. **Action 输入/输出类型** - 使用 TypeBox Schema 推导
3. **前端组件类型** - 在组件文件顶部定义 interface
4. **共享类型** - 在 `packages/*/src/types.ts` 中定义

---

## TypeBox Schema 规范

### 基本原则

1. **Schema 与实体一一对应** - 每个数据库实体都有对应的 TypeBox Schema
2. **复用基础 Schema** - 使用 `pkSchema`, `auditSchema`, `deletedSchema`
3. **明确可选字段** - 使用 `t.Optional()` 或 `t.Union([..., t.Null()])`

### Schema 定义示例

```typescript
import { t } from 'elysia';
import type { Static } from '@sinclair/typebox';

// 基础字段 Schema
const baseFields = {
  name: t.String({ minLength: 1, maxLength: 100 }),
  status: t.String({ default: '0' }),
  remark: t.Optional(t.Union([t.String(), t.Null()])),
};

// Select Schema（查询返回）
export const entitySelectSchema = t.Object({
  id: t.String({ format: 'uuid' }),
  ...baseFields,
  createdAt: t.String(),
  updatedAt: t.String(),
});

// Insert Schema（创建）
export const entityInsertSchema = t.Object({
  id: t.Optional(t.String({ format: 'uuid' })),
  ...baseFields,
  createdBy: t.String(),
  updatedBy: t.String(),
});

// Update Schema（更新）
export const entityUpdateSchema = t.Partial(t.Omit(entityInsertSchema, ['id']));

// 导出统一对象
export const entitySchemas = {
  select: entitySelectSchema,
  insert: entityInsertSchema,
  update: entityUpdateSchema,
};

// 类型推导
type EntitySelect = Static<typeof entitySchemas.select>;
type EntityInsert = Static<typeof entitySchemas.insert>;
```

### 空值处理

```typescript
import { t } from 'elysia';

// 可选字段
const optionalString = t.Optional(t.String());

// 可空字段
const nullableString = t.Union([t.String(), t.Null()]);

// 可选且可空
const optionalNullableString = t.Optional(t.Union([t.String(), t.Null()]));

// 在 Schema 中使用
const filterSchema = t.Object({
  name: t.Optional(t.String()),
  ids: t.Optional(t.Array(t.String({ format: 'uuid' }))),
});
```

---

## 国际化 (i18n) 规范

### 翻译文件结构

```
packages/i18n/src/locales/
├── zh-CN/
│   ├── common.ts      # 通用翻译（按钮、操作等）
│   ├── error.ts       # 错误消息
│   ├── validation.ts  # 表单验证消息
│   └── db/
│       ├── system.ts  # 系统模块字段
│       ├── ai.ts      # AI 模块字段
│       ├── im.ts      # IM 模块字段
│       └── knowledge.ts # 知识库字段
└── en/
    └── ... (同上结构)
```

### 翻译 Key 命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 错误消息 | `error.{module}.{action}` | `error.system.admin.cannot.modify` |
| 字段名 | `db.{module}.{entity}.{field}` | `db.system.user.loginName` |
| 通用操作 | `common.{action}` | `common.save`, `common.delete` |
| 验证消息 | `validation.{rule}` | `validation.required`, `validation.email` |
| 页面标题 | `page.{module}.{page}` | `page.system.userList` |

### 添加新翻译

1. **同时更新中英文** - 在 `zh-CN` 和 `en` 目录下同时添加
2. **保持结构一致** - 两个语言的 key 结构必须完全相同
3. **使用嵌套对象** - 按模块组织，避免扁平化

```typescript
// packages/i18n/src/locales/zh-CN/error.ts
export const error = {
  system: {
    admin: {
      cannot: {
        modify: '系统管理员用户不能修改',
        delete: '系统管理员用户不能删除',
      },
    },
  },
};

// packages/i18n/src/locales/en/error.ts
export const error = {
  system: {
    admin: {
      cannot: {
        modify: 'System administrator cannot be modified',
        delete: 'System administrator cannot be deleted',
      },
    },
  },
};
```

### 前端使用翻译

```typescript
import { t } from '@/lib/stores/i18n.svelte';

// 使用翻译
const message = t('error.system.admin.cannot.modify');

// 带默认值
const message = t('error.unknown', '未知错误');
```

### 后端错误消息

后端抛出的错误消息使用 i18n key，前端负责翻译：

```typescript
// 后端 Action
throw new Error('error.system.admin.cannot.modify');

// 前端处理
catch (err) {
  const messageKey = err?.message || 'error.network.error';
  alert(t(messageKey, messageKey));
}
```

---

## 前端组件规范

### Svelte 5 状态管理

```svelte
<script lang="ts">
  // 使用 $state 定义响应式状态
  let count = $state(0);
  let users = $state<User[]>([]);
  
  // 使用 $derived 定义派生状态
  let total = $derived(users.length);
  let isLoading = $derived(loading || submitting);
  
  // 使用 $effect 处理副作用
  $effect(() => {
    if (userId) loadUser(userId);
  });
</script>
```

### 接口定义

在组件顶部定义所需接口：

```svelte
<script lang="ts">
  interface User {
    id: string;
    name: string;
    email: string | null;
    status: string;
    userType: string;
  }
  
  interface FormData {
    name: string;
    email: string;
    status: string;
  }
  
  let users = $state<User[]>([]);
  let form = $state<FormData>({ name: '', email: '', status: '0' });
</script>
```

### API 调用

```typescript
// 使用 authStore.createApi(true) 获取带认证的 API 实例
const api = authStore.createApi(true);

// 查询
const res = await api.system.postApiSystemUserQuery({
  filter: { status: '0' },
  limit: 20,
  offset: 0,
  sort: { field: 'createdAt', order: 'desc' }
});

// 创建/更新时，审计字段由 auth.svelte.ts 自动注入
await api.system.postApiSystemUser({ data: form });
```

---

## 后端 Action 规范

### 标准 CRUD Actions

每个实体应包含以下 Actions：

| Action | 方法 | 路径 | 说明 |
|--------|------|------|------|
| getByPagination | POST | `/api/{module}/{entity}/query` | 分页查询 |
| getByPk | GET | `/api/{module}/{entity}/:id` | 根据 ID 查询 |
| create | POST | `/api/{module}/{entity}` | 创建 |
| createMany | POST | `/api/{module}/{entity}/batch` | 批量创建 |
| update | PUT | `/api/{module}/{entity}/:id` | 更新 |
| updateMany | PUT | `/api/{module}/{entity}/batch` | 批量更新 |
| deleteByPk | DELETE | `/api/{module}/{entity}/:id` | 删除（软删除） |
| getSchema | GET | `/api/{module}/{entity}/schema` | 获取 Schema |

### 业务校验

在 Action 的 `execute` 函数中添加业务校验：

```typescript
execute: async (input, context) => {
  // 1. 权限校验
  if (!context.currentUserId) {
    throw new Error('error.auth.unauthorized');
  }
  
  // 2. 业务规则校验
  if (await checkIsSystemAdmin(input.id)) {
    throw new Error('error.system.admin.cannot.modify');
  }
  
  // 3. 数据校验
  const existing = await db.select().from(entity).where(eq(entity.id, input.id));
  if (!existing.length) {
    throw new Error('error.business.dataNotFound');
  }
  
  // 4. 执行操作
  const [result] = await db.update(entity).set(input.data).returning();
  return result;
},
```

---

## 命名规范

### 文件命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 实体文件 | camelCase | `user.ts`, `agentSession.ts` |
| 组件文件 | kebab-case | `user-list.svelte`, `site-header.svelte` |
| 路由文件 | kebab-case | `login-logs/+page.svelte` |
| 类型文件 | camelCase | `types.ts` |

### 变量命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 常量 | UPPER_SNAKE_CASE | `SYSTEM_ADMIN_USER_TYPE` |
| 函数 | camelCase | `loadUsers`, `handleSubmit` |
| 组件状态 | camelCase | `isLoading`, `selectedIds` |
| 接口 | PascalCase | `User`, `FormData` |
| 类型别名 | PascalCase | `UserSelect`, `ActionContext` |
