"use client";

import { useSettingsLanguage } from "../_lib/LanguageContext";

type AccountInfoCardProps = {
  familyId: string;
  memberId: string;
};

export function AccountInfoCard({ familyId, memberId }: AccountInfoCardProps) {
  const { t } = useSettingsLanguage();

  return (
    <section className="rounded-lg bg-white p-4 shadow-[0_2px_8px_rgba(60,47,43,0.08)]">
      <dl className="divide-y divide-linen text-sm">
        <div className="flex justify-between py-2 first:pt-0 last:pb-0">
          <dt className="text-ink-soft">{t.accountInfo.familyId}</dt>
          <dd className="font-medium text-ink">{familyId}</dd>
        </div>
        <div className="flex justify-between py-2 first:pt-0 last:pb-0">
          <dt className="text-ink-soft">{t.accountInfo.memberId}</dt>
          <dd className="font-medium text-ink">{memberId}</dd>
        </div>
      </dl>
    </section>
  );
}
