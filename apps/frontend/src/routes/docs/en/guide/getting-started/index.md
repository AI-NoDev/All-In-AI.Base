# Getting Started

This guide helps you quickly set up the development environment and run the project.

## Requirements

| Tool | Version | Description |
|------|---------|-------------|
| Bun | >= 1.3.6 | Runtime and package manager |
| PostgreSQL | >= 15 | Database |
| Node.js | >= 20 | Optional, required by some tools |

## Install Bun

```bash
# macOS / Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

## Clone the Project

```bash
git clone <repository-url>
cd ai-drive-system
```

## Install Dependencies

```bash
bun install
```

## Configure Environment Variables

Copy the environment variable templates:

```bash
# Backend configuration
cp apps/server/.env.example apps/server/.env

# Frontend configuration
cp apps/frontend/.env.example apps/frontend/.env
```

Edit `apps/server/.env` to configure the database connection:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/allinai
JWT_SECRET=your-secret-key
```

## Initialize Database

```bash
# Enter the database package directory
cd packages/db

# Push schema to database (development)
bun run db:push

# Initialize seed data
bun run db:seed

# Return to project root
cd ../..
```

## Start Development Server

```bash
# Start both frontend and backend
bun run dev
```

After starting, visit:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Docs: http://localhost:3000/swagger

## Default Account

| Username | Password | Description |
|----------|----------|-------------|
| admin | admin123 | System Administrator |

## Common Commands

```bash
# Development mode (all services)
bun run dev

# Start frontend only
bun run --filter=frontend dev

# Start backend only
bun run --filter=server dev

# Build all projects
bun run build

# Type checking
bun run check-types

# Code formatting
bun run format
```

## Database Commands

```bash
cd packages/db

# Generate migration files
bun run db:generate

# Push schema (development, will lose data)
bun run db:push

# Run migrations (production)
bun run db:migrate

# Initialize seed data
bun run db:seed

# Open Drizzle Studio
bun run db:studio
```

## Next Steps

- [Project Structure](/docs/en/guide/project-structure) - Understand the project directory structure
- [Entity Development](/docs/en/backend/entities) - Learn how to define database entities
- [Action Development](/docs/en/backend/actions) - Learn how to create API endpoints
