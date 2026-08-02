"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GUEST_ITEM_LIMIT, getGuestDaysLeft, getGuestSession } from "../../_lib/session";
import { useLanguage } from "../../_lib/LanguageContext";
import { getDashboardDictionary } from "../_lib/i18n";

export function GuestTrialBanner() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const { language } = useLanguage();
  const t = getDashboardDictionary(language);

  useEffect(() => {
    const session = getGuestSession();
    if (session) setDaysLeft(getGuestDaysLeft(session));
  }, []);

  if (daysLeft === null) return null;

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
      {t.guestTrial(daysLeft, GUEST_ITEM_LIMIT)}
      <Link href="/register" className="ml-1.5 font-medium underline">
        {t.registerCta}
      </Link>
    </div>
  );
}
