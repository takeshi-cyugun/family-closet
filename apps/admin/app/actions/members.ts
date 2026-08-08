"use server";

import { db, families, members, clothes } from "@repo/database";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "./auth";

const RESTORE_GRACE_PERIOD_DAYS = 14;

export type MemberHistoryItem = {
  memberDbId: string;
  familyId: string;
  familyName: string;
  memberId: string;
  displayName: string;
  role: "owner" | "member";
  createdAt: string;
  deletedAt: string | null;
  isRestorable: boolean;
};

// 全ファミリーのメンバー追加・削除履歴を取得する（削除後14日以内なら復元可能として返す）
export async function getMemberHistory(): Promise<MemberHistoryItem[]> {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const [allMembers, allFamilies] = await Promise.all([
    db.select().from(members).orderBy(desc(members.createdAt)),
    db.select().from(families),
  ]);

  const familyNameById = new Map(allFamilies.map((f) => [f.id, f.name]));
  const cutoff = Date.now() - RESTORE_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;

  return allMembers.map((member) => ({
    memberDbId: member.id,
    familyId: member.familyId,
    familyName: familyNameById.get(member.familyId) ?? member.familyId,
    memberId: member.memberId,
    displayName: member.displayName,
    role: member.role,
    createdAt: member.createdAt.toISOString().slice(0, 10),
    deletedAt: member.deletedAt ? member.deletedAt.toISOString().slice(0, 10) : null,
    isRestorable: member.deletedAt !== null && member.deletedAt.getTime() >= cutoff,
  }));
}

export type RestoreMemberResult = { success: true } | { success: false; error: string };

// 削除後14日以内のメンバーを復元する（メンバー本体 + 一緒にソフトデリートされたアイテムの両方）
export async function restoreMember(memberDbId: string): Promise<RestoreMemberResult> {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const [target] = await db.select().from(members).where(eq(members.id, memberDbId));
  if (!target || !target.deletedAt) {
    return { success: false, error: "このメンバーは削除されていません。" };
  }

  const cutoff = Date.now() - RESTORE_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;
  if (target.deletedAt.getTime() < cutoff) {
    return { success: false, error: "復元期間（14日）を過ぎているため復元できません。" };
  }

  await db.transaction(async (tx) => {
    await tx.update(members).set({ deletedAt: null, updatedAt: new Date() }).where(eq(members.id, memberDbId));
    await tx
      .update(clothes)
      .set({ deletedAt: null, updatedAt: new Date() })
      .where(and(eq(clothes.ownerMemberId, memberDbId), isNotNull(clothes.deletedAt)));
  });

  revalidatePath("/members");
  return { success: true };
}
