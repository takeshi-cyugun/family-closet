import Link from "next/link";
import { notFound } from "next/navigation";
import { getFamilyDetail } from "../../../actions/families";
import { formatDateTime } from "../../../_lib/format";
import { PLAN_LABEL } from "../../../_lib/plans";
import { CopyableId } from "../../_components/CopyableId";
import { DeleteFamilyButton } from "../../_components/DeleteFamilyButton";

const ROLE_LABEL: Record<string, string> = {
  owner: "代表者",
  member: "メンバー",
};

export default async function FamilyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const family = await getFamilyDetail(id);

  if (!family) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/families" className="text-sm text-neutral-500 hover:text-black">
        ← ファミリー一覧に戻る
      </Link>

      <div className="mt-2 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">{family.familyName}</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              family.isGuest ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {family.isGuest ? "ゲスト" : "本登録"}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-black/10 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            編集する
          </button>
          <DeleteFamilyButton
            familyId={family.familyId}
            familyName={family.familyName}
            memberCount={family.members.length}
            clothesCount={family.clothesCount}
          />
        </div>
      </div>

      <div className="rounded-lg border border-black/10 bg-white p-6">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="text-xs text-neutral-500">ファミリーID</dt>
            <dd className="mt-1">
              <CopyableId fullId={family.familyId} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">プラン</dt>
            <dd className="mt-1">{PLAN_LABEL[family.planType] ?? family.planType}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">代表者メールアドレス</dt>
            <dd className="mt-1">{family.ownerEmail ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">契約ステータス</dt>
            <dd className="mt-1">{family.subscriptionStatus ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">登録アイテム数</dt>
            <dd className="mt-1">{family.clothesCount}件</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">登録日時</dt>
            <dd className="mt-1">{formatDateTime(family.createdAt)}</dd>
          </div>
          {family.isGuest && family.guestExpiresAt && (
            <div>
              <dt className="text-xs text-neutral-500">ゲスト期限</dt>
              <dd className="mt-1">{formatDateTime(family.guestExpiresAt)}</dd>
            </div>
          )}
        </dl>
      </div>

      <h3 className="mt-6 mb-2 text-sm font-bold">メンバー（{family.members.length}人）</h3>
      <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-black/10 bg-neutral-50 text-left text-xs text-neutral-500">
              <th className="px-4 py-3 font-medium">メンバー</th>
              <th className="px-4 py-3 font-medium">役割</th>
              <th className="px-4 py-3 font-medium">言語</th>
              <th className="px-4 py-3 font-medium">追加日時</th>
              <th className="px-4 py-3 font-medium">状態</th>
            </tr>
          </thead>
          <tbody>
            {family.members.map((member) => (
              <tr key={member.memberDbId} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <div>{member.displayName}</div>
                  <div className="font-mono text-xs text-neutral-400">{member.memberId}</div>
                </td>
                <td className="px-4 py-3">{ROLE_LABEL[member.role] ?? member.role}</td>
                <td className="px-4 py-3 text-neutral-600">{member.preferredLanguage}</td>
                <td className="px-4 py-3 text-neutral-500">{formatDateTime(member.createdAt)}</td>
                <td className="px-4 py-3">
                  {member.deletedAt ? (
                    <span className="text-neutral-400">削除済み</span>
                  ) : (
                    <span className="text-emerald-700">有効</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
