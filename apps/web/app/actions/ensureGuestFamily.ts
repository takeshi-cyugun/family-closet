'use server';

import { cookies } from 'next/headers';
import { db, families, members, subscriptions } from '@repo/database';
import type { LanguageCode } from '../_lib/i18n';

export type GuestFamily = { familyId: string; memberId: string };

// ゲストのファミリー名・メンバー名は作成時の表示言語でそのまま保存する（後から表示側で言語別に出し分けない）
const GUEST_FAMILY_NAMES: Record<LanguageCode, string> = {
  ja: 'ゲストファミリー',
  en: 'Guest Family',
  'zh-CN': '访客家庭',
  'zh-TW': '訪客家庭',
};

const GUEST_MEMBER_NAMES: Record<LanguageCode, string> = {
  ja: 'ゲスト',
  en: 'Guest',
  'zh-CN': '访客',
  'zh-TW': '訪客',
};

// 既存のゲストセッションCookieがあればそれを再利用し、なければ実DBにファミリー/メンバーを新規作成する
export async function ensureGuestFamily(language: LanguageCode = 'ja'): Promise<GuestFamily> {
  const cookieStore = await cookies();
  const existingFamilyId = cookieStore.get('family_id')?.value;
  const existingMemberId = cookieStore.get('member_db_id')?.value;

  if (existingFamilyId && existingMemberId) {
    return { familyId: existingFamilyId, memberId: existingMemberId };
  }

  const guestFamilyId = `guest_${crypto.randomUUID()}`;
  const now = new Date();
  const guestExpiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14日間のフィッティングプラン

  const memberId = await db.transaction(async (tx) => {
    await tx.insert(families).values({
      id: guestFamilyId,
      name: GUEST_FAMILY_NAMES[language] ?? GUEST_FAMILY_NAMES.ja,
      isGuest: true,
      guestExpiresAt,
    });

    const [newMember] = await tx
      .insert(members)
      .values({
        familyId: guestFamilyId,
        memberId: 'guest',
        displayName: GUEST_MEMBER_NAMES[language] ?? GUEST_MEMBER_NAMES.ja,
        role: 'owner',
        isFirstLogin: false,
      })
      .returning({ id: members.id });

    await tx.insert(subscriptions).values({
      familyId: guestFamilyId,
      planType: 'fitting',
      status: 'active',
    });

    return newMember.id as string;
  });

  cookieStore.set('family_id', guestFamilyId, {
    expires: guestExpiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  cookieStore.set('member_db_id', memberId, {
    expires: guestExpiresAt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return { familyId: guestFamilyId, memberId };
}
