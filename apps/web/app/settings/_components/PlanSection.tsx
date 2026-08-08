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
  canUpgrade: boolean;
};

export function PlanSection({ tier, memberCount, memberLimit, itemCount, itemLimit, canUpgrade }: PlanSectionProps) {
  const { t } = useSettingsLanguage();

  return (
    <section className="rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(60,47,43,0.08)]">
      <p className="font-serif text-base font-bold text-ink">{t.planSection.planNames[tier]}</p>

      <dl className="mt-3 divide-y divide-linen text-sm">
        <div className="flex justify-between py-2 first:pt-0">
          <dt className="text-ink-soft">{t.planSection.memberCountLabel}</dt>
          <dd className="font-medium text-ink">{t.planSection.memberCountValue(memberCount, memberLimit)}</dd>
        </div>
        <div className="flex justify-between py-2 last:pb-0">
          <dt className="text-ink-soft">{t.planSection.itemCountLabel}</dt>
          <dd className="font-medium text-ink">{t.planSection.itemCountValue(itemCount, itemLimit)}</dd>
        </div>
      </dl>

      {tier !== "paid" && canUpgrade && (
        <Link
          href="/settings/billing"
          className="mt-4 block rounded-md bg-espresso py-2.5 text-center text-sm font-semibold text-on-espresso"
        >
          {t.planSection.upgradeCta}
        </Link>
      )}
    </section>
  );
}
