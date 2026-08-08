import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Google OAuthのリダイレクトハンドシェイク（PKCE code_verifierの保持）専用。
// このアプリの実セッションはfamily_id/member_db_idのhttpOnly Cookieで管理しており、
// このクライアントのセッション自体は認証直後にsignOutして残さない（authGoogleCallback参照）。
let browserClient: SupabaseClient | undefined;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return browserClient;
}
