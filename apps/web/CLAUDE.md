@AGENTS.md

# Family Closet (ファミリークロゼット) - Claude Code Development Guide

## 1. Project Overview & Architecture

- **Tech Stack**: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Drizzle ORM, Supabase, Turborepo, pnpm
- **Monorepo Structure**:
  - `apps/web`: User & Guest Web/WebView application (Port 3000)
  - `apps/admin`: Operational Admin application (Port 3001)
  - `packages/database`: Supabase client, Drizzle ORM schemas, migration scripts
  - `packages/ui`: Shared UI components (shadcn/ui)
  - `packages/i18n`: Dictionaries & multi-language detection utilities
  - `packages/config`: ESLint, TypeScript, Tailwind configurations

## 2. Essential Commands

### Development

- `pnpm dev`: Run all apps simultaneously (web on 3000, admin on 3001)
- `pnpm --filter web dev`: Run only the main user web app
- `pnpm --filter admin dev`: Run only the admin web app

### Database & Build

- `pnpm --filter @family-closet/database db:push`: Push Drizzle schema to Supabase
- `pnpm build`: Build all packages and apps via Turborepo
- `pnpm lint`: Run ESLint across all packages

## 3. Core Principles & Rules

### Multi-language (i18n) - Pattern B

- **NO URL Language Prefixes** (Do NOT use `/[lang]/dashboard`). Keep URLs clean (`/dashboard`, `/register`).
- Manage user language via Cookie / User DB (`members.preferred_language`).
- Import translation dictionaries from `@family-closet/i18n`.

### Backend & Security

- Place backend logics inside `app/actions/` (Server Actions) or `app/api/` (Route Handlers) within each app (`apps/web` or `apps/admin`).
- `apps/web` MUST respect Supabase Row Level Security (RLS) based on `family_id`.
- Service Role Key (Admin privileges) is strictly allowed ONLY inside `apps/admin`.

### Monorepo Imports

- Always use workspace packages for shared tools/components:
  - Import DB schemas from `@family-closet/database`
  - Import shared UI components from `@family-closet/ui`

### Pricing & Business Logic

- **Fitting Plan (Guest)**: Free, 14-day trial, max 10 items, 1 member.
- **Chest Plan**: Paid/Free Tier, max 5 members, max 50 items.
- **Walk-in Plan**: Paid Tier, unlimited members, unlimited items.

# Language / Response

- All responses and prompts to the user must be in Japanese.
- 日本語で応答してください。
