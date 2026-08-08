'use server';

import { cookies } from 'next/headers';
import { db, families } from '@repo/database';
import { eq } from 'drizzle-orm';

export type SessionStatus = { active: boolean; isGuest: boolean };

// トップページで「既にセッション済みか（本会員/ゲスト問わず）」「ゲストかどうか」を軽量に判定する
export async function getSessionStatus(): Promise<SessionStatus> {
  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  const memberDbId = cookieStore.get('member_db_id')?.value;
  if (!familyId || !memberDbId) {
    return { active: false, isGuest: false };
  }

  const [family] = await db.select({ isGuest: families.isGuest }).from(families).where(eq(families.id, familyId));
  return { active: true, isGuest: family?.isGuest ?? false };
}
