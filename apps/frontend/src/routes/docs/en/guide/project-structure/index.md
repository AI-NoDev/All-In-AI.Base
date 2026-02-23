# Project Structure

This project uses a Turborepo monorepo architecture, containing frontend, backend, and multiple shared packages.

## Directory Overview

```
ai-drive-system/
├── apps/
│   ├── frontend/          # SvelteKit frontend application
│   └── server/            # Elysia backend service
├── packages/
│   ├── db/                # Database entities and connection
│   ├── actions/           # Business logic Actions
│   ├── i18n/              # Internationalization
│   └── vite-plugin-*/     # Vite plugins
├── turbo.json             # Turborepo configuration
├── package.json           # Root package.json
└── bun.lock               # Bun lock file
```

## apps/frontend - Frontend Application

Admin dashboard built with SvelteKit + shadcn-svelte.

```
apps/frontend/
├── src/
│   ├── lib/
│   │   ├── api/           # Generated API client (openapi-ts)
│   │   ├── components/    # Common components
│   │   │   └── ui/        # shadcn-svelte components
│   │   ├── stores/        # Svelte state management
│   │   │   ├── auth.svelte.ts   # Authentication state
│   │   │   └── tabs.svelte.ts   # Tab state
│   │   ├── hooks/         # Custom hooks
│   │   └── utils.ts       # Utility functions
│   ├── routes/
│   │   ├── login/         # Login page
│   │   ├── dashboard/     # Dashboard pages
│   │   │   ├── system/    # System management
│   │   │   ├── ai/        # AI management
│   │   │   └── knowledge/ # Knowledge base
│   │   └── docs/          # Development docs
│   └── app.html           # HTML template
├── static/                # Static assets
├── svelte.config.js       # SvelteKit config
├── vite.config.ts         # Vite config
└── package.json
```

### Page Metadata

Each page exports a `_meta` object via `+page.ts` for navigation and permission control:

```typescript
// +page.ts
export const _meta = {
  title: 'nav.title.users',      // Page title (i18n key)
  icon: 'tdesign:user',          // Icon
  group: 'nav.group.system',     // Group
  order: 10,                     // Sort order
  permission: 'system:user:view' // Permission identifier
};
```

During build, `src/lib/generated-pages.ts` is automatically generated with all page metadata.

## apps/server - Backend Service

HTTP service using the Elysia framework.

```
apps/server/
├── src/
│   ├── config/            # Configuration files
│   ├── server/
│   │   ├── app.ts         # Main app (Action registration)
│   │   ├── base.ts        # Elysia base instance
│   │   ├── plugins/       # Elysia plugins
│   │   │   ├── jwt.ts     # JWT authentication
│   │   │   ├── cors.ts    # CORS
│   │   │   ├── openapi.ts # OpenAPI docs
│   │   │   ├── actions.ts # Action route registration
│   │   │   └── ...
│   │   └── index.ts       # Service entry
│   └── routers/           # Custom routers (e.g., auth)
├── .env                   # Environment variables
└── package.json
```

### Action Registration Flow

```typescript
// apps/server/src/server/app.ts
import { dbActions, filesActions } from "@qiyu-allinai/actions";
import { actionsPlugin } from "./plugins";

const coreActions = [...dbActions, ...filesActions];

async function createApp() {
  return base
    .use(corsPlugin)
    .use(jwtPlugin)
    // ... other plugins
    .use(actionsPlugin(coreActions));  // Register all Actions
}
```

## packages/db - Database Layer

Defines database entities, relations, and TypeBox schemas (using drizzle-typebox).

```
packages/db/
├── src/
│   ├── connect/           # Database connection
│   │   └── index.ts       # Drizzle instance
│   ├── entities/          # Entity definitions
│   │   ├── base/          # Base schemas
│   │   │   ├── pkSchema.ts      # Primary key
│   │   │   ├── auditSchema.ts   # Audit fields
│   │   │   └── deletedSchema.ts # Soft delete
│   │   ├── system/        # System module
│   │   ├── ai/            # AI module
│   │   ├── im/            # Instant messaging
│   │   └── knowledge/     # Knowledge base
│   ├── seedData/          # Seed data
│   └── utils/             # Utilities
│       └── entity.ts      # Entity utilities
├── drizzle/               # Migration files
└── drizzle.config.ts      # Drizzle config
```

### Entity File Structure

Each entity file exports:

```typescript
// packages/db/src/entities/system/user.ts

// 1. Field definitions
export const userFields = mergeFields(pkSchema, auditSchema, deletedSchema, userOwnFields);

// 2. Metadata
export const userMeta: EntityMeta = { ... };

// 3. Table definition
export const user = pgTable(userMeta.name, getTableFields(userFields));

// 4. Field config (import/export)
export const userConfig = getFieldConfigs(userFields);

// 5. TypeBox Schemas (using drizzle-typebox)
export const userSchemas = createTypeboxSchemas(user, userFields);
```

## packages/actions - Business Logic Layer

Defines API endpoint business logic.

```
packages/actions/
├── src/
│   ├── core/              # Core definitions
│   │   ├── define.ts      # defineAction function
│   │   ├── types.ts       # Type definitions
│   │   ├── errors.ts      # Error classes
│   │   └── registry.ts    # Action registry
│   ├── db/                # Database Actions
│   │   ├── system/        # System module
│   │   │   ├── user/      # User Actions
│   │   │   ├── role/      # Role Actions
│   │   │   └── ...
│   │   ├── ai/            # AI module
│   │   ├── im/            # Instant messaging
│   │   └── knowledge/     # Knowledge base
│   └── index.ts           # Export all Actions
└── package.json
```

## packages/i18n - Internationalization

Paraglide-based internationalization support.

```
packages/i18n/
├── src/
│   ├── messages/          # Translation messages
│   │   ├── zh-CN.json     # Chinese
│   │   └── en.json        # English
│   └── index.ts           # Export translation functions
└── package.json
```

## Workspace Dependencies

Use `workspace:*` in `package.json` to reference internal packages:

```json
{
  "dependencies": {
    "@qiyu-allinai/db": "workspace:*",
    "@qiyu-allinai/actions": "workspace:*",
    "@qiyu-allinai/i18n": "workspace:*"
  }
}
```

## Turborepo Tasks

`turbo.json` defines task dependencies:

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".svelte-kit/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "check-types": {
      "dependsOn": ["^build"]
    }
  }
}
```

## Next Steps

- [Entity Development](/docs/en/backend/entities) - Learn how to define database entities
- [Action Development](/docs/en/backend/actions) - Learn how to create API endpoints
- [Frontend Components](/docs/en/frontend/components) - Learn frontend development patterns
