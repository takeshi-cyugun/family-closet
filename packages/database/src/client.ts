// packages/database/src/client.ts
import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Supabase サーバークライアント生成関数（Service Role: 管理者権限）
export const createSupabaseServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, supabaseServiceKey);
};

// Supabase Authクライアント生成関数（anonキー: パスワード検証など通常のAuth API呼び出し用）
export const createSupabaseAuthClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Drizzle ORM クライアント生成
// prepare: false — SupabaseのコネクションプーラーをTransactionモード(ポート6543)で使う場合、
// prepared statementに対応していないため必須。直結(5432)でも副作用はないため常時無効化しておく。
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });