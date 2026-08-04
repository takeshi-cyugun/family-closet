# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"ファミリークロゼット" (Family Closet) — a family clothing-inventory app (Vision AI auto-tagging, family sharing, multi-language). Full spec: `要件定義書.md` (root, Japanese, V8). It describes a target architecture of `apps/web` + `apps/admin` + `packages/database|ui|i18n|config` under Turborepo — **only part of that exists today** (see "Spec vs. reality" below).

## Commands

Run from repo root unless noted (pnpm workspace, defined in `pnpm-workspace.yaml`: `apps/*`, `packages/*`).

- `pnpm dev` — runs `apps/web` dev server (port 3000) via `pnpm --filter web dev`
- `pnpm build` — builds `apps/web` via `pnpm --filter web build`
- `pnpm --filter web lint` — ESLint (flat config, `eslint-config-next`) for `apps/web`
- `pnpm --filter @repo/database db:push` — pushes `packages/database/src/schema.ts` (Drizzle) to whichever Postgres `DATABASE_URL` currently points at (local Supabase stack or the hosted project, depending on `apps/web/.env.local`).
- No test framework is configured anywhere in the repo (no test script, no test runner dependency) — don't assume Jest/Vitest exist.
- `npx supabase start` (from repo root, requires Docker) — boots a local Supabase stack (Postgres, Auth, Studio on :54323, and a fake mail-capture inbox on :54324) per `supabase/config.toml`. `apps/web/.env.local` points at this local stack by default; the hosted project's credentials are kept commented out in the same file for switching back.

## Spec vs. reality (read before trusting other docs)

`.claude/AGENTS.md` and `apps/web/CLAUDE.md`/`AGENTS.md` describe the target design from `要件定義書.md`, not always current state. Known gaps as of this writing:

- No `apps/admin`, no `packages/ui`, no `packages/config` — only `apps/web`, `packages/database`, `packages/i18n` exist.
- No Turborepo — no `turbo.json`, no `turbo` dependency anywhere, despite it being referenced in the other docs.
- `packages/database`'s workspace name is **`@repo/database`**, not `@family-closet/database`. Import it as `@repo/database`; the mapping is a TS path alias in `apps/web/tsconfig.json` (`../../packages/database/src/index.ts`), not a `package.json` dependency — don't add it as a dependency expecting node_modules linking, the path alias is what makes it resolve.
- `packages/i18n` has **no `package.json`**, so it isn't a real pnpm workspace member and nothing imports it. `apps/web` does its own i18n instead (see below). Treat `packages/i18n` as an unused scaffold, not a live dependency.
- `apps/web/middleware.ts` is named `middleware.ts` and exports `middleware`, not `proxy.ts`/`proxy` — the "Next.js 16 renamed Middleware to Proxy" warning in `apps/web/AGENTS.md` does not apply to the currently installed Next version's actual behavior in this file; verify against `apps/web/node_modules/next/dist/docs/` yourself before assuming either name is correct for a given change.
- `supabase/config.toml`'s `[auth.email.smtp]` block documents the production relay (さくらインターネット, initial domain `doocmo.sakura.ne.jp`, sender `noreply@family-closet.com`) but is deliberately kept `enabled = false` and is **not** pushed via `supabase config push` — it's reference/documentation only. The real values are entered directly in the Supabase Dashboard (Authentication → Emails → SMTP Settings) on the hosted project, so that local `supabase start` keeps using `[local_smtp]` (the fake inbox on :54324) instead of trying to send real mail. Don't assume production auth emails actually send until that Dashboard config is filled in with a real SMTP-AUTH mailbox address and password — `user` in `config.toml` is still an empty placeholder because `noreply@family-closet.com` itself has no mailbox; auth uses a different existing mailbox on the domain while the `From` header stays `noreply@family-closet.com`.

## Architecture

### Auth is real (Supabase Auth); clothes data is real; guest-only bits are still mock

As of the 2026-08-04 "認証系実装" commit, auth is no longer mocked. `apps/web/app/_lib/auth.ts` (the old `MOCK_ACCOUNTS` module) and the auth-related parts of `apps/web/app/_lib/session.ts` were deleted; `session.ts` now only holds the guest-trial helpers (`startGuestSession`/`getGuestDaysLeft`, still `localStorage`-based — that part is intentionally client-only, guests aren't real accounts).

- **Login/signup/password flows are real Server Actions backed by Supabase Auth.** `apps/web/app/actions/login.ts` (`loginFamily`) looks up the member's `authUserId` in Postgres, then calls `auth.signInWithPassword` against Supabase Auth; on success it sets real httpOnly cookies (`family_id`, `member_db_id`, and — only when `members.isFirstLogin` is true — `fc_force_password_change`, which `apps/web/middleware.ts` still checks to force-redirect to `/change-password`). `actions/registerFamily.ts` calls `auth.signUp` (email confirmation required) and rolls back the Auth user if the DB-side write fails; `actions/addMember.ts` uses the Supabase admin client (`auth.admin.createUser`) with a synthetic `@members.familycloset.internal` email and an auto-generated initial password (added members don't need a real inbox); `actions/changePassword.ts` re-verifies the current password via `signInWithPassword` before calling `auth.admin.updateUserById`. Brute-force lockout (5 failed attempts / 5 min) is enforced server-side via the new `loginAttempts` table, keyed by both account and IP.
- **Clothes CRUD is wired to real Postgres/Supabase via Drizzle.** `apps/web/app/actions/clothes.ts` and `apps/web/app/actions/startGuestSession.ts` import `db`/tables from `@repo/database` and perform real inserts/updates/deletes against `DATABASE_URL` (see `apps/web/.env.example` for the required env vars: Supabase URL/anon/service-role keys, `DATABASE_URL`, `GEMINI_API_KEY`). `packages/database/src/schema.ts` (Drizzle) is the source of truth for the data model: `families`, `members`, `clothes`, `subscriptions`, `loginAttempts`, with `familyId`-scoped multi-tenancy (RLS is a spec requirement — not yet enforced by any visible policy in this codebase, so don't assume it's active).
- `apps/web/app/_lib/clothes.ts` still has a large block of mock clothes/member data — check whether a given screen reads from that mock module or from the real `actions/clothes.ts` before changing data logic; the two coexist.
- Outbound auth email (signup confirmation, etc.) is still being wired up for production — see the `supabase/config.toml` SMTP note above.

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
