'use server';

import { db, clothes, families, members, subscriptions } from '@repo/database';
import { eq } from 'drizzle-orm';

interface ConvertInput {
  guestFamilyId: string;
  newFamilyId: string;
  ownerMemberId: string;
  ownerDisplayName: string;
  selectedPlan: 'chest' | 'walk_in';
}

export async function convertGuestToFamily(input: ConvertInput) {
  try {
    await db.transaction(async (tx: any) => {
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
        })
        .returning({ id: members.id });

      // 3. 洋服データの移行 (family_id と owner_member_id の更新)
      await tx
        .update(clothes)
        .set({
          familyId: input.newFamilyId,
          ownerMemberId: newOwner.id,
        })
        .where(eq(clothes.familyId, input.guestFamilyId));

      // 4. 新プランのサブスクリプションを作成
      await tx.insert(subscriptions).values({
        familyId: input.newFamilyId,
        planType: input.selectedPlan,
        status: 'active',
      });

      // 5. 旧ゲストファミリーデータの削除 (CASCADEで旧メンバー等も削除)
      await tx.delete(families).where(eq(families.id, input.guestFamilyId));
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to convert guest data:', error);
    return { success: false, error: 'データの引き継ぎ・登録に失敗しました' };
  }
}