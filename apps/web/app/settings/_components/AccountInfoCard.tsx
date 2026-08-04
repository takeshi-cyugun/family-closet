"use client";

import { useSettingsLanguage } from "../_lib/LanguageContext";

type AccountInfoCardProps = {
  familyId: string;
  memberId: string;
};

export function AccountInfoCard({ familyId, memberId }: AccountInfoCardProps) {
  const { t } = useSettingsLanguage();

  return (
    <section className="rounded-lg border border-black/10 p-4 dark:border-white/15">
      <dl className="divide-y divide-black/10 text-sm dark:divide-white/10">
        <div className="flex justify-between py-2 first:pt-0 last:pb-0">
          <dt className="text-neutral-500 dark:text-neutral-400">{t.accountInfo.familyId}</dt>
          <dd className="font-medium">{familyId}</dd>
        </div>
        <div className="flex justify-between py-2 first:pt-0 last:pb-0">
          <dt className="text-neutral-500 dark:text-neutral-400">{t.accountInfo.memberId}</dt>
          <dd className="font-medium">{memberId}</dd>
        </div>
      </dl>
    </section>
  );
}
