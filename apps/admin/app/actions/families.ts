"use server";

import { db, families, members, subscriptions, createSupabaseServerClient } from "@repo/database";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "./auth";

export type FamilyListItem = {
  familyId: string;
  isGuest: boolean;
  ownerName: string | null;
  ownerEmail: string | null;
  memberCount: number;
  planType: string;
  subscriptionStatus: string | null;
  createdAt: string;
};

// ファミリー一覧を取得する（サービスロールキーを使う管理者専用データ出力）
export async function getFamilies(): Promise<FamilyListItem[]> {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const [allFamilies, allMembers, allSubscriptions] = await Promise.all([
    db.select().from(families).orderBy(desc(families.createdAt)),
    db.select().from(members),
    db.select().from(subscriptions),
  ]);

  const adminClient = createSupabaseServerClient();
  const { data: usersData } = await adminClient.auth.admin.listUsers({ perPage: 1000 });
  const emailByAuthUserId = new Map(usersData?.users.map((u) => [u.id, u.email ?? null]) ?? []);

  return allFamilies.map((family) => {
    const familyMembers = allMembers.filter((m) => m.familyId === family.id);
    const owner = familyMembers.find((m) => m.role === "owner") ?? familyMembers[0];
    const subscription = allSubscriptions.find((s) => s.familyId === family.id);

    return {
      familyId: family.id,
      isGuest: family.isGuest,
      ownerName: owner?.displayName ?? null,
      ownerEmail: owner?.authUserId ? emailByAuthUserId.get(owner.authUserId) ?? null : null,
      memberCount: familyMembers.length,
      planType: subscription?.planType ?? "fitting",
      subscriptionStatus: subscription?.status ?? null,
      createdAt: family.createdAt.toISOString().slice(0, 10),
    };
  });
}
