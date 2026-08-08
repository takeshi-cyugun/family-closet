'use server';

import { cookies } from 'next/headers';
import { db, members, families } from '@repo/database';
import { and, eq, isNull } from 'drizzle-orm';
import type { Member } from '../_lib/clothes';

export type CurrentMemberInfo = {
  name: string | null;
  role: 'owner' | 'member' | null;
  isGuest: boolean;
};

// ログイン中メンバー本人の表示名・権限・ゲスト状態を取得（Cookieのmember_db_id/family_idにスコープ）
export async function getCurrentMemberInfo(): Promise<CurrentMemberInfo> {
  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  const memberDbId = cookieStore.get('member_db_id')?.value;
  if (!familyId || !memberDbId) return { name: null, role: null, isGuest: false };

  const [row] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, memberDbId), isNull(members.deletedAt)));
  const [family] = await db.select().from(families).where(eq(families.id, familyId));

  return {
    name: row?.displayName || null,
    role: row?.role ?? null,
    isGuest: family?.isGuest ?? false,
  };
}

// ログイン中（ゲスト）ファミリーの実メンバー一覧を取得（CookieのfamilyIdにスコープ）
export async function getFamilyMembers(): Promise<Member[]> {
  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  if (!familyId) return [];

  const rows = await db
    .select()
    .from(members)
    .where(and(eq(members.familyId, familyId), isNull(members.deletedAt)));

  return rows.map((row) => ({
    id: row.id,
    memberId: row.memberId,
    name: row.displayName,
    role: row.role === 'owner' ? 'admin' : 'member',
  }));
}
