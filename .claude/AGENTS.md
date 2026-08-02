# Agent Operational Guidelines for Family Closet

## Agent Behavior & Workflow Rules

### 1. Pre-Task Inspection
Before creating or modifying code:
1. Always inspect existing schemas in `packages/database/src/schema.ts` when touching data logic.
2. Check existing components in `packages/ui` before creating new UI elements to avoid duplicates.
3. Review `requirements` or existing App Router pages to preserve directory conventions.

### 2. Code Generation Standards
- **TypeScript**:
  - Strict typing required. Avoid using `any`.
  - Use Zod for API input/output validation and form inputs.
- **Next.js App Router**:
  - Default to Server Components where applicable.
  - Mark client-side interactive code explicitly with `'use client'`.
  - Place server logic inside `actions/` (Server Actions) or `api/` (Route Handlers).
- **Tailwind & UI**:
  - Use Mobile-First design.
  - Rely on `shadcn/ui` components from `@family-closet/ui`.
  - Avoid hardcoded style colors; use Tailwind design tokens.

### 3. Database & State Mutations
- Never alter multi-tenant RLS logic without explicit confirmation.
- Ensure all queries operate under the current user's `family_id`.
- When modifying schemas in `packages/database`, remind the user to run `pnpm --filter @family-closet/database db:push`.

### 4. Self-Verification & Quality Checks
After implementing features:
1. Run `pnpm lint` to verify static checks pass.
2. Verify workspace package imports do not break monorepo dependencies.