# Action Development

Actions are encapsulated units of business logic that define API endpoint inputs, outputs, and execution logic.

## File Location

Action files are located in `packages/actions/src/db/{module}/{entity}/`:

```
packages/actions/src/db/
├── system/
│   ├── user/
│   │   ├── index.ts           # Export all Actions
│   │   ├── schemas.ts         # Shared schemas
│   │   ├── utils.ts           # Utility functions
│   │   ├── getByPagination.ts # Paginated query
│   │   ├── getByPk.ts         # Get by ID
│   │   ├── create.ts          # Create
│   │   ├── update.ts          # Update
│   │   └── deleteByPk.ts      # Delete
│   └── role/
├── ai/
├── im/
└── knowledge/
```

## Defining an Action

Use the `defineAction` function to define an Action:

```typescript
// packages/actions/src/db/system/post/create.ts
import { z } from 'zod';
import { defineAction } from '../../../core/define';
import { ActionError } from '../../../core/errors';
import { post, postZodSchemas } from '@qiyu-allinai/db/entities/system';

export const postCreate = defineAction({
  meta: {
    name: 'system.post.create',        // Unique identifier
    displayName: 'Create Post',         // Display name
    description: 'Create a single post', // Description
    tags: ['system', 'post'],           // Tags (for grouping)
    method: 'POST',                     // HTTP method
    path: '/api/system/post',           // API path
  },
  schemas: {
    bodySchema: z.object({
      data: postZodSchemas.insert,      // Request body schema
    }),
    outputSchema: postZodSchemas.select, // Response schema
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

## Action Meta Configuration

| Field | Type | Description |
|-------|------|-------------|
| name | string | Unique identifier, format: `module.entity.action` |
| displayName | string | Display name for logs and docs |
| description | string | Description |
| tags | string[] | Tags for OpenAPI grouping |
| method | string | HTTP method: GET, POST, PUT, DELETE |
| path | string | API path, supports params like `/api/system/post/:id` |

## Schemas Configuration

| Field | Description |
|-------|-------------|
| querySchema | URL query parameters schema |
| paramsSchema | Path parameters schema (e.g., `:id`) |
| bodySchema | Request body schema |
| outputSchema | Response schema |

## ActionContext

The second parameter of `execute` is `context`, containing:

```typescript
interface ActionContext {
  db: DrizzleInstance;        // Database instance
  token: string;              // JWT Token
  currentUserId: string;      // Current user ID
  currentUserName: string;    // Current username
  currentUserDeptId: string;  // Current user department ID
  currentUserType: string;    // Current user type
}
```

## Standard CRUD Actions

Each entity typically includes these Actions:

### Paginated Query

```typescript
// getByPagination.ts
export const postGetByPagination = defineAction({
  meta: {
    name: 'system.post.getByPagination',
    displayName: 'Query Posts',
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
    
    // Build query conditions
    const conditions = [];
    if (filter?.name) {
      conditions.push(like(post.name, `%${filter.name}%`));
    }
    if (filter?.status) {
      conditions.push(eq(post.status, filter.status));
    }
    // Soft delete filter
    conditions.push(isNull(post.deletedAt));
    
    // Query data
    const data = await db.select()
      .from(post)
      .where(and(...conditions))
      .orderBy(sort?.order === 'desc' ? desc(post[sort.field]) : asc(post[sort.field]))
      .limit(limit)
      .offset(offset);
    
    // Query total count
    const [{ count }] = await db.select({ count: sql`count(*)` })
      .from(post)
      .where(and(...conditions));
    
    return { data, total: Number(count) };
  },
});
```

### Get by ID

```typescript
// getByPk.ts
export const postGetByPk = defineAction({
  meta: {
    name: 'system.post.getByPk',
    displayName: 'Get Post Details',
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

### Update

```typescript
// update.ts
export const postUpdate = defineAction({
  meta: {
    name: 'system.post.update',
    displayName: 'Update Post',
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

### Delete (Soft Delete)

```typescript
// deleteByPk.ts
export const postDeleteByPk = defineAction({
  meta: {
    name: 'system.post.deleteByPk',
    displayName: 'Delete Post',
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

## Exporting Actions

Export all Actions in `index.ts`:

```typescript
// packages/actions/src/db/system/post/index.ts
export { postGetByPagination } from './getByPagination';
export { postGetByPk } from './getByPk';
export { postCreate } from './create';
export { postUpdate } from './update';
export { postDeleteByPk } from './deleteByPk';

// Import for registration
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

## Registering Actions

Aggregate in the module's `index.ts`:

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

Finally export in `packages/actions/src/index.ts`:

```typescript
import { systemActions } from './db/system';
import { aiActions } from './db/ai';

export const dbActions = [
  ...systemActions,
  ...aiActions,
];
```

## Error Handling

Use `ActionError` to throw business errors:

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

## Permission Checking

```typescript
import { checkWritePermission, BUSINESS_MODULE } from '../../../core/deptPermission';

execute: async (input, context) => {
  const { db } = context;
  
  // Check write permission
  await checkWritePermission(db, context, BUSINESS_MODULE.POST, input.data.deptId);
  
  // ... business logic
},
```

## Next Steps

- [Frontend Components](/docs/en/frontend/components) - Learn how to call APIs
- [Entity Development](/docs/en/backend/entities) - Learn how to define database entities
