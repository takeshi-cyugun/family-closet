"use server";

import { db, families, members, clothes } from "@repo/database";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "./auth";
import { DEFAULT_PAGE_SIZE, type PageSize } from "../_lib/pagination";

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

export type MemberHistoryPage = {
  items: MemberHistoryItem[];
  totalCount: number;
  page: number;
  pageSize: number;
};

// 全ファミリーのメンバー追加・削除履歴を取得する（削除後14日以内なら復元可能として返す）
export async function getMemberHistory(
  page = 1,
  pageSize: PageSize = DEFAULT_PAGE_SIZE,
): Promise<MemberHistoryPage> {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const [allMembers, allFamilies] = await Promise.all([
    db.select().from(members).orderBy(desc(members.createdAt)),
    db.select().from(families),
  ]);

  const familyNameById = new Map(allFamilies.map((f) => [f.id, f.name]));
  const cutoff = Date.now() - RESTORE_GRACE_PERIOD_DAYS * 24 * 60 * 60 * 1000;

  const items = allMembers.map((member) => ({
    memberDbId: member.id,
    familyId: member.familyId,
    familyName: familyNameById.get(member.familyId) ?? member.familyId,
    memberId: member.memberId,
    displayName: member.displayName,
    role: member.role,
    createdAt: member.createdAt.toISOString(),
    deletedAt: member.deletedAt ? member.deletedAt.toISOString() : null,
    isRestorable: member.deletedAt !== null && member.deletedAt.getTime() >= cutoff,
  }));

  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    totalCount,
    page: safePage,
    pageSize,
  };
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
