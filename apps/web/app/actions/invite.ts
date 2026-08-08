'use server';

import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import { db, families, members } from '@repo/database';
import { and, eq, isNull } from 'drizzle-orm';

export type GetInviteTokenResult = { success: true; token: string } | { success: false; error: string };

function generateInviteToken(): string {
  return randomBytes(24).toString('base64url');
}

// 代表者本人が、家族に1つ紐づく固定招待トークンを取得する（未発行なら暗号学的に安全な乱数で新規発行）
export async function getOrCreateInviteToken(): Promise<GetInviteTokenResult> {
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

  if (family.inviteToken) {
    return { success: true, token: family.inviteToken };
  }

  const token = generateInviteToken();
  await db.update(families).set({ inviteToken: token, updatedAt: new Date() }).where(eq(families.id, familyId));

  return { success: true, token };
}
