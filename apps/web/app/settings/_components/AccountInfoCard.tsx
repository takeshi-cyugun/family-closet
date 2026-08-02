"use client";

import { MOCK_SESSION } from "../_data/mock";
import { useSettingsLanguage } from "../_lib/LanguageContext";

export function AccountInfoCard() {
  const { t } = useSettingsLanguage();

  return (
    <section className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <dl className="divide-y divide-black/10 text-sm dark:divide-white/10">
        <div className="flex justify-between py-2 first:pt-0 last:pb-0">
          <dt className="text-neutral-500 dark:text-neutral-400">{t.accountInfo.familyId}</dt>
          <dd className="font-medium">{MOCK_SESSION.familyId}</dd>
        </div>
        <div className="flex justify-between py-2 first:pt-0 last:pb-0">
          <dt className="text-neutral-500 dark:text-neutral-400">{t.accountInfo.memberId}</dt>
          <dd className="font-medium">{MOCK_SESSION.memberId}</dd>
        </div>
      </dl>
    </section>
  );
}
