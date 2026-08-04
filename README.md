これまでのやり取りと確定したV10仕様に基づき、モノレポ構成・技術スタック・環境構築・各種制限ロジックを網羅した `README.md` を作成しました。

リポジトリ直下（`family-closet/README.md`）に配置してご活用ください。

---

# 👕 ファミリークロゼット (Family Closet)

家族単位で洋服の所有状況・状態（使用中、保管中、譲渡/廃棄予定など）をリアルタイムに共有・管理するためのマルチテナント対応Web / モバイルアプリケーションです。

Vision AI（Google Gemini 1.5 Flash）による自動タグ付け、直感的なアイテム管理、多言語対応、および14日間の体験（フィッティング）から有料プラン（チェスト・ウォークイン）へのシームレスな移行機能を提供します。

---

## 🛠 技術スタック

- **Monorepo Architecture:** [Turborepo](https://turbo.build/) + `pnpm`
- **Frontend:** [Next.js](https://nextjs.org/) (App Router), React 19, Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/)
- **Database & ORM:** [Supabase](https://supabase.com/) (PostgreSQL), [Drizzle ORM](https://orm.drizzle.team/)
- **AI Engine:** Google Gemini 1.5 Flash API (画像解析・自動カテゴリ/カラータグ付け)
- **Authentication & Storage:** Supabase Auth, Supabase Storage
- **Internationalization (i18n):** パターンB（URLプレフィックス非依存 / Cookie & DBハイブリッド言語管理）
- **Payments:** Stripe / RevenueCat

---

## 📂 ディレクトリ構成

```text
family-closet/
├── apps/
│   ├── web/                      # ユーザー向け Web / WebView アプリ (Next.js App Router)
│   │   ├── app/                  # クリーンなルーティング (/dashboard, /register 等)
│   │   ├── actions/              # Server Actions (ゲストセッション発行・CRUD処理)
│   │   └── api/                  # Route Handlers (Gemini API 連携・Webhook)
│   │
│   └── admin/                    # 運営者向け 管理画面アプリ (Next.js App Router)
│       ├── app/                  # 運営ダッシュボード・監査ログ閲覧
│       └── actions/              # 特権操作 Server Actions (アカウント管理・手動プラン変更)
│
└── packages/
    ├── database/                 # Supabase クライアント / Drizzle ORM スキーマ定義
    ├── ui/                       # 共通 UI コンポーネント (shadcn/ui)
    ├── i18n/                     # 多言語辞書データ (ja, en, zh-CN) / 取得ユーティリティ
    └── config/                   # 共通設定 (ESLint, TypeScript, Tailwind)

```

---

## 💳 料金・プラン設計 & 制御ルール

本サービスは **下位プランへのダウングレード不可（不可逆なアップグレード構造）** を採用しています。

| プラン名                     | 区分       | 月額料金          | メンバー制限 | アイテム制限 | 期限・データ移行仕様                                                            |
| ---------------------------- | ---------- | ----------------- | ------------ | ------------ | ------------------------------------------------------------------------------- |
| **フィッティング (Fitting)** | お試し     | **無料**          | 1名          | 最大 10 着   | **14 日間限定**。有料移行時に全データ引継ぎ。14日経過でアクセス制限・自動削除。 |
| **チェスト (Chest)**         | エントリー | **有料 (低価格)** | 最大 5 名    | 最大 50 着   | フィッティングからの昇格可。**ウォークインからのダウングレード不可。**          |
| **ウォークイン (Walk-in)**   | プレミアム | **有料 (標準)**   | **無制限**   | **無制限**   | フィッティング / チェストからの昇格可。                                         |

### 🔒 プラン制御ルール

1. **ダウングレードの全面禁止:** ウォークイン ➔ チェスト、チェスト/ウォークイン ➔ フィッティング への変更はUIおよびServer Actions/APIレベルで厳格に遮断されます。
2. **フィッティング（ゲスト）の引き継ぎ:** 正式ユーザー登録（`/register`）時、一時的に保持された `guest_family_id` に紐づく洋服データを新アカウント（`family_id`）へ一括紐付け更新します。

---

## 🚀 開発環境のセットアップ

### 前提条件

- **Node.js** (v20以上推奨)
- **pnpm** (`corepack enable` または `npm i -g pnpm`)
- **Docker Desktop** (ローカルSupabase利用時)

---

### 1. 依存パッケージのインストール

```bash
pnpm install

```

### 2. ローカル Supabase の起動

Docker Desktop が起動していることを確認し、以下を実行します。

```bash
npx supabase start

```

> **💡 メールテストについて**
> 開発中の登録確認・パスワードリセット等のテストメールは、ローカル受信ツール **Inbucket (`[http://127.0.0.1:54324](http://127.0.0.1:54324)`)** にすべてキャッチされます。

### 3. 環境変数のセットアップ

`apps/web/.env.example` をコピーして `apps/web/.env.local` を作成し、Supabase起動時にターミナルに出力されたキー情報・DB URLを設定します。

```env
# Drizzle ORM DB 接続
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Supabase 接続
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-local-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-local-service-role-key"

# Gemini API
GEMINI_API_KEY="your-gemini-api-key"

```

### 4. データベースの構築 (Drizzle ORM)

スキーマ定義（`packages/database/src/schema.ts`）をローカルDBへ反映します。

```bash
pnpm --filter @family-closet/database db:push

```

### 5. 開発サーバーの起動

```bash
pnpm dev

```

- **ユーザーWebアプリ:** `http://localhost:3000`
- **運営管理画面 (App Admin):** `http://localhost:3001`

---

## 🛠 便利な開発コマンド

- **Drizzle Studio (DBのGUIデータ管理):**

```bash
pnpm --filter @family-closet/database db:studio

```

- **Supabase 停止:**

```bash
npx supabase stop

```

- **全 Node プロセスの一括停止 (ポート競合エラー時):**

```powershell
taskkill /IM node.exe /F

```
