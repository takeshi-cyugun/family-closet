"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { restoreMember, type MemberHistoryItem } from "../../actions/members";

const ROLE_LABEL: Record<MemberHistoryItem["role"], string> = {
  owner: "代表者",
  member: "メンバー",
};

function StatusBadge({ member }: { member: MemberHistoryItem }) {
  if (!member.deletedAt) {
    return <span className="text-emerald-700">有効</span>;
  }
  if (member.isRestorable) {
    return <span className="text-amber-700">削除済み（復元可能）</span>;
  }
  return <span className="text-neutral-400">削除済み（復元期限切れ）</span>;
}

function RestoreButton({ member }: { member: MemberHistoryItem }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!member.isRestorable) return null;

  function handleRestore() {
    setError(null);
    startTransition(async () => {
      const result = await restoreMember(member.memberDbId);
      if (!result.success) {
        setError(result.error);
        setConfirming(false);
        return;
      }
      router.refresh();
    });
  }

  if (confirming) {
    return (
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-neutral-500">復元しますか？</span>
          <button
            type="button"
            onClick={handleRestore}
            disabled={isPending}
            className="rounded border border-black/10 bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50"
          >
            {isPending ? "復元中..." : "はい"}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="rounded border border-black/10 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            キャンセル
          </button>
        </div>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="rounded border border-black/10 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
      >
        復元する
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

export function MemberHistoryTable({ members }: { members: MemberHistoryItem[] }) {
  if (members.length === 0) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-10 text-center text-sm text-neutral-500">
        メンバーがまだ登録されていません。
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-neutral-50 text-left text-xs text-neutral-500">
            <th className="px-4 py-3 font-medium">ファミリー</th>
            <th className="px-4 py-3 font-medium">メンバー</th>
            <th className="px-4 py-3 font-medium">役割</th>
            <th className="px-4 py-3 font-medium">追加日</th>
            <th className="px-4 py-3 font-medium">削除日</th>
            <th className="px-4 py-3 font-medium">状態</th>
            <th className="px-4 py-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.memberDbId} className="border-b border-black/5 last:border-0">
              <td className="px-4 py-3">
                <div>{member.familyName}</div>
                <div className="font-mono text-xs text-neutral-400">{member.familyId}</div>
              </td>
              <td className="px-4 py-3">
                <div>{member.displayName}</div>
                <div className="font-mono text-xs text-neutral-400">{member.memberId}</div>
              </td>
              <td className="px-4 py-3">{ROLE_LABEL[member.role]}</td>
              <td className="px-4 py-3 text-neutral-500">{member.createdAt}</td>
              <td className="px-4 py-3 text-neutral-500">{member.deletedAt ?? "—"}</td>
              <td className="px-4 py-3">
                <StatusBadge member={member} />
              </td>
              <td className="px-4 py-3">
                <RestoreButton member={member} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
