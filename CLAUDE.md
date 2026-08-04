# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"ファミリークロゼット" (Family Closet) — a family clothing-inventory app (Vision AI auto-tagging, family sharing, multi-language). Full spec: `要件定義書.md` (root, Japanese, V8). It describes a target architecture of `apps/web` + `apps/admin` + `packages/database|ui|i18n|config` under Turborepo — **only part of that exists today** (see "Spec vs. reality" below).

## Commands

Run from repo root unless noted (pnpm workspace, defined in `pnpm-workspace.yaml`: `apps/*`, `packages/*`).

- `pnpm dev` — runs `apps/web` dev server (port 3000) via `pnpm --filter web dev`
- `pnpm build` — builds `apps/web` via `pnpm --filter web build`
- `pnpm --filter web lint` — ESLint (flat config, `eslint-config-next`) for `apps/web`
- No test framework is configured anywhere in the repo (no test script, no test runner dependency) — don't assume Jest/Vitest exist.
- No `db:push`/`drizzle-kit` script exists yet despite the schema in `packages/database/src/schema.ts` being fully written — schema changes currently have no automated push path.

## Spec vs. reality (read before trusting other docs)

`.claude/AGENTS.md` and `apps/web/CLAUDE.md`/`AGENTS.md` describe the target design from `要件定義書.md`, not always current state. Known gaps as of this writing:

- No `apps/admin`, no `packages/ui`, no `packages/config` — only `apps/web`, `packages/database`, `packages/i18n` exist.
- No Turborepo — no `turbo.json`, no `turbo` dependency anywhere, despite it being referenced in the other docs.
- `packages/database`'s workspace name is **`@repo/database`**, not `@family-closet/database`. Import it as `@repo/database`; the mapping is a TS path alias in `apps/web/tsconfig.json` (`../../packages/database/src/index.ts`), not a `package.json` dependency — don't add it as a dependency expecting node_modules linking, the path alias is what makes it resolve.
- `packages/i18n` has **no `package.json`**, so it isn't a real pnpm workspace member and nothing imports it. `apps/web` does its own i18n instead (see below). Treat `packages/i18n` as an unused scaffold, not a live dependency.
- `apps/web/middleware.ts` is named `middleware.ts` and exports `middleware`, not `proxy.ts`/`proxy` — the "Next.js 16 renamed Middleware to Proxy" warning in `apps/web/AGENTS.md` does not apply to the currently installed Next version's actual behavior in this file; verify against `apps/web/node_modules/next/dist/docs/` yourself before assuming either name is correct for a given change.

## Architecture

### Auth/session is mock; clothes data is real

These two layers are at different stages of implementation — don't assume one implies the other:

- **Auth & session are entirely client-side mocks.** `apps/web/app/_lib/auth.ts` hardcodes login accounts (`MOCK_ACCOUNTS`); `apps/web/app/_lib/session.ts` stores guest sessions and a pending first-login record in `localStorage`, and sets a plain (non-httpOnly-from-client, but read httpOnly server-side) `fc_force_password_change` cookie that `apps/web/middleware.ts` checks to force-redirect to `/change-password`. There is no real auth backend yet.
- **Clothes CRUD is wired to real Postgres/Supabase via Drizzle.** `apps/web/app/actions/clothes.ts` and `apps/web/app/actions/startGuestSession.ts` import `db`/tables from `@repo/database` and perform real inserts/updates/deletes against `DATABASE_URL` (see `apps/web/.env.example` for the required env vars: Supabase URL/anon/service-role keys, `DATABASE_URL`, `GEMINI_API_KEY`). `packages/database/src/schema.ts` (Drizzle) is the source of truth for the data model: `families`, `members`, `clothes`, `subscriptions`, with `familyId`-scoped multi-tenancy (RLS is a spec requirement — not yet enforced by any visible policy in this codebase, so don't assume it's active).
- `apps/web/app/_lib/clothes.ts` still has a large block of mock clothes/member data — check whether a given screen reads from that mock module or from the real `actions/clothes.ts` before changing data logic; the two coexist.

### Vision AI

`apps/web/app/api/analyze-image/route.ts` is a Route Handler that sends an uploaded image to Gemini (`gemini-1.5-flash` via `@google/generative-ai`) and returns `{ category, color }` as JSON. Used by `PhotoPicker`/`ClothesForm` during clothes registration.

### i18n — no dictionary package, per-route translation files

Despite `packages/i18n` existing, `apps/web` doesn't use it. Instead:
- `apps/web/app/_lib/i18n.ts` defines the shared `LANGUAGES`/`LanguageCode` type (ja/en/zh-CN/zh-TW) and `apps/web/app/_lib/LanguageContext.tsx` is the client-side provider (persists choice to `localStorage`, key `familyCloset.lang`).
- Individual routes maintain **their own** translation-string files that import only the `LanguageCode` type from the shared module (e.g. `apps/web/app/dashboard/_lib/i18n.ts`, `apps/web/app/settings/_lib/i18n.ts`) — there is no single central dictionary. When adding translated UI to a new route, follow this per-route pattern rather than trying to route through `packages/i18n`.
- No URL language prefixes (`/dashboard`, not `/ja/dashboard`) — this part matches the spec.

### Routing structure

`apps/web/app/` is Next.js App Router. Clothes detail (`/clothes/[id]`) is implemented twice on purpose: as a normal page (`app/clothes/[id]/page.tsx`) and as a modal via a parallel/intercepting route (`app/@modal/(.)clothes/[id]/page.tsx` + `app/@modal/default.tsx` + `app/_components/Modal.tsx`) so it opens as an overlay when navigated to from the dashboard grid but as a full page on direct load/refresh. Keep both in sync when changing the detail view.

Server logic lives in `app/actions/` (Server Actions, `'use server'`) and `app/api/` (Route Handlers) inside `apps/web`, per the convention in `apps/web/AGENTS.md`.
