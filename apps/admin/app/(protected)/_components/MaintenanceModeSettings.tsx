"use client";

import { useState, type FormEvent } from "react";
import { useMaintenanceStatus } from "./MaintenanceStatusContext";

type RecoveryTimeMode = "hidden" | "fixed";

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function formatWithWeekday(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return WEEKDAY_FORMATTER.format(date);
}

// datetime-local は年欄が4桁で自動的に次の欄へ進まないため、区切らず続けて入力すると
// 年に余分な桁が混入し不正な日時になりやすい。その場合は曜日を出さず理由を明示する。
function isUnparseableDate(value: string): boolean {
  if (!value) return false;
  return Number.isNaN(new Date(value).getTime());
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-red-600" : "bg-neutral-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Card({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-black/10 bg-white p-6">
      <h3 className="text-sm font-bold">{title}</h3>
      {description && <p className="mt-1 text-xs text-neutral-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function MaintenanceModeSettings() {
  const { enabled, setEnabled, windowStart, setWindowStart, windowEnd, setWindowEnd, isMaintenanceActive } =
    useMaintenanceStatus();
  const [recoveryMode, setRecoveryMode] = useState<RecoveryTimeMode>("hidden");
  const [recoveryTime, setRecoveryTime] = useState("");
  const [exceptionPaths, setExceptionPaths] = useState<string[]>(["/contact", "/notices"]);
  const [newPath, setNewPath] = useState("");
  const [pathError, setPathError] = useState<string | null>(null);

  const statusLabel = isMaintenanceActive
    ? "メンテナンス中"
    : enabled
      ? "稼働中（時間帯外）"
      : "稼働中";

  function handleAddPath(e: FormEvent) {
    e.preventDefault();
    const path = newPath.trim();
    if (!path) return;
    if (!path.startsWith("/")) {
      setPathError("パスは「/」から始めてください。");
      return;
    }
    if (exceptionPaths.includes(path)) {
      setPathError("すでに登録されているパスです。");
      return;
    }
    setExceptionPaths((prev) => [...prev, path]);
    setNewPath("");
    setPathError(null);
  }

  function handleRemovePath(path: string) {
    setExceptionPaths((prev) => prev.filter((p) => p !== path));
  }

  return (
    <div className="flex flex-col gap-6">
      <Card title="メンテナンスモード">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ToggleSwitch checked={enabled} onChange={setEnabled} />
            <span className="text-sm font-medium">{enabled ? "有効" : "無効"}</span>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isMaintenanceActive
                ? "bg-red-100 text-red-700"
                : enabled
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
            }`}
          >
            ● {statusLabel}
          </span>
        </div>

        <div className="mt-5 border-t border-black/10 pt-5">
          <h4 className="text-xs font-bold text-neutral-700">メンテナンス時間帯</h4>
          <p className="mt-1 text-xs text-neutral-500">
            スイッチが有効、かつ現在時刻が下記の期間内のときのみメンテナンス状態になります。開始・終了の両方を設定してください。
          </p>
          <div className="mt-3 flex items-start gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500">開始日時</span>
              <input
                type="datetime-local"
                value={windowStart}
                onChange={(e) => setWindowStart(e.target.value)}
                className="rounded-md border border-black/10 px-3 py-2 text-sm"
              />
              {formatWithWeekday(windowStart) && (
                <span className="text-xs text-neutral-400">{formatWithWeekday(windowStart)}</span>
              )}
              {isUnparseableDate(windowStart) && (
                <span className="text-xs text-red-600">日時が正しく入力されていません。年欄の桁数をご確認ください。</span>
              )}
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500">終了日時</span>
              <input
                type="datetime-local"
                value={windowEnd}
                onChange={(e) => setWindowEnd(e.target.value)}
                className="rounded-md border border-black/10 px-3 py-2 text-sm"
              />
              {formatWithWeekday(windowEnd) && (
                <span className="text-xs text-neutral-400">{formatWithWeekday(windowEnd)}</span>
              )}
              {isUnparseableDate(windowEnd) && (
                <span className="text-xs text-red-600">日時が正しく入力されていません。年欄の桁数をご確認ください。</span>
              )}
            </label>
          </div>
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          条件を満たすと即時に反映されます。管理者ログイン済みのセッションは、メンテナンス中も引き続き画面を利用できます。
        </p>
      </Card>

      <Card title="復旧予定時刻の表示" description="一般アクセスに表示するメンテナンス画面の内容を設定します。">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="recoveryMode"
              checked={recoveryMode === "hidden"}
              onChange={() => setRecoveryMode("hidden")}
            />
            表示しない
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="recoveryMode"
              checked={recoveryMode === "fixed"}
              onChange={() => setRecoveryMode("fixed")}
            />
            固定の日時を表示する
          </label>
          {recoveryMode === "fixed" && (
            <input
              type="datetime-local"
              value={recoveryTime}
              onChange={(e) => setRecoveryTime(e.target.value)}
              className="mt-1 w-64 rounded-md border border-black/10 px-3 py-2 text-sm"
            />
          )}
        </div>
      </Card>

      <Card
        title="例外パス"
        description="メンテナンス中も一般公開のまま稼働させるURLパスを指定します（お問い合わせフォームやお知らせページなど）。"
      >
        <form onSubmit={handleAddPath} className="flex items-start gap-2">
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={newPath}
              onChange={(e) => {
                setNewPath(e.target.value);
                setPathError(null);
              }}
              placeholder="/contact"
              className="w-64 rounded-md border border-black/10 px-3 py-2 text-sm"
            />
            {pathError && <span className="text-xs text-red-600">{pathError}</span>}
          </div>
          <button
            type="submit"
            className="rounded-md border border-black/10 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            追加
          </button>
        </form>

        {exceptionPaths.length === 0 ? (
          <p className="mt-4 text-xs text-neutral-400">例外パスは登録されていません。</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {exceptionPaths.map((path) => (
              <li
                key={path}
                className="flex items-center justify-between rounded-md border border-black/10 bg-neutral-50 px-3 py-2"
              >
                <span className="font-mono text-xs">{path}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePath(path)}
                  className="text-xs text-neutral-400 hover:text-red-600"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="裏側処理について">
        <p className="text-xs text-neutral-500">
          メンテナンスモードは一般ユーザーのアクセスのみを制限します。バッチ処理・キューなどの裏側処理は停止せず、そのまま稼働を継続します。
        </p>
      </Card>
    </div>
  );
}
