'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db, families, members, subscriptions } from '@repo/database';

export async function startGuestSession() {
  const guestFamilyId = `guest_${crypto.randomUUID()}`;
  const now = new Date();
  const guestExpiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14日間のフィッティングプラン

  // 1. トランザクションでファミリー・ゲスト代表者・サブスクを同時作成
  await db.transaction(async (tx: any) => {
    // ゲストファミリー作成
    await tx.insert(families).values({
      id: guestFamilyId,
      isGuest: true,
      guestExpiresAt: guestExpiresAt,
    });

    // ゲスト代表者（owner）作成
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

    // サブスク作成 (fitting)
    await tx.insert(subscriptions).values({
      familyId: guestFamilyId,
      planType: 'fitting',
      status: 'active',
    });

    // 2. Cookie にセッション保持
    const cookieStore = await cookies();
    cookieStore.set('guest_family_id', guestFamilyId, {
      expires: guestExpiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    cookieStore.set('guest_member_db_id', newMember.id, {
      expires: guestExpiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  });

  // ダッシュボードへ手動リダイレクト
  redirect('/dashboard');
}