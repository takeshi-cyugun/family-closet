'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db, families, members, createSupabaseAuthClient } from '@repo/database';
import { and, eq, isNull } from 'drizzle-orm';
import { convertGuestToFamily } from './convertGuestToFamily';
import { sendFamilyCreatedEmail } from '../_lib/mail';

export type LoginGoogleResult = { success: false; error: string };

const INVALID_TOKEN_MESSAGE = 'Google認証の検証に失敗しました。もう一度お試しください。';

// Googleでのサインイン/サインアップ共通処理。
// authUserIdに紐づくmembersが既にあれば通常ログインと同じCookieを発行するだけ（＝2回目以降はログイン）。
// なければ新規ファミリー・代表者メンバーを作成する（＝初回はサインアップ）。パスワードを持たないため
// isFirstLogin/強制パスワード変更の対象にはしない。
export async function loginWithGoogle(
  accessToken: string,
  plan: 'chest' | 'walk_in'
): Promise<LoginGoogleResult> {
  const authClient = createSupabaseAuthClient();
  const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);

  if (userError || !userData?.user) {
    return { success: false, error: INVALID_TOKEN_MESSAGE };
  }

  const user = userData.user;
  const cookieStore = await cookies();
  const oneYear = 60 * 60 * 24 * 365;
  const secure = process.env.NODE_ENV === 'production';

  const [existingMember] = await db
    .select()
    .from(members)
    .where(and(eq(members.authUserId, user.id), isNull(members.deletedAt)));

  if (existingMember) {
    cookieStore.set('family_id', existingMember.familyId, { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });
    cookieStore.set('member_db_id', existingMember.id, { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });
    redirect('/list');
  }

  const guestFamilyIdCookie = cookieStore.get('family_id')?.value;
  let guestFamilyId: string | undefined;
  if (guestFamilyIdCookie) {
    const [guestFamily] = await db
      .select({ id: families.id, isGuest: families.isGuest })
      .from(families)
      .where(eq(families.id, guestFamilyIdCookie));
    if (guestFamily?.isGuest) {
      guestFamilyId = guestFamily.id;
    }
  }

  const newFamilyId = crypto.randomUUID();
  const ownerDisplayName =
    (user.user_metadata?.full_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    user.email?.split('@')[0] ||
    'オーナー';

  const result = await convertGuestToFamily({
    guestFamilyId,
    newFamilyId,
    ownerMemberId: 'owner',
    ownerDisplayName,
    authUserId: user.id,
    selectedPlan: plan,
  });

  if (!result.success) {
    return result;
  }

  const [newMember] = await db
    .select({ id: members.id })
    .from(members)
    .where(eq(members.authUserId, user.id));

  cookieStore.set('family_id', newFamilyId, { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });
  cookieStore.set('member_db_id', newMember.id, { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });

  if (user.email) {
    await sendFamilyCreatedEmail(user.email).catch((error) => {
      console.error('Failed to send family-created email:', error);
    });
  }

  redirect('/list');
}
