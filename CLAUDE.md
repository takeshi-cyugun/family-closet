# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"ファミリークロゼット" (Family Closet) — a family clothing-inventory app (Vision AI auto-tagging, family sharing, multi-language). Full spec: `要件定義書.md` (root, Japanese, V8). It describes a target architecture of `apps/web` + `apps/admin` + `packages/database|ui|i18n|config` under Turborepo — **only part of that exists today** (see "Spec vs. reality" below).

## Commands

Run from repo root unless noted (pnpm workspace, defined in `pnpm-workspace.yaml`: `apps/*`, `packages/*`).

- `pnpm dev` — runs `apps/web` dev server (port 3000) via `pnpm --filter web dev`
- `pnpm build` — builds `apps/web` via `pnpm --filter web build`
- `pnpm --filter web lint` — ESLint (flat config, `eslint-config-next`) for `apps/web`
- `pnpm --filter @repo/database db:push` — pushes `packages/database/src/schema.ts` (Drizzle) to whichever Postgres `DATABASE_URL` currently points at (local Supabase stack or the hosted project, depending on `apps/web/.env.local` / `apps/admin/.env.local`).
- No test framework is configured anywhere in the repo (no test script, no test runner dependency) — don't assume Jest/Vitest exist.
- `npx supabase start` (from repo root, requires Docker) — boots a local Supabase stack (Postgres, Auth, Studio on :54323, and a fake mail-capture inbox on :54324) per `supabase/config.toml`. `apps/web/.env.local` and `apps/admin/.env.local` both point at this local stack by default; the hosted project's credentials are kept commented out in `apps/web/.env.local` for switching back.
- `pnpm --filter admin dev` — runs `apps/admin` dev server (port 3001). `pnpm dev` (root) still only runs `apps/web`; there's no combined `dev:all` script, run both filters in separate terminals if you need both apps.
- `pnpm --filter admin build` / `pnpm --filter admin lint` — same pattern as `web`.

## Spec vs. reality (read before trusting other docs)

`.claude/AGENTS.md` and `apps/web/CLAUDE.md`/`AGENTS.md` describe the target design from `要件定義書.md`, not always current state. Known gaps as of this writing:

- No `packages/ui`, no `packages/config` — only `apps/web`, `apps/admin`, `packages/database`, `packages/i18n` exist. `apps/admin` is a minimal MVP (see "apps/admin" below), not the full spec (no 2FA, no IP allowlist, no audit log yet).
- No Turborepo — no `turbo.json`, no `turbo` dependency anywhere, despite it being referenced in the other docs.
- `packages/database`'s workspace name is **`@repo/database`**, not `@family-closet/database`. Import it as `@repo/database`; the mapping is a TS path alias in `apps/web/tsconfig.json` (`../../packages/database/src/index.ts`), not a `package.json` dependency — don't add it as a dependency expecting node_modules linking, the path alias is what makes it resolve.
- `packages/i18n` has **no `package.json`**, so it isn't a real pnpm workspace member and nothing imports it. `apps/web` does its own i18n instead (see below). Treat `packages/i18n` as an unused scaffold, not a live dependency.
- `apps/web/proxy.ts` (renamed from `middleware.ts` on 2026-08-07, exporting `proxy` instead of `middleware`) — confirmed against `apps/web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` and `next/dist/build/index.js` that the installed Next 16.2.12 actually emits the deprecation warning and resolves `proxy.ts`/`export function proxy` per the official `middleware-to-proxy` codemod; the file convention and export name both changed for real in this version, this note previously said otherwise and was wrong.
- `supabase/config.toml`'s `[auth.email.smtp]` block documents the production relay (Resend, `smtp.resend.com`, sender `noreply@family-closet.com` on the Resend-verified `family-closet.com` domain) but is deliberately kept `enabled = false` and is **not** pushed via `supabase config push` — it's reference/documentation only. The real values are entered directly in the Supabase Dashboard (Authentication → Emails → SMTP Settings) on the hosted project, so that local `supabase start` keeps using `[local_smtp]` (the fake inbox on :54324) instead of trying to send real mail. さくらインターネットのSMTP中継を最初に試したが、Supabase(海外の送信元)からの接続がタイムアウトし `auth.signUp()` が `AuthRetryableFetchError`(HTTP 504)で失敗したため、Resendに切り替えた — don't reintroduce さくらSMTP for production auth email without first confirming connectivity from Supabase's sending infrastructure.

## Architecture

### Auth is real (Supabase Auth); clothes data is real; guest-only bits are still mock

As of the 2026-08-04 "認証系実装" commit, auth is no longer mocked. `apps/web/app/_lib/auth.ts` (the old `MOCK_ACCOUNTS` module) and the auth-related parts of `apps/web/app/_lib/session.ts` were deleted; `session.ts` now only holds the guest-trial helpers (`startGuestSession`/`getGuestDaysLeft`, still `localStorage`-based — that part is intentionally client-only, guests aren't real accounts).

- **Login/signup/password flows are real Server Actions backed by Supabase Auth.** `apps/web/app/actions/login.ts` (`loginFamily`) looks up the member's `authUserId` in Postgres, then calls `auth.signInWithPassword` against Supabase Auth; on success it sets real httpOnly cookies (`family_id`, `member_db_id`, and — only when `members.isFirstLogin` is true — `fc_force_password_change`, which `apps/web/proxy.ts` still checks to force-redirect to `/change-password`). `actions/registerFamily.ts` calls `auth.signUp` (email confirmation required) and rolls back the Auth user if the DB-side write fails; `actions/addMember.ts` uses the Supabase admin client (`auth.admin.createUser`) with a synthetic `@members.familycloset.internal` email and an auto-generated initial password (added members don't need a real inbox); `actions/changePassword.ts` re-verifies the current password via `signInWithPassword` before calling `auth.admin.updateUserById`. Brute-force lockout (5 failed attempts / 5 min) is enforced server-side via the new `loginAttempts` table, keyed by both account and IP.
- **Clothes CRUD is wired to real Postgres/Supabase via Drizzle.** `apps/web/app/actions/clothes.ts` and `apps/web/app/actions/startGuestSession.ts` import `db`/tables from `@repo/database` and perform real inserts/updates/deletes against `DATABASE_URL` (see `apps/web/.env.example` for the required env vars: Supabase URL/anon/service-role keys, `DATABASE_URL`, `GEMINI_API_KEY`). `packages/database/src/schema.ts` (Drizzle) is the source of truth for the data model: `families`, `members`, `clothes`, `subscriptions`, `loginAttempts`, with `familyId`-scoped multi-tenancy (RLS is a spec requirement — not yet enforced by any visible policy in this codebase, so don't assume it's active).
- `apps/web/app/_lib/clothes.ts` still has a large block of mock clothes/member data — check whether a given screen reads from that mock module or from the real `actions/clothes.ts` before changing data logic; the two coexist.
- Outbound auth email (signup confirmation, etc.) works end-to-end in production (`/register` confirmed working on Vercel), currently via Supabase's default mailer while Custom SMTP is being switched over to Resend — see the `supabase/config.toml` SMTP note above.

### apps/admin (運営者向け管理画面, MVP)

Added 2026-08-05. Separate Next.js App Router app (port 3001, its own `package.json`/`tsconfig.json`/Tailwind setup, not part of any Turborepo since none exists), matching the 要件定義書.md §1.4/2.2 intent of keeping the Service Role Key confined to `apps/admin` only — `apps/web` never imports `createSupabaseServerClient` for admin-privileged bulk reads.

- **Auth is deliberately NOT Supabase Auth.** There is exactly one admin account, defined by `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars (not a DB row, not an `auth.users` entry). `app/actions/auth.ts`'s `loginAdmin` compares against those env vars and sets an httpOnly `admin_session` cookie whose value is `HMAC-SHA256("admin-session", ADMIN_SESSION_SECRET)` (see `app/_lib/session.ts`); `isAdminAuthenticated()` recomputes and constant-time-compares it. There is no session table and no per-admin identity — this only works because there's a single operator account. If a second admin is ever needed, this needs to become real per-user auth first.
- **No middleware.ts.** Auth is instead enforced by `app/(protected)/layout.tsx`, a Server Component that calls `isAdminAuthenticated()` and `redirect('/login')`s if it fails. Every page under the `(protected)` route group inherits this guard; `/login` sits outside the group and is the only public route.
- **§9 non-functional requirements (2FA/TOTP, IP allowlist "Zero Trust", tamper-proof audit log) are explicitly NOT implemented yet.** This was a scoped-down MVP per user request ("とりあえずファミリー管理一覧画面"); don't assume they exist when touching this app.
- `app/actions/families.ts`'s `getFamilies()` is the first (and currently only) admin data view: joins `families`/`members`/`subscriptions` via Drizzle, then does a single `adminClient.auth.admin.listUsers({ perPage: 1000 })` call (not per-row) to resolve each family owner's email from `members.authUserId`. Rendered by `app/(protected)/page.tsx` → `_components/FamiliesTable.tsx`, a plain read-only PC-only table (user explicitly said mobile/responsive isn't needed for this app).
- Deploy plan (not yet done): a second Vercel project pointing at `apps/admin` as its root directory, initially on its default `*.vercel.app` domain, then cut over to a custom subdomain of `family-closet.com` (e.g. `admin.family-closet.com`) the same way `apps/web` did — `admin.<something>.vercel.app` is not obtainable since `vercel.app` isn't a domain the project owns.

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
