'use server';

import { cookies } from 'next/headers';
import { db, clothes, members, subscriptions } from '@repo/database';
import { eq, and, desc, isNull, ilike, or, count } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { mapDbStatusToUiStatus, mapUiStatusToDbStatus } from '../_lib/clothes';
import type { ClothesItem, ClothesStatus, DbClothesStatus, Season, Size } from '../_lib/clothes';
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
  thumbnailUrl?: string;
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
    thumbnailDataUrl: row.thumbnailUrl ?? row.imageUrl,
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
      .where(and(eq(clothes.familyId, input.familyId), isNull(clothes.deletedAt)));
    if (existingClothes.length >= limit) {
      return {
        success: false as const,
        error: 'アイテム数の上限に達しています。プランのアップグレードが必要です。',
        reason: 'item_limit' as const,
      };
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

    revalidatePath('/list');
    return { success: true as const, data: newCloth };
  } catch (error) {
    console.error('Failed to create clothes:', error);
    return { success: false as const, error: '洋服の登録に失敗しました。' };
  }
}

export interface ClothesPageFilter {
  ownerMemberId?: string;
  category?: string;
  status?: ClothesStatus;
  season?: string;
  size?: string;
  keyword?: string;
}

export interface ClothesPageResult {
  items: ClothesItem[];
  total: number;
}

// 一覧画面向け: 絞り込み・ページングをDBクエリ側で行う（CookieのfamilyIdにスコープ）
export async function getClothesPage(
  filter: ClothesPageFilter,
  page: number,
  pageSize: number
): Promise<ClothesPageResult> {
  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  if (!familyId) return { items: [], total: 0 };

  const conditions = [eq(clothes.familyId, familyId), isNull(clothes.deletedAt)];
  if (filter.ownerMemberId) conditions.push(eq(clothes.ownerMemberId, filter.ownerMemberId));
  if (filter.category) conditions.push(eq(clothes.category, filter.category));
  if (filter.status) conditions.push(eq(clothes.status, mapUiStatusToDbStatus(filter.status)));
  if (filter.season) conditions.push(eq(clothes.season, filter.season));
  if (filter.size) conditions.push(eq(clothes.size, filter.size));

  const keyword = filter.keyword?.trim();
  if (keyword) {
    const pattern = `%${keyword}%`;
    conditions.push(or(ilike(clothes.name, pattern), ilike(clothes.color, pattern), ilike(clothes.memo, pattern))!);
  }

  const where = and(...conditions);

  const [rows, totalRows] = await Promise.all([
    db
      .select()
      .from(clothes)
      .where(where)
      .orderBy(desc(clothes.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ value: count() }).from(clothes).where(where),
  ]);

  return { items: rows.map(toClothesItem), total: totalRows[0]?.value ?? 0 };
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
    .where(and(eq(clothes.familyId, familyId), isNull(clothes.deletedAt)))
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

// 編集画面用: 対象1件のみを取得する軽量版（前後ナビゲーションが不要なため、getClothesDetailと違いファミリー全件は読まない）
export async function getClothesForEdit(id: string): Promise<{ item: ClothesItem; familyId: string } | null> {
  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  if (!familyId) return null;

  const [row] = await db
    .select()
    .from(clothes)
    .where(and(eq(clothes.id, id), eq(clothes.familyId, familyId), isNull(clothes.deletedAt)))
    .limit(1);

  if (!row) return null;

  return { item: toClothesItem(row), familyId };
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
        ...(input.imageUrl
          ? { imageUrl: input.imageUrl, thumbnailUrl: input.thumbnailUrl || input.imageUrl }
          : {}),
        updatedAt: new Date(),
      })
      .where(and(eq(clothes.id, clothesId), eq(clothes.familyId, familyId)));

    revalidatePath('/list');
    revalidatePath(`/items/${clothesId}`);
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

    revalidatePath('/list');
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

    revalidatePath('/list');
    return { success: true as const };
  } catch (error) {
    console.error('Failed to delete clothes:', error);
    return { success: false as const, error: '洋服の削除に失敗しました。' };
  }
}
