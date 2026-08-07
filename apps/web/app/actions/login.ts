'use server';

import { cookies } from 'next/headers';
import {
  db,
  members,
  createSupabaseServerClient,
  createSupabaseAuthClient,
} from '@repo/database';
import { eq, and } from 'drizzle-orm';
import { isLocked, recordFailure, clearAttempts, getClientIp } from './_lib/loginLockout';

export type LoginResult =
  | { success: true; firstLogin: boolean }
  | { success: false; error: string };

const INVALID_CREDENTIALS_MESSAGE = 'ファミリーID・メンバーID・パスワードの組み合わせが正しくありません。';
const LOCKED_MESSAGE = 'ログイン試行回数の上限に達しました。5分後に再度お試しください。';
const EMAIL_NOT_CONFIRMED_MESSAGE = 'メールアドレスの確認が完了していません。届いた確認メール内のリンクをクリックしてください。';

// ファミリーID + メンバーID + パスワードで実ログインし、セッションCookieを発行する
// IP・アカウント単位で5分間に5回失敗するとロックする（サーバー側ブルートフォース対策）
export async function loginFamily(
  familyId: string,
  memberId: string,
  password: string
): Promise<LoginResult> {
  const ip = await getClientIp();
  const accountKey = `account:${familyId}:${memberId}`;
  const ipKey = ip ? `ip:${ip}` : null;

  if ((await isLocked(accountKey)) || (ipKey && (await isLocked(ipKey)))) {
    return { success: false, error: LOCKED_MESSAGE };
  }

  async function recordFailureAndReject(): Promise<LoginResult> {
    await recordFailure(accountKey);
    if (ipKey) await recordFailure(ipKey);
    return { success: false, error: INVALID_CREDENTIALS_MESSAGE };
  }

  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.familyId, familyId), eq(members.memberId, memberId)));

  if (!member || !member.authUserId) {
    return recordFailureAndReject();
  }

  const adminClient = createSupabaseServerClient();
  const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(
    member.authUserId
  );
  if (userError || !userData?.user?.email) {
    console.error('Failed to look up auth user:', userError);
    return recordFailureAndReject();
  }

  const authClient = createSupabaseAuthClient();
  const { error: signInError } = await authClient.auth.signInWithPassword({
    email: userData.user.email,
    password,
  });
  if (signInError) {
    // メール未確認はブルートフォースカウントを消費させず、専用メッセージを返す
    if (signInError.code === 'email_not_confirmed') {
      return { success: false, error: EMAIL_NOT_CONFIRMED_MESSAGE };
    }
    return recordFailureAndReject();
  }

  await clearAttempts(accountKey);
  if (ipKey) await clearAttempts(ipKey);

  const cookieStore = await cookies();
  const oneYear = 60 * 60 * 24 * 365;
  const secure = process.env.NODE_ENV === 'production';
  cookieStore.set('family_id', familyId, { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });
  cookieStore.set('member_db_id', member.id, { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });

  if (member.isFirstLogin) {
    cookieStore.set('fc_force_password_change', '1', { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });
  }

  return { success: true, firstLogin: member.isFirstLogin };
}
