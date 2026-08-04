-- 期限切れ（14日）のゲストファミリーを毎日自動削除する pg_cron ジョブ
-- families.guestExpiresAt が過去のゲストファミリーを削除する（members/clothes/subscriptions は
-- スキーマの onDelete: 'cascade' により連動削除される）
--
-- drizzle-kit push の管理対象外（拡張機能・cronジョブはDrizzleスキーマで表現できないため）。
-- 新しい環境（別のSupabaseプロジェクト、ローカルSupabase等）ではこのファイルを一度だけ実行すること。
--
-- 実行例:
--   node -e "require('postgres')(process.env.DATABASE_URL) ..." でファイル内容を実行するか、
--   Supabase Studio の SQL Editor に貼り付けて実行する。

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

SELECT cron.schedule(
  'delete-expired-guest-families',
  '0 3 * * *', -- 毎日 3:00 (DBサーバーのタイムゾーン、通常UTC)
  $$ DELETE FROM families WHERE is_guest = true AND guest_expires_at < now(); $$
);
