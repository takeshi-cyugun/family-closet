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

  return (
    <Link
      href={`/clothes/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white transition-shadow hover:shadow-md dark:border-white/10 dark:bg-neutral-900"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-neutral-100 text-5xl dark:bg-neutral-800">
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
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {categoryText} ・ {ownerName} ・ {item.size}
        </p>
      </div>
    </Link>
  );
}
