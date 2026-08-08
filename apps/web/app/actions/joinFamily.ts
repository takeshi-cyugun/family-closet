'use server';

import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { db, families, members, subscriptions } from '@repo/database';
import { and, eq, isNull } from 'drizzle-orm';
import { PLAN_LIMITS, mapPlanTypeToTier } from '../settings/_data/constants';

export type JoinFamilyLookupResult =
  | { status: 'ok'; familyName: string }
  | { status: 'invalid' }
  | { status: 'limit_reached' };

// 招待トークンが有効かどうか・上限に達していないかを確認する（ページ表示前のチェック用）
export async function lookupInviteToken(token: string): Promise<JoinFamilyLookupResult> {
  const [family] = await db.select().from(families).where(eq(families.inviteToken, token));
  if (!family) return { status: 'invalid' };

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.familyId, family.id));
  const limit = PLAN_LIMITS[mapPlanTypeToTier(subscription?.planType ?? 'fitting')].memberLimit;

  const familyMembers = await db
    .select({ id: members.id })
    .from(members)
    .where(and(eq(members.familyId, family.id), isNull(members.deletedAt)));
  if (familyMembers.length >= limit) {
    return { status: 'limit_reached' };
  }

  return { status: 'ok', familyName: family.name };
}

function generateMemberId(): string {
  return `member_${randomBytes(4).toString('hex')}`;
}

export type JoinFamilyResult = { success: true } | { success: false; error: string };

// 招待トークンを使って、ログイン不要でメンバーとして参加する（Supabase Authアカウントは作らず、Cookieセッションのみ発行）
export async function joinFamily(token: string, displayName: string): Promise<JoinFamilyResult> {
  const trimmedName = displayName.trim();
  if (!trimmedName) {
    return { success: false, error: '表示名を入力してください。' };
  }

  const [family] = await db.select().from(families).where(eq(families.inviteToken, token));
  if (!family) {
    return { success: false, error: 'この招待リンクは無効です。' };
  }

  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.familyId, family.id));
  const limit = PLAN_LIMITS[mapPlanTypeToTier(subscription?.planType ?? 'fitting')].memberLimit;

  const familyMembers = await db
    .select({ memberId: members.memberId })
    .from(members)
    .where(and(eq(members.familyId, family.id), isNull(members.deletedAt)));
  if (familyMembers.length >= limit) {
    return { success: false, error: 'メンバー数の上限に達しています。' };
  }

  let memberId = generateMemberId();
  for (let i = 0; i < 5 && familyMembers.some((m) => m.memberId === memberId); i++) {
    memberId = generateMemberId();
  }

  const [newMember] = await db
    .insert(members)
    .values({
      familyId: family.id,
      memberId,
      displayName: trimmedName,
      role: 'member',
      isFirstLogin: false,
    })
    .returning({ id: members.id });

  const cookieStore = await cookies();
  const oneYear = 60 * 60 * 24 * 365;
  const secure = process.env.NODE_ENV === 'production';
  cookieStore.set('family_id', family.id, { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });
  cookieStore.set('member_db_id', newMember.id, { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });

  return { success: true };
}
