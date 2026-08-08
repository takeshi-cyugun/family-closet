'use server';

import { cookies } from 'next/headers';

// トップページで「既にセッション済み（本会員/ゲスト問わず）」かどうかだけを軽量に判定する
export async function hasActiveSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get('family_id')?.value && cookieStore.get('member_db_id')?.value);
}
