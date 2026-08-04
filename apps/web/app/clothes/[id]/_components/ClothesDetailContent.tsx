"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { STATUSES, getCategoryIcon, mapUiStatusToDbStatus } from "../../../_lib/clothes";
import type { ClothesItem, ClothesStatus } from "../../../_lib/clothes";
import { deleteClothes, updateClothesStatus } from "../../../actions/clothes";

type ClothesDetailProps = {
  item: ClothesItem;
  ownerName: string;
  familyId: string;
  prevId: string | null;
  nextId: string | null;
  closeTo: "back" | string;
};

const STATUS_BADGE_CLASS: Record<ClothesStatus, string> = {
  使用中: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  保管中: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  "譲渡/廃棄予定": "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
};

function NavArrow({ direction, id }: { direction: "prev" | "next"; id: string | null }) {
  const symbol = direction === "prev" ? "‹" : "›";
  const label = direction === "prev" ? "前の洋服" : "次の洋服";
  const side = direction === "prev" ? "left-2" : "right-2";

  if (!id) {
    return (
      <span
        aria-hidden
        className={`absolute ${side} top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/10 text-lg text-white/40`}
      >
        {symbol}
      </span>
    );
  }

  return (
    <Link
      href={`/clothes/${id}`}
      aria-label={label}
      className={`absolute ${side} top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-lg text-white`}
    >
      {symbol}
    </Link>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2.5">
      <dt className="text-neutral-500 dark:text-neutral-400">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

export function ClothesDetailContent({
  item: initialItem,
  ownerName,
  familyId,
  prevId,
  nextId,
  closeTo,
}: ClothesDetailProps) {
  const router = useRouter();
  const [item, setItem] = useState(initialItem);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleClose() {
    if (closeTo === "back") router.back();
    else router.push(closeTo);
  }

  async function handleStatusChange(status: ClothesStatus) {
    if (status === item.status || statusUpdating) return;
    setStatusUpdating(true);
    const result = await updateClothesStatus(item.id, familyId, mapUiStatusToDbStatus(status));
    setStatusUpdating(false);
    if (result.success) setItem((prev) => ({ ...prev, status }));
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteClothes(item.id, familyId);
    if (result.success) {
      router.push("/dashboard");
    } else {
      setDeleting(false);
    }
  }

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-black/10 px-4 dark:border-white/10">
        <h1 className="text-base font-bold">洋服の詳細</h1>
        <button
          type="button"
          onClick={handleClose}
          aria-label="閉じる"
          className="text-xl leading-none text-neutral-500 dark:text-neutral-400"
        >
          ✕
        </button>
      </header>

      <main className="flex-1 px-4 py-4">
        <div className="relative">
          <NavArrow direction="prev" id={prevId} />

          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
            {item.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.photoDataUrl} alt={item.name} className="h-full w-full object-contain" />
            ) : (
              <span className="text-7xl">{getCategoryIcon(item.category)}</span>
            )}
          </div>

          <NavArrow direction="next" id={nextId} />
        </div>

        <h2 className="mt-4 text-lg font-bold">{item.name}</h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              disabled={statusUpdating}
              onClick={() => handleStatusChange(status)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${
                status === item.status
                  ? STATUS_BADGE_CLASS[status]
                  : "bg-black/5 text-neutral-500 dark:bg-white/10 dark:text-neutral-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <dl className="mt-4 divide-y divide-black/10 text-sm dark:divide-white/10">
          <Row label="カテゴリ" value={item.category || "-"} />
          <Row label="オーナー" value={ownerName} />
          <Row label="シーズン" value={item.season} />
          <Row label="サイズ" value={item.size} />
          <Row label="登録日" value={item.createdAt ?? "-"} />
          <Row label="メモ" value={item.memo || "-"} />
        </dl>

        <div className="mt-6 flex gap-2">
          <Link
            href={`/clothes/${item.id}/edit`}
            className="flex-1 rounded-md border border-black/10 py-2.5 text-center text-sm font-medium dark:border-white/15"
          >
            編集する
          </Link>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="flex-1 rounded-md border border-red-300 py-2.5 text-sm font-medium text-red-600 dark:border-red-900 dark:text-red-400"
          >
            削除する
          </button>
        </div>

        {confirmingDelete && (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm dark:border-red-900 dark:bg-red-950/40">
            <p className="mb-2 text-red-700 dark:text-red-300">
              本当に削除しますか？この操作は取り消せません。
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmingDelete(false)}
                className="flex-1 rounded-md border border-black/10 py-2 text-sm disabled:opacity-50 dark:border-white/15"
              >
                キャンセル
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 rounded-md bg-red-600 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {deleting ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
