"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GUEST_ITEM_LIMIT } from "../../_lib/session";
import { useLanguage } from "../../_lib/LanguageContext";
import { getDashboardDictionary } from "../_lib/i18n";
import { getSettingsData } from "../../actions/settings";

export function GuestTrialBanner() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  useEffect(() => {
    getSettingsData().then((settings) => {
      if (settings?.isGuest && settings.guestDaysLeft !== null) {
        setDaysLeft(settings.guestDaysLeft);
      }
    });
  }, []);

  if (daysLeft === null) return null;

  return (
    <div className="border-b border-linen bg-sand px-4 py-2 text-center text-xs text-ink">
      {t.guestTrial(daysLeft, GUEST_ITEM_LIMIT)}
      <Link href="/register" className="ml-1.5 font-medium underline">
        {t.registerCta}
      </Link>
    </div>
  );
}
