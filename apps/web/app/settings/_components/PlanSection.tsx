"use client";

import Link from "next/link";
import { mockClothes } from "../../_lib/clothes";
import { MOCK_PLAN } from "../_data/mock";
import { useSettingsLanguage } from "../_lib/LanguageContext";

type PlanSectionProps = {
  memberCount: number;
};

export function PlanSection({ memberCount }: PlanSectionProps) {
  const { t } = useSettingsLanguage();
  const itemCount = mockClothes.length;

  return (
    <section className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <h2 className="text-sm font-semibold">{t.planSection.heading}</h2>

      <p className="mt-2 text-base font-bold">{t.planSection.planNames[MOCK_PLAN.tier]}</p>

      <dl className="mt-3 divide-y divide-black/10 text-sm dark:divide-white/10">
        <div className="flex justify-between py-2 first:pt-0">
          <dt className="text-neutral-500 dark:text-neutral-400">{t.planSection.memberCountLabel}</dt>
          <dd className="font-medium">
            {t.planSection.memberCountValue(memberCount, MOCK_PLAN.memberLimit)}
          </dd>
        </div>
        <div className="flex justify-between py-2 last:pb-0">
          <dt className="text-neutral-500 dark:text-neutral-400">{t.planSection.itemCountLabel}</dt>
          <dd className="font-medium">
            {t.planSection.itemCountValue(itemCount, MOCK_PLAN.itemLimit)}
          </dd>
        </div>
      </dl>

      {MOCK_PLAN.tier !== "paid" && (
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
