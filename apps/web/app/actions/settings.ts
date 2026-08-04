'use server';

import { cookies } from 'next/headers';
import { db, families, subscriptions, members, clothes } from '@repo/database';
import { eq } from 'drizzle-orm';
import { mapPlanTypeToTier } from '../settings/_data/constants';
import type { PlanTier } from '../settings/_data/constants';

export type SettingsData = {
  familyId: string;
  memberId: string;
  role: 'admin' | 'member';
  isGuest: boolean;
  guestDaysLeft: number | null;
  planTier: PlanTier;
  memberCount: number;
  itemCount: number;
};

// ログイン中（ゲスト）ファミリーの設定画面用データを取得（CookieのfamilyIdにスコープ）
export async function getSettingsData(): Promise<SettingsData | null> {
  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  const memberDbId = cookieStore.get('member_db_id')?.value;
  if (!familyId || !memberDbId) return null;

  const [family] = await db.select().from(families).where(eq(families.id, familyId));
  if (!family) return null;

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.familyId, familyId));
  const familyMembers = await db.select().from(members).where(eq(members.familyId, familyId));
  const currentMember = familyMembers.find((member) => member.id === memberDbId);
  const familyClothes = await db
    .select({ id: clothes.id })
    .from(clothes)
    .where(eq(clothes.familyId, familyId));

  const guestDaysLeft =
    family.isGuest && family.guestExpiresAt
      ? Math.max(0, Math.ceil((family.guestExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null;

  return {
    familyId,
    memberId: currentMember?.memberId ?? 'guest',
    role: currentMember?.role === 'owner' ? 'admin' : 'member',
    isGuest: family.isGuest,
    guestDaysLeft,
    planTier: mapPlanTypeToTier(subscription?.planType ?? 'fitting'),
    memberCount: familyMembers.length,
    itemCount: familyClothes.length,
  };
}
