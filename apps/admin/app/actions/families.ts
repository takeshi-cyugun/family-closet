"use server";

import { db, families, members, subscriptions, clothes, createSupabaseServerClient } from "@repo/database";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "./auth";
import { DEFAULT_PAGE_SIZE, type PageSize } from "../_lib/pagination";

export type FamilyListItem = {
  familyId: string;
  familyName: string;
  isGuest: boolean;
  ownerName: string | null;
  ownerEmail: string | null;
  ownerLanguage: string | null;
  memberCount: number;
  planType: string;
  subscriptionStatus: string | null;
  createdAt: string;
};

export type FamilyListPage = {
  items: FamilyListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type FamilyFilters = {
  keyword?: string;
  planType?: string;
};

// ファミリー一覧を取得する（サービスロールキーを使う管理者専用データ出力）
export async function getFamilies(
  page = 1,
  pageSize: PageSize = DEFAULT_PAGE_SIZE,
  filters: FamilyFilters = {},
): Promise<FamilyListPage> {
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

  const items = allFamilies.map((family) => {
    const familyMembers = allMembers.filter((m) => m.familyId === family.id);
    const owner = familyMembers.find((m) => m.role === "owner") ?? familyMembers[0];
    const subscription = allSubscriptions.find((s) => s.familyId === family.id);

    return {
      familyId: family.id,
      familyName: family.name,
      isGuest: family.isGuest,
      ownerName: owner?.displayName ?? null,
      ownerEmail: owner?.authUserId ? emailByAuthUserId.get(owner.authUserId) ?? null : null,
      ownerLanguage: owner?.preferredLanguage ?? null,
      memberCount: familyMembers.length,
      planType: subscription?.planType ?? "fitting",
      subscriptionStatus: subscription?.status ?? null,
      createdAt: family.createdAt.toISOString(),
    };
  });

  const keyword = filters.keyword?.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    if (filters.planType && item.planType !== filters.planType) return false;
    if (keyword) {
      const haystack = `${item.familyName} ${item.ownerName ?? ""} ${item.ownerEmail ?? ""}`.toLowerCase();
      if (!haystack.includes(keyword)) return false;
    }
    return true;
  });

  const totalCount = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: filteredItems.slice(start, start + pageSize),
    totalCount,
    page: safePage,
    pageSize,
  };
}

export type FamilyMemberDetail = {
  memberDbId: string;
  memberId: string;
  displayName: string;
  role: "owner" | "member";
  preferredLanguage: string;
  isFirstLogin: boolean;
  deletedAt: string | null;
  createdAt: string;
};

export type FamilyDetail = {
  familyId: string;
  familyName: string;
  isGuest: boolean;
  guestExpiresAt: string | null;
  ownerEmail: string | null;
  planType: string;
  subscriptionStatus: string | null;
  clothesCount: number;
  createdAt: string;
  members: FamilyMemberDetail[];
};

// ファミリー詳細を取得する（サービスロールキーを使う管理者専用データ出力）
export async function getFamilyDetail(familyId: string): Promise<FamilyDetail | null> {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const [[family], familyMembers, [subscription], clothesRows] = await Promise.all([
    db.select().from(families).where(eq(families.id, familyId)),
    db.select().from(members).where(eq(members.familyId, familyId)).orderBy(desc(members.createdAt)),
    db.select().from(subscriptions).where(eq(subscriptions.familyId, familyId)),
    db.select({ id: clothes.id }).from(clothes).where(eq(clothes.familyId, familyId)),
  ]);

  if (!family) {
    return null;
  }

  const owner = familyMembers.find((m) => m.role === "owner") ?? familyMembers[0];
  let ownerEmail: string | null = null;
  if (owner?.authUserId) {
    const adminClient = createSupabaseServerClient();
    const { data } = await adminClient.auth.admin.getUserById(owner.authUserId);
    ownerEmail = data.user?.email ?? null;
  }

  return {
    familyId: family.id,
    familyName: family.name,
    isGuest: family.isGuest,
    guestExpiresAt: family.guestExpiresAt ? family.guestExpiresAt.toISOString() : null,
    ownerEmail,
    planType: subscription?.planType ?? "fitting",
    subscriptionStatus: subscription?.status ?? null,
    clothesCount: clothesRows.length,
    createdAt: family.createdAt.toISOString(),
    members: familyMembers.map((m) => ({
      memberDbId: m.id,
      memberId: m.memberId,
      displayName: m.displayName,
      role: m.role,
      preferredLanguage: m.preferredLanguage,
      isFirstLogin: m.isFirstLogin,
      deletedAt: m.deletedAt ? m.deletedAt.toISOString() : null,
      createdAt: m.createdAt.toISOString(),
    })),
  };
}
