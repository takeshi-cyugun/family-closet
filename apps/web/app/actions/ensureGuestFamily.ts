'use server';

import { cookies } from 'next/headers';
import { db, families, members, subscriptions } from '@repo/database';

export type GuestFamily = { familyId: string; memberId: string };

// 既存のゲストセッションCookieがあればそれを再利用し、なければ実DBにファミリー/メンバーを新規作成する
export async function ensureGuestFamily(): Promise<GuestFamily> {
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
      isGuest: true,
      guestExpiresAt,
    });

    const [newMember] = await tx
      .insert(members)
      .values({
        familyId: guestFamilyId,
        memberId: 'guest',
        displayName: 'ゲスト',
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
