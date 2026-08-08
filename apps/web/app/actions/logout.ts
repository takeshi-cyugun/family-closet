'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// 代表者ログアウト: セッションCookie（family_id/member_db_id/強制パスワード変更フラグ）を破棄しトップページへ戻す
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('family_id');
  cookieStore.delete('member_db_id');
  cookieStore.delete('fc_force_password_change');
  redirect('/');
}
