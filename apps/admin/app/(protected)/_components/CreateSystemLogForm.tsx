"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSystemLog, type SystemLogSeverity, type SystemLogType } from "../../actions/logs";

export function CreateSystemLogForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<SystemLogType>("notification");
  const [severity, setSeverity] = useState<SystemLogSeverity>("info");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createSystemLog({ type, severity, title, body });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setTitle("");
      setBody("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-black/10 bg-white p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="log-type" className="text-xs text-neutral-500">
          種別
        </label>
        <select
          id="log-type"
          value={type}
          onChange={(e) => setType(e.target.value as SystemLogType)}
          className="rounded-md border border-black/10 px-3 py-2 text-sm"
        >
          <option value="notification">通知</option>
          <option value="incident">障害</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="log-severity" className="text-xs text-neutral-500">
          重要度
        </label>
        <select
          id="log-severity"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as SystemLogSeverity)}
          className="rounded-md border border-black/10 px-3 py-2 text-sm"
        >
          <option value="info">情報</option>
          <option value="warning">警告</option>
          <option value="critical">重大</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="log-title" className="text-xs text-neutral-500">
          タイトル
        </label>
        <input
          id="log-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例: 決済APIの一時障害"
          className="w-64 rounded-md border border-black/10 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="log-body" className="text-xs text-neutral-500">
          内容（任意）
        </label>
        <input
          id="log-body"
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="詳細メモ"
          className="w-72 rounded-md border border-black/10 px-3 py-2 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <button
          type="submit"
          disabled={isPending || !title.trim()}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {isPending ? "登録中..." : "登録する"}
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    </form>
  );
}
