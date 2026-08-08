'use server';

import { cookies } from 'next/headers';
import { db, members, clothes } from '@repo/database';
import { and, eq, isNull } from 'drizzle-orm';

async function requireOwner(): Promise<
  { ok: true; familyId: string; ownerMemberId: string } | { ok: false; error: string }
> {
  const cookieStore = await cookies();
  const familyId = cookieStore.get('family_id')?.value;
  const memberDbId = cookieStore.get('member_db_id')?.value;
  if (!familyId || !memberDbId) {
    return { ok: false, error: 'ログイン情報が見つかりません。再度ログインしてください。' };
  }

  const [currentMember] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, memberDbId), isNull(members.deletedAt)));
  if (!currentMember || currentMember.familyId !== familyId || currentMember.role !== 'owner') {
    return { ok: false, error: 'この操作には代表者権限が必要です。' };
  }

  return { ok: true, familyId, ownerMemberId: memberDbId };
}

export type MemberItemCountResult = { success: true; itemCount: number } | { success: false; error: string };

// 削除対象メンバーの所有アイテム数を確認する（確認モーダル表示用）
export async function getMemberItemCount(targetMemberId: string): Promise<MemberItemCountResult> {
  const auth = await requireOwner();
  if (!auth.ok) return { success: false, error: auth.error };

  const [target] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, targetMemberId), isNull(members.deletedAt)));
  if (!target || target.familyId !== auth.familyId) {
    return { success: false, error: 'メンバーが見つかりません。' };
  }
  if (target.role === 'owner') {
    return { success: false, error: '代表者は削除できません。' };
  }

  const items = await db
    .select({ id: clothes.id })
    .from(clothes)
    .where(and(eq(clothes.ownerMemberId, targetMemberId), isNull(clothes.deletedAt)));

  return { success: true, itemCount: items.length };
}

export type DeleteMemberResult = { success: true } | { success: false; error: string };

// 代表者が家族メンバーを削除する。所有アイテムは「代表者名義へ引き継ぐ」か「一緒に削除する」かを選べる
// 即時削除ではなくソフトデリート（deletedAt付与）のみ行い、DB行・Storage画像・Supabase Authユーザーの
// 物理削除は14日後にバッチ処理（app/api/cron/purge-deleted-members）が行う。管理画面からは14日以内なら復元可能。
export async function deleteMember(
  targetMemberId: string,
  reassignItemsToOwner: boolean
): Promise<DeleteMemberResult> {
  const auth = await requireOwner();
  if (!auth.ok) return { success: false, error: auth.error };

  const [target] = await db
    .select()
    .from(members)
    .where(and(eq(members.id, targetMemberId), isNull(members.deletedAt)));
  if (!target || target.familyId !== auth.familyId) {
    return { success: false, error: 'メンバーが見つかりません。' };
  }
  if (target.role === 'owner') {
    return { success: false, error: '代表者は削除できません。' };
  }

  const now = new Date();

  await db.transaction(async (tx) => {
    if (reassignItemsToOwner) {
      // アイテムの所有者を代表者へ付け替える（アイテム自体はソフトデリートしない）
      await tx
        .update(clothes)
        .set({ ownerMemberId: auth.ownerMemberId, updatedAt: now })
        .where(and(eq(clothes.ownerMemberId, targetMemberId), isNull(clothes.deletedAt)));
    } else {
      // 引き継がない場合、所有アイテムもメンバーと一緒に猶予期間へ入れる（14日後にバッチで物理削除）
      await tx
        .update(clothes)
        .set({ deletedAt: now, updatedAt: now })
        .where(and(eq(clothes.ownerMemberId, targetMemberId), isNull(clothes.deletedAt)));
    }

    await tx.update(members).set({ deletedAt: now, updatedAt: now }).where(eq(members.id, targetMemberId));
  });

  return { success: true };
}
