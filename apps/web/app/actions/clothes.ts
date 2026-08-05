'use server';

import { cookies } from 'next/headers';
import { db, clothes, members, subscriptions } from '@repo/database';
import { eq, and, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { mapDbStatusToUiStatus } from '../_lib/clothes';
import type { ClothesItem, DbClothesStatus, Season, Size } from '../_lib/clothes';
import { PLAN_LIMITS, mapPlanTypeToTier } from '../settings/_data/constants';

export interface CreateClothesInput {
  familyId: string;
  ownerMemberId: string;
  name: string;
  imageUrl: string;
  thumbnailUrl?: string;
  category: string;
  color: string;
  size?: string;
  season?: string;
  memo?: string;
  status?: 'in_use' | 'stored' | 'disposal_planned' | 'disposed';
}

export interface UpdateClothesInput {
  name: string;
  category: string;
  color: string;
  size?: string;
  season?: string;
  memo?: string;
  imageUrl?: string;
  status?: 'in_use' | 'stored' | 'disposal_planned' | 'disposed';
}

function toClothesItem(row: typeof clothes.$inferSelect): ClothesItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    color: row.color,
    ownerId: row.ownerMemberId,
    status: mapDbStatusToUiStatus(row.status),
    season: (row.season as Season) ?? '通年',
    size: (row.size as Size) ?? 'FREE',
    memo: row.memo ?? undefined,
    photoDataUrl: row.imageUrl,
    createdAt: row.createdAt.toISOString().slice(0, 10),
  };
}

// 洋服の新規登録
export async function createClothes(input: CreateClothesInput) {
  try {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.familyId, input.familyId));
    const limit = PLAN_LIMITS[mapPlanTypeToTier(subscription?.planType ?? 'fitting')].itemLimit;

    const existingClothes = await db
      .select({ id: clothes.id })
      .from(clothes)
      .where(eq(clothes.familyId, input.familyId));
    if (existingClothes.length >= limit) {
      return { success: false as const, error: 'アイテム数の上限に達しています。プランのアップグレードが必要です。' };
    }

    const [newCloth] = await db
      .insert(clothes)
      .values({
        familyId: input.familyId,
        ownerMemberId: input.ownerMemberId,
        name: input.name,
        imageUrl: input.imageUrl,
        thumbnailUrl: input.thumbnailUrl || input.imageUrl,
        category: input.category,
        color: input.color,
        size: input.size,
        season: input.season,
        memo: input.memo,
        status: input.status ?? 'in_use',
      })
      .returning();

    revalidatePath('/dashboard');
    return { success: true as const, data: newCloth };
  } catch (error) {
    console.error('Failed to create clothes:', error);
    return { success: false as const, error: '洋服の登録に失敗しました。' };
  }
}

// ログイン中（ゲスト）ファミリーの洋服一覧を取得（CookieのfamilyIdにスコープ）
export async function getClothesForFamily(): Promise<ClothesItem[]> {
  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  if (!familyId) return [];

  const rows = await db
    .select()
    .from(clothes)
    .where(eq(clothes.familyId, familyId))
    .orderBy(desc(clothes.createdAt));

  return rows.map(toClothesItem);
}

export type ClothesDetail = {
  item: ClothesItem;
  ownerName: string;
  familyId: string;
  prevId: string | null;
  nextId: string | null;
};

// 洋服詳細 + 前後ナビゲーション（Cookieのゲストファミリーにスコープ）
export async function getClothesDetail(id: string): Promise<ClothesDetail | null> {
  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  if (!familyId) return null;

  const rows = await db
    .select()
    .from(clothes)
    .where(eq(clothes.familyId, familyId))
    .orderBy(desc(clothes.createdAt));

  const index = rows.findIndex((row) => row.id === id);
  if (index === -1) return null;

  const row = rows[index];
  const [owner] = await db.select().from(members).where(eq(members.id, row.ownerMemberId));

  return {
    item: toClothesItem(row),
    ownerName: owner?.displayName ?? '不明',
    familyId,
    prevId: index > 0 ? rows[index - 1].id : null,
    nextId: index < rows.length - 1 ? rows[index + 1].id : null,
  };
}

// 洋服の全項目更新（編集フォーム用）
export async function updateClothes(clothesId: string, familyId: string, input: UpdateClothesInput) {
  try {
    await db
      .update(clothes)
      .set({
        name: input.name,
        category: input.category,
        color: input.color,
        size: input.size,
        season: input.season,
        memo: input.memo,
        ...(input.status ? { status: input.status } : {}),
        ...(input.imageUrl ? { imageUrl: input.imageUrl, thumbnailUrl: input.imageUrl } : {}),
        updatedAt: new Date(),
      })
      .where(and(eq(clothes.id, clothesId), eq(clothes.familyId, familyId)));

    revalidatePath('/dashboard');
    revalidatePath(`/clothes/${clothesId}`);
    return { success: true as const };
  } catch (error) {
    console.error('Failed to update clothes:', error);
    return { success: false as const, error: '洋服の更新に失敗しました。' };
  }
}

// ステータス一括更新 (使用中 / 保管中 / 譲渡・廃棄予定)
export async function updateClothesStatus(
  clothesId: string,
  familyId: string,
  status: DbClothesStatus
) {
  try {
    await db
      .update(clothes)
      .set({ status, updatedAt: new Date() })
      .where(and(eq(clothes.id, clothesId), eq(clothes.familyId, familyId)));

    revalidatePath('/dashboard');
    return { success: true as const };
  } catch (error) {
    console.error('Failed to update status:', error);
    return { success: false as const, error: 'ステータスの更新に失敗しました。' };
  }
}

// 洋服の削除
export async function deleteClothes(clothesId: string, familyId: string) {
  try {
    await db
      .delete(clothes)
      .where(and(eq(clothes.id, clothesId), eq(clothes.familyId, familyId)));

    revalidatePath('/dashboard');
    return { success: true as const };
  } catch (error) {
    console.error('Failed to delete clothes:', error);
    return { success: false as const, error: '洋服の削除に失敗しました。' };
  }
}
