"use client";

import Link from "next/link";
import type { PlanTier } from "../_data/constants";
import { useSettingsLanguage } from "../_lib/LanguageContext";

type PlanSectionProps = {
  tier: PlanTier;
  memberCount: number;
  memberLimit: number;
  itemCount: number;
  itemLimit: number;
};

export function PlanSection({ tier, memberCount, memberLimit, itemCount, itemLimit }: PlanSectionProps) {
  const { t } = useSettingsLanguage();

  return (
    <section className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <h2 className="text-sm font-semibold">{t.planSection.heading}</h2>

      <p className="mt-2 text-base font-bold">{t.planSection.planNames[tier]}</p>

      <dl className="mt-3 divide-y divide-black/10 text-sm dark:divide-white/10">
        <div className="flex justify-between py-2 first:pt-0">
          <dt className="text-neutral-500 dark:text-neutral-400">{t.planSection.memberCountLabel}</dt>
          <dd className="font-medium">{t.planSection.memberCountValue(memberCount, memberLimit)}</dd>
        </div>
        <div className="flex justify-between py-2 last:pb-0">
          <dt className="text-neutral-500 dark:text-neutral-400">{t.planSection.itemCountLabel}</dt>
          <dd className="font-medium">{t.planSection.itemCountValue(itemCount, itemLimit)}</dd>
        </div>
      </dl>

      {tier !== "paid" && (
        <Link
          href="/settings/billing"
          className="mt-4 block rounded-md bg-black py-2.5 text-center text-sm font-semibold text-white dark:bg-white dark:text-black"
        >
          {t.planSection.upgradeCta}
        </Link>
      )}
    </section>
  );
}
