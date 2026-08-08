"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategoryIcon } from "../../../_lib/clothes";
import type { ClothesItem, ClothesStatus } from "../../../_lib/clothes";
import { useLanguage } from "../../../_lib/LanguageContext";
import { getClothesFormDictionary } from "../../_lib/i18n";
import { getDashboardDictionary } from "../../../list/_lib/i18n";

type ClothesDetailProps = {
  item: ClothesItem;
  ownerName: string;
  prevId: string | null;
  nextId: string | null;
  closeTo: "back" | string;
  compact?: boolean;
};

const STATUS_BADGE_CLASS: Record<ClothesStatus, string> = {
  使用中: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  保管中: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  処分予定: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  処分済: "bg-neutral-300 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300",
};

function NavArrow({
  direction,
  id,
  label,
}: {
  direction: "prev" | "next";
  id: string | null;
  label: string;
}) {
  const symbol = direction === "prev" ? "‹" : "›";
  const side = direction === "prev" ? "left-2" : "right-2";

  if (!id) {
    return (
      <span
        aria-hidden
        className={`absolute ${side} top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-espresso/30 text-lg text-on-espresso/50`}
      >
        {symbol}
      </span>
    );
  }

  return (
    <Link
      href={`/items/${id}`}
      replace
      aria-label={label}
      className={`absolute ${side} top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-espresso/70 text-lg text-on-espresso`}
    >
      {symbol}
    </Link>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`flex flex-col gap-0.5 ${wide ? "col-span-2" : ""}`}>
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  );
}

export function ClothesDetailContent({
  item,
  ownerName,
  prevId,
  nextId,
  closeTo,
  compact,
}: ClothesDetailProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = getClothesFormDictionary(language);
  const dashboardT = getDashboardDictionary(language);

  function handleClose() {
    if (closeTo === "back") router.back();
    else router.push(closeTo);
  }

  function goToEdit() {
    // モーダル（@modalスロット）内からのソフトナビゲーションだと編集ページへ正しく遷移できないため、通常のページ遷移にする
    window.location.href = `/items/${item.id}/edit`;
  }

  if (compact) {
    return (
      <>
        <div className="relative aspect-square">
          <NavArrow direction="prev" id={prevId} label={t.detail.prevAria} />

          {item.photoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.photoDataUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-sand">
              <span className="text-7xl">{getCategoryIcon(item.category)}</span>
            </div>
          )}

          <NavArrow direction="next" id={nextId} label={t.detail.nextAria} />

          <button
            type="button"
            onClick={handleClose}
            aria-label={t.detail.close}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-cream/80 text-ink shadow-lg backdrop-blur-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 text-ink">
          <div className="mb-1 flex items-start justify-between gap-4">
            <h2 className="min-w-0 flex-1 truncate font-serif text-2xl font-bold text-ink">{item.name}</h2>
            <span
              className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold ${STATUS_BADGE_CLASS[item.status]}`}
            >
              {dashboardT.statuses[item.status]}
            </span>
          </div>

          <div className="mt-1 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-sand px-4 py-1.5">
              <p className="mb-0.5 text-[10px] font-bold uppercase text-ink-faint">{t.fields.category.label}</p>
              <p className="font-bold text-ink">{item.category || "-"}</p>
            </div>
            <div className="rounded-xl bg-sand px-4 py-1.5">
              <p className="mb-0.5 text-[10px] font-bold uppercase text-ink-faint">{t.fields.size}</p>
              <p className="font-bold text-ink">{item.size}</p>
            </div>
            <div className="rounded-xl bg-sand px-4 py-1.5">
              <p className="mb-0.5 text-[10px] font-bold uppercase text-ink-faint">{t.fields.season}</p>
              <p className="font-bold text-ink">{dashboardT.seasons[item.season]}</p>
            </div>
            <div className="rounded-xl bg-sand px-4 py-1.5">
              <p className="mb-0.5 text-[10px] font-bold uppercase text-ink-faint">{t.fields.owner}</p>
              <p className="font-bold text-ink">{ownerName}</p>
            </div>
            <div className="col-span-2 rounded-xl bg-sand px-4 py-1.5">
              <p className="mb-0.5 text-[10px] font-bold uppercase text-ink-faint">{t.fields.memo}</p>
              <p className="whitespace-pre-wrap font-bold text-ink">{item.memo || "-"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={goToEdit}
            className="mt-5 w-full rounded-2xl bg-espresso py-3 text-center text-sm font-bold text-on-espresso shadow-lg shadow-espresso/20 transition-transform active:scale-[0.98]"
          >
            {t.detail.editButton}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between bg-espresso px-4">
        <h1 className="font-serif text-base font-bold text-on-espresso">{t.detail.title}</h1>
        <button
          type="button"
          onClick={handleClose}
          aria-label={t.detail.close}
          className="text-xl leading-none text-on-espresso/80 hover:text-on-espresso"
        >
          ✕
        </button>
      </header>

      <main className="flex-1 bg-cream px-4 py-4 text-ink">
        <div className="relative">
          <NavArrow direction="prev" id={prevId} label={t.detail.prevAria} />

          <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-sand">
            {item.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.photoDataUrl} alt={item.name} className="h-full w-full object-contain" />
            ) : (
              <span className="text-7xl">{getCategoryIcon(item.category)}</span>
            )}
          </div>

          <NavArrow direction="next" id={nextId} label={t.detail.nextAria} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <h2 className="font-serif text-xl font-bold text-ink">{item.name}</h2>
          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_BADGE_CLASS[item.status]}`}
          >
            {dashboardT.statuses[item.status]}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
          <Field label={t.fields.category.label} value={item.category || "-"} />
          <Field label={t.fields.size} value={item.size} />
          <Field label={t.fields.season} value={dashboardT.seasons[item.season]} />
          <Field label={t.fields.owner} value={ownerName} />
          <Field label={t.fields.memo} value={item.memo || "-"} wide />
        </dl>

        <div className="mt-6">
          <button
            type="button"
            onClick={goToEdit}
            className="block w-full rounded-md bg-espresso py-2.5 text-center text-sm font-medium text-on-espresso"
          >
            {t.detail.editButton}
          </button>
        </div>
      </main>
    </>
  );
}
