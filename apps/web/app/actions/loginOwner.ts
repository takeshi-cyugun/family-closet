'use server';

import { cookies } from 'next/headers';
import { db, members, createSupabaseAuthClient } from '@repo/database';
import { and, eq, isNull } from 'drizzle-orm';
import { isLocked, recordFailure, clearAttempts, getClientIp } from './_lib/loginLockout';

export type LoginOwnerResult =
  | { success: true; firstLogin: boolean }
  | { success: false; error: string };

const INVALID_CREDENTIALS_MESSAGE = 'メールアドレスまたはパスワードが正しくありません。';
const LOCKED_MESSAGE = 'ログイン試行回数の上限に達しました。5分後に再度お試しください。';
const EMAIL_NOT_CONFIRMED_MESSAGE = 'メールアドレスの確認が完了していません。届いた確認メール内のリンクをクリックしてください。';

// メールアドレス + パスワードで代表者ログインし、セッションCookieを発行する。
// ファミリーIDはCookieの値からサーバー側で解決するため、ユーザーが入力する必要はない。
export async function loginOwner(email: string, password: string): Promise<LoginOwnerResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const ip = await getClientIp();
  const accountKey = `account:email:${normalizedEmail}`;
  const ipKey = ip ? `ip:${ip}` : null;

  if ((await isLocked(accountKey)) || (ipKey && (await isLocked(ipKey)))) {
    return { success: false, error: LOCKED_MESSAGE };
  }

  async function recordFailureAndReject(): Promise<LoginOwnerResult> {
    await recordFailure(accountKey);
    if (ipKey) await recordFailure(ipKey);
    return { success: false, error: INVALID_CREDENTIALS_MESSAGE };
  }

  const authClient = createSupabaseAuthClient();
  const { data: authData, error: signInError } = await authClient.auth.signInWithPassword({
    email: normalizedEmail,
    password,
  });

  if (signInError || !authData?.user) {
    if (signInError?.code === 'email_not_confirmed') {
      return { success: false, error: EMAIL_NOT_CONFIRMED_MESSAGE };
    }
    return recordFailureAndReject();
  }

  const [member] = await db
    .select()
    .from(members)
    .where(and(eq(members.authUserId, authData.user.id), isNull(members.deletedAt)));

  if (!member) {
    return recordFailureAndReject();
  }

  await clearAttempts(accountKey);
  if (ipKey) await clearAttempts(ipKey);

  const cookieStore = await cookies();
  const oneYear = 60 * 60 * 24 * 365;
  const secure = process.env.NODE_ENV === 'production';
  cookieStore.set('family_id', member.familyId, { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });
  cookieStore.set('member_db_id', member.id, { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });

  if (member.isFirstLogin) {
    cookieStore.set('fc_force_password_change', '1', { maxAge: oneYear, httpOnly: true, secure, sameSite: 'lax' });
  }

  return { success: true, firstLogin: member.isFirstLogin };
}
