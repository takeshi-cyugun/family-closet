'use server';

import { db, clothes } from '@repo/database';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export interface CreateClothesInput {
  familyId: string;
  ownerMemberId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  color: string;
  size?: string;
  season?: string;
  memo?: string;
}

// 洋服の新規登録
export async function createClothes(input: CreateClothesInput) {
  try {
    const [newCloth] = await db
      .insert(clothes)
      .values({
        familyId: input.familyId,
        ownerMemberId: input.ownerMemberId,
        imageUrl: input.imageUrl,
        thumbnailUrl: input.thumbnailUrl || input.imageUrl,
        category: input.category,
        color: input.color,
        size: input.size,
        season: input.season,
        memo: input.memo,
        status: 'in_use',
      })
      .returning();

    revalidatePath('/dashboard');
    return { success: true, data: newCloth };
  } catch (error) {
    console.error('Failed to create clothes:', error);
    return { success: false, error: '洋服の登録に失敗しました。' };
  }
}

// ステータス一括更新 (使用中 / 保管中 / 譲渡・廃棄予定)
export async function updateClothesStatus(
  clothesId: string,
  familyId: string,
  status: 'in_use' | 'stored' | 'disposal_planned'
) {
  try {
    await db
      .update(clothes)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(clothes.id, clothesId), eq(clothes.familyId, familyId)));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to update status:', error);
    return { success: false, error: 'ステータスの更新に失敗しました。' };
  }
}

// 洋服の削除
export async function deleteClothes(clothesId: string, familyId: string) {
  try {
    await db
      .delete(clothes)
      .where(and(eq(clothes.id, clothesId), eq(clothes.familyId, familyId)));

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete clothes:', error);
    return { success: false, error: '洋服の削除に失敗しました。' };
  }
}