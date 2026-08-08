'use server';

import { cookies } from 'next/headers';
import { db, families, createSupabaseAuthClient } from '@repo/database';
import { eq } from 'drizzle-orm';

export interface SignupOwnerInput {
  email: string;
  password: string;
  plan: 'chest' | 'walk_in';
  language: string;
}

export type SignupOwnerResult = { success: true } | { success: false; error: string };

// 代表者サインアップ（メール認証）: Supabase Authへのユーザー作成 + 確認メール送信のみを行う。
// ファミリー・代表メンバーのDB作成はメール確認完了後（completeOwnerSignup）まで行わない。
export async function signupOwner(input: SignupOwnerInput): Promise<SignupOwnerResult> {
  const email = input.email.trim().toLowerCase();

  // お試し利用中のゲストセッションがあれば、確認完了後に引き継げるようメタデータに残しておく
  // （確認メールのリンクは別ブラウザ・別端末で開かれる可能性があり、その時点ではこのCookieを参照できないため）
  const cookieStore = await cookies();
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

  const authClient = createSupabaseAuthClient();
  const { data: authData, error: authError } = await authClient.auth.signUp({
    email,
    password: input.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirmed`,
      data: {
        plan: input.plan,
        guestFamilyId,
        language: input.language,
      },
    },
  });

  if (authError || !authData?.user) {
    console.error('Failed to create auth user:', authError);
    const message = authError?.message?.toLowerCase().includes('already')
      ? 'このメールアドレスは既に登録されています。'
      : 'アカウントの作成に失敗しました。';
    return { success: false, error: message };
  }

  return { success: true };
}
