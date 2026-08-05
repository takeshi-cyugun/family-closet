"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategoryIcon } from "../../../_lib/clothes";
import type { ClothesItem, ClothesStatus } from "../../../_lib/clothes";

type ClothesDetailProps = {
  item: ClothesItem;
  ownerName: string;
  prevId: string | null;
  nextId: string | null;
  closeTo: "back" | string;
};

const STATUS_BADGE_CLASS: Record<ClothesStatus, string> = {
  使用中: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  保管中: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  処分予定: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  処分済: "bg-neutral-300 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300",
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

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 ${wide ? "col-span-2" : ""}`}>
      <dt className="text-xs text-neutral-500 dark:text-neutral-400">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}

export function ClothesDetailContent({
  item,
  ownerName,
  prevId,
  nextId,
  closeTo,
}: ClothesDetailProps) {
  const router = useRouter();

  function handleClose() {
    if (closeTo === "back") router.back();
    else router.push(closeTo);
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

        <div className="mt-4 flex items-center justify-between gap-2">
          <h2 className="text-xl font-bold">{item.name}</h2>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[item.status]}`}
          >
            {item.status}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <Field label="カテゴリ" value={item.category || "-"} />
          <Field label="サイズ" value={item.size} />
          <Field label="シーズン" value={item.season} />
          <Field label="オーナー" value={ownerName} />
          <Field label="メモ" value={item.memo || "-"} wide />
        </dl>

        <div className="mt-6">
          <Link
            href={`/clothes/${item.id}/edit`}
            className="block rounded-md border border-black/10 py-2.5 text-center text-sm font-medium dark:border-white/15"
          >
            編集する
          </Link>
        </div>
      </main>
    </>
  );
}
