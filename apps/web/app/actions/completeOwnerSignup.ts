'use server';

import { db, members, createSupabaseAuthClient } from '@repo/database';
import { eq } from 'drizzle-orm';
import { convertGuestToFamily } from './convertGuestToFamily';
import { sendFamilyCreatedEmail } from '../_lib/mail';

export type CompleteOwnerSignupResult = { success: true } | { success: false; error: string };

type SignupMetadata = {
  plan?: 'chest' | 'walk_in';
  guestFamilyId?: string;
  language?: string;
};

// メール確認リンク（#access_token=...）を検証し、ファミリー・代表メンバーをDBに作成する。
// 確認リンクが2回踏まれても安全なよう、既にメンバーが作成済みなら何もせず成功を返す（冪等）。
export async function completeOwnerSignup(accessToken: string): Promise<CompleteOwnerSignupResult> {
  const authClient = createSupabaseAuthClient();
  const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);

  if (userError || !userData?.user) {
    return {
      success: false,
      error: '確認リンクが無効か、有効期限が切れています。もう一度サインアップをやり直してください。',
    };
  }

  const user = userData.user;

  const [existingMember] = await db
    .select({ id: members.id })
    .from(members)
    .where(eq(members.authUserId, user.id));
  if (existingMember) {
    return { success: true };
  }

  const metadata = (user.user_metadata ?? {}) as SignupMetadata;
  const plan: 'chest' | 'walk_in' = metadata.plan === 'walk_in' ? 'walk_in' : 'chest';
  const newFamilyId = crypto.randomUUID();
  const ownerDisplayName = user.email?.split('@')[0] || 'オーナー';

  const result = await convertGuestToFamily({
    guestFamilyId: metadata.guestFamilyId,
    newFamilyId,
    ownerMemberId: 'owner',
    ownerDisplayName,
    authUserId: user.id,
    selectedPlan: plan,
    preferredLanguage: metadata.language,
  });

  if (!result.success) {
    return result;
  }

  if (user.email) {
    await sendFamilyCreatedEmail(user.email).catch((error) => {
      console.error('Failed to send family-created email:', error);
    });
  }

  return { success: true };
}
