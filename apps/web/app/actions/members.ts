'use server';

import { cookies } from 'next/headers';
import { db, members } from '@repo/database';
import { eq } from 'drizzle-orm';
import type { Member } from '../_lib/clothes';

// ログイン中（ゲスト）ファミリーの実メンバー一覧を取得（CookieのfamilyIdにスコープ）
export async function getFamilyMembers(): Promise<Member[]> {
  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  if (!familyId) return [];

  const rows = await db.select().from(members).where(eq(members.familyId, familyId));

  return rows.map((row) => ({
    id: row.id,
    memberId: row.memberId,
    name: row.displayName,
    role: row.role === 'owner' ? 'admin' : 'member',
  }));
}
