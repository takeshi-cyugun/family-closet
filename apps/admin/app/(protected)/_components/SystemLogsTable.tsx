"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteSystemLog, type SystemLogItem } from "../../actions/logs";
import { formatDateTime } from "../../_lib/format";

const TYPE_LABEL: Record<SystemLogItem["type"], string> = {
  notification: "通知",
  incident: "障害",
};

const TYPE_COLOR: Record<SystemLogItem["type"], string> = {
  notification: "bg-sky-100 text-sky-700",
  incident: "bg-red-100 text-red-700",
};

const SEVERITY_LABEL: Record<SystemLogItem["severity"], string> = {
  info: "情報",
  warning: "警告",
  critical: "重大",
};

const SEVERITY_COLOR: Record<SystemLogItem["severity"], string> = {
  info: "bg-neutral-100 text-neutral-700",
  warning: "bg-amber-100 text-amber-700",
  critical: "bg-red-100 text-red-700",
};

function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteSystemLog(id);
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
          <span className="text-xs text-neutral-500">削除しますか？</span>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded border border-black/10 bg-red-600 px-2.5 py-1 text-xs font-medium text-white disabled:opacity-50"
          >
            {isPending ? "削除中..." : "はい"}
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
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-xs text-neutral-400 hover:text-red-600"
    >
      削除
    </button>
  );
}

export function SystemLogsTable({ logs }: { logs: SystemLogItem[] }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-10 text-center text-sm text-neutral-500">
        通知・障害ログはまだ登録されていません。
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-black/10 bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-neutral-50 text-left text-xs text-neutral-500">
            <th className="px-4 py-3 font-medium">種別</th>
            <th className="px-4 py-3 font-medium">重要度</th>
            <th className="px-4 py-3 font-medium">タイトル</th>
            <th className="px-4 py-3 font-medium">内容</th>
            <th className="px-4 py-3 font-medium">発生日時</th>
            <th className="px-4 py-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b border-black/5 last:border-0">
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLOR[log.type]}`}>
                  {TYPE_LABEL[log.type]}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${SEVERITY_COLOR[log.severity]}`}>
                  {SEVERITY_LABEL[log.severity]}
                </span>
              </td>
              <td className="px-4 py-3 font-medium">{log.title}</td>
              <td className="max-w-xs px-4 py-3 text-neutral-600">{log.body ?? "—"}</td>
              <td className="px-4 py-3 text-neutral-500">{formatDateTime(log.createdAt)}</td>
              <td className="px-4 py-3">
                <DeleteButton id={log.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
