'use server';

import { cookies } from 'next/headers';
import { db, members, createSupabaseServerClient, createSupabaseAuthClient } from '@repo/database';
import { eq } from 'drizzle-orm';

export type ChangePasswordResult = { success: true } | { success: false; error: string };

// ログイン中メンバーのパスワードを変更し、初回ログインフラグを解除する
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResult> {
  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  const memberDbId = cookieStore.get('member_db_id')?.value;
  if (!familyId || !memberDbId) {
    return { success: false, error: 'ログイン情報が見つかりません。再度ログインしてください。' };
  }

  const [member] = await db.select().from(members).where(eq(members.id, memberDbId));
  if (!member || member.familyId !== familyId || !member.authUserId) {
    return { success: false, error: 'ログイン情報が見つかりません。再度ログインしてください。' };
  }

  const adminClient = createSupabaseServerClient();
  const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(
    member.authUserId
  );
  if (userError || !userData?.user?.email) {
    console.error('Failed to look up auth user:', userError);
    return { success: false, error: 'パスワードの変更に失敗しました。' };
  }

  // 現在のパスワードを再検証する
  const authClient = createSupabaseAuthClient();
  const { error: verifyError } = await authClient.auth.signInWithPassword({
    email: userData.user.email,
    password: currentPassword,
  });
  if (verifyError) {
    return { success: false, error: '現在のパスワードが正しくありません。' };
  }

  const { error: updateError } = await adminClient.auth.admin.updateUserById(member.authUserId, {
    password: newPassword,
  });
  if (updateError) {
    console.error('Failed to update password:', updateError);
    return { success: false, error: 'パスワードの変更に失敗しました。' };
  }

  await db
    .update(members)
    .set({ isFirstLogin: false, updatedAt: new Date() })
    .where(eq(members.id, memberDbId));

  cookieStore.delete('fc_force_password_change');

  return { success: true };
}
