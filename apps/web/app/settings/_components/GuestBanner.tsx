"use client";

import Link from "next/link";
import { useSettingsLanguage } from "../_lib/LanguageContext";

type GuestBannerProps = {
  daysLeft: number;
};

export function GuestBanner({ daysLeft }: GuestBannerProps) {
  const { t } = useSettingsLanguage();

  return (
    <section className="rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
        {t.guestBanner.trialNotice(daysLeft)}
      </p>
      <p className="mt-1 text-xs text-amber-800 dark:text-amber-300">{t.guestBanner.trialDesc}</p>
      <Link
        href="/register"
        className="mt-3 block rounded-md bg-black py-2.5 text-center text-sm font-semibold text-white dark:bg-white dark:text-black"
      >
        {t.guestBanner.registerCta}
      </Link>
    </section>
  );
}
