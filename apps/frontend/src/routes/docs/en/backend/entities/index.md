# Entity Development

Entities are TypeScript definitions of database tables, using Drizzle ORM and Zod for type-safe database operations.

## File Location

Entity files are located in `packages/db/src/entities/{module}/`:

```
packages/db/src/entities/
├── base/              # Base schemas
│   ├── pkSchema.ts    # Primary key (UUID)
│   ├── auditSchema.ts # Audit fields
│   └── deletedSchema.ts # Soft delete
├── system/            # System module
│   ├── user.ts
│   ├── role.ts
│   └── exportSchemas.ts
├── ai/                # AI module
├── im/                # Instant messaging
└── knowledge/         # Knowledge base
```

## Creating a New Entity

### 1. Define Fields

```typescript
// packages/db/src/entities/system/post.ts
import { pgTable, uuid, varchar, integer } from 'drizzle-orm/pg-core';
import { 
  mergeFields, getTableFields, getFieldConfigs, 
  createZodSchemas, createPermissions,
  type FieldMap, type EntityMeta 
} from '../../utils/entity';
import { pkSchema } from '../base/pkSchema';
import { auditSchema } from '../base/auditSchema';
import { deletedSchema } from '../base/deletedSchema';

// Import translation functions from i18n package
import {
  db_system_post_meta_displayName,
  db_system_post_name,
  db_system_post_code,
  db_system_post_sort,
  db_system_post_status,
} from '@qiyu-allinai/i18n';

// Define entity-specific fields
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

// Merge with base fields
export const postFields = mergeFields(pkSchema, auditSchema, deletedSchema, postOwnFields);
```

### 2. Define Metadata

```typescript
export const postMeta: EntityMeta = {
  name: 'system_post',                    // Table name (format: module_entity)
  displayName: db_system_post_meta_displayName,  // Display name
  verboseName: db_system_post_meta_displayName,  // Singular name
  verboseNamePlural: db_system_post_meta_displayName, // Plural name
  permissions: createPermissions('system_post'), // Auto-generate permission names
};
```

### 3. Create Table and Schema

```typescript
// Create pgTable
export const post = pgTable(postMeta.name, getTableFields(postFields));

// Get field configs (for import/export)
export const postConfig = getFieldConfigs(postFields);

// Create Zod Schemas
export const postZodSchemas = createZodSchemas(post, postFields);
```

### 4. Export Schema

Export in the module's `exportSchemas.ts`:

```typescript
// packages/db/src/entities/system/exportSchemas.ts
export * from './user';
export * from './role';
export * from './post';  // Add new entity
```

## Base Schema Reference

### pkSchema - Primary Key

```typescript
export const pkSchema = {
  id: {
    field: uuid('id').primaryKey().defaultRandom(),
    comment: db_base_id,
    config: { canExport: true, canImport: false }
  },
} satisfies FieldMap;
```

### auditSchema - Audit Fields

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

### deletedSchema - Soft Delete

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

## Field Configuration

| Config | Type | Description |
|--------|------|-------------|
| canExport | boolean | Can be exported to Excel |
| canImport | boolean | Can be imported from Excel |
| exportExcelColumnName | TranslateFn | Export column name (translation function) |
| importExcelColumnName | TranslateFn | Import column name (translation function) |
| cellType | string | Cell type: STRING, NUMERIC, IMAGE, TEXT |

## Generated Zod Schemas

`createZodSchemas` automatically generates three schemas:

```typescript
export const postZodSchemas = {
  // Query return type
  select: z.object({
    id: z.string().uuid(),
    name: z.string(),
    code: z.string(),
    // ... all fields
  }),
  
  // Create type
  insert: z.object({
    id: z.string().uuid().optional(),
    name: z.string(),
    code: z.string(),
    // ... required fields
  }),
  
  // Update type
  update: z.object({
    name: z.string().optional(),
    code: z.string().optional(),
    // ... all fields optional
  }),
};
```

## Database Migrations

### Development Environment

```bash
cd packages/db

# Push schema directly to database (will lose data)
bun run db:push
```

### Production Environment

```bash
cd packages/db

# 1. Generate migration files
bun run db:generate

# 2. Review generated migration files
# drizzle/xxxx_migration.sql

# 3. Run migrations
bun run db:migrate
```

### View Database

```bash
# Open Drizzle Studio
bun run db:studio
```

## Adding Translations

Add field translations in `packages/i18n`:

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

## Next Steps

- [Action Development](/docs/en/backend/actions) - Create API endpoints for entities
- [Database Migrations](/docs/en/backend/migrations) - Detailed migration guide
