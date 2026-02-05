<p align="center">
  <img src="apps/frontend/src/lib/assets/logo.png" alt="Qiyu AllInAI Logo" width="120" />
  <h1 align="center">Qiyu AllInAI</h1>
  <p align="center">
    <strong>Enterprise-grade AI Application Foundation Platform</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#modules">Modules</a> •
    <a href="#development">Development</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/status-active%20development-yellow" alt="Status" />
    <img src="https://img.shields.io/badge/AI%20features-expanding-blue" alt="AI Features" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  </p>
  <p align="center">
    <a href="README-zh.md">中文文档</a>
  </p>
</p>

> ⚠️ **Work in Progress**: Advanced AI features are being rapidly expanded. Stay tuned for more powerful AI capabilities!

---

## 💡 Inspiration

This project draws inspiration from two excellent open-source projects:

- **[Vercel AI SDK](https://sdk.vercel.ai)** - Modern AI application development toolkit with elegant AI integration and tool calling patterns
- **[RuoYi](https://ruoyi.vip)** - Mature enterprise management system with comprehensive RBAC permission model and system management features

We combine Vercel AI's modern AI capabilities with RuoYi's enterprise-grade management features, implemented with a high-performance modern tech stack:

- ⚡ **[Bun](https://bun.sh)** - Ultra-fast JavaScript runtime, 4x faster than Node.js
- 🦊 **[Elysia](https://elysiajs.com)** - High-performance TypeScript web framework optimized for Bun
- 🔥 **[SvelteKit](https://kit.svelte.dev)** - Compile-time optimized modern frontend framework with zero runtime overhead

Building a **production-ready, high-performance AI application foundation**.

---

## 📖 Overview

Qiyu AllInAI is a **ready-to-use AI application foundation system** that provides complete infrastructure for building AI applications. Whether you're building intelligent customer service, knowledge base Q&A, AI assistants, or other AI-driven applications, you can quickly develop on top of this system.

### 🎯 Design Goals

- **Ready to Use** - Complete user management, permission control, AI model management out of the box
- **Highly Extensible** - Modular architecture supporting flexible feature extension and customization
- **Modern Tech Stack** - Built with Bun + SvelteKit + Elysia for exceptional performance
- **AI Native** - Built-in AI Agent, tool orchestration and other core AI capabilities
- **Enterprise Grade** - Complete RBAC permissions, audit logs, multi-tenant support

---

## ✨ Features

### 🔐 System Management
- **User Management** - User CRUD, status management, password reset
- **Role Management** - Flexible role definition and permission assignment
- **Menu Management** - Dynamic menu configuration with permission control
- **Department Management** - Tree-structured organization management
- **Position Management** - Position definition and user association
- **Dictionary Management** - System and business dictionary configuration
- **System Configuration** - Global parameter configuration
- **Operation Logs** - Complete operation audit trail
- **Login Logs** - User login records and security monitoring
- **Scheduled Tasks** - Cron job scheduling and execution logs

### 🤖 AI Module
- **Model Management** - Multi-provider (OpenAI, Anthropic, Azure, etc.) model configuration
- **Agent Management** - AI Agent creation, configuration, and session management
- **Tool Management** - AI tool definition and grouping
- **Workflow Editor** - Visual AI workflow orchestration (Actions Flow Editor)

### 💬 Instant Messaging (IM)
- **Private/Group Chat** - Support for one-on-one and group conversations
- **Message Types** - Text, images, files, links and more
- **WebSocket** - Real-time message push
- **Read Status** - Message read tracking
- **Group Management** - Group members, owner, admin roles

### 📁 Knowledge Base
- **File Management** - Folder and file CRUD operations
- **Version Control** - File version history and rollback
- **Permission Control** - Fine-grained resource access permissions
- **Online Editing** - Markdown document online editing
- **File Search** - Full-text search support

### 🎨 UI/UX
- **Dark/Light Theme** - Complete theme switching support
- **Responsive Design** - Desktop and mobile compatible
- **Internationalization** - Chinese and English bilingual support
- **shadcn-svelte** - Beautiful UI component library

---

## 🛠 Tech Stack

| Layer | Technology | Description |
|-------|------------|-------------|
| **Runtime** | [Bun](https://bun.sh) | High-performance JavaScript runtime and package manager |
| **Monorepo** | [Turborepo](https://turbo.build) | Efficient monorepo build system |
| **Frontend** | [SvelteKit](https://kit.svelte.dev) | Svelte 5 full-stack framework |
| **UI Components** | [shadcn-svelte](https://shadcn-svelte.com) | Beautiful Svelte UI component library |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) | Utility-first CSS framework |
| **Backend** | [Elysia](https://elysiajs.com) | High-performance TypeScript web framework |
| **Database** | [PostgreSQL](https://postgresql.org) | Relational database |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team) | Type-safe TypeScript ORM |
| **Validation** | [Zod](https://zod.dev) | TypeScript-first schema validation |
| **Object Storage** | [MinIO](https://min.io) / S3 | File storage service |
| **API Docs** | OpenAPI / Swagger | Auto-generated API documentation |

---

## 🚀 Quick Start

### Requirements

- [Bun](https://bun.sh) >= 1.3.6
- [PostgreSQL](https://postgresql.org) >= 14
- [MinIO](https://min.io) or S3-compatible storage (optional)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/qiyu-allinai.git
cd qiyu-allinai

# 2. Install dependencies
bun install

# 3. Configure environment variables
cp packages/db/.env.example packages/db/.env
cp apps/server/.env.example apps/server/.env
cp apps/frontend/.env.example apps/frontend/.env

# 4. Initialize database
bun run --filter=@qiyu-allinai/db migrate
bun run --filter=@qiyu-allinai/db seed

# 5. Start development server
bun run dev
```

### Access URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/swagger

### Default Account

- Username: `admin`
- Password: `admin123`

---

## 📁 Project Structure

```
qiyu-allinai/
├── apps/
│   ├── frontend/              # SvelteKit frontend application
│   │   ├── src/
│   │   │   ├── lib/           # Shared libraries
│   │   │   │   ├── api/       # Generated API client
│   │   │   │   ├── components/# UI components
│   │   │   │   ├── stores/    # Svelte state management
│   │   │   │   └── hooks/     # Custom hooks
│   │   │   └── routes/        # Page routes
│   │   └── static/            # Static assets
│   │
│   ├── server/                # Elysia backend service
│   │   └── src/
│   │       ├── config/        # Configuration
│   │       ├── routers/       # Custom routers
│   │       └── server/        # Server core
│   │           └── plugins/   # Elysia plugins
│   │
│   └── docs/                  # VuePress documentation site
│
├── packages/
│   ├── db/                    # Database entities and connections
│   │   ├── src/entities/      # Drizzle entity definitions
│   │   │   ├── system/        # System management entities
│   │   │   ├── ai/            # AI module entities
│   │   │   ├── im/            # Instant messaging entities
│   │   │   └── knowledge/     # Knowledge base entities
│   │   └── drizzle/           # Database migrations
│   │
│   ├── actions/               # Business logic actions
│   │   └── src/
│   │       ├── core/          # Action core definitions
│   │       ├── db/            # Database CRUD actions
│   │       ├── files/         # File operation actions
│   │       └── filter/        # Query filters
│   │
│   ├── i18n/                  # Internationalization
│   │   └── src/locales/       # Language packs (zh-CN, en)
│   │
│   ├── actions-flow-editor/   # AI workflow visual editor
│   ├── zod-visual-editor/     # Zod schema visual editor
│   ├── file-icons/            # File icon components
│   └── vite-plugin-*/         # Vite plugins
│
├── turbo.json                 # Turborepo configuration
└── package.json               # Root package.json
```

---

## 📦 Modules

### @qiyu-allinai/db

Database layer using Drizzle ORM for entity and relationship definitions.

```typescript
// Import entities
import { user, userZodSchemas } from '@qiyu-allinai/db/entities/system';

// Use Zod schema for validation
const userData = userZodSchemas.insert.parse(input);
```

### @qiyu-allinai/actions

Business logic layer using `defineAction` to create standardized API operations.

```typescript
import { defineAction } from '@qiyu-allinai/actions/core';

export const myAction = defineAction({
  meta: {
    name: 'module.entity.action',
    method: 'POST',
    path: '/api/module/entity/action'
  },
  schemas: {
    bodySchema: z.object({ ... }),
    outputSchema: z.object({ ... }),
  },
  execute: async (input, context) => {
    // Business logic
  },
});
```

### @qiyu-allinai/i18n

Internationalization support with Chinese and English translations.

```typescript
import { t } from '@qiyu-allinai/i18n';

const message = t('error.system.admin.cannot.modify');
```

### @qiyu-allinai/actions-flow-editor

AI workflow visual editor built on @xyflow/svelte.

```svelte
<script>
  import { ActionsFlowEditor } from '@qiyu-allinai/actions-flow-editor';
</script>

<ActionsFlowEditor
  actions={availableActions}
  colorMode="dark"
  onSave={(flow) => console.log(flow)}
/>
```

---

## 🔧 Development Commands

```bash
# Start all services (frontend + backend)
bun run dev

# Start frontend only
bun run --filter=frontend dev

# Start backend only
bun run --filter=@qiyu-aiinall/server dev

# Build all projects
bun run build

# Type checking
bun run check-types

# Database migrations
bun run --filter=@qiyu-allinai/db generate  # Generate migration
bun run --filter=@qiyu-allinai/db migrate   # Run migration
bun run --filter=@qiyu-allinai/db seed      # Seed data

# Generate API client
bun run --filter=frontend generate:api

# Build actions-flow-editor package
bun run --filter=@qiyu-allinai/actions-flow-editor build
```

---

## 🔌 Extending the Platform

### Adding New Entities

1. Create entity file in `packages/db/src/entities/`
2. Create corresponding actions in `packages/actions/src/db/`
3. Add translations in `packages/i18n/src/locales/`
4. Run `bun run --filter=@qiyu-allinai/db generate` to generate migration

### Adding New Pages

1. Create route in `apps/frontend/src/routes/dashboard/`
2. Export `_meta` object to configure page metadata
3. Page will be automatically registered in navigation menu

```typescript
// +page.ts
export const _meta = {
  title: 'Page Title',
  icon: 'tdesign:icon-name',
  group: 'Group Name',
  order: 10,
  permission: 'module:entity:view'
};
```

### Adding New AI Tools

1. Create tool group in AI Tool Management page
2. Add tool definition (name, description, input/output schema)
3. Use Actions Flow Editor to orchestrate tool execution flow

### Integrating New AI Providers

1. Add provider configuration in AI Model Management page
2. Configure API Key and endpoint
3. Add models supported by the provider

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit Issues and Pull Requests.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Submit Pull Request

### Code Standards

- Use TypeScript, avoid `any` type
- Follow Svelte 5 patterns with `$state`, `$derived`, `$effect`
- Use Zod for data validation
- Keep Chinese and English translations in sync

---

## 📄 License

[MIT License](LICENSE)

---

## 🙏 Acknowledgments

This project is built on these excellent open-source projects:

- [Bun](https://bun.sh) - High-performance JavaScript runtime
- [SvelteKit](https://kit.svelte.dev) - Modern web framework
- [Elysia](https://elysiajs.com) - High-performance TypeScript backend framework
- [shadcn-svelte](https://shadcn-svelte.com) - Beautiful UI component library
- [Drizzle ORM](https://orm.drizzle.team) - Type-safe ORM
- [@xyflow/svelte](https://svelteflow.dev) - Flow chart editor

---

<p align="center">
  Made with ❤️ by Qiyu Zhou
</p>
