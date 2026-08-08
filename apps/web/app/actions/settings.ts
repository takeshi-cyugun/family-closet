'use server';

import { cookies } from 'next/headers';
import { db, families, subscriptions, members, clothes, createSupabaseServerClient } from '@repo/database';
import { and, eq, isNull } from 'drizzle-orm';
import { mapPlanTypeToTier } from '../settings/_data/constants';
import type { PlanTier } from '../settings/_data/constants';

export type SettingsData = {
  familyName: string;
  memberDbId: string;
  memberName: string;
  role: 'admin' | 'member';
  isGuest: boolean;
  guestDaysLeft: number | null;
  planTier: PlanTier;
  memberCount: number;
  itemCount: number;
};

// 表示名が未設定の場合のフォールバック（メールアドレスの@より前を使う）
async function resolveMemberDisplayName(displayName: string, authUserId: string | null): Promise<string> {
  if (displayName.trim()) return displayName;
  if (!authUserId) return displayName;

  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.admin.getUserById(authUserId);
  const email = data.user?.email;
  return email ? email.split('@')[0] : displayName;
}

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
  const familyMembers = await db
    .select()
    .from(members)
    .where(and(eq(members.familyId, familyId), isNull(members.deletedAt)));
  const currentMember = familyMembers.find((member) => member.id === memberDbId);
  const familyClothes = await db
    .select({ id: clothes.id })
    .from(clothes)
    .where(and(eq(clothes.familyId, familyId), isNull(clothes.deletedAt)));

  const guestDaysLeft =
    family.isGuest && family.guestExpiresAt
      ? Math.max(0, Math.ceil((family.guestExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null;

  const memberName = currentMember
    ? await resolveMemberDisplayName(currentMember.displayName, currentMember.authUserId)
    : 'ゲスト';

  return {
    familyName: family.name,
    memberDbId,
    memberName,
    role: currentMember?.role === 'owner' ? 'admin' : 'member',
    isGuest: family.isGuest,
    guestDaysLeft,
    planTier: mapPlanTypeToTier(subscription?.planType ?? 'fitting'),
    memberCount: familyMembers.length,
    itemCount: familyClothes.length,
  };
}

export type UpdateNameResult = { success: true } | { success: false; error: string };

// ログイン中ファミリーの表示名を更新する（CookieのfamilyIdにスコープ、本人のみ）
export async function updateFamilyName(name: string): Promise<UpdateNameResult> {
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: 'ファミリー名を入力してください。' };

  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  const memberDbId = cookieStore.get('member_db_id')?.value;
  if (!familyId || !memberDbId) {
    return { success: false, error: 'ログイン情報が見つかりません。再度ログインしてください。' };
  }

  await db.update(families).set({ name: trimmed, updatedAt: new Date() }).where(eq(families.id, familyId));
  return { success: true };
}

// ログイン中メンバー本人の表示名を更新する（CookieのmemberDbIdにスコープ、本人のみ）
export async function updateMemberDisplayName(name: string): Promise<UpdateNameResult> {
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: '表示名を入力してください。' };

  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  const memberDbId = cookieStore.get('member_db_id')?.value;
  if (!familyId || !memberDbId) {
    return { success: false, error: 'ログイン情報が見つかりません。再度ログインしてください。' };
  }

  const [currentMember] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, memberDbId), isNull(members.deletedAt)));
  if (!currentMember || currentMember.familyId !== familyId) {
    return { success: false, error: 'メンバー情報が見つかりません。' };
  }

  await db
    .update(members)
    .set({ displayName: trimmed, updatedAt: new Date() })
    .where(eq(members.id, memberDbId));
  return { success: true };
}
