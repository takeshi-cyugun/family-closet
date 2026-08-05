import type { FamilyListItem } from "../../actions/families";

const PLAN_LABEL: Record<string, string> = {
  fitting: "フィッティング（ゲスト）",
  chest: "チェスト",
  walk_in: "ウォークイン",
};

function PlanBadge({ planType }: { planType: string }) {
  return (
    <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
      {PLAN_LABEL[planType] ?? planType}
    </span>
  );
}

export function FamiliesTable({ families }: { families: FamilyListItem[] }) {
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
            <th className="px-4 py-3 font-medium">ファミリーID</th>
            <th className="px-4 py-3 font-medium">代表者</th>
            <th className="px-4 py-3 font-medium">メールアドレス</th>
            <th className="px-4 py-3 font-medium">メンバー数</th>
            <th className="px-4 py-3 font-medium">プラン</th>
            <th className="px-4 py-3 font-medium">区分</th>
            <th className="px-4 py-3 font-medium">登録日</th>
          </tr>
        </thead>
        <tbody>
          {families.map((family) => (
            <tr key={family.familyId} className="border-b border-black/5 last:border-0">
              <td className="px-4 py-3 font-mono text-xs">{family.familyId}</td>
              <td className="px-4 py-3">{family.ownerName ?? "—"}</td>
              <td className="px-4 py-3 text-neutral-600">{family.ownerEmail ?? "—"}</td>
              <td className="px-4 py-3">{family.memberCount}</td>
              <td className="px-4 py-3">
                <PlanBadge planType={family.planType} />
              </td>
              <td className="px-4 py-3">
                {family.isGuest ? (
                  <span className="text-amber-700">ゲスト</span>
                ) : (
                  <span className="text-emerald-700">本登録</span>
                )}
              </td>
              <td className="px-4 py-3 text-neutral-500">{family.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
