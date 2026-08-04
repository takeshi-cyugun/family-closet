'use server';

import { db, clothes, families, members, subscriptions } from '@repo/database';
import { eq } from 'drizzle-orm';

export interface ConvertGuestToFamilyInput {
  guestFamilyId?: string;
  newFamilyId: string;
  ownerMemberId: string;
  ownerDisplayName: string;
  authUserId: string;
  selectedPlan: 'chest' | 'walk_in';
}

// 新規ファミリー・代表者メンバーを作成する。guestFamilyIdが指定された場合はゲストデータを引き継ぐ
export async function convertGuestToFamily(input: ConvertGuestToFamilyInput) {
  try {
    await db.transaction(async (tx) => {
      // 1. 新規ファミリー作成
      await tx.insert(families).values({
        id: input.newFamilyId,
        isGuest: false,
      });

      // 2. 代表者メンバー作成
      const [newOwner] = await tx
        .insert(members)
        .values({
          familyId: input.newFamilyId,
          memberId: input.ownerMemberId,
          displayName: input.ownerDisplayName,
          role: 'owner',
          isFirstLogin: false,
          authUserId: input.authUserId,
        })
        .returning({ id: members.id });

      if (input.guestFamilyId) {
        // 3. 洋服データの移行 (family_id と owner_member_id の更新)
        await tx
          .update(clothes)
          .set({
            familyId: input.newFamilyId,
            ownerMemberId: newOwner.id,
          })
          .where(eq(clothes.familyId, input.guestFamilyId));

        // 4. 旧ゲストファミリーデータの削除 (CASCADEで旧メンバー等も削除)
        await tx.delete(families).where(eq(families.id, input.guestFamilyId));
      }

      // 5. 新プランのサブスクリプションを作成
      await tx.insert(subscriptions).values({
        familyId: input.newFamilyId,
        planType: input.selectedPlan,
        status: 'active',
      });
    });

    return { success: true as const };
  } catch (error) {
    console.error('Failed to convert guest data:', error);
    return { success: false as const, error: 'データの引き継ぎ・登録に失敗しました' };
  }
}