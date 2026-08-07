"use client";

import Link from "next/link";
import { useSettingsLanguage } from "../_lib/LanguageContext";

type GuestBannerProps = {
  daysLeft: number;
};

export function GuestBanner({ daysLeft }: GuestBannerProps) {
  const { t } = useSettingsLanguage();

  return (
    <section className="rounded-lg bg-sand p-4 shadow-[0_2px_8px_rgba(60,47,43,0.08)]">
      <p className="text-sm font-medium text-ink">{t.guestBanner.trialNotice(daysLeft)}</p>
      <p className="mt-1 text-xs text-ink-soft">{t.guestBanner.trialDesc}</p>
      <Link
        href="/signup"
        className="mt-3 block rounded-md bg-espresso py-2.5 text-center text-sm font-semibold text-on-espresso"
      >
        {t.guestBanner.registerCta}
      </Link>
    </section>
  );
}
