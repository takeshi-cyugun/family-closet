"use server";

import { db, families, members, subscriptions, clothes } from "@repo/database";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "./auth";

export type CountItem = { label: string; value: number };

export type DashboardStats = {
  totalFamilies: number;
  totalMembers: number;
  totalClothes: number;
  planCounts: CountItem[];
  statusCounts: CountItem[];
  languageCounts: CountItem[];
  registrationsByDay: CountItem[];
};

const PLAN_LABEL: Record<string, string> = {
  fitting: "フィッティング",
  chest: "チェスト",
  walk_in: "ウォークイン",
};

const LANGUAGE_LABEL: Record<string, string> = {
  ja: "日本語",
  en: "English",
  "zh-CN": "中文（简体）",
  "zh-TW": "中文（繁體）",
};

const REGISTRATION_TREND_DAYS = 14;

// ダッシュボード集計データを取得する（サービスロールキー不要、生データの集計のみ）
export async function getDashboardStats(): Promise<DashboardStats> {
  if (!(await isAdminAuthenticated())) {
    redirect("/login");
  }

  const [allFamilies, allMembers, allSubscriptions, clothesRows] = await Promise.all([
    db.select().from(families),
    db.select().from(members),
    db.select().from(subscriptions),
    db.select({ id: clothes.id }).from(clothes),
  ]);

  const planCountMap = new Map<string, number>();
  const statusCountMap = new Map<string, number>();
  const languageCountMap = new Map<string, number>();

  for (const family of allFamilies) {
    const familyMembers = allMembers.filter((m) => m.familyId === family.id);
    const owner = familyMembers.find((m) => m.role === "owner") ?? familyMembers[0];
    const subscription = allSubscriptions.find((s) => s.familyId === family.id);

    const planKey = subscription?.planType ?? "fitting";
    planCountMap.set(planKey, (planCountMap.get(planKey) ?? 0) + 1);

    let statusLabel: string;
    if (family.isGuest) {
      statusLabel = "お試し中";
    } else if (subscription?.status === "active") {
      statusLabel = "契約中";
    } else if (subscription?.status === "canceled" || subscription?.status === "cancelled") {
      statusLabel = "退会";
    } else {
      statusLabel = "その他";
    }
    statusCountMap.set(statusLabel, (statusCountMap.get(statusLabel) ?? 0) + 1);

    const languageKey = owner?.preferredLanguage ?? "ja";
    languageCountMap.set(languageKey, (languageCountMap.get(languageKey) ?? 0) + 1);
  }

  const days: string[] = [];
  const now = new Date();
  for (let i = REGISTRATION_TREND_DAYS - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const dayCountMap = new Map(days.map((d) => [d, 0]));
  for (const family of allFamilies) {
    const day = family.createdAt.toISOString().slice(0, 10);
    if (dayCountMap.has(day)) {
      dayCountMap.set(day, (dayCountMap.get(day) ?? 0) + 1);
    }
  }

  return {
    totalFamilies: allFamilies.length,
    totalMembers: allMembers.length,
    totalClothes: clothesRows.length,
    planCounts: [...planCountMap.entries()]
      .map(([key, value]) => ({ label: PLAN_LABEL[key] ?? key, value }))
      .sort((a, b) => b.value - a.value),
    statusCounts: [...statusCountMap.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value),
    languageCounts: [...languageCountMap.entries()]
      .map(([key, value]) => ({ label: LANGUAGE_LABEL[key] ?? key, value }))
      .sort((a, b) => b.value - a.value),
    registrationsByDay: days.map((date) => ({
      label: `${Number(date.slice(5, 7))}/${Number(date.slice(8, 10))}`,
      value: dayCountMap.get(date) ?? 0,
    })),
  };
}
