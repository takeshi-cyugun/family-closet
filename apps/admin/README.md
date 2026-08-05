# apps/admin

ファミリークロゼットの運営者向け管理画面(MVP)。ポート **3001** で動作する、`apps/web` とは別の Next.js App Router アプリ。

詳しい仕様・実装状況は[リポジトリルートの `CLAUDE.md`](../../CLAUDE.md)の「apps/admin」節を参照。

## ローカル起動手順

前提: リポジトリルートで `pnpm install` 済みであること。

### 1. Docker Desktop を起動する

ローカルの Supabase スタック(Postgres / Auth など)は Docker 上で動くため、先に Docker Desktop を起動しておく。

### 2. ローカル Supabase スタックを起動する

リポジトリルートで実行:

```bash
npx supabase start
```

- Postgres: `127.0.0.1:54322`
- Supabase Studio: http://127.0.0.1:54323
- メール確認用の擬似受信箱(Mailpit): http://127.0.0.1:54324

`apps/admin/.env.local` はデフォルトでこのローカルスタックを向いている(`DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres` など)。未作成の場合は `.env.example` をコピーして値を埋める。

### 3. スキーマを反映する(初回 / スキーマ変更時)

`packages/database/src/schema.ts` が正なので、テーブルが無ければ push する:

```bash
pnpm --filter @repo/database db:push
```

### 4. admin の dev サーバーを起動する

リポジトリルートで:

```bash
pnpm --filter admin dev
```

`apps/admin` ディレクトリ内で直接 `pnpm dev` でも可。http://localhost:3001 で起動する。

### 5. ログイン

`apps/admin` の認証は Supabase Auth ではなく、`.env.local` の `ADMIN_EMAIL` / `ADMIN_PASSWORD` と照合する単一アカウント方式(MVP)。ローカルの `.env.local` に設定されている値でログインする。

## つまずきやすい点

- `EADDRINUSE: address already in use :::3001` → 既に別プロセスで admin の dev サーバーが起動中。二重起動していないか確認する。
- DB クエリが失敗する(`Failed query: ... from "families" ...` など)→ たいてい Docker Desktop 未起動でローカル Supabase(Postgres)に接続できていないことが原因。`npx supabase start` が成功しているか確認する。
- 本番(ホスト済み)の Supabase プロジェクトに向けたい場合は `.env.local` の値をホスト側の接続情報に差し替える(`.env.example` にひな形あり)。
