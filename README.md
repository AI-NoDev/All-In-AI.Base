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
    <a href="#development">Development</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Bun-1.3.6+-black?logo=bun" alt="Bun" />
    <img src="https://img.shields.io/badge/Svelte-5-orange?logo=svelte" alt="Svelte 5" />
    <img src="https://img.shields.io/badge/Elysia-1.4+-purple" alt="Elysia" />
    <img src="https://img.shields.io/badge/PostgreSQL-14+-blue?logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
  </p>
  <p align="center">
    <a href="README-zh.md">中文文档</a>
  </p>
</p>

---

## 💡 Overview

Qiyu AllInAI is a **production-ready AI application foundation** built with modern technologies. It provides complete infrastructure for building AI-powered enterprise applications.

### Design Philosophy

- **Bun-First** - Ultra-fast JavaScript runtime (4x faster than Node.js)
- **Type-Safe** - End-to-end TypeScript with TypeBox validation
- **Modular** - Turborepo monorepo with reusable packages
- **AI-Native** - Built-in AI Agent, tool orchestration, and model management

---

## ✨ Features

### 🔐 System Management
- User, Role, Department, Position management
- Menu-based permission control with Casbin RBAC
- Dictionary and system configuration
- Operation logs and login audit

### 🤖 AI Module
- Multi-provider model management (OpenAI, Anthropic, Azure, etc.)
- AI Agent creation and session management
- Tool definition and grouping
- MCP (Model Context Protocol) server integration

### 💬 Instant Messaging
- Private and group chat with WebSocket
- Multiple message types (text, image, file)
- Read status tracking

### 📁 Knowledge Base
- File and folder management with tree structure
- Version control and rollback
- Fine-grained permission control
- Online Markdown editing

### 🎨 UI/UX
- Dark/Light theme with mode-watcher
- Responsive design
- i18n (Chinese/English)
- shadcn-svelte components

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | [Bun](https://bun.sh) 1.3.6+ |
| **Monorepo** | [Turborepo](https://turbo.build) |
| **Frontend** | [SvelteKit](https://kit.svelte.dev) + Svelte 5 |
| **UI** | [shadcn-svelte](https://shadcn-svelte.com) + Tailwind CSS v4 |
| **Backend** | [Elysia](https://elysiajs.com) |
| **Database** | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team) |
| **Validation** | [TypeBox](https://github.com/sinclairzx81/typebox) (Elysia's `t`) |
| **Storage** | MinIO / S3 compatible |
| **i18n** | [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) |

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) >= 1.3.6
- [PostgreSQL](https://postgresql.org) >= 14
- [MinIO](https://min.io) (optional, for file storage)

### Installation

```bash
# Clone repository
git clone https://github.com/AI-NoDev/All-In-AI.Base.git
cd All-In-AI.Base

# Install dependencies
bun install

# Configure environment
cp packages/db/.env.example packages/db/.env
cp apps/server/.env.example apps/server/.env
cp apps/frontend/.env.example apps/frontend/.env

# Initialize database
bun run db:push    # Push schema to database
bun run db:reset   # Seed initial data

# Start development
bun run dev
```

### Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3030 |
| API Docs (Swagger) | http://localhost:3030/swagger |

### Default Account

- **Username**: `admin`
- **Password**: `admin123`

---

## 📁 Project Structure

```
qiyu-allinai/
├── apps/
│   ├── frontend/              # SvelteKit frontend
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── api/       # Generated API client
│   │   │   │   ├── components/# UI components
│   │   │   │   └── stores/    # Svelte stores
│   │   │   └── routes/        # Page routes
│   │   └── static/
│   │
│   └── server/                # Elysia backend
│       └── src/
│           ├── routers/       # Custom routers
│           └── server/
│               ├── app.ts     # Main app (action registration)
│               └── plugins/   # Elysia plugins
│
├── packages/
│   ├── db/                    # Database layer
│   │   ├── src/
│   │   │   ├── entities/      # Drizzle entities
│   │   │   │   ├── system/    # User, Role, Menu, etc.
│   │   │   │   ├── ai/        # Agent, Model, Provider
│   │   │   │   ├── im/        # Conversation, Message
│   │   │   │   └── knowledge/ # Node, Version, Permission
│   │   │   ├── seedData/      # Initial seed data
│   │   │   └── casbin/        # RBAC permission adapters
│   │   └── drizzle/           # Migrations
│   │
│   ├── actions/               # Business logic
│   │   └── src/
│   │       ├── core/          # defineAction, types
│   │       ├── db/            # CRUD actions
│   │       └── files/         # File operations
│   │
│   ├── i18n/                  # Internationalization
│   │   ├── messages/          # Translation JSON files
│   │   └── paraglide/         # Generated runtime
│   │
│   ├── storage/               # S3/MinIO client
│   ├── cache/                 # Redis cache
│   └── api/                   # Generated API types
│
├── turbo.json                 # Turborepo config
└── package.json               # Root package.json
```

---

## 🔧 Development

### Common Commands

```bash
# Development
bun run dev                    # Start all services
bun run dev:frontend           # Frontend only
bun run dev:server             # Backend only

# Database
bun run db:generate            # Generate migration
bun run db:push                # Push schema (no migration)
bun run db:migrate             # Run migrations
bun run db:seed                # Seed data
bun run db:reset               # Reset seed data

# Build
bun run build                  # Build all
bun run build:frontend         # Build frontend
bun run build:server           # Build server binary
```

### Adding New Entity

1. Create entity in `packages/db/src/entities/{module}/`
2. Export from `packages/db/src/entities/{module}/index.ts`
3. Create actions in `packages/actions/src/db/{module}/`
4. Export from `packages/actions/src/db/index.ts`
5. Run `bun run db:push` to update schema

### Adding New Page

1. Create route in `apps/frontend/src/routes/dashboard/{path}/`
2. Export `_meta` for navigation:

```typescript
// +page.ts
export const _meta = {
  title: 'Page Title',
  icon: 'mdi:icon-name',
  group: 'Group Name',
  order: 10,
  permission: 'module:entity:view'
};
```

---

## 📖 Documentation

For detailed development documentation, visit `/docs` in the running application or see:

- [Getting Started](/docs/zh-CN/guide/getting-started/)
- [Project Structure](/docs/zh-CN/guide/project-structure/)
- [Action Development](/docs/zh-CN/backend/actions/)
- [Component Development](/docs/zh-CN/frontend/components/)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

### Code Standards

- TypeScript with strict mode, avoid `any`
- Svelte 5 runes (`$state`, `$derived`, `$effect`)
- TypeBox for all data validation
- Keep i18n translations in sync

---

## � License

[MIT License](LICENSE)

---

<p align="center">
  Made with ❤️ by Qiyu Zhou
</p>
