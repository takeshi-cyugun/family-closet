'use server';

import { cookies } from 'next/headers';
import { db, families, members, subscriptions, createSupabaseServerClient } from '@repo/database';
import { and, eq, isNull } from 'drizzle-orm';
import { PLAN_LIMITS, mapPlanTypeToTier } from '../settings/_data/constants';

const PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';

function generateInitialPassword(): string {
  let out = '';
  for (let i = 0; i < 10; i++) {
    out += PASSWORD_CHARS[Math.floor(Math.random() * PASSWORD_CHARS.length)];
  }
  return out;
}

export interface AddMemberInput {
  memberId: string;
  displayName: string;
}

export type AddMemberResult =
  | { success: true; memberId: string; password: string }
  | { success: false; error: string };

// ログイン中の代表者が家族メンバーを追加する（Supabase Authユーザー作成 + members行追加、初期パスワードを発行）
export async function addMember(input: AddMemberInput): Promise<AddMemberResult> {
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
  if (!currentMember || currentMember.familyId !== familyId || currentMember.role !== 'owner') {
    return { success: false, error: 'この操作には代表者権限が必要です。' };
  }

  const [family] = await db.select().from(families).where(eq(families.id, familyId));
  if (!family) {
    return { success: false, error: 'ファミリー情報が見つかりません。' };
  }

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.familyId, familyId));
  const limit = PLAN_LIMITS[mapPlanTypeToTier(subscription?.planType ?? 'fitting')].memberLimit;

  const familyMembers = await db
    .select()
    .from(members)
    .where(and(eq(members.familyId, familyId), isNull(members.deletedAt)));
  if (familyMembers.length >= limit) {
    return { success: false, error: 'メンバー数の上限に達しています。プランのアップグレードが必要です。' };
  }
  if (familyMembers.some((m) => m.memberId === input.memberId)) {
    return { success: false, error: 'このメンバーIDは既に使用されています。' };
  }

  const password = generateInitialPassword();
  const syntheticEmail = `${familyId}.${input.memberId}@members.familycloset.internal`;

  const supabase = createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: syntheticEmail,
    password,
    email_confirm: true,
  });
  if (authError || !authData?.user) {
    console.error('Failed to create member auth user:', authError);
    return { success: false, error: 'メンバーの追加に失敗しました。' };
  }

  try {
    await db.insert(members).values({
      familyId,
      memberId: input.memberId,
      displayName: input.displayName,
      role: 'member',
      isFirstLogin: true,
      authUserId: authData.user.id,
    });
  } catch (error) {
    console.error('Failed to insert member row:', error);
    await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {});
    return { success: false, error: 'メンバーの追加に失敗しました。' };
  }

  return { success: true, memberId: input.memberId, password };
}
