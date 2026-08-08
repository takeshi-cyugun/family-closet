"use client";

import { useRouter } from "next/navigation";
import type { FamilyListItem } from "../../actions/families";
import { formatDateTime } from "../../_lib/format";
import { LANGUAGE_FLAGS, LANGUAGE_LABEL } from "../../_lib/languageFlags";
import { PLAN_LABEL } from "../../_lib/plans";
import { CopyableId } from "./CopyableId";

function PlanBadge({ planType }: { planType: string }) {
  return (
    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
      {PLAN_LABEL[planType] ?? planType}
    </span>
  );
}

const SUBSCRIPTION_STATUS_LABEL: Record<string, string> = {
  active: "契約中",
  canceled: "退会",
  cancelled: "退会",
  past_due: "支払い遅延",
};

function StatusBadge({ isGuest, subscriptionStatus }: { isGuest: boolean; subscriptionStatus: string | null }) {
  if (isGuest) {
    return (
      <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">お試し中</span>
    );
  }

  const status = subscriptionStatus ?? "";
  const label = SUBSCRIPTION_STATUS_LABEL[status] ?? status ?? "—";
  const colorClass =
    status === "active"
      ? "bg-emerald-100 text-emerald-700"
      : status === "canceled" || status === "cancelled"
        ? "bg-neutral-200 text-neutral-600"
        : status === "past_due"
          ? "bg-red-100 text-red-700"
          : "bg-neutral-100 text-neutral-700";

  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}>{label}</span>;
}

function LanguageFlag({ language }: { language: string | null }) {
  if (!language) return <span className="text-neutral-300">—</span>;
  const Flag = LANGUAGE_FLAGS[language];
  if (!Flag) return <span className="text-xs text-neutral-500">{language}</span>;
  return <Flag title={LANGUAGE_LABEL[language] ?? language} className="h-4 w-6 rounded-sm" />;
}

export function FamiliesTable({ families }: { families: FamilyListItem[] }) {
  const router = useRouter();

  if (families.length === 0) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-10 text-center text-sm text-neutral-500">
        ファミリーがまだ登録されていません。
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-neutral-50 text-left text-xs text-neutral-500">
            <th className="px-4 py-3 font-medium">ファミリー名</th>
            <th className="px-4 py-3 font-medium">ファミリーID</th>
            <th className="px-4 py-3 font-medium">代表者</th>
            <th className="px-4 py-3 font-medium">メールアドレス</th>
            <th className="px-4 py-3 font-medium">メンバー数</th>
            <th className="px-4 py-3 font-medium">言語</th>
            <th className="px-4 py-3 font-medium">プラン</th>
            <th className="px-4 py-3 font-medium">状態</th>
            <th className="px-4 py-3 font-medium">登録日時</th>
          </tr>
        </thead>
        <tbody>
          {families.map((family) => (
            <tr
              key={family.familyId}
              onClick={() => router.push(`/families/${family.familyId}`)}
              className="cursor-pointer border-b border-black/5 last:border-0 hover:bg-neutral-50"
            >
              <td className="px-4 py-3">{family.familyName}</td>
              <td className="px-4 py-3">
                <CopyableId fullId={family.familyId} />
              </td>
              <td className="px-4 py-3">{family.ownerName ?? "—"}</td>
              <td className="px-4 py-3 text-neutral-600">{family.ownerEmail ?? "—"}</td>
              <td className="px-4 py-3">{family.memberCount}</td>
              <td className="px-4 py-3">
                <LanguageFlag language={family.ownerLanguage} />
              </td>
              <td className="px-4 py-3">
                <PlanBadge planType={family.planType} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge isGuest={family.isGuest} subscriptionStatus={family.subscriptionStatus} />
              </td>
              <td className="px-4 py-3 text-neutral-500">{formatDateTime(family.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
