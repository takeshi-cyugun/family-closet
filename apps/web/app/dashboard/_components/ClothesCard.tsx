"use client";

import Link from "next/link";
import { getCategoryIcon } from "../../_lib/clothes";
import type { ClothesItem, Member } from "../../_lib/clothes";
import { useLanguage } from "../../_lib/LanguageContext";
import { getDashboardDictionary } from "../_lib/i18n";

const STATUS_BADGE_CLASS: Record<ClothesItem["status"], string> = {
  使用中: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  保管中: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  処分予定: "bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  処分済: "bg-neutral-300 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300",
};

type ClothesCardProps = {
  item: ClothesItem;
  owner: Member | undefined;
};

export function ClothesCard({ item, owner }: ClothesCardProps) {
  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  const statusText = t.statuses[item.status] ?? item.status;
  const categoryText = (t.categories as Record<string, string>)[item.category] ?? item.category;
  const ownerName = owner?.name ?? t.unknownOwner;
  const sizeText = item.size === "FREE" ? "F" : item.size;

  return (
    <Link
      href={`/clothes/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_4px_10px_rgba(60,47,43,0.14),0_1px_3px_rgba(60,47,43,0.12)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(60,47,43,0.2),0_2px_4px_rgba(60,47,43,0.14)]"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-cream text-5xl">
        {item.photoDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.photoDataUrl} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          getCategoryIcon(item.category)
        )}
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE_CLASS[item.status]}`}
        >
          {statusText}
        </span>
      </div>

      <div className="flex flex-col gap-0.5 p-2.5">
        <p className="truncate font-serif text-sm font-semibold text-ink">{item.name}</p>
        <p className="text-xs text-ink-soft">
          {categoryText} / {sizeText} / {t.seasons[item.season]} / {ownerName}
        </p>
      </div>
    </Link>
  );
}
