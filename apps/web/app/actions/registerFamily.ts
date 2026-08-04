'use server';

import { cookies } from 'next/headers';
import { db, families, createSupabaseServerClient, createSupabaseAuthClient } from '@repo/database';
import { eq } from 'drizzle-orm';
import { convertGuestToFamily } from './convertGuestToFamily';

export interface RegisterFamilyInput {
  email: string;
  password: string;
  familyId: string;
  memberId: string;
  displayName: string;
  plan: 'chest' | 'walk_in';
  migrateGuestData: boolean;
}

export type RegisterFamilyResult = { success: true } | { success: false; error: string };

// ファミリーIDの空き状況を確認する（実DB照会）
export async function checkFamilyIdAvailability(id: string): Promise<boolean> {
  const [existing] = await db.select({ id: families.id }).from(families).where(eq(families.id, id));
  return !existing;
}

// 代表者アカウント（Supabase Auth）とファミリーを新規作成する
export async function registerFamily(input: RegisterFamilyInput): Promise<RegisterFamilyResult> {
  const [existingFamily] = await db
    .select({ id: families.id })
    .from(families)
    .where(eq(families.id, input.familyId));
  if (existingFamily) {
    return { success: false, error: 'このファミリーIDは既に使用されています。' };
  }

  const authClient = createSupabaseAuthClient();
  const { data: authData, error: authError } = await authClient.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirmed`,
    },
  });

  if (authError || !authData?.user) {
    console.error('Failed to create auth user:', authError);
    const message = authError?.message?.toLowerCase().includes('already')
      ? 'このメールアドレスは既に登録されています。'
      : 'アカウントの作成に失敗しました。';
    return { success: false, error: message };
  }

  const adminClient = createSupabaseServerClient();

  const cookieStore = await cookies();
  const guestFamilyId = input.migrateGuestData
    ? cookieStore.get('family_id')?.value
    : undefined;

  const result = await convertGuestToFamily({
    guestFamilyId,
    newFamilyId: input.familyId,
    ownerMemberId: input.memberId,
    ownerDisplayName: input.displayName,
    authUserId: authData.user.id,
    selectedPlan: input.plan,
  });

  if (!result.success) {
    // DB側が失敗した場合は作成済みのAuthユーザーを削除してロールバックする
    await adminClient.auth.admin.deleteUser(authData.user.id).catch(() => {});
    return result;
  }

  if (guestFamilyId) {
    cookieStore.delete('family_id');
    cookieStore.delete('member_db_id');
  }

  return { success: true };
}
